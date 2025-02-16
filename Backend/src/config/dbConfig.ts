import { MongoClient } from "mongodb";
import { config } from "../../config";

const MONGODB_URI = config.MONGODB_URI;
const DB_NAME = config.DB_NAME;

export const connectDB = async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  return db;
};
