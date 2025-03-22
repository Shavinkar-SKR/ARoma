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
  ChefHat,
  Store,
  CheckCircle2,
  DollarSign,
  Clock,
  Utensils,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import TableNumberInput from "@/components/ui/TableNumberInput";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const OrderPlacementPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [subtotal, setSubtotal] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const serviceFee: number = 3.0;
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  const [tableNumber, setTableNumber] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      toast.error("Please log in to view your order");
      navigate("/HomePage", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchCartItems = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:5001/api/carts/${user._id}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching cart: ${response.status}`);
        }
        
        const data = await response.json();
        setCartItems(data);
        updateTotals(data);
      } catch (err) {
        console.error("Failed to fetch cart items:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch cart items");
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  const updateTotals = (items: CartItem[]) => {
    const newSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + serviceFee);
  };

  const navigateToPaymentPage = async () => {
    setIsProcessing(true);

    if (!user) {
      toast.error("You must be logged in to complete this order");
      setIsProcessing(false);
      return;
    }

    if (!tableNumber) {
      toast.error("Please enter your table number to proceed.");
      setIsProcessing(false);
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before proceeding.");
      setIsProcessing(false);
      return;
    }

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span>Preparing your order...</span>
        </motion.div>
      ),
      success: () => {
        setTimeout(() => {
          navigate("/payments", {
            state: {
              total,
              cartItems,
              specialInstructions,
              tableNumber,
            },
          });
        }, 500);

        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-2"
          >
            <div className="flex items-center justify-center bg-green-100 rounded-full p-1">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-green-900">
                Order Confirmed
              </span>
              <span className="text-sm text-gray-600">
                Proceeding to payment...
              </span>
            </div>
          </motion.div>
        );
      },
      error: (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-2 bg-red-50 border border-red-100 rounded-lg"
        >
          <div className="flex items-center justify-center bg-red-100 rounded-full p-1">
            <span className="h-5 w-5 text-red-600">×</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-red-900">
              Order Processing Failed
            </span>
            <span className="text-sm text-red-600">Please try again</span>
          </div>
        </motion.div>
      ),
      position: "top-right",
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-50 via-gray-100 to-gray-200">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-2"
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Your Order
              </h1>
              <p className="text-lg text-gray-600">
                Review your selections before proceeding
              </p>
            </motion.div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.4,
              }}
              className="bg-red-500 rounded-full p-4"
            >
              <Store className="h-8 w-8 text-white" />
            </motion.div>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr,400px]">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="border-b bg-white">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-2xl">Selected Items</CardTitle>
                        <CardDescription className="text-gray-600">
                          Your carefully chosen dishes
                        </CardDescription>
                      </div>
                      <motion.div
                        animate={{
                          rotate: [0, -10, 10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Utensils className="h-6 w-6 text-red-500" />
                      </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <AnimatePresence>
                      {isLoading ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center py-12"
                        >
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                          <span className="ml-3 text-lg text-gray-600">Loading your cart...</span>
                        </motion.div>
                      ) : error ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-8"
                        >
                          <Alert>
                            <AlertDescription className="text-lg text-red-500">
                              {error}. Please try refreshing the page.
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      ) : cartItems.length > 0 ? (
                        <div className="space-y-6">
                          {cartItems.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-6 p-4 rounded-xl bg-white shadow-sm border border-gray-100"
                            >
                              <motion.img
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                src={item.image}
                                alt={item.name}
                                className="h-20 w-20 rounded-lg object-cover shadow-md"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                  {item.name}
                                </h4>
                                <div className="flex items-center gap-4 text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Quantity: {item.quantity}
                                  </span>
                                  <span>€{item.price.toFixed(2)} each</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                  €{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-8"
                        >
                          <Alert>
                            <AlertDescription className="text-lg">
                              Your cart is empty. Please add items to proceed.
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <TableNumberInput
                  tableNumber={tableNumber}
                  setTableNumber={setTableNumber}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <motion.div
                        animate={{
                          rotate: [0, 15, -15, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ChefHat className="h-6 w-6 text-red-500" />
                      </motion.div>
                      Special Instructions
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Let us know about any dietary requirements or preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Share your preferences, allergies, or special requests..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="min-h-[120px] bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="sticky top-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <DollarSign className="h-6 w-6 text-red-500" />
                    </motion.div>
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <motion.div className="flex justify-between text-lg">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">€{subtotal.toFixed(2)}</span>
                    </motion.div>
                    <motion.div className="flex justify-between text-lg">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-medium">€{serviceFee.toFixed(2)}</span>
                    </motion.div>
                    <Separator className="my-6" />
                    <motion.div className="flex justify-between text-2xl font-semibold">
                      <span>Total</span>
                      <motion.span
                        key={total}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-red-500"
                      >
                        €{total.toFixed(2)}
                      </motion.span>
                    </motion.div>
                  </div>
                </CardContent>
                <CardFooter className="pt-6">
                  <motion.div
                    className="w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full h-14 text-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-red-500 rounded-xl"
                      disabled={
                        isProcessing ||
                        isLoading ||
                        !!error ||
                        !user ||
                        cartItems.length === 0 ||
                        !tableNumber ||
                        parseInt(tableNumber) < 1 ||
                        parseInt(tableNumber) > 50
                      }
                      onClick={navigateToPaymentPage}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : isLoading ? (
                        "Loading Cart..."
                      ) : (
                        "Complete Order"
                      )}
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Toaster />
    </div>
  );
};

export default OrderPlacementPage;