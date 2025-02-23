"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var menuController_1 = require("../controllers/menuController");
var router = express_1.default.Router();
router.get("/:restaurantId", menuController_1.getMenuByRestaurant);
router.get("/search", menuController_1.searchMenuItems);
exports.default = router;
