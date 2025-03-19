import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Interface for restaurant data
interface Restaurant {
  _id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  address: string;
}

const RestaurantCarousel = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const cardsToShow = 4; // Number of cards to show at once on desktop
  const navigate = useNavigate();

  // Fetch restaurant data from the backend API
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5001/api/restaurants");
        setRestaurants(response.data);
        setError("");
      } catch (error) {
        setError("Failed to fetch restaurants. Please try again later.");
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Navigation functions
  const nextSlide = () => {
    setActiveIndex((current) => 
      current + 1 >= restaurants.length ? 0 : current + 1
    );
  };
  
  const prevSlide = () => {
    setActiveIndex((current) => 
      current - 1 < 0 ? restaurants.length - 1 : current - 1
    );
  };
  
  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeIndex, restaurants.length]);

  // Calculate indices for visible cards
  const visibleIndices = [];
  for (let i = 0; i < cardsToShow; i++) {
    visibleIndices.push((activeIndex + i) % restaurants.length);
  }

  // Handle restaurant card click
  const handleCardClick = (restaurantId: string) => {
    navigate(`/restaurant-selection?id=${restaurantId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restaurant-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">No restaurants found.</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-restaurant-primary animate-fade-in-up">
          Nearby Restaurants
        </h2>
        
        <div className="relative">
          {/* Mobile carousel (show one card at a time) */}
          <div className="md:hidden">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500">
                {restaurants.map((restaurant, index) => (
                  <div 
                    key={restaurant._id}
                    className={`w-full flex-shrink-0 px-4 ${index === activeIndex ? 'block' : 'hidden'}`}
                  >
                    <RestaurantCard restaurant={restaurant} onClick={() => handleCardClick(restaurant._id)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Desktop carousel (show multiple cards) */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleIndices.map((index) => (
                <RestaurantCard 
                  key={restaurants[index]._id} 
                  restaurant={restaurants[index]} 
                  onClick={() => handleCardClick(restaurants[index]._id)}
                />
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg z-10 lg:-left-4 hover:bg-gray-100 transition-colors duration-300"
            onClick={prevSlide}
          >
            <ArrowLeft className="h-6 w-6 text-restaurant-primary" />
          </button>
          
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg z-10 lg:-right-4 hover:bg-gray-100 transition-colors duration-300"
            onClick={nextSlide}
          >
            <ArrowRight className="h-6 w-6 text-restaurant-primary" />
          </button>
        </div>
        
        {/* Carousel indicators */}
        <div className="flex justify-center mt-8">
          {restaurants.map((_, index) => (
            <button
              key={index}
              className={`mx-1 h-3 w-3 rounded-full transition-colors duration-300 ${
                index === activeIndex ? 'bg-restaurant-primary' : 'bg-gray-300'
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-restaurant-primary hover:bg-restaurant-secondary text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 animate-fade-in-up">
            Explore All Restaurants
          </button>
        </div>
      </div>
    </section>
  );
};

// Restaurant Card Component
const RestaurantCard = ({ restaurant, onClick }: { restaurant: Restaurant, onClick: () => void }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 animate-fade-in-up h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-xl mb-1">{restaurant.name}</h3>
        
        <div className="flex items-center mb-2">
          <span className="text-gray-600 text-sm">{restaurant.cuisine}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-gray-600 text-sm">{restaurant.priceRange}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{restaurant.address}</p>
        
        <div className="flex items-center">
          <Star className="h-5 w-5 text-yellow-400 fill-current" />
          <span className="ml-1 text-gray-700">{restaurant.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCarousel;