"use strict";
exports.__esModule = true;
exports.emitOrderUpdate = exports.initializeWebSocket = void 0;
var mongoose_1 = require("mongoose");
var socket_io_1 = require("socket.io");
// Create the schema for the Order
var orderSchema = new mongoose_1.Schema({
    cartItems: [
        {
            id: Number,
            name: String,
            price: Number,
            quantity: Number,
            image: String
        },
    ],
    specialInstructions: String,
    total: Number,
    tableNumber: String,
    status: {
        type: String,
        "enum": ["received", "preparing", "ready", "complete"],
        "default": "received"
    }
});
var Order = mongoose_1["default"].model("Order", orderSchema);
exports["default"] = Order;
// WebSocket server initialization
var io;
// Function to initialize WebSocket
exports.initializeWebSocket = function (httpServer) {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:3000"],
            methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
        }
    });
    // WebSocket connection handler
    io.on("connection", function (socket) {
        console.log("Client connected:", socket.id);
        // Handle joining a room for a specific order ID
        socket.on("joinOrderRoom", function (orderId) {
            socket.join(orderId); // Join the room for this order ID
            console.log("Client " + socket.id + " joined room for order " + orderId);
        });
        // Handle leaving a room for a specific order ID
        socket.on("leaveOrderRoom", function (orderId) {
            socket.leave(orderId); // Leave the room for this order ID
            console.log("Client " + socket.id + " left room for order " + orderId);
        });
        // Handle client disconnect
        socket.on("disconnect", function () {
            console.log("Client disconnected:", socket.id);
        });
    });
};
// Type guard to check if the order has a defined _id
function isOrderWithId(order) {
    return order._id !== undefined;
}
// Function to emit order updates via WebSocket
exports.emitOrderUpdate = function (updatedOrder) {
    if (io && isOrderWithId(updatedOrder)) { // Ensure _id is defined
        // Emit the update only to the room for this specific order ID
        io.to(updatedOrder._id.toString()).emit("orderUpdated", updatedOrder);
        console.log("Emitted order update to room: " + updatedOrder._id);
    }
    else {
        console.error("WebSocket server not initialized or _id is undefined");
    }
};
