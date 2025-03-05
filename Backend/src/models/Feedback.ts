import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  username: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true }
}, { collection: "feedback" });

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
