// src/app/api/graphql/models/users.models.ts
import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type Course = {
  _id: string;
  title: string;
  description: string;
  price: number;
  pricingDetails?: {
    planTitle: string;
    description: string;
    price: string;
    details: string[];
  };
  sectionId: string;
  duration?: number;
  createdBy?: string;
  categories?: string[];
  tags?: string[];
  status?: "active" | "archived";
  enrollmentId?: string[];
  thumbnail?: string;
  whatYouWillLearn?: string[];
  whyChooseOurCourse?: {
    title: string;
    description: string;
  }[];
};

const CourseSchema = new Schema<Course>(
  {
    _id: { type: String, default: () => uuidv4() },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    pricingDetails: {
      type: {
        planTitle: { type: String, default: "" },
        description: { type: String, default: "" },
        price: { type: String, default: "" },
        details: { type: [String], default: [] },
      },
      default: {},
    },

    sectionId: [{ type: Schema.Types.String, ref: "Section", default: [] }],
    duration: { type: Number, min: 0 },
    createdBy: { type: String },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["active", "archived"], default: "archived" },
    enrollmentId: [
      {
        type: Schema.Types.String,
        ref: "Enrollment",
        default: [],
      },
    ],
    thumbnail: { type: String },
    whatYouWillLearn: { type: [String], default: [] },
    whyChooseOurCourse: {
      type: [
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const CourseModel = models["Course"] || model("Course", CourseSchema);
