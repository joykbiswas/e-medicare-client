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
import { customerRoute } from "@/routes/customerRoutes"
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
  
  // Map roles to routes
  if (user.role === Role.admin || user.role === "ADMIN") {
    routes = adminRoute;
  } else if (user.role === Role.seller || user.role === "SELLER") {
    routes = sellerRoute;
  } else if (user.role === Role.customer || user.role === "CUSTOMER") {
    routes = customerRoute;
  } else {
    // Default to customer routes
    routes = customerRoute;
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