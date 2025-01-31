"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentMethod, useCreatePaymentMutation } from "@/generated/graphql";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CopyableField } from "./CopyableField";

interface User {
  _id: string;
  studentId: string;
}

interface Course {
  _id: string;
  courseCode: string;
  price: number;
}

interface PaymentDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const BANK_DETAILS: PaymentDetails = {
  bankName: "ХААН БАНК",
  accountNumber: "5000-XXXX-XXXX",
  accountName: "ABC",
};

export function PaymentDialog({
  user,
  course,
}: {
  user: User;
  course: Course;
}) {
  const [createPayment] = useCreatePaymentMutation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const transactionNote = `${user.studentId}-${course.courseCode}`;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const paymentKey = `payment_done_${user._id}_${course._id}`;
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState(() => {
    return localStorage.getItem(paymentKey) === "true";
  });

  const handleCreatePayment = async () => {
    if (!user.studentId || !course.courseCode) {
      toast.error("Хэрэглэгч эсвэл хичээлийн мэдээлэл дутуу байна");
      return;
    }

    if (isPaymentSubmitted) {
      toast.warning("Та аль хэдийн хүсэлт илгээсэн байна.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPayment({
        variables: {
          input: {
            userId: user._id,
            courseId: course._id,
            amount: course.price,
            paymentMethod: PaymentMethod.BankTransfer,
            transactionNote,
          },
        },
      });

      toast.success(
        "Таны хүсэлтийг хүлээн авлаа. Төлбөр баталгаажсаны дараа идэвхжих болно.",
      );
      localStorage.setItem(paymentKey, "true");
      setIsPaymentSubmitted(true);
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
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Сургалтанд бүртгүүлэх
          </DialogTitle>
          <DialogDescription>
            Дараах мэдээллийг ашиглан төлбөрөө шилжүүлнэ үү:
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Non-copyable field */}
          <CopyableField
            label="Банк"
            value={BANK_DETAILS.bankName}
            fieldName="bank"
            copiedField={copiedField}
          />

          <CopyableField
            label="Дансны дугаар"
            value={BANK_DETAILS.accountNumber}
            fieldName="account"
            copiedField={copiedField}
            onClick={() => handleCopy(BANK_DETAILS.accountNumber, "account")}
          />

          {/* Non-copyable field */}
          <CopyableField
            label="Дансны нэр"
            value={BANK_DETAILS.accountName}
            fieldName="name"
            copiedField={copiedField}
          />

          <CopyableField
            label="Хичээлийн үнэ"
            value={`₮${course.price.toLocaleString()}`}
            fieldName="price"
            copiedField={copiedField}
            onClick={() => handleCopy(course.price.toString(), "price")}
          />

          <CopyableField
            label="Гүйлгээний утга"
            value={transactionNote}
            fieldName="reference"
            copiedField={copiedField}
            onClick={() => handleCopy(transactionNote, "reference")}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button
            size="lg"
            onClick={handleCreatePayment}
            disabled={isSubmitting}
            className="w-full rounded-full bg-yellow-400 font-bold text-black hover:bg-yellow-300"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : isPaymentSubmitted ? (
              "Хүсэлт илгээгдсэн"
            ) : (
              "Би төлбөрөө хийсэн"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
