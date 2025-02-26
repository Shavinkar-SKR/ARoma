import { Request, Response } from 'express';
import { connectDB } from '../config/dbConfig'; // Adjust path as needed
import { ObjectId } from 'mongodb';

// Create a new menu item
const createMenuItem = async (req: Request, res: Response): Promise<Response> => {
  const { name, price, restaurantId } = req.body;
  if (!name || !price || !restaurantId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const db = await connectDB();
    const newMenuItem = {
      name,
      price,
      restaurantId: new ObjectId(restaurantId),
    };

    const result = await db.collection('menus').insertOne(newMenuItem);
    return res.status(201).json({ message: 'Menu item created', menuItem: { _id: result.insertedId, ...newMenuItem } });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return res.status(500).json({ message: "Error creating menu item" });
  }
};

// Update a menu item by ID
const updateMenuItem = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!name && !price) {
    return res.status(400).json({ message: "No fields to update" });
  }

  try {
    const db = await connectDB();
    const updatedData: any = {};

    if (name) updatedData.name = name;
    if (price) updatedData.price = price;

    const result = await db.collection('menus').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.json({ message: 'Menu item updated' });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return res.status(500).json({ message: "Error updating menu item" });
  }
};

// Delete a menu item by ID
const deleteMenuItem = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const db = await connectDB();

    const result = await db.collection('menus').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.json({ message: 'Menu item deleted' });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return res.status(500).json({ message: "Error deleting menu item" });
  }
};

export { createMenuItem, updateMenuItem, deleteMenuItem };
