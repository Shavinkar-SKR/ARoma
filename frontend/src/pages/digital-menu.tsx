import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  View,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantId: string;
  dietary: {
    isVegan: boolean;
    isNutFree: boolean;
    isGlutenFree: boolean;
  };
  hasARPreview: boolean;
}

const DigitalMenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dietaryFilters, setDietaryFilters] = useState({
    Vegan: false,
    NutFree: false,
    GlutenFree: false,
  });
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5001/api/menus/${restaurantId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch menu items");
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const searchMenuItems = async (query: string) => {
    setSearching(true);
    if (!query.trim()) {
      fetchMenuItems();
      setSearching(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/menus/search?query=${query}&restaurantId=${restaurantId}`,
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = [...menuItems];

    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (dietaryFilters.Vegan) {
      result = result.filter((item) => item.dietary.isVegan);
    }
    if (dietaryFilters.NutFree) {
      result = result.filter((item) => item.dietary.isNutFree);
    }
    if (dietaryFilters.GlutenFree) {
      result = result.filter((item) => item.dietary.isGlutenFree);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [menuItems, selectedCategory, dietaryFilters, sortBy]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const currentItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const categories = [
    "all",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMenuItems(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/restaurant-selection")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Restaurant Name
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              {!searching ? (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              ) : (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                </div>
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="default">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          <div className="flex gap-4 mb-8">
            {Object.entries(dietaryFilters).map(([key, value]) => (
              <Button
                key={key}
                variant={value ? "default" : "outline"}
                onClick={() => {
                  setDietaryFilters((prev) => ({
                    ...prev,
                    [key]: !value,
                  }));
                  setCurrentPage(1);
                }}
                className={value ? "bg-red-600 text-white" : ""}
              >
                {key.split(/(?=[A-Z])/).join(" ")}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {currentItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      {item.hasARPreview && (
                        <Button
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-black"
                          size="sm"
                          onClick={() => toast.info("AR View coming soon!")}
                        >
                          <View className="w-4 h-4 mr-1" />
                          AR View
                        </Button>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{item.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.description}
                          </p>
                        </div>
                        <span className="font-bold text-lg">
                          €{item.price.toFixed(2)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(item.dietary).map(
                          ([key, value]) =>
                            value && (
                              <Badge
                                key={key}
                                variant="secondary"
                                className="capitalize"
                              >
                                {key
                                  .split(/(?=[A-Z])/)
                                  .join(" ")
                                  .replace("is ", "")}
                              </Badge>
                            ),
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() =>
                              toast.info("Quantity adjustment coming soon!")
                            }
                            size="icon"
                            variant="outline"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span>0</span>
                          <Button
                            onClick={() =>
                              toast.info("Quantity adjustment coming soon!")
                            }
                            size="icon"
                            variant="outline"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          onClick={() => {
                            toast.success("Item added to cart! - SIMULATED", {
                              description: `Added ${item.name} to your cart`,
                            });
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? "bg-red-600" : ""}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={() => {
          navigate("/cart-page");
        }}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 rounded-full p-4 shadow-lg"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="ml-2">Cart (0)</span>
      </Button>

      <Toaster />
    </div>
  );
};

export default DigitalMenuPage;
