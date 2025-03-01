import joblib from "joblib";
import path from "path";

// Load the trained ML model
const modelPath = path.join(__dirname, "../ml/recipe_time_predictor.pkl");
const model = joblib.load(modelPath);

// Function to predict order preparation time
export const predictOrderTime = async (orderData: any): Promise<number> => {
  try {
    // Extract features required for prediction (modify this based on your model's input)
    const features = {
      total: orderData.total,
      numItems: orderData.cartItems.length,
      specialInstructions: orderData.specialInstructions.length,
    };

    // Predict the preparation time
    const prediction = model.predict([features])[0];
    return Math.round(prediction); // Round to nearest minute
  } catch (error) {
    console.error("Error predicting order time:", error);
    return 30; // Default time if prediction fails
  }
};
