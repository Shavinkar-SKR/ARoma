import React from "react";
import { Separator } from "@/components/ui/separator";

const OrderSummary: React.FC = () => {
  const subtotal = 42.97; // Replace with dynamic subtotal calculation
  const serviceFee = 3.0;
  const total = subtotal + serviceFee;

  return (
    <div className="bg-white shadow rounded-md p-6">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <p>Subtotal:</p>
          <p>€{subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Service Fee:</p>
          <p>€{serviceFee.toFixed(2)}</p>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <p>Total:</p>
          <p>€{total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
