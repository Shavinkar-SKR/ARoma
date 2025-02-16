import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes";
import orderRoutes from "./routes/orderRoutes"; // Import your order routes
import { connectDB } from "./config/dbConfig";

const express = require("express");
const cors = require("cors");
dotenv.config(); // Load environment variables from a .env file
const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());

app.use("/api/orders", orderRoutes);
app.use("/api" ,orderRoutes)

const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to the database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
