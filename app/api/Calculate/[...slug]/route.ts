// app/api/Calculate/[...slug]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

async function handler(
  req: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  // Check if BASE_URL is configured
  if (!BASE_URL) {
    console.error("❌ BACKEND_URL is not defined in environment variables");
    return NextResponse.json(
      {
        error: "Server configuration error",
        message: "Backend URL not configured",
      },
      { status: 500 },
    );
  }

  try {
    const { slug } = params;

    // Check if slug exists
    if (!slug || slug.length === 0) {
      return NextResponse.json(
        { error: "Bad Request", message: "API path is required" },
        { status: 400 },
      );
    }

    const path = slug.join("/");
    const targetUrl = `${BASE_URL}/api/Calculate/${path}`;

    const options: RequestInit = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    // Forward body for non-GET requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      try {
        const body = await req.json();
        options.body = JSON.stringify(body);
      } catch (bodyError) {
        console.error("❌ Failed to parse request body:", bodyError);
        return NextResponse.json(
          { error: "Bad Request", message: "Invalid JSON body" },
          { status: 400 },
        );
      }
    }

    // Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    options.signal = controller.signal;

    let response: Response;

    try {
      response = await fetch(targetUrl, options);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      // Handle specific fetch errors
      if (fetchError.name === "AbortError") {
        console.error("❌ Request timeout:", targetUrl);
        return NextResponse.json(
          {
            error: "Timeout",
            message: "Backend server took too long to respond",
          },
          { status: 504 },
        );
      }

      if (fetchError.cause?.code === "ECONNREFUSED") {
        console.error("❌ Connection refused:", targetUrl);
        return NextResponse.json(
          {
            error: "Service Unavailable",
            message: "Backend server is not running",
          },
          { status: 503 },
        );
      }

      if (fetchError.cause?.code === "ENOTFOUND") {
        console.error("❌ Host not found:", targetUrl);
        return NextResponse.json(
          { error: "Service Unavailable", message: "Backend server not found" },
          { status: 503 },
        );
      }

      console.error("❌ Fetch error:", fetchError.message);
      return NextResponse.json(
        {
          error: "Network Error",
          message: "Failed to connect to backend server",
        },
        { status: 502 },
      );
    }

    clearTimeout(timeoutId);

    // Try to parse response as JSON
    let data: any;
    const contentType = response.headers.get("content-type");

    try {
      const responseText = await response.text();

      if (!responseText) {
        // Empty response
        data = { message: "No content" };
      } else if (contentType?.includes("application/json")) {
        data = JSON.parse(responseText);
      } else {
        // Non-JSON response
        console.warn(
          "⚠️ Non-JSON response from backend:",
          responseText.substring(0, 200),
        );
        data = { message: responseText };
      }
    } catch (parseError) {
      console.error("❌ Failed to parse response:", parseError);
      return NextResponse.json(
        {
          error: "Parse Error",
          message: "Invalid response from backend server",
        },
        { status: 502 },
      );
    }

    // Log non-success responses
    if (!response.ok) {
      console.warn(`⚠️ Backend returned ${response.status}:`, data);
    } else {
      console.info(`✅ Success: ${req.method} ${path}`);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    // Catch-all for unexpected errors
    console.error("❌ Unexpected proxy error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      },
      { status: 500 },
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
