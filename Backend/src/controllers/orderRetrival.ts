import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig"; // Import the connectDB utility

// Function to retrieve all orders
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");
    
    // Retrieve all orders from MongoDB
    const orders = await ordersCollection.find().toArray();

    // Return the orders in the response
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};