# backend/data_logger.py
import os
import csv
from datetime import datetime

# -------------------- CSV File Setup -------------------- #
CSV_FILE = "backend/data/user_health_metrics.csv"

# Ensure folder exists
os.makedirs(os.path.dirname(CSV_FILE), exist_ok=True)

# If CSV does not exist, create it with headers
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            "timestamp",        # When entry was logged
            "food_image",       # Image filename of the food
            "blood_sugar",      # Blood sugar level
            "electrolytes",     # Electrolyte levels
            "age",              # User age
            "weight",           # User weight
            "nausea",           # 0/1 for symptom presence
            "vomiting",         # 0/1
            "stomach_pain",     # 0/1
            "label"             # Optional: "sick"/"healthy" or other categories
        ])
    print(f"✅ CSV file created at '{CSV_FILE}'")

# -------------------- Logging Function -------------------- #
def log_user_data(food_image: str, blood_sugar: float, electrolytes: float,
                  age: int, weight: float, nausea: int = 0,
                  vomiting: int = 0, stomach_pain: int = 0,
                  label: str = ""):
    """
    Append a new user health entry to the CSV.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    with open(CSV_FILE, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            timestamp, food_image, blood_sugar, electrolytes,
            age, weight, nausea, vomiting, stomach_pain, label
        ])
    print(f"✅ Logged data for {food_image} at {timestamp}")

# -------------------- Example Usage -------------------- #
if __name__ == "__main__":
    # Test logging function
    log_user_data(
        food_image="burger_001.jpg",
        blood_sugar=120.5,
        electrolytes=3.5,
        age=25,
        weight=70,
        nausea=0,
        vomiting=0,
        stomach_pain=1,
        label="sick"
    )
