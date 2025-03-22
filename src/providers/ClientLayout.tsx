"use client";

import { AppSidebar } from "@/components/dashboard/sidebar/AppSidebar";
import { SiteHeader } from "@/components/dashboard/sidebar/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { Toaster } from "sonner";

export default function ClientLayout({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  const { data: session } = useSession();

  return (
    <SidebarProvider defaultChecked={defaultOpen}>
      <AppSidebar email={session?.user?.email} />
      <SidebarInset>
        <SiteHeader />
        <Toaster richColors position={"top-center"} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
