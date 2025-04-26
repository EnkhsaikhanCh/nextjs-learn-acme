import { Loader } from "lucide-react";

export const LoadingScreen = ({ label }: { label: string }) => {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center gap-1.5 text-gray-500">
      <p className="text-sm">{label}</p>
      <Loader className="h-4 w-4 animate-spin" />
    </div>
  );
};
