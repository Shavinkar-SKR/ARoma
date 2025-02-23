import { useEffect, useRef } from "react";

declare global {
  interface Window {
    paypal: any;
  }
}

const PayPalButton = () => {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paypalRef.current) return;

    window.paypal
      .Buttons({
        createOrder: async () => {
          const response = await fetch(
            "http://localhost:5000/api/payment/paypal-order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: 50.0 }), // Example: $50.00
            }
          );

          const { orderID } = await response.json();
          return orderID;
        },
        onApprove: async (data: any) => {
          await fetch("http://localhost:5000/api/payment/paypal-capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID }),
          });

          alert("Payment successful!");
        },
      })
      .render(paypalRef.current);
  }, []);

  return <div ref={paypalRef}></div>;
};

export default PayPalButton;
