import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Bell,
  BookOpenText,
  BookUser,
  CircleDollarSign,
  FileText,
  Globe,
  Settings,
  Shield,
  SquareChartGantt,
} from "lucide-react";
import Link from "next/link";
import { AdminNavUser } from "./AdminNavUser";

const items = [
  {
    title: "Dashboard Overview",
    url: "/admin",
    icon: SquareChartGantt,
  },
  {
    title: "User Management ",
    url: "/admin/user-management",
    icon: BookUser,
  },
  {
    title: "Course Management",
    url: "/admin/course-management",
    icon: BookOpenText,
  },
  {
    title: "Payment Management",
    url: "/admin/payment-management",
    icon: CircleDollarSign,
  },
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Admin Management",
    url: "/admin/admin-management",
    icon: Shield,
  },
  {
    title: "System Settings",
    url: "/admin/system-settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Globe className="h-5 w-5" />
                <span className="text-base font-semibold">Acme</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
