// src/lib/auth
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserModel } from "@/app/api/graphql/models";
import argon2 from "argon2";
import { JWT } from "next-auth/jwt";
import { connectToDatabase } from "./mongodb";

interface ExtendedJWT extends JWT {
  id?: string;
  role?: "student" | "admin";
  studentId?: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // JWT стратегийг ашиглах
    maxAge: 7 * 24 * 60 * 60, // Токены хүчинтэй хугацаа: 7 хоног
    updateAge: 24 * 60 * 60, // Токен шинэчлэгдэх давтамж: 24 цаг
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await connectToDatabase();

        if (!credentials?.email || !credentials.password) {
          throw new Error("И-мэйл эсвэл нууц үгийг оруулна уу.");
        }

        const user = await UserModel.findOne({
          email: credentials.email,
        }).exec();

        if (!user) {
          throw new Error(
            "Хэрэглэгч олдсонгүй. И-мэйл болон нууц үгээ шалгана уу.",
          );
        }

        const isPasswordValid = await argon2.verify(
          user.password,
          credentials.password,
        );

        if (!isPasswordValid) {
          throw new Error(
            "И-Майл эсвэл нууц үг буруу байна. Дахин оролдоно уу.",
          );
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;

        if ("role" in user && "studentId" in user) {
          token.role = user.role;
          token.studentId = user.studentId;
        }
      }

      // Токены хугацаа дууссан эсэхийг шалгах
      if (typeof token.exp === "number" && Date.now() > token.exp * 1000) {
        return {
          ...token,
          exp: 0, // Хугацаа дууссан гэж тэмдэглэх
        };
      }

      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const { handlers, signIn, signOut } = NextAuth(authOptions);

export { handlers, signIn, signOut };
