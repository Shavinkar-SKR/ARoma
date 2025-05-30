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
exports.processSplitBillPayment = exports.stripeWebhook = exports.processStripePayment = void 0;
require("dotenv").config();
var paymentService_1 = require("../services/paymentService");
var dbConfig_1 = require("../config/dbConfig");
var PaymentService = require("../services/paymentService");
exports.processStripePayment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cardNumber, expiryDate, cvc, amount, currency, userId, paymentIntent, db, paymentsCollection, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, cardNumber = _a.cardNumber, expiryDate = _a.expiryDate, cvc = _a.cvc, amount = _a.amount, currency = _a.currency, userId = _a.userId;
                console.log("Received payment request:", req.body);
                if (!cardNumber || !expiryDate || !cvc || !amount || !currency || !userId) {
                    return [2 /*return*/, res.status(400).json({ error: "Missing required fields" })];
                }
                console.log("Creating Stripe payment intent...");
                return [4 /*yield*/, paymentService_1.stripe.paymentIntents.create({
                        amount: amount,
                        currency: currency,
                        payment_method_types: ["card"]
                    })];
            case 1:
                paymentIntent = _b.sent();
                console.log("Payment intent created:", paymentIntent);
                return [4 /*yield*/, dbConfig_1.connectDB()];
            case 2:
                db = _b.sent();
                paymentsCollection = db.collection("payments");
                return [4 /*yield*/, paymentsCollection.insertOne({
                        userId: userId,
                        amount: amount,
                        currency: currency,
                        status: "Pending",
                        method: "Stripe",
                        transactionId: paymentIntent.id
                    })];
            case 3:
                result = _b.sent();
                console.log("Payment record inserted:", result.insertedId);
                res.status(200).json({ clientSecret: paymentIntent.client_secret });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error("Error processing payment:", error_1);
                res.status(500).json({ error: error_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.stripeWebhook = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sig, event, paymentIntent, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sig = req.headers["stripe-signature"];
                if (!sig) {
                    return [2 /*return*/, res
                            .status(400)
                            .send("Webhook Error: Missing stripe-signature header")];
                }
                try {
                    event = paymentService_1.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
                }
                catch (err) {
                    return [2 /*return*/, res.status(400).send("Webhook Error: " + err.message)];
                }
                if (!(event.type === "payment_intent.succeeded")) return [3 /*break*/, 4];
                paymentIntent = event.data.object;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, paymentService_1.Payment.findOneAndUpdate({ transactionId: paymentIntent.id }, { status: "Completed" })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error("Failed to update payment status:", err_1);
                return [3 /*break*/, 4];
            case 4:
                res.json({ received: true });
                return [2 /*return*/];
        }
    });
}); };
exports.processSplitBillPayment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, totalAmount, currency, userId, splitDetails, paymentIntents, _i, splitDetails_1, split, payerId, amount, paymentIntent, db, paymentsCollection, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, totalAmount = _a.totalAmount, currency = _a.currency, userId = _a.userId, splitDetails = _a.splitDetails;
                if (!totalAmount ||
                    !currency ||
                    !userId ||
                    !Array.isArray(splitDetails) ||
                    splitDetails.length === 0) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Missing required fields or invalid split details" })];
                }
                paymentIntents = [];
                _i = 0, splitDetails_1 = splitDetails;
                _b.label = 1;
            case 1:
                if (!(_i < splitDetails_1.length)) return [3 /*break*/, 6];
                split = splitDetails_1[_i];
                payerId = split.payerId, amount = split.amount;
                if (!payerId || !amount) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid split detail format" })];
                }
                return [4 /*yield*/, paymentService_1.stripe.paymentIntents.create({
                        amount: amount,
                        currency: currency,
                        payment_method_types: ["card"]
                    })];
            case 2:
                paymentIntent = _b.sent();
                return [4 /*yield*/, dbConfig_1.connectDB()];
            case 3:
                db = _b.sent();
                paymentsCollection = db.collection("payments");
                return [4 /*yield*/, paymentsCollection.insertOne({
                        userId: payerId,
                        amount: amount,
                        currency: currency,
                        status: "Pending",
                        method: "Stripe",
                        transactionId: paymentIntent.id
                    })];
            case 4:
                _b.sent();
                paymentIntents.push({
                    payerId: payerId,
                    clientSecret: paymentIntent.client_secret
                });
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6:
                res.status(200).json({
                    message: "Split payments initialized",
                    splitPayments: paymentIntents
                });
                return [3 /*break*/, 8];
            case 7:
                error_2 = _b.sent();
                res.status(500).json({ error: error_2.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
