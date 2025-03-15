import { Request, Response } from "express";
import { connectDB } from "../config/db";
import { IUser } from "../models/User";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  console.log("Received login request:", { email, password });

  try {
    const db = await connectDB();
    console.log("Attempting to find user...");

    // Check if the user exists
    const user = await db.collection<IUser>("users").findOne({ email });
    console.log("User found:", user);

    if (!user) {
      // Email doesn't exist
      console.log("Email not found");
      res.status(400).json({ success: false, message: "Email not found. Please sign up." });
      return;
    }

    // Compare passwords (assuming passwords are stored as plain text for now)
    console.log("Comparing passwords...");
    if (user.password !== password) {
      // Password is incorrect
      console.log("Invalid password");
      res.status(400).json({ success: false, message: "Invalid password. Please try again." });
      return;
    }

    // Login successful
    console.log("Login successful");
    res.status(200).json({ success: true, message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};