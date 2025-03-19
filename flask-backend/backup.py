from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# Initialize Flask app
app = Flask(__name__)

# Load the model
model = tf.keras.models.load_model("densenet201.hdf5")
print("Model loaded successfully!")

# Class indices mapping (modify according to your dataset)
class_indices = {"Bacterial Pneumonia": 0, "Corona Virus Disease": 1, "Normal": 2, "Tuberculosis": 3, "Viral Pneumonia": 4}
classes = {v: k for k, v in class_indices.items()}  # Reverse mapping

# Define route for testing
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Model API is running!"})

# Route for predictions
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get the image from request
        file = request.files["file"]
        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        
        # Preprocess the image
        img = img.resize((224, 224))  # Adjust according to model input size
        img_array = np.array(img) / 255.0  # Normalize
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        
        # Make prediction
        prediction = model.predict(img_array)[0]  # Extract first batch result
        predicted_class_idx = int(np.argmax(prediction))  # Convert NumPy int to Python int
        confidence_score = float(np.max(prediction))  # Get highest confidence score
        
        # Get class label
        predicted_class = classes[predicted_class_idx]  # Convert index to class name

        return jsonify({
            "prediction": predicted_class,
            "confidence": confidence_score
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# Run Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
