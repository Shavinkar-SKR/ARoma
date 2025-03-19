"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var resetPasswordController_1 = require("../controllers/resetPasswordController"); // Import the reset password controller
var router = (0, express_1.Router)();
// Reset password route
router.post("/reset-password", resetPasswordController_1.resetPassword);
exports.default = router;
