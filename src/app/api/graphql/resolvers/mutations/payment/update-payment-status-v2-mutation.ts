import {
  EnrollmentV2Status,
  PaymentMutationResponse,
  PaymentStatus,
  UpdatePaymentStatusV2Input,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { EnrollmentV2Model, PaymentModel } from "../../../models";
import { sendEmail } from "@/lib/email";

// ✅ Modular handler for approved payments
const handleApprovedPayment = async (userId: string, courseId: string) => {
  const now = new Date();

  const enrollment = await EnrollmentV2Model.findOne({
    userId: userId,
    courseId: courseId,
  });

  const newExpiryDate = new Date(
    Math.max(now.getTime(), enrollment?.expiryDate?.getTime() || now.getTime()),
  );
  newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);

  if (enrollment) {
    enrollment.expiryDate = newExpiryDate;
    enrollment.status = EnrollmentV2Status.Active;
    await enrollment.save();
  } else {
    await EnrollmentV2Model.create({
      userId: userId,
      courseId: courseId,
      expiryDate: newExpiryDate,
      status: EnrollmentV2Status.Active,
    });
  }
};

// ✅ Main resolver
export const updatePaymentStatusV2 = async (
  _: unknown,
  { input }: { input: UpdatePaymentStatusV2Input },
  context: { user?: UserV2 },
): Promise<PaymentMutationResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Admin]);

  const { paymentId, status } = input;

  if (!paymentId) {
    return { success: false, message: "Payment ID is required" };
  }

  if (!Object.values(PaymentStatus).includes(status)) {
    return { success: false, message: "Invalid payment status" };
  }

  try {
    const payment = await PaymentModel.findById(paymentId)
      .populate({
        path: "courseId",
        model: "Course",
      })
      .populate({
        path: "userId",
        model: "UserV2",
      });
    if (!payment) {
      return {
        success: false,
        message: "Payment not found",
      };
    }

    if (status === PaymentStatus.Approved) {
      await handleApprovedPayment(payment.userId, payment.courseId);

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

      const courseURL = `${baseUrl}/dashboard/course/${payment.courseId.slug}/learn`;

      await sendEmail({
        to: payment.userId.email,
        subject: "Таны төлбөр амжилттай баталгаажлаа!",
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff; color: #333;">
  <!-- Title -->
  <h2 style="text-align: center; font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #222;">
    Төлбөр амжилттай баталгаажлаа!
  </h2>

  <!-- Info Text -->
  <p style="font-size: 16px; text-align: center; margin-bottom: 20px;">
    Сайн байна уу, <strong>${payment.userId.email}</strong>?
  </p>

  <p style="font-size: 15px; text-align: center; margin-bottom: 20px;">
    Та <strong>${payment.courseId.title}</strong> сургалтанд амжилттай бүртгэгдлээ. Одоо та сургалтдаа нэвтрэх боломжтой!
  </p>

  <!-- CTA Button -->
  <div style="text-align: center; margin-top: 24px;">
    <a href="${courseURL}" style="display: inline-block; padding: 12px 24px; background-color: #FACC14; color: black; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 6px;">
      Сургалт руу очих
    </a>
  </div>

  <!-- Expiry Info -->
  <p style="font-size: 14px; text-align: center; margin-top: 20px; color: #666;">
    Бүртгэл 1 сарын хугацаанд хүчинтэй.
  </p>

  <!-- Support -->
  <p style="font-size: 12px; text-align: center; margin-top: 20px; color: #aaa;">
    Хэрэв танд асуудал гарвал <br>
    <a href="mailto:support@yourwebsite.com" style="color: #000000; text-decoration: none; font-weight: 500;">
      support@yourwebsite.com
    </a> хаягаар холбогдоно уу.
  </p>
</div>
      `,
      });
    }

    payment.status = status;
    await payment.save();

    return {
      success: true,
      message: "Payment status updated successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update payment status",
    };
  }
};
