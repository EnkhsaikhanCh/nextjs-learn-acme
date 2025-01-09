import { GraphQLError } from "graphql";
import { changePassword } from "../../../../../src/app/api/graphql/resolvers/mutations/user/change-password-mutation";
import { UserModel } from "../../../../../src/app/api/graphql/models/user.model";
import argon2 from "argon2";
import { validationPassword } from "../../../../../src/utils/validation";
import jwt from "jsonwebtoken";
import type { ChangePasswordInput } from "../../../../../src/app/api/graphql/schemas/user.schema";

// ---- Mocking the dependencies ----
jest.mock("../../../../../src/app/api/graphql/models/user.model", () => ({
  UserModel: {
    findById: jest.fn(),
  },
}));

jest.mock("argon2", () => ({
  verify: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("../../../../../src/utils/validation", () => ({
  validationPassword: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const callChangePassword = async (input: ChangePasswordInput, _id: string) => {
  try {
    const result = await changePassword(
      null,
      { input, _id },
      {
        user: {
          _id,
          email: "mock@example.com",
          studentId: "123456",
          role: "student",
          password: "mockPassword",
        },
      },
    );
    return result;
  } catch (error) {
    throw error;
  }
};

describe("changePassword Mutation", () => {
  const MOCK_USER_ID = "mockUserId";
  const MOCK_CURRENT_PASSWORD = "CurrentPassword123!";
  const MOCK_NEW_PASSWORD = "NewPassword123!";
  const MOCK_TOKEN = "mockToken";

  const mockUser: any = {
    _id: MOCK_USER_ID,
    password: "hashedOldPassword",
    email: "user@example.com",
    role: "user",
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("throws an error if JWT_SECRET is not defined", async () => {
    // Mock required dependencies
    (UserModel.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(true); // Current password matches
    (validationPassword as jest.Mock).mockReturnValueOnce(true); // Password validation passes
    (argon2.verify as jest.Mock).mockResolvedValueOnce(false); // New password is not the same as old

    // Remove JWT_SECRET from environment variables
    const originalEnv = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    // Call the mutation and expect it to throw an error
    await expect(
      changePassword(
        null,
        {
          input: {
            currentPassword: MOCK_CURRENT_PASSWORD,
            newPassword: MOCK_NEW_PASSWORD,
          },
          _id: MOCK_USER_ID,
        },
        {
          user: {
            _id: MOCK_USER_ID,
            email: "mock@example.com",
            studentId: "123456",
            role: "student",
            password: "mockHashedPassword",
          },
        },
      ),
    ).rejects.toThrowError(
      new GraphQLError("JWT_SECRET is not defined in environment variables"),
    );

    // Restore the original environment variable
    process.env.JWT_SECRET = originalEnv;
  });

  it("throws USER_NOT_FOUND if the user does not exist", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      callChangePassword(
        { currentPassword: "whatever", newPassword: "irrelevant" },
        MOCK_USER_ID,
      ),
    ).rejects.toThrowError(
      new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      }),
    );

    expect(UserModel.findById).toHaveBeenCalledWith(MOCK_USER_ID);
  });

  it("throws INVALID_CREDENTIALS if current password is incorrect", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(false); // current password does not match

    await expect(
      callChangePassword(
        { currentPassword: "wrongPassword", newPassword: MOCK_NEW_PASSWORD },
        MOCK_USER_ID,
      ),
    ).rejects.toThrowError(
      new GraphQLError("Invalid credentials", {
        extensions: { code: "INVALID_CREDENTIALS" },
      }),
    );
  });

  it("throws BAD_USER_INPUT if new password fails validation", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(true); // current password matches
    (validationPassword as jest.Mock).mockReturnValueOnce(false); // password fails validation

    await expect(
      callChangePassword(
        { currentPassword: MOCK_CURRENT_PASSWORD, newPassword: "invalid" },
        MOCK_USER_ID,
      ),
    ).rejects.toThrowError(GraphQLError);

    expect(validationPassword).toHaveBeenCalledWith("invalid");
  });

  it("throws BAD_USER_INPUT if new password is the same as the old password", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(true);
    (validationPassword as jest.Mock).mockReturnValueOnce(true);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(true);

    await expect(
      callChangePassword(
        {
          currentPassword: MOCK_CURRENT_PASSWORD,
          newPassword: MOCK_NEW_PASSWORD,
        },
        MOCK_USER_ID,
      ),
    ).rejects.toThrowError(
      new GraphQLError("New password cannot be the same as the old password", {
        extensions: { code: "BAD_USER_INPUT" },
      }),
    );
  });

  it("returns success message and new token if password is updated successfully", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(true);
    (validationPassword as jest.Mock).mockReturnValueOnce(true);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(false); // new password not the same as old
    (argon2.hash as jest.Mock).mockResolvedValueOnce("hashedNewPassword");
    (jwt.sign as jest.Mock).mockReturnValueOnce(MOCK_TOKEN);

    const result = await callChangePassword(
      {
        currentPassword: MOCK_CURRENT_PASSWORD,
        newPassword: MOCK_NEW_PASSWORD,
      },
      MOCK_USER_ID,
    );

    expect(result).toEqual({
      message: "Password updated successfully",
      token: MOCK_TOKEN,
    });

    expect(argon2.hash).toHaveBeenCalledWith(
      MOCK_NEW_PASSWORD,
      expect.any(Object),
    );
    expect(mockUser.save).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: MOCK_USER_ID,
        email: mockUser.email,
        role: mockUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
  });
});
