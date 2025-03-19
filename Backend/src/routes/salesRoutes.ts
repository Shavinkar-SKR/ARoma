import { Router } from "express";
import { getSalesAnalytics } from "../controllers/salesController";

const router = Router();

router.get("/", getSalesAnalytics);

export default router;