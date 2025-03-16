// src/app/api/graphql/models/users.models.ts
import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type User = {
  _id: string;
  email: string;
  studentId?: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  password: string;
  isVerified: boolean;
  enrolledCourses?: string;
};

const UserSchema = new Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Имэйл хаяг буруу",
      ],
    },
    studentId: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
      default: "STUDENT",
    },
    password: { type: String, required: true, minlength: 8 },
    isVerified: { type: Boolean, default: false },
    enrolledCourses: [{ type: String, ref: "Course" }],
  },
  { timestamps: true },
);

export const UserModel = models["User"] || model<User>("User", UserSchema);
