import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type IEnrollmentV2 = {
  _id: string;
  userId: string;
  courseId: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PENDING" | "EXPIRED";
  progress: number;
  isCompleted: boolean;
  completedLessons: string[];
  lastAccessedAt: Date | null;
  expiryDate?: Date | null;
  history: {
    status: string;
    progress: number;
    updatedAt: Date;
  }[];
  isDeleted: boolean;
};

const EnrollmentV2Schema = new Schema<IEnrollmentV2>(
  {
    _id: { type: String, default: () => uuidv4() },
    userId: {
      type: String,
      ref: "User",
      required: [true, "User ID is required"],
    },
    courseId: {
      type: String,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED", "PENDING", "EXPIRED"],
      default: "ACTIVE",
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot exceed 100"],
    },
    isCompleted: { type: Boolean, default: false },
    completedLessons: { type: [String], default: [] },
    lastAccessedAt: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    history: [
      {
        status: { type: String, required: true },
        progress: { type: Number, required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const EnrollmentV2Model =
  models["EnrollmentV2"] ||
  model<IEnrollmentV2>("EnrollmentV2", EnrollmentV2Schema);
