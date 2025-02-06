import { Badge } from "./ui/badge";
import clsx from "clsx";

type InfoRowProps = {
  label: string;
  value: string;
  boldValue?: boolean;
  valueClassName?: string;
  isBadge?: boolean;
};

export function InfoRow({
  label,
  value,
  boldValue,
  valueClassName,
  isBadge = false,
}: InfoRowProps) {
  return (
    <div className="flex justify-between text-sm text-gray-800">
      <span className="font-semibold">{label}</span>
      {isBadge ? (
        <Badge className="border-yellow-600 bg-yellow-200 text-yellow-800 hover:bg-yellow-200">
          {value}
        </Badge>
      ) : (
        <span className={clsx(boldValue && "font-bold", valueClassName)}>
          {value}
        </span>
      )}
    </div>
  );
}
