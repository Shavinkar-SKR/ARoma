"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var paymentController = require("../controllers/paymentController");
router.post("/pay/stripe", paymentController.processStripePayment);
router.post("/split-bill", paymentController.processSplitBillPayment);
router.post("/webhook/stripe", express.raw({ type: "application/json" }), paymentController.stripeWebhook);
exports.default = router;
