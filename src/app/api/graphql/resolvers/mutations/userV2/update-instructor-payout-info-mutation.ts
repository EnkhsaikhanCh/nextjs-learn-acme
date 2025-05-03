import {
  BankName,
  PayoutMethod,
  UpdateInstructorPayoutInfoInput,
  UpdateUserV2Response,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { InstructorUserV2 } from "../../../models";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { z } from "zod";

const updateInstructorPayoutInfoSchema = z.object({
  accountHolderName: z
    .string()
    .min(1, { message: "Account holder name is required." })
    .optional(),
  accountNumber: z
    .string({
      required_error: "Account number is required.",
      invalid_type_error: "Account number must be a string of digits.",
    })
    .regex(/^\d+$/, { message: "Account number must contain only digits." })
    .min(10, { message: "Account number must be at least 10 digits long." })
    .max(20, {
      message: "Account number must be at most 20 digits long.",
    })
    .optional(),
  bankName: z.nativeEnum(BankName).optional(),
  payoutMethod: z.nativeEnum(PayoutMethod).optional(),
});

export const updateInstructorPayoutInfo = async (
  _: unknown,
  { input }: { input: UpdateInstructorPayoutInfoInput },
  context: { user?: UserV2 },
): Promise<UpdateUserV2Response> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Instructor]);

  const validation = updateInstructorPayoutInfoSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors[0]?.message,
    };
  }

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
