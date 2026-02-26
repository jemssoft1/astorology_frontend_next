import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isDev = process.env.NODE_ENV === "development";

// Pages that do NOT require the session cookie (public routes)
const PUBLIC_PATHS = ["/auth-callback", "/no-access"];

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname, search } = request.nextUrl;
  const method = request.method;
  const url = `${pathname}${search}`;

  // Log incoming request
  console.info(`📥 [${method}] ${url}`);

  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    console.info(`🔐 Auth: Present`);
  }

  // ─── PAGE ROUTE GUARD ────────────────────────────────────────────────────────
  // If it's NOT an API route and NOT a public path, verify the session cookie.
  const isApiRoute = pathname.startsWith("/api/");
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!isApiRoute && !isPublicPath) {
    const sessionCookie = request.cookies.get("domain_b_session")?.value;

    if (!sessionCookie) {
      console.warn(
        `🚫 [ACCESS DENIED] No session cookie — Redirecting: ${pathname}`,
      );
      const noAccessUrl = new URL("/no-access", request.url);
      noAccessUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(noAccessUrl);
    }
  }

  // ─── API ROUTE GUARD (Production only) ──────────────────────────────────────
  if (isApiRoute && !isDev) {
    const authToken = request.cookies.get("authToken")?.value;

    if (!authToken) {
      console.warn(`🚫 [PRODUCTION] Blocked: ${pathname} — No auth token`);
      return NextResponse.json(
        {
          success: false,
          status: "Fail",
          error: "Access Denied",
          message: "You must have a premium subscription to access this API.",
          code: "UPGRADE_REQUIRED",
        },
        { status: 403 },
      );
    }
  }

  try {
    const response = NextResponse.next();
    const duration = Date.now() - startTime;
    console.info(`✅ [${method}] ${url} - ${duration}ms`);
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [${method}] ${url} - ${duration}ms`);
    console.error("Error:", error instanceof Error ? error.message : error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal middleware error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Run middleware on all page routes AND all API routes
export const config = {
  matcher: [
    // All pages except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|fonts|icons|images).*)",
  ],
};
