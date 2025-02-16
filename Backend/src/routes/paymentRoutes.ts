import * as express from "express";
import {
  handleStripePayment,
  handlePayPalPayment,
  paymentSuccessHandler,
} from "../controllers/paymentController";

const router = express.Router();

router.post("/stripe", handleStripePayment);
router.post("/paypal", handlePayPalPayment);
router.get("/payment-success", paymentSuccessHandler);

export default router;
