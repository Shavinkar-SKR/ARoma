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
exports.signUp = void 0;
var db_1 = require("../config/db");
var signUp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, db, existingUser, newUser, result, insertedUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, email = _a.email, password = _a.password;
                console.log("Received sign-up request:", { name: name, email: email, password: password });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, db_1.connectDB)()];
            case 2:
                db = _b.sent();
                console.log("Attempting to find existing user...");
                return [4 /*yield*/, db.collection("users").findOne({ email: email })];
            case 3:
                existingUser = _b.sent();
                console.log("Existing user:", existingUser);
                if (existingUser) {
                    res.status(400).json({ message: "User already exists" });
                    return [2 /*return*/];
                }
                // Create a new user
                console.log("Creating new user...");
                newUser = { name: name, email: email, password: password };
                console.log("New user:", newUser);
                // Save the new user to the database
                console.log("Saving user to the database...");
                return [4 /*yield*/, db.collection("users").insertOne(newUser)];
            case 4:
                result = _b.sent();
                console.log("User saved successfully");
                return [4 /*yield*/, db.collection("users").findOne({
                        _id: result.insertedId,
                    })];
            case 5:
                insertedUser = _b.sent();
                if (!insertedUser) {
                    throw new Error("Failed to fetch the inserted user");
                }
                res.status(201).json({ message: "User created successfully", user: insertedUser });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.error("Error signing up:", error_1);
                res.status(500).json({ message: "Internal server error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.signUp = signUp;
