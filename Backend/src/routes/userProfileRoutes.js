"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userProfileController_1 = require("../controllers/userProfileController");
var authMiddleware_1 = require("../middleware/authMiddleware"); // Assuming you have an auth middleware
var router = (0, express_1.Router)();
// Fetch user profile
router.get("/:userId", authMiddleware_1.authMiddleware, userProfileController_1.fetchUserProfile);
// Update user profile
router.put("/:userId", authMiddleware_1.authMiddleware, userProfileController_1.updateUserProfile);
exports.default = router;
