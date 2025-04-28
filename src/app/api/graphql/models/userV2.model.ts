import { UserV2Role } from "@/generated/graphql";
import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const baseOptions = {
  timestamps: true,
  discriminatorKey: "role", // ROLE field-ийг discriminator болгож ашиглана
};

// --- Base User Schema (Shared fields) ---
const UserV2Schema = new Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: UserV2Role,
      required: true,
      default: UserV2Role.Student,
    },
  },
  baseOptions,
);

// Base Model
export const UserV2Model = models.UserV2 || model("UserV2", UserV2Schema);

// --- Helper function for discriminator creation ---
const discriminator = (name: string, schema: Schema) => {
  return (
    UserV2Model.discriminators?.[name] ||
    UserV2Model.discriminator(name, schema)
  );
};

// --- StudentUserV2 schema ---
export const StudentUserV2 = discriminator(
  UserV2Role.Student,
  new Schema({
    studentId: { type: String, unique: true, sparse: true },
  }),
);

// --- InstructorUserV2 schema ---
const ProfilePicture = new Schema(
  {
    publicId: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
  },
  { _id: false },
);

export const InstructorUserV2 = discriminator(
  UserV2Role.Instructor,
  new Schema({
    fullName: { type: String },
    bio: { type: String },
    profilePicture: { type: ProfilePicture },
  }),
);

// --- AdminUserV2 schema ---
export const AdminUserV2 = discriminator(
  UserV2Role.Admin,
  new Schema({
    adminLevel: { type: Number, default: 1 },
  }),
);
