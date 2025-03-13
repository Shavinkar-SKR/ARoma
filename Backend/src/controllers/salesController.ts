import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig";
import { Sale } from "../models/Sales";

// Get sales analytics
export const getSalesAnalytics = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const sales = await db.collection<Sale>("sales").find().toArray();

    // Calculate analytics
    const totalOrders = sales.length;
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const averageSale = totalOrders > 0 ? totalSales / totalOrders : 0;

    res.json({
      totalOrders,
      totalSales,
      averageSale,
      sales,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales analytics" });
  }
};