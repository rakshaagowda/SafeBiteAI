
#compatable with mongoDB
# backend/models/food_classifier.py
# backend/models/food_classifier.py

# backend/models/food_classifier.py
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import load_img, img_to_array

# -------------------- Paths -------------------- #
BASE_DIR = os.path.dirname(__file__)  # backend/models
MODEL_PATH = os.path.join(BASE_DIR, "food_classifier.h5")  # trained Keras model
LABELS_FILE = os.path.join(BASE_DIR, "labels.txt")         # optional labels.txt

# -------------------- Load Model and Labels -------------------- #
def load_model_and_labels(model_path=MODEL_PATH, labels_file=LABELS_FILE):
    """
    Load a Keras model and optional labels.txt file.
    Returns: (model, labels)
    """
    if not os.path.exists(model_path):
        print(f"❌ Model not found: {model_path}")
        return None, None

    print(f"✅ Loading model from {model_path}")
    model = load_model(model_path)

    labels = None
    if os.path.exists(labels_file):
        with open(labels_file, "r", encoding="utf-8") as f:
            labels = [line.strip() for line in f if line.strip()]
        print(f"✅ Loaded {len(labels)} labels from {labels_file}")
    else:
        print("⚠️ No labels.txt found, numeric classes will be used")

    return model, labels

# -------------------- Predict Function -------------------- #
def predict_food(image_path, model, labels=None, target_size=(224, 224)):
    """
    Predict food class and confidence for a given image path.
    Returns: (label, confidence)
    """
    if model is None:
        return "unknown_food", 0.0
    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_path}")
        return "image_not_found", 0.0

    # Load and preprocess image
    img = load_img(image_path, target_size=target_size)
    x = img_to_array(img) / 255.0
    x = np.expand_dims(x, axis=0)

    # Predict
    preds = model.predict(x, verbose=0)[0]
    idx = int(np.argmax(preds))
    conf = float(preds[idx])

    if labels and idx < len(labels):
        return labels[idx], conf
    return f"class_{idx}", conf

# -------------------- Example Usage -------------------- #
if __name__ == "__main__":
    model, labels = load_model_and_labels()
    test_image_name = "pizza.jpg"  # replace with a valid image
    test_image = os.path.join(BASE_DIR, test_image_name)

    if os.path.exists(test_image):
        food, confidence = predict_food(test_image, model, labels)
        print(f"🍽️ Predicted: {food} (Confidence: {confidence:.2f})")
    else:
        print(f"⚠️ Image not found: {test_image}")
