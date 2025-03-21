"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userController_1 = require("../controllers/userController");
var userProfileRoutes_1 = require("./userProfileRoutes");
console.log("Imported signUp function:", userController_1.signUp);
var router = (0, express_1.Router)();
// Sign-up route
router.post("/signup", userController_1.signUp);
router.use("/user", userProfileRoutes_1.default);
exports.default = router;
