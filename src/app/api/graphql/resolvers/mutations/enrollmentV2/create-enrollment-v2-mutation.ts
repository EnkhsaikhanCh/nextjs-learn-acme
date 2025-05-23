import {
  CreateEnrollmentV2Input,
  EnrollmentV2MutationResponse,
  EnrollmentV2Status,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { EnrollmentV2Model, PaymentModel } from "../../../models";

export const createEnrollmentV2 = async (
  _: unknown,
  { input }: { input: CreateEnrollmentV2Input },
  context: { user?: UserV2 },
): Promise<EnrollmentV2MutationResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Student]);

  const { courseId } = input;
  if (!courseId) {
    return {
      success: false,
      message: "Course ID is required",
    };
  }

  try {
    const existingEnrollment = await EnrollmentV2Model.findOne({
      userId: user?._id,
      courseId,
      status: EnrollmentV2Status.Active,
      isDeleted: false,
    });
    if (existingEnrollment) {
      return {
        success: false,
        message: "User is already enrolled in this course",
      };
    }

    const checkPayment = await PaymentModel.findOne({
      userId: user?._id,
      courseId,
      usedForEnrollment: false,
    });
    if (!checkPayment) {
      return {
        success: false,
        message: "Payment not found or already used for enrollment",
      };
    }

    const enrollment = new EnrollmentV2Model({
      userId: user?._id,
      courseId,
      status: EnrollmentV2Status.Active,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessedAt: new Date(),
      history: [
        {
          status: "ACTIVE",
          progress: 0,
          updatedAt: new Date(),
        },
      ],
    });

    await enrollment.save();

    await PaymentModel.updateOne(
      { _id: checkPayment._id },
      { $set: { usedForEnrollment: true } },
    );

    return {
      success: true,
      message: "Enrollment created successfully",
    };
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return {
      success: false,
      message: "Failed to create enrollment",
    };
  }
};
