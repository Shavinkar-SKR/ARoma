"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var OrderSchema = new mongoose_1.Schema({
    cartItems: { type: Array, required: true },
    specialInstructions: { type: String, required: true },
    tableNumber: { type: String, required: true },
    total: { type: Number, required: true },
    status: { type: String, "default": 'pending' },
    createdAt: { type: Date, "default": Date.now }
});
exports["default"] = mongoose_1["default"].model('ConfirmedOrder', OrderSchema);
