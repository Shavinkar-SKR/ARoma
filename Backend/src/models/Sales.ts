import { ObjectId } from "mongodb";

export interface Sales {
  _id?: ObjectId;
  day: string;
  sales: number;
  month: string;
}