import { GraphQLError } from "graphql";
import { PaymentModel } from "../../../models";

export const updatePaymentStatus = async (
  _: unknown,
  {
    _id,
    status,
  }: { _id: string; status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" },
) => {
  if (!_id) {
    throw new GraphQLError("Payment ID is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  try {
    // Step 1: Төлбөр байгаа эсэхийг шалгах**
    const payment = await PaymentModel.findById(_id);
    if (!payment) {
      throw new GraphQLError("Payment not found", {
        extensions: { code: "PAYMENT_NOT_FOUND" },
      });
    }

    // Step 2: Төлбөрийн төлөв шинэчлэх**
    payment.status = status;

    // Step 3: Хэрэв `COMPLETED` бол `expiryDate` тохируулах**
    if (status === "COMPLETED") {
      const now = new Date();
      now.setMonth(now.getMonth() + 1); // 1 сарын эрх
      payment.expiryDate = now;
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
