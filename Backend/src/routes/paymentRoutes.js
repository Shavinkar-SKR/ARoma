"use strict";
/*
import {
  handleStripePayment,
  createPaymentIntent,
} from "../controllers/paymentController";

const express = require("express");
const router = express.Router();

router.post("/stripe", handleStripePayment);
router.post("/create-intent", createPaymentIntent);

export default router;
*/
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var paymentController = require("../controllers/paymentController");
router.post("/pay/stripe", paymentController.processStripePayment);
router.post("/webhook/stripe", express.raw({ type: "application/json" }), paymentController.stripeWebhook);
exports.default = router;
