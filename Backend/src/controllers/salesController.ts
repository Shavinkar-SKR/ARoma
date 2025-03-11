import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig";
import { Sales } from "../models/Sales";

export const getSalesData = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const sales = await db.collection<Sales>("sales").find().toArray();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
};