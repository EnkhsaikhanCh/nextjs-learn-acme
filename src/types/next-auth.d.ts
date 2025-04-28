// types/next-auth.d.ts
import { UserV2Role } from "@/generated/graphql";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      email: string;
      role: UserV2Role;
      isVerified: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    role: UserV2Role;
    isVerified: boolean;
  }
}

export default NextAuth;
