import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export type Test = {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

const TestSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const TestModel = models["Test"] || model<Test>("Test", TestSchema);
