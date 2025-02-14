import express from "express";
import {
  handleStripePayment,
  handlePayPalPayment,
} from "../controllers/paymentController";

const router = express.Router();

router.post("/stripe", handleStripePayment);
router.post("/paypal", handlePayPalPayment);

export default router;
