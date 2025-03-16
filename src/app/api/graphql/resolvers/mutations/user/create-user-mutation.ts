// src/app/api/graphql/resolver/mutation/user/create-user-mutation.ts
import { GraphQLError } from "graphql";
import { UserModel } from "../../../models";
import argon2 from "argon2";
import {
  sanitizeInput,
  validationEmail,
  validatePassword,
} from "@/utils/validation";
import { RegisterInput } from "@/generated/graphql";
import { generateUniqueStudentId } from "@/utils/generate-unique-student-id";

const validationInputs = (email: string, password: string) => {
  const sanitizedEmail = sanitizeInput(email);

  if (!sanitizedEmail || !password) {
    throw new GraphQLError("Email and password are required.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  if (!validationEmail(sanitizedEmail)) {
    throw new GraphQLError("Invalid email format.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  if (!validatePassword(password)) {
    throw new GraphQLError("Password must meet complexity requirements.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  return { sanitizedEmail };
};

async function checkRateLimit(
  key: string,
  maxRequests: number,
  window: number,
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/rate-limit`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, maxRequests, window }),
    },
  );

  const data = await response.json();
  if (!response.ok) {
    throw new GraphQLError(data.error || "Rate limit check failed", {
      extensions: { code: "TOO_MANY_REQUESTS" },
    });
  }

  return data.ip; // Edge Function-ээс авсан IP-г буцаана
}

export const createUser = async (
  _: unknown,
  { input }: { input: RegisterInput },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
) => {
  try {
    const { req } = context;

    console.log("Headers:", Object.fromEntries(req.headers));
    console.log("req.ip:", req.ip);

    // Edge Function-аас IP-г авах
    const MAX_REQUESTS = 5;
    const WINDOW = 3600;
    const ip = await checkRateLimit("createUser", MAX_REQUESTS, WINDOW);
    const rateLimitKey = `createUser:${ip}`;
    console.log("Final IP from Edge:", ip);
    console.log("Rate Limit Key:", rateLimitKey);

    const { sanitizedEmail } = validationInputs(input.email, input.password);

    const existingUser = await UserModel.findOne({ email: sanitizedEmail });
    if (existingUser) {
      throw new GraphQLError("A user with this email already exists.", {
        extensions: { code: "CONFLICT" },
      });
    }

    const studentId = await generateUniqueStudentId();

    const hashedPassword = await argon2.hash(input.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 4,
      parallelism: 2,
      hashLength: 32,
    });

    const newUser = await UserModel.create({
      email: sanitizedEmail,
      studentId: studentId,
      password: hashedPassword,
      isVerified: false,
    });

    return {
      message: "User created successfully",
      user: {
        _id: newUser._id,
        email: newUser.email,
        studentId: newUser.studentId,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    const message = (error as Error).message;

    // Rate limiting-ийн алдааг тусгайлан шалгах
    if (message.includes("Хэт олон хүсэлт")) {
      throw new GraphQLError(message, {
        extensions: { code: "TOO_MANY_REQUESTS" },
      });
    }

    throw new GraphQLError(`Internal server error: ${message}`, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
