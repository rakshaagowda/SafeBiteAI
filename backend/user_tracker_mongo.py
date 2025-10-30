import os
import shutil
from datetime import datetime, timedelta
from pymongo import MongoClient
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np

# -------------------- MongoDB Connection -------------------- #
MONGO_URI = "mongodb://localhost:27017"  # change for cloud: mongodb+srv://<user>:<pass>@cluster.mongodb.net/
client = MongoClient(MONGO_URI)
db = client["safebite_db"]
users_col = db["users"]

# -------------------- Paths -------------------- #
BASE_DIR = os.path.dirname(__file__)
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
MODEL_PATH = os.path.join(BASE_DIR, "models", "sickness_cnn_model.keras")
LABELS_FILE = os.path.join(BASE_DIR, "models", "labels.txt")
IMG_SIZE = 224

# -------------------- Load Model -------------------- #
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")
model = load_model(MODEL_PATH)

# -------------------- Load Labels -------------------- #
if os.path.exists(LABELS_FILE):
    with open(LABELS_FILE, "r") as f:
        labels = [line.strip() for line in f.readlines()]
else:
    labels = [f"class_{i}" for i in range(model.output_shape[-1])]

# -------------------- Helper Functions -------------------- #
def predict_food(image_path):
    img = load_img(image_path, target_size=(IMG_SIZE, IMG_SIZE))
    x = img_to_array(img) / 255.0
    x = np.expand_dims(x, axis=0)
    preds = model.predict(x, verbose=0)[0]
    idx = np.argmax(preds)
    return labels[idx], float(preds[idx])

def upload_image(user_id, image_path):
    """Store image in filesystem and update MongoDB"""
    timestamp = datetime.now().isoformat()
    user_folder = os.path.join(UPLOADS_DIR, user_id)
    os.makedirs(user_folder, exist_ok=True)

    filename = f"{timestamp.replace(':','-')}_{os.path.basename(image_path)}"
    dest_path = os.path.join(user_folder, filename)
    shutil.copy(image_path, dest_path)

    food, confidence = predict_food(dest_path)

    users_col.update_one(
        {"_id": user_id},
        {"$push": {"images": {
            "timestamp": timestamp,
            "path": dest_path,
            "food_predicted": food,
            "confidence": confidence
        }}},
        upsert=True
    )

    print(f"📸 Image uploaded for user {user_id}: {food} (Confidence: {confidence:.2f})")

def report_symptom(user_id, symptom):
    """Log symptom and generate risky food report"""
    symptom_time = datetime.now()
    users_col.update_one(
        {"_id": user_id},
        {"$push": {"symptoms": {"timestamp": symptom_time.isoformat(), "symptom": symptom}}},
        upsert=True
    )

    # Look back 24 hours
    user = users_col.find_one({"_id": user_id})
    foods = []
    if user and "images" in user:
        for img in user["images"]:
            img_time = datetime.fromisoformat(img["timestamp"])
            if symptom_time - timedelta(hours=24) <= img_time <= symptom_time:
                foods.append(img["food_predicted"])

    risk_foods = ["raw_shellfish", "spoiled_food", "undercooked_meat", "expired_milk"]
    safe_foods = ["boiled rice", "soups", "fruits"]
    medicines = ["oral rehydration solution", "antacids"]

    risky = [f for f in foods if f in risk_foods]
    recommendations = {
        "foods_to_avoid": risky,
        "foods_to_consume": safe_foods,
        "medicines": medicines
    }

    print(f"⚠️ Symptom reported: {symptom}")
    print(f"Foods eaten in last 24h: {foods}")
    print(f"Risky foods: {risky}")
    print(f"Recommendations: {recommendations}")
    return recommendations

# -------------------- Example Usage -------------------- #
if __name__ == "__main__":
    user = "user_123"
    # upload_image(user, "test_images/pizza.jpg")
    # upload_image(user, "test_images/idli.jpg")
    # report_symptom(user, "stomach ache")
