import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig";
import type { MenuItem } from "../models/menuModel";

export const getMenuByRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const db = await connectDB();
    const menuCollection = db.collection<MenuItem>("menus");

    const menuItems = await menuCollection
      .find({
        restaurantId,
      })
      .toArray();

    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};

export const searchMenuItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { query, restaurantId } = req.query;
    const db = await connectDB();
    const menuCollection = db.collection<MenuItem>("menus");

    const filter: any = { restaurantId: restaurantId as string };

    if (query) {
      filter.$or = [
        { name: { $regex: query as string, $options: "i" } },
        { description: { $regex: query as string, $options: "i" } },
        { category: { $regex: query as string, $options: "i" } },
      ];
    }

    const menuItems = await menuCollection.find(filter).toArray();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to search menu items" });
  }
};
