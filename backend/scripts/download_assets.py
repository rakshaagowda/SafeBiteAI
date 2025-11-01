import os, gdown, zipfile

os.makedirs("food-101", exist_ok=True)
data_zip = "food-101.zip"

if not os.path.exists(data_zip):
    print("Downloading Food-101 dataset...")
    gdown.download("https://drive.google.com/uc?id=YOUR_DATASET_ID", data_zip, quiet=False)

    print("Extracting dataset...")
    with zipfile.ZipFile(data_zip, 'r') as zip_ref:
        zip_ref.extractall(".")  # extracts into SAFEBITE2.0/food-101
else:
    print("Food-101 dataset already present.")
