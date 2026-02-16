import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
  // ❌ Misconfiguration error (server issue)
  if (!BASE_URL) {
    console.error("BACKEND_URL is not defined");
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
    } catch {
      return NextResponse.json(
        {
          message: "Invalid request body",
          status: "Fail",
        },
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization");

    const response = await fetch(`${BASE_URL}/api/person/add`, {
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

      console.error("Backend error:", response.status, errorText);

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

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    // ❌ Network / unexpected error
    console.error("Person add proxy error:", error);
    let errorMessage = "Unexpected server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json(
      {
        message: errorMessage,
        status: "Fail",
      },
      { status: 500 },
    );
  }
}
