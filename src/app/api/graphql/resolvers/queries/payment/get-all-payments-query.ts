import { GraphQLError } from "graphql";
import { PaymentModel } from "../../../models";

export const getAllPayments = async () => {
  try {
    const payments = await PaymentModel.find()
      .populate({
        path: "userId",
        model: "User",
      })
      .populate({
        path: "courseId",
        model: "Course",
      });

    return payments;
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
