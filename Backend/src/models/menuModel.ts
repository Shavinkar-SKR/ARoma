import { ObjectId } from "mongodb";

export interface MenuItem {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantId: string; // This will link to restaurant _id
  dietary: {
    isVegan: boolean;
    isNutFree: boolean;
    isGlutenFree: boolean;
  };
  hasARPreview: boolean;
}
