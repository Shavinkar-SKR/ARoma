import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ChefHat,
  Store,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Add the TableNumberInput component
import TableNumberInput from "@/components/ui/TableNumberInput";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const OrderPlacementPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [subtotal, setSubtotal] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const serviceFee: number = 3.0;
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  const [tableNumber, setTableNumber] = useState<string>(""); // Table number state

  // Use data passed from CartPage using react-router state
  useEffect(() => {
    const data = location.state?.cartItems || [];
    setCartItems(data);
    updateTotals(data);
  }, [location.state?.cartItems]);

  const getOrderPrediction = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, tableNumber }),
      });

      const data = await response.json();
      return data.predicted_time; // Assuming the response contains { estimated_time: "20 mins" }
    } catch (error) {
      console.error("Prediction error:", error);
      return "Unknown"; // Fallback in case of error
    }
  };

  const updateTotals = (items: CartItem[]) => {
    const newSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + serviceFee);
  };

  const handleQuantityChange = async (id: number, delta: number) => {
    const updatedItems = cartItems.map((item) => {
      return item.id === id
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
        : item;
    });

    setCartItems(updatedItems);
    updateTotals(updatedItems);

    toast.success("Quantity updated", {
      duration: 1000,
      position: "top-right",
      style: { background: "#f3f4f6", color: "#1f2937" },
    });
  };

  const handleRemoveItem = (id: number) => {
    // Find the item and its index for accurate reinsertion
    const itemIndex = cartItems.findIndex((item) => item.id === id);
    const itemToRemove = cartItems[itemIndex];

    if (itemToRemove) {
      const updatedItems = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedItems);
      updateTotals(updatedItems);

      toast(
        <div className="flex items-center gap-2">
          <span>Item removed</span>
          <Button
            variant="link"
            className="p-0 h-auto text-blue-500 hover:text-blue-700"
            onClick={() => {
              // Insert the item back at its original position
              const newItems = [...cartItems];
              newItems.splice(itemIndex, 0, itemToRemove);
              setCartItems(newItems);
              updateTotals(newItems);
            }}
          >
            Undo
          </Button>
        </div>,
        {
          duration: 5000, // Increased duration for better user interaction time
          position: "top-right",
        }
      );
    } else {
      // If no item is found, inform the user
      toast.error("Item not found in the cart.");
    }
  };

  const navigateToPaymentPage = async () => {
    setIsProcessing(true);

    if (!tableNumber) {
      toast.error("Please enter your table number to proceed.");
      return;
    }

    const estimatedTime = await getOrderPrediction();

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: (
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span>Processing your order...</span>
        </div>
      ),
      success: () => {
        setTimeout(() => {
          navigate("/payments", {
            state: {
              total,
              cartItems,
              specialInstructions,
              tableNumber, // Pass table number
              estimatedTime,
            },
          });
        }, 500);

        return (
          <div className="flex items-center gap-3 p-2">
            <div className="flex items-center justify-center bg-green-100 rounded-full p-1">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-green-900">
                Order Confirmed!
              </span>
              <span className="text-sm text-gray-600">
                Redirecting to payment...
              </span>
            </div>
          </div>
        );
      },
      error: (
        <div className="flex items-center gap-3 p-2">
          <div className="flex items-center justify-center bg-red-100 rounded-full p-1">
            <span className="h-5 w-5 text-red-600">×</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-red-900">
              Failed to process order
            </span>
            <span className="text-sm text-gray-600">Please try again</span>
          </div>
        </div>
      ),
      position: "top-right",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Order Summary
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Review your order before checkout
              </p>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            >
              <Store className="h-12 w-12 text-red-500" />
            </motion.div>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr,380px]">
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="space-y-1">
                    <CardTitle>Your Cart</CardTitle>
                    <CardDescription>
                      Review and adjust your items
                    </CardDescription>
                  </div>
                  <ShoppingCart className="h-5 w-5 text-red-500 animate-bounce" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 rounded-md object-cover transform transition-transform hover:scale-105"
                          />
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              €{item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="h-8 w-8 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="h-8 w-8 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleRemoveItem(item.id)}
                              className="h-8 w-8 hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="w-24 text-right font-medium">
                            €{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Alert>
                          <AlertDescription>
                            Your cart is empty. Add some items to proceed with
                            checkout.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Table Number Input */}
              <TableNumberInput
                tableNumber={tableNumber}
                setTableNumber={setTableNumber}
              />
              {/* Special instructions */}
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-red-500" />
                    Special Instructions
                  </CardTitle>
                  <CardDescription>
                    Add any dietary preferences or special requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="E.g., allergies, preparation preferences, or delivery instructions..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)} // Update state when text changes
                    className="min-h-[100px] focus:ring-2 focus:ring-primary/20 transition-shadow"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-4 hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-red-500" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Display subtotal, service fee, and total */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">Service Fee</span>
                      <span>€{serviceFee.toFixed(2)}</span>
                    </motion.div>
                    <Separator className="my-2" />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-between text-lg font-semibold text-black"
                    >
                      <span>Total</span>
                      <span className="text-black">€{total.toFixed(2)}</span>
                    </motion.div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full h-12 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 bg-black text-white hover:bg-black focus:outline-none"
                    disabled={
                      isProcessing ||
                      cartItems.length === 0 ||
                      !tableNumber ||
                      parseInt(tableNumber) < 1 ||
                      parseInt(tableNumber) > 50
                    } // Disable button if processing or no items
                    onClick={navigateToPaymentPage}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Toast notifications container */}
      <Toaster />
    </div>
  );
};

export default OrderPlacementPage;