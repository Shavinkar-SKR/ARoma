import { ObjectId } from "mongodb";

export interface CartItem {
  _id?: ObjectId;
  menuId: String;
  name: string;
  price: number;
  quantity: number;
  image: string;
  userId: string;
}
