import React, { useState, useEffect } from "react"; // Import React and hooks
import { Button } from "@/components/ui/button"; // Import Button component
import { Textarea } from "@/components/ui/textarea"; // Import Textarea component
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"; // Import components for layout (Card)
import { Separator } from "@/components/ui/separator"; // Import Separator component for dividing sections
import { Alert, AlertDescription } from "@/components/ui/alert"; // Import Alert components to show messages
import { ShoppingCart, Minus, Plus, Trash2, ChefHat, Store, CheckCircle2, DollarSign } from "lucide-react"; // Import icons from lucide
import { useNavigate } from "react-router-dom"; // Import to navigate between pages
import { toast, Toaster } from "sonner"; // Import toast and Toaster from sonner
import { motion, AnimatePresence } from "framer-motion"; // Import for animation effects

interface CartItem {
  id: number; // id for each item
  name: string; // name of the item
  price: number; // amount for each price
  quantity: number; // quantity of the item in the cart
  image: string; // image URL of the item
}

const OrderPlacementPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // State for cart items
  const [specialInstructions, setSpecialInstructions] = useState<string>(""); // State for special instructions
  const [subtotal, setSubtotal] = useState<number>(0); // State for calculating subtotal
  const [isProcessing, setIsProcessing] = useState(false); // boolean value to check order is being processed or not 

  const serviceFee: number = 3.0; 
  const [total, setTotal] = useState<number>(0); // State to calculate the total amount
  const apiBaseUrl = "http://localhost:5000"; // Base URL of the API
  const navigate = useNavigate(); // react hook to navigate to payment page 

  useEffect(() => {
    // This function will run once when the page loads to fetch cart items
    const fetchCartItems = async () => {
      try {
        // Fetching data from the server
        const response = await fetch(`${apiBaseUrl}/cart`); // Waits till the server to respond before going to next line 
        if (!response.ok) {
          throw new Error("Failed to fetch cart items"); // Throws new error if fetching fails
        }
        const data: CartItem[] = await response.json(); // Convert the response into JSON format 
        setCartItems(data); // Update the cart item state with the fetched data
        updateTotals(data); 
      } catch (error) {
        console.error("Failed to fetch cart items:", error); // Show error if fetching fails
        toast.error("Failed to load cart items. Please try again.");
      }
    };
    fetchCartItems(); // Calling the fetch function
  }, []);

  const updateTotals = (items: CartItem[]) => { // method to update the total value in cart 
    const newSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity, // Sum the total value by iterating and multiplying the price by the number of quantities
      0 // Initial value is 0
    );
    setSubtotal(newSubtotal); // Set the new subtotal
    setTotal(newSubtotal + serviceFee); // total value with the service fee 
  };

  const handleQuantityChange = async (id: number, delta: number) => {    // Takes two parameters id and the number of changes in the quantity
    const updatedItems = cartItems.map((item) => {// This is used to create a new array using the existing cart items; this doesn't modify the original item
      return item.id === id // If item id matches
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) } // Update the quantity, ensuring it is not less than 1
        : item;
    });

    setCartItems(updatedItems); // Update the state with new cart items
    updateTotals(updatedItems); // Update the totals based on updated items

    toast.success("Quantity updated", {
      duration: 1000, // Show notification for 1 second
      position: "top-right", // Show at the bottom-right corner
      style: { background: "#f3f4f6", color: "#1f2937" }, // Style for the notification
    });
  };

  const handleRemoveItem = (id: number) => { // seaches throgh the array 
    const itemToRemove = cartItems.find((item) => item.id === id); // Find the item to remove
    const updatedItems = cartItems.filter((item) => item.id !== id); // Remove the item from cart
    setCartItems(updatedItems); // Update the cart with remaining items
    updateTotals(updatedItems); // Update the total after removal

    toast(
      <div className="flex items-center gap-2">
        <span>Item removed</span>
        <Button
          variant="link"
          className="p-0 h-auto text-blue-500 hover:text-blue-700"
          onClick={() => {
            setCartItems((prev) => [...prev, itemToRemove!]); // Add the item back to the cart
            updateTotals([...updatedItems, itemToRemove!]); // Update totals after undo
          }}
        >
          Undo
        </Button>
      </div>,
      {
        duration: 1000, // Show the notification for 3 seconds
        position: "top-right", // Position at bottom-right
      }
    );
  };

  const navigateToPaymentPage = async () => {
    setIsProcessing(true); // Show loading state while processing

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)), // Simulate processing delay of 2 seconds
      {
        loading: (
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span>Processing your order...</span>
          </div>
        ),
        success: () => {
          setTimeout(() => {
            // After processing, navigate to payment page
            navigate("/payments", {
              state: {
                total, // Pass total amount
                cartItems, // Pass cart items
                specialInstructions, // Pass any special instructions
              },
            });
          }, 500); // Delay for 0.5 seconds before redirecting

          return (
            <div className="flex items-center gap-3 p-2">
              <div className="flex items-center justify-center bg-green-100 rounded-full p-1">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-green-900">Order Confirmed!</span>
                <span className="text-sm text-gray-600">Redirecting to payment...</span>
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
              <span className="font-semibold text-red-900">Failed to process order</span>
              <span className="text-sm text-gray-600">Please try again</span>
            </div>
          </div>
        ),
        position: "top-right",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header section */}
          <div className="flex items-center justify-between mb-8">
            {/* Header title and description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order Summary</h1>
              <p className="mt-2 text-sm text-gray-500">Review your order before checkout</p>
            </motion.div>
            {/* Store icon with animation */}
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
              {/* Cart items display */}
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="space-y-1">
                    <CardTitle>Your Cart</CardTitle>
                    <CardDescription>Review and adjust your items</CardDescription>
                  </div>
                  {/* Shopping cart icon */}
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
                            <p className="text-sm text-muted-foreground">€{item.price.toFixed(2)} each</p>
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
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
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
                          <div className="w-24 text-right font-medium">€{(item.price * item.quantity).toFixed(2)}</div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Alert>
                          <AlertDescription>Your cart is empty. Add some items to proceed with checkout.</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Special instructions */}
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5 text-red-500" />
                    Special Instructions
                  </CardTitle>
                  <CardDescription>Add any dietary preferences or special requests</CardDescription>
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
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between text-sm">
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
                  {/* Button to proceed to payment */}
                  <Button
                    className="w-full h-12 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 bg-black text-white hover:bg-black focus:outline-none"
                    disabled={isProcessing || cartItems.length === 0} // Disable button if processing or no items
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

export default OrderPlacementPage; // Export the component
