import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Order } from "../models/orderModel";
import { connectDB } from "../config/dbConfig"; // Import the connectDB utility
import { predictOrderTime } from "../ml/orderTimePredictor";

// Function to place an order
export const placeOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cartItems, specialInstructions, total, tableNumber } = req.body;

    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const estimatedTime = await predictOrderTime({
      cartItems,
      specialInstructions,
      total,
    });

    const newOrder: Order = {
      cartItems,
      specialInstructions,
      total,
      tableNumber,
      estimatedTime,
    };

    // Insert into MongoDB
    const result = await ordersCollection.insertOne(newOrder);

    res.status(201).json({
      message: "Order placed successfully",
      orderId: result.insertedId,
      estimatedTime, // Send estimated time in response
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// New function to get all orders
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
