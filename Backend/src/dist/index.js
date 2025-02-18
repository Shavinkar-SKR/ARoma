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
exports.emitOrderUpdate = void 0;
var cors_1 = require("cors");
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var body_parser_1 = require("body-parser");
var dbConfig_1 = require("./config/dbConfig");
var cartRoutes_1 = require("./routes/cartRoutes");
var orderRoutes_1 = require("./routes/orderRoutes");
var app = express_1["default"]();
var PORT = process.env.PORT || 5001;
var httpServer = http_1.createServer(app);
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST", "PATCH", "DELETE"]
    }
});
app.use(cors_1["default"]({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));
app.use(body_parser_1["default"].json());
app.use("/api/orders", orderRoutes_1["default"]);
app.use("/api/carts", cartRoutes_1["default"]);
// WebSocket connection
io.on("connection", function (socket) {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", function () {
        console.log("Client disconnected:", socket.id);
    });
});
// Add to your order routes when updating status
var emitOrderUpdate = function (updatedOrder) {
    io.emit("orderUpdated", updatedOrder);
};
exports.emitOrderUpdate = emitOrderUpdate;
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, dbConfig_1.connectDB()];
            case 1:
                _a.sent();
                console.log("Connected to the database");
                httpServer.listen(PORT, function () {
                    console.log("Server is running on port " + PORT);
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Failed to connect to the database:", error_1);
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
startServer();
