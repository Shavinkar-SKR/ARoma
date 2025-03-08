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
    print("Request received at /predict")  # Add this line
    data = request.json  # Get JSON data from request
    print("Received Input Data:", data)

    try:
        # Extract cart items from the request
        cart_items = data.get("cartItems", [])

        # Prepare input data for the model
        input_data = []
        for item in cart_items:
            input_data.append({
                "name": item["name"],
                "quantity": item["quantity"]
            })

        # Convert input data to DataFrame
        features = pd.DataFrame(input_data)

        # Ensure features match the model's expected input format
        prediction = model.predict(features)

        # Sum the predicted times for all items in the order
        total_time = float(prediction.sum())  # Convert to standard Python float

        return jsonify({"predicted_time": round(total_time, 2)})
    except Exception as e:
        print("Error during prediction:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)  # Run on port 5001
