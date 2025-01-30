// src/components/ErrorFallback.tsx
"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "./ui/button";

export default function ErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Алдаа гарлаа:", error);
  }, [error]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-red-400 bg-red-100">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <span className="mt-6 text-center text-xl font-semibold text-gray-700">
        Алдаа гарлаа! Та хуудасаа дахин ачаална уу.
      </span>
      <Button
        variant={"outline"}
        onClick={reset}
        className="mt-6 font-semibold"
      >
        Дахин оролдох
        <RotateCw />
      </Button>
    </div>
  );
}
