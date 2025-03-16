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

export const createUser = async (
  _: unknown,
  { input }: { input: RegisterInput },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any,
) => {
  try {
    const { checkRateLimit, req } = context;

    // Орчныг шалгах
    const isProd = process.env.VERCEL_ENV === "production";
    console.log("Current VERCEL_ENV:", process.env.VERCEL_ENV);
    console.log("Current NODE_ENV:", process.env.NODE_ENV);

    const MAX_REQUESTS = 5;
    const WINDOW = 3600;
    let rateLimitKey: string;

    if (isProd) {
      // Production-д IP дээр суурилсан rate limiting
      console.log(
        "Production environment detected. Using IP-based rate limiting.",
      );
      console.log("Headers:", Object.fromEntries(req.headers));
      console.log("req.ip:", req.ip);

      const ip =
        req.headers["x-vercel-forwarded-for"]?.toString() ||
        req.headers["x-forwarded-for"]?.toString() ||
        req.ip ||
        "unknown";
      console.log("Final IP:", ip);

      rateLimitKey = `createUser:${ip}`;
      await checkRateLimit(rateLimitKey, MAX_REQUESTS, WINDOW);
    } else {
      // Preview/development-д email дээр суурилсан rate limiting
      console.log(
        "Preview or development environment detected. Using email-based rate limiting.",
      );
      rateLimitKey = `createUser:${input.email}`;
      await checkRateLimit(rateLimitKey, MAX_REQUESTS, WINDOW);
    }

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
