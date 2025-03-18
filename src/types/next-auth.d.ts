// types/next-auth.d.ts
import { User } from "@/generated/graphql";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      email: string;
      role: "student" | "admin";
      studentId: string;
      isVerified: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    role: "student" | "admin";
    studentId: string;
    isVerified: boolean;
  }
}

export default NextAuth;
