"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var orderSchema = new mongoose_1.Schema({
    cartItems: [
        {
            id: Number,
            name: String,
            price: Number,
            quantity: Number,
            image: String,
        },
    ],
    specialInstructions: String,
    total: Number,
    tableNumber: String,
    status: {
        type: String,
        enum: ["received", "preparing", "ready", "complete"],
        default: "received",
    },
});
var Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
