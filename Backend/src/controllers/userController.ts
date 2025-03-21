import { Request, Response } from "express";
import { connectDB } from "../config/db";
import { ObjectId } from "mongodb";

// Define the User interface
interface IUser {
  name: string;
  email: string;
  password: string;
}

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  console.log("Received sign-up request:", { name, email, password });

  try {
    const db = await connectDB();
    console.log("Attempting to find existing user...");

    // Check if the user already exists
    const existingUser = await db.collection<IUser>("users").findOne({ email });
    console.log("Existing user:", existingUser);

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create a new user
    console.log("Creating new user...");
    const newUser: IUser = { name, email, password };
    console.log("New user:", newUser);

    // Save the new user to the database
    console.log("Saving user to the database...");
    const result = await db.collection<IUser>("users").insertOne(newUser);
    console.log("User saved successfully");

    // Fetch the newly inserted user
    const insertedUser = await db.collection<IUser>("users").findOne({
      _id: result.insertedId,
    });

    if (!insertedUser) {
      throw new Error("Failed to fetch the inserted user");
    }

    res.status(201).json({ message: "User created successfully", userId: insertedUser });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};