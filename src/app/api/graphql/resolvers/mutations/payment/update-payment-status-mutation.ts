import { GraphQLError } from "graphql";
import { PaymentModel } from "../../../models";
import { PaymentStatus, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { updateOrCreateEnrollment } from "./updateOrCreateEnrollment";

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
  context: { user?: User },
) => {
  const { user } = context;

  // Зөвхөн ADMIN хэрэглэгчдэд зөвшөөрнө
  await requireAuthAndRoles(user, ["ADMIN"]);

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
