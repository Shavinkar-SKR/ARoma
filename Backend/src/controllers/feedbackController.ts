import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig";
import type { Feedback } from "../models/Feedback";

// Function to check if the user exists in the users collection
const checkUserExists = async (username: string): Promise<boolean> => {
  const db = await connectDB();
  const usersCollection = db.collection("users");
  const user = await usersCollection.findOne({ name: username }); // Check by username
  return !!user;
};

// Fetch all feedback from the database
export const getAllFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await connectDB();
    const feedbackCollection = db.collection<Feedback>("feedbacks");

    const feedbacks = await feedbackCollection.find({}).sort({ createdAt: -1 }).toArray();

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback" });
  }
};

// Submit new feedback
export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { comment, rating, username, restaurantName } = req.body;

    if (!comment || !rating || !username || !restaurantName) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if the user exists
    const userExists = await checkUserExists(username);
    if (!userExists) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const db = await connectDB();
    const feedbackCollection = db.collection<Feedback>("feedbacks");

    const newFeedback: Feedback = {
      comment,
      rating,
      username,
      restaurantName,
      createdAt: new Date(),
    };

    await feedbackCollection.insertOne(newFeedback);

    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Error saving feedback" });
  }
};