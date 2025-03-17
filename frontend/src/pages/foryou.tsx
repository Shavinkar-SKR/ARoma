import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface MealRecommendation {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string; // Add image URL for meals
  restaurantId: string;
}

interface RestaurantRecommendation {
  name: string;
  rating: number;
  location: string;
  image: string; // Add image URL for restaurants
}

const ForYou: React.FC = () => {
  const [mealRecommendations, setMealRecommendations] = useState<MealRecommendation[]>([]);
  const [restaurantRecommendations, setRestaurantRecommendations] = useState<RestaurantRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/recommend?meal_name=California Rolls&user_id=ann jay"  // Replace with dynamic values
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

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>

      {/* Meal Recommendations */}
      <h3 className="text-lg font-semibold mb-2">Meals</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mealRecommendations.map((meal, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>{meal.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Meal Image */}
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p>{meal.description}</p>
              <small className="text-gray-500">Category: {meal.category}</small>
              <p className="text-gray-700">Price: ${meal.price}</p>
              <p className="text-gray-700">Restaurant ID: {meal.restaurantId}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Restaurant Recommendations */}
      <h3 className="text-lg font-semibold mb-2">Restaurants</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurantRecommendations.map((restaurant, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>{restaurant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Restaurant Image */}
              <img
                src={restaurant.image || "https://via.placeholder.com/300"} // Fallback image if no image is provided
                alt={restaurant.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p>Rating: {restaurant.rating}</p>
              <p>Location: {restaurant.location}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ForYou;