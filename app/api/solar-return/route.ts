// app/api/solar-return/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL;

interface BirthData {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
}

interface SolarReturnRequest extends BirthData {
  solar_year: number; // Year for which to calculate solar return
}

// Solar Return API endpoints
const SOLAR_RETURN_ENDPOINTS = [
  "solar_return_details",
  "solar_return_planets",
  "solar_return_house_cusps",
  "solar_return_planet_aspects",
  "solar_return_planet_report",
  "solar_return_aspects_report",
] as const;

type SolarReturnEndpoint = (typeof SOLAR_RETURN_ENDPOINTS)[number];

interface ApiResult {
  endpoint: SolarReturnEndpoint;
  data: unknown | null;
  success: boolean;
  error?: string;
}

async function fetchAPI(
  endpoint: string,
  data: SolarReturnRequest,
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
    const requestData: SolarReturnRequest = await request.json();

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
      "solar_year",
    ];

    const missingFields: string[] = [];
    for (const field of requiredFields) {
      if (requestData[field as keyof SolarReturnRequest] === undefined) {
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

    // Validate solar_year is reasonable
    const currentYear = new Date().getFullYear();
    if (
      requestData.solar_year < requestData.year ||
      requestData.solar_year > currentYear + 100
    ) {
      return NextResponse.json(
        {
          status: "Fail",
          message: `Invalid solar_year: must be between birth year (${requestData.year}) and ${currentYear + 100}`,
          data: null,
        },
        { status: 400 },
      );
    }

    // Fetch all Solar Return APIs in parallel
    const apiPromises: Promise<ApiResult>[] = SOLAR_RETURN_ENDPOINTS.map(
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
      solar_year: requestData.solar_year,
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
    };

    // Convert endpoint names to camelCase keys
    const endpointKeyMap: Record<SolarReturnEndpoint, string> = {
      solar_return_details: "details",
      solar_return_planets: "planets",
      solar_return_house_cusps: "houseCusps",
      solar_return_planet_aspects: "planetAspects",
      solar_return_planet_report: "planetReport",
      solar_return_aspects_report: "aspectsReport",
    };

    for (const result of results) {
      const key = endpointKeyMap[result.endpoint];
      responseData[key] = result.data;
    }

    // Calculate statistics
    const totalApis = SOLAR_RETURN_ENDPOINTS.length;
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
      message = "All Solar Return data fetched successfully";
    } else if (successful > 0) {
      status = "Partial";
      message = `${successful} of ${totalApis} Solar Return APIs succeeded`;
    } else {
      status = "Fail";
      message = "Failed to fetch Solar Return data from all endpoints";
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
    console.error("Solar Return API Error:", error);
    return NextResponse.json(
      {
        status: "Fail",
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null,
        meta: {
          total_apis: SOLAR_RETURN_ENDPOINTS.length,
          successful: 0,
          failed: SOLAR_RETURN_ENDPOINTS.length,
          failed_endpoints: [...SOLAR_RETURN_ENDPOINTS],
          success_rate: "0%",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}
