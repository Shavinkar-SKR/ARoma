//import * as express from "express";
import { placeOrder } from "../controllers/orderController";
<<<<<<< HEAD
import { getOrders } from "../controllers/orderController";
=======

const express = require("express");
>>>>>>> 848f4b1d4ba95c88bcc3b993110908b1ecaa9b17
const router = express.Router();

router.post("/place-order", placeOrder);
router.get("/orders",getOrders)
export default router;
