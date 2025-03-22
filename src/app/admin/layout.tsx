import React from "react";
import { Toaster } from "sonner";
import { AppSidebar } from "@/app/admin/_components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSiteHeader } from "./_components/AdminSiteHeader";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage users, courses, payments, and settings",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminSiteHeader />
        <Toaster richColors position="top-center" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
