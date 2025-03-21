import { Request, Response } from "express";
import { ObjectId } from "mongodb";
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

export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const db = await connectDB();
    const restaurantsCollection = db.collection<Restaurant>("restaurants");

    if (!ObjectId.isValid(restaurantId)) {
      res.status(400).json({ error: "Invalid restaurant ID format" });
      return;
    }

    const restaurant = await restaurantsCollection.findOne({ _id: new ObjectId(restaurantId) });

    if (!restaurant) {
      res.status(404).json({ error: "Restaurant not found" });
      return;
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch restaurant" });
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
