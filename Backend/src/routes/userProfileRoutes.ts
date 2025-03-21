import { Router } from "express";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../controllers/userProfileController";
import { authMiddleware } from "../middleware/authMiddleware"; // Assuming you have an auth middleware

const router = Router();

// Fetch user profile
router.get("/:userId", authMiddleware, fetchUserProfile);

// Update user profile
router.put("/:userId", authMiddleware, updateUserProfile);

export default router;
