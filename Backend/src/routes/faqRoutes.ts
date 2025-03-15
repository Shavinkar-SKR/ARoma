import { Router, Request, Response } from "express";
import FAQController from "../controllers/FAQController";

const router = Router();

// Send an email
router.post("/send-email", async (req: Request, res: Response): Promise<void> => {
  try {
    await FAQController.sendEmail(req, res);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
});

// Get all emails
router.get("/emails", async (req: Request, res: Response): Promise<void> => {
  try {
    await FAQController.getEmails(req, res);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ message: "Error fetching emails" });
  }
});

export default router;