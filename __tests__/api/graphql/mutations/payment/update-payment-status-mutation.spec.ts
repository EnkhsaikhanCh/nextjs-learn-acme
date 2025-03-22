import { updatePaymentStatus } from "../../../../../src/app/api/graphql/resolvers/mutations/payment/update-payment-status-mutation";
import { PaymentModel } from "../../../../../src/app/api/graphql/models";
import { requireAuthAndRoles } from "../../../../../src/lib/auth-utils";
import { GraphQLError } from "graphql";
import {
  PaymentStatus,
  Role,
  User,
} from "../../../../../src/generated/graphql";

// Additionally mock EnrollmentModel and createEnrollment
import { createEnrollment } from "../../../../../src/app/api/graphql/resolvers/mutations/enrollment/create-enrollment";

jest.mock("../../../../../src/lib/auth-utils", () => ({
  requireAuthAndRoles: jest.fn(),
}));

jest.mock("../../../../../src/app/api/graphql/models", () => ({
  PaymentModel: {
    findById: jest.fn(),
  },
  EnrollmentModel: {
    findOne: jest.fn(),
  },
}));

jest.mock(
  "../../../../../src/app/api/graphql/resolvers/mutations/enrollment/create-enrollment",
  () => ({
    createEnrollment: jest.fn().mockResolvedValue({
      _id: "enrollment-id",
      save: jest.fn().mockResolvedValue({}),
    }),
  }),
);

describe("updatePaymentStatus", () => {
  const adminUser: User = {
    _id: "admin-id",
    email: "admin@example.com",
    role: Role.Admin,
    studentId: "admin-id-123",
    isVerified: true,
  };

  const basePayment = {
    _id: "payment-id",
    userId: "user-id",
    courseId: "course-id",
    status: PaymentStatus.Pending,
    save: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Authentication Failure
  it("throws an error if user is not authenticated", async () => {
    (requireAuthAndRoles as jest.Mock).mockRejectedValue(
      new GraphQLError("Unauthenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      }),
    );
    await expect(
      updatePaymentStatus(
        null,
        { _id: "payment-id", status: PaymentStatus.Approved },
        { user: adminUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updatePaymentStatus(
        null,
        { _id: "payment-id", status: PaymentStatus.Approved },
        { user: adminUser },
      ),
    ).rejects.toHaveProperty("message", "Unauthenticated");
  });

  // 2. Missing Payment ID
  it("throws BAD_USER_INPUT if payment id is not provided", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    await expect(
      updatePaymentStatus(
        null,
        { _id: "", status: PaymentStatus.Approved },
        { user: adminUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updatePaymentStatus(
        null,
        { _id: "", status: PaymentStatus.Approved },
        { user: adminUser },
      ),
    ).rejects.toHaveProperty("message", "Payment ID is required");
  });

  // 3. Invalid Payment Status
  it("throws BAD_USER_INPUT if payment status is invalid", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    await expect(
      updatePaymentStatus(
        null,
        { _id: "payment-id", status: "INVALID_STATUS" as any },
        { user: adminUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updatePaymentStatus(
        null,
        { _id: "payment-id", status: "INVALID_STATUS" as any },
        { user: adminUser },
      ),
    ).rejects.toHaveProperty("message", "Invalid payment status");
  });

  // 4. Payment Not Found
  it("throws PAYMENT_NOT_FOUND if payment is not found", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    (PaymentModel.findById as jest.Mock).mockResolvedValue(null);
    await expect(
      updatePaymentStatus(
        null,
        { _id: "payment-id", status: PaymentStatus.Approved },
        { user: adminUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updatePaymentStatus(
        null,
        { _id: "payment-id", status: PaymentStatus.Approved },
        { user: adminUser },
      ),
    ).rejects.toHaveProperty("message", "Payment not found");
  });

  // 5. Successful Update: APPROVED, previous status not APPROVED
  it("updates payment status to APPROVED and triggers enrollment update when previous status is not APPROVED", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    // Simulate a payment with a previous status of PENDING
    const payment = {
      ...basePayment,
      status: "PENDING",
      save: jest.fn().mockResolvedValue(function () {
        return { ...payment, status: PaymentStatus.Approved };
      }),
    };
    (PaymentModel.findById as jest.Mock).mockResolvedValue(payment);

    const result = await updatePaymentStatus(
      null,
      { _id: "payment-id", status: PaymentStatus.Approved },
      { user: adminUser },
    );
    // After update, status should be APPROVED
    expect(payment.status).toBe(PaymentStatus.Approved);
    expect(payment.save).toHaveBeenCalled();
    // The result is the updated payment
    expect(result).toBe(payment);
  });

  // 6. Successful Update: APPROVED, previous status already APPROVED (enrollment update not triggered)
  it("updates payment status to APPROVED without triggering enrollment update if already APPROVED", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const payment = {
      ...basePayment,
      status: PaymentStatus.Approved,
      save: jest.fn().mockResolvedValue(function () {
        return { ...payment, status: PaymentStatus.Approved };
      }),
    };
    (PaymentModel.findById as jest.Mock).mockResolvedValue(payment);

    const result = await updatePaymentStatus(
      null,
      { _id: "payment-id", status: PaymentStatus.Approved },
      { user: adminUser },
    );
    // Status remains APPROVED and payment.save() is still called
    expect(payment.save).toHaveBeenCalled();
    expect(result).toBe(payment);
  });

  // 7. REFUNDED without refundReason
  it("throws BAD_USER_INPUT if status is REFUNDED and refundReason is missing", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const payment = {
      ...basePayment,
      status: "PENDING",
      save: jest.fn(),
    };
    (PaymentModel.findById as jest.Mock).mockResolvedValue(payment);

    await expect(
      updatePaymentStatus(
        null,
        { _id: "payment-id", status: PaymentStatus.Refunded },
        { user: adminUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updatePaymentStatus(
        null,
        { _id: "payment-id", status: PaymentStatus.Refunded },
        { user: adminUser },
      ),
    ).rejects.toHaveProperty(
      "message",
      "Refund reason is required when status is REFUNDED",
    );
  });

  // 8. Successful Update: REFUNDED with refundReason
  it("updates payment status to REFUNDED when refundReason is provided", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const payment = {
      ...basePayment,
      refundReason: undefined, // Add this property
      status: "PENDING",
      save: jest.fn().mockResolvedValue({
        ...basePayment,
        refundReason: "Customer request",
        status: PaymentStatus.Refunded,
      }),
    };
    (PaymentModel.findById as jest.Mock).mockResolvedValue(payment);

    const result = await updatePaymentStatus(
      null,
      {
        _id: "payment-id",
        status: PaymentStatus.Refunded,
        refundReason: "Customer request",
      },
      { user: adminUser },
    );
    expect(payment.refundReason).toBe("Customer request");
    expect(payment.status).toBe(PaymentStatus.Refunded);
    expect(payment.save).toHaveBeenCalled();
    expect(result).toBe(payment);
  });

  // 9. Unexpected Error in save()
  it("throws INTERNAL_SERVER_ERROR on unexpected errors", async () => {
    (requireAuthAndRoles as jest.Mock).mockResolvedValue(undefined);
    const payment = {
      ...basePayment,
      save: jest.fn().mockRejectedValue(new Error("Database error")),
    };
    (PaymentModel.findById as jest.Mock).mockResolvedValue(payment);

    await expect(
      updatePaymentStatus(
        null,
        { _id: "payment-id", status: PaymentStatus.Approved },
        { user: adminUser },
      ),
    ).rejects.toThrow(GraphQLError);
    await expect(
      updatePaymentStatus(
        null,
        { _id: "payment-id", status: PaymentStatus.Approved },
        { user: adminUser },
      ),
    ).rejects.toHaveProperty("message", "Internal server error");
  });
});
