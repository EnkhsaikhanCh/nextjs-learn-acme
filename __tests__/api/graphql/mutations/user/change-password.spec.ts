import { GraphQLError } from "graphql";
import { changePassword } from "../../../../../src/app/api/graphql/resolvers/mutations/user/change-password-mutation"; //
import { UserModel } from "../../../../../src/app/api/graphql/models/user.model";
import argon2 from "argon2";
import { validationPassword } from "../../../../../src/utils/validation";
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

// ---- Helper function to wrap resolver call in a try/catch ----
const callChangePassword = async (input: ChangePasswordInput, _id: string) => {
  try {
    const result = await changePassword(null, { input, _id });
    return result;
  } catch (error) {
    throw error;
  }
};

describe("changePassword Mutation", () => {
  const MOCK_USER_ID = "mockUserId";
  const MOCK_CURRENT_PASSWORD = "CurrentPassword123!";
  const MOCK_NEW_PASSWORD = "NewPassword123!";

  const mockUser: any = {
    _id: MOCK_USER_ID,
    password: "hashedOldPassword",
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
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

  it("returns success message if password is updated successfully", async () => {
    (UserModel.findById as jest.Mock).mockResolvedValueOnce(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(true);
    (validationPassword as jest.Mock).mockReturnValueOnce(true);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(false);
    (argon2.hash as jest.Mock).mockResolvedValueOnce("hashedNewPassword");

    const result = await callChangePassword(
      {
        currentPassword: MOCK_CURRENT_PASSWORD,
        newPassword: MOCK_NEW_PASSWORD,
      },
      MOCK_USER_ID,
    );

    expect(result).toEqual({ message: "Password updated successfully" });
    expect(argon2.hash).toHaveBeenCalledWith(
      MOCK_NEW_PASSWORD,
      expect.any(Object),
    );
    expect(mockUser.save).toHaveBeenCalledTimes(1);
  });
});
