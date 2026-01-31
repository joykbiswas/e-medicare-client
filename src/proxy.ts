import { NextRequest, NextResponse } from "next/server";
import { Role } from "./constants/roles";
import { userService } from "./services/user.services";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Dashboard routes (admin/seller only)
  const dashboardRoutes = [
    "/dashboard",
    "/admin",
    "/seller",
    "/admin-dashboard",
    "/seller-dashboard",
    "/customer-dashboard",
  ];
  const isDashboardRoute = dashboardRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Only protect dashboard routes
  if (isDashboardRoute) {
    // Get user info from token
    const { data: userInfo, error } = await userService.getUserFromToken();

    // If no user info, redirect to login
    if (!userInfo || error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if user has a role
    if (!userInfo.role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Determine user role
    const isAdmin = userInfo.role === Role.admin || userInfo.role === "ADMIN";
    const isSeller = userInfo.role === Role.seller || userInfo.role === "SELLER";
    const isCustomer = userInfo.role === Role.customer || userInfo.role === "CUSTOMER";

    //* Customer should NOT access any dashboard routes - redirect to home
    if (isCustomer) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    //* Admin can only visit /admin routes
    if (isAdmin) {
      if (
        pathname.startsWith("/seller") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/seller-dashboard") ||
        pathname.startsWith("/customer-dashboard")
      ) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    //* Seller can only visit /seller routes
    if (isSeller) {
      if (
        pathname.startsWith("/admin") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/admin-dashboard") ||
        pathname.startsWith("/customer-dashboard")
      ) {
        return NextResponse.redirect(new URL("/seller-dashboard", request.url));
      }
    }
  }

  // Customer routes (/cart, /checkout, /orders, /profile) are now public
  // No protection needed - anyone can access them

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only protect dashboard routes
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/seller",
    "/seller/:path*",
    "/admin-dashboard",
    "/admin-dashboard/:path*",
    "/seller-dashboard",
    "/seller-dashboard/:path*",
    "/customer-dashboard",
    "/customer-dashboard/:path*",
  ],
};