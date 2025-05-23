import { CircleCheck, Copy } from "lucide-react";

interface CopyableFieldProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  fieldName: string;
  copiedField: string | null;
  onClick?: () => void;
}

export const CopyableField = ({
  icon,
  label,
  value,
  fieldName,
  copiedField,
  onClick,
}: CopyableFieldProps) => {
  return (
    <div>
      <span className="flex items-center gap-2 font-semibold">
        {icon}
        {label}
      </span>
      <div
        className={`mt-1 flex items-center justify-between rounded-md border p-2 px-3 transition-all ${
          copiedField === fieldName
            ? "border-green-500 bg-green-100 text-green-500 dark:bg-green-700 dark:text-green-200"
            : "dark:bg-sidebar bg-stone-100"
        } ${onClick ? "cursor-pointer" : ""}`} // onClick байхгүй үед курсор заагч байхгүй
        onClick={onClick} // Зөвхөн onClick байгаа үед л хуулна
      >
        <span>{copiedField === fieldName ? "Хуулагдсан" : value}</span>
        {onClick ? ( // Хуулах боломжгүй үед Copy icon байхгүй болно
          copiedField === fieldName ? (
            <CircleCheck className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-gray-500" />
          )
        ) : null}
      </div>
    </div>
  );
};
