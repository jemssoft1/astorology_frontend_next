// app/api/lunar/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL;

const VALID_HOUSE_TYPES = [
  "placidus",
  "koch",
  "topocentric",
  "poryphry",
  "equal_house",
  "whole_sign",
] as const;

type HouseType = (typeof VALID_HOUSE_TYPES)[number];

interface LunarRequest {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
  house_type?: HouseType;
}

// Lunar API endpoints
const LUNAR_ENDPOINTS = ["lunar_metrics", "moon_phase_report"] as const;

type LunarEndpoint = (typeof LUNAR_ENDPOINTS)[number];

interface ApiResult {
  endpoint: LunarEndpoint;
  data: unknown | null;
  success: boolean;
  error?: string;
}

async function fetchAPI(
  endpoint: string,
  data: LunarRequest,
): Promise<unknown | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API ${endpoint} failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData: LunarRequest = await request.json();

    // Validate required fields
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

    const missingFields: string[] = [];
    for (const field of requiredFields) {
      if (requestData[field as keyof LunarRequest] === undefined) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          status: "Fail",
          message: `Missing required fields: ${missingFields.join(", ")}`,
          data: null,
        },
        { status: 400 },
      );
    }

    // Validate house_type if provided, otherwise default to "placidus"
    if (requestData.house_type) {
      if (!VALID_HOUSE_TYPES.includes(requestData.house_type as HouseType)) {
        return NextResponse.json(
          {
            status: "Fail",
            message: `Invalid house_type: "${requestData.house_type}". Must be one of: ${VALID_HOUSE_TYPES.join(", ")}`,
            data: null,
          },
          { status: 400 },
        );
      }
    } else {
      requestData.house_type = "placidus";
    }

    // Fetch all Lunar APIs in parallel
    const apiPromises: Promise<ApiResult>[] = LUNAR_ENDPOINTS.map(
      async (endpoint) => {
        const data = await fetchAPI(endpoint, requestData);
        return {
          endpoint,
          data,
          success: data !== null,
          error: data === null ? `Failed to fetch ${endpoint}` : undefined,
        };
      },
    );

    const results = await Promise.all(apiPromises);

    // Build response data object
    const responseData: Record<string, unknown> = {
      birth_data: {
        day: requestData.day,
        month: requestData.month,
        year: requestData.year,
        hour: requestData.hour,
        min: requestData.min,
        lat: requestData.lat,
        lon: requestData.lon,
        tzone: requestData.tzone,
      },
      house_type: requestData.house_type,
    };

    // Convert endpoint names to camelCase keys
    const endpointKeyMap: Record<LunarEndpoint, string> = {
      lunar_metrics: "lunarMetrics",
      moon_phase_report: "moonPhaseReport",
    };

    for (const result of results) {
      const key = endpointKeyMap[result.endpoint];
      responseData[key] = result.data;
    }

    // Calculate statistics
    const totalApis = LUNAR_ENDPOINTS.length;
    const successful = results.filter((r) => r.success).length;
    const failed = totalApis - successful;
    const failedEndpoints = results
      .filter((r) => !r.success)
      .map((r) => r.endpoint);

    // Determine overall status
    let status: "Pass" | "Partial" | "Fail";
    let message: string;

    if (successful === totalApis) {
      status = "Pass";
      message = "All Lunar data fetched successfully";
    } else if (successful > 0) {
      status = "Partial";
      message = `${successful} of ${totalApis} Lunar APIs succeeded`;
    } else {
      status = "Fail";
      message = "Failed to fetch Lunar data from all endpoints";
    }

    return NextResponse.json({
      status,
      message,
      data: responseData,
      meta: {
        total_apis: totalApis,
        successful,
        failed,
        failed_endpoints:
          failedEndpoints.length > 0 ? failedEndpoints : undefined,
        success_rate: `${Math.round((successful / totalApis) * 100)}%`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Lunar API Error:", error);
    return NextResponse.json(
      {
        status: "Fail",
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null,
        meta: {
          total_apis: LUNAR_ENDPOINTS.length,
          successful: 0,
          failed: LUNAR_ENDPOINTS.length,
          failed_endpoints: [...LUNAR_ENDPOINTS],
          success_rate: "0%",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}
