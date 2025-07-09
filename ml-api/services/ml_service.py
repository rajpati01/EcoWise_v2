import os
import numpy as np
from PIL import Image
from keras.models import load_model

# Load the trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "..", "model", "models", "waste_classifier.h5")
print("Loading model from:", MODEL_PATH)
model = load_model(MODEL_PATH)

model = load_model(MODEL_PATH)
CLASS_NAMES = ['battery', 'biological', 'cardboard', 'clothes', 'glass', 'metal', 'paper', 'plastic', 'shoes', 'trash']

def predict_image(image_path):
    image = Image.open(image_path).convert("RGB").resize((150, 150))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    confidence = float(np.max(predictions)) * 100
    predicted_class = CLASS_NAMES[np.argmax(predictions)]

    return predicted_class, confidence
