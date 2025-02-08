import { GraphQLError } from "graphql";
import { EnrollmentModel, PaymentModel } from "../../../models";
import { createEnrollment } from "../enrollment/create-enrollment";

export const updatePaymentStatus = async (
  _: unknown,
  {
    _id,
    status,
    refundReason,
  }: {
    _id: string;
    status: "PENDING" | "APPROVED" | "FAILED" | "REFUNDED";
    refundReason?: string;
  },
) => {
  if (!_id) {
    throw new GraphQLError("Payment ID is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  try {
    const payment = await PaymentModel.findById(_id);
    if (!payment) {
      throw new GraphQLError("Payment not found", {
        extensions: { code: "PAYMENT_NOT_FOUND" },
      });
    }

    payment.status = status;

    if (status === "APPROVED") {
      const now = new Date();
      now.setMonth(now.getMonth() + 1); // 1 сарын эрх
      payment.expiryDate = now;

      // createEnrollment
      const enrollmentExists = await EnrollmentModel.findOne({
        userId: payment.userId,
        courseId: payment.courseId,
      });

      if (!enrollmentExists) {
        await createEnrollment(_, {
          input: { userId: payment.userId, courseId: payment.courseId },
        });
      }
    }

    // If REFUNDED, update refundReason
    if (status === "REFUNDED") {
      if (!refundReason) {
        throw new GraphQLError(
          "Refund reason is required when status is REFUNDED",
          {
            extensions: { code: "BAD_USER_INPUT" },
          },
        );
      }
      payment.refundReason = refundReason;
    }

    await payment.save();
    return payment;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError(
      `Internal server error: ${(error as Error).message}`,
      {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      },
    );
  }
};
