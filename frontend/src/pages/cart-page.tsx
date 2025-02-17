import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowLeft, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  specialInstructions?: string;
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 12.99,
    quantity: 2,
    image: "https://placehold.co/600x400/png",
  },
  {
    id: 2,
    name: "Vegan Supreme Pizza",
    price: 15.99,
    quantity: 1,
    image: "https://placehold.co/600x400/png",
  },
  {
    id: 3,
    name: "Grilled Chicken Salad",
    price: 10.99,
    quantity: 1,
    image: "https://placehold.co/600x400/png",
  },
  {
    id: 4,
    name: "Quinoa Avocado Salad",
    quantity: 1,
    price: 9.99,
    image: "https://placehold.co/600x400/png",
  },
  {
    id: 5,
    name: "BBQ Chicken Wings",
    quantity: 1,
    price: 6.99,
    image: "https://placehold.co/600x400/png",
  },
];

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [tableNumber, setTableNumber] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const serviceFee = 3.0;
  const total = subtotal + serviceFee;

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = (itemId: number) => {
    const itemToRemove = cartItems.find((item) => item.id === itemId);
    if (!itemToRemove) return;

    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.success(`Removed ${itemToRemove.name} from cart`, {
      action: {
        label: "Undo",
        onClick: () => setCartItems((prev) => [...prev, itemToRemove]),
      },
    });
  };

  const handleCheckout = () => {
    if (!tableNumber) {
      toast.error("Please enter your table number");
      return;
    }
    toast.success("Proceeding to checkout...");
    navigate("/order-placement", {
      state: { cartItems }, 
    });
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toaster />
      <div className="container mx-auto h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Header - Fixed */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
              <p className="text-gray-600">Review and modify your order</p>
            </div>
          </div>

          <div className="flex-1 grid gap-6 md:grid-cols-[1fr,380px] h-[calc(100vh-12rem)] overflow-hidden">
            <div className="overflow-y-auto pr-4 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-600">
                              €{item.price.toFixed(2)} each
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => removeItem(item.id)}
                                className="ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              €{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Textarea
                          placeholder="Special instructions..."
                          className="mt-4"
                          value={item.specialInstructions}
                          onChange={(e) =>
                            setCartItems((prev) =>
                              prev.map((i) =>
                                i.id === item.id
                                  ? {
                                      ...i,
                                      specialInstructions: e.target.value,
                                    }
                                  : i,
                              ),
                            )
                          }
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {cartItems.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Your cart is empty</p>
                    <Button
                      className="mt-4"
                      onClick={() => navigate("/digital-menu")}
                    >
                      Browse Menu
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span>€{serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>

                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Table Number
                    </label>
                    <input
                      type="number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Enter table number"
                      min="1"
                      max="50"
                    />
                  </div>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 mt-4"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || !tableNumber}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ChefHat className="w-5 h-5" />
                    <p className="text-sm">
                      Your order will be prepared fresh by our chefs
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
