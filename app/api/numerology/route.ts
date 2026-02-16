import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

interface ApiResult {
  key: string;
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
}

interface NumerologyResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: {
    numero_table?: any;
    numero_report?: any;
    numero_fav_time?: any;
    numero_place_vastu?: any;
    numero_fasts_report?: any;
    numero_fav_lord?: any;
    numero_fav_mantra?: any;
    numero_daily_prediction?: any;
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
      return `All ${total} Numerology APIs called successfully`;
    case "Partial":
      return `${successful} of ${total} Numerology APIs called successfully`;
    case "Fail":
      return "All Numerology API calls failed";
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
      } as NumerologyResponse,
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
        } as NumerologyResponse,
        { status: 400 },
      );
    }

    const requiredFields = ["day", "month", "year", "name"];
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
        } as NumerologyResponse,
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization");

    const endpoints: { key: string; path: string }[] = [
      { key: "numero_table", path: "/api/numero_table" },
      { key: "numero_report", path: "/api/numero_report" },
      { key: "numero_fav_time", path: "/api/numero_fav_time" },
      { key: "numero_place_vastu", path: "/api/numero_place_vastu" },
      { key: "numero_fasts_report", path: "/api/numero_fasts_report" },
      { key: "numero_fav_lord", path: "/api/numero_fav_lord" },
      { key: "numero_fav_mantra", path: "/api/numero_fav_mantra" },
      { key: "numero_daily_prediction", path: "/api/numero_prediction/daily" },
    ];

    const results = await Promise.all(
      endpoints.map((endpoint) =>
        callApi(endpoint.key, `${BASE_URL}${endpoint.path}`, body, authHeader),
      ),
    );

    const data: Record<string, any> = {};
    const errors: Record<string, string> = {};

    results.forEach((result) => {
      if (result.success && result.data) {
        data[result.key] = result.data;
      } else if (result.error) {
        errors[result.key] = result.error;
      }
    });

    const total = results.length;
    const successful = results.filter((r) => r.success).length;
    const failed = total - successful;
    const successRate = `${Math.round((successful / total) * 100)}%`;
    const status = getStatus(successful, total);
    const message = getStatusMessage(status, successful, total);

    const response: NumerologyResponse = {
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
          total_apis: 8,
          successful: 0,
          failed: 8,
          success_rate: "0%",
          timestamp: new Date().toISOString(),
        },
      } as NumerologyResponse,
      { status: 500 },
    );
  }
}
