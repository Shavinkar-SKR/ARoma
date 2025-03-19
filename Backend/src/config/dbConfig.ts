import { MongoClient } from "mongodb";
import { config } from "../../config";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "ARoma";

export const connectDB = async () => {
  const client = new MongoClient(config.MONGODB_URI);
  await client.connect();
  const db = client.db(config.DB_NAME);
  return db;
};
