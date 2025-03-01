import axios from "axios";

const ML_SERVICE_URL = "http://localhost:5001/predict"; // Flask API URL

export const predictOrderTime = async (orderData: any) => {
  try {
    const response = await axios.post(ML_SERVICE_URL, orderData);
    return response.data.predicted_time; // Extract predicted time
  } catch (error) {
    console.error("Error predicting order time:", error);
    return null; // Handle errors gracefully
  }
};
