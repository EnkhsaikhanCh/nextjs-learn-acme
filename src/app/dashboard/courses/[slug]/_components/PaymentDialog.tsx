"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Course,
  Payment,
  PaymentMethod,
  useCreatePaymentMutation,
  useGetPaymentByUserAndCourseQuery,
  User,
} from "@/generated/graphql";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentInformation } from "./payment/PaymentInformation";
import { PaymentVerification } from "./payment/PaymentVerification";

export function PaymentDialog({
  user,
  course,
}: {
  user: User;
  course: Course;
}) {
  const [createPayment] = useCreatePaymentMutation();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const transactionNote = `${user.studentId}-${course.courseCode}`;

  // Хэрэглэгч болон курстэй холбоотой төлбөр байгаа эсэхийг шалгах query
  const {
    data: existingPaymentData,
    loading: paymentLoading,
    error: paymentError,
    refetch: refetchExistingPayment,
  } = useGetPaymentByUserAndCourseQuery({
    variables: {
      userId: user._id,
      courseId: course._id,
    },
    skip: !user?._id || !course?._id,
  });

  // Байгаа эсэхийг тодорхойлоход амар болгох
  const existingPayment = existingPaymentData?.getPaymentByUserAndCourse;

  const handleCreatePayment = async () => {
    if (!user.studentId || !course.courseCode) {
      toast.error("Хэрэглэгч эсвэл хичээлийн мэдээлэл дутуу байна");
      return;
    }

    // If user already pressed the button, exit early
    if (existingPayment) {
      toast.warning("Та аль хэдийн хүсэлт илгээсэн байна.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await createPayment({
        variables: {
          input: {
            userId: user._id,
            courseId: course._id,
            amount: course.price?.amount ?? 0,
            paymentMethod: PaymentMethod.BankTransfer,
            transactionNote,
          },
        },
      });

      if (data?.createPayment?._id) {
        toast.success("Төлбөрийн хүсэлт амжилттай үүслээ!");
        // Шинэ төлбөр үүсмэгц дахин fetch хийж, одоо байгаа төлбөрийг (existingPayment) сэргээнэ
        refetchExistingPayment();
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full rounded-full bg-yellow-400 font-bold text-primary hover:bg-yellow-300"
        >
          Сургалтанд бүртгүүлэх
        </Button>
      </DialogTrigger>
      {paymentLoading ? (
        <p>Төлбөрийн мэдээлэл ачаалж байна...</p>
      ) : existingPayment ? (
        // Хэрэв төлбөр аль хэдийн үүссэн байвал Verification хэсэг рүү шууд орох
        <PaymentVerification
          payment={existingPaymentData.getPaymentByUserAndCourse as Payment}
          isLoading={paymentLoading}
          error={paymentError}
        />
      ) : (
        // Төлбөр үүсээгүй бол PaymentInformation хэсгээ харуулах
        <PaymentInformation
          user={user}
          course={course}
          handleCreatePayment={handleCreatePayment}
          isSubmitting={isSubmitting}
        />
      )}
    </Dialog>
  );
}
