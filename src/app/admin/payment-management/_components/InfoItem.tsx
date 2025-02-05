import { Badge } from "@/components/ui/badge";

interface InfoItemProps {
  label: string;
  value?: string;
  isBadge?: boolean;
}

// A small helper component to render a label + value.
export function InfoItem({ label, value, isBadge = false }: InfoItemProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-gray-500">{label}</p>
      {isBadge ? (
        <Badge className={getBadgeColor(value)}>{value || "N/A"}</Badge>
      ) : (
        <p className="text-sm font-semibold text-gray-800">{value || "N/A"}</p>
      )}
    </div>
  );
}

// Function to apply status colors
function getBadgeColor(status?: string) {
  switch (status) {
    case "PENDING":
      return "border-yellow-600 bg-yellow-200 text-yellow-800 hover:bg-yellow-200";
    case "COMPLETED":
      return "border-green-600 bg-green-200 text-green-800 hover:bg-green-200";
    case "FAILED":
      return "border-red-600 bg-red-200 text-red-800 hover:bg-red-200";
    case "REFUNDED":
      return "border-blue-600 bg-blue-200 text-blue-800 hover:bg-blue-200";
    default:
      return "";
  }
}
