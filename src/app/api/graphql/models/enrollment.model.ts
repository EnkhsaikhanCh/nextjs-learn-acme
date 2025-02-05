// src/app/api/graphql/models/enrollment.models.ts
import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { CourseModel } from "./course.model";

export type Enrollment = {
  // Essential fields
  _id: string;
  courseId: string;
  userId: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PENDING";
  progress: number;

  // User experience-related fields
  isCompleted: boolean;
  completedLessons: string[];
  lastAccessedAt: Date | null;

  // System tracking fields
  history: {
    status: string;
    progress: number;
    updatedAt: Date;
  }[];
  isDeleted: boolean;
};

const EnrollmentSchema = new Schema<Enrollment>(
  {
    // Essential fields
    _id: { type: String, default: () => uuidv4() },
    courseId: {
      type: Schema.Types.String,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
    userId: {
      type: Schema.Types.String,
      ref: "User",
      required: [true, "User ID is required"],
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED", "PENDING"],
      default: "ACTIVE",
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot exceed 100"],
    },

    // User experience-related fields
    isCompleted: { type: Boolean, default: false },
    completedLessons: { type: [Schema.Types.String], default: [] },
    lastAccessedAt: { type: Date, default: null },

    // System tracking fields
    history: [
      {
        status: { type: String, required: true },
        progress: { type: Number, required: true },
        updatedAt: { type: Date, required: true },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

/**
 * Virtual to dynamically calculate total lessons
 */
EnrollmentSchema.virtual("totalLessons").get(async function () {
  const course = await CourseModel.findById(this.courseId).populate({
    path: "sectionId",
    populate: { path: "lessonId" },
  });

  if (!course) return 0;

  // Calculate the total number of lessons across all sections
  return course.sectionId.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (total: number, section: any) => total + section.lessonId.length,
    0,
  );
});

/**
 * Virtual to dynamically calculate progress
 */
EnrollmentSchema.virtual("calculatedProgress").get(function () {
  const totalLessons = this.get("totalLessons");
  if (!totalLessons || totalLessons === 0) return 0;

  const completedCount = this.get("completedLessons")?.length || 0;
  return Math.min((completedCount / totalLessons) * 100, 100);
});

/**
 * Transform the toJSON output
 */
EnrollmentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

/**
 * Pre-save hook to log updates
 */
EnrollmentSchema.pre("save", function (next) {
  if (this.isModified("completedLessons") || this.isModified("progress")) {
    console.log(
      `Enrollment updated: progress=${this.progress}, completedLessons=${this.completedLessons?.length}`,
    );
  }
  next();
});

export const EnrollmentModel =
  models["Enrollment"] || model<Enrollment>("Enrollment", EnrollmentSchema);
