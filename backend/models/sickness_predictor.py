


import os
import random
from datetime import datetime
import json
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# -------------------- Paths -------------------- #
BASE_DIR = r"C:\Users\raksh\OneDrive\Desktop\safebite2.0\food-101\food-101"
TRAIN_DIR = os.path.join(BASE_DIR, "train_sickness")
MODEL_PATH = os.path.join(r"C:\Users\raksh\OneDrive\Desktop\safebite2.0\models", "sickness_cnn_model.h5")
SYMPTOM_FILE = os.path.join(r"C:\Users\raksh\OneDrive\Desktop\safebite2.0\backend", "symptom_medicine.json")

# -------------------- High-Risk Foods -------------------- #
HIGH_RISK_FOODS = ["pizza", "burger", "raw_shellfish", "spoiled_food"]

# -------------------- Load Symptom Data -------------------- #
if os.path.exists(SYMPTOM_FILE):
    with open(SYMPTOM_FILE, "r") as f:
        SYMPTOM_MEDICINES = json.load(f)
else:
    SYMPTOM_MEDICINES = {}

# -------------------- Sickness Prediction -------------------- #
def predict_sickness(food_name, blood_sugar=None, electrolytes=None, symptoms=None, weather=None):
    """
    Predict sickness risk based on food and optional user inputs.
    Returns a structured dictionary with risk info, remedies, and log.
    """
    food_lower = food_name.lower()
    risk_score = 0.66 if food_lower in HIGH_RISK_FOODS else 0.1
    status = "❌ High Risk" if risk_score > 0.5 else "✅ Low Risk"

    user_symptoms = symptoms if symptoms else []
    applicable_remedies = {}
    for symptom in user_symptoms:
        if symptom in SYMPTOM_MEDICINES:
            applicable_remedies[symptom] = {
                "medicines": SYMPTOM_MEDICINES[symptom].get("medicines", []),
                "home_remedies": SYMPTOM_MEDICINES[symptom].get("home_remedies", [])
            }

    log = {
        "timestamp": datetime.utcnow().isoformat(),
        "food": food_name,
        "symptoms": user_symptoms,
        "weather": weather or {"temp": None, "condition": None},
        "sickness_info": {
            "risk_score": risk_score,
            "status": status,
            "remedies": applicable_remedies
        }
    }

    return {
        "food": food_name,
        "sickness_info": {
            "risk_score": risk_score,
            "status": status,
            "remedies": applicable_remedies
        },
        "log": log
    }

# -------------------- CNN Model Loader -------------------- #
def load_model_and_labels():
    if os.path.exists(MODEL_PATH):
        print(f"✅ Loading CNN model from {MODEL_PATH}")
        model = tf.keras.models.load_model(MODEL_PATH)
        if os.path.exists(TRAIN_DIR):
            labels = sorted([d for d in os.listdir(TRAIN_DIR) if os.path.isdir(os.path.join(TRAIN_DIR, d))])
        else:
            labels = HIGH_RISK_FOODS
        return labels, model
    else:
        print(f"⚠️ CNN model not found. Using dummy predictions.")
        return HIGH_RISK_FOODS, None

# -------------------- Food Prediction -------------------- #
def predict_food(image_path, model=None, labels=None):
    if model is None or labels is None:
        food = random.choice(HIGH_RISK_FOODS)
        confidence = round(random.uniform(0.6, 0.99), 2)
        return food, confidence

    if not os.path.exists(image_path):
        print(f"⚠️ Image not found: {image_path}")
        return "image_not_found", 0.0

    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array, verbose=0)
    idx = int(np.argmax(preds[0]))
    food = labels[idx]
    confidence = float(preds[0][idx])
    return food, confidence

# -------------------- Example Usage -------------------- #
if __name__ == "__main__":
    labels, model = load_model_and_labels()
    test_food, conf = predict_food(image_path="test.jpg", model=model, labels=labels)
    print(f"Predicted food: {test_food}, Confidence: {conf}")
    result = predict_sickness(test_food, symptoms=["nausea", "headache"])
    print(result)
