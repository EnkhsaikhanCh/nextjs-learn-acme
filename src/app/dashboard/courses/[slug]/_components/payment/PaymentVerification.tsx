import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Payment } from "@/generated/graphql";
import { MailCheck, AlertTriangle, Loader } from "lucide-react";
import clsx from "clsx";
import { ApolloError } from "@apollo/client";
import { InfoRow } from "@/components/InfoRow";
import { format } from "date-fns";

type PaymentVerificationProps = {
  payment?: Payment;
  isLoading?: boolean;
  error?: ApolloError;
};

export function PaymentVerification({
  payment,
  isLoading = false,
  error,
}: PaymentVerificationProps) {
  if (isLoading) {
    return (
      <DialogContent className="flex flex-col items-center p-6 dark:bg-gray-800 dark:text-gray-200">
        <Loader
          className="animate-spin text-gray-500 dark:text-gray-400"
          size={24}
        />
        <p
          className="mt-2 text-sm text-gray-700 dark:text-gray-300"
          aria-live="polite"
        >
          Төлбөрийн мэдээлэл ачааллаж байна...
        </p>
      </DialogContent>
    );
  }

  if (error) {
    return (
      <DialogContent className="flex flex-col items-center p-6 text-center dark:bg-gray-800 dark:text-gray-200">
        <AlertTriangle className="text-red-500 dark:text-red-400" size={36} />
        <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Төлбөрийн мэдээлэл олдсонгүй
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Та дахин шалгана уу эсвэл тусламж дэмжлэгтэй холбогдоно уу.
        </p>
      </DialogContent>
    );
  }

  if (!payment) {
    return (
      <DialogContent className="flex flex-col items-center p-6 text-center dark:bg-gray-800 dark:text-gray-200">
        <AlertTriangle className="text-red-500 dark:text-red-400" size={36} />
        <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Төлбөрийн мэдээлэл олдсонгүй
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Та дахин шалгана уу эсвэл тусламж дэмжлэгтэй холбогдоно уу.
        </p>
      </DialogContent>
    );
  }

  const {
    status,
    amount,
    transactionNote,
    userId,
    courseId,
    createdAt,
    paymentMethod,
  } = payment;

  return (
    <DialogContent className="p-6 dark:bg-gray-800 dark:text-gray-200">
      <div className="flex flex-col items-center justify-center gap-2">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-300 bg-blue-100 dark:border-blue-500 dark:bg-blue-900"
          aria-hidden="true"
        >
          <MailCheck className="text-blue-600 dark:text-blue-400" />
        </div>

        <DialogHeader className="mt-3">
          <DialogTitle className="font-semibold text-gray-900 dark:text-gray-100">
            Таны төлбөрийг шалгаж байна...
          </DialogTitle>
        </DialogHeader>
      </div>

      <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-xs dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
        <InfoRow label="Төлбөрийн дүн" value={`₮${amount}`} />
        <InfoRow
          label="Төлбөрийн төлөв"
          value={
            status === "PENDING"
              ? "Шалгаж байна"
              : status === "APPROVED"
                ? "Зөвшөөрөгдсөн"
                : "Амжилтгүй"
          }
          valueClassName={clsx({
            "text-yellow-500 dark:text-yellow-400": status === "PENDING",
            "text-green-500 dark:text-green-400": status === "APPROVED",
            "text-red-500 dark:text-red-400": status === "FAILED",
          })}
          isBadge={true}
        />
        <InfoRow label="Гүйлгээний утга" value={transactionNote || "Байхгүй"} />
        <InfoRow
          label="И-мэйл хаяг"
          value={userId?.email || "Мэдээлэл байхгүй"}
        />
        <InfoRow
          label="Сургалтын нэр"
          value={courseId?.title || "Мэдээлэл байхгүй"}
        />
        <InfoRow
          label="Төлбөрийн арга"
          value={
            paymentMethod === "BANK_TRANSFER"
              ? "Банкны шилжүүлэг"
              : paymentMethod === "QPAY"
                ? "QPay"
                : paymentMethod === "CREDIT_CARD"
                  ? "Кредит карт"
                  : "Бусад"
          }
        />
        <InfoRow
          label="Хүсэлт илгээсэн огноо"
          value={
            createdAt
              ? format(new Date(Number(createdAt)), "dd-MM-yyyy")
              : "Мэдээлэл байхгүй"
          }
        />
      </div>

      <DialogFooter className="grid rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-700 shadow-xs dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
        <div>Таны төлбөрийг баталгаажуулж байна...</div>
        <span className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Дуусмагц таны бүртгэлтэй и-мэйл хаяг руу мэдэгдэл илгээнэ. Түр хүлээнэ
          үү, баярлалаа!
        </span>
      </DialogFooter>
    </DialogContent>
  );
}
