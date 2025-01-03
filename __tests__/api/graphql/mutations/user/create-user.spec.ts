import { createUser } from "@/app/api/graphql/resolvers/mutations";
import { UserModel } from "../../../../../src/app/api/graphql/models/user.model";
import bcrypt from "bcrypt";

jest.mock("../../../../../src/app/api/graphql/models/user.model", () => ({
  UserModel: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

describe("createUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if email or password is missing", async () => {
    await expect(
      createUser(null, { input: { name: "", email: "", password: "" } }),
    ).rejects.toThrow("Email and password are required");
  });

  it("should throw an error if email format is invalid", async () => {
    await expect(
      createUser(null, {
        input: { name: "Max", email: "invalid-email", password: "12345678" },
      }),
    ).rejects.toThrow("Invalid email format");
  });

  it("should throw an error if password is too short", async () => {
    await expect(
      createUser(null, {
        input: { name: "Max", email: "test@example.com", password: "123" },
      }),
    ).rejects.toThrow("Password must be at least 8 characters long");
  });

  it("should throw an error if email already exists", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce({
      email: "test@example.com",
    });

    await expect(
      createUser(null, {
        input: { name: "Max", email: "test@example.com", password: "12345678" },
      }),
    ).rejects.toThrow("User with this email already exists");
  });

  it("should create a user successfully", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce(null);
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce("hashedPassword");
    (UserModel.create as jest.Mock).mockResolvedValueOnce({
      email: "test@example.com",
      password: "hashedPassword",
    });

    const result = await createUser(null, {
      input: { name: "Max", email: "test@example.com", password: "12345678" },
    });

    expect(result).toEqual({ message: "User created successfully" });
    expect(UserModel.create).toHaveBeenCalledWith({
      name: "Max",
      email: "test@example.com",
      password: "hashedPassword",
    });
  });

  it("should throw an INTERNAL_SERVER_ERROR if an unexpected error occurs", async () => {
    (bcrypt.hash as jest.Mock).mockRejectedValueOnce(
      new Error("Hashing failed"),
    );

    await expect(
      createUser(null, {
        input: { name: "Max", email: "test@example.com", password: "12345678" },
      }),
    ).rejects.toMatchObject({
      message: "An unexpected error occurred. Please try again later.",
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  });
});
