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
exports.removeFromCart = exports.updateCartItem = exports.getCarts = exports.addToCart = void 0;
const mongodb_1 = require("mongodb");
const dbConfig_1 = require("../config/dbConfig");
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const cartsCollection = db.collection("carts");
        const { name, price, quantity, image, userId } = req.body;
        const cartItem = {
            name,
            price,
            quantity,
            image,
            userId,
        };
        const result = yield cartsCollection.insertOne(cartItem);
        res.status(201).json(Object.assign(Object.assign({}, cartItem), { _id: result.insertedId }));
    }
    catch (error) {
        res.status(500).json({ error: "Failed to add item to cart" });
    }
});
exports.addToCart = addToCart;
const getCarts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const cartsCollection = db.collection("carts");
        const { userId } = req.params;
        const cartItems = yield cartsCollection.find({ userId }).toArray();
        res.status(200).json(cartItems);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch cart items" });
    }
});
exports.getCarts = getCarts;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const cartsCollection = db.collection("carts");
        const { itemId } = req.params;
        const { quantity } = req.body;
        const result = yield cartsCollection.updateOne({ _id: new mongodb_1.ObjectId(itemId) }, { $set: { quantity } });
        if (result.matchedCount === 0) {
            res.status(404).json({ error: "Item not found in cart" });
            return;
        }
        res.status(200).json({ message: "Cart item updated" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update cart item" });
    }
});
exports.updateCartItem = updateCartItem;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const cartsCollection = db.collection("carts");
        const { itemId } = req.params;
        const result = yield cartsCollection.deleteOne({
            _id: new mongodb_1.ObjectId(itemId),
        });
        if (result.deletedCount === 0) {
            res.status(404).json({ error: "Item not found in cart" });
            return;
        }
        res.status(200).json({ message: "Item removed from cart" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to remove item from cart" });
    }
});
exports.removeFromCart = removeFromCart;
