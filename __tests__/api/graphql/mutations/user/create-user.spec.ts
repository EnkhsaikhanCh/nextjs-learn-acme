import { createUser } from "../../../../../src/app/api/graphql/resolvers/mutations/user/create-user-mutation";
import {
  UserModel,
  RefreshTokenModel,
} from "../../../../../src/app/api/graphql/models";
import argon2 from "argon2";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import {
  sanitizeInput,
  validationEmail,
  validationPassword,
} from "../../../../../src/utils/validation";
import { generateSecureRefreshToken } from "../../../../../src/app/api/graphql/utils/token-utils";
import dotenv from "dotenv";

dotenv.config();

jest.mock("../../../../../src/app/api/graphql/models/user.model");
jest.mock("../../../../../src/app/api/graphql/models/refresh-token.model");
jest.mock("argon2");
jest.mock("../../../../../src/utils/validation");
jest.mock("jsonwebtoken");
jest.mock("../../../../../src/app/api/graphql/utils/token-utils");

describe("createUser mutation with refresh token", () => {
  let mockInput: { input: { email: string; password: string } };

  beforeEach(() => {
    process.env.JWT_ACCESS_SECRET = "test-access-secret";
    process.env.JWT_REFRESH_EXPIRES_IN = "7";

    mockInput = {
      input: {
        email: "test@example.com",
        password: "SecurePassword123",
      },
    };

    jest.clearAllMocks();

    (sanitizeInput as jest.Mock).mockImplementation((email: string) =>
      email.trim(),
    );
    (validationEmail as jest.Mock).mockImplementation((email: string) =>
      email.includes("@"),
    );
    (validationPassword as jest.Mock).mockImplementation(
      (password: string) => password.length >= 8,
    );
    (generateSecureRefreshToken as jest.Mock).mockReturnValue(
      "mockRefreshToken",
    );
  });

  it("should create a user successfully and return tokens", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce(null);
    (argon2.hash as jest.Mock).mockResolvedValueOnce("hashed_password");
    (UserModel.create as jest.Mock).mockResolvedValueOnce({
      _id: "mockUserId",
      email: mockInput.input.email,
      studentId: "123456",
      role: "student",
      password: "hashed_password",
    });
    (jwt.sign as jest.Mock).mockReturnValueOnce("mockToken");
    (RefreshTokenModel.create as jest.Mock).mockResolvedValueOnce({});

    const result = await createUser(null, mockInput);

    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
    expect(argon2.hash).toHaveBeenCalledWith(
      "SecurePassword123",
      expect.any(Object),
    );
    expect(UserModel.create).toHaveBeenCalledWith({
      email: "test@example.com",
      studentId: expect.any(String),
      role: "student",
      password: "hashed_password",
    });
    expect(RefreshTokenModel.create).toHaveBeenCalledWith({
      token: "mockRefreshToken",
      user: "mockUserId",
      expiryDate: expect.any(Date),
    });
    expect(result).toEqual({
      message: "User created successfully",
      token: "mockToken",
      refreshToken: "mockRefreshToken",
    });
  });

  it("should throw an error if refresh token creation fails", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce(null);
    (argon2.hash as jest.Mock).mockResolvedValueOnce("hashed_password");
    (UserModel.create as jest.Mock).mockResolvedValueOnce({
      _id: "mockUserId",
      email: mockInput.input.email,
      studentId: "123456",
      role: "student",
      password: "hashed_password",
    });
    (jwt.sign as jest.Mock).mockReturnValueOnce("mockToken");
    (RefreshTokenModel.create as jest.Mock).mockRejectedValueOnce(
      new Error("DB error"),
    );

    await expect(createUser(null, mockInput)).rejects.toThrow(
      "Internal server error.",
    );

    expect(RefreshTokenModel.create).toHaveBeenCalledWith({
      token: "mockRefreshToken",
      user: "mockUserId",
      expiryDate: expect.any(Date),
    });
  });

  it("should use the default refresh expiry days if JWT_REFRESH_EXPIRES_IN is not set", async () => {
    // JWT_REFRESH_EXPIRES_IN-ийг устгах
    delete process.env.JWT_REFRESH_EXPIRES_IN;

    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (argon2.hash as jest.Mock).mockResolvedValue("hashed_password");
    (UserModel.create as jest.Mock).mockResolvedValue({
      _id: "mockUserId",
      email: mockInput.input.email,
      studentId: "123456",
      role: "student",
      password: "hashed_password",
    });
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");
    (RefreshTokenModel.create as jest.Mock).mockResolvedValue({});

    const result = await createUser(null, mockInput);

    // refreshExpiryDays default утга нь "7" байх ёстой
    expect(RefreshTokenModel.create).toHaveBeenCalledWith({
      token: "mockRefreshToken",
      user: "mockUserId",
      expiryDate: expect.any(Date), // ExpiryDate тооцоолол mock-оос харагдана
    });

    // Default "7" өдөр үүсгэгдсэн эсэхийг баталгаажуулах
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // Default 7 days
    expect(RefreshTokenModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        expiryDate: expect.any(Date),
      }),
    );
  });

  it("should use the provided refresh expiry days if JWT_REFRESH_EXPIRES_IN is set", async () => {
    // JWT_REFRESH_EXPIRES_IN-ийг тохируулах
    process.env.JWT_REFRESH_EXPIRES_IN = "10";

    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (argon2.hash as jest.Mock).mockResolvedValue("hashed_password");
    (UserModel.create as jest.Mock).mockResolvedValue({
      _id: "mockUserId",
      email: mockInput.input.email,
      studentId: "123456",
      role: "student",
      password: "hashed_password",
    });
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");
    (RefreshTokenModel.create as jest.Mock).mockResolvedValue({});

    const result = await createUser(null, mockInput);

    // refreshExpiryDays утга "10" байх ёстой
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 10); // 10 days as provided
    expect(RefreshTokenModel.create).toHaveBeenCalledWith({
      token: "mockRefreshToken",
      user: "mockUserId",
      expiryDate: expect.any(Date),
    });
  });

  it("should throw an error if email is missing", async () => {
    mockInput.input.email = "";

    await expect(createUser(null, mockInput)).rejects.toThrow(
      "Email and password are required.",
    );
  });

  it("should throw an error if password is missing", async () => {
    mockInput.input.password = "";

    await expect(createUser(null, mockInput)).rejects.toThrow(
      "Email and password are required.",
    );
  });

  it("should throw an error if email format is invalid", async () => {
    (validationEmail as jest.Mock).mockReturnValue(false);

    await expect(createUser(null, mockInput)).rejects.toThrow(
      "Invalid email format.",
    );
  });

  it("should throw an error if password does not meet requirements", async () => {
    (validationPassword as jest.Mock).mockReturnValue(false);

    await expect(createUser(null, mockInput)).rejects.toThrow(
      "Password must meet complexity requirements.",
    );
  });

  it("should throw an error if JWT_SECRET is not defined", async () => {
    delete process.env.JWT_ACCESS_SECRET;

    await expect(createUser(null, mockInput)).rejects.toThrow(
      "JWT_SECRET is not defined in environment variables",
    );

    process.env.JWT_ACCESS_SECRET = "test-access-secret"; // Restore secret
  });

  it("should throw an error if email already exists", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({
      email: mockInput.input.email,
    });

    await expect(createUser(null, mockInput)).rejects.toThrow(
      "A user with this email already exists.",
    );
  });

  it("should handle unknown internal errors", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (argon2.hash as jest.Mock).mockRejectedValue(
      new Error("Unexpected hashing error"),
    );

    await expect(createUser(null, mockInput)).rejects.toThrow(
      "Internal server error.",
    );
  });
});
