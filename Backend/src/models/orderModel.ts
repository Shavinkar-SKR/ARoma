import mongoose, { Document, Schema } from "mongoose";
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
  tableNumber: string;
  status?: "received" | "preparing" | "ready" | "complete"; // Optional status field
}

const orderSchema = new Schema<Order & Document>({
  cartItems: [
    {
      id: Number,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  specialInstructions: String,
  total: Number,
  tableNumber: String,
  status: {
    type: String,
    enum: ["received", "preparing", "ready", "complete"],
    default: "received",
  },
});

const Order = mongoose.model<Order & Document>("Order", orderSchema);

export default Order;