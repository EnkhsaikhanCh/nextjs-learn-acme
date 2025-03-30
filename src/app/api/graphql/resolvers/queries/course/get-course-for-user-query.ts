import { GraphQLError } from "graphql";
import { User } from "@/generated/graphql";
import { CourseModel, EnrollmentModel } from "../../../models";
import { requireAuthAndRoles } from "@/lib/auth-utils";

/**
 *  - Хэрэглэгчийн төлөв (GUEST, ENROLLED, NOT_ENROLLED, EXPIRED) тодорхойлох
 *  - Тухайн төлвөөс нь хамаараад preview буюу бүрэн контентыг буцаах
 */
export const getCourseForUser = async (
  _: unknown,
  { slug }: { slug: string },
  context: { user?: User },
) => {
  try {
    const { user } = context;
    await requireAuthAndRoles(user, ["STUDENT", "ADMIN"]);

    if (!slug) {
      throw new GraphQLError("Course slug required", {
        extensions: { code: "BAD_USER_INPUT" },
      });
    }

    // 1. Курсийг slug-аар хайх
    const course = await CourseModel.findOne({ slug });
    if (!course) {
      throw new GraphQLError("Course not found", {
        extensions: { code: "COURSE_NOT_FOUND" },
      });
    }

    // 2. Хэрэглэгч нэвтэрсэн бол Enrollment-ийг шалгах
    const enrollment = await EnrollmentModel.findOne({
      courseId: course._id,
      userId: user?._id,
    });

    // 3. Бүртгэлгүй эсвэл EXPIRED => preview (NOT_ENROLLED) буцаана
    if (
      !enrollment ||
      enrollment.status === "EXPIRED" ||
      enrollmentExpired(enrollment.expiryDate)
    ) {
      return {
        status: "NOT_ENROLLED",
        coursePreviewData: await getCoursePreview(course._id),
        fullContent: null,
      };
    }

    // 4. Бүрэн эрхтэй (ENROLLED) => бүхий л контентыг буцаана
    return {
      status: "ENROLLED",
      coursePreviewData: null,
      fullContent: await getFullCourseContent(course._id),
    };
  } catch (error) {
    throw new GraphQLError(
      `Failed to fetch course for user: ${(error as Error).message}`,
      {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      },
    );
  }
};

/**
 * Бүртгэлийн хугацаа дууссан эсэхийг шалгах туслах функц.
 * expiryDate нь CourseModel дээр Date төрлөөр хадгалагдсан гэж үзэв.
 */
function enrollmentExpired(expiryDate: Date | undefined): boolean {
  return !!expiryDate && expiryDate < new Date();
}

//  Танилцуулга болон бусад хураангуй дата (preview) татах
async function getCoursePreview(courseId: string) {
  const previewCourse = await CourseModel.findById(courseId).select(
    "title slug description thumbnail price pricingDetails courseCode difficulty categories tags status whatYouWillLearn whyChooseOurCourse",
  );
  return previewCourse;
}

//  Бүрэн контент (full content) татах
async function getFullCourseContent(courseId: string) {
  const fullCourse = await CourseModel.findById(courseId).populate({
    path: "sectionId",
    model: "Section",
    populate: {
      path: "lessonId",
      model: "Lesson",
    },
  });
  return fullCourse;
}
