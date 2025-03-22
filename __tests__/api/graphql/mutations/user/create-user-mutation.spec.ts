import { createUser } from "../../../../../src/app/api/graphql/resolvers/mutations/user/create-user-mutation";
import { UserModel } from "../../../../../src/app/api/graphql/models";
import argon2 from "argon2";
import {
  normalizeEmail,
  validateEmail,
  validatePassword,
} from "../../../../../src/utils/validation";
import { generateUniqueStudentId } from "../../../../../src/utils/generate-unique-student-id";
import { GraphQLError } from "graphql";
import {
  RegisterInput,
  Role,
  User,
} from "../../../../../src/generated/graphql";

// Модульүүдийг mock хийе
jest.mock("../../../../../src/app/api/graphql/models", () => ({
  UserModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("argon2", () => ({
  hash: jest.fn(),
  argon2id: "argon2id", // constant value for testing
}));

jest.mock("../../../../../src/utils/validation", () => ({
  normalizeEmail: jest.fn(),
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
}));

jest.mock("../../../../../src/utils/generate-unique-student-id", () => ({
  generateUniqueStudentId: jest.fn(),
}));

describe("createUser", () => {
  const validEmail = "test@example.com";
  const validPassword = "StrongP@ssw0rd";
  const mockUserInput: RegisterInput = {
    email: validEmail,
    password: validPassword,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Email or password missing
  it("throws BAD_USER_INPUT if email is missing", async () => {
    const input: RegisterInput = { email: "", password: validPassword };

    await expect(createUser(null, { input })).rejects.toThrow(GraphQLError);
    await expect(createUser(null, { input })).rejects.toHaveProperty(
      "message",
      "Email and password are required.",
    );
  });

  it("throws BAD_USER_INPUT if password is missing", async () => {
    const input: RegisterInput = { email: validEmail, password: "" };

    await expect(createUser(null, { input })).rejects.toThrow(GraphQLError);
    await expect(createUser(null, { input })).rejects.toHaveProperty(
      "message",
      "Email and password are required.",
    );
  });

  // 2. Normalized email is falsy
  it("throws BAD_USER_INPUT if normalized email is falsy", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(null);

    await expect(createUser(null, { input: mockUserInput })).rejects.toThrow(
      GraphQLError,
    );
    await expect(
      createUser(null, { input: mockUserInput }),
    ).rejects.toHaveProperty("message", "Invalid email format.");
  });

  // 3. validateEmail fails
  it("throws BAD_USER_INPUT if validateEmail returns false", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(validEmail);
    (validateEmail as jest.Mock).mockReturnValue(false);

    await expect(createUser(null, { input: mockUserInput })).rejects.toThrow(
      GraphQLError,
    );
    await expect(
      createUser(null, { input: mockUserInput }),
    ).rejects.toHaveProperty("message", "Invalid email format.");
  });

  // 4. validatePassword fails
  it("throws BAD_USER_INPUT if validatePassword returns false", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(validEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (validatePassword as jest.Mock).mockReturnValue(false);

    await expect(createUser(null, { input: mockUserInput })).rejects.toThrow(
      GraphQLError,
    );
    await expect(
      createUser(null, { input: mockUserInput }),
    ).rejects.toHaveProperty(
      "message",
      "Password must meet complexity requirements.",
    );
  });

  // 5. Existing user already exists
  it("throws CONFLICT if a user with this email already exists", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(validEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (validatePassword as jest.Mock).mockReturnValue(true);
    (UserModel.findOne as jest.Mock).mockResolvedValue({ _id: "existing-id" });

    await expect(createUser(null, { input: mockUserInput })).rejects.toThrow(
      GraphQLError,
    );
    await expect(
      createUser(null, { input: mockUserInput }),
    ).rejects.toHaveProperty(
      "message",
      "A user with this email already exists.",
    );
  });

  // 6. Successful user creation
  it("creates user successfully with valid input", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(validEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (validatePassword as jest.Mock).mockReturnValue(true);
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (generateUniqueStudentId as jest.Mock).mockResolvedValue("student-123");
    (argon2.hash as jest.Mock).mockResolvedValue("hashed-password");
    const createdUser = {
      _id: "new-user-id",
      email: validEmail,
      studentId: "student-123",
      role: Role.Student,
      isVerified: false,
    };
    (UserModel.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await createUser(null, { input: mockUserInput });

    expect(UserModel.create).toHaveBeenCalledWith({
      email: validEmail,
      studentId: "student-123",
      password: "hashed-password",
      isVerified: false,
    });
    expect(result).toEqual({
      message: "User created successfully",
      user: createdUser,
    });
  });

  // 7. Unexpected error in try block
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (normalizeEmail as jest.Mock).mockReturnValue(validEmail);
    (validateEmail as jest.Mock).mockReturnValue(true);
    (validatePassword as jest.Mock).mockReturnValue(true);
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (generateUniqueStudentId as jest.Mock).mockResolvedValue("student-123");
    (argon2.hash as jest.Mock).mockResolvedValue("hashed-password");
    (UserModel.create as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    await expect(createUser(null, { input: mockUserInput })).rejects.toThrow(
      GraphQLError,
    );
    await expect(
      createUser(null, { input: mockUserInput }),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
