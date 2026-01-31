import { NextRequest, NextResponse } from "next/server";
import { Role } from "./constants/roles";
import { userService } from "./services/user.services";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

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

  //* Admin can only visit admin-dashboard
  if (isAdmin) {
    if (pathname.startsWith("/customer-dashboard") || pathname.startsWith("/seller-dashboard") || pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }
  }

  //* Seller can only visit seller-dashboard
  if (isSeller) {
    if (pathname.startsWith("/admin-dashboard") || pathname.startsWith("/customer-dashboard") || pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/seller-dashboard", request.url));
    }
  }

  //* Customer can only visit customer-dashboard
  if (isCustomer) {
    if (pathname.startsWith("/admin-dashboard") || pathname.startsWith("/seller-dashboard") || pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/customer-dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin-dashboard",
    "/admin-dashboard/:path*",
    "/customer-dashboard",
    "/customer-dashboard/:path*",
    "/seller-dashboard",
    "/seller-dashboard/:path*",
  ],
};