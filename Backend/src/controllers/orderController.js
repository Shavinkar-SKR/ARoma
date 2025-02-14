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
exports.placeOrder = void 0;
const dbConfig_1 = require("../config/dbConfig");
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartItems, specialInstructions, total } = req.body;
    const order = {
        cartItems,
        specialInstructions,
        total,
        status: "Pending", // Initial status
    };
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const ordersCollection = db.collection("orders");
        const result = yield ordersCollection.insertOne(order);
        res.status(201).json({ message: "Order placed and saved successfully", orderId: result.insertedId });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: "Failed to place order", error: error.message });
        }
        else {
            res.status(500).json({ message: "Failed to place order", error: "Unknown error" });
        }
    }
});
exports.placeOrder = placeOrder;
