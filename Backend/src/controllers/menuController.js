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
exports.searchMenuItems = exports.getMenuByRestaurant = void 0;
const dbConfig_1 = require("../config/dbConfig");
const getMenuByRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        const db = yield (0, dbConfig_1.connectDB)();
        const menuCollection = db.collection("menus");
        const menuItems = yield menuCollection
            .find({
            restaurantId,
        })
            .toArray();
        res.status(200).json(menuItems);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch menu items" });
    }
});
exports.getMenuByRestaurant = getMenuByRestaurant;
const searchMenuItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, restaurantId } = req.query;
        const db = yield (0, dbConfig_1.connectDB)();
        const menuCollection = db.collection("menus");
        const filter = { restaurantId: restaurantId };
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
            ];
        }
        const menuItems = yield menuCollection.find(filter).toArray();
        res.status(200).json(menuItems);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to search menu items" });
    }
});
exports.searchMenuItems = searchMenuItems;
