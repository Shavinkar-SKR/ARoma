import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Plus, Minus, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  dietary: {
    isVegan: boolean;
    isNutFree: boolean;
    isGlutenFree: boolean;
  };
  hasARPreview: boolean;
}
const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Fresh tomatoes, mozzarella, basil, olive oil",
    price: 12.99,
    image: "https://placehold.co/600x400/png",
    category: "Pizza",
    dietary: {
      isVegan: false,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: true,
  },
  {
    id: 2,
    name: "Vegan Supreme Pizza",
    description: "Plant-based cheese, vegetables, olives",
    price: 15.99,
    image: "https://placehold.co/600x400/png",
    category: "Pizza",
    dietary: {
      isVegan: true,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: true,
  },
  {
    id: 3,
    name: "Grilled Chicken Salad",
    description: "Fresh greens, grilled chicken, avocado",
    price: 10.99,
    image: "https://placehold.co/600x400/png",
    category: "Salads",
    dietary: {
      isVegan: false,
      isNutFree: true,
      isGlutenFree: true,
    },
    hasARPreview: false,
  },
  {
    id: 4,
    name: "Quinoa Avocado Salad",
    description: "Quinoa, avocado, cherry tomatoes, lemon dressing",
    price: 9.99,
    image: "https://placehold.co/600x400/png",
    category: "Salads",
    dietary: {
      isVegan: true,
      isNutFree: true,
      isGlutenFree: true,
    },
    hasARPreview: false,
  },
  {
    id: 5,
    name: "BBQ Chicken Wings",
    description: "Smoky BBQ sauce, grilled wings, celery sticks",
    price: 13.99,
    image: "https://placehold.co/600x400/png",
    category: "Appetizers",
    dietary: {
      isVegan: false,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: false,
  },
  {
    id: 6,
    name: "Garlic Breadsticks",
    description: "Crispy breadsticks with garlic butter",
    price: 6.99,
    image: "https://placehold.co/600x400/png",
    category: "Appetizers",
    dietary: {
      isVegan: false,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: false,
  },
  {
    id: 7,
    name: "Mushroom Risotto",
    description: "Creamy risotto with truffle and mushrooms",
    price: 14.99,
    image: "https://placehold.co/600x400/png",
    category: "Main Course",
    dietary: {
      isVegan: false,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: true,
  },
  {
    id: 8,
    name: "Tofu Stir-Fry",
    description: "Tofu, bell peppers, soy sauce, jasmine rice",
    price: 12.49,
    image: "https://placehold.co/600x400/png",
    category: "Main Course",
    dietary: {
      isVegan: true,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: false,
  },
  {
    id: 9,
    name: "Lentil Soup",
    description: "Warm lentil soup with spices",
    price: 7.99,
    image: "https://placehold.co/600x400/png",
    category: "Soups",
    dietary: {
      isVegan: true,
      isNutFree: true,
      isGlutenFree: true,
    },
    hasARPreview: false,
  },
  {
    id: 10,
    name: "Clam Chowder",
    description: "Classic creamy chowder with fresh clams",
    price: 9.99,
    image: "https://placehold.co/600x400/png",
    category: "Soups",
    dietary: {
      isVegan: false,
      isNutFree: false,
      isGlutenFree: false,
    },
    hasARPreview: false,
  },
  {
    id: 11,
    name: "Chocolate Lava Cake",
    description: "Rich molten chocolate cake",
    price: 8.99,
    image: "https://placehold.co/600x400/png",
    category: "Desserts",
    dietary: {
      isVegan: false,
      isNutFree: false,
      isGlutenFree: false,
    },
    hasARPreview: true,
  },
  {
    id: 12,
    name: "Vegan Brownie",
    description: "Chocolate brownie made with almond flour",
    price: 7.49,
    image: "https://placehold.co/600x400/png",
    category: "Desserts",
    dietary: {
      isVegan: true,
      isNutFree: false,
      isGlutenFree: true,
    },
    hasARPreview: false,
  },
  {
    id: 13,
    name: "Strawberry Cheesecake",
    description: "New York-style cheesecake with strawberries",
    price: 9.99,
    image: "https://placehold.co/600x400/png",
    category: "Desserts",
    dietary: {
      isVegan: false,
      isNutFree: false,
      isGlutenFree: false,
    },
    hasARPreview: true,
  },
  {
    id: 14,
    name: "Hawaiian Pizza",
    description: "Ham, pineapple, cheese, tomato sauce",
    price: 14.49,
    image: "https://placehold.co/600x400/png",
    category: "Pizza",
    dietary: {
      isVegan: false,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: true,
  },
  {
    id: 15,
    name: "Caesar Salad",
    description: "Romaine, croutons, parmesan, Caesar dressing",
    price: 10.99,
    image: "https://placehold.co/600x400/png",
    category: "Salads",
    dietary: {
      isVegan: false,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: false,
  },
  {
    id: 16,
    name: "Falafel Wrap",
    description: "Falafel, hummus, fresh veggies, pita bread",
    price: 11.49,
    image: "https://placehold.co/600x400/png",
    category: "Wraps",
    dietary: {
      isVegan: true,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: false,
  },
  {
    id: 17,
    name: "Buffalo Chicken Wrap",
    description: "Spicy chicken, ranch dressing, lettuce, tortilla",
    price: 12.99,
    image: "https://placehold.co/600x400/png",
    category: "Wraps",
    dietary: {
      isVegan: false,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: false,
  },
  {
    id: 18,
    name: "Grilled Salmon",
    description: "Grilled salmon fillet with lemon butter sauce",
    price: 18.99,
    image: "https://placehold.co/600x400/png",
    category: "Main Course",
    dietary: {
      isVegan: false,
      isNutFree: true,
      isGlutenFree: true,
    },
    hasARPreview: true,
  },
  {
    id: 19,
    name: "Avocado Toast",
    description: "Sourdough bread, smashed avocado, chili flakes",
    price: 9.99,
    image: "https://placehold.co/600x400/png",
    category: "Breakfast",
    dietary: {
      isVegan: true,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: false,
  },
  {
    id: 20,
    name: "Egg Benedict",
    description: "Poached eggs, hollandaise sauce, English muffin",
    price: 13.49,
    image: "https://placehold.co/600x400/png",
    category: "Breakfast",
    dietary: {
      isVegan: false,
      isNutFree: true,
      isGlutenFree: false,
    },
    hasARPreview: false,
  },
];

const DigitalMenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dietaryFilters, setDietaryFilters] = useState({
    Vegan: false,
    NutFree: false,
    GlutenFree: false,
  });
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 6;

  const filteredAndSortedItems = useMemo(() => {
    let result = [...menuItems];

    if (searchQuery) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

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
  }, [menuItems, selectedCategory, dietaryFilters, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const currentItems = filteredAndSortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const categories = [
    "all",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Restaurant Name
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  key={item.id}
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
