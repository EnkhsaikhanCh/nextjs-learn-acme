import { createPayment } from "../../../../../src/app/api/graphql/resolvers/mutations/payment/create-payment-mutation";
import {
  CourseModel,
  PaymentModel,
  UserV2Model,
} from "../../../../../src/app/api/graphql/models";
import { requireAuthAndRoles } from "../../../../../src/lib/auth-utils";
import { GraphQLError } from "graphql";
import {
  CreatePaymentInput,
  PaymentMethod,
  Role,
  User,
} from "../../../../../src/generated/graphql";

// Мок хийх
jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  UserV2Model: {
    findById: jest.fn(),
  },
  CourseModel: {
    findById: jest.fn(),
  },
  PaymentModel: jest.fn(), // PaymentModel-г конструктор шиг ашиглана
}));

describe("createPayment", () => {
  const mockUser: User = {
    _id: "user-id",
    email: "user@example.com",
    role: Role.Student,
    studentId: "student-123",
    isVerified: true,
  };

  const validInput: CreatePaymentInput = {
    userId: "user-id",
    courseId: "course-id",
    amount: 100,
    paymentMethod: PaymentMethod.BankTransfer,
    transactionNote: "Test payment",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Authentication Test
  it("throws an error if user is not authenticated", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );

    await expect(
      createPayment(null, { input: validInput }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createPayment(null, { input: validInput }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Unauthenticated");
  });

  // 2. Input Validation Test: missing required fields
  it("throws BAD_USER_INPUT if required fields are missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const incompleteInput: CreatePaymentInput = {
      userId: "", // missing
      courseId: "course-id",
      amount: 100,
      paymentMethod: PaymentMethod.BankTransfer,
      transactionNote: "Test payment",
    };

    await expect(
      createPayment(null, { input: incompleteInput }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createPayment(null, { input: incompleteInput }, { user: mockUser }),
    ).rejects.toHaveProperty(
      "message",
      "Missing required fields: userId, courseId, amount, paymentMethod, transactionNote",
    );
  });

  // 3. User Not Found Test
  it("throws USER_NOT_FOUND if the user does not exist", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (UserV2Model.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      createPayment(null, { input: validInput }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createPayment(null, { input: validInput }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "User not found");
  });

  // 4. Course Not Found Test
  it("throws COURSE_NOT_FOUND if the course does not exist", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (UserV2Model.findById as jest.Mock).mockResolvedValue({
      _id: validInput.userId,
    });
    (CourseModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(
      createPayment(null, { input: validInput }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createPayment(null, { input: validInput }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Course not found");
  });

  // 5. Successful Creation Test
  it("creates payment successfully with valid input", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Симуляц: user болон course байгаа гэж үзье
    (UserV2Model.findById as jest.Mock).mockResolvedValue({
      _id: validInput.userId,
    });
    (CourseModel.findById as jest.Mock).mockResolvedValue({
      _id: validInput.courseId,
    });

    // Бид PaymentModel-г конструктор шиг дуудна
    const mockPaymentSave = jest.fn().mockResolvedValue("saved-payment");
    const paymentInstance = {
      userId: validInput.userId,
      courseId: validInput.courseId,
      amount: validInput.amount,
      status: "PENDING",
      paymentMethod: validInput.paymentMethod,
      transactionNote: validInput.transactionNote,
      save: mockPaymentSave,
    };
    (PaymentModel as unknown as jest.Mock).mockImplementation(
      () => paymentInstance,
    );

    const result = await createPayment(
      null,
      { input: validInput },
      { user: mockUser },
    );

    expect(PaymentModel).toHaveBeenCalledWith({
      userId: validInput.userId,
      courseId: validInput.courseId,
      amount: validInput.amount,
      status: "PENDING",
      paymentMethod: validInput.paymentMethod,
      transactionNote: validInput.transactionNote,
    });
    expect(mockPaymentSave).toHaveBeenCalled();
    // Үр дүн нь paymentInstance-тэй ижил байх ёстой, учир нь код нь await payment.save() дараа payment instance-г буцаана
    expect(result).toEqual(paymentInstance);
  });

  // 6. Unexpected Error Test
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (UserV2Model.findById as jest.Mock).mockResolvedValue({
      _id: validInput.userId,
    });
    (CourseModel.findById as jest.Mock).mockResolvedValue({
      _id: validInput.courseId,
    });
    const mockPaymentSave = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));
    const paymentInstance = {
      save: mockPaymentSave,
    };
    (PaymentModel as unknown as jest.Mock).mockImplementation(
      () => paymentInstance,
    );

    await expect(
      createPayment(null, { input: validInput }, { user: mockUser }),
    ).rejects.toThrow(GraphQLError);
    await expect(
      createPayment(null, { input: validInput }, { user: mockUser }),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
