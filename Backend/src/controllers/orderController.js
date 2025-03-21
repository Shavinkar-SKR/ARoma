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
exports.fetchOrderHistory = exports.updateOrderStatus = exports.getOrders = exports.deleteOrder = exports.placeOrder = void 0;
var mongodb_1 = require("mongodb");
var dbConfig_1 = require("../config/dbConfig"); // Import the connectDB utility
// Function to place an order
var placeOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cartItems, specialInstructions, total, tableNumber, db, ordersCollection, newOrder, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, cartItems = _a.cartItems, specialInstructions = _a.specialInstructions, total = _a.total, tableNumber = _a.tableNumber;
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db = _b.sent();
                ordersCollection = db.collection("orders");
                newOrder = {
                    cartItems: cartItems,
                    specialInstructions: specialInstructions,
                    total: total,
                    tableNumber: tableNumber,
                    status: "received", // Default status
                };
                return [4 /*yield*/, ordersCollection.insertOne(newOrder)];
            case 2:
                result = _b.sent();
                // Return the response with _id (insertedId) instead of orderId
                res.status(201).json({
                    message: "Order placed successfully",
                    _id: result.insertedId, // Use _id to be consistent with MongoDB
                    status: newOrder.status, // Include status in the response
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error("Error placing order:", error_1);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.placeOrder = placeOrder;
// Function to delete an order
var deleteOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, db, ordersCollection, objectId, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                // Validate the ID
                if (!mongodb_1.ObjectId.isValid(id)) {
                    res.status(400).json({ message: "Invalid order ID" });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 2:
                db = _a.sent();
                ordersCollection = db.collection("orders");
                objectId = new mongodb_1.ObjectId(id);
                return [4 /*yield*/, ordersCollection.deleteOne({ _id: objectId })];
            case 3:
                result = _a.sent();
                // Check if the order was found and deleted
                if (result.deletedCount === 0) {
                    res.status(404).json({ message: "Order not found" });
                    return [2 /*return*/];
                }
                // Respond with a success message
                res.status(200).json({ message: "Order deleted successfully" });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error("Error deleting order:", error_2);
                res.status(500).json({ message: "Failed to delete order", error: error_2 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteOrder = deleteOrder;
// Function to get all orders
var getOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, ordersCollection, orders, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db = _a.sent();
                ordersCollection = db.collection("orders");
                return [4 /*yield*/, ordersCollection.find().toArray()];
            case 2:
                orders = _a.sent();
                res.status(200).json(orders);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error fetching orders:", error_3);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getOrders = getOrders;
// Function to update order status
var updateOrderStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, status, db, ordersCollection, objectId, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                status = req.body.status;
                // Validate status is present in the request
                if (!status) {
                    res.status(400).json({ message: "Status is required" });
                    return [2 /*return*/];
                }
                // Validate the ID format
                if (!mongodb_1.ObjectId.isValid(id)) {
                    res.status(400).json({ message: "Invalid order ID format" });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 2:
                db = _a.sent();
                ordersCollection = db.collection("orders");
                objectId = new mongodb_1.ObjectId(id);
                // Log the ID to ensure it's in the correct format
                console.log("ID to update:", id);
                return [4 /*yield*/, ordersCollection.findOneAndUpdate({ _id: objectId }, // Find by ObjectId
                    { $set: { status: status } }, // Set the new status
                    { returnDocument: "after" } // Return the updated document after the update
                    )];
            case 3:
                result = _a.sent();
                // Log the result of the update operation
                console.log("Update result:", result);
                // Check if result is null or doesn't have a value
                if (!result || !result.value) {
                    // If no order was found or updated, return 404
                    res.status(404).json({ message: "Order not found" });
                    return [2 /*return*/];
                }
                // Emit the updated order to all connected clients (real-time update)
                //emitOrderUpdate(result.value);
                // Respond with the updated order
                res.status(200).json(result.value);
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error("Error updating order status:", error_4);
                res.status(500).json({ message: "Failed to update order status", error: error_4 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateOrderStatus = updateOrderStatus;
var fetchOrderHistory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, db, orders, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 2:
                db = _a.sent();
                return [4 /*yield*/, db
                        .collection("orders")
                        .find({ userId: new mongodb_1.ObjectId(userId) })
                        .toArray()];
            case 3:
                orders = _a.sent();
                res.status(200).json(orders);
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error("Error fetching order history:", error_5);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.fetchOrderHistory = fetchOrderHistory;
