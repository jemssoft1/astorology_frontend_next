import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
  if (!BASE_URL) {
    console.error("❌ BACKEND_URL is not defined in environment variables");
    return NextResponse.json(
      { message: "Server configuration error", status: "Fail" },
      { status: 500 },
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type") || "prediction";

    let backendPath = "";
    switch (type) {
      case "prediction":
        backendPath = "/api/daily_nakshatra_prediction";
        break;
      case "next":
        backendPath = "/api/daily_nakshatra_prediction/next";
        break;
      case "previous":
        backendPath = "/api/daily_nakshatra_prediction/previous";
        break;
      case "consolidated":
        backendPath = "/api/daily_nakshatra_consolidated";
        break;
      default:
        return NextResponse.json(
          {
            message: "Invalid prediction type",
            status: "Fail",
          },
          { status: 400 },
        );
    }

    const backendUrl = `${BASE_URL}${backendPath}`;

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

    const authHeader = req.headers.get("authorization");

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    // ❌ Backend returned error
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Backend error (${response.status}):`, errorText);

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
    return NextResponse.json(
      {
        status: "Pass",
        data: data,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    // ❌ Network / unexpected error
    console.error("❌ PROXY ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unexpected server error",
        status: "Fail",
      },
      { status: 500 },
    );
  }
}
