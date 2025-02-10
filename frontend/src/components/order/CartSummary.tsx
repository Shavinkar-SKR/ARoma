import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const CartSummary: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: "Spicy Tuna Roll", price: 14.99, quantity: 2 },
    { id: 2, name: "Margherita Pizza", price: 12.99, quantity: 1 },
  ]);

  const handleQuantityChange = (id: number, delta: number): void => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: number): void => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center py-3 border-b last:border-b-0"
        >
          <div>
            <h4 className="text-lg font-semibold">{item.name}</h4>
            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleQuantityChange(item.id, -1)}
            >
              -
            </Button>
            <span>{item.quantity}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleQuantityChange(item.id, 1)}
            >
              +
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleRemoveItem(item.id)}
            >
              Remove
            </Button>
          </div>
          <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default CartSummary;
