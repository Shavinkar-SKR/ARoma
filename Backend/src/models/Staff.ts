import { ObjectId } from "mongodb";

export interface Staff {
  _id?: ObjectId;
  staffId: string;
  name: string;
  role: string;
  salary: number;
  createdAt?: Date;
}