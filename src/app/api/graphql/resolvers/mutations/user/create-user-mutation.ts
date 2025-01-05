import { GraphQLError } from "graphql";
import { UserModel } from "../../../models";
import { RegisterInput } from "../../../schemas/user.schema";
import argon2 from "argon2";
import { encryptData } from "@/common/encryption/encrypt-util";
import { decryptData } from "@/common/encryption/decrypt-util";
import { hashData } from "@/common/argon2-hash";
import {
  sanitizeInput,
  validateName,
  validationEmail,
  validationPassword,
} from "@/utils/validation";

const generateUniqueStudentId = async (): Promise<string> => {
  try {
    let studentId = "";
    let isUnique = false;

    while (!isUnique) {
      studentId = Math.floor(100000 + Math.random() * 900000).toString();

      // Бүх хэрэглэгчийг татаж авах
      const users = await UserModel.find({});

      // Бүх хэрэглэгчийн studentId-г тайлж шалгах
      isUnique = !users.some((user) => {
        const decryptedStudentId = decryptData(
          user.studentId,
          user.studentIdIv,
          user.studentIdAuthTag,
        );
        return decryptedStudentId === studentId;
      });
    }

    return studentId;
  } catch (error) {
    console.error("Error in generateUniqueStudentId:", error);
    throw new Error("Failed to generate unique studentId");
  }
};

// The main function to create a new user
export const createUser = async (
  _: unknown,
  { input }: { input: RegisterInput },
) => {
  try {
    // Step 1: Sanitize inputs
    const sanitizedEmail = sanitizeInput(input.email);
    const sanitizedName = sanitizeInput(input.name);

    // Step 2: Validate name
    if (!validateName(sanitizedName)) {
      throw new GraphQLError(
        "Name contains invalid characters. Only letters, numbers, spaces, '.', and '-' are allowed.",
        {
          extensions: { code: "BAD_USER_INPUT" },
        },
      );
    }

    // Step 3: Validate required fields
    if (!sanitizedEmail || !input.password) {
      throw new GraphQLError("Email and password are required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Step 4: Validate email format
    if (!validationEmail(sanitizedEmail)) {
      throw new GraphQLError("Invalid email format", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Step 5: Validate password strength
    if (!validationPassword(input.password)) {
      throw new GraphQLError(
        `Password must:
         - Be at least 8 characters long,
         - Not exceed 128 characters,
         - Include at least one uppercase letter,
         - Include at least one lowercase letter,
         - Include at least one number,
         - Include at least one special character.`,
        {
          extensions: { code: "BAD_USER_INPUT" },
        },
      );
    }

    // Email hash хийх
    const emailHash = await hashData(sanitizedEmail);

    // Step 6: Check for existing user with the same email
    const existingUser = await UserModel.findOne({ emailHash });
    if (existingUser) {
      throw new GraphQLError("A user with this email already exists.", {
        extensions: { code: "CONFLICT" },
      });
    }

    // Step 7: Encrypt name
    const {
      encryptedData: encryptedName,
      iv: nameIV,
      authTag: nameAuthTag,
    } = encryptData(sanitizedName);

    // Step 8: Encrypt email
    const {
      encryptedData: encryptedEmail,
      iv: emailIV,
      authTag: emailAuthTag,
    } = encryptData(sanitizedEmail);

    // Step 9: Generate a unique studentId
    const studentId = await generateUniqueStudentId();

    // Step 10: Encrypt studentId
    const {
      encryptedData: encryptedStudentID,
      iv: studentIdIv,
      authTag: studentIdAuthTag,
    } = encryptData(studentId);

    // Step 11: Hash password securely
    const hashedPassword = await argon2.hash(input.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 4,
      parallelism: 2,
      hashLength: 32,
    });

    // Step 12: Create the user in the database
    await UserModel.create({
      // name
      name: encryptedName,
      nameIv: nameIV,
      nameAuthTag: nameAuthTag,
      // email
      email: encryptedEmail,
      emailIv: emailIV,
      emailAuthTag: emailAuthTag,
      emailHash: emailHash,
      // studentId
      studentId: encryptedStudentID,
      studentIdIv: studentIdIv,
      studentIdAuthTag: studentIdAuthTag,
      // password
      password: hashedPassword,
    });

    // Step 13: Return success message
    return { message: "User created successfully" };
  } catch (error) {
    console.error("Error in createUser:", error); // Алдааг логлох
    // Handle known GraphQL errors
    if (error instanceof GraphQLError) {
      throw error;
    }

    const message = (error as Error).message;

    // Handle unexpected errors
    throw new GraphQLError(
      `Unexpected error: ${message || "Unknown error occurred"}`,
      {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      },
    );
  }
};
