// import express from "express";
// import {
//   handleStripePayment,
//   createPaymentIntent,
// } from "../controllers/paymentController";

// const router = express.Router();

// router.post("/stripe", handleStripePayment);
// router.post("/create-intent", createPaymentIntent);

// export default router;

/*
import {
  handleStripePayment,
  createPaymentIntent,
} from "../controllers/paymentController";

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");


router.post("/pay/stripe", paymentController.processStripePayment);
router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);
=======
router.post("/stripe", handleStripePayment);
router.post("/create-intent", createPaymentIntent);
>>>>>>> Stashed changes

export default router;
*/

const express = require("express");
const router = express.Router();
import * as paymentController from "../controllers/paymentController";

router.post("/pay/stripe", paymentController.processStripePayment);
router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);

export default router;
