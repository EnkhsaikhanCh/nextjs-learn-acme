import { GraphQLError } from "graphql";
import { CourseModel, PaymentModel, UserV2Model } from "../../../models";
import { CreatePaymentInput, User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

export const createPayment = async (
  _: unknown,
  { input }: { input: CreatePaymentInput },
  context: { user?: User },
) => {
  const { user } = context;
  const { userId, courseId, amount, paymentMethod, transactionNote } = input;

  await requireAuthAndRoles(user, ["STUDENT", "ADMIN"]);

  if (!userId || !courseId || !amount || !paymentMethod || !transactionNote) {
    throw new GraphQLError(
      "Missing required fields: userId, courseId, amount, paymentMethod, transactionNote",
      {
        extensions: { code: "BAD_USER_INPUT" },
      },
    );
  }

  try {
    const userExists = await UserV2Model.findById(userId);
    if (!userExists) {
      throw new GraphQLError("User not found", {
        extensions: { code: "USER_NOT_FOUND" },
      });
    }

    const courseExists = await CourseModel.findById(courseId);
    if (!courseExists) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "COURSE_NOT_FOUND" },
      });
    }

    const payment = new PaymentModel({
      userId,
      courseId,
      amount,
      status: "PENDING",
      paymentMethod,
      transactionNote,
    });

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
