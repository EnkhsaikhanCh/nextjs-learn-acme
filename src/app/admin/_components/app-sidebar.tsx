import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  ChevronUp,
  CircleDollarSign,
  CircleUserRound,
  FileText,
  GalleryVerticalEnd,
  LogOut,
  Settings,
  Shield,
  SquareChartGantt,
  SquareUser,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

export function AppSidebar({ username }: { username: string }) {
  const [loading, setLoading] = useState(false);
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "v0.0.0";
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Documentation</span>
                  <span className="">v{version}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`cursor-pointer ${pathname === item.url ? "font-semibold" : ""}`}
                >
                  <SidebarMenuButton asChild>
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

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu className="rounded-md border bg-white">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <CircleUserRound /> {username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <SquareUser />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    setLoading(true);
                    await signOut({ callbackUrl: "/login" });
                    setLoading(false);
                  }}
                >
                  <LogOut />
                  {loading ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
