import { connectToDatabase } from "@/lib/mongodb";
import { TestModel } from "../../../models";

export const createTest = async (_: any, { name }: { name: string }) => {
  await connectToDatabase();
  const test = new TestModel({ name });
  await test.save();
  return test;
};
