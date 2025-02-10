import express from "express"; // Entry point to the server
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

console.log("MongoDB Connection String:", process.env.MONGODB_CONNECTION_STRING);

if (!process.env.MONGODB_CONNECTION_STRING) {
  console.error("Error: MONGODB_CONNECTION_STRING is not defined in .env file.");
  process.exit(1); // Exit the process if the connection string is missing
}

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to database!"))
  .catch((err: Error) => console.error("Database connection error:", err));

const app = express();
app.use(express.json());
app.use(cors());

app.get("/test", async (req, res) => {
  res.json({
    message: "hello",
  });
});

app.listen(7000, () => {
  console.log("Server started on port 7000");
});
