// import stripePackage from "stripe";
// import Payment from "../models/paymentModel";
// import { connectDB } from "../config/dbConfig";

// const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY!);

// export const createStripePayment = async (
//   amount: number,
//   currency: string,
//   userId: string
// ) => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount,
//     currency,
//     payment_method_types: ["card"],
//   });

//   const db = await connectDB();
//   const paymentsCollection = db.collection("payments");

//   await paymentsCollection.insertOne({
//     userId,
//     amount,
//     currency,
//     status: "Pending",
//     method: "Stripe",
//     transactionId: paymentIntent.id,
//   });

//   return paymentIntent.client_secret;
// };

// export { stripe, Payment };

// changes made in files 