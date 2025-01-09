import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schemas";
import { NextRequest, NextResponse } from "next/server";
import { resolvers } from "./resolvers";
import { connectToDatabase } from "@/lib/mongodb";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

connectToDatabase();

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    // JWT token унших
    const token = req.cookies.get("authToken")?.value;

    if (token) {
      try {
        // JWT шалгах
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return { user: decoded }; // user-г context дотор оруулах
      } catch (error) {
        // Токен буруу/хугацаа дууссан
        return {}; // context.user байхгүй
      }
    }

    // Токен алга
    return {}; // context.user байхгүй
  },
});

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders,
    },
  });
}

export const GET = async (req: NextRequest) => {
  const handlerResponse = await handler(req);

  return new NextResponse(handlerResponse.body, {
    status: handlerResponse.status,
    headers: {
      ...corsHeaders,
      ...Object.fromEntries(handlerResponse.headers.entries()),
    },
  });
};

export const POST = async (req: NextRequest) => {
  const handlerResponse = await handler(req);

  // JSON өгөгдлийг унших
  const responseBody = await handlerResponse.json();

  // Хариултын эхний operationName болон токенг олж авах
  const operationName = responseBody.data && Object.keys(responseBody.data)[0];
  const token = operationName ? responseBody.data[operationName]?.token : null;

  // Cookie-г тохируулж, шинэ Response үүсгэх
  const nextResponse = new NextResponse(JSON.stringify(responseBody), {
    status: handlerResponse.status,
    headers: {
      ...corsHeaders,
      ...Object.fromEntries(handlerResponse.headers.entries()),
    },
  });

  // Токен байгаа эсэхийг шалгаад тохируулах
  if (token) {
    nextResponse.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  }

  return nextResponse;
};
