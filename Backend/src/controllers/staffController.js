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
exports.deleteStaff = exports.updateStaff = exports.searchStaff = exports.getStaff = exports.addStaff = void 0;
const dbConfig_1 = require("../config/dbConfig");
const mongodb_1 = require("mongodb");
// Add a new staff member
const addStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staffId, name, role, salary } = req.body;
        const db = yield (0, dbConfig_1.connectDB)();
        const newStaff = {
            staffId,
            name,
            role,
            salary,
            createdAt: new Date(),
        };
        yield db.collection("staff").insertOne(newStaff);
        res.status(201).json({ message: "Staff added successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to add staff" });
    }
});
exports.addStaff = addStaff;
// Get all staff members
const getStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const staff = yield db.collection("staff").find().toArray();
        res.json(staff);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch staff" });
    }
});
exports.getStaff = getStaff;
// Search staff by staff ID
const searchStaff = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staffId } = req.params;
        const db = yield (0, dbConfig_1.connectDB)();
        const staff = yield db.collection("staff").findOne({ staffId });
        if (!staff) {
            res.status(404).json({ error: "Staff not found" });
            return;
        }
        res.json(staff);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to search staff" });
    }
});
exports.searchStaff = searchStaff;
// Update staff role and salary
const updateStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { role, salary } = req.body;
        const db = yield (0, dbConfig_1.connectDB)();
        yield db.collection("staff").updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { role, salary } });
        res.json({ message: "Staff updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update staff" });
    }
});
exports.updateStaff = updateStaff;
// Delete a staff member
const deleteStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const db = yield (0, dbConfig_1.connectDB)();
        yield db.collection("staff").deleteOne({ _id: new mongodb_1.ObjectId(id) });
        res.json({ message: "Staff deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete staff" });
    }
});
exports.deleteStaff = deleteStaff;
