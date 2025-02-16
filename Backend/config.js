"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
//import * as dotenv from "dotenv";
var path = require("path");
var dotenv = require("dotenv");
// Load env variables form .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });
exports.config = {
    DB_NAME: process.env.DB_NAME || "",
    MONGODB_URI: process.env.MONGODB_CONNECTION_STRING || "",
};
