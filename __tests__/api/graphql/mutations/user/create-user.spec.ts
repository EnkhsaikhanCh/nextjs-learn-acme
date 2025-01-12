import { createUser } from "../../../../../src/app/api/graphql/resolvers/mutations/user/create-user-mutation";
import { UserModel } from "../../../../../src/app/api/graphql/models/user.model";
import argon2 from "argon2";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import {
  sanitizeInput,
  validationEmail,
  validationPassword,
} from "../../../../../src/utils/validation";
import dotenv from "dotenv";
dotenv.config();

jest.mock("../../../../../src/app/api/graphql/models/user.model");
jest.mock("argon2");
jest.mock("../../../../../src/utils/validation");
jest.mock("jsonwebtoken");

describe("createUser mutation", () => {
  let mockInput: { input: { email: string; password: string } };

  beforeEach(() => {
    process.env.JWT_ACCESS_SECRET = "test-secret";

    // Энд mock-уудын default утгуудыг тохируулж өгнө
    mockInput = {
      input: {
        email: "test@example.com",
        password: "SecurePassword123",
      },
    };

    (UserModel.findOne as jest.Mock).mockReset();
    (UserModel.create as jest.Mock).mockReset();
    (argon2.hash as jest.Mock).mockReset();
    (jwt.sign as jest.Mock).mockReset();

    (sanitizeInput as jest.Mock).mockImplementation((email: string) =>
      email.trim(),
    );
    (validationEmail as jest.Mock).mockImplementation((email: string) =>
      email.includes("@"),
    );
    (validationPassword as jest.Mock).mockImplementation(
      (password: string) => password.length >= 8,
    );
  });

  it("should create a user successfully", async () => {
    // Mock – хэрэглэгч байхгүй (findOne = null)
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
    expect(result).toEqual({
      message: "User created successfully",
      token: "mockToken",
    });
  });

  it("should throw an error if email or password is missing", async () => {
    mockInput.input.email = "";
    mockInput.input.password = "";

    await expect(createUser(null, mockInput)).rejects.toThrow(GraphQLError);
    expect(UserModel.findOne).not.toHaveBeenCalled();
    expect(UserModel.create).not.toHaveBeenCalled();
  });

  it("should throw an error if email already exists", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce({
      email: mockInput.input.email,
    });

    await expect(createUser(null, mockInput)).rejects.toThrow(GraphQLError);
    expect(UserModel.findOne).toHaveBeenCalledWith({
      email: "test@example.com",
    });
    expect(UserModel.create).not.toHaveBeenCalled();
  });

  it("should throw an error for invalid email", async () => {
    (validationEmail as jest.Mock).mockReturnValueOnce(false);

    await expect(createUser(null, mockInput)).rejects.toThrow(GraphQLError);
    expect(UserModel.findOne).not.toHaveBeenCalled();
    expect(UserModel.create).not.toHaveBeenCalled();
  });

  it("should throw an error for weak password", async () => {
    (validationPassword as jest.Mock).mockReturnValueOnce(false);

    await expect(createUser(null, mockInput)).rejects.toThrow(GraphQLError);
    expect(UserModel.findOne).not.toHaveBeenCalled();
    expect(UserModel.create).not.toHaveBeenCalled();
  });

  it("should throw 'Internal server error.' if an unknown error is thrown", async () => {
    // existingUser байхгүй байхаар mock-лоод
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce(null);

    // Генераци амжилттай
    (UserModel.findOne as jest.Mock).mockResolvedValueOnce(null);
    (argon2.hash as jest.Mock).mockResolvedValueOnce("hashed_password");

    // `UserModel.create`-д алдаа гаргаж байна
    (UserModel.create as jest.Mock).mockRejectedValue(
      new Error("Some unknown DB error"),
    );

    await expect(createUser(null, mockInput)).rejects.toThrow(
      "Internal server error.",
    );
  });

  it("should throw error if JWT_SECRET is missing", async () => {
    const originalSecret = process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_ACCESS_SECRET; // Түр устгах

    await expect(createUser(null, mockInput)).rejects.toThrow(
      "JWT_SECRET is not defined in environment variables",
    );

    process.env.JWT_SECRET = originalSecret; // Сэргээх
  });

  it("should retry generating studentId if the first is already taken", async () => {
    // 1) Эхний дуудлага (имэйл шалгах) -> null
    //    => имэйл давхардаагүй тул цааш үргэлжилнэ.
    // 2) Дараагийн дуудлага (studentId шалгах) -> 1-р оролдлогоор олдсон гэж үзье.
    // 3) 3 дахь дуудлага (studentId шалгах) -> null (дальд оролдлогоор amжилттай)
    (UserModel.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // Имэйл шалгах
      .mockResolvedValueOnce({ studentId: "111111" }) // 1-р studentId давхардсан
      .mockResolvedValueOnce(null); // 2-р studentId амжилттай

    (argon2.hash as jest.Mock).mockResolvedValue("hashed_password");
    (UserModel.create as jest.Mock).mockResolvedValue({
      _id: "mockUserId",
      email: mockInput.input.email,
      studentId: "someUniqueID",
      role: "student",
      password: "hashed_password",
    });
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");

    const result = await createUser(null, mockInput);

    expect(UserModel.findOne).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      message: "User created successfully",
      token: "mockToken",
    });
  });
});
