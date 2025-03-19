import { Request, Response, NextFunction } from "express";
import { connectDB } from "../config/dbConfig";
import { Staff } from "../models/Staff";
import { ObjectId } from "mongodb";

// Add a new staff member
export const addStaff = async (req: Request, res: Response) => {
  try {
    const { staffId, name, role, salary } = req.body;
    const db = await connectDB();
    const newStaff: Staff = {
      staffId,
      name,
      role,
      salary,
      createdAt: new Date(),
    };
    await db.collection<Staff>("staff").insertOne(newStaff);
    res.status(201).json({ message: "Staff added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add staff" });
  }
};

// Get all staff members
export const getStaff = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const staff = await db.collection<Staff>("staff").find().toArray();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};

// Search staff by staff ID
export const searchStaff = async (req: Request, res: Response, next: NextFunction): Promise<void> => {  try {
    const { staffId } = req.params;
    const db = await connectDB();
    const staff = await db.collection("staff").findOne({ staffId });

    if (!staff) {
      res.status(404).json({ error: "Staff not found" });
      return;
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: "Failed to search staff" });
  }
};


// Update staff role and salary
export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, salary } = req.body;
    const db = await connectDB();
    await db.collection<Staff>("staff").updateOne(
      { _id: new ObjectId(id) },
      { $set: { role, salary } }
    );
    res.json({ message: "Staff updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update staff" });
  }
};

// Delete a staff member
export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    await db.collection<Staff>("staff").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete staff" });
  }
};