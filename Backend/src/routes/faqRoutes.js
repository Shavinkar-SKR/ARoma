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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FAQController_1 = __importDefault(require("../controllers/FAQController"));
const router = (0, express_1.Router)();
// Send an email
router.post("/send-email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield FAQController_1.default.sendEmail(req, res);
    }
    catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
}));
// Get all emails
router.get("/emails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield FAQController_1.default.getEmails(req, res);
    }
    catch (error) {
        console.error("Error fetching emails:", error);
        res.status(500).json({ message: "Error fetching emails" });
    }
}));
exports.default = router;
