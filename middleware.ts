import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get auth from cookie (mock implementation)
  const authCookie = request.cookies.get("auth-storage");
  
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/about", "/programs", "/contact"];
  
  if (publicRoutes.some(route => pathname === route || pathname.startsWith("/api"))) {
    return NextResponse.next();
  }

  // Protected routes - redirect to login if not authenticated
  // In production, validate the auth token here
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

