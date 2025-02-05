"use client";

import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ReceiptText, Users, TestTubes, BookOpen } from "lucide-react";
import Link from "next/link";

export function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/courses", label: "Бүх сургалт", icon: BookOpen },
    { href: "/dashboard/invoices", label: "Invoices", icon: ReceiptText },
    { href: "/dashboard/costumers", label: "Costumers", icon: Users },
    { href: "/dashboard/testpage", label: "test-page", icon: TestTubes },
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
                    ? "rounded-md border bg-[#F4F4F5] font-semibold"
                    : "rounded-md border border-[#FAFAFA] font-semibold hover:border-[#E5E5E5]"
                }
              >
                <SidebarMenuButton
                  asChild
                  data-testid={`sidebar-menu-button ${link.label}`}
                >
                  <Link href={link.href} className="cursor-pointer">
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
