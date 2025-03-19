import { Request, Response } from "express";
import { connectDB } from "../config/dbConfig";
import { ServiceRequest } from "../models/serviceRequest";
import { ObjectId } from "mongodb";

// Fetch all service requests
export const getServiceRequests = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const requests = await db.collection<ServiceRequest>("service_requests").find().toArray();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
};

// Submit a new service request
export const submitServiceRequest = async (req: Request, res: Response) => {
  try {
    const { tableNo, service } = req.body;
    const db = await connectDB();
    const newRequest: ServiceRequest = {
      tableNo,
      service,
      status: "Pending", // Default status
      createdAt: new Date(),
    };

    // Insert the new request
    const result = await db.collection<ServiceRequest>("service_requests").insertOne(newRequest);

    // Fetch the newly inserted document using the insertedId
    const insertedRequest = await db.collection<ServiceRequest>("service_requests").findOne({
      _id: result.insertedId,
    });

    if (!insertedRequest) {
      throw new Error("Failed to fetch the inserted request");
    }

    res.status(201).json(insertedRequest);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit service request" });
  }
};

// Update service request status
export const updateServiceRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = await connectDB();
    await db.collection<ServiceRequest>("service_requests").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    res.json({ message: "Request updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update request" });
  }
};

// Delete service request
export const deleteServiceRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    await db.collection<ServiceRequest>("service_requests").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete request" });
  }
};