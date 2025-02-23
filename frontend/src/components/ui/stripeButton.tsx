import { useState } from "react";

const StripeButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/payment/create-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 5000 }), // Example: $50.00
        }
      );

      const { clientSecret } = await response.json();

      if (!clientSecret) throw new Error("Failed to create payment intent.");

      window.location.href = `https://checkout.stripe.com/pay/${clientSecret}`;
    } catch (err: any) {
      setError(err.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay with Stripe"}
      </button>
    </div>
  );
};

export default StripeButton;
