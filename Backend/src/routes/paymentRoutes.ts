// import express from "express";
// import {
//   handleStripePayment,
//   createPaymentIntent,
// } from "../controllers/paymentController";

// const router = express.Router();

// router.post("/stripe", handleStripePayment);
// router.post("/create-intent", createPaymentIntent);

// export default router;

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/pay/stripe", paymentController.processStripePayment);
router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);

export default router;
