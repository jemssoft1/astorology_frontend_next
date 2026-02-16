// app/api/person/update/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
  if (!BASE_URL) {
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization");

    const response = await fetch(`${BASE_URL}/api/person/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Person update error:", error);
    return NextResponse.json(
      { error: "Failed to update person", Status: "Fail" },
      { status: 500 },
    );
  }
}
