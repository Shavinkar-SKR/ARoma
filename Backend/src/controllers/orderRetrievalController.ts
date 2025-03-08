import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig"; // Import the connectDB utility
import { ObjectId } from 'mongodb'; // Add this import
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
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  if (!ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid order ID format" })
    return
  }

  try {
    const db = await connectDB()
    const ordersCollection = db.collection("orders")
    const objectId = new ObjectId(id)
    const order = await ordersCollection.findOne({ _id: objectId })

    if (!order) {
      res.status(404).json({ message: "Order not found" })
      return
    }

    res.status(200).json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({ message: "Failed to fetch order", error })
  }
}
