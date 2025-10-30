
import os
import random
import json
from datetime import datetime, timedelta
import requests
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from backend.models.food_classifier import load_model_and_labels, predict_food
from backend.models.sickness_predictor import predict_sickness

# -------------------- MongoDB Setup -------------------- #
MONGO_URI = "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)
db = client["safebite"]
users_col = db["users"]
logs_collection = db["logs"]

# -------------------- FastAPI Setup -------------------- #
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = FastAPI(title="SafeBite Allergy + Health API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Load ML Model -------------------- #
model, labels = load_model_and_labels()

# -------------------- Load symptom medicines -------------------- #
SYMPTOM_FILE = os.path.join("backend", "symptom_medicine.json")
with open(SYMPTOM_FILE, "r") as f:
    SYMPTOM_MEDICINES = json.load(f)

# -------------------- Helpers -------------------- #
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image_file(user_id: str, file: UploadFile) -> str:
    user_folder = os.path.join(UPLOAD_FOLDER, user_id)
    os.makedirs(user_folder, exist_ok=True)
    filename = file.filename.replace(" ", "_")
    file_path = os.path.join(user_folder, filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return file_path

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

def get_weather(city: str = "Bangalore") -> dict:
    if not OPENWEATHER_API_KEY:
        return {
            "temp": round(random.uniform(20, 40), 1),
            "condition": random.choice(["Clear", "Cloudy", "Rain", "Sunny"])
        }
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url, timeout=5)
        data = response.json()
        if "main" in data and "weather" in data:
            return {
                "temp": round(data["main"]["temp"], 1),
                "condition": data["weather"][0]["main"]
            }
        else:
            raise ValueError("Invalid response format")
    except Exception as e:
        print(f"[Weather API Error]: {e}")
        return {
            "temp": round(random.uniform(20, 40), 1),
            "condition": random.choice(["Clear", "Cloudy", "Rain", "Sunny"])
        }

SPOONACULAR_KEY = os.getenv("SPOONACULAR_KEY", "")

def get_ingredients_from_api(food_name: str):
    if not SPOONACULAR_KEY:
        return []
    try:
        url = f"https://api.spoonacular.com/recipes/complexSearch?query={food_name}&addRecipeInformation=true&apiKey={SPOONACULAR_KEY}"
        response = requests.get(url, timeout=5)
        data = response.json()
        ingredients = []
        if data.get("results"):
            for recipe in data["results"]:
                if "extendedIngredients" in recipe:
                    for ing in recipe["extendedIngredients"]:
                        ingredients.append(ing.get("name", "").lower())
        return list(set(ingredients))
    except Exception as e:
        print(f"[Ingredient API Error]: {e}")
        return []

# -------------------- Routes -------------------- #
@app.get("/")
async def root():
    return {"message": "✅ SafeBite API running with live allergy + weather + sickness prediction!"}

@app.get("/test-db")
def test_db():
    try:
        db_names = client.list_database_names()
        return {"status": "success", "databases": db_names}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/set_allergies/")
async def set_allergies(user_id: str = Form(...), allergies: str = Form(...)):
    allergy_list = [a.strip().lower() for a in allergies.split(",")]
    users_col.update_one(
        {"user_id": user_id},
        {"$set": {"allergies": allergy_list}},
        upsert=True
    )
    return JSONResponse({"message": "✅ Allergies updated successfully.", "allergies": allergy_list})

@app.post("/upload_image/")
async def upload_image(
    user_id: str = Form(...),
    file: UploadFile = File(...),
    symptoms: str = Form(None),
    city: str = Form("Bangalore")
):
    if not allowed_file(file.filename):
        return JSONResponse({"error": "Invalid file type"}, status_code=400)

    file_path = save_image_file(user_id, file)
    food, confidence = predict_food(file_path, model, labels)

    ALLERGEN_LIST = {
        "milk": ["lactose", "cheese", "butter", "cream"],
        "nuts": ["almond", "cashew", "peanut", "hazelnut", "walnut"],
        "seafood": ["fish", "shrimp", "prawn", "crab"],
        "gluten": ["bread", "wheat", "pasta", "flour"],
        "soy": ["tofu", "soy sauce", "edamame"],
        "egg": ["omelette", "mayonnaise", "egg"]
    }

    user_data = users_col.find_one({"user_id": user_id}) or {}
    user_allergies = [a.lower() for a in user_data.get("allergies", [])]

    ingredients = get_ingredients_from_api(food)
    if not ingredients:
        LOCAL_INGREDIENT_FILE = os.path.join("backend", "food_ingredients.json")
        if os.path.exists(LOCAL_INGREDIENT_FILE):
            with open(LOCAL_INGREDIENT_FILE, "r") as f:
                FOOD_INGREDIENTS = json.load(f)
            ingredients = FOOD_INGREDIENTS.get(food.lower(), [])

    matched_allergens = []
    for allergen, related in ALLERGEN_LIST.items():
        if allergen in user_allergies:
            for i in related:
                if i.lower() in ingredients or i.lower() in food.lower():
                    matched_allergens.append(allergen)
                    break

    allergy_alert = {
        "status": "⚠️ Allergy Risk" if matched_allergens else "✅ No allergy risk detected",
        "matched_allergens": matched_allergens,
        "advice": f"Avoid this food as it may contain {', '.join(matched_allergens)}." if matched_allergens else "Safe to consume based on your allergy history."
    }

    symptom_list = [s.strip() for s in symptoms.split(",")] if symptoms else []
    sickness_result = predict_sickness(food_name=food, symptoms=symptom_list)
    weather_data = get_weather(city)

    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "user_id": user_id,
        "food": food,
        "symptoms": symptom_list,
        "weather": weather_data,
        "sickness_info": sickness_result["sickness_info"],
        "allergy_alert": allergy_alert
    }

    users_col.update_one({"user_id": user_id}, {"$push": {"uploads": log_entry}}, upsert=True)

    return JSONResponse({
        "food": food,
        "ingredients": ingredients,
        "sickness_info": sickness_result["sickness_info"],
        "weather": weather_data,
        "allergy_alert": allergy_alert,
        "log": log_entry
    })

@app.post("/report_symptom/")
async def report_symptom(user_id: str = Form(...), symptoms: str = Form(...), lookback: int = Form(5)):
    symptom_list = [s.strip() for s in symptoms.split(",")]
    users_col.update_one(
        {"user_id": user_id},
        {"$push": {"symptoms": [{"symptom": s, "timestamp": datetime.utcnow().isoformat()} for s in symptom_list]}},
        upsert=True
    )

    user_data = users_col.find_one({"user_id": user_id})
    recent_uploads = user_data.get("uploads", [])[-lookback:]

    risky_foods = []
    combined_remedies = {}

    for upload in recent_uploads:
        risk_level = upload.get("sickness_info", {}).get("status")
        if risk_level == "❌ High Risk":
            risky_foods.append(upload["food"])
            for s in symptom_list:
                if SYMPTOM_MEDICINES.get(s):
                    combined_remedies[s] = {
                        "medicines": SYMPTOM_MEDICINES[s].get("medicines", []),
                        "home_remedies": SYMPTOM_MEDICINES[s].get("home_remedies", [])
                    }

    recommendations = ["No high-risk foods detected. Maintain a balanced diet."] if not risky_foods else [
        f"Avoid {food}. Remedies: " + ", ".join(
            f"{symp}: {', '.join([m['name'] for m in meds.get('medicines', [])]) + ' | ' + ', '.join(meds.get('home_remedies', []))}"
            for symp, meds in combined_remedies.items()
        ) for food in risky_foods
    ]

    return JSONResponse({"symptoms": symptom_list, "recent_risky_foods": risky_foods, "recommendations": recommendations})

@app.get("/user_data/{user_id}")
async def get_user_data(user_id: str):
    user_data = users_col.find_one({"user_id": user_id}, {"_id": 0})
    if not user_data:
        return JSONResponse({"error": "User not found"}, status_code=404)
    return JSONResponse(user_data)

@app.post("/predict_alertness/")
async def predict_alertness(
    user_id: str = Form(...),
    sleep_hours: float = Form(...),
    meal_timing: str = Form(...),
    caffeine_intake: str = Form(...),
    current_alertness: int = Form(...),
    activity_level: str = Form(...),
    stress_level: int = Form(...),
):
    score = max(1, min(10, round((sleep_hours / 8) * 5 + (10 - stress_level) / 2)))
    recommendations = []

    if sleep_hours < 6:
        recommendations.append("Get at least 7–8 hours of sleep for optimal alertness.")
    elif sleep_hours > 9:
        recommendations.append("Too much sleep can reduce daytime alertness.")

    try:
        caffeine_num = int(caffeine_intake)
        if caffeine_num >= 2:
            recommendations.append("Limit caffeine intake, especially in the evening.")
    except:
        if "coffee" in caffeine_intake.lower() or "tea" in caffeine_intake.lower():
            recommendations.append("Limit caffeine after evening to improve sleep quality.")

    if activity_level.lower() == "low":
        recommendations.append("Try light exercise or a short walk to stay active.")
    elif activity_level.lower() == "high":
        recommendations.append("Maintain hydration during high activity levels.")

    if stress_level >= 7:
        recommendations.append("Consider relaxation techniques like deep breathing or meditation.")

    if score < 4:
        recommendations.append("You seem drowsy. Take a power nap and avoid heavy meals.")
    elif score > 8:
        recommendations.append("Excellent alertness! Keep maintaining your routine.")

    log_entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "sleep_hours": sleep_hours,
        "meal_timing": meal_timing,
        "caffeine_intake": caffeine_intake,
        "current_alertness": current_alertness,
        "activity_level": activity_level,
        "stress_level": stress_level,
        "predicted_alertness": score,
        "recommendations": recommendations,
    }

    users_col.update_one({"user_id": user_id}, {"$push": {"alertness_logs": log_entry}}, upsert=True)
    return JSONResponse(log_entry)

@app.get("/analyze_week/{user_id}")
def analyze_week(user_id: str):
    now = datetime.now()
    one_week_ago = now - timedelta(days=7)

    logs = list(logs_collection.find({
        "user_id": user_id,
        "timestamp": {"$gte": one_week_ago}
    }))

    if not logs:
        return {"message": "No logs found in the last 7 days."}

    symptom_count = {}
    food_count = {}

    for log in logs:
        symptom = log.get("symptom", "").lower()
        food = log.get("food", "").lower()
        if symptom:
            symptom_count[symptom] = symptom_count.get(symptom, 0) + 1
        if food:
            food_count[food] = food_count.get(food, 0) + 1

    symptom_count = dict(sorted(symptom_count.items(), key=lambda x: x[1], reverse=True))
    food_count = dict(sorted(food_count.items(), key=lambda x: x[1], reverse=True))

    remedy_suggestions = {
        "headache": ["Hydration", "Rest", "Paracetamol"],
        "stomach pain": ["Peppermint tea", "Ginger", "Avoid spicy foods"],
        "nausea": ["Ginger tea", "Stay hydrated"],
        "fatigue": ["Balanced diet", "Adequate sleep"]
    }

    remedies = {
        symptom: remedy_suggestions.get(symptom, ["Consult a healthcare provider"])
        for symptom in symptom_count
    }

    return {
        "message": "Weekly analysis complete.",
        "top_symptoms": symptom_count,
        "risky_foods": food_count,
        "remedies": remedies
    }

@app.get('/predict-cause/latest/{user_id}')
def get_latest_prediction(user_id: str):
    user_data = users_col.find_one({'user_id': user_id}, {'_id': 0, 'uploads': 1}) or {}
    uploads = user_data.get('uploads', [])
    if not uploads:
        return JSONResponse({'message': 'No uploads found for user', 'latest': None})
    latest = uploads[-1]
    return JSONResponse({'latest': latest})
