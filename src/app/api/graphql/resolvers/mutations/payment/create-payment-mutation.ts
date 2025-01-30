import { GraphQLError } from "graphql";
import { CreatePaymentInput } from "../../../schemas/payment.schema";
import { CourseModel, PaymentModel, UserModel } from "../../../models";

export const createPayment = async (
  _: unknown,
  { input }: { input: CreatePaymentInput },
) => {
  const { userId, courseId, amount, paymentMethod, transactionNote } = input;

  if (!userId || !courseId || !amount || !paymentMethod) {
    throw new GraphQLError(
      "Missing required fields: userId, courseId, amount, paymentMethod",
      {
        extensions: { code: "BAD_USER_INPUT" },
      },
    );
  }

  try {
    const userExists = await UserModel.findById(userId);
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

    const message = (error as Error).message;

    throw new GraphQLError(`Internal server error: ${message}`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
