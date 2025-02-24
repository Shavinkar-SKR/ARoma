<<<<<<< HEAD
import * as express from "express";
=======
const express = require("express");
>>>>>>> 902c5992f1b0a0fdc843bc1b9dbffb4a12f0b1c6
import { placeOrder } from "../controllers/orderController";
import { getOrders } from "../controllers/orderRetrievalController";
const router = express.Router();

router.post("/place-order", placeOrder);
router.get("/", getOrders);
export default router;
