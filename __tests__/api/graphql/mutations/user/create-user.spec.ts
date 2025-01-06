import { createUser } from "../../../../../src/app/api/graphql/resolvers/mutations/user/create-user-mutation";
import { UserModel } from "../../../../../src/app/api/graphql/models/user.model";
import argon2 from "argon2";
import { GraphQLError } from "graphql";

jest.mock("../../../../../src/app/api/graphql/models/user.model");
jest.mock("argon2");

// Mock utility functions
jest.mock("../../../../../src/utils/validation", () => ({
  sanitizeInput: jest.fn((email) => email.trim()),
  validationEmail: jest.fn((email) => email.includes("@")),
  validationPassword: jest.fn((password) => password.length >= 8),
}));

const mockedUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockedArgon2 = argon2 as jest.Mocked<typeof argon2>;

describe("createUser mutation", () => {
  const mockInput = {
    input: {
      email: "test@example.com",
      password: "SecurePassword123",
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user successfully", async () => {
    mockedUserModel.findOne.mockResolvedValueOnce(null); // No existing user
    mockedArgon2.hash.mockResolvedValueOnce("hashed_password");
    mockedUserModel.create.mockResolvedValueOnce([
      {
        email: mockInput.input.email,
        studentId: "123456",
        password: "hashed_password",
      },
    ]);

    const result = await createUser(null, mockInput);

    expect(mockedUserModel.findOne).toHaveBeenCalledWith({
      email: mockInput.input.email,
    });
    expect(mockedArgon2.hash).toHaveBeenCalledWith(
      mockInput.input.password,
      expect.any(Object),
    );
    expect(mockedUserModel.create).toHaveBeenCalledWith({
      email: mockInput.input.email,
      studentId: expect.any(String),
      password: "hashed_password",
    });
    expect(result).toEqual({ message: "User created successfully" });
  });

  it("should throw an error if email or password is missing", async () => {
    const missingInput = {
      input: {
        email: "",
        password: "",
      },
    };

    await expect(createUser(null, missingInput)).rejects.toThrow(GraphQLError);
    expect(mockedUserModel.findOne).not.toHaveBeenCalled();
    expect(mockedUserModel.create).not.toHaveBeenCalled();
  });

  it("should throw an error if email already exists", async () => {
    mockedUserModel.findOne.mockResolvedValueOnce({
      email: mockInput.input.email,
    }); // Existing user

    await expect(createUser(null, mockInput)).rejects.toThrow(GraphQLError);
    expect(mockedUserModel.findOne).toHaveBeenCalledWith({
      email: mockInput.input.email,
    });
    expect(mockedUserModel.create).not.toHaveBeenCalled();
  });

  it("should throw an error for invalid email", async () => {
    const invalidInput = {
      input: {
        email: "invalid_email",
        password: "SecurePassword123",
      },
    };

    await expect(createUser(null, invalidInput)).rejects.toThrow(GraphQLError);
    expect(mockedUserModel.findOne).not.toHaveBeenCalled();
    expect(mockedUserModel.create).not.toHaveBeenCalled();
  });

  it("should throw an error for weak password", async () => {
    const invalidInput = {
      input: {
        email: "test@example.com",
        password: "weak",
      },
    };

    await expect(createUser(null, invalidInput)).rejects.toThrow(GraphQLError);
    expect(mockedUserModel.findOne).not.toHaveBeenCalled();
    expect(mockedUserModel.create).not.toHaveBeenCalled();
  });

  it("should throw an error if unique student ID generation fails", async () => {
    mockedUserModel.findOne.mockResolvedValueOnce(null); // No existing user
    mockedUserModel.findOne.mockResolvedValue({ studentId: "123456" }); // Student ID collision

    await expect(createUser(null, mockInput)).rejects.toThrow(Error);
    expect(mockedUserModel.create).not.toHaveBeenCalled();
  });
});
