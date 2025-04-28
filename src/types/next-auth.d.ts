// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      email: string;
      role: "student" | "admin";
      isVerified: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    role: "student" | "admin";
    isVerified: boolean;
  }
}

export default NextAuth;
