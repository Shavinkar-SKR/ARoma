import { Request, Response } from 'express';
import { connectDB } from '../config/dbConfig'; // Adjust path as needed
import { ObjectId } from 'mongodb';

// Fetch all restaurants and their menu items
const getAllRestaurantsWithMenus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const db = await connectDB();

    // Fetch all restaurants
    const restaurants = await db.collection("restaurants").find().toArray();

    if (restaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found" });
    }

    // Fetch menu items for each restaurant
    const restaurantsWithMenus = await Promise.all(
      restaurants.map(async (restaurant) => {
        const menuItems = await db.collection("menus").find({ restaurantId: restaurant._id }).toArray();
        return {
          ...restaurant,
          menuItems,  // Adding the menus to the restaurant object
        };
      })
    );

    return res.json(restaurantsWithMenus);

  } catch (error) {
    console.error("Error fetching restaurants and menus:", error);
    return res.status(500).json({ message: "Error fetching restaurants and menus" });
  }
};

// Fetch a specific restaurant by ID and its menu items
const getRestaurantWithMenu = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const db = await connectDB();

    // Fetch restaurant details by ID
    const restaurant = await db.collection("restaurants").findOne({ _id: new ObjectId(id) });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Fetch the menu items for this restaurant
    const menuItems = await db.collection("menus").find({ restaurantId: id }).toArray();

    return res.json({
      restaurant,
      menuItems,
    });

  } catch (error) {
    console.error("Error fetching restaurant and menu:", error);
    return res.status(500).json({ message: "Error fetching restaurant and menu" });
  }
};

export { getRestaurantWithMenu, getAllRestaurantsWithMenus };
