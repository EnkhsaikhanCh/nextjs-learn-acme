import { cookies } from "next/headers";
import { AppSidebar } from "@/components/dashboard/sidebar/AppSidebar";
import { SiteHeader } from "@/components/dashboard/sidebar/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultChecked={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <Toaster richColors position={"top-center"} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
