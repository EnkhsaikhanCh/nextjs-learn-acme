import { GraphQLError } from "graphql";
import { loginUser } from "../../../../../src/app/api/graphql/resolvers/mutations/user/login-mutation";
import { UserModel } from "../../../../../src/app/api/graphql/models/user.model";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
  sanitizeInput,
  validationEmail,
} from "../../../../../src/utils/validation";
import dotenv from "dotenv";

dotenv.config();

jest.mock("../../../../../src/app/api/graphql/models/user.model");
jest.mock("argon2");
jest.mock("../../../../../src/utils/validation");
jest.mock("jsonwebtoken");

describe("loginUser mutation", () => {
  let mockInput: { input: { email: string; password: string } };

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";

    // Mock input
    mockInput = {
      input: {
        email: "test@example.com",
        password: "SecurePassword123",
      },
    };

    // Reset mocks before each test
    (UserModel.findOne as jest.Mock).mockReset();
    (argon2.verify as jest.Mock).mockReset();
    (sanitizeInput as jest.Mock).mockReset();
    (validationEmail as jest.Mock).mockReset();
    (jwt.sign as jest.Mock).mockReset();

    // Default mock implementations
    (sanitizeInput as jest.Mock).mockImplementation((email: string) =>
      email.trim(),
    );
    (validationEmail as jest.Mock).mockImplementation((email: string) =>
      email.includes("@"),
    );
  });

  it("should login successfully with valid credentials", async () => {
    // Arrange
    const mockUser = {
      _id: "mockUserId",
      email: "test@example.com",
      role: "student",
      password: "hashed_password",
    };
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(true);
    (jwt.sign as jest.Mock).mockReturnValueOnce("mockToken");

    // Act
    const result = await loginUser(null, mockInput);

    // Assert
    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
    expect(argon2.verify).toHaveBeenCalledWith(
      "hashed_password",
      "SecurePassword123",
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: "mockUserId",
        email: "test@example.com",
        role: "student",
      },
      "test-secret",
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
    expect(result).toEqual({
      message: "Login successful",
      token: "mockToken",
    });
  });

  it("should throw an error if email or password is missing", async () => {
    // Arrange
    mockInput.input.email = "";
    mockInput.input.password = "";

    // Act & Assert
    await expect(loginUser(null, mockInput)).rejects.toThrow(GraphQLError);
    expect(UserModel.findOne).not.toHaveBeenCalled();
    expect(argon2.verify).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should throw an error for invalid email format", async () => {
    // Arrange
    (validationEmail as jest.Mock).mockReturnValueOnce(false);

    // Act & Assert
    await expect(loginUser(null, mockInput)).rejects.toThrow(GraphQLError);
    expect(UserModel.findOne).not.toHaveBeenCalled();
    expect(argon2.verify).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should throw an error if user does not exist", async () => {
    // Arrange
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce(null);

    // Act & Assert
    await expect(loginUser(null, mockInput)).rejects.toThrow(GraphQLError);
    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
    expect(argon2.verify).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should throw an error if password is incorrect", async () => {
    // Arrange
    const mockUser = {
      _id: "mockUserId",
      email: "test@example.com",
      role: "student",
      password: "hashed_password",
    };
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(false);

    // Act & Assert
    await expect(loginUser(null, mockInput)).rejects.toThrow(GraphQLError);
    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
    expect(argon2.verify).toHaveBeenCalledWith(
      "hashed_password",
      "SecurePassword123",
    );
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should throw 'Internal server error.' if an unknown error is thrown", async () => {
    // Arrange
    (UserModel.findOne as jest.Mock).mockRejectedValueOnce(
      new Error("DB error"),
    );

    // Act & Assert
    await expect(loginUser(null, mockInput)).rejects.toThrow(
      "Internal server error.",
    );
    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
    expect(argon2.verify).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("should throw error if JWT_SECRET is missing", async () => {
    // Arrange
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET; // Remove JWT_SECRET

    // Act & Assert
    await expect(loginUser(null, mockInput)).rejects.toThrow(
      "JWT_SECRET is not defined in environment variables",
    );

    // Restore JWT_SECRET
    process.env.JWT_SECRET = originalSecret;
  });
});
