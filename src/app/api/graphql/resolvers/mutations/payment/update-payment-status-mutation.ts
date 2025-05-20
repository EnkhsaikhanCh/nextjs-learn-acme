import { GraphQLError } from "graphql";
import { PaymentModel } from "../../../models";
import { PaymentStatus, UserV2, UserV2Role } from "@/generated/graphql";
import { updateOrCreateEnrollment } from "./updateOrCreateEnrollment";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";

export const updatePaymentStatus = async (
  _: unknown,
  {
    _id,
    status,
    refundReason,
  }: {
    _id: string;
    status: PaymentStatus;
    refundReason?: string;
  },
  context: { user?: UserV2 },
) => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Admin]);

  // Payment ID шаардлагатай
  if (!_id) {
    throw new GraphQLError("Payment ID is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  // PaymentStatus enum-ийн утгыг шалгах
  if (!Object.values(PaymentStatus).includes(status)) {
    throw new GraphQLError("Invalid payment status", {
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

    const previousStatus = payment.status;
    payment.status = status;

    // APPROVED болсон бол enrollment-ийг шинэчлэх эсвэл үүсгэх
    if (status === "APPROVED" && previousStatus !== "APPROVED") {
      await updateOrCreateEnrollment(payment.userId, payment.courseId);
    }

    // REFUNDED бол refundReason шаардлагатай
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
    throw new GraphQLError("Internal server error", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
