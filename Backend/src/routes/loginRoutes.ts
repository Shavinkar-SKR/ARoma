import { Router } from "express";
import { login } from "../controllers/loginController";

const router = Router();

// Login route
router.post("/login", login);

export default router;