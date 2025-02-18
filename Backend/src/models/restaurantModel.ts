import { ObjectId } from "mongodb";

export interface Restaurant {
  _id?: ObjectId;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  reviews: number;
  priceRange: "€" | "€€" | "€€€" | "€€€€";
  image: string;
}
