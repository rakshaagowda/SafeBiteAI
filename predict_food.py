from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

# --- 1. Load the trained model ---
model = load_model("food_classifier.h5")

# --- 2. Load and preprocess the image ---
img_path = "pizza.jpg"  # change this to any image you want to predict
img = image.load_img(img_path, target_size=(224, 224))  # adjust size if needed
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x /= 255.0  # normalize if the model was trained this way

# --- 3. Make prediction ---
pred = model.predict(x)

# --- 4. Map prediction to class name ---
# Food-101 class names (must match the order your model was trained on)
classes = [
    "apple_pie","baby_back_ribs","baklava","beef_carpaccio","beef_tartare",
    "beet_salad","beignets","bibimbap","bread_pudding","breakfast_burrito",
    "bruschetta","caesar_salad","cannoli","caprese_salad","carrot_cake",
    "ceviche","cheesecake","cheese_plate","chicken_curry","chicken_quesadilla",
    "chicken_wings","chocolate_cake","chocolate_mousse","churros","clam_chowder",
    "club_sandwich","crab_cakes","creme_brulee","croque_madame","cup_cakes",
    "deviled_eggs","donuts","dumplings","edamame","eggs_benedict","escargots",
    "falafel","filet_mignon","fish_and_chips","foie_gras","french_fries",
    "french_onion_soup","french_toast","fried_calamari","fried_rice","frozen_yogurt",
    "garlic_bread","gnocchi","greek_salad","grilled_cheese_sandwich","grilled_salmon",
    "guacamole","gyoza","hamburger","hot_and_sour_soup","hot_dog","huevos_rancheros",
    "hummus","ice_cream","lasagna","lobster_bisque","lobster_roll_sandwich",
    "macaroni_and_cheese","macarons","miso_soup","mussels","nachos","omelette",
    "onion_rings","oysters","pad_thai","paella","pancakes","panna_cotta","peking_duck",
    "pho","pizza","pork_chop","poutine","prime_rib","pulled_pork_sandwich","ramen",
    "ravioli","red_velvet_cake","risotto","samosa","sashimi","scallops","seaweed_salad",
    "shrimp_and_grits","spaghetti_bolognese","spaghetti_carbonara","spring_rolls",
    "steak","strawberry_shortcake","sushi","tacos","takoyaki","tiramisu","tuna_tartare",
    "waffles"
]

pred_class = classes[np.argmax(pred)]
print("Predicted class:", pred_class)
