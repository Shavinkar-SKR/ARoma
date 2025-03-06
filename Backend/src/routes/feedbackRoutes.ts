import { Router, Request, Response } from "express";
import {
  getAllFeedback,
  submitFeedback
} from "../controllers/feedbackController"; // Controller for feedback logic

const router = Router();

// Get all feedback
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    await getAllFeedback(req, res);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

// Submit new feedback
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    await submitFeedback(req, res);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});

export default router;
