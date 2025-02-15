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
exports.createPayPalPayment = exports.processStripePayment = void 0;
var stripe_1 = require("stripe"); // imports the stripe SDK
//import * as paypal from "paypal-rest-sdk"; // imports the paypal SDK
//import * as dotenv from "dotenv"; //Loads API keys from the .env file
var paypal = require("paypal-rest-sdk"); // PayPal SDK
require("dotenv").config(); // Loads API keys from the .env file
//dotenv.config();
//Initializing stripe
var stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia", //current Stripe API version
});
//Configure PayPal
paypal.configure({
    mode: "sandbox",
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
});
//Stripe Payment Function
var processStripePayment = function (amount, currency, paymentMethodId) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentIntent, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, stripe.paymentIntents.create({
                        amount: amount * 100, //convert to cents
                        currency: currency,
                        payment_method: paymentMethodId,
                        confirm: true,
                    })];
            case 1:
                paymentIntent = _a.sent();
                return [2 /*return*/, { success: true, client_secret: paymentIntent.client_secret }];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, { success: false, message: error_1.message }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.processStripePayment = processStripePayment;
//PayPal Payment Function
var createPayPalPayment = function (amount, currency) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentData;
    return __generator(this, function (_a) {
        paymentData = {
            intent: "sale",
            payer: { payment_method: "paypal" },
            transactions: [
                {
                    amount: { total: amount, currency: currency },
                    description: "Order payment",
                },
            ],
            redirect_urls: {
                return_url: "http://localhost:3000/payment-success",
                cancel_url: "http://localhost:3000/payment-cancel",
            },
        };
        return [2 /*return*/, new Promise(function (resolve, reject) {
                paypal.payment.create(paymentData, function (error, payment) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(payment);
                    }
                });
            })];
    });
}); };
exports.createPayPalPayment = createPayPalPayment;
