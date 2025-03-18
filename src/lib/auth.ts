// src/lib/auth
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { UserModel } from "@/app/api/graphql/models";
import argon2 from "argon2";
import { JWT } from "next-auth/jwt";
import { connectToDatabase } from "./mongodb";
import { redis } from "@/lib/redis";
import dotenv from "dotenv";
dotenv.config();

interface ExtendedJWT extends JWT {
  _id?: string;
  role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  studentId?: string;
  isVerified?: boolean;
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
        signInToken: { label: "SignInToken", type: "text", optional: true },
      },
      authorize: async (credentials) => {
        await connectToDatabase();

        if (!credentials?.email) {
          throw new Error("И-мэйл хаяг шаардлагатай.");
        }

        const user = await UserModel.findOne({
          email: credentials.email,
        }).exec();

        if (!user) {
          throw new Error(
            "Хэрэглэгч олдсонгүй. И-мэйл болон нууц үгээ шалгана уу.",
          );
        }

        // Allow sign-in with temporary token
        if (credentials.signInToken) {
          const storedEmail = await redis.get(
            `signin-token:${credentials.signInToken}`,
          );

          if (storedEmail && storedEmail === credentials.email) {
            await redis.del(`signin-token:${credentials.signInToken}`);
            return {
              id: user._id.toString(),
              email: user.email,
              studentId: user.studentId,
              role: user.role,
              isVerified: user.isVerified,
            };
          } else {
            throw new Error("Sign-in token буруу эсвэл хугацаа дууссан.");
          }
        }

        // Default sign-in with password
        if (!credentials.password) {
          throw new Error("Нууц үг шаардлагатай.");
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
          isVerified: user.isVerified,
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
        token.role = user.role || "STUDENT";
        token.studentId = user.studentId;
        token.isVerified = user.isVerified; // Нөхцөлгүйгээр шууд хадгал
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
          _id: token.id,
          email: token.email,
          role: token.role,
          studentId: token.studentId,
          isVerified: token.isVerified,
        };
      }
      return session;
    },
  },
};

const { handlers, signIn, signOut } = NextAuth(authOptions);

export { handlers, signIn, signOut };
