import { deleteTest } from "@/app/api/graphql/resolvers/mutations/test/delete-test-mutation";

const mockTest = {
  _id: "1",
  name: "Test Name",
  createdAt: new Date(),
  updatedAt: new Date(),
};

jest.mock("../../../../../src/app/api/graphql/models/test.model", () => ({
  TestModel: {
    findByIdAndDelete: jest.fn().mockResolvedValue({
      toObject: () => mockTest,
    }),
  },
}));

describe("deleteTest mutation", () => {
  it("should delete a test", async () => {
    const result = await deleteTest({}, { id: mockTest._id });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("_id", mockTest._id);
    expect(result).toHaveProperty("name", mockTest.name);
  });
});
