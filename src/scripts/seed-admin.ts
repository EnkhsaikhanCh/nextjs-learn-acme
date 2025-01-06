import argon2 from "argon2";
import { UserModel } from "../app/api/graphql/models/user.model";
import { connectToDatabase } from "../lib/mongodb";
import dotenv from "dotenv";
dotenv.config();

const seedAdmin = async () => {
  await connectToDatabase();

  const { ADMIN_EMAIL, ADMIN_PASSWORD, STUDENT_ID } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !STUDENT_ID) {
    console.log("Missing admin credentials in environment variables");
    process.exit(1);
  }

  try {
    const existingAdmin = await UserModel.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
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
    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

seedAdmin();
