import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig";
import { Order } from "../models/orderModel";

export const placeOrder = async (req: Request, res: Response) => {
  const { cartItems, specialInstructions, total } = req.body;

  const order: Order = {
    cartItems,
    specialInstructions,
    total,
    status: "Pending", // Initial status
  };

  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const result = await ordersCollection.insertOne(order);
    res.status(201).json({ message: "Order placed and saved successfully", orderId: result.insertedId });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Failed to place order", error: error.message });
    } else {
      res.status(500).json({ message: "Failed to place order", error: "Unknown error" });
    }
  }
};
