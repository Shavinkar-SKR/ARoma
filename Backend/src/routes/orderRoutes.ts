import * as express from "express";

import { placeOrder,updateOrderStatus,deleteOrder } from "../controllers/orderController";
import { getOrders } from "../controllers/orderRetrievalController";
const router = express.Router();

router.post("/place-order", placeOrder);

router.get("/", getOrders);
router.put("/update-order-status/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);


export default router;
