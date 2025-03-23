import React, { useState } from "react";
import { Search, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Input } from "@/components/ui/input"; // shadcn/ui Input
import HeroImage from "../assets/HeroImage.jpg";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion"; // Import motion from Framer Motion

interface Restaurant {
  _id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  reviews: number;
  priceRange: "€" | "€€" | "€€€" | "€€€€";
  image: string;
}

const Banner: React.FC = () => {
  const navigate = useNavigate();
  const [locationFocused, setLocationFocused] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    console.log("Search query:", searchQuery); // Debugging log
    if (!searchQuery.trim()) {
      toast.error("Please enter a restaurant or dish name to search.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/restaurants/search?query=${searchQuery}`,
      );
      console.log("API response:", response); // Debugging log
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      console.log("API data:", data); // Debugging log
      setRestaurants(data);

      if (data.length > 0) {
        toast.success(`Found ${data.length} results for "${searchQuery}"`);
      } else {
        toast.info(`No results found for "${searchQuery}"`);
      }
    } catch (error) {
      console.error("Search error:", error); // Debugging log
      toast.error("Failed to search restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-red-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0
          }}
          animate={{ 
            y: [null, Math.random() * -500],
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
        />
      ))}

      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Content */}
          <div className="flex-1 space-y-6 md:space-y-8 text-white text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
              Welcome To ARoma!
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl">
              Your Gateway To The Best Restaurants Near You.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button
                className="bg-green-600 hover:bg-green-700 text-lg h-12 px-6 sm:px-8"
                onClick={() => navigate("/signUpDialog")}
              >
                Sign Up
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-md mx-auto md:mx-0">
              <div className="flex items-center bg-white rounded-full p-2">
                
                {/* Search Input */}
                <div className="flex-1 px-2 sm:px-3">
                  {searchFocused || searchQuery ? (
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => setSearchFocused(false)}
                      onKeyPress={handleKeyPress}
                      className="w-full outline-none bg-transparent text-gray-800 text-sm sm:text-base"
                      autoFocus
                      placeholder="Search for restaurant"
                    />
                  ) : (
                    <div
                      onClick={() => setSearchFocused(true)}
                      className="cursor-text text-gray-500 text-sm sm:text-base"
                    >
                      Search for restaurant and Cuisine
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 rounded-full p-2 sm:p-3"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Display Search Results */}
            {restaurants.length > 0 && (
              <div className="mt-6 space-y-4">
                <h2 className="text-xl font-semibold">Search Results</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {restaurants.map((restaurant) => (
                    <div
                      key={restaurant._id}
                      className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/digital-menu/${restaurant._id}`)}
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {restaurant.cuisine}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {restaurant.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {restaurant.rating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({restaurant.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image */}
          <div className="flex-1 relative w-full max-w-[400px] mx-auto md:mx-0">
            <div className="relative w-full aspect-square">
              <img
                src={HeroImage}
                alt="Delicious Food"
                className="rounded-full shadow-2xl object-cover w-full h-full animate-spin-slow"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-600/10 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;