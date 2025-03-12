import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Recommendation {
  name: string;
  description: string;
  category: string;
}

const ForYou: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/recommend?meal_name=California Rolls"
        );
        setRecommendations(response.data);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((meal, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>{meal.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{meal.description}</p>
              <small className="text-gray-500">Category: {meal.category}</small>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ForYou;