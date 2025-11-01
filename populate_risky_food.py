from pymongo import MongoClient
from datetime import datetime, timedelta
import random

# --- Connect to your local MongoDB ---
client = MongoClient("mongodb://localhost:27017/")
db = client["safebite"]
collection = db["uploads"]

user_id = "demo_user"

# --- Sample risky foods for testing ---
foods = [
    {"food_name": "Pizza", "symptom": "nausea"},
    {"food_name": "Ice Cream", "symptom": "cold"},
    {"food_name": "Chili Paneer", "symptom": "headache"},
]

# --- Clear old test data (optional) ---
collection.delete_many({"user_id": user_id})

# --- Insert fake risky logs ---
for food in foods:
    log = {
        "user_id": user_id,
        "food_name": food["food_name"],
        "prediction": food["food_name"],
        "confidence": round(random.uniform(0.8, 0.99), 2),
        "timestamp": (datetime.utcnow() - timedelta(days=random.randint(0, 6))).isoformat(),
        "sickness_info": {
            "status": "❌ High Risk",
            "predicted_issue": food["symptom"],
            "severity": random.choice(["high", "moderate"]),
        },
    }
    collection.insert_one(log)

print(f"✅ Inserted {len(foods)} risky food logs for user '{user_id}'!")
