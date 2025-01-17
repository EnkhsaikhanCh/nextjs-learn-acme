// src/app/api/graphql/models/enrollment.models.ts
import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type Enrollment = {
  _id: string;
  userId: string;
  courseId: string;
  progress: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "PENDING";
  isDeleted: boolean;
};

const EnrollmentSchema = new Schema<Enrollment>(
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
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot exceed 100"],
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "COMPLETED", "CANCELLED", "PENDING"],
        message: "Status must be one of ACTIVE, COMPLETED, CANCELLED, PENDING",
      },
      default: "ACTIVE",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

EnrollmentSchema.virtual("isCompleted").get(function () {
  return this.status === "COMPLETED";
});

EnrollmentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

EnrollmentSchema.pre("save", function (next) {
  if (this.isModified("progress")) {
    console.log(`Progress updated to ${this.progress}`);
  }
  next();
});

export const EnrollmentModel =
  models["Enrollment"] || model<Enrollment>("Enrollment", EnrollmentSchema);
