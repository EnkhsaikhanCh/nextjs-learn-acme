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
import { ListChecks, Loader } from "lucide-react";

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

  // Тухайн хэрэглэгчийн сүүлийн төлбөрийг авах
  const {
    data: existingPaymentData,
    loading: paymentLoading,
    error: paymentError,
    refetch: refetchExistingPayment,
  } = useGetPaymentByUserAndCourseQuery({
    variables: { userId: user._id, courseId: course._id },
    skip: !user?._id || !course?._id,
    fetchPolicy: "network-only",
  });

  const existingPayment =
    existingPaymentData?.getPaymentByUserAndCourse || null;

  const hasPendingPayment =
    existingPayment && existingPayment.status === "PENDING";

  const validPayment = hasPendingPayment ? existingPayment : null;

  const handleCreatePayment = async () => {
    if (!user.studentId || !course.courseCode) {
      toast.error("Хэрэглэгч эсвэл хичээлийн мэдээлэл дутуу байна");
      return;
    }

    if (validPayment) {
      toast.warning("Та аль хэдийн төлбөр төлсөн байна.");
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
        await refetchExistingPayment();

        await fetch("/api/email/admin/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId: data.createPayment._id,
            userEmail: user.email,
            courseTitle: course.title,
            transactionNote: transactionNote,
          }),
        });

        toast.success("Төлбөрийн хүсэлт амжилттай үүслээ!");
      }
    } catch (error) {
      console.error("Create payment error: ", error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentLoading) {
    return (
      <div className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 bg-gray-100 py-1 text-center text-sm font-semibold text-gray-500">
        <p>Төлбөрийн мэдээлэл ачаалж байна...</p>
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (validPayment) {
    return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              Шалгах
              <ListChecks />
            </Button>
          </DialogTrigger>
          <PaymentVerification
            payment={validPayment as Payment}
            isLoading={paymentLoading}
            error={paymentError}
          />
        </Dialog>
      </>
    );
  }

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
      <PaymentInformation
        user={user}
        course={course}
        handleCreatePayment={handleCreatePayment}
        isSubmitting={isSubmitting}
      />
    </Dialog>
  );
}
