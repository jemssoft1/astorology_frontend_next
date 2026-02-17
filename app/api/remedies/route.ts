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

// All Remedies endpoints
const REMEDIES_ENDPOINTS = [
  { key: "puja_suggestion", endpoint: "puja_suggestion" },
  { key: "gem_suggestion", endpoint: "basic_gem_suggestion" },
  { key: "rudraksha_suggestion", endpoint: "rudraksha_suggestion" },
  { key: "sadhesati_remedies", endpoint: "sadhesati_remedies" },
];

async function fetchAPI(endpoint: string, data: BirthData) {
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
    const requestData: BirthData = await request.json();

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

    for (const field of requiredFields) {
      if (requestData[field as keyof BirthData] === undefined) {
        return NextResponse.json(
          { status: "Fail", message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate numeric fields
    if (
      requestData.day < 1 ||
      requestData.day > 31 ||
      requestData.month < 1 ||
      requestData.month > 12 ||
      requestData.year < 1900 ||
      requestData.year > new Date().getFullYear() ||
      requestData.hour < 0 ||
      requestData.hour > 23 ||
      requestData.min < 0 ||
      requestData.min > 59
    ) {
      return NextResponse.json(
        { status: "Fail", message: "Invalid date/time values" },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (
      requestData.lat < -90 ||
      requestData.lat > 90 ||
      requestData.lon < -180 ||
      requestData.lon > 180
    ) {
      return NextResponse.json(
        { status: "Fail", message: "Invalid latitude or longitude values" },
        { status: 400 }
      );
    }

    // Fetch all Remedies APIs in parallel
    const apiPromises = REMEDIES_ENDPOINTS.map((api) =>
      fetchAPI(api.endpoint, requestData).then((data) => ({
        key: api.key,
        endpoint: api.endpoint,
        data,
      }))
    );

    const results = await Promise.all(apiPromises);

    // Build response data object
    const remediesData: Record<string, unknown> = {};
    for (const result of results) {
      remediesData[result.key] = result.data;
    }

    // Count successful APIs
    const totalApis = REMEDIES_ENDPOINTS.length;
    const successful = results.filter((r) => r.data !== null).length;
    const failed = totalApis - successful;

    // Failed endpoints for debugging
    const failedEndpoints = results
      .filter((r) => r.data === null)
      .map((r) => r.endpoint);

    // Determine status
    let status: "Pass" | "Partial" | "Fail";
    if (successful === totalApis) {
      status = "Pass";
    } else if (successful > 0) {
      status = "Partial";
    } else {
      status = "Fail";
    }

    return NextResponse.json({
      status,
      message:
        status === "Pass"
          ? "All remedies data fetched successfully"
          : status === "Partial"
            ? `${successful} of ${totalApis} APIs succeeded`
            : "Failed to fetch remedies data",
      data: remediesData,
      meta: {
        total_apis: totalApis,
        successful,
        failed,
        failed_endpoints: failedEndpoints.length > 0 ? failedEndpoints : undefined,
        success_rate: `${Math.round((successful / totalApis) * 100)}%`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Remedies API Error:", error);
    return NextResponse.json(
      {
        status: "Fail",
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null,
        meta: {
          total_apis: REMEDIES_ENDPOINTS.length,
          successful: 0,
          failed: REMEDIES_ENDPOINTS.length,
          success_rate: "0%",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}