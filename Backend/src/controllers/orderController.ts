import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Order } from "../models/orderModel";
import { connectDB } from "../config/dbConfig"; // Import the connectDB utility
import { emitOrderUpdate } from "../realTimeUpdates/realtimeUpdates" // Import the emitOrderUpdate function

// Function to place an order
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cartItems, specialInstructions, total, tableNumber } = req.body;

    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const newOrder: Order = {
      cartItems,
      specialInstructions,
      total,
      tableNumber,
      
    };

    // Insert into MongoDB
    const result = await ordersCollection.insertOne(newOrder);

    res.status(201).json({
      message: "Order placed successfully",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // Extract the order ID from the request parameters

  // Validate the ID
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid order ID" });
    return;
  }

  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    // Convert the string ID to an ObjectId
    const objectId = new ObjectId(id);

    // Delete the order from the database
    const result = await ordersCollection.deleteOne({ _id: objectId });

    // Check if the order was found and deleted
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    // Respond with a success message
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order", error });
  }
};
// Function to get all orders
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const orders = await ordersCollection.find().toArray();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ message: "Status is required" });
    return; // Use return to exit the function
  }

  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    // Update the order status in the database
    const result = await ordersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) }, // Convert string ID to ObjectId
      { $set: { status } }, // Set the new status
      { returnDocument: "after" } // Return the updated document
    );

    if (!result || !result.value) {
      // If result is null or result.value is null, return 404
      res.status(404).json({ message: "Order not found" });
      return; // Use return to exit the function
    }

    // Emit the updated order to all connected clients
    emitOrderUpdate(result.value);

    res.status(200).json(result.value); // No return statement here
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status", error });
  }
};

// Function to update order status
// Function to update order status
// Function to update order status

