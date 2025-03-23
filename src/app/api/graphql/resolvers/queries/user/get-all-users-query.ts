// src/app/api/graphql/resolver/queries/user/get-all-users.ts
import { User } from "@/generated/graphql";
import { UserModel } from "../../../models";
import { GraphQLError } from "graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";

interface GetAllUserArgs {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

const buildUserQuery = (search?: string) =>
  search
    ? {
        $or: [
          { email: { $regex: search, $options: "i" } },
          { studentId: { $regex: search, $options: "i" } },
        ],
      }
    : {};

export const getAllUser = async (
  _: unknown,
  args: GetAllUserArgs,
  context: { user?: User },
) => {
  const { user } = context;
  await requireAuthAndRoles(user, ["ADMIN"]);

  const {
    limit = 10,
    offset = 0,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = args;

  const maxLimit = Math.min(limit, 100);
  const allowedSortFields = ["createdAt", "role", "email", "studentId"];
  const safeSortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  try {
    const query = buildUserQuery(search);
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const [users, totalCount] = await Promise.all([
      UserModel.find(query)
        .skip(offset)
        .limit(maxLimit)
        .sort({ [safeSortField]: sortDirection })
        .select("-password"),
      UserModel.countDocuments(query),
    ]);

    return {
      users,
      totalCount,
      hasNextPage: offset + maxLimit < totalCount,
    };
  } catch {
    throw new GraphQLError("Failed to fetch users", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
