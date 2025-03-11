import { Router } from "express";
import { getStaffMembers, addStaffMember, deleteStaffMember } from "../controllers/staffController";

const router = Router();

router.get("/", getStaffMembers);
router.post("/", addStaffMember);
router.delete("/:id", deleteStaffMember);

export default router;