"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromCart = exports.updateCartItem = exports.getCarts = exports.addToCart = void 0;
var mongodb_1 = require("mongodb");
var dbConfig_1 = require("../config/dbConfig");
var addToCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, cartsCollection, _a, name_1, price, quantity, image, userId, cartItem, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db = _b.sent();
                cartsCollection = db.collection("carts");
                _a = req.body, name_1 = _a.name, price = _a.price, quantity = _a.quantity, image = _a.image, userId = _a.userId;
                cartItem = {
                    name: name_1,
                    price: price,
                    quantity: quantity,
                    image: image,
                    userId: userId,
                };
                return [4 /*yield*/, cartsCollection.insertOne(cartItem)];
            case 2:
                result = _b.sent();
                res.status(201).json(__assign(__assign({}, cartItem), { _id: result.insertedId }));
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.status(500).json({ error: "Failed to add item to cart" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addToCart = addToCart;
var getCarts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, cartsCollection, userId, cartItems, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db = _a.sent();
                cartsCollection = db.collection("carts");
                userId = req.params.userId;
                return [4 /*yield*/, cartsCollection.find({ userId: userId }).toArray()];
            case 2:
                cartItems = _a.sent();
                res.status(200).json(cartItems);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(500).json({ error: "Failed to fetch cart items" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCarts = getCarts;
var updateCartItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, cartsCollection, itemId, quantity, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db = _a.sent();
                cartsCollection = db.collection("carts");
                itemId = req.params.itemId;
                quantity = req.body.quantity;
                return [4 /*yield*/, cartsCollection.updateOne({ _id: new mongodb_1.ObjectId(itemId) }, { $set: { quantity: quantity } })];
            case 2:
                result = _a.sent();
                if (result.matchedCount === 0) {
                    res.status(404).json({ error: "Item not found in cart" });
                    return [2 /*return*/];
                }
                res.status(200).json({ message: "Cart item updated" });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).json({ error: "Failed to update cart item" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateCartItem = updateCartItem;
var removeFromCart = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, cartsCollection, itemId, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db = _a.sent();
                cartsCollection = db.collection("carts");
                itemId = req.params.itemId;
                return [4 /*yield*/, cartsCollection.deleteOne({
                        _id: new mongodb_1.ObjectId(itemId),
                    })];
            case 2:
                result = _a.sent();
                if (result.deletedCount === 0) {
                    res.status(404).json({ error: "Item not found in cart" });
                    return [2 /*return*/];
                }
                res.status(200).json({ message: "Item removed from cart" });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(500).json({ error: "Failed to remove item from cart" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.removeFromCart = removeFromCart;
