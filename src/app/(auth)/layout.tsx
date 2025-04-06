"use client";

import { Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center gap-6 p-4 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="text-foreground/90 flex items-center gap-2 self-center font-semibold"
        >
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <Globe className="h-4 w-4" />
          </div>
          OXON
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
