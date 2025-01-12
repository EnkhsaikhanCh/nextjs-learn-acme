import { loginUser } from "../../../../../src/app/api/graphql/resolvers/mutations/user/login-mutation";
import { UserModel } from "../../../../../src/app/api/graphql/models/user.model";
import { RefreshTokenModel } from "../../../../../src/app/api/graphql/models/refresh-token.model";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock(
  "../../../../../src/app/api/graphql/models/refresh-token.model",
  () => ({
    RefreshTokenModel: {
      findOne: jest.fn(),
    },
  }),
);

jest.mock("../../../../../src/app/api/graphql/models/user.model", () => ({
  UserModel: {
    findOne: jest.fn(),
  },
}));

jest.mock("argon2");
jest.mock("jsonwebtoken");

jest.mock("../../../../../src/app/api/graphql/utils/token-utils", () => ({
  generateSecureRefreshToken: jest.fn(() => "mockRefreshToken"),
}));

jest.mock(
  "../../../../../src/app/api/graphql/models/refresh-token.model",
  () => ({
    RefreshTokenModel: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  }),
);

describe("loginUser Mutation", () => {
  const mockInput = {
    input: {
      email: "test@example.com",
      password: "password123",
    },
  };

  const mockUser = {
    _id: "mockUserId",
    email: "test@example.com",
    password: "hashedPassword",
    role: "user",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_ACCESS_SECRET = "testSecret";
    process.env.JWT_ACCESS_EXPIRES_IN = "1h";
  });

  test("throws error if JWT_ACCESS_SECRET is not defined", async () => {
    delete process.env.JWT_ACCESS_SECRET;

    await expect(loginUser(null, mockInput)).rejects.toThrow(
      "JWT_SECRET is not defined in environment variables",
    );
  });

  test("throws error if email or password is missing", async () => {
    await expect(
      loginUser(null, { input: { email: "", password: "" } }),
    ).rejects.toThrow("Email and password are required.");
  });

  test("throws error for invalid email format", async () => {
    await expect(
      loginUser(null, {
        input: { email: "invalid-email", password: "password123" },
      }),
    ).rejects.toThrow("Invalid email format.");
  });

  test("throws error if user is not found", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(loginUser(null, mockInput)).rejects.toThrow(
      "Invalid email or password.",
    );
  });

  test("throws error if password is invalid", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValue(false);

    await expect(loginUser(null, mockInput)).rejects.toThrow(
      "Invalid email or password.",
    );
  });

  test("returns token and refresh token on successful login", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockAccessToken");
    (RefreshTokenModel.create as jest.Mock).mockResolvedValue(true);

    const result = await loginUser(null, mockInput);

    expect(result).toEqual({
      message: "Login successful",
      token: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    });
    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
    expect(argon2.verify).toHaveBeenCalledWith("hashedPassword", "password123");
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        _id: "mockUserId",
        email: "test@example.com",
        role: "user",
      },
      "testSecret",
      { expiresIn: "1h" },
    );
    expect(RefreshTokenModel.create).toHaveBeenCalledWith({
      token: "mockRefreshToken",
      user: "mockUserId",
      expiryDate: expect.any(Date),
    });
  });

  test("throws internal server error on unexpected errors", async () => {
    (UserModel.findOne as jest.Mock).mockRejectedValue(
      new Error("Unexpected error"),
    );

    await expect(loginUser(null, mockInput)).rejects.toThrow(
      "Internal server error.",
    );
  });
});
