"use strict";
<<<<<<< HEAD
Object.defineProperty(exports, "__esModule", { value: true });
//import * as express from "express";
var orderController_1 = require("../controllers/orderController");
var express = require("express");
var router = express.Router();
=======
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
>>>>>>> parent of cff5b68 (orderstaus page and admin page)
// Route to place order
router.post("/place-order", orderController_1.placeOrder);
exports.default = router;
