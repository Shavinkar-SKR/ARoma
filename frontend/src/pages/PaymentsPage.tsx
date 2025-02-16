import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PaymentsPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { total: number; cartItems: never; specialInstructions: string } | null;

  // If no state is passed (e.g., direct access), redirect to the Order Placement Page
  if (!state) {
    return <Navigate to="/" />;
  }

  const { total, cartItems, specialInstructions } = state;

  const handleProceedToPayment = async () => {
    const orderDetails = {
      cartItems, // These should contain the correct cart data
      specialInstructions,
      total,
    };
  
    // Log the orderDetails to verify it's correct before sending it to the backend
    console.log("Sending order details to backend:", orderDetails);
  
    try {
      const response = await fetch("http://localhost:5001/api/orders/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Order placed and saved to DB:", data);
        // Proceed to payment logic here (e.g., integrating a payment gateway)
      } else {
        console.error("Error saving order:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleProceedToPayment}>
                  Proceed to Payment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
