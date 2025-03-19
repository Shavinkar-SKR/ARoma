"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var loginController_1 = require("../controllers/loginController");
var router = (0, express_1.Router)();
// Login route
router.post("/login", loginController_1.login);
exports.default = router;
