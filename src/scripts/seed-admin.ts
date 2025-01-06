import argon2 from "argon2";
import { UserModel } from "../app/api/graphql/models/user.model";
import { connectToDatabase } from "../lib/mongodb";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";
dotenv.config();

const seedAdmin = async () => {
  await connectToDatabase();

  const { ADMIN_EMAIL, ADMIN_PASSWORD, STUDENT_ID } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !STUDENT_ID) {
    throw new GraphQLError(
      "Missing admin credentials in environment variables",
      {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      },
    );
  }

  try {
    const existingAdmin = await UserModel.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      throw new GraphQLError("Admin already exists!", {
        extensions: {
          code: "CONFLICT",
        },
      });
    }

    const hashedAdminPassword = await argon2.hash(ADMIN_PASSWORD, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 4,
      parallelism: 2,
      hashLength: 32,
    });

    const admin = new UserModel({
      email: ADMIN_EMAIL,
      studentId: STUDENT_ID,
      role: "admin",
      password: hashedAdminPassword,
    });

    await admin.save();

    return {
      success: true,
      message: "Admin user created successfully!",
    };
  } catch (error) {
    console.error("Error creating admin:", error);

    if (error instanceof GraphQLError) {
      throw error;
    }

    const message = (error as Error).message;

    throw new GraphQLError("Failed to create admin user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        originalError: message,
      },
    });
  }
};

seedAdmin()
  .then((result) => {
    console.log("Result:", result);
  })
  .catch((err) => {
    console.error("Unhandled error:", err);
  });
