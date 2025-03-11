import { Router } from "express";
import { getSalesData } from "../controllers/salesController";

const router = Router();

router.get("/", getSalesData);

export default router;