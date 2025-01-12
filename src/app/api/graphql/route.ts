// src/app/api/graphql/route.ts
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schemas";
import { NextRequest, NextResponse } from "next/server";
import { resolvers } from "./resolvers";
import { connectToDatabase } from "@/lib/mongodb";
import jwt, { TokenExpiredError } from "jsonwebtoken";

connectToDatabase();

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => {
    const token = req.cookies.get("authToken")?.value;

    if (token) {
      try {
        // Токеныг баталгаажуулах
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

        // Токен хүчинтэй бол хэрэглэгчийн мэдээллийг context-д нэмэх
        return { user: decoded };
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          console.error("Access token expired. Attempting to refresh...");
          // Refresh Token ашиглаж шинэ Access Token авах логик
          const refreshToken = req.cookies.get("refreshToken")?.value;

          if (refreshToken) {
            // Refresh Token-ийг ашиглаж шинэ Access Token авах (refresh API эсвэл Mutation дуудах)
            const refreshResponse = await fetch(
              new URL("/api/graphql", req.url),
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  query: `
                  mutation RefreshToken($input: RefreshTokenInput!) {
                    refreshToken(input: $input) {
                      token
                      refreshToken
                    }
                  }
                `,
                  variables: { input: { refreshToken } },
                }),
              },
            );

            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              const newAccessToken = data?.data?.refreshToken?.token;

              if (newAccessToken) {
                console.log("Access Token refreshed successfully.");
                return { user: jwt.decode(newAccessToken) }; // Шинэ токены мэдээллийг context-д нэмнэ
              }
            }
          }

          console.error(
            "Failed to refresh Access Token. Redirecting to login...",
          );
        } else {
          console.error("Token verification failed:", error);
        }
        return {}; // Алдаа гарсан тохиолдолд context хоосон байна
      }
    }

    return {}; // Токен байхгүй тохиолдолд context хоосон байна
  },
});

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders,
    },
  });
}

// GET хүсэлтийн хувьд хэвээр хадгалья
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

// POST хүсэлтийн хувьд authToken болон refreshToken-ийг хоёуланг нь Cookie-д тохируулна
export const POST = async (req: NextRequest) => {
  const handlerResponse = await handler(req);

  // GraphQL-ийн хариуг уншиж авах
  const responseBody = await handlerResponse.json();

  // Ямар operation дуудагдсан бэ гэдгийг (жишээлбэл createUser, loginUser...) олж авах
  const operationName = responseBody?.data && Object.keys(responseBody.data)[0];

  // Хэрэв тухайн operation-аас token, refreshToken буцаж байвал авна
  const token =
    operationName && responseBody.data[operationName]?.token
      ? responseBody.data[operationName].token
      : null;

  const refreshToken =
    operationName && responseBody.data[operationName]?.refreshToken
      ? responseBody.data[operationName].refreshToken
      : null;

  // Серверээс буцаж буй JSON өгөгдлийг ашиглан шинэ NextResponse үүсгэх
  const nextResponse = new NextResponse(JSON.stringify(responseBody), {
    status: handlerResponse.status,
    headers: {
      ...corsHeaders,
      ...Object.fromEntries(handlerResponse.headers.entries()),
    },
  });

  // 1. Access Token-ийг Cookie болгох
  if (token) {
    nextResponse.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // expires тохируулж болно:
      // expires: new Date(Date.now() + 15 * 60 * 1000), // жишээ нь 15 минут
    });
  }

  // 2. Refresh Token-ийг Cookie болгох
  if (refreshToken) {
    nextResponse.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // Refresh Token-д илүү урт хугацаа зааж өгч болно
      // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  return nextResponse;
};
