import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://root:root@aroma.ae0sb.mongodb.net/ARoma?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true";
const DB_NAME = process.env.DB_NAME || "ARoma";

export const connectDB = async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  return db;
};