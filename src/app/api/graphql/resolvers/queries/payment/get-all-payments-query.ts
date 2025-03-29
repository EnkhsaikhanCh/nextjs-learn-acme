import { GraphQLError } from "graphql";
import { PaymentModel } from "../../../models";
import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

const buildPaymentQuery = (search?: string) =>
  search
    ? {
        transactionNote: { $regex: search, $options: "i" },
      }
    : {};

export const getAllPayments = async (
  _: unknown,
  args: { limit?: number; offset?: number; search?: string },
  context: { user?: User },
) => {
  const { user } = context;
  await requireAuthAndRoles(user, ["ADMIN"]);

  const { limit = 10, offset = 0, search } = args;
  const maxLimit = Math.min(limit, 50);

  try {
    const query = buildPaymentQuery(search);

    const [payments, totalCount, totalAmountAgg] = await Promise.all([
      PaymentModel.find(query)
        .populate({ path: "userId", model: "User" })
        .populate({ path: "courseId", model: "Course" })
        .skip(offset)
        .limit(maxLimit),
      PaymentModel.countDocuments(query),
      PaymentModel.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalAmount = totalAmountAgg[0]?.total || 0;

    return {
      payments,
      totalCount,
      totalAmount,
      hasNextPage: offset + maxLimit < totalCount,
    };
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
