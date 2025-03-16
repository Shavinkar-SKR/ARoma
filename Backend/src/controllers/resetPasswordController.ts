import { Request, Response } from "express";
import { connectDB } from "../config/db";
import { IUser } from "../models/User";

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword } = req.body;

  try {
    const db = await connectDB();

    // Check if the user exists
    const user = await db.collection<IUser>("users").findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid email. Please sign up." });
      return;
    }

    // Validate password format
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      res.status(400).json({ message: "Password must be at least 8 characters long and include numbers, letters, and special characters." });
      return;
    }

    // Update the user's password
    await db.collection<IUser>("users").updateOne(
      { email },
      { $set: { password: newPassword } }
    );

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};