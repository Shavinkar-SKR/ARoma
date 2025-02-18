"use strict";
exports.__esModule = true;
exports.io = void 0;
var socket_io_1 = require("socket.io");
var http_1 = require("http");
var express_1 = require("express");
var app = express_1["default"]();
var httpServer = http_1.createServer(app);
// Create the Socket.IO server
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST", "PATCH", "DELETE"]
    }
});
// WebSocket connection
exports.io.on("connection", function (socket) {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", function () {
        console.log("Client disconnected:", socket.id);
    });
});
