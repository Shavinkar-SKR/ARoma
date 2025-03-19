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
exports.resetPassword = void 0;
const db_1 = require("../config/db");
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    try {
        const db = yield (0, db_1.connectDB)();
        // Check if the user exists
        const user = yield db.collection("users").findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid email. Please sign up." });
            return;
        }
        // Validate password format
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            res.status(400).json({ message: "Password must be at least 8 characters long and include numbers, letters, and special characters." });
            return;
        }
        // Update the user's password
        yield db.collection("users").updateOne({ email }, { $set: { password: newPassword } });
        res.status(200).json({ message: "Password reset successful." });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.resetPassword = resetPassword;
