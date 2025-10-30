


#srinidhis
import os
import warnings
import tensorflow as tf
import shutil
import random
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, ReduceLROnPlateau, EarlyStopping

# -------------------- Warnings & GPU Config -------------------- #
warnings.filterwarnings("ignore")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
tf.get_logger().setLevel('ERROR')

# âœ… GPU check and setup
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    print("âœ… GPU detected:", gpus)
    try:
        for gpu in gpus:
            tf.config.experimental.set_memory_growth(gpu, True)
        print("âš¡ Using Apple MPS GPU backend for training.")
    except Exception as e:
        print("âš ï¸ GPU setup error:", e)
else:
    print("âš ï¸ No GPU found. Training will use CPU.")

# -------------------- Paths -------------------- #
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
IMAGES_DIR = os.path.join(BASE_DIR, "food-101", "images")

TRAIN_DIR = os.path.join(BASE_DIR, "food101_train")
TEST_DIR = os.path.join(BASE_DIR, "food101_test")
MODEL_PATH = os.path.join(BASE_DIR, "models", "food_classifier.h5")
LABELS_FILE = os.path.join(BASE_DIR, "models", "labels.txt")

# -------------------- Parameters -------------------- #
IMG_SIZE = 224
BATCH_SIZE = 16
EPOCHS = 100
LR = 1e-4
SPLIT_RATIO = 0.8

# -------------------- Create train/test split -------------------- #
if not os.path.exists(TRAIN_DIR) or not os.path.exists(TEST_DIR):
    print("ðŸŸ¢ Creating train/test directories...")

    if os.path.exists(TRAIN_DIR):
        shutil.rmtree(TRAIN_DIR)
    if os.path.exists(TEST_DIR):
        shutil.rmtree(TEST_DIR)

    os.makedirs(TRAIN_DIR, exist_ok=True)
    os.makedirs(TEST_DIR, exist_ok=True)

    classes = [d for d in os.listdir(IMAGES_DIR) if os.path.isdir(os.path.join(IMAGES_DIR, d))]
    for class_name in classes:
        os.makedirs(os.path.join(TRAIN_DIR, class_name), exist_ok=True)
        os.makedirs(os.path.join(TEST_DIR, class_name), exist_ok=True)

        images = [f for f in os.listdir(os.path.join(IMAGES_DIR, class_name)) if f.lower().endswith(".jpg")]
        random.shuffle(images)
        split_idx = int(SPLIT_RATIO * len(images))

        for img in images[:split_idx]:
            shutil.copy(os.path.join(IMAGES_DIR, class_name, img),
                        os.path.join(TRAIN_DIR, class_name, img))
        for img in images[split_idx:]:
            shutil.copy(os.path.join(IMAGES_DIR, class_name, img),
                        os.path.join(TEST_DIR, class_name, img))

        print(f"âž¡ï¸ {class_name}: {split_idx} train, {len(images) - split_idx} test")

    print("âœ… Dataset split complete.")

# -------------------- Data Generators -------------------- #
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode="nearest"
)

test_datagen = ImageDataGenerator(rescale=1.0 / 255)

train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

test_gen = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical'
)

# -------------------- Save labels -------------------- #
os.makedirs(os.path.dirname(LABELS_FILE), exist_ok=True)
labels = list(train_gen.class_indices.keys())
with open(LABELS_FILE, "w", encoding="utf-8") as f:
    for label in labels:
        f.write(label + "\n")
print(f"âœ… Labels saved to {LABELS_FILE}")

# -------------------- Model -------------------- #
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
base_model.trainable = False

x = GlobalAveragePooling2D()(base_model.output)
x = Dropout(0.5)(x)
output = Dense(train_gen.num_classes, activation='softmax')(x)
model = Model(inputs=base_model.input, outputs=output)

model.compile(optimizer=Adam(learning_rate=LR), loss='categorical_crossentropy', metrics=['accuracy'])

# -------------------- Callbacks -------------------- #
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
checkpoint = ModelCheckpoint(MODEL_PATH, save_best_only=True, monitor='val_accuracy', mode='max')
reduce_lr = ReduceLROnPlateau(monitor='val_loss', patience=2, factor=0.3, verbose=1)
early_stop = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)

# -------------------- Train -------------------- #
print("\nðŸš€ Starting training...\n")
history = model.fit(
    train_gen,
    validation_data=test_gen,
    epochs=EPOCHS,
    callbacks=[checkpoint, reduce_lr, early_stop]
)

tf.keras.backend.clear_session()
print(f"âœ… Training completed. Model saved as '{MODEL_PATH}'")