import {
  UpdateInstructorPayoutInfoInput,
  UpdateUserV2Response,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { InstructorUserV2 } from "../../../models";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";

export const updateInstructorPayoutInfo = async (
  _: unknown,
  { input }: { input: UpdateInstructorPayoutInfoInput },
  context: { user?: UserV2 },
): Promise<UpdateUserV2Response> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Instructor]);

  try {
    const existingInstructor = await InstructorUserV2.findById(user?._id);
    if (!existingInstructor) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const fields: (keyof UpdateInstructorPayoutInfoInput)[] = [
      "accountHolderName",
      "accountNumber",
      "bankName",
      "payoutMethod",
    ];

    for (const field of fields) {
      if (input[field] !== undefined) {
        existingInstructor.payout = existingInstructor.payout || {};
        existingInstructor.payout[field] = input[field];
      }
    }

    await existingInstructor.save();

    return {
      success: true,
      message: "Payout info updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal error: " + (error as Error).message,
    };
  }
};
