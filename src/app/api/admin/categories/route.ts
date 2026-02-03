import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://e-medicare-server.vercel.app/api";

export async function GET(request: NextRequest) {
  try {
    // Forward cookies from the client request
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(`${API_BASE}/admin/categories`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    const data = await response.json();

    // Forward Set-Cookie headers from the backend
    const setCookieHeaders = response.headers.getSetCookie();
    const nextResponse = NextResponse.json(data);

    setCookieHeaders.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(`${API_BASE}/admin/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Forward Set-Cookie headers from the backend
    const setCookieHeaders = response.headers.getSetCookie();
    const nextResponse = NextResponse.json(data);

    setCookieHeaders.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
