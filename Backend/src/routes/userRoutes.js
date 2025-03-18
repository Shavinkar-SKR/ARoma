"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
console.log("Imported signUp function:", userController_1.signUp);
const router = (0, express_1.Router)();
// Sign-up route
router.post("/signup", userController_1.signUp);
exports.default = router;
