import { Request, Response } from "express";
import Chat from "../models/faq";

export default class FAQController {
  static async sendEmail(req: Request, res: Response) {
    const { email, userType, message } = req.body;

    try {
      // Save the email details to the database
      const emailRecord = new Chat({ email, userType, message });
      await emailRecord.save();

      res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getEmails(req: Request, res: Response) {
    try {
      const emails = await Chat.find().sort({ timestamp: 1 });
      res.status(200).json(emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}