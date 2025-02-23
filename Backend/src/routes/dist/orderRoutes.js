"use strict";
exports.__esModule = true;
var express = require("express");
var orderController_1 = require("../controllers/orderController");
var orderRetrievalController_1 = require("../controllers/orderRetrievalController");
var router = express.Router();
router.post("/place-order", orderController_1.placeOrder);
router.get("/", orderRetrievalController_1.getOrders);
exports["default"] = router;
