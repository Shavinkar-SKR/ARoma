import { ObjectId } from "mongodb";

export interface Sale {
  _id?: ObjectId;
  orderId: string;
  amount: number;
  date: Date;
}