"use strict";
exports.__esModule = true;
var express_1 = require("express");
var paymentController_1 = require("../controllers/paymentController");
var router = express_1["default"].Router();
router.post("/stripe", paymentController_1.handleStripePayment);
router.post("/paypal", paymentController_1.handlePayPalPayment);
router.post("/create-intent", paymentController_1.createPaymentIntent);
exports["default"] = router;
