import { GraphQLError } from "graphql";
import { EnrollmentModel, PaymentModel } from "../../../models";
import { createEnrollment } from "../enrollment/create-enrollment";

export const updatePaymentStatus = async (
  _: unknown,
  {
    _id,
    status,
    refundReason,
  }: {
    _id: string;
    status: "PENDING" | "APPROVED" | "FAILED" | "REFUNDED";
    refundReason?: string;
  },
) => {
  if (!_id) {
    throw new GraphQLError("Payment ID is required", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  try {
    const payment = await PaymentModel.findById(_id);
    if (!payment) {
      throw new GraphQLError("Payment not found", {
        extensions: { code: "PAYMENT_NOT_FOUND" },
      });
    }

    // Шинэчлэхээс өмнөх хуучин статус хадгалах
    const previousStatus = payment.status;

    // Статус шинэчлэх
    payment.status = status;

    // Хэрэв төлбөр `APPROVED` болсон бол, тухайн хэрэглэгчийн enrollment үүсгэх эсвэл сунгах
    if (status === "APPROVED" && previousStatus !== "APPROVED") {
      let enrollment = await EnrollmentModel.findOne({
        userId: payment.userId,
        courseId: payment.courseId,
      });

      if (enrollment) {
        // Хэрэв бүртгэл аль хэдийн байвал хугацааг сунгана
        const now = new Date();
        const currentExpiryDate = enrollment.expiryDate
          ? new Date(enrollment.expiryDate)
          : now;

        const newExpiryDate = new Date(
          Math.max(now.getTime(), currentExpiryDate.getTime()),
        );
        newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);

        enrollment.expiryDate = newExpiryDate;
        enrollment.status = "ACTIVE"; // Хугацаа сунгасан тул `ACTIVE` болгоно.
        await enrollment.save();
      } else {
        // Хэрэв бүртгэл байхгүй бол шинээр Enrollment үүсгэнэ.
        enrollment = await createEnrollment(_, {
          input: { userId: payment.userId, courseId: payment.courseId },
        });

        // Хугацааг 1 сар тохируулах
        const now = new Date();
        now.setMonth(now.getMonth() + 1);
        enrollment.expiryDate = now;
        await enrollment.save();
      }
    }

    // Хэрэв `REFUNDED` бол `refundReason` шаардлагатай
    if (status === "REFUNDED") {
      if (!refundReason) {
        throw new GraphQLError(
          "Refund reason is required when status is REFUNDED",
          {
            extensions: { code: "BAD_USER_INPUT" },
          },
        );
      }
      payment.refundReason = refundReason;
    }

    await payment.save();
    return payment;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError(
      `Internal server error: ${(error as Error).message}`,
      {
        extensions: { code: "INTERNAL_SERVER_ERROR" },
      },
    );
  }
};
