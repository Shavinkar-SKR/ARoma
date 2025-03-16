import { Router } from "express";
import { signUp } from "../controllers/userController";

const router = Router();

// Sign-up route
router.post("/signup", signUp);

export default router;