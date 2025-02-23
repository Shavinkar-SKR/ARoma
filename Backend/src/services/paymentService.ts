/*
<<<<<<< Updated upstream
import Stripe from "stripe"; // imports the stripe SDK
import dotenv from "dotenv"; //Loads API keys from the .env file

=======
// imports the stripe SDK
const dotenv = require("dotenv"); //Loads API keys from the .env file
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
>>>>>>> Stashed changes
dotenv.config();

import Stripe from "stripe";
//Initializing stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia", //current Stripe API version
});

//Stripe Payment Function
export const processStripePayment = async (
  amount: number,
  currency: string,
  paymentMethodId: string
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, //convert to cents
      currency,
      payment_method: paymentMethodId,
      confirm: true,
    });
    return { success: true, client_secret: paymentIntent.client_secret };
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    return { success: false, message: (error as Error).message };
  }
};
*/

<<<<<<< Updated upstream
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/paymentModel");
=======
export const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
export const Payment = require("../models/paymentModel");
>>>>>>> Stashed changes

export const createStripePayment = async (
  amount: number,
  currency: string,
  userId: string
) => {
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

  return paymentIntent.client_secret;
};
