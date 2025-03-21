import { Router } from "express";
import { signUp } from "../controllers/userController";
import userProfileRoutes from "./userProfileRoutes";
console.log("Imported signUp function:", signUp);

const router = Router();

// Sign-up route
router.post("/signup", signUp);
router.use("/user", userProfileRoutes);
export default router;
