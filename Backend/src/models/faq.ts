import mongoose, { Schema, Document } from "mongoose";

export interface IEmail extends Document {
  email: string;
  userType: string;
  message: string;
  timestamp: Date;
}

const EmailSchema: Schema = new Schema({
  email: { type: String, required: true },
  userType: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IEmail>("Email", EmailSchema);