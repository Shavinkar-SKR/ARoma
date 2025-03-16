"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrders = exports.deleteOrder = exports.placeOrder = void 0;
const mongodb_1 = require("mongodb");
const dbConfig_1 = require("../config/dbConfig"); // Import the connectDB utility
// Function to place an order
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartItems, specialInstructions, total, tableNumber } = req.body;
        const db = yield (0, dbConfig_1.connectDB)();
        const ordersCollection = db.collection("orders");
        // Initialize the new order with status "received"
        const newOrder = {
            cartItems,
            specialInstructions,
            total,
            tableNumber,
            status: "received", // Default status
        };
        // Insert the new order into MongoDB
        const result = yield ordersCollection.insertOne(newOrder);
        // Return the response with _id (insertedId) instead of orderId
        res.status(201).json({
            message: "Order placed successfully",
            _id: result.insertedId, // Use _id to be consistent with MongoDB
            status: newOrder.status, // Include status in the response
        });
    }
    catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.placeOrder = placeOrder;
// Function to delete an order
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Extract the order ID from the request parameters
    // Validate the ID
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid order ID" });
        return;
    }
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const ordersCollection = db.collection("orders");
        // Convert the string ID to ObjectId
        const objectId = new mongodb_1.ObjectId(id);
        // Delete the order from the database
        const result = yield ordersCollection.deleteOne({ _id: objectId });
        // Check if the order was found and deleted
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        // Respond with a success message
        res.status(200).json({ message: "Order deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Failed to delete order", error });
    }
});
exports.deleteOrder = deleteOrder;
// Function to get all orders
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const ordersCollection = db.collection("orders");
        const orders = yield ordersCollection.find().toArray();
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getOrders = getOrders;
// Function to update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    // Validate status is present in the request
    if (!status) {
        res.status(400).json({ message: "Status is required" });
        return;
    }
    // Validate the ID format
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid order ID format" });
        return;
    }
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const ordersCollection = db.collection("orders");
        // Convert the string ID to ObjectId
        const objectId = new mongodb_1.ObjectId(id);
        // Log the ID to ensure it's in the correct format
        console.log("ID to update:", id);
        // Update the order status in the database
        const result = yield ordersCollection.findOneAndUpdate({ _id: objectId }, // Find by ObjectId
        { $set: { status } }, // Set the new status
        { returnDocument: "after" } // Return the updated document after the update
        );
        // Log the result of the update operation
        console.log("Update result:", result);
        // Check if result is null or doesn't have a value
        if (!result || !result.value) {
            // If no order was found or updated, return 404
            res.status(404).json({ message: "Order not found" });
            return;
        }
        // Emit the updated order to all connected clients (real-time update)
        //emitOrderUpdate(result.value);
        // Respond with the updated order
        res.status(200).json(result.value);
    }
    catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Failed to update order status", error });
    }
});
exports.updateOrderStatus = updateOrderStatus;
