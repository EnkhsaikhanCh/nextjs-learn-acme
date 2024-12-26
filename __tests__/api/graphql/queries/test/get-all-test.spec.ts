import { getAllTest } from "../../../../../src/app/api/graphql/resolvers/queries/test/get-all-test-query";
import { TestModel } from "../../../../../src/app/api/graphql/models/test.model";

jest.mock("../../../../../src/app/api/graphql/models/test.model", () => ({
  TestModel: {
    find: jest.fn(),
  },
}));

describe("getAllTest query", () => {
  it("should return all tests", async () => {
    const mockTests = [
      {
        _id: "1",
        name: "Test Name 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "2",
        name: "Test Name 2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (TestModel.find as jest.Mock).mockResolvedValueOnce(mockTests);

    const result = await getAllTest();

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(mockTests.length);
    expect(result[0]).toHaveProperty("_id", mockTests[0]._id);
    expect(result[0]).toHaveProperty("name", mockTests[0].name);
    expect(result[1]).toHaveProperty("_id", mockTests[1]._id);
    expect(result[1]).toHaveProperty("name", mockTests[1].name);
  });

  it("should return an empty array if no tests found", async () => {
    (TestModel.find as jest.Mock).mockResolvedValueOnce([]);

    const result = await getAllTest();

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });
});
