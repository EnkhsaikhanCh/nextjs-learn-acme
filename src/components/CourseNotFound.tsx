"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, RotateCw } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function CourseNotFound() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRetry = () => {
    setIsLoading(true);
    router.refresh();

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-gray-300 bg-gray-100">
        <AlertCircle className="h-8 w-8 text-gray-500" />
      </div>
      <span className="mt-4 text-center text-xl font-semibold text-gray-700">
        Курс олдсонгүй
      </span>
      <p className="mt-2 text-center text-gray-500">
        Та хуудасаа дахин ачаалж, эсвэл өөр курс сонгоно уу.
      </p>

      <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
        <Button
          onClick={handleRetry}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              Ачааллаж байна...
              <RotateCw className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Дахин оролдох
              <RotateCw className="h-4 w-4" />
            </>
          )}
        </Button>
        <Link href="/dashboard/courses" className="w-full">
          <Button className="flex w-full items-center gap-2" variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Буцах
          </Button>
        </Link>
      </div>
    </div>
  );
}
