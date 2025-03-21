import { EnrollmentModel } from "../../../models";
import { createEnrollment } from "../enrollment";

export async function updateOrCreateEnrollment(
  userId: string,
  courseId: string,
) {
  let enrollment = await EnrollmentModel.findOne({ userId, courseId });
  const currentDate = new Date();

  if (enrollment) {
    const currentExpiryDate = enrollment.expiryDate
      ? new Date(enrollment.expiryDate)
      : currentDate;
    const newExpiryDate = new Date(
      Math.max(currentDate.getTime(), currentExpiryDate.getTime()),
    );
    newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);
    enrollment.expiryDate = newExpiryDate;
    enrollment.status = "ACTIVE";
    await enrollment.save();
    return enrollment;
  } else {
    enrollment = await createEnrollment(null, { input: { userId, courseId } });
    enrollment.expiryDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1),
    );
    await enrollment.save();
    return enrollment;
  }
}
