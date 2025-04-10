import { cookies } from "next/headers";
import { AppSidebar } from "./components/AppSidebar";
import { SiteHeader } from "@/components/dashboard/sidebar/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/providers/theme-provider";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <main className="bg-background overscroll-none font-sans antialiased">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <SidebarProvider defaultChecked={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </main>
  );
}
