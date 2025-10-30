


# backend/train/train_sickness_predictor.py
import os
import random
import shutil
import warnings
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau, EarlyStopping

# -------------------- Suppress Warnings -------------------- #
warnings.filterwarnings("ignore")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
tf.get_logger().setLevel('ERROR')

# -------------------- Paths -------------------- #
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
IMAGES_DIR = os.path.join(BASE_DIR, "food-101", "images")
TRAIN_DIR = os.path.join(BASE_DIR, "backend", "train_sickness")
TEST_DIR = os.path.join(BASE_DIR, "backend", "test_sickness")
MODELS_DIR = os.path.join(BASE_DIR, "backend", "models")
MODEL_PATH = os.path.join(MODELS_DIR, "sickness_cnn_model.h5")
LABELS_PATH = os.path.join(MODELS_DIR, "sickness_labels.txt")

os.makedirs(TRAIN_DIR, exist_ok=True)
os.makedirs(TEST_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

# -------------------- Parameters -------------------- #
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 50  # Adjust for quick testing if needed
LR = 1e-4
SPLIT_RATIO = 0.8

# -------------------- Seed -------------------- #
random.seed(42)
tf.random.set_seed(42)

# -------------------- Prepare Dataset -------------------- #
# Clear previous train/test directories
if os.path.exists(TRAIN_DIR):
    shutil.rmtree(TRAIN_DIR)
if os.path.exists(TEST_DIR):
    shutil.rmtree(TEST_DIR)
os.makedirs(TRAIN_DIR)
os.makedirs(TEST_DIR)

categories = [d for d in os.listdir(IMAGES_DIR) if os.path.isdir(os.path.join(IMAGES_DIR, d))]
if not categories:
    print(f"⚠️ No categories found in {IMAGES_DIR}. Exiting.")
    exit()
print("Found categories:", categories)

# Split images into train/test
for category in categories:
    os.makedirs(os.path.join(TRAIN_DIR, category), exist_ok=True)
    os.makedirs(os.path.join(TEST_DIR, category), exist_ok=True)

    imgs = [f for f in os.listdir(os.path.join(IMAGES_DIR, category))
            if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    random.shuffle(imgs)
    split_idx = int(SPLIT_RATIO * len(imgs))

    for img in imgs[:split_idx]:
        shutil.copy(os.path.join(IMAGES_DIR, category, img),
                    os.path.join(TRAIN_DIR, category, img))
    for img in imgs[split_idx:]:
        shutil.copy(os.path.join(IMAGES_DIR, category, img),
                    os.path.join(TEST_DIR, category, img))

print("✅ Train/test folders created.")

# -------------------- Save Labels -------------------- #
with open(LABELS_PATH, "w", encoding="utf-8") as f:
    for label in sorted(categories):
        f.write(label + "\n")
print(f"✅ Saved labels at '{LABELS_PATH}'")

# -------------------- Data Generators -------------------- #
train_gen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
).flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

test_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(
    TEST_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

# -------------------- Build Model -------------------- #
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
base_model.trainable = False

x = GlobalAveragePooling2D()(base_model.output)
x = Dropout(0.5)(x)
output = Dense(train_gen.num_classes, activation='softmax')(x)
model = Model(inputs=base_model.input, outputs=output)

model.compile(optimizer=Adam(LR), loss='categorical_crossentropy', metrics=['accuracy'])
print("✅ Model compiled successfully. Number of classes:", train_gen.num_classes)

# -------------------- Callbacks -------------------- #
checkpoint = ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor='val_accuracy', mode='max')
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.3, patience=3, verbose=1)
early_stop = EarlyStopping(monitor='val_loss', patience=7, restore_best_weights=True)

# -------------------- Train -------------------- #
history = model.fit(
    train_gen,
    validation_data=test_gen,
    epochs=EPOCHS,
    callbacks=[checkpoint, reduce_lr, early_stop]
)

tf.keras.backend.clear_session()
print(f"✅ Training completed. Model saved at '{MODEL_PATH}'")
