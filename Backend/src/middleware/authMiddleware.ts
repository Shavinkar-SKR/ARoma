// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { connectDB } from "../config/dbConfig";
import { ObjectId } from "mongodb";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;

  if (!userId) {
    res.status(401).json({ message: "User ID is required." });
    return;
  }

  try {
    const db = await connectDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};