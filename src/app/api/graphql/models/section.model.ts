import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type Section = {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessonId: string[];
  createdAt: Date;
  updatedAt: Date;
};

const SectionSchema = new Schema<Section>(
  {
    _id: { type: String, default: () => uuidv4() },
    courseId: {
      type: String,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
    title: { type: String, required: true },
    description: { type: String },
    order: { type: Number, required: true, min: 1 },
    lessonId: [
      {
        type: Schema.Types.String,
        ref: "Lesson",
        required: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const SectionModel =
  models["Section"] || model("Section", SectionSchema);
