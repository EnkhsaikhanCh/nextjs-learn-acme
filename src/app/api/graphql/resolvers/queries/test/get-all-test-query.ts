import { connectToDatabase } from "@/lib/mongodb";
import { TestModel } from "../../../models";

export const getAllTest = async () => {
  await connectToDatabase();
  const tests = await TestModel.find();
  return tests;
};
