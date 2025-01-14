// Jest test for getUserById
import { getUserById } from "../../../../../src/app/api/graphql/resolvers/queries/user";
import { UserModel } from "../../../../../src/app/api/graphql/models/user.model";
import { GraphQLError } from "graphql";

jest.mock("../../../../../src/app/api/graphql/models/user.model", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

describe("getUserById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the user if found", async () => {
    const mockUser = { _id: "123", name: "Test User" };
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUserById({}, { _id: "123" });

    expect(UserModel.findById).toHaveBeenCalledWith("123");
    expect(result).toEqual(mockUser);
  });

  it("should throw a USER_NOT_FOUND error if user is not found", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(getUserById({}, { _id: "123" })).rejects.toThrow(GraphQLError);
    await expect(getUserById({}, { _id: "123" })).rejects.toThrow(
      "User not found",
    );

    expect(UserModel.findById).toHaveBeenCalledWith("123");
  });

  it("should throw an INTERNAL_SERVER_ERROR if an unexpected error occurs", async () => {
    (UserModel.findById as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    await expect(getUserById({}, { _id: "123" })).rejects.toThrow(GraphQLError);
    await expect(getUserById({}, { _id: "123" })).rejects.toThrow(
      "Failed to fetch user",
    );

    expect(UserModel.findById).toHaveBeenCalledWith("123");
  });
});
