import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; // Import the cors package
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes";
import orderRoutes from "./routes/orderRoutes"; // Import your order routes
import { connectDB } from "./config/dbConfig";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001; // You can set this to 5001 or any other port you need

// Enable CORS for all origins or restrict it to specific domains
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests only from this origin (your frontend)
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allow the necessary HTTP methods
    allowedHeaders: ["Content-Type"], // Allow Content-Type header
  })
);

app.use(bodyParser.json()); // Parse incoming JSON requests

// Use the order routes for order-related endpoints
app.use("/api/orders", orderRoutes);

app.use("/api/payment", paymentRoutes);

// Connect to the database and then start the server
const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to the database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

// Start the server and connect to the database
startServer();
