"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
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
import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function PaymentDialog({ user, course }: { user: any; course: any }) {
  const [createPayment] = useCreatePaymentMutation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
  };

  const handleCreatePayment = async () => {
    setIsSubmitting(true);
    try {
      await createPayment({
        variables: {
          input: {
            userId: user._id,
            courseId: course._id,
            amount: course.price,
            paymentMethod: PaymentMethod.BankTransfer,
            transactionNote: `${user.studentId}-${course.courseCode}`,
          },
        },
      });

      toast.success(
        "Таны хүсэлтийг хүлээн авлаа. Бид шалгаад хариу өгөх болно.",
      );
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
          {/* Bank */}
          <div>
            <span className="font-semibold text-gray-700">Банк:</span>
            <div className="mt-1 flex items-center justify-between rounded-md border border-stone-300 bg-stone-100 p-2 px-3 shadow-sm">
              <span className="font-medium text-gray-900">ХААН БАНК</span>
            </div>
          </div>

          {/* Bank Account Number */}
          <div>
            <span className="font-semibold text-gray-700">Дансны дугаар:</span>
            <div className="mt-1 flex items-center justify-between rounded-md border border-stone-300 bg-stone-100 p-2 px-3 shadow-sm">
              <span className="font-medium text-gray-900">5000-4000-3000</span>
              <Button
                size="icon"
                variant="ghost"
                className={`h-[20px] w-[20px] transition-colors ${
                  copiedField === "account"
                    ? "text-green-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => handleCopy("5000-4000-3000", "account")}
              >
                {copiedField === "account" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Account Name */}
          <div>
            <span className="font-semibold text-gray-700">Дансны нэр:</span>
            <div className="mt-1 flex items-center justify-between rounded-md border border-stone-300 bg-stone-100 p-2 px-3 shadow-sm">
              <span className="font-medium text-gray-900">ABC Company LLC</span>
            </div>
          </div>

          {/* Course Price */}
          <div>
            <span className="font-semibold text-gray-700">Хичээлийн үнэ:</span>
            <div className="mt-1 flex items-center justify-between rounded-md border border-stone-300 bg-stone-100 p-2 px-3 shadow-sm">
              <span className="font-medium text-gray-900">
                ₮{course.price.toLocaleString()}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className={`h-[20px] w-[20px] transition-colors ${
                  copiedField === "price"
                    ? "text-green-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => handleCopy(course.price.toString(), "price")}
              >
                {copiedField === "price" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Transaction Reference */}
          <div>
            <span className="font-semibold text-gray-700">
              Гүйлгээний утга:
            </span>
            <div className="mt-1 flex items-center justify-between rounded-md border border-stone-300 bg-stone-100 p-2 px-3 shadow-sm">
              <span className="font-medium text-gray-900">
                {user.studentId}-{course.courseCode}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className={`h-[20px] w-[20px] transition-colors ${
                  copiedField === "reference"
                    ? "text-green-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() =>
                  handleCopy(
                    `${user.studentId}-${course.courseCode}`,
                    "reference",
                  )
                }
              >
                {copiedField === "reference" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            size="lg"
            onClick={handleCreatePayment}
            disabled={isSubmitting}
            className="w-full rounded-full font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                {/* Баталгаажуулж байна... */}
              </>
            ) : (
              "Би төлбөрөө хийсэн"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
