import { GraphQLError } from "graphql";
import { PaymentModel } from "../../../models";

export const getPaymentById = async (_: unknown, { _id }: { _id: string }) => {
  if (!_id) {
    throw new GraphQLError("Payment ID is required", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  try {
    const payment = await PaymentModel.findById(_id)
      .populate({
        path: "userId",
        model: "User",
      })
      .populate({ path: "courseId", model: "Course" });

    if (!payment) {
      throw new GraphQLError("Payment not found", {
        extensions: {
          code: "PAYMENT_NOT_FOUND",
        },
      });
    }

    return payment;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    const message = (error as Error).message;

    throw new GraphQLError(`Internal ervel error: ${message}`, {
      extensions: { code: "INTERNAL_SERCER_ERROR" },
    });
  }
};
