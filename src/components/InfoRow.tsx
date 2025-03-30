import { Badge } from "./ui/badge";
import clsx from "clsx";

type InfoRowProps = {
  label: string;
  value: string;
  valueClassName?: string;
  isBadge?: boolean;
};

export function InfoRow({
  label,
  value,
  valueClassName,
  isBadge = false,
}: InfoRowProps) {
  return (
    <div className="flex justify-between font-sans text-sm text-gray-800 dark:text-gray-200">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      {isBadge ? (
        <Badge
          className={clsx(
            // Light mode
            "border-yellow-500 bg-yellow-100 text-yellow-900 hover:bg-yellow-200",
            // Dark mode
            "dark:border-yellow-300 dark:bg-yellow-700 dark:text-yellow-100 dark:hover:bg-yellow-600",
          )}
        >
          {value}
        </Badge>
      ) : (
        <span className={clsx("font-bold", valueClassName)}>{value}</span>
      )}
    </div>
  );
}
