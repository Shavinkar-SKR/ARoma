import { Router } from "express";
import { resetPassword } from "../controllers/resetPasswordController"; // Import the reset password controller

const router = Router();

// Reset password route
router.post("/reset-password", resetPassword);

export default router;