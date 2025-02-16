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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors")); // Import the cors package
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes")); // Import your order routes
const dbConfig_1 = require("./config/dbConfig");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001; // You can set this to 5001 or any other port you need
// Enable CORS for all origins or restrict it to specific domains
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Allow requests only from this origin (your frontend)
    methods: ["GET", "POST", "PATCH", "DELETE"], // Allow the necessary HTTP methods
    allowedHeaders: ["Content-Type"], // Allow Content-Type header
}));
app.use(body_parser_1.default.json()); // Parse incoming JSON requests
// Use the order routes for order-related endpoints
app.use("/api/orders", orderRoutes_1.default);
// Connect to the database and then start the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, dbConfig_1.connectDB)();
        console.log("Connected to the database");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1); // Exit the process if DB connection fails
    }
});
// Start the server and connect to the database
startServer();
