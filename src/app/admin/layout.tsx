import React from "react";
import { cookies } from "next/headers";
import AdminClientLayout from "@/providers/admin/AdminClientLayout";
import { Toaster } from "sonner";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage users, courses, payments, and settings",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <AdminClientLayout defaultOpen={defaultOpen}>
      <Toaster richColors position="top-center" />
      {children}
    </AdminClientLayout>
  );
}
