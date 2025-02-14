import argon2 from "argon2";
import { UserModel } from "../app/api/graphql/models/user.model";
import { connectToDatabase } from "../lib/mongodb";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";
dotenv.config();

export const seedAdmin = async () => {
  await connectToDatabase();

  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_STUDENT_ID } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_STUDENT_ID) {
    return "Missing admin credentials in environment variables";
  }

  try {
    const existingAdmin = await UserModel.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      return "Admin already exists!";
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
      studentId: ADMIN_STUDENT_ID,
      role: "ADMIN",
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
  .then(() => {
    console.log("Admin user created successfully!");
    process.exit(0); // Амжилттай дуусна
  })
  .catch((err) => {
    console.error("Error creating admin user:", err);
    process.exit(1); // Алдаатай дуусна
  });
