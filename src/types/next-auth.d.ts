// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "student" | "admin";
      studentId: string;
    };
  }

  interface User {
    id: string;
    email: string;
    role: "student" | "admin";
    studentId: string;
  }
}

export default NextAuth;
