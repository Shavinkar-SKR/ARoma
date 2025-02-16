import { ObjectId } from "mongodb";

export interface Order {
  _id?: ObjectId;
  cartItems: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  specialInstructions: string;
  total: number;
  status: string;
}
