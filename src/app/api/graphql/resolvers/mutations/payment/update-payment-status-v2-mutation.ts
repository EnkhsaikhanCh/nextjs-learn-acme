import {
  EnrollmentV2Status,
  PaymentMutationResponse,
  PaymentStatus,
  UpdatePaymentStatusV2Input,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { EnrollmentV2Model, PaymentModel } from "../../../models";

// ✅ Modular handler for approved payments
const handleApprovedPayment = async (userId: string, courseId: string) => {
  const now = new Date();

  const enrollment = await EnrollmentV2Model.findOne({
    userId: userId,
    courseId: courseId,
  });

  const newExpiryDate = new Date(
    Math.max(now.getTime(), enrollment?.expiryDate?.getTime() || now.getTime()),
  );
  newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);

  if (enrollment) {
    enrollment.expiryDate = newExpiryDate;
    enrollment.status = EnrollmentV2Status.Active;
    await enrollment.save();
  } else {
    await EnrollmentV2Model.create({
      userId: userId,
      courseId: courseId,
      expiryDate: newExpiryDate,
      status: EnrollmentV2Status.Active,
    });
  }
};

// ✅ Main resolver
export const updatePaymentStatusV2 = async (
  _: unknown,
  { input }: { input: UpdatePaymentStatusV2Input },
  context: { user?: UserV2 },
): Promise<PaymentMutationResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Admin]);

  const { paymentId, status } = input;

  if (!paymentId) {
    return { success: false, message: "Payment ID is required" };
  }

  if (!Object.values(PaymentStatus).includes(status)) {
    return { success: false, message: "Invalid payment status" };
  }

  try {
    const payment = await PaymentModel.findById(paymentId);
    if (!payment) {
      return { success: false, message: "Payment not found" };
    }

    if (status === PaymentStatus.Approved) {
      await handleApprovedPayment(payment.userId, payment.courseId);
    }

    payment.status = status;
    await payment.save();

    return {
      success: true,
      message: "Payment status updated successfully",
    };
  } catch {
    return {
      success: false,
      message: `Failed to update payment status`,
    };
  }
};
