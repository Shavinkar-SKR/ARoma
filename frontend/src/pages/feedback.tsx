import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, Toaster } from "sonner";

interface Feedback {
  _id: string;
  comment: string;
  rating: number;
}

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  // Fetch existing feedback (if needed)
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/feedback");
      if (!response.ok) throw new Error("Failed to fetch feedback");
      const data = await response.json();
      setFeedbackList(data);
    } catch (error) {
      toast.error("Error loading feedback");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newFeedback = { comment, rating };

    try {
      const response = await fetch("http://localhost:5001/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback),
      });

      if (!response.ok) throw new Error("Failed to submit feedback");

      toast.success("Feedback submitted!");
      setComment("");
      setRating(5);
      fetchFeedback(); // Refresh feedback list
    } catch (error) {
      toast.error("Error submitting feedback");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold mb-4">Feedback</h1>

        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your feedback..."
                required
                className="w-full p-2 border rounded"
              />
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="p-2 border rounded"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Stars
                  </option>
                ))}
              </select>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Recent Feedback</h2>
          {feedbackList.length > 0 ? (
            feedbackList.map((fb) => (
              <Card key={fb._id} className="mb-2">
                <CardContent>
                  <p>{fb.comment}</p>
                  <p className="text-sm text-gray-600">Rating: {fb.rating} ⭐</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-600">No feedback yet.</p>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default FeedbackPage;
