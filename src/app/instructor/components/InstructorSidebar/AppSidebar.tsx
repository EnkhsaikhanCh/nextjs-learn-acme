"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { BookOpenText, Globe, House, SquareUser } from "lucide-react";
import { cn } from "@/lib/utils";
import { InstructorNavSecondary } from "./InstructorNavSecondary";
import { InstructorNavUser } from "./InstructorNavUser";

const items = [
  {
    title: "Home",
    url: "/instructor",
    icon: House,
  },
  {
    title: "Courses",
    url: "/instructor/courses",
    icon: BookOpenText,
  },
  {
    title: "Account",
    url: "/instructor/account",
    icon: SquareUser,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (url: string) => pathname?.startsWith(url);
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      {/* Sidebar Header */}
      <SidebarHeader>
        {/*  */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={`bg-sidebar-primary ${open ? "ml-0" : "-ml-2"} text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg`}
              >
                <Globe className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">BOXOD</span>
                <span className="truncate text-xs">Instructor Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <InstructorNavSecondary />
        <InstructorNavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
