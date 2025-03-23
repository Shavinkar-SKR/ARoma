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
var cors = require("cors");
var express_1 = require("express");
var http_1 = require("http");
var mongodb_1 = require("mongodb");
var cartRoutes_1 = require("./routes/cartRoutes");
var orderRoutes_1 = require("./routes/orderRoutes");
var restaurantRoutes_1 = require("./routes/restaurantRoutes");
var menuRoutes_1 = require("./routes/menuRoutes");
var dotenv = require("dotenv");
var restaurantMenuRoutes_1 = require("./routes/restaurantMenuRoutes");
var feedbackRoutes_1 = require("./routes/feedbackRoutes");
var serviceRequestRoutes_1 = require("./routes/serviceRequestRoutes");
var salesRoutes_1 = require("./routes/salesRoutes");
var staffRoutes_1 = require("./routes/staffRoutes");
var userRoutes_1 = require("./routes/userRoutes");
var loginRoutes_1 = require("./routes/loginRoutes");
var resetPasswordRoutes_1 = require("./routes/resetPasswordRoutes");
// import payment from './routes/paymentRoutes'
var userController_1 = require("./controllers/userController");
console.log("Direct import test:", userController_1.signUp);
dotenv.config();
var MONGODB_URI = "mongodb+srv://root:root@aroma.ae0sb.mongodb.net/ARoma?retryWrites=true&w=majority&appName=ARoma&replicaSet=atlas-4uxo98-shard-0&tls=true";
var app = express_1["default"]();
var PORT = process.env.PORT || 5001;
var httpServer = http_1.createServer(app);
var mongoOptions = {
    maxPoolSize: 50,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 60000,
    connectTimeoutMS: 30000,
    waitQueueTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
    tls: true,
    directConnection: false
};
var mongoClient = new mongodb_1.MongoClient(MONGODB_URI, mongoOptions);
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"]
}));
var dbConnection = null;
app.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!!dbConnection) return [3 /*break*/, 2];
                dbConnection = mongoClient.db("ARoma");
                return [4 /*yield*/, dbConnection.admin().ping()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                req.db = dbConnection;
                next();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Database connection error:', error_1);
                res.status(500).send('Database connection failed');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
app.use("/api/feedback", feedbackRoutes_1["default"]);
app.use("/api/orders", orderRoutes_1["default"]);
app.use("/api/carts", cartRoutes_1["default"]);
app.use("/api/restaurants", restaurantRoutes_1["default"]);
app.use("/api/menus", menuRoutes_1["default"]);
app.use('/api/restaurantsMenu', restaurantMenuRoutes_1["default"]);
app.use("/api/requests", serviceRequestRoutes_1["default"]);
app.use("/api/sales", salesRoutes_1["default"]);
app.use("/api/staff", staffRoutes_1["default"]);
app.use("/api", userRoutes_1["default"]);
app.use("/api/auth", loginRoutes_1["default"]);
app.use("/api/auth", resetPasswordRoutes_1["default"]);
// app.use('/api/payment', payment);
var activeConnections = new Set();
app.get('/order-events/:orderId', function (req, res) {
    if (activeConnections.size >= 50) {
        res.status(429).send('Too many connections');
        return;
    }
    var connectionId = Symbol();
    activeConnections.add(connectionId);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var db, order, changeStream_1, onChange_1, onError_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    db = req.db;
                    return [4 /*yield*/, db.collection('orders').findOne({
                            _id: new mongodb_1.ObjectId(req.params.orderId)
                        })];
                case 1:
                    order = _a.sent();
                    if (!order) {
                        res.write('event: error\ndata: Order not found\n\n');
                        res.end();
                        return [2 /*return*/];
                    }
                    res.write("event: initial\ndata: " + JSON.stringify(order) + "\n\n");
                    changeStream_1 = db.collection('orders').watch([{
                            $match: {
                                'fullDocument._id': new mongodb_1.ObjectId(req.params.orderId),
                                operationType: { $in: ['update', 'replace'] }
                            }
                        }], { fullDocument: 'updateLookup' });
                    onChange_1 = function (change) {
                        if (change.operationType === 'update' && change.fullDocument) {
                            res.write("event: update\ndata: " + JSON.stringify(change.fullDocument) + "\n\n");
                        }
                    };
                    onError_1 = function (error) {
                        console.error('Change stream error:', error);
                        res.end();
                    };
                    changeStream_1.on('change', onChange_1);
                    changeStream_1.on('error', onError_1);
                    req.on('close', function () {
                        activeConnections["delete"](connectionId);
                        changeStream_1.off('change', onChange_1);
                        changeStream_1.off('error', onError_1);
                        changeStream_1.close();
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error('SSE connection error:', err_1);
                    res.write('event: error\ndata: Failed to fetch order\n\n');
                    res.end();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); })();
});
var connectWithRetry = function (attempt) {
    if (attempt === void 0) { attempt = 1; }
    return __awaiter(void 0, void 0, Promise, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 6]);
                    return [4 /*yield*/, mongoClient.connect()];
                case 1:
                    _a.sent();
                    console.log("Connected to MongoDB Atlas");
                    return [4 /*yield*/, mongoClient.db().admin().ping()];
                case 2:
                    _a.sent();
                    console.log("Database connection verified");
                    setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var pingError_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 4]);
                                    return [4 /*yield*/, mongoClient.db().command({ ping: 1 })];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 2:
                                    pingError_1 = _a.sent();
                                    console.error('Connection heartbeat failed:', pingError_1);
                                    return [4 /*yield*/, mongoClient.close()];
                                case 3:
                                    _a.sent();
                                    connectWithRetry();
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }, 15000);
                    return [3 /*break*/, 6];
                case 3:
                    error_2 = _a.sent();
                    console.error("Connection attempt " + attempt + " failed:", error_2);
                    if (!(attempt < 5)) return [3 /*break*/, 5];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, Math.pow(2, attempt) * 1000); })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, connectWithRetry(attempt + 1)];
                case 5:
                    console.error("Critical connection failure after 5 attempts");
                    process.exit(1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
};
process.on('uncaughtException', function (error) {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', function (reason, promise) {
    console.error('Unhandled Rejection at:', promise, 'Reason:', reason);
});
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, connectWithRetry()];
            case 1:
                _a.sent();
                httpServer.listen(PORT, function () {
                    console.log("Server running on port " + PORT);
                    console.log("SSE endpoint: http://localhost:" + PORT + "/order-events/:orderId");
                });
                process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, mongoClient.close()];
                            case 1:
                                _a.sent();
                                console.log('MongoDB connection closed');
                                process.exit(0);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error("Fatal connection error:", error_3);
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
startServer();
