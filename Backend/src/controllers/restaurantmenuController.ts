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
        const menuItems = await db.collection("menus").find({ restaurantId: restaurant._id.toString() }).toArray();
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

// Delete an existing menu item by ID
const deleteMenuItem = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const db = await connectDB();

    // Delete the menu item by ID
    const result = await db.collection("menus").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.status(200).json({ message: "Menu item deleted successfully" });

  } catch (error) {
    console.error("Error deleting menu item:", error);
    return res.status(500).json({ message: "Error deleting menu item" });
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
    const menuItems = await db.collection("menus").find({ 
      restaurantId: id // restaurantId is a string
    }).toArray();

    return res.json({
      restaurant,
      menuItems,
    });

  } catch (error) {
    console.error("Error fetching restaurant and menu:", error);
    return res.status(500).json({ message: "Error fetching restaurant and menu" });
  }
};

// Fetch a specific menu item by ID
const getMenuItemById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const db = await connectDB();
    const menuItem = await db.collection("menus").findOne({ _id: new ObjectId(id) });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return res.status(500).json({ message: "Error fetching menu item" });
  }
};

// Add a new menu item to the system
const addMenuItem = async (req: Request, res: Response): Promise<Response> => {
  const { name, description, price, image, category, restaurantId, dietary, hasARPreview } = req.body;

  try {
    const db = await connectDB();

    // Create the new menu item object with the provided fields
    const newMenuItem = {
      name: name as string,
      description: description as string,
      price: parseFloat(price), // Ensure price is a double
      image: image as string,
      category: category as string,
      restaurantId: restaurantId as string, // restaurantId is a string
      dietary: {
        isVegan: dietary.isVegan as boolean,
        isNutFree: dietary.isNutFree as boolean,
        isGlutenFree: dietary.isGlutenFree as boolean,
      },
      hasARPreview: hasARPreview as boolean,
    };

    // Insert the new menu item into the "menus" collection
    const result = await db.collection("menus").insertOne(newMenuItem);

    return res.status(201).json({ message: "Menu item added successfully", menuItem: result.insertedId });

  } catch (error) {
    console.error("Error adding menu item:", error);
    return res.status(500).json({ message: "Error adding menu item" });
  }
};

// Add a new menu item to a specific restaurant by its ID
const addMenuItemToRestaurant = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, description, price, image, category, dietary, hasARPreview } = req.body;

  try {
    const db = await connectDB();

    // Create the new menu item object with the provided fields
    const newMenuItem = {
      name: name as string,
      description: description as string,
      price: parseFloat(price), // Ensure price is a double
      image: image as string,
      category: category as string,
      restaurantId: id as string, // Use the restaurant ID from the route parameter
      dietary: {
        isVegan: dietary.isVegan as boolean,
        isNutFree: dietary.isNutFree as boolean,
        isGlutenFree: dietary.isGlutenFree as boolean,
      },
      hasARPreview: hasARPreview as boolean,
    };

    // Insert the new menu item into the "menus" collection
    const result = await db.collection("menus").insertOne(newMenuItem);

    return res.status(201).json({ message: "Menu item added successfully", menuItem: result.insertedId });

  } catch (error) {
    console.error("Error adding menu item:", error);
    return res.status(500).json({ message: "Error adding menu item" });
  }
};

// Update an existing menu item
const updateMenuItem = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, description, price, image, category, dietary, hasARPreview } = req.body;

  try {
    const db = await connectDB();

    // Create an update object with the provided fields
    const updateFields: any = {};
    if (name) updateFields.name = name as string;
    if (description) updateFields.description = description as string;
    if (price) updateFields.price = parseFloat(price); // Ensure price is a double
    if (image) updateFields.image = image as string;
    if (category) updateFields.category = category as string;
    if (dietary) {
      updateFields.dietary = {
        isVegan: dietary.isVegan as boolean,
        isNutFree: dietary.isNutFree as boolean,
        isGlutenFree: dietary.isGlutenFree as boolean,
      };
    }
    if (hasARPreview !== undefined) updateFields.hasARPreview = hasARPreview as boolean; // To handle boolean values correctly

    // Update the menu item in the "menus" collection
    const result = await db.collection("menus").updateOne(
      { _id: new ObjectId(id) }, // Find the menu item by ID
      { $set: updateFields } // Update only the specified fields
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.status(200).json({ message: "Menu item updated successfully" });

  } catch (error) {
    console.error("Error updating menu item:", error);
    return res.status(500).json({ message: "Error updating menu item" });
  }
};

export { getAllRestaurantsWithMenus, getRestaurantWithMenu, addMenuItem, addMenuItemToRestaurant, updateMenuItem, deleteMenuItem, getMenuItemById };