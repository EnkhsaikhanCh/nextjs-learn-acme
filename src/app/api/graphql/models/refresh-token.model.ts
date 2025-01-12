// src/app/api/graphql/models/refreshToken.model.ts
import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type RefreshToken = {
  _id: string;
  token: string;
  user: string; // хэрэглэгчийн _id
  expiryDate: Date; // дуусах хугацаа (mongodb нь дууссан үед автоматаар устгана)
};

const RefreshTokenSchema = new Schema<RefreshToken>({
  _id: { type: String, default: () => uuidv4() },
  token: { type: String, required: true },
  user: { type: String, ref: "User", required: true },
  expiryDate: { type: Date, required: true },
});

RefreshTokenSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel =
  models["RefreshToken"] ||
  model<RefreshToken>("RefreshToken", RefreshTokenSchema);
