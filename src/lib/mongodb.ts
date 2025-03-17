// src/lib/mongodb.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

// Global кэш үүсгэх (Next.js, Serverless орчинд тохиромжтой)
// eslint-disable-next-line prefer-const, @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName: "test",
      })
      .then((mongoose) => {
        return mongoose;
      })
      .catch(() => {
        throw new Error("Database connection failed");
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

// Global объектод хадгалах
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).mongoose = cached;
