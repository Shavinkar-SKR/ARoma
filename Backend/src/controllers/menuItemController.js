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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenuItem = exports.updateMenuItem = exports.createMenuItem = void 0;
const dbConfig_1 = require("../config/dbConfig"); // Adjust path as needed
const mongodb_1 = require("mongodb");
// Create a new menu item
const createMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, restaurantId } = req.body;
    if (!name || !price || !restaurantId) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const newMenuItem = {
            name,
            price,
            restaurantId: new mongodb_1.ObjectId(restaurantId),
        };
        const result = yield db.collection('menus').insertOne(newMenuItem);
        return res.status(201).json({ message: 'Menu item created', menuItem: Object.assign({ _id: result.insertedId }, newMenuItem) });
    }
    catch (error) {
        console.error("Error creating menu item:", error);
        return res.status(500).json({ message: "Error creating menu item" });
    }
});
exports.createMenuItem = createMenuItem;
// Update a menu item by ID
const updateMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, price } = req.body;
    if (!name && !price) {
        return res.status(400).json({ message: "No fields to update" });
    }
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const updatedData = {};
        if (name)
            updatedData.name = name;
        if (price)
            updatedData.price = price;
        const result = yield db.collection('menus').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updatedData });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        return res.json({ message: 'Menu item updated' });
    }
    catch (error) {
        console.error("Error updating menu item:", error);
        return res.status(500).json({ message: "Error updating menu item" });
    }
});
exports.updateMenuItem = updateMenuItem;
// Delete a menu item by ID
const deleteMenuItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const result = yield db.collection('menus').deleteOne({ _id: new mongodb_1.ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        return res.json({ message: 'Menu item deleted' });
    }
    catch (error) {
        console.error("Error deleting menu item:", error);
        return res.status(500).json({ message: "Error deleting menu item" });
    }
});
exports.deleteMenuItem = deleteMenuItem;
