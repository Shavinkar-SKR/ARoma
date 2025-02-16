"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as express from "express";
var orderController_1 = require("../controllers/orderController");
var express = require("express");
var router = express.Router();
// Route to place order
router.post("/place-order", orderController_1.placeOrder);
exports.default = router;
