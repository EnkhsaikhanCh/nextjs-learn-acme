import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <h1 className="text-8xl font-extrabold text-gray-800">404</h1>

      <h2 className="mt-2 text-2xl font-semibold text-gray-700">
        Уучлаарай, энэ хуудас олдсонгүй.
      </h2>

      <Link href={"/"} className="mt-4">
        <Button
          variant={"outline"}
          className="rounded-full border-2 border-yellow-500 bg-yellow-200 font-bold hover:bg-yellow-300"
        >
          <ArrowLeft />
          Нүүр хуудас руу буцах
        </Button>
      </Link>
    </div>
  );
}
