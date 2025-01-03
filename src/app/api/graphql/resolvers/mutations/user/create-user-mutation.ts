import { GraphQLError } from "graphql";
import { UserModel } from "../../../models";
import { RegisterInput } from "../../../schemas/user.schema";
import bcrypt from "bcrypt";

// Function to sanitize input by removing unwanted characters
const sanitizeInput = (input: string) => input.replace(/[^\w\s@.-]/g, "");

// Function to validate email format
const validationEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate password strength
const validationPassword = (password: string) => {
  return password.length >= 8;
};

export const createUser = async (
  _: unknown,
  { input }: { input: RegisterInput },
) => {
  try {
    // Step 1: Sanitize inputs
    const sanitizedEmail = sanitizeInput(input.email);
    const sanitizedPassword = sanitizeInput(input.password);

    // Step 2. Validate required fields
    if (!sanitizedEmail || !sanitizedPassword) {
      throw new GraphQLError("Invalid email or password", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Step 3. Validate email format
    if (!validationEmail(sanitizedEmail)) {
      throw new GraphQLError("Invalid email format", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // Step 4. Validate password strength
    if (!validationPassword(sanitizedPassword)) {
      throw new GraphQLError(
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.",
        {
          extensions: { code: "BAD_USER_INPUT" },
        },
      );
    }

    // Step 5: Check for existing user with the same email
    const existingUser = await UserModel.findOne({ email: sanitizedEmail });
    if (existingUser) {
      throw new GraphQLError("Invalid email or password", {
        extensions: { code: "CONFLICT" },
      });
    }

    // Step 6: Hash the password
    const hashedPassword = await bcrypt.hash(sanitizedPassword, 14);

    // Step 7: Create the user in the database
    await UserModel.create({
      ...input,
      email: sanitizedEmail,
      password: hashedPassword,
    });

    // Step 8. Return success message
    return { message: "User created successfully" };
  } catch (error) {
    // Handle known GraphQL errors
    if (error instanceof GraphQLError) {
      throw error;
    }

    // Handle unexpected errors
    throw new GraphQLError(
      "An unexpected error occurred. Please try again later.",
      {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      },
    );
  }
};
