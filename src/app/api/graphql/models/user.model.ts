import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type User = {
  _id: string;
  name: string;
  nameIv: string;
  nameAuthTag: string;
  email: string;
  emailIv: string;
  emailAuthTag: string;
  emailHash: string;
  studentId: string;
  studentIdIv: string;
  studentIdAuthTag: string;
  password: string;
};

const UserSchema = new Schema(
  {
    _id: { type: String, default: () => uuidv4() },
    name: { type: String, required: true },
    nameIv: { type: String, required: true, minlength: 24, maxlength: 24 }, // 12 байт (hex формат)
    nameAuthTag: {
      type: String,
      required: false,
      minlength: 32,
      maxlength: 32,
    }, // 16 байт (hex формат)
    email: { type: String, unique: true, required: true },
    emailIv: { type: String, required: true, minlength: 24, maxlength: 24 },
    emailAuthTag: {
      type: String,
      required: true,
      minlength: 32,
      maxlength: 32,
    },
    emailHash: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    studentIdIv: {
      type: String,
      required: true,
      minlength: 24,
      maxlength: 24,
    },
    studentIdAuthTag: {
      type: String,
      required: true,
      minlength: 32,
      maxlength: 32,
    },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export const UserModel = models["User"] || model<User>("User", UserSchema);
