// src/app/api/graphql/models/subscriber.model.ts
import { model, models, Schema, type Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISubscriber extends Document {
  _id: string;
  email: string;
  subscribedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    _id: { type: String, default: () => uuidv4() },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    subscribedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: false },
);

export const SubscriberModel =
  models["Subscriber"] || model<ISubscriber>("Subscriber", SubscriberSchema);
