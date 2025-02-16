"use strict";
exports.__esModule = true;
exports.Order = void 0;
var mongoose_1 = require("mongoose");
var orderSchema = new mongoose_1.Schema({
    cartItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        },
    ],
    specialInstructions: { type: String, required: true },
    tableNumber: { type: String, required: true },
    total: { type: Number, required: true },
    createdAt: { type: Date, "default": Date.now }
});
var Order = mongoose_1["default"].model('Confirmed_order', orderSchema);
exports.Order = Order;
