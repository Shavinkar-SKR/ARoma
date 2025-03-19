"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var restaurantController_1 = require("../controllers/restaurantController");
var router = express.Router();
router.get("/", restaurantController_1.getAllRestaurants);
router.get("/search", restaurantController_1.searchRestaurants);
exports.default = router;
