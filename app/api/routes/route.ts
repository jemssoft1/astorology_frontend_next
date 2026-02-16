import { NextResponse } from "next/server";
import { scanRoutes } from "@/lib/routeScanner";

export async function GET() {
  try {
    const routes = scanRoutes();
    return NextResponse.json(routes);
  } catch (error) {
    console.error("Error scanning routes:", error);
    return NextResponse.json(
      { error: "Failed to scan routes" },
      { status: 500 },
    );
  }
}
