"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var restaurantController_js_1 = require("../controllers/restaurantController.js");
//const express = require("express");
var router = express_1.default.Router();
router.get("/", restaurantController_js_1.getAllRestaurants);
router.get("/search", restaurantController_js_1.searchRestaurants);
exports.default = router;
