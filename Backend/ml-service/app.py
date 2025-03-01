from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from Node.js backend

# Load the trained model
model = joblib.load("model/recipe_time_predictor.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json  # Get JSON data from request
    print("Received Input Data:", data)

    # Extract relevant fields from the request (assuming input format)
    features = pd.DataFrame([data])  # Convert input to DataFrame
    
    # Ensure features match the model's expected input format
    prediction = model.predict(features)[0]

     # **Convert to standard Python float**
    prediction = float(prediction)  # Convert `np.float32` → `float`
    
    return jsonify({"predicted_time": round(prediction, 2)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)  # Run on port 5001
