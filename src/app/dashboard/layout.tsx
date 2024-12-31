import { SideNav } from "@/components/dashboard/sidebar/SideNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultChecked={defaultOpen}>
      <SideNav />
      <main className="p-3 md:p-6">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
