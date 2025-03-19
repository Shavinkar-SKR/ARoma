"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderById = exports.getOrders = void 0;
const dbConfig_1 = require("../config/dbConfig"); // Import the connectDB utility
const mongodb_1 = require("mongodb"); // Add this import
// Function to retrieve all orders
const getOrders = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const db = yield (0, dbConfig_1.connectDB)();
      const ordersCollection = db.collection("orders");
      // Retrieve all orders from MongoDB
      const orders = yield ordersCollection.find().toArray();
      // Return the orders in the response
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
exports.getOrders = getOrders;
const getOrderById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongodb_1.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid order ID format" });
      return;
    }
    try {
      const db = yield (0, dbConfig_1.connectDB)();
      const ordersCollection = db.collection("orders");
      const objectId = new mongodb_1.ObjectId(id);
      const order = yield ordersCollection.findOne({ _id: objectId });
      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }
      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order", error });
    }
  });
exports.getOrderById = getOrderById;
