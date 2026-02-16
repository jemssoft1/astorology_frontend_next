import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL; // e.g., "http://localhost:5000"

export async function GET(req: NextRequest) {
  // Check if backend URL is configured
  if (!BASE_URL) {
    console.error("❌ BACKEND_URL is not defined in environment variables");
    return NextResponse.json(
      {
        success: false,
        message: "Server configuration error",
      },
      { status: 500 },
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const type = searchParams.get("type") || "current"; // current, previous, next

    // Build backend URL based on type
    let backendPath = "/api/calendar";
    let queryParams = new URLSearchParams();

    // Add month and year if provided
    if (month) queryParams.append("month", month);
    if (year) queryParams.append("year", year);

    // Handle different types (previous/next have different paths in your backend)
    switch (type) {
      case "previous":
        backendPath = "/api/calendar/previous";
        break;
      case "next":
        backendPath = "/api/calendar/next";
        break;
      case "current":
      default:
        backendPath = "/api/calendar";
        break;
    }

    // Build full URL
    const queryString = queryParams.toString();
    const backendUrl = `${BASE_URL}${backendPath}${queryString ? `?${queryString}` : ""}`;

    // Get auth header if present
    const authHeader = req.headers.get("authorization");

    // Call external backend
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      // Cache settings (optional)
      // cache: "no-store", // For dynamic data
      // next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    // Handle backend error
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Backend error (${response.status}):`, errorText);

      return NextResponse.json(
        {
          success: false,
          message: "Backend request failed",
          backendStatus: response.status,
          error: errorText,
        },
        { status: response.status },
      );
    }

    // Success - return backend response
    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ PROXY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
