// src/lib/mongodb.ts
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("already connected");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    isConnected = true;
    console.log("connected to database");
  } catch (error) {
    console.log("error connecting to database", error);
    throw new Error("Error connecting to MongoDB");
  }
};
