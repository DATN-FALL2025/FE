import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Role-based route mapping
const ROLE_ROUTES: Record<string, string[]> = {
  ADMIN: ["/admin"],
  ACADEMIC_STAFF_AFFAIR: ["/academic-staff"],
  HEAD_OF_DEPARTMENT: ["/head"],
  TRAINING_DIRECTOR: ["/training-director"],
  TRAINEE: ["/trainees"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/about", "/programs", "/contact", "/terms", "/privacy", "/forgot-password"];
  
  // Allow public routes and API routes
  if (publicRoutes.some(route => pathname === route) || pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Get user data from cookie or header
  const authStorage = request.cookies.get("auth-storage");
  let userRole: string | null = null;

  console.log("🔍 Middleware checking:", pathname);
  console.log("🍪 Auth cookie:", authStorage?.value);

  // Try to get role from localStorage (stored in cookie for SSR)
  if (authStorage) {
    try {
      const authData = JSON.parse(decodeURIComponent(authStorage.value));
      userRole = authData?.state?.user?.role || authData?.state?.user?.roles?.[0]?.roleName;
      console.log("👤 User role from cookie:", userRole);
    } catch (error) {
      console.error("❌ Error parsing auth cookie:", error);
    }
  }

  // If no auth data found, redirect to login
  if (!userRole) {
    console.log("⚠️ No role found, redirecting to login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user's role has access to the requested path
  const allowedPaths = ROLE_ROUTES[userRole];
  
  if (!allowedPaths) {
    console.log("❌ Unknown role:", userRole);
    // Unknown role - redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if current path matches any allowed path for this role
  const hasAccess = allowedPaths.some(allowedPath => pathname.startsWith(allowedPath));

  if (!hasAccess) {
    console.log("🚫 Access denied. Role:", userRole, "Path:", pathname);
    // User trying to access unauthorized route
    // Redirect to their appropriate dashboard
    const redirectPath = allowedPaths[0] + "/dashboard";
    console.log("↪️ Redirecting to:", redirectPath);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  console.log("✅ Access granted");
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

