import { TestModel } from "../../../models";

export const getAllTest = async () => {
  const tests = await TestModel.find();
  return tests;
};
