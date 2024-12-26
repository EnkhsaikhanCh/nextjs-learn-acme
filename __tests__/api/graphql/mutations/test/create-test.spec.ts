import { createTest } from "../../../../../src/app/api/graphql/resolvers/mutations/test/create-test-mutation";

const mockTest = {
  _id: "1",
  name: "Test Name",
  createdAt: new Date(),
  updatedAt: new Date(),
};

jest.mock("../../../../../src/app/api/graphql/models/test.model", () => ({
  TestModel: {
    create: jest.fn().mockResolvedValue({
      toObject: () => mockTest,
    }),
  },
}));

describe("createTest mutation", () => {
  it("should create a new test", async () => {
    const result = await createTest({}, { name: mockTest.name });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("_id", mockTest._id);
    expect(result).toHaveProperty("name", mockTest.name);
  });
});
