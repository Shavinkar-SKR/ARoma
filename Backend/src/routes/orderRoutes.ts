import express from "express";
import { placeOrder } from "../controllers/orderController";
import { getOrders } from "../controllers/orderController";
const router = express.Router();

router.post("/place-order", placeOrder);
router.get("/orders",getOrders)
export default router;
