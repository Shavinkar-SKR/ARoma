import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig";
import type { Restaurant } from "../models/restaurantModel";

export const getAllRestaurants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const db = await connectDB();
    const restaurantsCollection = db.collection<Restaurant>("restaurants");
    const restaurants = await restaurantsCollection.find({}).toArray();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
};

export const searchRestaurants = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { query } = req.query;
    const db = await connectDB();
    const restaurantsCollection = db.collection<Restaurant>("restaurants");

    const restaurants = await restaurantsCollection
      .find({
        name: { $regex: query as string, $options: "i" },
      })
      .toArray();

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Failed to search restaurants" });
  }
};
