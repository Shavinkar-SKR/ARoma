"use strict";
exports.__esModule = true;
var express = require("express");
var orderController_1 = require("../controllers/orderController");
var orderRetrival_1 = require("../controllers/orderRetrival");
var router = express.Router();
// Route to place order
router.post("/place-order", orderController_1.placeOrder);
router.get("/orders", orderRetrival_1.getOrders);
exports["default"] = router;
