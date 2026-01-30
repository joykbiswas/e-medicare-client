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
import { userRoute } from "@/routes/userRoutes"
import { Route } from "@/types"
import { Role } from "@/constants/roles"

export function AppSidebar({
   user, ...props 
  }: {
    user: {role: string} & React.ComponentProps<typeof Sidebar>
  }) {
let routes: Route[] = [];
    switch (user.role) {
      case Role.admin:
        routes = adminRoute;
        break;
      case Role.user:
        routes = userRoute;
        break;
    
      default:
        routes = [];
        break;
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
                    <SidebarMenuButton asChild >
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
