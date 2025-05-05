import {
  UpdateCoursePricingInput,
  UpdateCourseResponse,
  UserV2,
} from "@/generated/graphql";
import { CourseModel } from "../../../models";
import { z } from "zod";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";

// Input validation schema
const UpdateCoursePricingV2Schema = z.object({
  planTitle: z.string().min(1, "Plan title is required.").optional(),
  description: z.array(z.string()).optional(),
  amount: z.number().min(0, "Amount must be at least 0.").optional(),
  currency: z.enum(["MNT"]).optional(),
});

export const updateCoursePricingV2 = async (
  _: unknown,
  { courseId, input }: { courseId: string; input: UpdateCoursePricingInput },
  context: { user?: UserV2 },
): Promise<UpdateCourseResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, ["INSTRUCTOR"]);

  // Validate inputs
  const parsed = UpdateCoursePricingV2Schema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0].message,
    };
  }

  try {
    // Validate courseId presence
    if (!courseId) {
      return {
        success: false,
        message: "Course ID is required.",
      };
    }

    // Find course
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return {
        success: false,
        message: "Course not found.",
      };
    }

    // Ownership check
    const isOwner = String(course.createdBy) === String(user?._id);
    if (!isOwner) {
      return {
        success: false,
        message: "Access denied: You are not authorized to update this course.",
      };
    }

    // Apply update
    course.price = {
      planTitle: input.planTitle,
      description: input.description || [],
      amount: input.amount,
      currency: input.currency,
    };

    await course.save();

    return {
      success: true,
      message: "Course pricing successfully updated.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal error: " + (error as Error).message,
    };
  }
};
