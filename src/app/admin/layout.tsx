import React from "react";
import { AppSidebar } from "@/app/admin/_components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSiteHeader } from "./_components/AdminSiteHeader";
import { ThemeProvider } from "@/providers/theme-provider";
// import { ActiveThemeProvider } from "@/components/active-theme";

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
    <div className="bg-background overscroll-none font-mono antialiased">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {/* <ActiveThemeProvider initialTheme={"default"}> */}
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AdminSiteHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
        {/* </ActiveThemeProvider> */}
      </ThemeProvider>
    </div>
  );
}
