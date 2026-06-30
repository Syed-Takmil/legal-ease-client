


// src/proxy.js (or middleware.js depending on your file name)

import { NextResponse } from "next/server";
import { auth } from "./app/lib/auth"; // adjust path if needed

// CHANGED: Renamed from middleware to proxy
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Get the real session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user;
  const role = user?.role; // Comes from MongoDB

  // ===============================
  // 1. Protect login/register pages
  // ===============================
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (user) {
      const dashboard = role === "lawyer" ? "/dashboard/lawyer" : "/dashboard/user";
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
    return NextResponse.next();
  }

  // ===============================
  // 2. Protect all dashboard routes
  // ===============================
  if (pathname.startsWith("/dashboard")) {
    // Not logged in? Go to login
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // User trying to access lawyer dashboard?
    if (pathname.startsWith("/dashboard/lawyer") && role !== "lawyer") {
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }

    // Lawyer trying to access user dashboard?
    if (pathname.startsWith("/dashboard/user") && role !== "user") {
      return NextResponse.redirect(new URL("/dashboard/lawyer", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};