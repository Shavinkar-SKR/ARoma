import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/dbConfig";
import type { CartItem } from "../models/cartModel";

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await connectDB();
    const cartsCollection = db.collection<CartItem>("carts");
    const { menuId, name, price, quantity, image, userId } = req.body;

    const cartItem: CartItem = {
      menuId,
      name,
      price,
      quantity,
      image,
      userId,
    };

    const result = await cartsCollection.insertOne(cartItem);
    res.status(201).json({
      ...cartItem,
      _id: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

export const getCarts = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await connectDB();
    const cartsCollection = db.collection<CartItem>("carts");
    const { userId } = req.params;

    const cartItems = await cartsCollection.find({ userId }).toArray();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const db = await connectDB();
    const cartsCollection = db.collection<CartItem>("carts");
    const { itemId } = req.params;
    const { quantity } = req.body;

    const result = await cartsCollection.updateOne(
      { _id: new ObjectId(itemId) },
      { $set: { quantity } },
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: "Item not found in cart" });
      return;
    }
    res.status(200).json({ message: "Cart item updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

export const removeFromCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const db = await connectDB();
    const cartsCollection = db.collection<CartItem>("carts");
    const { itemId } = req.params;

    const result = await cartsCollection.deleteOne({
      _id: new ObjectId(itemId),
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Item not found in cart" });
      return;
    }
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};
