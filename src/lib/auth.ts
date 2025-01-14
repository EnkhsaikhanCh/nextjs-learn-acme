// src/lib/auth
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserModel } from "@/app/api/graphql/models";
import argon2 from "argon2";
import { JWT } from "next-auth/jwt";

interface ExtendedJWT extends JWT {
  id?: string;
  role?: "student" | "admin";
  studentId?: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const user = await UserModel.findOne({
          email: credentials.email,
        });

        console.log("User found:", user);

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        const isPasswordValid = await argon2.verify(
          user.password,
          credentials.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          studentId: user.studentId,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;

        if ("role" in user && "studentId" in user) {
          token.role = user.role;
          token.studentId = user.studentId;
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: ExtendedJWT }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          role: token.role,
          studentId: token.studentId,
        };
      }
      return session;
    },
  },
};

const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

export { handlers, signIn, signOut, auth };
