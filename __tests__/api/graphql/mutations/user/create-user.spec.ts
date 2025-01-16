// Jest test for createUser
import { createUser } from "../../../../../src/app/api/graphql/resolvers/mutations/user";
import { UserModel } from "../../../../../src/app/api/graphql/models";
import { GraphQLError } from "graphql";
import * as validationUtils from "../../../../../src/utils/validation";
import * as studentIdUtils from "../../../../../src/utils/generate-unique-student-id";
import argon2 from "argon2";

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  UserModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("argon2", () => ({
  hash: jest.fn(),
}));

jest.mock("../../../../../src/utils/validation", () => ({
  sanitizeInput: jest.fn(),
  validationEmail: jest.fn(),
  validationPassword: jest.fn(),
}));

jest.mock("../../../../../src/utils/generate-unique-student-id", () => ({
  generateUniqueStudentId: jest.fn(),
}));

describe("createUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("should create a user successfully", async () => {
    const input = { email: "test@example.com", password: "StrongPass123!" };
    const mockUser = {
      _id: "123",
      email: "test@example.com",
      studentId: "S123456",
      role: "student",
    };

    (validationUtils.sanitizeInput as jest.Mock).mockReturnValue(
      "test@example.com",
    );
    (validationUtils.validationEmail as jest.Mock).mockReturnValue(true);
    (validationUtils.validationPassword as jest.Mock).mockReturnValue(true);
    (studentIdUtils.generateUniqueStudentId as jest.Mock).mockResolvedValue(
      "S123456",
    );
    (argon2.hash as jest.Mock).mockResolvedValue("hashed_password");
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await createUser({}, { input });

    expect(validationUtils.sanitizeInput).toHaveBeenCalledWith(
      "test@example.com",
    );
    expect(validationUtils.validationEmail).toHaveBeenCalledWith(
      "test@example.com",
    );
    expect(validationUtils.validationPassword).toHaveBeenCalledWith(
      "StrongPass123!",
    );
    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
    expect(argon2.hash).toHaveBeenCalledWith(
      "StrongPass123!",
      expect.any(Object),
    );
    expect(UserModel.create).toHaveBeenCalledWith({
      email: "test@example.com",
      studentId: "S123456",
      role: "student",
      password: "hashed_password",
    });
    expect(result).toEqual({
      message: "User created successfully",
      user: mockUser,
    });
  });

  it("should throw a BAD_USER_INPUT error for an invalid email format", async () => {
    jest
      .spyOn(validationUtils, "sanitizeInput")
      .mockReturnValue("invalidemail");
    jest.spyOn(validationUtils, "validationEmail").mockReturnValue(false);
    jest.spyOn(validationUtils, "validationPassword").mockReturnValue(true);

    const input = { email: "invalidemail", password: "StrongPass123!" };

    await expect(createUser({}, { input })).rejects.toThrow(GraphQLError);
    await expect(createUser({}, { input })).rejects.toThrow(
      "Invalid email format.",
    );

    expect(validationUtils.sanitizeInput).toHaveBeenCalledWith("invalidemail");
    expect(validationUtils.validationEmail).toHaveBeenCalledWith(
      "invalidemail",
    );
  });

  it("should throw a BAD_USER_INPUT error if the password does not meet complexity requirements", async () => {
    jest
      .spyOn(validationUtils, "sanitizeInput")
      .mockReturnValue("test@example.com");
    jest.spyOn(validationUtils, "validationEmail").mockReturnValue(true);
    jest.spyOn(validationUtils, "validationPassword").mockReturnValue(false);

    const input = { email: "test@example.com", password: "weak" };

    await expect(createUser({}, { input })).rejects.toThrow(GraphQLError);
    await expect(createUser({}, { input })).rejects.toThrow(
      "Password must meet complexity requirements.",
    );

    expect(validationUtils.sanitizeInput).toHaveBeenCalledWith(
      "test@example.com",
    );
    expect(validationUtils.validationEmail).toHaveBeenCalledWith(
      "test@example.com",
    );
    expect(validationUtils.validationPassword).toHaveBeenCalledWith("weak");
  });

  it("should throw a CONFLICT error if the user already exists", async () => {
    const input = { email: "test@example.com", password: "StrongPass123!" };
    jest
      .spyOn(validationUtils, "sanitizeInput")
      .mockReturnValue("test@example.com");
    jest.spyOn(validationUtils, "validationEmail").mockReturnValue(true);
    jest.spyOn(validationUtils, "validationPassword").mockReturnValue(true);
    (UserModel.findOne as jest.Mock).mockResolvedValue({
      email: "test@example.com",
    });

    await expect(createUser({}, { input })).rejects.toThrow(GraphQLError);
    await expect(createUser({}, { input })).rejects.toThrow(
      "A user with this email already exists.",
    );

    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
  });

  it("should throw a BAD_USER_INPUT error for invalid email or password", async () => {
    jest.spyOn(validationUtils, "sanitizeInput").mockReturnValue(""); // Use `undefined` instead of `null`

    const input = { email: "", password: "" };

    await expect(createUser({}, { input })).rejects.toThrow(GraphQLError);
    await expect(createUser({}, { input })).rejects.toThrow(
      "Email and password are required.",
    );

    expect(validationUtils.sanitizeInput).toHaveBeenCalledWith("");
  });

  it("should throw an INTERNAL_SERVER_ERROR for unexpected errors", async () => {
    const input = { email: "test@example.com", password: "StrongPass123!" };

    jest
      .spyOn(validationUtils, "sanitizeInput")
      .mockReturnValue("test@example.com");
    jest.spyOn(validationUtils, "validationEmail").mockReturnValue(true);
    jest.spyOn(validationUtils, "validationPassword").mockReturnValue(true);
    (UserModel.findOne as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    await expect(createUser({}, { input })).rejects.toThrow(GraphQLError);
    await expect(createUser({}, { input })).rejects.toThrow(
      "Internal server error: Database error",
    );

    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
  });
});
