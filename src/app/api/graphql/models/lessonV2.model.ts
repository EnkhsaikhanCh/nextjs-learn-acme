import { LessonType } from "@/generated/graphql";
import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const baseOptions = {
  timestamps: true,
  discriminatorKey: "type",
};

// Base Lesson Schema (common fields)
const LessonV2Schema = new Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    sectionId: {
      type: String,
      ref: "Section",
      required: [true, "Section ID is required"],
    },
    title: { type: String, required: [true, "Title is required"] },
    order: { type: Number, required: true, min: 1 },
    isPublished: { type: Boolean, default: false },
    type: {
      type: String,
      required: [true, "Lesson type is required"],
      enum: LessonType,
    },
  },
  baseOptions,
);

// Base model
const LessonV2Model = models.LessonV2 || model("LessonV2", LessonV2Schema);

// Utility for avoiding duplicate discriminator registration
const discriminator = (name: string, schema: Schema) => {
  return (
    LessonV2Model.discriminators?.[name] ||
    LessonV2Model.discriminator(name, schema)
  );
};

// Discriminators for each lesson type
const VideoLesson = discriminator(
  LessonType.Video,
  new Schema({
    passthrough: { type: String, default: null },
    duration: { type: Number, default: null },
    status: { type: String, default: null },
    muxUploadId: { type: String, default: null },
    muxAssetId: { type: String, default: null },
    muxPlaybackId: { type: String, default: null },
  }),
);

const TextLesson = discriminator(
  "TEXT",
  new Schema({
    content: {
      type: String,
      // required: [true, "Content is required for text lessons"],
    },
  }),
);

const FileLesson = discriminator(
  "FILE",
  new Schema({
    fileUrl: {
      type: String,
      // required: [true, "File URL is required for file lessons"],
    },
  }),
);

const QuizLesson = discriminator(
  "QUIZ",
  new Schema({
    quizQuestions: {
      type: [{ question: String, answers: [String], correctAnswer: String }],
      // required: [true, "Quiz questions are required for quiz lessons"],
    },
  }),
);

const AssignmentLesson = discriminator(
  "ASSIGNMENT",
  new Schema({
    assignmentDetails: {
      type: String,
      // required: [
      //   true,
      //   "Assignment details are required for assignment lessons",
      // ],
    },
  }),
);

// Export the base model
export {
  LessonV2Model,
  VideoLesson,
  TextLesson,
  FileLesson,
  QuizLesson,
  AssignmentLesson,
};
