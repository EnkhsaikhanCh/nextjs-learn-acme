"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Course,
  Payment,
  PaymentMethod,
  useCreatePaymentMutation,
  useGetPaymentByUserAndCourseQuery,
  useGetUserByIdQuery,
  User,
} from "@/generated/graphql";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentInformation } from "./payment/PaymentInformation";
import { PaymentVerification } from "./payment/PaymentVerification";
import { ListChecks, Loader } from "lucide-react";
import { useCachedSession } from "@/hooks/useCachedSession";

export function PaymentDialog({ course }: { course: Course }) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { session } = useCachedSession();
  const userId = session?.user._id;

  const [createPayment] = useCreatePaymentMutation();

  const { data: userData } = useGetUserByIdQuery({
    variables: { id: userId as string },
  });

  const userStudentId = userData?.getUserById.studentId as string;

  const transactionNote = `${userStudentId}-${course.courseCode}`;

  // Тухайн хэрэглэгчийн сүүлийн төлбөрийг авах
  const {
    data: existingPaymentData,
    loading: paymentLoading,
    error: paymentError,
    refetch: refetchExistingPayment,
  } = useGetPaymentByUserAndCourseQuery({
    variables: { userId: userStudentId, courseId: course._id },
    skip: !userId || !course?._id,
    fetchPolicy: "network-only",
  });

  const payment = existingPaymentData?.getPaymentByUserAndCourse;
  const isPending = payment?.status === "PENDING";
  const validPayment = isPending ? payment : null;

  const handleCreatePayment = async () => {
    if (!userStudentId || !course.courseCode) {
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
            userId: userStudentId,
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
            userEmail: userData?.getUserById.email,
            courseTitle: course.title,
            transactionNote: transactionNote,
          }),
        });

        toast.success("Төлбөрийн хүсэлт амжилттай үүслээ!");
      }
    } catch {
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
          className="w-full rounded-full bg-yellow-400 font-bold text-black hover:bg-yellow-300"
        >
          Сургалтанд бүртгүүлэх
        </Button>
      </DialogTrigger>
      <PaymentInformation
        user={userData?.getUserById as User}
        course={course}
        handleCreatePayment={handleCreatePayment}
        isSubmitting={isSubmitting}
      />
    </Dialog>
  );
}
