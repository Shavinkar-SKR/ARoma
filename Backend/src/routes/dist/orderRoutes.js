"use strict";
exports.__esModule = true;
var express_1 = require("express");
var orderController_1 = require("../controllers/orderController");
var orderRetrievalController_1 = require("../controllers/orderRetrievalController");
var router = express_1["default"].Router();
router.post("/place-order", orderController_1.placeOrder);
router.get("/orders", orderRetrievalController_1.getOrders);
exports["default"] = router;
