import * as express from "express";
import { placeOrder } from "../controllers/orderController";
import { getOrders } from "../controllers/orderRetrival";
const router = express.Router();

// Route to place order
router.post("/place-order", placeOrder);
router.get("/orders",getOrders)

export default router;
