import { AppSidebar } from "@/components/shared/app-sidebar";
import { ModeToggle } from "@/components/shared/ModeToggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Role } from "@/constants/roles";
import { userService } from "@/services/user.services";
import { redirect } from "next/navigation";
import { User, Mail, Shield, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function DashboardLayout({
  admin,
  customer,
  seller,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  customer: React.ReactNode;
  seller: React.ReactNode;
}) {
  // Get user info from token
  const { data: userInfo, error } = await userService.getUserFromToken();

  // If no user info, redirect to login
  if (!userInfo || error) {
    redirect("/login");
  }

  // Additional safety check for role
  if (!userInfo.role) {
    redirect("/login");
  }

  // Determine role
  const isAdmin = userInfo.role === Role.admin || userInfo.role === "ADMIN";
  const isSeller = userInfo.role === Role.seller || userInfo.role === "SELLER";
  const isCustomer = userInfo.role === Role.customer || userInfo.role === "CUSTOMER";
  
  // Determine which content to show based on role
  let contentToShow: React.ReactNode;
  if (isAdmin) {
    contentToShow = admin;
  } else if (isSeller) {
    contentToShow = seller;
  } else if (isCustomer) {
    contentToShow = customer;
  } else {
    // Default to customer if role is unknown
    contentToShow = customer;
  }

  // Get role display name
  const getRoleDisplay = () => {
    if (isAdmin) return "Admin";
    if (isSeller) return "Seller";
    return "Customer";
  };

  const getRoleIcon = () => {
    if (isAdmin) return Shield;
    if (isSeller) return Store;
    return User;
  };

  const getPanelName = () => {
    if (isAdmin) return "Admin Panel";
    if (isSeller) return "Seller Panel";
    return "Customer Panel";
  };

  const RoleIcon = getRoleIcon();

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {getPanelName()}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* User Info Section */}
          <div className="flex items-center gap-4">
            {/* User Info Display */}
            <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg border bg-card">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userInfo.name || "User"}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {userInfo.email || "No email"}
                  </span>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <Badge 
                variant={isAdmin ? "default" : isSeller ? "secondary" : "outline"}
                className="flex items-center gap-1"
              >
                <RoleIcon className="h-3 w-3" />
                {getRoleDisplay()}
              </Badge>
            </div>
            
            <ModeToggle />
          </div>
        </header>
        
        <div className="flex flex-1 flex-col gap-4 p-4">
          {contentToShow}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}