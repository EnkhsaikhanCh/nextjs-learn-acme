import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Payment,
  PaymentStatus,
  useUpdatePaymentStatusMutation,
} from "@/generated/graphql";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { InfoItem } from "./InfoItem";

const PAYMENT_STATUS_OPTIONS: { label: string; value: PaymentStatus }[] = [
  { label: "Хүлээгдэж байна", value: PaymentStatus.Pending },
  { label: "Зөвшөөрөгдсөн", value: PaymentStatus.Approved },
  { label: "Амжилтгүй", value: PaymentStatus.Failed },
  { label: "Буцаалт хийгдсэн", value: PaymentStatus.Refunded },
];

interface UpdatePaymentStatusProps {
  payment: Payment;
  paymentId: string;
  currentStatus: PaymentStatus;
  currentRefundReason: string;
  refetch: () => void;
}

export const UpdatePaymentStatus: React.FC<UpdatePaymentStatusProps> = ({
  payment,
  paymentId,
  currentStatus,
  currentRefundReason,
  refetch,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>(currentStatus);
  const [refundReason, setRefundReason] = useState<string>(currentRefundReason);
  const [updatePaymentStatus, { loading, error }] =
    useUpdatePaymentStatusMutation();

  const handleSendEmail = async (paymentId: string) => {
    try {
      const response = await fetch("/api/payment/send-confirmation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Имэйл амжилттай илгээгдлээ!");
      } else {
        toast.error(`Имэйл илгээхэд алдаа гарлаа: ${data.error}`);
      }
    } catch (error) {
      console.error("Имэйл илгээхэд алдаа гарлаа:", error);
      toast.error("Имэйл илгээхэд алдаа гарлаа.");
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePaymentStatus({
        variables: {
          id: paymentId,
          status: newStatus as PaymentStatus,
          refundReason: newStatus === "REFUNDED" ? refundReason : null,
        },
      });

      refetch();
      toast.success("Төлбөрийн төлөв амжилттай шинэчлэгдлээ!");

      if (newStatus === "APPROVED") {
        await handleSendEmail(paymentId); // Имэйл илгээх
      }

      setIsOpen(false);
    } catch (error) {
      toast.error(`Алдаа гарлаа. Дахин оролдоно уу. ${error}`);
      console.error("Төлөв шинэчлэхэд алдаа гарлаа:", error);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-600"
        onClick={() => setIsOpen(true)}
      >
        Шинэчлэх
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Төлбөрийн төлөв шинэчлэх</DialogTitle>
            <DialogDescription>Шинэ төлөвийг сонгоно уу.</DialogDescription>
          </DialogHeader>
          {/* Payment details in a clean, minimal layout */}
          <div className="rounded-md border bg-gray-50 p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem label="User Email" value={payment.userId.email} />

              <InfoItem label="Course Title" value={payment.courseId.title} />
              <InfoItem label="Amount" value={`₮ ${payment.amount}`} />
              <InfoItem label="Payment Method" value={payment.paymentMethod} />

              <InfoItem
                label="Transaction Note"
                value={payment.transactionNote}
                isBadge={true}
              />

              {/* Status with Badge */}
              <InfoItem label="Status" value={payment.status} isBadge={true} />
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-3">
            <Select
              value={newStatus}
              onValueChange={(value) => setNewStatus(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Төлөв сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PAYMENT_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* REFUNDED сонгосон үед л refundReason оролт гарч ирнэ */}
          {newStatus === "REFUNDED" && (
            <div>
              <Label
                htmlFor="refundReason"
                className="mb-1 text-sm font-semibold"
              >
                Буцаалтын шалтгаан
              </Label>
              <Textarea
                id="refundReason"
                placeholder="Буцаалтын шалтгааныг оруулна уу..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
            </div>
          )}

          {/* Actions */}
          <div className="pt-2">
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full font-semibold"
            >
              {loading ? <Loader className="animate-spin" /> : "Шинэчлэх"}
            </Button>

            {error && (
              <p className="mt-2 text-sm text-red-600">
                Шинэчлэхэд алдаа гарлаа.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
