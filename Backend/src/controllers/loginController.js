"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const db_1 = require("../config/db");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log("Received login request:", { email, password });
    try {
        const db = yield (0, db_1.connectDB)();
        console.log("Attempting to find user...");
        // Check if the user exists
        const user = yield db.collection("users").findOne({ email });
        console.log("User found:", user);
        if (!user) {
            // Email doesn't exist
            console.log("Email not found");
            res.status(400).json({ success: false, message: "Email not found. Please sign up." });
            return;
        }
        // Compare passwords (assuming passwords are stored as plain text for now)
        console.log("Comparing passwords...");
        if (user.password !== password) {
            // Password is incorrect
            console.log("Invalid password");
            res.status(400).json({ success: false, message: "Invalid password. Please try again." });
            return;
        }
        // Login successful
        console.log("Login successful");
        res.status(200).json({ success: true, message: "Login successful", user });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.login = login;
