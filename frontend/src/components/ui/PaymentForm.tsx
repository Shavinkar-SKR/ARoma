import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const response = await fetch(
      "http://localhost:5000/api/payment/create-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000 }), // Amount in cents (e.g., $50.00)
      }
    );

    const { clientSecret } = await response.json();

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement!,
        },
      }
    );

    if (error) {
      setError(error.message || "Payment failed.");
    } else if (paymentIntent?.status === "succeeded") {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-2 border rounded-md" />
      {error && <p className="text-red-500">{error}</p>}
      {success ? (
        <p className="text-green-500">Payment Successful!</p>
      ) : (
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      )}
    </form>
  );
};

export default PaymentForm;
