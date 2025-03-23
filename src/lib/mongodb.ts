// src/lib/mongodb.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;

if (!uri) {
  throw new Error(
    "❌ MONGODB_URI is not defined. Please set it in your environment variables (.env or deployment config).",
  );
}

if (!dbName) {
  throw new Error(
    "❌ MONGODB_NAME is missing. Define it in your environment to specify the target database.",
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName,
      serverSelectionTimeoutMS: 5000, // 5 seconds
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("DB connected");
    return cached.conn;
  } catch (error) {
    console.error("❌ DB connection failed:", error);
    throw new Error("DB connection failed");
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).mongoose = cached;
