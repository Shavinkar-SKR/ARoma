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
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: result.message });
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
    res.status(500).json({ error: "PayPal payment failed" });
  }
};
