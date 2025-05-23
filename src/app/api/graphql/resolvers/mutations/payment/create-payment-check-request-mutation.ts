import {
  CreatePaymentCheckRequest,
  PaymentMethod,
  PaymentMutationResponse,
  PaymentStatus,
  UserV2,
  UserV2Role,
} from "@/generated/graphql";
import { requireAuthAndRolesV2 } from "@/lib/auth-userV2-utils";
import { CourseModel, PaymentModel } from "../../../models";
import { sendEmail } from "@/lib/email";

export const createPaymentCheckRequest = async (
  _: unknown,
  { input }: { input: CreatePaymentCheckRequest },
  context: { user?: UserV2 },
): Promise<PaymentMutationResponse> => {
  const { user } = context;
  await requireAuthAndRolesV2(user, [UserV2Role.Student]);

  const { courseId, amount, transactionNote } = input;

  if (!courseId || !amount || !transactionNote) {
    return {
      success: false,
      message: "Missing required fields",
    };
  }

  try {
    const existingCourse = await CourseModel.findById(courseId);
    if (!existingCourse) {
      return {
        success: false,
        message: "Course not found",
      };
    }

    const existingPayment = await PaymentModel.findOne({
      userId: user?._id,
      courseId: existingCourse._id,
      status: PaymentStatus.Pending,
    });
    if (existingPayment) {
      return {
        success: false,
        message: "Payment check request already exists",
      };
    }

    const payment = new PaymentModel({
      userId: user?._id,
      courseId,
      amount,
      status: PaymentStatus.Pending,
      paymentMethod: PaymentMethod.BankTransfer,
      transactionNote,
    });

    await payment.save();

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const courseURL = `${baseUrl}/admin/payment-management`;

    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@example.com",
      subject: "Төлбөр шалгах хүсэлт ирлээ",
      html: `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 40px auto; padding: 40px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="background: #f0f2f5; width: 48px; height: 48px; border-radius: 10px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
          <svg style="width: 24px; height: 24px; color: #2d3436;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h2 style="color: #1a1a1a; font-size: 20px; font-weight: 600; margin: 0;">
          Төлбөр шалгах хүсэлт
        </h2>
      </div>
    
      <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 16px;">
          <div>
            <div style="font-size: 12px; color: #6c757d; margin-bottom: 4px;">Хэрэглэгч</div>
            <div style="font-size: 14px; color: #2d3436; font-weight: 500;">${user?.email}</div>
          </div>
          <div>
            <div style="font-size: 12px; color: #6c757d; margin-bottom: 4px;">Сургалт</div>
            <div style="font-size: 14px; color: #2d3436; font-weight: 500;">${existingCourse.title}</div>
          </div>
        </div>
        
        <div>
          <div style="font-size: 12px; color: #6c757d; margin-bottom: 4px;">Төлбөрийн утга</div>
          <div style="font-size: 14px; color: #2d3436; font-weight: 500;">${transactionNote}</div>
        </div>
      </div>
    
      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #eceff1;">
        <p style="font-size: 13px; color: #6c757d; line-height: 1.5; margin: 0;">
          Системд нэвтрэн шалгаж баталгаажуулна уу.
        </p>
        <a href="${courseURL}" style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #2d3436; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
          Шалгах
        </a>
      </div>
    </div>
        `,
    });

    return {
      success: true,
      message: "Payment check request created successfully",
    };
  } catch {
    return {
      success: false,
      message: "Internal server error",
    };
  }
};
