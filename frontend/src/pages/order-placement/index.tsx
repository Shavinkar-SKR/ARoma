import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, Minus, Plus, Trash2, ChefHat, Receipt, CreditCard } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const OrderPlacementPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const [subtotal, setSubtotal] = useState<number>(0);
  const serviceFee: number = 3.0;
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchedCart: CartItem[] = [
      { id: 1, name: "Spicy Tuna Roll", price: 14.99, quantity: 2 },
      { id: 2, name: "Margherita Pizza", price: 12.99, quantity: 1 },
    ];
    setCartItems(fetchedCart);
    updateTotals(fetchedCart);
  }, []);

  const updateTotals = (items: CartItem[]) => {
    const newSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + serviceFee);
  };

  const handleQuantityChange = (id: number, delta: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(item.quantity + delta, 1) } : item
    );
    setCartItems(updatedItems);
    updateTotals(updatedItems);
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    updateTotals(updatedItems);
  };

  const placeOrder = () => {
    console.log("Order placed:", { cartItems, total, specialInstructions });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Order Summary</h1>
          <ShoppingCart className="h-8 w-8 text-primary" />
        </div>

        {/* Cart Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart
            </CardTitle>
            <CardDescription>Review and adjust your items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">€{item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <p className="w-24 text-right font-medium">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Special Instructions
            </CardTitle>
            <CardDescription>Add any dietary preferences or special requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="E.g., allergies, preparation preferences, or delivery instructions..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span>€{serviceFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {cartItems.length > 0 ? (
          <div className="flex justify-end gap-4">
            <Button size="lg" variant="outline">
              Save for Later
            </Button>
            <Button
              size="lg"
              onClick={placeOrder}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </Button>
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              Your cart is empty. Add some items to proceed with checkout.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default OrderPlacementPage;