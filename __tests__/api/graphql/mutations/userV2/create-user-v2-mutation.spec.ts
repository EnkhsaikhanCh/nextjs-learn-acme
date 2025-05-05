// __tests__/api/graphql/mutations/userV2/register-user-v2-mutation.spec.ts
import { UserV2Model } from "@/app/api/graphql/models/userV2.model";
import argon2 from "argon2";
import { generateUniqueStudentId } from "@/utils/generate-unique-student-id";
import { RegisterUserV2Input, UserV2Role } from "@/generated/graphql";
import { registerUserV2 } from "@/app/api/graphql/resolvers/mutations/userV2/create-user-v2-mutation";

jest.mock("argon2");
jest.mock("../../../../../src/app/api/graphql/models/userV2.model", () => ({
  UserV2Model: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock("../../../../../src/utils/generate-unique-student-id", () => ({
  generateUniqueStudentId: jest.fn(),
}));

describe("registerUserV2", () => {
  const inputBase = {
    email: "Test@Example.com",
    password: "strongPass123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns validation error when email is missing", async () => {
    const result = await registerUserV2(null, {
      input: { ...inputBase, email: "" },
    });
    expect(result).toEqual({
      success: false,
      message: "Email is required.",
      userV2: null,
    });
  });

  it("returns validation error when email is invalid", async () => {
    const result = await registerUserV2(null, {
      input: { ...inputBase, email: "bad-email" },
    });
    expect(result).toEqual({
      success: false,
      message: "Invalid email address.",
      userV2: null,
    });
  });

  it("returns validation error when password is too short", async () => {
    const result = await registerUserV2(null, {
      input: { ...inputBase, password: "short" },
    });
    expect(result).toEqual({
      success: false,
      message: "Password must be at least 8 characters long.",
      userV2: null,
    });
  });

  it("returns first Zod error when both fields are missing", async () => {
    // Triggers ZodError.parse on empty input object
    const result = await registerUserV2(null, {
      input: {} as RegisterUserV2Input,
    });
    expect(result).toEqual({
      success: false,
      message: "Required",
      userV2: null,
    });
  });

  it("returns conflict when a user with email already exists", async () => {
    (UserV2Model.findOne as jest.Mock).mockResolvedValue({ _id: "x" });
    const result = await registerUserV2(null, { input: inputBase });
    expect(UserV2Model.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
    expect(result).toEqual({
      success: false,
      message: "A user with this email already exists.",
      userV2: null,
    });
  });

  it("creates and returns new user on valid input", async () => {
    (UserV2Model.findOne as jest.Mock).mockResolvedValue(null);
    (argon2.hash as jest.Mock).mockResolvedValue("hashedPwd");
    (generateUniqueStudentId as jest.Mock).mockResolvedValue("stu123");
    const fakeUser = {
      _id: "new-id",
      email: "test@example.com",
      password: "hashedPwd",
      role: UserV2Role.Student,
      studentId: "stu123",
    };
    (UserV2Model.create as jest.Mock).mockResolvedValue(fakeUser);

    const result = await registerUserV2(null, { input: inputBase });

    expect(argon2.hash).toHaveBeenCalledWith(
      "strongPass123",
      expect.any(Object),
    );
    expect(generateUniqueStudentId).toHaveBeenCalled();
    expect(UserV2Model.create).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "hashedPwd",
      role: UserV2Role.Student,
      studentId: "stu123",
    });
    expect(result).toEqual({
      success: true,
      message: "User registered successfully.",
      userV2: fakeUser,
    });
  });

  it("handles unexpected errors gracefully", async () => {
    (UserV2Model.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("DB down");
    });
    const result = await registerUserV2(null, { input: inputBase });
    expect(result).toEqual({
      success: false,
      message: "Internal error: DB down",
      userV2: null,
    });
  });
});
