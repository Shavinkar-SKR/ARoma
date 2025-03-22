import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2 } from "lucide-react";

interface CartItem {
  _id: string;
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  userId: string;
}

interface CartPopupProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  userId: string | undefined;
  onCartUpdated: () => void;
}

const CartPopup: React.FC<CartPopupProps> = ({
  isOpen,
  onClose,
  cartItems,
  setCartItems,
  userId,
  onCartUpdated
}) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const serviceFee = 3.0;
  const total = subtotal + serviceFee;
  const navigate = useNavigate();

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return; 

    try {
      const response = await fetch(`http://localhost:5001/api/carts/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      
      if (!response.ok) throw new Error("Failed to update item quantity");
      
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      toast.error("Failed to update item quantity");
    }
  };


  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/carts/cart/${itemId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to remove item from cart");
      
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item from cart");
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    navigate("/order-placement", { state: { userId } });
  };

  useEffect(() => {
    if (isOpen && userId) {
      onCartUpdated();
    }
  }, [isOpen, userId, onCartUpdated]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        className="bg-white h-full w-full max-w-md flex flex-col"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          <AnimatePresence>
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <motion.div
                  key={item._id}
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
                          className="w-20 h-20 rounded-lg object-cover"
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
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => removeItem(item._id)}
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
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Your cart is empty
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t p-4 space-y-4 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fee</span>
              <span>€{serviceFee.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t flex justify-between font-semibold">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={proceedToCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout (€{total.toFixed(2)})
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPopup;