import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig";
import { Staff } from "../models/Staff";
import { ObjectId } from "mongodb";

// Get all staff members
export const getStaffMembers = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const staff = await db.collection<Staff>("staff").find().toArray();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staff members" });
  }
};

// Add a new staff member
export const addStaffMember = async (req: Request, res: Response) => {
  try {
    const { name, role } = req.body;
    const db = await connectDB();
    const newStaff: Staff = { name, role };

    // Insert the new staff member
    const result = await db.collection<Staff>("staff").insertOne(newStaff);

    // Fetch the newly inserted document using the insertedId
    const insertedStaff = await db.collection<Staff>("staff").findOne({
      _id: result.insertedId,
    });

    if (!insertedStaff) {
      throw new Error("Failed to fetch the inserted staff member");
    }

    res.status(201).json(insertedStaff);
  } catch (error) {
    res.status(500).json({ error: "Failed to add staff member" });
  }
};

// Delete a staff member
export const deleteStaffMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    await db.collection<Staff>("staff").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete staff member" });
  }
};