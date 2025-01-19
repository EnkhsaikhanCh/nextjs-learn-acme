import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type ILesson = {
  _id: string;
  sectionId: string;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const LessonSchema = new Schema<ILesson>(
  {
    _id: { type: String, default: () => uuidv4() },
    sectionId: {
      type: String,
      ref: "Section",
      required: [true, "Section ID is required"],
    },
    title: { type: String, required: [true, "Title is required"] },
    content: { type: String, required: [true, "Content is required"] },
    videoUrl: {
      type: String,
      validate: {
        validator: (v: string) => {
          return !v || /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid URL!`,
      },
    },
    order: { type: Number, required: true, min: 1 },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const LessonModel =
  models.Lesson || model<ILesson>("Lesson", LessonSchema);
