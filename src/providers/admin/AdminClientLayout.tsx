"use client";

import { AppSidebar } from "@/app/admin/_components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminClientLayout({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar username={session.user?.email} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 p-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
