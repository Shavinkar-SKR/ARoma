import { Router } from "express";
import {
  getServiceRequests,
  submitServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
} from "../controllers/serviceRequestController";

const router = Router();

// Get all service requests
router.get("/", getServiceRequests);

// Submit a new service request
router.post("/", submitServiceRequest);

// Update service request status
router.put("/:id", updateServiceRequest);

// Delete a service request
router.delete("/:id", deleteServiceRequest);

export default router;