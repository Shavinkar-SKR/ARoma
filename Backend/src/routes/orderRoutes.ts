//import * as express from "express";
import { placeOrder } from "../controllers/orderController";

const express = require("express");
const router = express.Router();

// Route to place order
router.post("/place-order", placeOrder);

export default router;
