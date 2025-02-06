import { useState } from "react";
import { CopyableField } from "../CopyableField";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Course, User } from "@/generated/graphql";
import {
  Banknote,
  CircleUserRound,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  Loader2,
  Tag,
} from "lucide-react";

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

export function PaymentInformation({
  user,
  course,
  handleCreatePayment,
  isSubmitting,
}: {
  user: User;
  course: Course;
  handleCreatePayment: () => void;
  isSubmitting: boolean;
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const transactionNote = `${user.studentId}-${course.courseCode}`;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <>
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
            icon={<Banknote className="h-[18px] w-[18px]" />}
          />

          <CopyableField
            label="Дансны дугаар"
            value={BANK_DETAILS.accountNumber}
            fieldName="account"
            copiedField={copiedField}
            onClick={() => handleCopy(BANK_DETAILS.accountNumber, "account")}
            icon={<CreditCard className="h-[18px] w-[18px]" />}
          />

          {/* Non-copyable field */}
          <CopyableField
            label="Дансны нэр"
            value={BANK_DETAILS.accountName}
            fieldName="name"
            copiedField={copiedField}
            icon={<CircleUserRound className="h-[18px] w-[18px]" />}
          />

          <CopyableField
            label="Хичээлийн үнэ"
            value={`₮${(course.price?.amount ?? 0).toLocaleString()}`}
            fieldName="price"
            copiedField={copiedField}
            onClick={() =>
              handleCopy((course.price?.amount ?? 0).toString(), "price")
            }
            icon={<Tag className="h-[18px] w-[18px]" />}
          />

          <CopyableField
            label="Гүйлгээний утга"
            value={transactionNote}
            fieldName="reference"
            copiedField={copiedField}
            onClick={() => handleCopy(transactionNote, "reference")}
            icon={<ClipboardCheck className="h-[18px] w-[18px]" />}
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
            ) : (
              "Би төлбөрөө хийсэн"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
}
