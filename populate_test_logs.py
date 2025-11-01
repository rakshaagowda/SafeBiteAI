from pymongo import MongoClient
from datetime import datetime, timedelta
import random

# ---------------- MongoDB Setup ----------------
MONGO_URI = "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)
db = client["safebite"]
users_col = db["users"]

# ---------------- Test Data ----------------
user_id = "user123"

sample_foods = ["Pizza", "Pasta", "Ice Cream", "Salad", "Burger"]
sample_symptoms = ["stomach pain", "headache", "nausea", "fatigue"]
sample_notes = ["Felt dizzy", "Mild discomfort", "Severe pain", "No reaction"]

# Clear previous uploads for testing (optional)
# users_col.update_one({"user_id": user_id}, {"$set": {"uploads": []}}, upsert=True)

# Generate 5 sample logs
uploads = []
for i in range(5):
    log = {
        "timestamp": (datetime.utcnow() - timedelta(days=random.randint(0, 6))).isoformat(),
        "food": random.choice(sample_foods),
        "symptoms": [random.choice(sample_symptoms)],
        "notes": random.choice(sample_notes),
        "mealType": random.choice(["Breakfast", "Lunch", "Dinner"]),
        "weather": {
            "temp": round(random.uniform(20, 35), 1),
            "condition": random.choice(["Clear", "Cloudy", "Rain", "Sunny"])
        },
        "sickness_info": {"status": random.choice(["❌ High Risk", "✅ Low Risk"])},
        "allergy_alert": {"status": "✅ No allergy risk detected", "matched_allergens": []}
    }
    uploads.append(log)

# Insert into MongoDB
users_col.update_one(
    {"user_id": user_id},
    {"$push": {"uploads": {"$each": uploads}}},
    upsert=True
)

print(f"✅ Added {len(uploads)} test logs for user '{user_id}'")
