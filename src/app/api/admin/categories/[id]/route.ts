import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://e-medicare-server.vercel.app/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const setCookieHeaders = response.headers.getSetCookie();
    const nextResponse = NextResponse.json(data);

    setCookieHeaders.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();

    const setCookieHeaders = response.headers.getSetCookie();
    const nextResponse = NextResponse.json(data);

    setCookieHeaders.forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
