// src/lib/auth-utils.ts
import { GraphQLError } from "graphql";
import { EnrollmentV2Model } from "@/app/api/graphql/models";
import { UserV2 } from "@/generated/graphql";

export const requireAuthAndRolesV2 = async (
  user: UserV2 | undefined,
  allowedRoles: string[],
  options: { requireEnrollment?: boolean; courseId?: string } = {},
) => {
  if (!user) {
    throw new GraphQLError("Authentication required", {
      extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
    });
  }

  if (!allowedRoles.includes(user.role)) {
    throw new GraphQLError("Insufficient permissions", {
      extensions: { code: "FORBIDDEN", http: { status: 403 } },
    });
  }

  if (
    options.requireEnrollment &&
    user.role === "STUDENT" &&
    options.courseId
  ) {
    const enrollment = await EnrollmentV2Model.findOne({
      userId: user._id,
      courseId: options.courseId,
      isDeleted: false,
      status: { $in: ["ACTIVE", "COMPLETED"] },
    });
    if (!enrollment) {
      throw new GraphQLError("You are not enrolled in this course", {
        extensions: { code: "FORBIDDEN", http: { status: 403 } },
      });
    }
  }

  return user;
};
