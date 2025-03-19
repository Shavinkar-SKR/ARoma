import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, Toaster } from "sonner";

interface Feedback {
  _id: string;
  username: string;
  restaurantName: string;
  comment: string;
  rating: number;
}

interface Restaurant {
  name: string;
  image: string; // Path to the restaurant image
}

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [username, setUsername] = useState("");
  const [restaurantName, setRestaurantName] = useState("Ramen House"); // Used for form and submission
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [filterRestaurant, setFilterRestaurant] = useState(""); // Used for filtering reviews

  // Hardcoded restaurant data (name and image URL)
  const restaurants = [
    { name: "Ramen House", image: "/cd/ramen_house.webp" },
    { name: "Spice Island", image: "/cd/spice_island.webp" },
    { name: "Dragon Wok", image: "/cd/dragon_wok.webp" },
    { name: "La Pizzeria", image: "/cd/la_pizzeria.webp" },
    { name: "Sushi Delight", image: "/cd/sushi_delight.webp" },
    { name: "Pasta Paradise", image: "/cd/pasta_paradise.webp" },
  ];

  // Fetch existing feedback
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
    const newFeedback = { username, restaurantName, comment, rating };

    try {
      const response = await fetch("http://localhost:5001/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          toast.error(errorData.message); // Display "User not found" error
        } else {
          throw new Error("Failed to submit feedback");
        }
        return;
      }

      toast.success("Feedback submitted!");
      setUsername("");
      setRestaurantName("Ramen House");
      setComment("");
      setRating(5);
      fetchFeedback(); // Refresh feedback list
    } catch (error) {
      toast.error("Error submitting feedback");
    }
  };

  // Filter feedback based on the selected restaurant
  const filteredFeedback = filterRestaurant
    ? feedbackList.filter((fb) => fb.restaurantName === filterRestaurant)
    : feedbackList;

  // Get the image URL for the selected restaurant in the filter dropdown
  const selectedRestaurant = restaurants.find(
    (rest) => rest.name === filterRestaurant
  );
  const selectedRestaurantImage = selectedRestaurant?.image || "";

  // Calculate the average rating for the selected restaurant
  const averageRating =
    filteredFeedback.length > 0
      ? (
          filteredFeedback.reduce((sum, fb) => sum + fb.rating, 0) /
          filteredFeedback.length
        ).toFixed(1) // Round to 1 decimal place
      : "No ratings yet";

  // Function to get a random profile image
  const getRandomProfileImage = () => {
    const randomIndex = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
    return `/cd/profile_${randomIndex}.png`; // Updated path to the profile image
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
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
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full p-2 border rounded"
              />
              <select
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="p-2 border rounded"
              >
                {restaurants.map((rest) => (
                  <option key={rest.name} value={rest.name}>
                    {rest.name}
                  </option>
                ))}
              </select>
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
              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Restaurant Image and Details */}
        {selectedRestaurantImage && (
          <div className="mt-6">
            <img
              src={selectedRestaurantImage} // Dynamically load the restaurant image
              alt={filterRestaurant}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold">{filterRestaurant}</h3>
              <p className="text-gray-600">
                Average Rating: {averageRating} ⭐
              </p>
            </div>
          </div>
        )}

        {/* Feedback List */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Recent Feedback</h2>

          {/* Add a filter dropdown for restaurants */}
          <div className="mb-4">
            <label htmlFor="filterRestaurant" className="mr-2">
              Filter by Restaurant:
            </label>
            <select
              id="filterRestaurant"
              value={filterRestaurant}
              onChange={(e) => setFilterRestaurant(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Restaurants</option>
              {restaurants.map((rest) => (
                <option key={rest.name} value={rest.name}>
                  {rest.name}
                </option>
              ))}
            </select>
          </div>

          {/* Display filtered feedback */}
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((fb) => (
              <Card key={fb._id} className="mb-2">
                <CardContent>
                  <div className="flex items-center gap-2">
                    <img
                      src={getRandomProfileImage()} // Random profile image
                      alt="User Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <p>
                      <strong>{fb.username}</strong> - {fb.restaurantName}
                    </p>
                  </div>
                  <p>{fb.comment}</p>
                  <p className="text-sm text-gray-600">
                    Rating: {fb.rating} ⭐
                  </p>
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
