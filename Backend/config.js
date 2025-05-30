"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load env variables form .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env") });
exports.config = {
    DB_NAME: process.env.DB_NAME || "",
    MONGODB_URI: process.env.MONGODB_CONNECTION_STRING || "",
};
