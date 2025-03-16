import { Loader } from "lucide-react";

export const CardLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <Loader className="h-8 w-8 animate-spin text-purple-600" />
      <p className="text-sm text-gray-500">
        Бид таны хүсэлтийн шалгаж байна, та түр хүлээнэ үү...
      </p>
    </div>
  );
};
