import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Restaurant {
  _id: string;
  name: string;
  banner: string;
}

const Offers = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantsWithBanners = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/restaurants");
        const restaurantsWithBanners = response.data.filter(
          (restaurant: Restaurant) => restaurant.banner
        );

        if (restaurantsWithBanners.length > 0) {
          setRestaurants(restaurantsWithBanners);
          setActiveIndex(0); // Ensure the first banner is shown immediately
        }
      } catch (err) {
        setError("Failed to fetch banners. Please try again later.");
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchRestaurantsWithBanners();
  }, []);

  useEffect(() => {
    if (restaurants.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % restaurants.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [restaurants]);

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/3 mb-8 lg:mb-0 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-restaurant-primary mb-2">Best Offers</h2>
            <p className="text-xl text-red-500">Exclusive Deals, Delicious Savings!</p>
          </div>

          <div className="lg:w-3/5 relative overflow-hidden rounded-2xl shadow-xl animate-fade-in-up">
            {loading ? (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-200 rounded-2xl">
                {/* Skeleton loader */}
                <div className="w-full h-[400px] animate-pulse bg-gray-300 rounded-2xl" />
              </div>
            ) : restaurants.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] relative cursor-pointer"
                  onClick={() => navigate(`/restaurant-selection?id=${restaurants[activeIndex]._id}`)}
                >
                  {/* Lazy loading image */}
                  <img
                    src={restaurants[activeIndex].banner}
                    alt={`Banner for ${restaurants[activeIndex].name}`}
                    className="w-full h-full object-cover rounded-2xl"
                    loading="lazy" // Enables lazy loading
                  />
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-200 rounded-2xl">
                <p className="text-gray-500">No banners available.</p>
              </div>
            )}

            {/* Navigation Buttons */}
            {restaurants.length > 1 && (
              <>
                <Button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-all duration-200"
                  onClick={() =>
                    setActiveIndex((current) => (current - 1 + restaurants.length) % restaurants.length)
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-all duration-200"
                  onClick={() => setActiveIndex((current) => (current + 1) % restaurants.length)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Dots for Banner Navigation */}
            {restaurants.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {restaurants.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === activeIndex ? "bg-white" : "bg-white bg-opacity-50"
                    }`}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offers;
