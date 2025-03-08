import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Order } from "../models/orderModel";
import { connectDB } from "../config/dbConfig"; // Import the connectDB utility
import { emitOrderUpdate } from "../realTimeUpdates/realtimeUpdates"; // Import the emitOrderUpdate function

// Function to place an order
export const placeOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cartItems, specialInstructions, total, tableNumber } = req.body;

    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    // Initialize the new order with status "received"
    const newOrder: Order = {
      cartItems,
      specialInstructions,
      total,
      tableNumber,
      status: "received", // Default status
    };

    // Insert the new order into MongoDB
    const result = await ordersCollection.insertOne(newOrder);

    // Return the response with _id (insertedId) instead of orderId
    res.status(201).json({
      message: "Order placed successfully",
      _id: result.insertedId, // Use _id to be consistent with MongoDB
      status: newOrder.status, // Include status in the response
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to delete an order
export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params; // Extract the order ID from the request parameters

  // Validate the ID
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid order ID" });
    return;
  }

  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    // Convert the string ID to ObjectId
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

// Function to update order status
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status is present in the request
  if (!status) {
    res.status(400).json({ message: "Status is required" });
    return;
  }

  // Validate the ID format
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid order ID format" });
    return;
  }

  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    // Convert the string ID to ObjectId
    const objectId = new ObjectId(id);

    // Log the ID to ensure it's in the correct format
    console.log("ID to update:", id);

    // Update the order status in the database
    const result = await ordersCollection.findOneAndUpdate(
      { _id: objectId }, // Find by ObjectId
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
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status", error });
  }
};
