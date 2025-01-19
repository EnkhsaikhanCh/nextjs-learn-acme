import { Schema, model, models } from "mongoose";

export type Section = {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  //   lessonId: string[];
  createdAt: Date;
  updatedAt: Date;
};

const SectionSchema = new Schema<Section>(
  {
    _id: { type: String, default: () => require("uuid").v4() },
    courseId: {
      type: String,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
    title: { type: String, required: true },
    description: { type: String },
    order: { type: Number, required: true, min: 1 },
    // lessonId: [
    //   {
    //     type: String,
    //     ref: "Lesson",
    //     required: [],
    //   },
    // ],
  },
  {
    timestamps: true,
  },
);

export const SectionModel =
  models["Section"] || model("Section", SectionSchema);
