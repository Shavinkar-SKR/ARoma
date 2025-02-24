// import { Request, Response, NextFunction } from "express";
// import {
//   processStripePayment,
//   createPayPalPayment,
// } from "../services/paymentService";
// import Stripe from "stripe";
// import dotenv from "dotenv";
// dotenv.config();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2025-01-27.acacia",
// });
// export const handleStripePayment = async (req: Request, res: Response) => {
//   try {
//     const { amount, currency, paymentMethodId } = req.body;
//     const result = await processStripePayment(
//       amount,
//       currency,
//       paymentMethodId
//     );
//     if (result.success) {
//       res.status(200).json(result);
//     } else {
//       res.status(400).json({ error: result.message });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Payment failed" });
//   }
// };
// export const handlePayPalPayment = async (req: Request, res: Response) => {
//   try {
//     const { amount, currency } = req.body;
//     const payment = await createPayPalPayment(amount, currency);
//     res.status(200).json(payment);
//   } catch (error) {
//     res.status(500).json({ error: "PayPal payment failed" });
//   }
// };
// export const createPaymentIntent = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<Response | undefined> => {
//   try {
//     const { amount } = req.body; // Amount should be in cents (e.g., $50.00 -> 5000)
//     if (!amount) {
//       return res.status(400).json({ error: "Amount is required" });
//     }
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//       payment_method_types: ["card"],
//     });
//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
