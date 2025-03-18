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
const faq_1 = __importDefault(require("../models/faq"));
class FAQController {
    static sendEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, userType, message } = req.body;
            try {
                // Save the email details to the database
                const emailRecord = new faq_1.default({ email, userType, message });
                yield emailRecord.save();
                res.status(200).json({ message: "Email sent successfully!" });
            }
            catch (error) {
                console.error("Error sending email:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    static getEmails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emails = yield faq_1.default.find().sort({ timestamp: 1 });
                res.status(200).json(emails);
            }
            catch (error) {
                console.error("Error fetching emails:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
}
exports.default = FAQController;
