import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
  // ❌ Misconfiguration error (server issue)
  if (!BASE_URL) {
    console.error("❌ BACKEND_URL is not defined");

    return NextResponse.json(
      {
        message: "Server configuration error",
        status: "Fail",
      },
      { status: 500 },
    );
  }

  try {
    // ❌ Invalid JSON / empty body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      return NextResponse.json(
        {
          message: "Invalid request body",
          status: "Fail",
        },
        { status: 400 },
      );
    }

    const backendUrl = `${BASE_URL}/api/life-path/predict`;

    const startTime = Date.now();

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // ❌ Backend returned error
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error response:");
      console.error("   Status:", response.status);
      console.error("   StatusText:", response.statusText);
      console.error("   Body:", errorText);

      return NextResponse.json(
        {
          message: "Backend request failed",
          backendStatus: response.status,
          error: errorText,
          status: "Fail",
        },
        { status: response.status },
      );
    }

    // ✅ Success
    const data = await response.json();

    if (data.success) {
      console.info("   TimeSlices:", data.data?.TimeSlices?.length || 0);
      console.info(
        "   TotalEvents:",
        data.data?.Configuration?.TotalEventsCount || 0,
      );
    } else {
      console.info("   Success flag:", data.success);
      console.info("   Message:", data.message || "No message");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    // ❌ Network / unexpected error
    console.error("❌ PROXY ERROR:");
    console.error("   Type:", (error as any)?.constructor?.name);
    console.error("   Message:", (error as any)?.message || error);

    if (error instanceof Error) {
      console.error("   Stack:", error.stack);
    }

    return NextResponse.json(
      {
        message:
          (error as any)?.message || String(error) || "Unexpected server error",
        status: "Fail",
      },
      { status: 500 },
    );
  }
}
