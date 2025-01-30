// src/app/error.tsx
"use client";
import { useEffect } from "react";
import ErrorFallback from "@/components/ErrorFallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Алдаа гарлаа:", error);
  }, [error]);

  return <ErrorFallback error={error} reset={reset} />;
}
