"use client";

import * as React from "react";
import { IconBrightness } from "@tabler/icons-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

export function InstructorNavSecondary() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
        <SidebarMenuButton asChild>
          <label>
            <IconBrightness />
            <span>Dark Mode</span>
            {mounted ? (
              <Switch
                className="ml-auto"
                checked={resolvedTheme !== "light"}
                onCheckedChange={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              />
            ) : (
              <Skeleton className="ml-auto h-4 w-8 rounded-full" />
            )}
          </label>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
