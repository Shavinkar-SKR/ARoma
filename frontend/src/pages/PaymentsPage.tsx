import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface LocationState {
  total: number;
  cartItems: unknown[];
  specialInstructions: string;
  tableNumber: string;
  orderStatus: string;
  estimatedTime: number;
}

const schema = yup.object().shape({
  cardNumber: yup
    .string()
    .required("Card number is required")
    .matches(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: yup
    .string()
    .required("Expiry date is required")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvc: yup
    .string()
    .required("CVC is required")
    .matches(/^\d{3}$/, "CVC must be 3 digits"),
});

const PaymentsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const { total, cartItems, specialInstructions, tableNumber, estimatedTime } =
    state || {};
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log("Estimated Time in Payments Page:", estimatedTime);
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log("Submitting card details:", data);

    try {
      const response = await fetch(
        "http://localhost:5001/api/orders/place-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cardNumber: data.cardNumber,
            expiryDate: data.expiryDate,
            cvc: data.cvc,
            total,
            tableNumber,
            specialInstructions,
            cartItems,
            estimatedTime,
          }),
        }
      );

      if (response.ok) {
        const orderData = await response.json();
        console.log("Order placed successfully:", orderData);
        navigate(`/order-status/${orderData._id}`, {
          state: {
            total,
            cartItems,
            specialInstructions,
            tableNumber,
            estimatedTime, // Pass estimatedTime to the order-status page
          },
        });
      } else {
        console.error("Error saving order:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>€{total?.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Table Number: {tableNumber}</p>
                  <p>Special Instructions: {specialInstructions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Details Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Controller
                    name="cardNumber"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Controller
                      name="expiryDate"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Input {...field} id="expiryDate" placeholder="MM/YY" />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Controller
                      name="cvc"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Input {...field} id="cvc" placeholder="123" />
                      )}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!isValid || isLoading}
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
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;