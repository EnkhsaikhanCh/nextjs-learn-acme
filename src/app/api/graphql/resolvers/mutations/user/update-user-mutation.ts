// src/app/api/graphql/resolver/mutation/user/update-user-mutation.ts
import { UpdateUserInput, User } from "@/generated/graphql";
import { UserModel } from "../../../models";
import { requireAuthAndRoles } from "@/lib/auth-utils";
import { GraphQLError } from "graphql";

export const updateUser = async (
  _: unknown,
  { input, _id }: { input: UpdateUserInput; _id: string },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["STUDENT", "ADMIN"]);

    const currentUserId = user?._id;

    if (user?.role !== "ADMIN" && currentUserId !== _id) {
      throw new GraphQLError("Та зөвхөн өөрийн мэдээллийг шинэчилэх боломжтой");
    }

    if (input.role && user?.role !== "ADMIN") {
      throw new GraphQLError(
        "Зөвхөн админууд хэрэглэгчийн role-ийг шинэчлэх боломжтой",
      );
    }

    // Админ өөрийн role-ийг өөрчлөхийг хориглох
    if (input.role && user?.role === "ADMIN" && currentUserId === _id) {
      throw new GraphQLError("Админууд өөрийн role-ийг шинэчлэх боломжгүй");
    }

    if (user?.role === "ADMIN" && input.role) {
      const allowedRoles = ["STUDENT", "ADMIN", "INSTRUCTOR"];
      if (!allowedRoles.includes(input.role)) {
        throw new GraphQLError("Хүчингүй role");
      }
    }

    const existingUser = await UserModel.findById(_id);
    if (!existingUser) {
      throw new GraphQLError("Хэрэглэгч олдсонгүй");
    }

    if (input.email && input.email !== existingUser.email) {
      const emailExists = await UserModel.findOne({ email: input.email });
      if (emailExists) {
        throw new GraphQLError("Энд и-мэйл аль хэдийн бүртгэлтэй байна");
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(_id, input, {
      new: true,
    }).select("-password -__v");

    if (!updatedUser) {
      throw new GraphQLError("Хэрэглэгч олдсонгүй");
    }

    return updatedUser;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Хэрэглэгчийг шинэчлэхэд алдаа гарлаа");
  }
};
