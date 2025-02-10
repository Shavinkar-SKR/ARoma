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
  Receipt,
  CreditCard,
  Store,
} from "lucide-react";

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
  const serviceFee: number = 3.0;
  const [total, setTotal] = useState<number>(0);
  const apiBaseUrl = "http://localhost:5000"; // Change this to your mock server or API URL

  // Fetch cart items from the mock API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/cart`);
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }
        const data: CartItem[] = await response.json();
        setCartItems(data);
        updateTotals(data);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const updateTotals = (items: CartItem[]) => {
    const newSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + serviceFee);
  };

  const handleQuantityChange = async (id: number, delta: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(item.quantity + delta, 1) }
        : item
    );

    try {
      const updatedItem = updatedItems.find((item) => item.id === id);
      await fetch(`${apiBaseUrl}/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: updatedItem?.quantity }),
      });
      setCartItems(updatedItems);
      updateTotals(updatedItems);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await fetch(`${apiBaseUrl}/cart/${id}`, {
        method: "DELETE",
      });
      const updatedItems = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedItems);
      updateTotals(updatedItems);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const placeOrder = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          total,
          specialInstructions,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to place order");
      }
      console.log("Order placed successfully");
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Order Summary
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Review your order before checkout
              </p>
            </div>
            <Store className="h-10 w-10 text-primary" />
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr,380px]">
            <div className="space-y-6">
              {/* Cart Items */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="space-y-1">
                    <CardTitle>Your Cart</CardTitle>
                    <CardDescription>
                      Review and adjust your items
                    </CardDescription>
                  </div>
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 rounded-lg border p-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-md object-cover"
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
                            className="h-8 w-8"
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
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="w-24 text-right font-medium">
                          €{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Alert>
                      <AlertDescription>
                        Your cart is empty. Add some items to proceed with
                        checkout.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
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
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
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
                <CardFooter className="flex flex-col gap-4">
                  {cartItems.length > 0 ? (
                    <Button
                      size="lg"
                      onClick={placeOrder}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Place Order (€{total.toFixed(2)})
                    </Button>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        Your cart is empty. Add some items to proceed with
                        checkout.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlacementPage;
