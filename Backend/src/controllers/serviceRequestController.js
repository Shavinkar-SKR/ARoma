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
exports.deleteServiceRequest = exports.updateServiceRequest = exports.submitServiceRequest = exports.getServiceRequests = void 0;
const dbConfig_1 = require("../config/dbConfig");
const mongodb_1 = require("mongodb");
// Fetch all service requests
const getServiceRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, dbConfig_1.connectDB)();
        const requests = yield db.collection("service_requests").find().toArray();
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch service requests" });
    }
});
exports.getServiceRequests = getServiceRequests;
// Submit a new service request
const submitServiceRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tableNo, service } = req.body;
        const db = yield (0, dbConfig_1.connectDB)();
        const newRequest = {
            tableNo,
            service,
            status: "Pending", // Default status
            createdAt: new Date(),
        };
        // Insert the new request
        const result = yield db.collection("service_requests").insertOne(newRequest);
        // Fetch the newly inserted document using the insertedId
        const insertedRequest = yield db.collection("service_requests").findOne({
            _id: result.insertedId,
        });
        if (!insertedRequest) {
            throw new Error("Failed to fetch the inserted request");
        }
        res.status(201).json(insertedRequest);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to submit service request" });
    }
});
exports.submitServiceRequest = submitServiceRequest;
// Update service request status
const updateServiceRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const db = yield (0, dbConfig_1.connectDB)();
        yield db.collection("service_requests").updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { status } });
        res.json({ message: "Request updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update request" });
    }
});
exports.updateServiceRequest = updateServiceRequest;
// Delete service request
const deleteServiceRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const db = yield (0, dbConfig_1.connectDB)();
        yield db.collection("service_requests").deleteOne({ _id: new mongodb_1.ObjectId(id) });
        res.json({ message: "Request deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete request" });
    }
});
exports.deleteServiceRequest = deleteServiceRequest;
