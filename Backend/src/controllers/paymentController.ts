import { Request, Response } from "express";
import {
  processStripePayment,
  createPayPalPayment,
} from "../services/paymentService";

export const handleStripePayment = async (req: Request, res: Response) => {
  try {
    const { amount, currency, paymentMethodId } = req.body;
    const result = await processStripePayment(
      amount,
      currency,
      paymentMethodId
    );

    if (result.success) {
      res.status(200).json(result); //Returns 200 OK if successful
    } else {
      res.status(400).json({ error: result.message }); //400 Bad Request if payment fails
    }
  } catch (error) {
    res.status(500).json({ error: "Payment failed" });
  }
};

export const handlePayPalPayment = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    const payment = await createPayPalPayment(amount, currency);
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Paypal payment failed" });
  }
};

export const paymentSuccessHandler = (req: Request, res: Response) => {
  // Stripe sends a 'payment_intent' and 'payment_method' in the query params
  const { payment_intent } = req.query;

  // You can retrieve details of the payment_intent if needed
  // Here, you can handle any post-payment actions like sending a confirmation email, updating the order status, etc.
  res.status(200).json({
    message: "Payment successful!",
    payment_intent,
  });
};
