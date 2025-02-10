// src/app/api/graphql/models/users.models.ts
import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type Course = {
  _id: string;
  title: string;
  description: string;
  slug: string;
  courseCode: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  price?: {
    amount: number;
    currency: "USD" | "MNT";
    discount: number;
  };
  pricingDetails?: {
    planTitle: string;
    description: string;
    price: string;
    details: string[];
  };
  sectionId: string;
  categories?: string[];
  tags?: string[];
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  thumbnail?: string;
  whatYouWillLearn?: string[];
  whyChooseOurCourse?: {
    icon: string;
    title: string;
    description: string;
  }[];
};

const CourseSchema = new Schema<Course>(
  {
    _id: { type: String, default: () => uuidv4() },
    title: { type: String, required: true },
    description: { type: String },
    slug: { type: String },
    courseCode: { type: String, required: true, unique: true },
    difficulty: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
    },
    price: {
      type: new Schema(
        {
          amount: { type: Number, default: 0 },
          currency: { type: String, enum: ["USD", "MNT"], default: "MNT" },
          discount: { type: Number, default: 0 },
        },
        { _id: false },
      ),
      default: {},
    },
    pricingDetails: {
      type: new Schema(
        {
          planTitle: { type: String, default: "" },
          description: { type: String, default: "" },
          price: { type: String, default: "" },
          details: { type: [String], default: [] },
        },
        { _id: false },
      ),
      default: {},
    },
    sectionId: [{ type: Schema.Types.String, ref: "Section", default: [] }],
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    thumbnail: { type: String },
    whatYouWillLearn: { type: [String], default: [] },

    whyChooseOurCourse: {
      type: [
        new Schema(
          {
            icon: { type: String },
            title: { type: String },
            description: { type: String },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const CourseModel = models["Course"] || model("Course", CourseSchema);
