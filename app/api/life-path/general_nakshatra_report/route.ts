import { proxyToBackend } from "@/lib/backend-proxy";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return proxyToBackend(req, "general_nakshatra_report");
}
