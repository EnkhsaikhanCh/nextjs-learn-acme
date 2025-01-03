import { UserModel } from "@/app/api/graphql/models";
import { getAllUser } from "@/app/api/graphql/resolvers/queries";

jest.mock("../../../../../src/app/api/graphql/models/user.model", () => ({
  UserModel: {
    find: jest.fn(),
  },
}));

describe("getAllUser query", () => {
  it("should return all users", async () => {
    const mockUsers = [
      {
        _id: "1",
        name: "Bryan",
        email: "bryan@email.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "2",
        name: "Max",
        email: "max@email.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (UserModel.find as jest.Mock).mockResolvedValueOnce(mockUsers);

    const result = await getAllUser();

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(mockUsers.length);
    expect(result[0]).toHaveProperty("_id", mockUsers[0]._id);
    expect(result[0]).toHaveProperty("name", mockUsers[0].name);
    expect(result[0]).toHaveProperty("email", mockUsers[0].email);
    expect(result[1]).toHaveProperty("_id", mockUsers[1]._id);
    expect(result[1]).toHaveProperty("name", mockUsers[1].name);
    expect(result[1]).toHaveProperty("email", mockUsers[1].email);
  });
});
