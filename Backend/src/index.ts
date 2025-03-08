const cors = require("cors");
const express = require("express");
import { createServer } from "http";
import { Server } from "socket.io";
import * as bodyParser from "body-parser";
import { connectDB } from "./config/dbConfig";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";
import menuRoutes from "./routes/menuRoutes";
import * as dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes";
import restaurantMenuRoutes from "./routes/restaurantMenuRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const httpServer = createServer(app);

// Configure CORS for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Add all client origins
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], // Include PUT method
  },
});

// Configure CORS for Express
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], // Include PUT method
    allowedHeaders: ["Content-Type"], // Allow necessary headers
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/restaurants", restaurantMenuRoutes);
//app.use(bodyParser.json());
// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Function to emit order updates via WebSocket
const emitOrderUpdate = (updatedOrder: any) => {
  io.emit("orderUpdated", updatedOrder);
};

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to the database");

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
console.log(process.env.STRIPE_SECRET_KEY);

// Export the emitOrderUpdate function for use in orderRoutes
export { emitOrderUpdate };
