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
exports.getOrderById = exports.getOrders = void 0;
var dbConfig_1 = require("../config/dbConfig"); // Import the connectDB utility
var mongodb_1 = require("mongodb"); // Add this import
// Function to retrieve all orders
exports.getOrders = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var db, ordersCollection, orders, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, dbConfig_1.connectDB()];
            case 1:
                db = _a.sent();
                ordersCollection = db.collection("orders");
                return [4 /*yield*/, ordersCollection.find().toArray()];
            case 2:
                orders = _a.sent();
                // Return the orders in the response
                res.status(200).json(orders);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error fetching orders:", error_1);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getOrderById = function (req, res) { return __awaiter(void 0, void 0, Promise, function () {
    var id, db, ordersCollection, objectId, order, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                if (!mongodb_1.ObjectId.isValid(id)) {
                    res.status(400).json({ message: "Invalid order ID format" });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, dbConfig_1.connectDB()];
            case 2:
                db = _a.sent();
                ordersCollection = db.collection("orders");
                objectId = new mongodb_1.ObjectId(id);
                return [4 /*yield*/, ordersCollection.findOne({ _id: objectId })];
            case 3:
                order = _a.sent();
                if (!order) {
                    res.status(404).json({ message: "Order not found" });
                    return [2 /*return*/];
                }
                res.status(200).json(order);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error("Error fetching order:", error_2);
                res.status(500).json({ message: "Failed to fetch order", error: error_2 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
