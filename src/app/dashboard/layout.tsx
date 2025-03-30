import { cookies } from "next/headers";
import { AppSidebar } from "@/components/dashboard/sidebar/AppSidebar";
import { SiteHeader } from "@/components/dashboard/sidebar/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
// import { ActiveThemeProvider } from "@/components/active-theme";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <div className="bg-background overscroll-none font-sans antialiased">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {/* <ActiveThemeProvider initialTheme={"default"}> */}
        <SidebarProvider defaultChecked={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            <Toaster richColors position={"top-center"} />
            {children}
          </SidebarInset>
        </SidebarProvider>
        {/* </ActiveThemeProvider> */}
      </ThemeProvider>
    </div>
  );
}
