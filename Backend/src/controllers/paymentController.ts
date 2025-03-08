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

    const clientSecret = await PaymentService.createStripePayment(
      amount,
      currency,
      userId
    );

    res.status(200).json({ clientSecret });
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
    try {
      await Payment.findOneAndUpdate(
        { transactionId: paymentIntent.id },
        { status: "Completed" }
      );
    } catch (err) {
      console.error("Failed to update payment status:", err);
    }
  }
  res.json({ received: true });
};

export const processSplitBillPayment = async (req: Request, res: Response) => {
  try {
    const { totalAmount, currency, userId, splitDetails } = req.body;

    if (
      !totalAmount ||
      !currency ||
      !userId ||
      !Array.isArray(splitDetails) ||
      splitDetails.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields or invalid split details" });
    }

    const paymentIntents = [];

    for (const split of splitDetails) {
      const { payerId, amount } = split;

      if (!payerId || !amount) {
        return res.status(400).json({ error: "Invalid split detail format" });
      }

      // Create a separate PaymentIntent for each payer
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ["card"],
      });

      const db = await connectDB();
      const paymentsCollection = db.collection("payments");

      await paymentsCollection.insertOne({
        userId: payerId,
        amount,
        currency,
        status: "Pending",
        method: "Stripe",
        transactionId: paymentIntent.id,
      });

      paymentIntents.push({
        payerId,
        clientSecret: paymentIntent.client_secret,
      });
    }

    res.status(200).json({
      message: "Split payments initialized",
      splitPayments: paymentIntents,
    });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};