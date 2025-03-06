import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig";
import type { Feedback } from "../models/Feedback";

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
    const { comment, rating } = req.body;

    if (!comment || !rating) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const db = await connectDB();
    const feedbackCollection = db.collection<Feedback>("feedbacks");

    const newFeedback: Feedback = {
      comment,
      rating,
      createdAt: new Date(),
    };

    await feedbackCollection.insertOne(newFeedback);

    res.status(201).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Error saving feedback" });
  }
};
