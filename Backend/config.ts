import dotenv from 'dotenv';
import path from 'path';

// Load env variables form .env file
dotenv.config({ path: path.resolve(__dirname, ".env")})

export const config = {
    DB_NAME: process.env.DB_NAME || "",
    MONGODB_URI: process.env.MONGODB_CONNECTION_STRING || "",
}