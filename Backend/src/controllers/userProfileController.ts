// controllers/userProfileController.ts
import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig";
import { ObjectId } from "mongodb";

// Fetch user profile
export const fetchUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const db = await connectDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user profile
export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { name, email, phone, dietaryPreferences } = req.body;

  try {
    const db = await connectDB();
    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { name, email, phone, dietaryPreferences } }
      );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};