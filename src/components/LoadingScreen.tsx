import { Loader } from "lucide-react";

export const LoadingScreen = ({ label }: { label: string }) => {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <p className="mr-3 text-lg">{label}</p>
      <Loader className="h-8 w-8 animate-spin" />
    </div>
  );
};
