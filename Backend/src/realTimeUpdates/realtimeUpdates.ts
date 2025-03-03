import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { Order } from "..//models/orderModel"; // Import your Order type

// Initialize WebSocket server
let io: Server;

// Function to initialize WebSocket
export const initializeWebSocket = (httpServer: HttpServer): void => {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"], // Add all client origins
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], // Include PUT method
    },
  });

  // WebSocket connection handler
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

// Function to emit order updates via WebSocket
export const emitOrderUpdate = (updatedOrder: Order): void => {
  if (io) {
    io.emit("orderUpdated", updatedOrder);
  } else {
    console.error("WebSocket server not initialized");
  }
};