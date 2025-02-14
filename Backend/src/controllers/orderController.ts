import { Request, Response } from "express";  // Importing types for Express Request and Response
import { connectDB } from "../config/dbConfig";  // Importing the database connection function
import { Order } from "../models/orderModel";  // Importing the Order model (data structure)

export const placeOrder = async (req: Request, res: Response) => {  // Asynchronous function to handle placing an order
  // Extracting order details from the incoming request body
  const { cartItems, specialInstructions, total } = req.body;

  // Creating an order object with the received data
  const order: Order = {
    cartItems,  // Items added to the cart (
    specialInstructions,  // Any special instructions 
    total,  // Total price of the order
    status: "Pending",  // Initially setting the order status to "Pending"
  };

  try {
    // Trying to connect to the database and insert the order
    const db = await connectDB();  // Connect to the MongoDB database
    const ordersCollection = db.collection("orders");  // Access the "orders" collection in the database

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
