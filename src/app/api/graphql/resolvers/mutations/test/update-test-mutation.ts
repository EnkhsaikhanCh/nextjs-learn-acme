import { TestModel } from "../../../models";

export const updateTest = async (
  _: unknown,
  { id, name }: { id: string; name: string },
) => {
  const test = await TestModel.findByIdAndUpdate(id, { name }, { new: true });
  return test.toObject();
};
