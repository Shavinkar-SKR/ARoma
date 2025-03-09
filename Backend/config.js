"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dotenv = require("dotenv");
var path = require("path");
dotenv.config({ path: path.resolve(__dirname, ".env") });
exports.config = {
    DB_NAME: process.env.DB_NAME || "ARoma",
    MONGODB_URI: process.env.MONGODB_CONNECTION_STRING || "",
};
