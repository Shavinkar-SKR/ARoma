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
exports.getSalesAnalytics = void 0;
const dbConfig_1 = require("../config/dbConfig");
// Get sales analytics
const getSalesAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const sales = yield db.collection("sales").find().toArray();
        // Calculate analytics
        const totalOrders = sales.length;
        const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
        const averageSale = totalOrders > 0 ? totalSales / totalOrders : 0;
        res.json({
            totalOrders,
            totalSales,
            averageSale,
            sales,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch sales analytics" });
    }
});
exports.getSalesAnalytics = getSalesAnalytics;
