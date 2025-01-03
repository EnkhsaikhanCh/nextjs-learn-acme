import { TestModel } from "../../../models";

export const deleteTest = async (_: unknown, { id }: { id: string }) => {
  const test = await TestModel.findByIdAndDelete(id);
  return test?.toObject();
};
