import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  reviews: number;
  priceRange: "€" | "€€" | "€€€" | "€€€€";
  image: string;
}

// Mock data
const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "La Pizzeria",
    cuisine: "Italian",
    location: "Downtown",
    rating: 4.5,
    priceRange: "€€",
    image: "https://placehold.co/600x400/png",
    reviews: 128,
  },
  {
    id: 2,
    name: "Sushi Delight",
    cuisine: "Japanese",
    location: "City Center",
    rating: 4.8,
    priceRange: "€€€",
    image: "https://placehold.co/600x400/png",
    reviews: 200,
  },
  {
    id: 3,
    name: "Dragon Wok",
    cuisine: "Chinese",
    location: "Uptown",
    rating: 4.3,
    priceRange: "€€",
    image: "https://placehold.co/600x400/png",
    reviews: 95,
  },
  {
    id: 4,
    name: "Spice Island",
    cuisine: "Sri Lankan",
    location: "Seaside Avenue",
    rating: 4.6,
    priceRange: "€€€",
    image: "https://placehold.co/600x400/png",
    reviews: 120,
  },
  {
    id: 5,
    name: "Pasta Paradise",
    cuisine: "Italian",
    location: "Eastside",
    rating: 4.2,
    priceRange: "€€",
    image: "https://placehold.co/600x400/png",
    reviews: 85,
  },
  {
    id: 6,
    name: "Ramen House",
    cuisine: "Japanese",
    location: "Market Street",
    rating: 4.7,
    priceRange: "€€",
    image: "https://placehold.co/600x400/png",
    reviews: 150,
  },
  {
    id: 7,
    name: "Golden Chopsticks",
    cuisine: "Chinese",
    location: "Central Plaza",
    rating: 4.5,
    priceRange: "€€€",
    image: "https://placehold.co/600x400/png",
    reviews: 180,
  },
  {
    id: 8,
    name: "Colombo Flavors",
    cuisine: "Sri Lankan",
    location: "Harbor Street",
    rating: 4.3,
    priceRange: "€€",
    image: "https://placehold.co/600x400/png",
    reviews: 110,
  },
  {
    id: 9,
    name: "Napoli Trattoria",
    cuisine: "Italian",
    location: "West End",
    rating: 4.6,
    priceRange: "€€€",
    image: "https://placehold.co/600x400/png",
    reviews: 130,
  },
  {
    id: 10,
    name: "Sakura Sushi",
    cuisine: "Japanese",
    location: "Little Tokyo",
    rating: 4.9,
    priceRange: "€€€€",
    image: "https://placehold.co/600x400/png",
    reviews: 220,
  },
  {
    id: 11,
    name: "Peking Palace",
    cuisine: "Chinese",
    location: "Old Town",
    rating: 4.4,
    priceRange: "€€",
    image: "https://placehold.co/600x400/png",
    reviews: 105,
  },
  {
    id: 12,
    name: "Ceylon Kitchen",
    cuisine: "Sri Lankan",
    location: "Lakeside",
    rating: 4.7,
    priceRange: "€€€",
    image: "https://placehold.co/600x400/png",
    reviews: 140,
  },
];

const RestaurantSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 6;

  const uniqueCuisines = [...new Set(restaurants.map((r) => r.cuisine))];

  const filteredRestaurants: Restaurant[] = useMemo(() => {
    return restaurants.filter(
      (restaurant) =>
        selectedCuisine === "all" ||
        restaurant.cuisine.toLowerCase() === selectedCuisine.toLowerCase(),
    );
  }, [selectedCuisine]);

  const currentRestaurants: Restaurant[] = useMemo(() => {
    const indexOfLastRestaurant = currentPage * restaurantsPerPage;
    const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
    return filteredRestaurants.slice(
      indexOfFirstRestaurant,
      indexOfLastRestaurant,
    );
  }, [currentPage, filteredRestaurants]);

  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  const handleCuisineChange = (cuisine: string) => {
    setSelectedCuisine(cuisine);
    setCurrentPage(1); // Reset to first page when cuisine changes
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCuisine}
              onChange={(e) => handleCuisineChange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Cuisines</option>
              {uniqueCuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine.toLowerCase()}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {currentRestaurants.map((restaurant) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    <CardHeader>
                      <CardTitle>{restaurant.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {restaurant.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {restaurant.rating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({restaurant.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {restaurant.priceRange}
                        </span>
                        <Button
                          onClick={() => {
                            navigate("/digital-menu");
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          View Menu
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className={`w-8 h-8 ${
                    currentPage === i + 1 ? "bg-red-600 text-white" : ""
                  }`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="outline"
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSelectionPage;
