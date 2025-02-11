import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://root:root@aroma.ae0sb.mongodb.net/";
const DB_NAME = "ARoma";

export const connectDB = async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  return db;
};
