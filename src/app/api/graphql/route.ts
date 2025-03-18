import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schemas";
import { NextRequest } from "next/server";
import { resolvers } from "./resolvers";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Таны auth.js файл
import { User } from "@/generated/graphql";
import { GraphQLError } from "graphql";
import { EnrollmentModel } from "./models";

await connectToDatabase();

// Туслах функц: Эрх болон бусад шалгалтыг хийнэ
const requireAuthAndRoles = async (
  user: User | undefined,
  allowedRoles: string[],
  options: { requireEnrollment?: boolean; courseId?: string } = {},
) => {
  // Authentication шалгалт
  if (!user) {
    throw new GraphQLError("Authentication required", {
      extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
    });
  }

  // Role шалгалт
  if (!allowedRoles.includes(user.role)) {
    throw new GraphQLError("Insufficient permissions", {
      extensions: { code: "FORBIDDEN", http: { status: 403 } },
    });
  }

  // Нэмэлт шалгалт: Бүртгэл шаардлагатай бол
  if (
    options.requireEnrollment &&
    user.role === "STUDENT" &&
    options.courseId
  ) {
    const enrollment = await EnrollmentModel.findOne({
      userId: user._id,
      courseId: options.courseId,
    });
    if (!enrollment) {
      throw new GraphQLError("You are not enrolled in this course", {
        extensions: { code: "FORBIDDEN", http: { status: 403 } },
      });
    }
  }

  return user; // Шалгалт амжилттай бол user буцаана
};

export { requireAuthAndRoles };

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    const session = await getServerSession({ req, ...authOptions });
    const user = session?.user || null;
    return { user };
  },
});

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const response = await handler(req);
  return response;
};

export const POST = async (req: NextRequest) => {
  const response = await handler(req);
  return response;
};
