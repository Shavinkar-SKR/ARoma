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
//import express from "express";
var bodyParser = require("body-parser");
//import cors from "cors"; // Import the cors package
var dotenv = require("dotenv");
var paymentRoutes_1 = require("./routes/paymentRoutes");
var orderRoutes_1 = require("./routes/orderRoutes"); // Import your order routes
var dbConfig_1 = require("./config/dbConfig");
var express = require("express");
var cors = require("cors");
dotenv.config(); // Load environment variables from a .env file
var app = express();
var PORT = process.env.PORT || 5001; // You can set this to 5001 or any other port you need
// Enable CORS for all origins or restrict it to specific domains
app.use(cors({
    origin: "http://localhost:5173", // Allow requests only from this origin (your frontend)
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allow the necessary HTTP methods
    allowedHeaders: ["Content-Type"], // Allow Content-Type header
}));
app.use(bodyParser.json()); // Parse incoming JSON requests
// Use the order routes for order-related endpoints
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/payment", paymentRoutes_1.default);
// Connect to the database and then start the server
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                _a.sent();
                console.log("Connected to the database");
                app.listen(PORT, function () {
                    console.log("Server is running on port ".concat(PORT));
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Failed to connect to the database:", error_1);
                process.exit(1); // Exit the process if DB connection fails
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Start the server and connect to the database
startServer();
