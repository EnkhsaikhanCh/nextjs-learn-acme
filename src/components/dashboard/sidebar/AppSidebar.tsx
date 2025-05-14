"use client";

import { Globe } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../ui/sidebar";
import { NavUser } from "./NavUser";
import { NavMain } from "./NavMain";
import { NavSecondary } from "./NavSecondary";

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent bg-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={`bg-sidebar-primary ${open ? "ml-0" : "-ml-2"} text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg`}
              >
                <Globe className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">BOXOD</span>
                <span className="truncate text-xs">User Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
