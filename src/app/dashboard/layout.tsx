import { cookies } from "next/headers";
import { AppSidebar } from "@/components/dashboard/sidebar/AppSidebar";
import { SiteHeader } from "@/components/dashboard/sidebar/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cn } from "@/lib/utils";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");

  return (
    <div
      className={cn(
        "bg-background overscroll-none font-mono antialiased",
        activeThemeValue ? `theme-${activeThemeValue}` : "",
        isScaled ? "theme-scaled" : "",
      )}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <ActiveThemeProvider initialTheme={"mono-scaled"}>
          <SidebarProvider defaultChecked={defaultOpen}>
            <AppSidebar />
            <SidebarInset>
              <SiteHeader />
              <Toaster richColors position={"top-center"} />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </ActiveThemeProvider>
      </ThemeProvider>
    </div>
  );
}
