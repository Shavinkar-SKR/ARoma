import { useState, useEffect } from "react";
import axios from "axios";

// Define TypeScript interface for feedback data
interface Feedback {
  _id?: string;
  username: string;
  rating: number;
  comment: string;
}

// ✅ Use environment variable for API base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch feedback from backend
  useEffect(() => {
    axios
      .get(`${API_URL}/api/feedback`)
      .then((res) => setFeedbacks(res.data))
      .catch((err) => {
        console.error("Error fetching feedback:", err);
        setError("Failed to fetch feedback. Please try again later.");
      });
  }, []);

  // Submit feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newFeedback = { username, rating, comment };

      // ✅ Send feedback to the backend
      const response = await axios.post(`${API_URL}/api/feedback`, newFeedback);
      console.log("Response from backend:", response.data);

      // ✅ Fetch updated feedbacks
      const res = await axios.get(`${API_URL}/api/feedback`);
      setFeedbacks(res.data);

      // ✅ Clear form fields
      setUsername("");
      setRating(1);
      setComment("");
      setError(null);
    } catch (err) {
      console.error("❌ Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "center" }}>
      <h1>Feedback Form</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        />
        <textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <h2>Feedbacks</h2>
      <ul>
        {feedbacks.map((fb, index) => (
          <li key={index}>
            <strong>{fb.username}</strong>: {fb.comment} (⭐ {fb.rating})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
