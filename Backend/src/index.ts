import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/dbConfig";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(bodyParser.json());

app.use("/api/orders", orderRoutes);
app.use("/api/carts", cartRoutes);

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
