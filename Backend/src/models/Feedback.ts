import { ObjectId } from "mongodb";

export interface Feedback {
  _id?: ObjectId;
  comment: string;
  rating: number;
  createdAt?: Date;
}

