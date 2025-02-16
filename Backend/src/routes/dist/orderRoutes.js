"use strict";
exports.__esModule = true;
//import * as express from "express";
var orderController_1 = require("../controllers/orderController");
var router = express.Router();
// Route to place order
router.post("/place-order", orderController_1.placeOrder);
exports["default"] = router;
