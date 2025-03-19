"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var salesController_1 = require("../controllers/salesController");
var router = (0, express_1.Router)();
router.get("/", salesController_1.getSalesAnalytics);
exports.default = router;
