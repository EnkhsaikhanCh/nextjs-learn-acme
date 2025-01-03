import { GraphQLError } from "graphql";
import { UserModel } from "../../../models";
import { RegisterInput } from "../../../schemas/user.schema";
import bcrypt from "bcrypt";

const validationEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validationPassword = (password: string) => {
  return password.length >= 8;
};

export const createUser = async (
  _: unknown,
  { input }: { input: RegisterInput },
) => {
  // 1. use try catch block to handle errors
  try {
    // 2. add validation for email and password
    if (!input.email || !input.password) {
      throw new GraphQLError("Email and password are required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // 3. add validation for email format
    if (!validationEmail(input.email)) {
      throw new GraphQLError("Invalid email format", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // 4. add validation for password length (min 8 characters)
    if (!validationPassword(input.password)) {
      throw new GraphQLError("Password must be at least 8 characters long", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // 5. add validation for unique email
    const existingUser = await UserModel.findOne({ email: input.email });
    if (existingUser) {
      throw new GraphQLError("User with this email already exists", {
        extensions: { code: "CONFLICT" },
      });
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    await UserModel.create({ ...input, password: hashedPassword });

    // 6. return only successful response
    return { message: "User created successfully" };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError(
      "An unexpected error occurred. Please try again later.",
      {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      },
    );
  }
};
