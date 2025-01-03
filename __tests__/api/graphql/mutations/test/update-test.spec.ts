import { updateTest } from "../../../../../src/app/api/graphql/resolvers/mutations/test/update-test-mutation";

const mockTest = {
  _id: "1",
  name: "Updated Test Name",
  createdAt: new Date(),
  updatedAt: new Date(),
};

jest.mock("../../../../../src/app/api/graphql/models/test.model", () => ({
  TestModel: {
    findByIdAndUpdate: jest.fn().mockResolvedValue({
      toObject: () => mockTest,
    }),
  },
}));

describe("updateTest mutation", () => {
  it("should update a test", async () => {
    const result = await updateTest(
      {},
      { id: mockTest._id, name: mockTest.name },
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty("_id", mockTest._id);
    expect(result).toHaveProperty("name", mockTest.name);
  });
});
