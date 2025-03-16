import { Router } from "express";
import { signUp } from "../controllers/userController";

console.log("Imported signUp function:", signUp);

const router = Router();

// Sign-up route
router.post("/signup", signUp);

export default router;