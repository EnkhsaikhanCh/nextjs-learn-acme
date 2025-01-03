import { UserModel } from "@/app/api/graphql/models";
import { changePassword } from "@/app/api/graphql/resolvers/mutations";
import { GraphQLError } from "graphql";
import bcrypt from "bcrypt";

jest.mock("../../../../../src/app/api/graphql/models");
jest.mock("bcrypt");

describe("changePassword", () => {
  const mockUser = {
    _id: "12345",
    password: "hashedPassword",
    save: jest.fn().mockResolvedValue(true),
  };

  const input = {
    currentPassword: "currentPassword",
    newPassword: "NewPassword123",
  };

  const _id = "12345";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the password successfully", async () => {
    UserModel.findById = jest.fn().mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    bcrypt.hash = jest.fn().mockResolvedValue("hashedNewPassword");

    const result = await changePassword(null, { input, _id });

    expect(UserModel.findById).toHaveBeenCalledWith(_id);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      input.currentPassword,
      "hashedPassword",
    );
    expect(bcrypt.hash).toHaveBeenCalledWith(input.newPassword, 10);
    expect(mockUser.password).toBe("hashedNewPassword");
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toEqual({ message: "Password updated successfully" });
  });

  it("should throw an error if the user is not found", async () => {
    UserModel.findById = jest.fn().mockResolvedValue(null);

    await expect(changePassword(null, { input, _id })).rejects.toThrow(
      new GraphQLError("User not found"),
    );

    expect(UserModel.findById).toHaveBeenCalledWith(_id);
  });

  it("should throw an error if the current password is incorrect", async () => {
    UserModel.findById = jest.fn().mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await expect(changePassword(null, { input, _id })).rejects.toThrow(
      new GraphQLError("Invalid credentials"),
    );

    expect(UserModel.findById).toHaveBeenCalledWith(_id);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      input.currentPassword,
      mockUser.password,
    );
  });

  it("should throw an error if the new password is not strong enough", async () => {
    UserModel.findById = jest.fn().mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const weakPasswordInput = { ...input, newPassword: "weak" };

    await expect(
      changePassword(null, { input: weakPasswordInput, _id }),
    ).rejects.toThrow(
      new GraphQLError(
        "Password must be at least 8 characters long and include letters and numbers.",
      ),
    );

    expect(UserModel.findById).toHaveBeenCalledWith(_id);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      weakPasswordInput.currentPassword,
      mockUser.password,
    );
  });

  it("should handle unexpected errors", async () => {
    UserModel.findById = jest
      .fn()
      .mockRejectedValue(new Error("Unexpected error"));

    await expect(changePassword(null, { input, _id })).rejects.toThrow(
      new GraphQLError("Unexpected error"),
    );

    expect(UserModel.findById).toHaveBeenCalledWith(_id);
  });
});
