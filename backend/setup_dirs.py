import os

# Folders to create
folders = [
    "uploads/food_images",
    "uploads/medical_reports",
    "data"
]

for folder in folders:
    os.makedirs(folder, exist_ok=True)
    print(f"✅ Created folder: {folder}")
