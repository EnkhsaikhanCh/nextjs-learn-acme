import {
  me,
  getUserById,
} from "../../../../../src/app/api/graphql/resolvers/queries/user/get-user-by-id-query";
import { requireUser } from "../../../../../src/app/api/graphql/auth";
import { UserModel } from "../../../../../src/app/api/graphql/models";
import { Context } from "../../../../../src/app/api/graphql/schemas/user.schema";
import { GraphQLError } from "graphql";

// Mock the dependencies
jest.mock("../../../../../src/app/api/graphql/auth", () => ({
  requireUser: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

describe("User Resolver Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("me resolver", () => {
    it("should return null if context.user is not present", async () => {
      // Arrange
      const context = { user: null } as unknown as Context;

      // Act
      const result = await me({}, {}, context);

      // Assert
      expect(result).toBeNull();
      expect(UserModel.findById).not.toHaveBeenCalled();
    });

    it("should return the user if found by ID", async () => {
      // Arrange
      const fakeUser = { _id: "123", name: "Test User" };
      (UserModel.findById as jest.Mock).mockResolvedValueOnce(fakeUser);

      const context = { user: { _id: "123" } } as unknown as Context;

      // Act
      const result = await me({}, {}, context);

      // Assert
      expect(UserModel.findById).toHaveBeenCalledWith("123");
      expect(result).toEqual(fakeUser);
    });

    it("should throw an INTERNAL_SERVER_ERROR if database operation fails", async () => {
      // Arrange
      const errorMessage = "Database error";

      // Mock UserModel.findById to throw an error
      (UserModel.findById as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage),
      );

      const context = { user: { _id: "123" } } as unknown as Context;

      // Act
      const promise = me({}, {}, context);

      // Assert
      await expect(promise).rejects.toThrow(GraphQLError);
      await expect(promise).rejects.toMatchObject({
        message: `Failed to fetch user: ${errorMessage}`,
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      });
    });
  });

  describe("getUserById resolver", () => {
    it("should call requireUser and throw if user is not authorized", async () => {
      // Arrange
      const errorMessage = "Not authorized";
      (requireUser as jest.Mock).mockImplementationOnce(() => {
        throw new GraphQLError(errorMessage, {
          extensions: { code: "UNAUTHORIZED" },
        });
      });
      const context = {} as Context;

      // Act & Assert
      await expect(
        getUserById({}, { _id: "some_id" }, context),
      ).rejects.toThrow(GraphQLError);
      expect(requireUser).toHaveBeenCalledWith(context);
    });

    it("should throw if user is not found", async () => {
      // Arrange
      (requireUser as jest.Mock).mockImplementation(() => {});
      (UserModel.findById as jest.Mock).mockResolvedValueOnce(null);

      const context = {} as Context;

      // Act & Assert
      await expect(
        getUserById({}, { _id: "unknown_id" }, context),
      ).rejects.toThrow(GraphQLError);
      await expect(
        getUserById({}, { _id: "unknown_id" }, context),
      ).rejects.toMatchObject({
        message: "User not found",
        extensions: {
          code: "USER_NOT_FOUND",
          http: { status: 404 },
        },
      });
    });

    it("should return the user if found", async () => {
      // Arrange
      const fakeUser = { _id: "123", name: "Test User" };
      (requireUser as jest.Mock).mockImplementation(() => {});
      (UserModel.findById as jest.Mock).mockResolvedValueOnce(fakeUser);

      const context = {} as Context;

      // Act
      const result = await getUserById({}, { _id: "123" }, context);

      // Assert
      expect(requireUser).toHaveBeenCalledWith(context);
      expect(UserModel.findById).toHaveBeenCalledWith("123");
      expect(result).toEqual(fakeUser);
    });

    it("should throw an INTERNAL_SERVER_ERROR if something else fails", async () => {
      // Arrange
      const errorMessage = "Some database error";

      // Make sure there's no user-based check that fails first
      (requireUser as jest.Mock).mockImplementation(() => {});

      // Force a DB error
      (UserModel.findById as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage),
      );

      const context = {} as Context;

      // Act
      const promise = getUserById({}, { _id: "123" }, context);

      // Assert
      await expect(promise).rejects.toThrow(GraphQLError);
      await expect(promise).rejects.toMatchObject({
        message: `Failed to fetch user: ${errorMessage}`,
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          http: {
            status: 500,
          },
        },
      });
    });
  });
});
