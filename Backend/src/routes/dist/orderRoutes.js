"use strict";
exports.__esModule = true;
var express_1 = require("express");
var orderController_1 = require("../controllers/orderController");
var router = express_1["default"].Router();
// Route to place order
router.post("/place-order", orderController_1.placeOrder);
exports["default"] = router;
