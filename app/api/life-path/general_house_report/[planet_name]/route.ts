import { proxyToBackend } from "@/lib/backend-proxy";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { planet_name: string } },
) {
  const { planet_name } = params;
  return proxyToBackend(req, `general_house_report/${planet_name}`);
}
