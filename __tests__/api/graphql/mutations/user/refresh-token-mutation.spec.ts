// __tests__/refresh-token-mutation.test.ts
import { refreshToken } from "../../../../../src/app/api/graphql/resolvers/mutations/user/refresh-token-mutation";
// import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { RefreshTokenModel } from "../../../../../src/app/api/graphql/models/refresh-token.model";
import { UserModel } from "../../../../../src/app/api/graphql/models/user.model";

// Mock dependencies
jest.mock("jsonwebtoken");

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
    findById: jest.fn(),
  },
}));

describe("refreshToken Mutation", () => {
  const mockRefreshTokenInput = {
    refreshToken: "mockRefreshToken",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_ACCESS_SECRET = "testSecret";
    process.env.JWT_ACCESS_EXPIRES_IN = "1h";
  });

  test("throws error if JWT_ACCESS_SECRET is not defined", async () => {
    delete process.env.JWT_ACCESS_SECRET;

    await expect(
      refreshToken(null, { input: mockRefreshTokenInput }),
    ).rejects.toThrow("JWT_ACCESS_SECRET environment variable is not defined.");
  });

  test("throws error if JWT_ACCESS_EXPIRES_IN is not defined", async () => {
    delete process.env.JWT_ACCESS_EXPIRES_IN;

    await expect(
      refreshToken(null, { input: mockRefreshTokenInput }),
    ).rejects.toThrow("JWT_ACCESS_EXPIRES_IN variable is not defined");
  });

  test("throws error if refresh token is not found", async () => {
    (RefreshTokenModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      refreshToken(null, { input: mockRefreshTokenInput }),
    ).rejects.toThrow("refresh token буруу эсвэл олдсонгүй.");
  });

  test("throws error if refresh token is expired", async () => {
    (RefreshTokenModel.findOne as jest.Mock).mockResolvedValue({
      token: "mockRefreshToken",
      expiryDate: new Date(Date.now() - 1000),
    });

    await expect(
      refreshToken(null, { input: mockRefreshTokenInput }),
    ).rejects.toThrow("refresh token-ийн хугацаа дууссан байна.");
  });

  test("throws error if refresh token is not found", async () => {
    (RefreshTokenModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      refreshToken(null, { input: mockRefreshTokenInput }),
    ).rejects.toThrow("refresh token буруу эсвэл олдсонгүй.");
  });

  test("throws error if user is not found", async () => {
    (RefreshTokenModel.findOne as jest.Mock).mockResolvedValue({
      token: "mockRefreshToken",
      expiryDate: new Date(Date.now() + 1000), // Valid token
    });
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      refreshToken(null, { input: mockRefreshTokenInput }),
    ).rejects.toThrow("Холбогдох хэрэглэгч олдсонгүй.");
  });

  test("generates a new access token if everything is valid", async () => {
    (RefreshTokenModel.findOne as jest.Mock).mockResolvedValue({
      token: "mockRefreshToken",
      expiryDate: new Date(Date.now() + 1000), // Valid token
      user: "mockUserId",
    });
    (UserModel.findById as jest.Mock).mockResolvedValue({
      _id: "mockUserId",
      email: "user@example.com",
      studentId: "12345",
      role: "student",
    });
    (jwt.sign as jest.Mock).mockReturnValue("newAccessToken");

    const result = await refreshToken(null, { input: mockRefreshTokenInput });

    expect(result).toEqual({
      message: "Шинэ token амжилттай үүслээ",
      token: "newAccessToken",
      refreshToken: "mockRefreshToken",
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        _id: "mockUserId",
        email: "user@example.com",
        studentId: "12345",
        role: "student",
      },
      "testSecret",
      { expiresIn: "1h" },
    );
  });
});
