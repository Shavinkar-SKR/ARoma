import express from "express";
import Feedback from "../models/Feedback";

const router = express.Router();

// Submit Feedback
router.post("/", async (req, res) => {
  const { username, rating, comment } = req.body;
  try {
    const newFeedback = new Feedback({ username, rating, comment });
    await newFeedback.save();
    res.status(201).json({ message: "✅ Feedback submitted!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Something went wrong" });
  }
});

// Get All Feedback
router.get("/", async (_, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "❌ Something went wrong" });
  }
});

export default router;
