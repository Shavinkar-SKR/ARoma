"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSocketConnected = exports.socket = void 0;
const socket_io_client_1 = require("socket.io-client");
// Create a socket instance with better error handling and reconnection strategy
exports.socket = socket_io_client_1.io('http://localhost:5001', {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
});
// Add event listeners for connection status
exports.socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});
exports.socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});
exports.socket.on('connect_error', (error) => {
    console.warn('WebSocket connection error:', error.message);
});
// Add error event handler
exports.socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});
// Export a function to check connection status
exports.isSocketConnected = () => exports.socket.connected;
