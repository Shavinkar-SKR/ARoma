"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var paymentController_1 = require("../controllers/paymentController");
var router = express.Router();
router.post("/stripe", paymentController_1.handleStripePayment);
router.post("/paypal", paymentController_1.handlePayPalPayment);
exports.default = router;
