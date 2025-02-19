import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import { connectDB } from "./config/dbConfig";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";
import menuRoutes from "./routes/menuRoutes";

const app = express();
const PORT = process.env.PORT || 5001;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Add all client origins
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());

app.use("/api/orders", orderRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menus", menuRoutes);

// WebSocket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Add to your order routes when updating status
const emitOrderUpdate = (updatedOrder: any) => {
  io.emit("orderUpdated", updatedOrder);
};

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

export { emitOrderUpdate }; // Export this to use in your orderRoutes
