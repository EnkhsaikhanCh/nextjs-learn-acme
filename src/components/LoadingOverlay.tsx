import { Loader } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
        <Loader className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
      <span className="mt-4 text-center text-xl font-semibold text-gray-700">
        Уншиж байна, та түр хүлээнэ үү...
      </span>
    </div>
  );
}
