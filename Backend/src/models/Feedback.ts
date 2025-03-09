import { ObjectId } from "mongodb";

export interface Feedback {
  _id?: ObjectId;
  comment: string;
  rating: number;
  username: string; 
  restaurantName: string; 
  createdAt?: Date;//didnt add
}

