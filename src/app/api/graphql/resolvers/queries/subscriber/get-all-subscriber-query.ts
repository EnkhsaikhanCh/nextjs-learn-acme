import { User } from "@/generated/graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";
import { SubscriberModel } from "../../../models";

const buildSubscriberQuery = (search?: string) => {
  if (!search) {
    return {};
  }

  const regex = { $regex: search, $options: "i" };

  return {
    $or: [{ email: regex }],
  };
};

export const getAllSubscribers = async (
  _: unknown,
  args: { limit?: number; offset?: number; search?: string },
  context: { user?: User },
) => {
  const { user } = context;
  await requireAuthAndRoles(user, ["ADMIN"]);

  const { limit = 10, offset = 0, search } = args;
  const maxLimit = Math.min(limit, 50);

  try {
    const query = buildSubscriberQuery(search);

    const [subscribers, totalCount] = await Promise.all([
      SubscriberModel.find(query, "email subscribedAt")
        .sort({ subscribedAt: -1 })
        .skip(offset)
        .limit(maxLimit),
      SubscriberModel.countDocuments(query),
    ]);

    return {
      subscribers,
      totalCount,
      hasNextPage: offset + subscribers.length < totalCount,
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Failed to fetch subscribers", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
