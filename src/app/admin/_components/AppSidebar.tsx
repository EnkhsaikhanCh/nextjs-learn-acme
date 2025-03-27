"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Bell,
  BookOpenText,
  BookUser,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Globe,
  Settings,
  Shield,
  SquareChartGantt,
} from "lucide-react";
import { AdminNavUser } from "./AdminNavUser";
import { AdminNavSecondary } from "./AdminNavSecondary";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils"; // Assuming you have a classNames utility

const items = [
  {
    title: "Dashboard Overview",
    url: "/admin",
    icon: SquareChartGantt,
  },
  {
    title: "User Management",
    url: "/admin/user-management",
    icon: BookUser,
    items: [
      { title: "Users", url: "/admin/user-management" },
      { title: "Subsribers", url: "/admin/user-management/subsribers" },
    ],
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
  const pathname = usePathname();
  const isActive = (url: string) => pathname?.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/">
                <Globe className="h-5 w-5" />
                <span className="text-base font-semibold">Acme</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.items ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isActive(item.url)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon className="shrink-0" />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem
                              key={`${item.title}-${subItem.title}`}
                            >
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "hover:bg-muted",
                        isActive(item.url) && "bg-muted text-foreground",
                      )}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon className="shrink-0" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <AdminNavSecondary />
        <AdminNavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
