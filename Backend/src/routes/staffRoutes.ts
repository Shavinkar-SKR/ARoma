import { Router } from "express";
import {
  addStaff,
  getStaff,
  searchStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController";

const router = Router();

router.post("/", addStaff);
router.get("/", getStaff);
router.get("/:staffId", searchStaff);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

export default router;