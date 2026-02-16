import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname, search } = request.nextUrl;
  const method = request.method;
  const url = `${pathname}${search}`;

  // Log incoming request
  console.info(`📥 [${method}] ${url}`);

  // Clone the request to read headers if needed
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    console.info(`🔐 Auth: Present`);
  }

  try {
    // Continue with the request
    const response = NextResponse.next();

    // Log response time
    const duration = Date.now() - startTime;
    console.info(`✅ [${method}] ${url} - ${duration}ms`);

    return response;
  } catch (error) {
    // Log errors
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

// Configure middleware to run only on API routes
export const config = {
  matcher: "/api/:path*",
};
