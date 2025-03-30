// src/app/api/graphql/resolver/mutation/user/update-user-mutation.test.ts
import { GraphQLError } from "graphql";
import { requireAuthAndRoles } from "../../../../../src/lib/auth-utils";
import { UserModel } from "../../../../../src/app/api/graphql/models/user.model";
import { updateUser } from "../../../../../src/app/api/graphql/resolvers/mutations";
import {
  Role,
  User,
  UpdateUserInput,
} from "../../../../../src/generated/graphql";

jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models/user.model", () => ({
  UserModel: {
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("updateUser mutation", () => {
  const mockUserId = "user-id-123";

  const studentUser: User = {
    _id: mockUserId,
    email: "student@example.com",
    role: Role.Student,
    isVerified: true,
    studentId: "student-id-123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const adminUser: User = {
    _id: mockUserId,
    email: "admin@example.com",
    role: Role.Admin,
    isVerified: true,
    studentId: "admin-id-123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const contextStudent = { user: studentUser };
  const contextAdmin = { user: adminUser };

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(true);
  });

  it("Хэрэглэгч зөв input-ээр өөрийн мэдээллийг шинэчилж чадна (Student)", async () => {
    try {
      const input: UpdateUserInput = { email: "newstudent@example.com" };
      const _id = mockUserId;

      (UserModel.findById as jest.Mock).mockResolvedValue({
        _id: mockUserId,
        email: "student@example.com",
      });
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      const updatedUserMock = {
        _id: mockUserId,
        email: input.email,
        role: Role.Student,
      };

      (UserModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(updatedUserMock),
      });

      const result = await updateUser({}, { input, _id }, contextStudent);
      expect(result).toEqual(updatedUserMock);
    } catch (error) {
      console.error("Test error details:", error);
      throw error;
    }
  });

  it("Student өөрийн бусад хэрэглэгчийн профайлыг шинэчлэх үед алдаа буцаана", async () => {
    const input: UpdateUserInput = { email: "newstudent@example.com" };
    const _id = "different-user-id";

    await expect(
      updateUser({}, { input, _id }, contextStudent),
    ).rejects.toThrow(
      new GraphQLError("Та зөвхөн өөрийн мэдээллийг шинэчилэх боломжтой"),
    );
  });

  it("Student role өөрчлөхийг оролдвол алдаа буцаана", async () => {
    const input: UpdateUserInput = { role: Role.Instructor };
    const _id = mockUserId;

    await expect(
      updateUser({}, { input, _id }, contextStudent),
    ).rejects.toThrow(
      "Зөвхөн админууд хэрэглэгчийн role-ийг шинэчлэх боломжтой",
    );
  });

  it("Админ өөрийн профайлын role-ийг өөрчлөхийг оролдвол алдаа буцаана", async () => {
    const input: UpdateUserInput = { role: Role.Student };
    const _id = mockUserId;

    await expect(updateUser({}, { input, _id }, contextAdmin)).rejects.toThrow(
      "Админууд өөрийн role-ийг шинэчлэх боломжгүй",
    );
  });

  it("Админ хувийн бусад хэрэглэгчийн role-ийг шинэчлэх үед буруу role оруулбал алдаа буцаана", async () => {
    // Use type assertion to test runtime behavior with an invalid role
    const input = { role: "INVALID_ROLE" as Role } as UpdateUserInput;
    const _id = "other-user-id";
    const context = { user: { ...adminUser, _id: "admin-id" } };

    await expect(updateUser({}, { input, _id }, context)).rejects.toThrow(
      "Хүчингүй role",
    );
  });

  it("Хэрэглэгч олдоогүй бол алдаа буцаана", async () => {
    const input: UpdateUserInput = { email: "newstudent@example.com" };
    const _id = mockUserId;
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      updateUser({}, { input, _id }, contextStudent),
    ).rejects.toThrow("Хэрэглэгч олдсонгүй");
  });

  it("Шинэ имэйл нь давхардаж байгаа бол алдаа буцаана", async () => {
    const input: UpdateUserInput = { email: "existing@example.com" };
    const _id = mockUserId;
    (UserModel.findById as jest.Mock).mockResolvedValue({
      _id: mockUserId,
      email: "student@example.com",
    });
    (UserModel.findOne as jest.Mock).mockResolvedValue({
      _id: "other-id",
      email: input.email,
    });

    await expect(
      updateUser({}, { input, _id }, contextStudent),
    ).rejects.toThrow("Энд и-мэйл аль хэдийн бүртгэлтэй байна");
  });

  it("findByIdAndUpdate-д шинэчлэх үр дүн олдоогүй бол алдаа буцаана", async () => {
    const input: UpdateUserInput = { email: "newstudent@example.com" };
    const _id = mockUserId;

    (requireAuthAndRoles as jest.Mock).mockResolvedValue(true);

    (UserModel.findById as jest.Mock).mockResolvedValue({
      _id: mockUserId,
      email: "student@example.com",
    });

    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    (UserModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(
      updateUser({}, { input, _id }, contextStudent),
    ).rejects.toThrow("Хэрэглэгч олдсонгүй");
  });

  it("Гэнэтийн алдаа гарвал 'Хэрэглэгчийг шинэчлэхэд алдаа гарлаа' мессежийг GraphQLError-ээр буцаана", async () => {
    const input: UpdateUserInput = { email: "newstudent@example.com" };
    const _id = "mockUserId";

    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new Error("Гэнэтийн алдаа"),
    );

    await expect(
      updateUser({}, { input, _id }, contextStudent),
    ).rejects.toThrowError(
      new GraphQLError("Хэрэглэгчийг шинэчлэхэд алдаа гарлаа"),
    );
  });
});
