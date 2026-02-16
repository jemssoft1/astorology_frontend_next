import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

const YOGINI_DASHAS = [
  { name: "Mangala", years: 1 },
  { name: "Dhanya", years: 3 },
  { name: "Bhramari", years: 4 },
  { name: "Bhadrika", years: 5 },
  { name: "Ulka", years: 6 },
  { name: "Siddha", years: 7 },
  { name: "Sankata", years: 8 },
];

interface ApiResult {
  key: string;
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
}

interface YoginiDashaResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: {
    major_yogini_dasha?: any;
    sub_yogini_dasha?: any;
    current_yogini_dasha?: any;
    sub_yogini_dasha_details?: Record<string, any>;
  };
  errors?: Record<string, string>;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

async function callApi(
  key: string,
  url: string,
  body: any,
  authHeader: string | null,
): Promise<ApiResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        key,
        success: false,
        error: `HTTP ${response.status}: ${errorText || "Unknown error"}`,
        status: response.status,
      };
    }

    const data = await response.json();
    return { key, success: true, data };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Network error";
    return { key, success: false, error: errorMessage };
  }
}

function getStatus(
  successful: number,
  total: number,
): "Pass" | "Partial" | "Fail" {
  if (successful === total) return "Pass";
  if (successful > 0) return "Partial";
  return "Fail";
}

function getStatusMessage(
  status: "Pass" | "Partial" | "Fail",
  successful: number,
  total: number,
): string {
  switch (status) {
    case "Pass":
      return `All ${total} Yogini Dasha APIs called successfully`;
    case "Partial":
      return `${successful} of ${total} Yogini Dasha APIs called successfully`;
    case "Fail":
      return "All Yogini Dasha API calls failed";
  }
}

export async function POST(req: NextRequest) {
  if (!BASE_URL) {
    return NextResponse.json(
      {
        status: "Fail",
        message: "Server configuration error: BACKEND_URL not defined",
        data: {},
        meta: {
          total_apis: 0,
          successful: 0,
          failed: 0,
          success_rate: "0%",
          timestamp: new Date().toISOString(),
        },
      } as YoginiDashaResponse,
      { status: 500 },
    );
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          status: "Fail",
          message: "Invalid request body",
          data: {},
          meta: {
            total_apis: 0,
            successful: 0,
            failed: 0,
            success_rate: "0%",
            timestamp: new Date().toISOString(),
          },
        } as YoginiDashaResponse,
        { status: 400 },
      );
    }

    const requiredFields = [
      "day",
      "month",
      "year",
      "hour",
      "min",
      "lat",
      "lon",
      "tzone",
    ];
    const missingFields = requiredFields.filter(
      (field) => body[field] === undefined,
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          status: "Fail",
          message: `Missing required fields: ${missingFields.join(", ")}`,
          data: {},
          meta: {
            total_apis: 0,
            successful: 0,
            failed: 0,
            success_rate: "0%",
            timestamp: new Date().toISOString(),
          },
        } as YoginiDashaResponse,
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization");

    const baseEndpoints: { key: string; path: string }[] = [
      { key: "major_yogini_dasha", path: "/api/major_yogini_dasha" },
      { key: "sub_yogini_dasha", path: "/api/sub_yogini_dasha" },
      { key: "current_yogini_dasha", path: "/api/current_yogini_dasha" },
    ];

    const subDashaEndpoints: { key: string; path: string }[] =
      YOGINI_DASHAS.map((yogini, index) => {
        const dashaCycle = index < 4 ? "1" : "2";
        return {
          key: `sub_${yogini.name}`,
          path: `/api/sub_yogini_dasha/${dashaCycle}/${yogini.name}`,
        };
      });

    const [baseResults, subDashaResults] = await Promise.all([
      Promise.all(
        baseEndpoints.map((endpoint) =>
          callApi(
            endpoint.key,
            `${BASE_URL}${endpoint.path}`,
            body,
            authHeader,
          ),
        ),
      ),
      Promise.all(
        subDashaEndpoints.map((endpoint) =>
          callApi(
            endpoint.key,
            `${BASE_URL}${endpoint.path}`,
            body,
            authHeader,
          ),
        ),
      ),
    ]);

    const data: Record<string, any> = {};
    const errors: Record<string, string> = {};

    baseResults.forEach((result) => {
      if (result.success && result.data) {
        data[result.key] = result.data;
      } else if (result.error) {
        errors[result.key] = result.error;
      }
    });

    const subDashaDetails: Record<string, any> = {};
    subDashaResults.forEach((result) => {
      if (result.success && result.data) {
        subDashaDetails[result.key] = result.data;
      } else if (result.error) {
        errors[result.key] = result.error;
      }
    });

    if (Object.keys(subDashaDetails).length > 0) {
      data.sub_yogini_dasha_details = subDashaDetails;
    }

    const allResults = [...baseResults, ...subDashaResults];
    const total = allResults.length;
    const successful = allResults.filter((r) => r.success).length;
    const failed = total - successful;
    const successRate = `${Math.round((successful / total) * 100)}%`;
    const status = getStatus(successful, total);
    const message = getStatusMessage(status, successful, total);

    const response: YoginiDashaResponse = {
      status,
      message,
      data,
      meta: {
        total_apis: total,
        successful,
        failed,
        success_rate: successRate,
        timestamp: new Date().toISOString(),
      },
    };

    if (Object.keys(errors).length > 0) {
      response.errors = errors;
    }

    return NextResponse.json(response, {
      status: status === "Fail" ? 500 : 200,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        status: "Fail",
        message:
          error instanceof Error ? error.message : "Unexpected server error",
        data: {},
        meta: {
          total_apis: 11,
          successful: 0,
          failed: 11,
          success_rate: "0%",
          timestamp: new Date().toISOString(),
        },
      } as YoginiDashaResponse,
      { status: 500 },
    );
  }
}
