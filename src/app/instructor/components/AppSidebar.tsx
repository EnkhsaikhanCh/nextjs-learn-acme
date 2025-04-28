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

      <SidebarFooter>
        <InstructorNavSecondary />
        <InstructorNavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
