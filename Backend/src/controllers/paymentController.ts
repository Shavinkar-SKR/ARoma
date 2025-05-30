require("dotenv").config();
import { Response, Request } from "express";
import { stripe, Payment } from "../services/paymentService";
import { connectDB } from "../config/dbConfig";
const PaymentService = require("../services/paymentService");

export const processStripePayment = async (req: Request, res: Response) => {
  try {
    const { cardNumber, expiryDate, cvc, amount, currency, userId } = req.body;
    console.log("Received payment request:", req.body);

    if (!cardNumber || !expiryDate || !cvc || !amount || !currency || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Creating Stripe payment intent...");
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });
    console.log("Payment intent created:", paymentIntent);

    const db = await connectDB();
    const paymentsCollection = db.collection("payments");

    const result = await paymentsCollection.insertOne({
      userId,
      amount,
      currency,
      status: "Pending",
      method: "Stripe",
      transactionId: paymentIntent.id,
    });
    console.log("Payment record inserted:", result.insertedId);

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error processing payment:", error);
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
