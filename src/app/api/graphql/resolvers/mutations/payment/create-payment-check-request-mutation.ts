import {
  CreatePaymentCheckRequest,
  PaymentMethod,
  PaymentMutationResponse,
  PaymentStatus,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { CourseModel, PaymentModel } from "../../../models";

export const createPaymentCheckRequest = async (
  _: unknown,
  { input }: { input: CreatePaymentCheckRequest },
  context: { user?: UserV2 },
): Promise<PaymentMutationResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Student]);

  const { courseId, amount, transactionNote } = input;

  if (!courseId || !amount || !transactionNote) {
    return {
      success: false,
      message: "Missing required fields",
    };
  }

  try {
    const existingCourse = await CourseModel.findById(courseId);
    if (!existingCourse) {
      return {
        success: false,
        message: "Course not found",
      };
    }

    const existingPayment = await PaymentModel.findOne({
      userId: user?._id,
      courseId: existingCourse._id,
      status: PaymentStatus.Pending,
    });
    if (existingPayment) {
      return {
        success: false,
        message: "Payment check request already exists",
      };
    }

    const payment = new PaymentModel({
      userId: user?._id,
      courseId,
      amount,
      status: PaymentStatus.Pending,
      paymentMethod: PaymentMethod.BankTransfer,
      transactionNote,
    });

    await payment.save();

    return {
      success: true,
      message: "Payment check request created successfully",
    };
  } catch {
    return {
      success: false,
      message: "Internal server error",
    };
  }
};
