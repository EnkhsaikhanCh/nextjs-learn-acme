import { UserV2Role } from "@/generated/graphql";

export const roleRedirectMap: Record<UserV2Role, string> = {
  ADMIN: "/admin",
  INSTRUCTOR: "/instructor",
  STUDENT: "/dashboard",
};

export const fallbackRedirect = "/";
