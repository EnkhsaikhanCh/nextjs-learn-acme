import { GraphQLError } from "graphql";
import { UserModel } from "../../../models";
import { RegisterInput } from "../../../schemas/user.schema";
import argon2 from "argon2";
import {
  sanitizeInput,
  validationEmail,
  validationPassword,
} from "@/utils/validation";

const generateUniqueStudentId = async (): Promise<string> => {
  let retries = 0;
  const maxRetries = 10;

  try {
    while (retries < maxRetries) {
      const studentId = Math.floor(100000 + Math.random() * 900000).toString();
      const existingUser = await UserModel.findOne({ studentId });

      if (!existingUser) return studentId;

      retries++;
    }

    throw new Error("Exceeded maximum retries to generate unique studentId");
  } catch (error) {
    console.error("Error in generateUniqueStudentId:", error);
    throw new Error("Failed to generate unique studentId");
  }
};

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

  if (!validationPassword(password)) {
    throw new GraphQLError("Password must meet complexity requirements.", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  return { sanitizedEmail };
};

// The main function to create a new user
export const createUser = async (
  _: unknown,
  { input }: { input: RegisterInput },
) => {
  try {
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

    await UserModel.create({
      email: sanitizedEmail,
      studentId: studentId,
      role: "student",
      password: hashedPassword,
    });

    return { message: "User created successfully" };
  } catch (error) {
    // Handle known GraphQL errors
    if (error instanceof GraphQLError) {
      throw error;
    }

    // Handle unexpected errors
    throw new GraphQLError("Internal server error.", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
