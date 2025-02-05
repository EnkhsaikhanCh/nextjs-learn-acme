import { Button } from "@/components/ui/button";
import { CircleCheck, Copy } from "lucide-react";

interface CopyableFieldProps {
  label: string;
  value: string;
  fieldName: string;
  copiedField: string | null;
  onClick?: () => void;
}

export const CopyableField = ({
  label,
  value,
  fieldName,
  copiedField,
  onClick,
}: CopyableFieldProps) => {
  return (
    <div>
      <span className="font-semibold text-gray-700">{label}</span>
      <div
        className={`mt-1 flex items-center justify-between rounded-md border p-2 px-3 shadow-sm transition-all ${
          copiedField === fieldName
            ? "border-green-500 bg-green-100 text-green-500"
            : "border-stone-300 bg-stone-100"
        }`}
      >
        <span>{copiedField === fieldName ? "Хуулагдсан" : value}</span>
        {onClick && (
          <Button
            size={"icon"}
            variant={"ghost"}
            aria-label={`Хуулах ${label}`}
            className={`h-[20px] w-[20px] transition-colors ${copiedField === fieldName ? "bg-green-100 text-green-600 hover:bg-green-100" : ""}`}
            onClick={onClick}
          >
            {copiedField === fieldName ? (
              <CircleCheck className="text-green-600" />
            ) : (
              <Copy />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
