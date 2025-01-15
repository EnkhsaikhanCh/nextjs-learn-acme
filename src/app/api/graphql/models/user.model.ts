// src/app/api/graphql/models/users.models.ts
import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type User = {
  _id: string;
  email: string;
  studentId: string;
  role: "student" | "admin";
  password: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
};

const UserSchema = new Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, unique: true },
    role: { type: String, enum: ["student", "admin"], required: true },
    password: { type: String, required: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true },
);

export const UserModel = models["User"] || model<User>("User", UserSchema);
