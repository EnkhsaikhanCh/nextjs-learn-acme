// src/app/api/graphql/models/users.models.ts
import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type PricingPlan = {
  planTitle: string; // "Basic", "Premium", "Lifetime" гэх мэт
  description?: string; // UI-д товч тайлбар
  amount: number; // үнэлгээ (₮)
  currency: "MNT";
};

export type Course = {
  _id: string;
  createdBy: string;
  title: string;
  subtitle: string;
  description: string;
  requirements?: string;
  slug: string;
  courseCode: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price?: PricingPlan;
  sectionId: string[];
  thumbnail?: {
    publicId: string;
    width?: number;
    height?: number;
    format?: string;
  };
  category?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  whatYouWillLearn?: string[];
  whoIsThisFor?: string;
  sectionCount: number;
};

const PricingPlanSchema = new Schema(
  {
    planTitle: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["MNT"], required: true },
  },
  { _id: false },
);

const ThumbnailSchema = new Schema(
  {
    publicId: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
  },
  { _id: false },
);

const CourseSchema = new Schema<Course>(
  {
    _id: { type: String, default: () => uuidv4() },
    createdBy: { type: Schema.Types.String, ref: "User", required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    requirements: { type: String },
    slug: { type: String },
    courseCode: { type: String, required: true, unique: true },
    difficulty: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    },
    price: { type: PricingPlanSchema },
    sectionId: [{ type: Schema.Types.String, ref: "Section", default: [] }],
    thumbnail: { type: ThumbnailSchema },
    category: { type: String },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    whatYouWillLearn: { type: [String] },
    whoIsThisFor: { type: String },
    sectionCount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

export const CourseModel = models["Course"] || model("Course", CourseSchema);
