import Stripe from "stripe"; // imports the stripe SDK
//import * as paypal from "paypal-rest-sdk"; // imports the paypal SDK
//import * as dotenv from "dotenv"; //Loads API keys from the .env file
const paypal = require("paypal-rest-sdk"); // imports the paypal SDK
require("dotenv").config(); // Loads API keys from the .env file

//Initializing stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia", //current Stripe API version
});

//Configure PayPal
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID as string,
  client_secret: process.env.PAYPAL_CLIENT_SECRET as string,
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
      payment_method_types: ["card"],
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // Optional: Prevents redirects from occurring
      },
      return_url: "http://localhost:3000/payment-success",
    });
    return { success: true, client_secret: paymentIntent.client_secret };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

//PayPal Payment Function
export const createPayPalPayment = async (amount: string, currency: string) => {
  const paymentData = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    transactions: [
      {
        amount: { total: amount, currency: currency },
        description: "Order payment",
      },
    ],
    redirect_urls: {
      return_url: "http://localhost:3000/payment-success",
      cancel_url: "http://localhost:3000/payment-cancel",
    },
  };

  return new Promise((resolve, reject) => {
    paypal.payment.create(paymentData, (error: Error, payment: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(payment);
      }
    });
  });
};
