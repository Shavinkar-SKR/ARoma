"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitOrderUpdate = exports.initializeWebSocket = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const socket_io_1 = require("socket.io");
// Create the schema for the Order
const orderSchema = new mongoose_1.Schema({
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
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
// WebSocket server initialization
let io;
// Function to initialize WebSocket
const initializeWebSocket = (httpServer) => {
  io = new socket_io_1.Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"], // Add all client origins
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], // Include PUT method
    },
  });
  // WebSocket connection handler
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    // Handle joining a room for a specific order ID
    socket.on("joinOrderRoom", (orderId) => {
      socket.join(orderId); // Join the room for this order ID
      console.log(`Client ${socket.id} joined room for order ${orderId}`);
    });
    // Handle leaving a room for a specific order ID
    socket.on("leaveOrderRoom", (orderId) => {
      socket.leave(orderId); // Leave the room for this order ID
      console.log(`Client ${socket.id} left room for order ${orderId}`);
    });
    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
exports.initializeWebSocket = initializeWebSocket;
// Type guard to check if the order has a defined _id
function isOrderWithId(order) {
  return order._id !== undefined;
}
// Function to emit order updates via WebSocket
const emitOrderUpdate = (updatedOrder) => {
  if (io && isOrderWithId(updatedOrder)) {
    // Ensure _id is defined
    // Emit the update only to the room for this specific order ID
    io.to(updatedOrder._id.toString()).emit("orderUpdated", updatedOrder);
    console.log(`Emitted order update to room: ${updatedOrder._id}`);
  } else {
    console.error("WebSocket server not initialized or _id is undefined");
  }
};
exports.emitOrderUpdate = emitOrderUpdate;
