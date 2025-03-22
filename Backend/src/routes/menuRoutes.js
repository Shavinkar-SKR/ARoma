"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var menuController_1 = require("../controllers/menuController");
var router = express.Router();
router.get("/", menuController_1.getMenu);
router.get("/search", menuController_1.searchMenuItems);
router.get("/:restaurantId", menuController_1.getMenuByRestaurant);
exports.default = router;
