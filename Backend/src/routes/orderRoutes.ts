const express = require("express");
import { placeOrder } from "../controllers/orderController";
import { getOrders } from "../controllers/orderRetrievalController";
const router = express.Router();

router.post("/place-order", placeOrder);
router.get("/", getOrders);
export default router;
