import os
import csv

# Path to the CSV file
DATA_DIR = "data"
CSV_FILE = os.path.join(DATA_DIR, "user_health_metrics.csv")

# Make sure data folder exists
os.makedirs(DATA_DIR, exist_ok=True)

# Columns you want to track
columns = [
    "date",
    "user_id",
    "food_items",
    "blood_sugar_level",
    "electrolytes",
    "symptoms",
    "sickness_prediction"
]

# Create CSV file if it doesn't exist
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=columns)
        writer.writeheader()
    print(f"✅ CSV file created at {CSV_FILE}")
else:
    print(f"ℹ️ CSV file already exists at {CSV_FILE}")
