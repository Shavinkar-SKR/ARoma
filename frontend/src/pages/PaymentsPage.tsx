import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

// Define the type for the state from the Location object
interface LocationState {
  total: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cartItems: any[]; // You can further define the shape of cartItems if needed
  specialInstructions: string;
  tableNumber: string;
}

const PaymentsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | null;

  if (!state) {
    return <Navigate to="/" />;
  }

  const { total, cartItems, specialInstructions, tableNumber } = state;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleProceedToPayment = async () => {
    setIsLoading(true);

    const orderDetails = {
      cartItems,
      specialInstructions, // Pass specialInstructions without the table number
      total,
      tableNumber, // Pass tableNumber as a separate field
    };

    console.log("Sending order details to backend:", orderDetails);

    try {
      const response = await fetch(
        "http://localhost:5001/api/orders/place-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetails),
        }
      );

      if (response.ok) {
        console.log("Order placed and saved to DB:", orderDetails);
        navigate("/order-status");
      } else {
        console.error("Error saving order:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
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
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleProceedToPayment}
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 mr-2" />{" "}
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
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
