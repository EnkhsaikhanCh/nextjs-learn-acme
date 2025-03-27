import { SubscribeForm } from "@/components/SubscribeForm";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <main className="container flex flex-1 flex-col items-center justify-center px-6 py-28 md:py-48">
        <div className="flex w-full flex-col items-center space-y-16">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Coming Soon
            </h1>
          </div>
          <div className="w-full max-w-md">
            <SubscribeForm />
          </div>
          <div className="grid w-full max-w-md justify-center gap-2 text-gray-700 sm:grid-cols-2">
            <Link href={"#"} className="w-full">
              <Button variant={"secondary"} className="w-full rounded-full">
                <Facebook className="mr-2 h-4 w-4 text-blue-500" />
                @nomadtech.tips
              </Button>
            </Link>
            <Link href={"#"} className="w-full">
              <Button variant={"secondary"} className="w-full rounded-full">
                <Instagram className="mr-2 h-4 w-4 text-[#E1306C]" />
                @nomadtech.tips
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="flex w-full flex-col items-center py-10">
        <div className="container flex flex-col items-center justify-center space-y-8 px-6">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Nomadtech
          </p>
        </div>
      </footer>
    </div>
  );
}
