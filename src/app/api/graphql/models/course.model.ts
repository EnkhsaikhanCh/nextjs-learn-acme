// src/app/api/graphql/models/users.models.ts
import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type Course = {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration?: number;
  createdBy?: string;
  categories?: string[];
  tags?: string[];
  status?: "active" | "archived";
  // enrollments?: string[];
  thumbnail?: string;
};

const CourseSchema = new Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, min: 0 },
    createdBy: { type: String },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["active", "archived"], default: "archived" },
    // enrollments: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Enrollments",
    //     default: [],
    //   },
    // ],
    thumbnail: { type: String },
  },
  { timestamps: true },
);

export const CourseModel = models["Course"] || model("Course", CourseSchema);
