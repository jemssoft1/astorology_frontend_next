// app/api/person/delete/[ownerId]/[personId]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { ownerId: string; personId: string } },
) {
  if (!BASE_URL) {
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 },
    );
  }

  try {
    const { ownerId, personId } = params;
    const authHeader = req.headers.get("authorization");

    const response = await fetch(
      `${BASE_URL}/api/person/delete/${ownerId}/${personId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Person delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete person", Status: "Fail" },
      { status: 500 },
    );
  }
}
