import mongoose, { Document, Schema } from "mongoose";
import { ObjectId } from "mongodb";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";

// Define the Order interface with optional _id
export interface Order {
  _id?: ObjectId;
  cartItems: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  specialInstructions: string;
  total: number;
  tableNumber: string;
  status?: "received" | "preparing" | "ready" | "complete"; // Optional status field
}

// Create the schema for the Order
const orderSchema = new Schema<Order & Document>({
  cartItems: [
    {
      id: Number,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  specialInstructions: String,
  total: Number,
  tableNumber: String,
  status: {
    type: String,
    enum: ["received", "preparing", "ready", "complete"],
    default: "received",
  },
});

const Order = mongoose.model<Order & Document>("Order", orderSchema);

export default Order;

// WebSocket server initialization
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

    // Handle joining a room for a specific order ID
    socket.on("joinOrderRoom", (orderId: string) => {
      socket.join(orderId); // Join the room for this order ID
      console.log(`Client ${socket.id} joined room for order ${orderId}`);
    });

    // Handle leaving a room for a specific order ID
    socket.on("leaveOrderRoom", (orderId: string) => {
      socket.leave(orderId); // Leave the room for this order ID
      console.log(`Client ${socket.id} left room for order ${orderId}`);
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

// Type guard to check if the order has a defined _id
function isOrderWithId(order: Order): order is Order & { _id: ObjectId } {
  return order._id !== undefined;
}

// Function to emit order updates via WebSocket
export const emitOrderUpdate = (updatedOrder: Order): void => {
  if (io && isOrderWithId(updatedOrder)) {  // Ensure _id is defined
    // Emit the update only to the room for this specific order ID
    io.to(updatedOrder._id.toString()).emit("orderUpdated", updatedOrder);
    console.log(`Emitted order update to room: ${updatedOrder._id}`);
  } else {
    console.error("WebSocket server not initialized or _id is undefined");
  }
};
