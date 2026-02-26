import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function proxyToBackend(req: NextRequest, endpoint: string) {
  if (!BACKEND_URL) {
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
    const url = `${BACKEND_URL}/api/${endpoint}`;

    // We expect a POST request with a body for these reports
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward any auth tokens if necessary, though the backend might not need them for these specific public-ish reports
        // If the backend requires an API token (like in external-api-proxy.ts), it's handled *inside* the backend's proxy.
        // We are proxying TO the backend, which then proxies to the external API.
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(`❌ Proxy error for ${endpoint}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 },
    );
  }
}
