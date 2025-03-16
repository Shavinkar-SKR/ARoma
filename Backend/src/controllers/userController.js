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
exports.signUp = void 0;
const db_1 = require("../config/db");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    console.log("Received sign-up request:", { name, email, password });
    try {
        const db = yield (0, db_1.connectDB)();
        console.log("Attempting to find existing user...");
        // Check if the user already exists
        const existingUser = yield db.collection("users").findOne({ email });
        console.log("Existing user:", existingUser);
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // Create a new user
        console.log("Creating new user...");
        const newUser = { name, email, password };
        console.log("New user:", newUser);
        // Save the new user to the database
        console.log("Saving user to the database...");
        const result = yield db.collection("users").insertOne(newUser);
        console.log("User saved successfully");
        // Fetch the newly inserted user
        const insertedUser = yield db.collection("users").findOne({
            _id: result.insertedId,
        });
        if (!insertedUser) {
            throw new Error("Failed to fetch the inserted user");
        }
        res.status(201).json({ message: "User created successfully", user: insertedUser });
    }
    catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signUp = signUp;
