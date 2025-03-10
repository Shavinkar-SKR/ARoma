import { ObjectId } from "mongodb";

export interface ServiceRequest {
  _id?: ObjectId;
  tableNo: string;
  service: string;
  status: string; // e.g., "Pending", "Completed"
  createdAt?: Date;
}