import { GraphQLError } from "graphql";
import { PaymentModel } from "../../../models";

export const getPaymentByUserAndCourse = async (
  _: unknown,
  { userId, courseId }: { userId: string; courseId: string },
) => {
  if (!userId || !courseId) {
    throw new GraphQLError("Payment userId or courseId are required", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  try {
    const payment = await PaymentModel.findOne({ userId, courseId })
      .populate({
        path: "userId",
        model: "User",
      })
      .populate({ path: "courseId", model: "Course" });

    if (!payment) {
      throw new GraphQLError("Payment not found", {
        extensions: { code: "NOT_FOUND" },
      });
    }

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
