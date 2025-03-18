"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resetPasswordController_1 = require("../controllers/resetPasswordController"); // Import the reset password controller
const router = (0, express_1.Router)();
// Reset password route
router.post("/reset-password", resetPasswordController_1.resetPassword);
exports.default = router;
