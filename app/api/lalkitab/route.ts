import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

// All 9 planets for remedies
const ALL_PLANETS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

interface ApiResult {
  key: string;
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
}

interface LalKitabResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: {
    horoscope?: any;
    debts?: any;
    houses?: any;
    planets?: any;
    remedies?: Record<string, any>; // All planets remedies
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
      console.error(`❌ [${key}] Failed (${response.status}):`, errorText);
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
    console.error(`❌ [${key}] Error:`, errorMessage);
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
      return `All ${total} Lal Kitab APIs called successfully`;
    case "Partial":
      return `${successful} of ${total} Lal Kitab APIs called successfully`;
    case "Fail":
      return "All Lal Kitab API calls failed";
  }
}

export async function POST(req: NextRequest) {
  if (!BASE_URL) {
    console.error("❌ BACKEND_URL is not defined");
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
      } as LalKitabResponse,
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
        } as LalKitabResponse,
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
        } as LalKitabResponse,
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization");

    // Base endpoints (4 APIs)
    const baseEndpoints: { key: string; path: string }[] = [
      { key: "horoscope", path: "/api/lalkitab_horoscope" },
      { key: "debts", path: "/api/lalkitab_debts" },
      { key: "houses", path: "/api/lalkitab_houses" },
      { key: "planets", path: "/api/lalkitab_planets" },
    ];

    // Remedies endpoints for all 9 planets
    const remediesEndpoints: { key: string; path: string; planet: string }[] =
      ALL_PLANETS.map((planet) => ({
        key: `remedies_${planet}`,
        path: `/api/lalkitab_remedies/${planet}`,
        planet: planet,
      }));

    // Total: 4 base + 9 remedies = 13 APIs

    // Call base APIs
    const baseApiCalls = baseEndpoints.map((endpoint) =>
      callApi(endpoint.key, `${BASE_URL}${endpoint.path}`, body, authHeader),
    );

    // Call all remedies APIs
    const remediesApiCalls = remediesEndpoints.map((endpoint) =>
      callApi(endpoint.key, `${BASE_URL}${endpoint.path}`, body, authHeader),
    );

    // Wait for all APIs
    const [baseResults, remediesResults] = await Promise.all([
      Promise.all(baseApiCalls),
      Promise.all(remediesApiCalls),
    ]);

    // Process base results
    const data: Record<string, any> = {};
    const errors: Record<string, string> = {};

    baseResults.forEach((result) => {
      if (result.success && result.data) {
        data[result.key] = result.data;
      } else if (result.error) {
        errors[result.key] = result.error;
      }
    });

    // Process remedies results - combine into single object
    const remediesData: Record<string, any> = {};
    remediesResults.forEach((result, idx) => {
      const planet = remediesEndpoints[idx].planet;
      if (result.success && result.data) {
        remediesData[planet] = result.data;
      } else if (result.error) {
        errors[`remedies_${planet}`] = result.error;
      }
    });

    // Add combined remedies to data
    if (Object.keys(remediesData).length > 0) {
      data.remedies = remediesData;
    }

    // Calculate stats
    const allResults = [...baseResults, ...remediesResults];
    const total = allResults.length;
    const successful = allResults.filter((r) => r.success).length;
    const failed = total - successful;
    const successRate = `${Math.round((successful / total) * 100)}%`;
    const status = getStatus(successful, total);
    const message = getStatusMessage(status, successful, total);

    const response: LalKitabResponse = {
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
    console.error("❌ UNEXPECTED ERROR:", error);
    return NextResponse.json(
      {
        status: "Fail",
        message:
          error instanceof Error ? error.message : "Unexpected server error",
        data: {},
        meta: {
          total_apis: 13,
          successful: 0,
          failed: 13,
          success_rate: "0%",
          timestamp: new Date().toISOString(),
        },
      } as LalKitabResponse,
      { status: 500 },
    );
  }
}
