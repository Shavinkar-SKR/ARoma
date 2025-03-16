"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const mongodb_1 = require("mongodb");
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const restaurantRoutes_1 = __importDefault(require("./routes/restaurantRoutes"));
const menuRoutes_1 = __importDefault(require("./routes/menuRoutes"));
const dotenv = __importStar(require("dotenv"));
const restaurantMenuRoutes_1 = __importDefault(require("./routes/restaurantMenuRoutes"));
const feedbackRoutes_1 = __importDefault(require("./routes/feedbackRoutes"));
const serviceRequestRoutes_1 = __importDefault(require("./routes/serviceRequestRoutes"));
const salesRoutes_1 = __importDefault(require("./routes/salesRoutes"));
const staffRoutes_1 = __importDefault(require("./routes/staffRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const loginRoutes_1 = __importDefault(require("./routes/loginRoutes"));
const resetPasswordRoutes_1 = __importDefault(require("./routes/resetPasswordRoutes"));
//import payment from './routes/paymentRoutes'
dotenv.config();
const MONGODB_URI = "mongodb+srv://root:root@aroma.ae0sb.mongodb.net/ARoma?retryWrites=true&w=majority&appName=ARoma&replicaSet=atlas-4uxo98-shard-0&tls=true";
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
const httpServer = (0, http_1.createServer)(app);
const mongoOptions = {
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
const mongoClient = new mongodb_1.MongoClient(MONGODB_URI, mongoOptions);
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type"],
}));
let dbConnection = null;
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!dbConnection) {
            dbConnection = mongoClient.db("ARoma");
            yield dbConnection.admin().ping();
        }
        req.db = dbConnection;
        next();
    }
    catch (error) {
        console.error('Database connection error:', error);
        res.status(500).send('Database connection failed');
    }
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/feedback", feedbackRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/carts", cartRoutes_1.default);
app.use("/api/restaurants", restaurantRoutes_1.default);
app.use("/api/menus", menuRoutes_1.default);
app.use('/api/restaurants', restaurantMenuRoutes_1.default);
app.use("/api/requests", serviceRequestRoutes_1.default);
app.use("/api/sales", salesRoutes_1.default);
app.use("/api/staff", staffRoutes_1.default);
app.use("/api", userRoutes_1.default);
app.use("/api/auth", loginRoutes_1.default);
app.use("/api/auth", resetPasswordRoutes_1.default);
//app.use('/api/payment', payment);
const activeConnections = new Set();
app.get('/order-events/:orderId', (req, res) => {
    if (activeConnections.size >= 50) {
        res.status(429).send('Too many connections');
        return;
    }
    const connectionId = Symbol();
    activeConnections.add(connectionId);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const db = req.db;
            const order = yield db.collection('orders').findOne({
                _id: new mongodb_1.ObjectId(req.params.orderId)
            });
            if (!order) {
                res.write('event: error\ndata: Order not found\n\n');
                res.end();
                return;
            }
            res.write(`event: initial\ndata: ${JSON.stringify(order)}\n\n`);
            const changeStream = db.collection('orders').watch([{
                    $match: {
                        'fullDocument._id': new mongodb_1.ObjectId(req.params.orderId),
                        operationType: { $in: ['update', 'replace'] }
                    }
                }], { fullDocument: 'updateLookup' });
            const onChange = (change) => {
                if (change.operationType === 'update' && change.fullDocument) {
                    res.write(`event: update\ndata: ${JSON.stringify(change.fullDocument)}\n\n`);
                }
            };
            const onError = (error) => {
                console.error('Change stream error:', error);
                res.end();
            };
            changeStream.on('change', onChange);
            changeStream.on('error', onError);
            req.on('close', () => {
                activeConnections.delete(connectionId);
                changeStream.off('change', onChange);
                changeStream.off('error', onError);
                changeStream.close();
            });
        }
        catch (err) {
            console.error('SSE connection error:', err);
            res.write('event: error\ndata: Failed to fetch order\n\n');
            res.end();
        }
    }))();
});
const connectWithRetry = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (attempt = 1) {
    try {
        yield mongoClient.connect();
        console.log("Connected to MongoDB Atlas");
        yield mongoClient.db().admin().ping();
        console.log("Database connection verified");
        setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield mongoClient.db().command({ ping: 1 });
            }
            catch (pingError) {
                console.error('Connection heartbeat failed:', pingError);
                yield mongoClient.close();
                connectWithRetry();
            }
        }), 15000);
    }
    catch (error) {
        console.error(`Connection attempt ${attempt} failed:`, error);
        if (attempt < 5) {
            yield new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            return connectWithRetry(attempt + 1);
        }
        console.error("Critical connection failure after 5 attempts");
        process.exit(1);
    }
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'Reason:', reason);
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectWithRetry();
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`SSE endpoint: http://localhost:${PORT}/order-events/:orderId`);
        });
        process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoClient.close();
            console.log('MongoDB connection closed');
            process.exit(0);
        }));
    }
    catch (error) {
        console.error("Fatal connection error:", error);
        process.exit(1);
    }
});
startServer();
