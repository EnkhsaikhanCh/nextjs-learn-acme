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

    console.log("Headers:", req.headers);
    console.log("IP from x-forwarded-for:", req.headers["x-forwarded-for"]);
    console.log("IP from req.ip:", req.ip);

    // Rate limiting шалгах: IP дээр суурилсан хязгаарлалт
    const ip =
      req.headers["x-forwarded-for"]?.toString() ||
      req.headers["x-real-ip"]?.toString() ||
      req.ip ||
      "unknown";

    console.log("Final IP:", ip);

    const rateLimitKey = ip ? `createUser:${ip}` : `createUser:${input.email}`;
    const MAX_REQUESTS = 5; // 5 удаа
    const WINDOW = 3600; // 1 цаг
    await checkRateLimit(rateLimitKey, MAX_REQUESTS, WINDOW);

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
