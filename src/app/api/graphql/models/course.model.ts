// src/app/api/graphql/models/users.models.ts
import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type PricingPlan = {
  planTitle: string; // "Basic", "Premium", "Lifetime" гэх мэт
  description?: string; // UI-д товч тайлбар
  amount: number; // үнэлгээ (₮)
  currency: "MNT";
  accessDurationDays?: number; // 30 хоног, 365 хоног, насан турш гэх мэт
  isPopular?: boolean; // UI-д онцлох
  stripePriceId?: string; // Хэрвээ Stripe ашиглаж байвал
};

export type Course = {
  _id: string;
  createdBy: string;
  title: string;
  description: string;
  slug: string;
  courseCode: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  pricingPlans?: PricingPlan[];
  sectionId: string[];
  thumbnail?: string;
  categories?: string[];
  tags?: string[];
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  whatYouWillLearn?: string[];
};

const PricingPlanSchema = new Schema(
  {
    planTitle: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ["MNT"], required: true },
    accessDurationDays: { type: Number }, // optional
    isPopular: { type: Boolean, default: false },
    stripePriceId: { type: String },
  },
  { _id: false },
);

const CourseSchema = new Schema<Course>(
  {
    _id: { type: String, default: () => uuidv4() },
    createdBy: { type: Schema.Types.String, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    slug: { type: String },
    courseCode: { type: String, required: true, unique: true },
    pricingPlans: { type: [PricingPlanSchema], default: [] },
    sectionId: [{ type: Schema.Types.String, ref: "Section", default: [] }],
    thumbnail: { type: String },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    whatYouWillLearn: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const CourseModel = models["Course"] || model("Course", CourseSchema);
