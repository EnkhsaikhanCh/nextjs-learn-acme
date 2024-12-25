"use client";

import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, ReceiptText, Users } from "lucide-react";
import Link from "next/link";

export function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/invoices", label: "Invoices", icon: ReceiptText },
    { href: "/dashboard/costumers", label: "Costumers", icon: Users },
  ];

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {links.map((link) => (
              <SidebarMenuItem
                key={link.label}
                className={
                  pathname === link.href
                    ? "bg-[#F4F4F5] font-semibold text-[#18181B]"
                    : "hover:text-[#18181B]"
                }
              >
                <SidebarMenuButton
                  asChild
                  data-testid={`sidebar-menu-button ${link.label}`}
                >
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
