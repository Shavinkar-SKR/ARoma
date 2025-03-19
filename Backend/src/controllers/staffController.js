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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStaff = exports.updateStaff = exports.searchStaff = exports.getStaff = exports.addStaff = void 0;
var dbConfig_1 = require("../config/dbConfig");
var mongodb_1 = require("mongodb");
// Add a new staff member
var addStaff = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, staffId, name_1, role, salary, db, newStaff, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, staffId = _a.staffId, name_1 = _a.name, role = _a.role, salary = _a.salary;
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db = _b.sent();
                newStaff = {
                    staffId: staffId,
                    name: name_1,
                    role: role,
                    salary: salary,
                    createdAt: new Date(),
                };
                return [4 /*yield*/, db.collection("staff").insertOne(newStaff)];
            case 2:
                _b.sent();
                res.status(201).json({ message: "Staff added successfully" });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.status(500).json({ error: "Failed to add staff" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addStaff = addStaff;
// Get all staff members
var getStaff = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, staff, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection("staff").find().toArray()];
            case 2:
                staff = _a.sent();
                res.json(staff);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(500).json({ error: "Failed to fetch staff" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getStaff = getStaff;
// Search staff by staff ID
var searchStaff = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var staffId, db, staff, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                staffId = req.params.staffId;
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection("staff").findOne({ staffId: staffId })];
            case 2:
                staff = _a.sent();
                if (!staff) {
                    res.status(404).json({ error: "Staff not found" });
                    return [2 /*return*/];
                }
                res.json(staff);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).json({ error: "Failed to search staff" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.searchStaff = searchStaff;
// Update staff role and salary
var updateStaff = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, role, salary, db, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = req.params.id;
                _a = req.body, role = _a.role, salary = _a.salary;
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db = _b.sent();
                return [4 /*yield*/, db.collection("staff").updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { role: role, salary: salary } })];
            case 2:
                _b.sent();
                res.json({ message: "Staff updated successfully" });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                res.status(500).json({ error: "Failed to update staff" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateStaff = updateStaff;
// Delete a staff member
var deleteStaff = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, db, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, (0, dbConfig_1.connectDB)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection("staff").deleteOne({ _id: new mongodb_1.ObjectId(id) })];
            case 2:
                _a.sent();
                res.json({ message: "Staff deleted successfully" });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(500).json({ error: "Failed to delete staff" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteStaff = deleteStaff;
