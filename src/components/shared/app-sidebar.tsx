import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { adminRoute } from "@/routes/adminRoutes"
import { sellerRoute } from "@/routes/sellerRoutes"
import { Route } from "@/types"
import { Role } from "@/constants/roles"
import type { UserInfo } from "@/services/user.services"

export function AppSidebar({
  user,
  ...props 
}: {
  user: UserInfo & React.ComponentProps<typeof Sidebar>
}) {
  // Add null check for user and role
  if (!user || !user.role) {
    return null;
  }

  let routes: Route[] = [];
  
  // Only Admin and Seller have dashboard routes
  // Customer routes are public (not in dashboard)
  if (user.role === Role.admin || user.role === "ADMIN") {
    routes = adminRoute;
  } else if (user.role === Role.seller || user.role === "SELLER") {
    routes = sellerRoute;
  } else {
    // Customer should not see sidebar - this shouldn't happen due to redirect
    return null;
  }
  
  return (
    <Sidebar {...props}>
      <SidebarContent>
        {routes.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}