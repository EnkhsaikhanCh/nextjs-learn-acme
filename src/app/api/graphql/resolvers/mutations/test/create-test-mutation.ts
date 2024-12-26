import { TestModel } from "../../../models";

export const createTest = async (_: unknown, { name }: { name: string }) => {
  const test = new TestModel({ name });
  await test.save();
  return test;
};
