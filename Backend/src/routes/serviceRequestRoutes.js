"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceRequestController_1 = require("../controllers/serviceRequestController");
const router = (0, express_1.Router)();
// Get all service requests
router.get("/", serviceRequestController_1.getServiceRequests);
// Submit a new service request
router.post("/", serviceRequestController_1.submitServiceRequest);
// Update service request status
router.put("/:id", serviceRequestController_1.updateServiceRequest);
// Delete a service request
router.delete("/:id", serviceRequestController_1.deleteServiceRequest);
exports.default = router;
