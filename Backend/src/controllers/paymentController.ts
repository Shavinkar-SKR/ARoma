// import { Request, Response, NextFunction } from "express";
// import {
//   processStripePayment,
//   createPayPalPayment,
// } from "../services/paymentService";
// import Stripe from "stripe";
// import dotenv from "dotenv";
/*
import { Request, Response } from "express";
import { stripe, processStripePayment } from "../services/paymentService";

const dotenv = require("dotenv");


/*
import { Request, Response } from "express";
import { stripe, processStripePayment } from "../services/paymentService";

<<<<<<< Updated upstream
const dotenv = require("dotenv");

// dotenv.config();

<<<<<<< Updated upstream
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
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

require("dotenv").config();
import { Request, Response } from "express";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PaymentService = require("../services/paymentService");
const Payment = require("../models/paymentModel");

export const processStripePayment = async (req: Request, res: Response) => {
=======
export const handleStripePayment = async (req: Request, res: Response) => {
>>>>>>> Stashed changes
  try {
    const { amount, currency, userId } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    const payment = new Payment({
      userId,
      amount,
      currency,
      status: "Pending",
      method: "Stripe",
      transactionId: paymentIntent.id,
    });
    await payment.save();

<<<<<<< Updated upstream
    res.status(200).json({ clientSecret: paymentIntent.client_secret });

=======
>>>>>>> Stashed changes
export const createPaymentIntent = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { amount } = req.body; // Amount should be in cents (e.g., $50.00 -> 5000)

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      
      automatic_payment_methods: {
        enabled: true, // Automatically select payment methods available for the user
        allow_redirects: "never", // Prevent redirections
      },
      //return_url: "http://localhost:3000/checkout-complete",
<<<<<<< Updated upstream
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
*/

require("dotenv").config();
import { Response, Request } from "express";
import { stripe, Payment } from "../services/paymentService";
import { connectDB } from "../config/dbConfig";
//import Payment from "../models/paymentModel";
const PaymentService = require("../services/paymentService");

export const processStripePayment = async (req: Request, res: Response) => {
  try {
    const { amount, currency, userId } = req.body;

    if (!amount || !currency || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    const db = await connectDB();
    const paymentsCollection = db.collection("payments");

    await paymentsCollection.insertOne({
      userId,
      amount,
      currency,
      status: "Pending",
      method: "Stripe",
      transactionId: paymentIntent.id,
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    return res
      .status(400)
      .send("Webhook Error: Missing stripe-signature header");
  }
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    await Payment.findOneAndUpdate(
      { transactionId: paymentIntent.id },
      { status: "Completed" }
    );
  }
  res.json({ received: true });
};
