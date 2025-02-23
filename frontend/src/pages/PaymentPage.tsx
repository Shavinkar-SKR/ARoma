//import { Elements } from "@stripe/react-stripe-js";
//import { stripePromise } from "../lib/stripe";
//import PaymentForm from "../components/ui/PaymentForm";
import StripeButton from "../components/ui/stripeButton";
import PayPalButton from "../components/ui/paypalButton";

/*
const PaymentsPage = () => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Secure Payment</h1>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
};

export default PaymentsPage;
*/

const PaymentsPage = () => {
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Choose Payment Method</h1>
      <StripeButton />
      <PayPalButton />
    </div>
  );
};

export default PaymentsPage;
