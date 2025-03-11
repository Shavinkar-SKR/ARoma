import { ObjectId } from "mongodb";

export interface Staff {
  _id?: ObjectId;
  name: string;
  role: string;
}