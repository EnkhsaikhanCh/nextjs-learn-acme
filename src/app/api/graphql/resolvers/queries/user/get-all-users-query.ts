// src/app/api/graphql/resolver/queries/user/get-all-users.ts
import { User } from "@/generated/graphql";
import { UserModel } from "../../../models";
import { GraphQLError } from "graphql";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import type { FilterQuery } from "mongoose";

interface GetAllUserArgs {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
  filter?: {
    search?: string;
    role?: string;
    isVerified?: boolean;
  };
}

const buildUserQuery = (
  filter?: GetAllUserArgs["filter"],
): FilterQuery<User> => {
  const query: FilterQuery<User> = {};

  if (filter?.search) {
    query.$or = [
      { email: { $regex: filter.search, $options: "i" } },
      { studentId: { $regex: filter.search, $options: "i" } },
    ];
  }

  if (filter?.role) {
    query.role = filter.role.toUpperCase();
  }

  if (typeof filter?.isVerified === "boolean") {
    query.isVerified = filter.isVerified;
  }

  return query;
};

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
    sortBy = "createdAt",
    sortOrder = "desc",
    filter,
  } = args;

  const maxLimit = Math.min(limit, 100);
  const allowedSortFields = ["createdAt", "role", "email", "studentId"];
  const safeSortField = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  try {
    const query = buildUserQuery(filter);
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
