import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function CourseNotFound({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-gray-400 bg-gray-100">
        <AlertCircle className="h-8 w-8 text-gray-500" />
      </div>
      <span className="mt-4 text-center text-xl font-semibold text-gray-700">
        Курс олдсонгүй
      </span>
      <p className="mt-2 text-center text-gray-500">
        Та хуудасаа дахин ачаалж, эсвэл өөр курс сонгоно уу.
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          Дахин оролдох
        </Button>
      )}
    </div>
  );
}
