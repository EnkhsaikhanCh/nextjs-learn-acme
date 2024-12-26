import { TestModel } from "../../../models";

export const createTest = async (_: unknown, { name }: { name: string }) => {
  const test = await TestModel.create({ name });
  return test.toObject();
};
