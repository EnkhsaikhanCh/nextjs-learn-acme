"use client";

import { SideNav } from "@/components/dashboard/sidebar/SideNav";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ClientLayout({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>; // Session өгөгдлийг ачаалж байна
  }

  if (!session) {
    router.push("/login"); // Нэвтрээгүй бол нэвтрэх хуудас руу чиглүүлнэ
    return null;
  }

  return (
    <SidebarProvider defaultChecked={defaultOpen}>
      <SideNav email={session.user?.email ?? undefined} />
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
