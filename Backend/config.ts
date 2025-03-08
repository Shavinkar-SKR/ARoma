import * as dotenv from "dotenv";
import * as path from "path";


dotenv.config({ path: path.resolve(__dirname, ".env") });

export const config = {
  DB_NAME: process.env.DB_NAME || "ARoma",
  MONGODB_URI: process.env.MONGODB_CONNECTION_STRING || "",
};