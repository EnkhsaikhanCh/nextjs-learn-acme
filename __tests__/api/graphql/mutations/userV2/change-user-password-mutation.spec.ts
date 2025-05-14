import { UserV2Model } from "@/app/api/graphql/models/userV2.model";
import { changeUserPassword } from "@/app/api/graphql/resolvers/mutations/userV2/change-user-passowrd-mutation";
import { UserV2, UserV2Role } from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import argon2 from "argon2";

jest.mock("../../../../../src/lib/auth-userV2-utils", () => ({
  requireAuthAndRolesV2: jest.fn(),
}));
jest.mock("argon2");
jest.mock("../../../../../src/app/api/graphql/models/userV2.model", () => ({
  UserV2Model: { findById: jest.fn() },
}));

describe("changeUserPassword", () => {
  const user: UserV2 = {
    _id: "user-1",
    email: "user@example.com",
    role: UserV2Role.Instructor,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuthAndRolesV2 as jest.Mock).mockResolvedValue(undefined);
  });

  it("throws if authentication fails", async () => {
    (requireAuthAndRolesV2 as jest.Mock).mockRejectedValue(
      new Error("Auth fail"),
    );
    await expect(
      changeUserPassword(
        null,
        { input: { oldPassword: "oldpass123", newPassword: "newpass123" } },
        { user },
      ),
    ).rejects.toThrow("Auth fail");
  });

  it("returns validation error when input is invalid", async () => {
    const result = await changeUserPassword(
      null,
      { input: { oldPassword: "short", newPassword: "short" } },
      { user },
    );
    expect(result).toEqual({
      success: false,
      message: expect.stringContaining("at least 8 characters"),
    });
  });

  it("returns user not found when no existingUser", async () => {
    (UserV2Model.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const result = await changeUserPassword(
      null,
      { input: { oldPassword: "oldpass123", newPassword: "newpass123" } },
      { user },
    );
    expect(UserV2Model.findById).toHaveBeenCalledWith(user._id);
    expect(result).toEqual({ success: false, message: "User not found." });
  });

  it("prevents changing another user's password", async () => {
    const existingUser = {
      _id: "other-id",
      password: "hash",
      save: jest.fn(),
    };
    (UserV2Model.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(existingUser),
    });

    const result = await changeUserPassword(
      null,
      { input: { oldPassword: "oldpass123", newPassword: "newpass123" } },
      { user },
    );
    expect(result).toEqual({
      success: false,
      message: "You can only update your own password.",
    });
  });

  it("rejects when old password is incorrect", async () => {
    const existingUser = {
      _id: user._id,
      password: "hash",
      save: jest.fn(),
    };
    (UserV2Model.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(existingUser),
    });
    (argon2.verify as jest.Mock).mockResolvedValue(false);

    const result = await changeUserPassword(
      null,
      { input: { oldPassword: "wrongoldpass", newPassword: "newpass123" } },
      { user },
    );
    expect(argon2.verify).toHaveBeenCalledWith(
      existingUser.password,
      "wrongoldpass",
    );
    expect(result).toEqual({
      success: false,
      message: "Old password is incorrect.",
    });
  });

  it("changes password successfully", async () => {
    const existingUser = {
      _id: user._id,
      password: "oldhash",
      save: jest.fn().mockResolvedValue(undefined),
    };
    (UserV2Model.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(existingUser),
    });
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    (argon2.hash as jest.Mock).mockResolvedValue("newhash");

    const result = await changeUserPassword(
      null,
      { input: { oldPassword: "oldpass123", newPassword: "newpass123" } },
      { user },
    );
    expect(argon2.verify).toHaveBeenCalledWith("oldhash", "oldpass123");

    expect(argon2.hash).toHaveBeenCalledWith("newpass123", expect.any(Object));
    expect(existingUser.password).toBe("newhash");
    expect(existingUser.save).toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message: "Password updated successfully. Please log in again.",
    });
  });

  it("handles unexpected errors gracefully", async () => {
    (UserV2Model.findById as jest.Mock).mockImplementation(() => {
      throw new Error("DB error");
    });
    const result = await changeUserPassword(
      null,
      { input: { oldPassword: "oldpass123", newPassword: "newpass123" } },
      { user },
    );
    expect(result.success).toBe(false);
    expect(result.message).toEqual(
      expect.stringContaining("Internal error: DB error"),
    );
  });
});
