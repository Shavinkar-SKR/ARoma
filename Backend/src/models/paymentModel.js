"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var paymentSchema = new mongoose_1.default.Schema({
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
var Payment = mongoose_1.default.model("Payment", paymentSchema);
exports.default = Payment;
