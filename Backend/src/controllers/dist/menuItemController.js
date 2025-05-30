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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
exports.deleteMenuItem = exports.updateMenuItem = exports.createMenuItem = void 0;
var dbConfig_1 = require("../config/dbConfig"); // Adjust path as needed
var mongodb_1 = require("mongodb");
// Create a new menu item
var createMenuItem = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var _a, name, price, restaurantId, db, newMenuItem, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, price = _a.price, restaurantId = _a.restaurantId;
                if (!name || !price || !restaurantId) {
                    return [2 /*return*/, res.status(400).json({ message: "Missing required fields" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, dbConfig_1.connectDB()];
            case 2:
                db = _b.sent();
                newMenuItem = {
                    name: name,
                    price: price,
                    restaurantId: new mongodb_1.ObjectId(restaurantId)
                };
                return [4 /*yield*/, db.collection('menus').insertOne(newMenuItem)];
            case 3:
                result = _b.sent();
                return [2 /*return*/, res.status(201).json({ message: 'Menu item created', menuItem: __assign({ _id: result.insertedId }, newMenuItem) })];
            case 4:
                error_1 = _b.sent();
                console.error("Error creating menu item:", error_1);
                return [2 /*return*/, res.status(500).json({ message: "Error creating menu item" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createMenuItem = createMenuItem;
// Update a menu item by ID
var updateMenuItem = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var id, _a, name, price, db, updatedData, result, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, name = _a.name, price = _a.price;
                if (!name && !price) {
                    return [2 /*return*/, res.status(400).json({ message: "No fields to update" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, dbConfig_1.connectDB()];
            case 2:
                db = _b.sent();
                updatedData = {};
                if (name)
                    updatedData.name = name;
                if (price)
                    updatedData.price = price;
                return [4 /*yield*/, db.collection('menus').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updatedData })];
            case 3:
                result = _b.sent();
                if (result.matchedCount === 0) {
                    return [2 /*return*/, res.status(404).json({ message: "Menu item not found" })];
                }
                return [2 /*return*/, res.json({ message: 'Menu item updated' })];
            case 4:
                error_2 = _b.sent();
                console.error("Error updating menu item:", error_2);
                return [2 /*return*/, res.status(500).json({ message: "Error updating menu item" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateMenuItem = updateMenuItem;
// Delete a menu item by ID
var deleteMenuItem = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var id, db, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, dbConfig_1.connectDB()];
            case 2:
                db = _a.sent();
                return [4 /*yield*/, db.collection('menus').deleteOne({ _id: new mongodb_1.ObjectId(id) })];
            case 3:
                result = _a.sent();
                if (result.deletedCount === 0) {
                    return [2 /*return*/, res.status(404).json({ message: "Menu item not found" })];
                }
                return [2 /*return*/, res.json({ message: 'Menu item deleted' })];
            case 4:
                error_3 = _a.sent();
                console.error("Error deleting menu item:", error_3);
                return [2 /*return*/, res.status(500).json({ message: "Error deleting menu item" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteMenuItem = deleteMenuItem;
