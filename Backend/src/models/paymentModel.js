"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
    },
    method: {
        type: String,
        enum: ["Stripe", "PayPal"],
        required: true,
    },
    transactionId: {
        type: String,
        unique: true,
        required: true,
    },
}, { timestamps: true });
const Payment = mongoose_1.default.model("Payment", paymentSchema);
exports.default = Payment;
