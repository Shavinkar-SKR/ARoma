import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MealRecommendation {
  name: string;
  category: string;
  image: string;
}

interface RestaurantRecommendation {
  name: string;
  rating: number;
  location: string;
  image: string;
}

const ForYou: React.FC = () => {
  const [username, setUsername] = useState(""); // State to store the username
  const [mealRecommendations, setMealRecommendations] = useState<MealRecommendation[]>([]);
  const [restaurantRecommendations, setRestaurantRecommendations] = useState<RestaurantRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    if (!username) {
      toast.error("Please enter a username.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/recommend?user_id=${username}`
      );
      setMealRecommendations(response.data.meal_recommendations);
      setRestaurantRecommendations(response.data.restaurant_recommendations);
    } catch (error) {
      toast.error("Failed to fetch recommendations.");
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>

      {/* Username Input */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-64"
        />
        <Button onClick={fetchRecommendations} className="ml-2">
          Get Recommendations
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* Meal Recommendations */}
      {!loading && mealRecommendations.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2">Meals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mealRecommendations.map((meal, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>{meal.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add the image here */}
                  <img
                    src={meal.image || "https://via.placeholder.com/300"} // Use a placeholder if no image is available
                    alt={meal.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p>Category: {meal.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Restaurant Recommendations */}
      {!loading && restaurantRecommendations.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2">Restaurants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantRecommendations.map((restaurant, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>{restaurant.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={restaurant.image || "https://via.placeholder.com/300"}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p>Rating: {restaurant.rating}</p>
                  <p>Location: {restaurant.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* No Recommendations Message */}
      {!loading && mealRecommendations.length === 0 && restaurantRecommendations.length === 0 && (
        <p className="text-gray-500">No recommendations found for this user.</p>
      )}
    </div>
  );
};

export default ForYou;