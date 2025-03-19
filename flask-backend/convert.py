from tensorflow.keras.models import load_model

model = load_model("densenet201.hdf5", compile=False)
print("Model loaded successfully!")
