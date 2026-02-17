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

interface VarshaphalRequest extends BirthData {
  varshaphal_year: number; // The year for which Varshaphal is calculated
}

// All Varshaphal endpoints
const VARSHAPHAL_ENDPOINTS = [
  { key: "year_chart", endpoint: "varshaphal_year_chart" },
  { key: "month_chart", endpoint: "varshaphal_month_chart" },
  { key: "details", endpoint: "varshaphal_details" },
  { key: "planets", endpoint: "varshaphal_planets" },
  { key: "muntha", endpoint: "varshaphal_muntha" },
  { key: "mudda_dasha", endpoint: "varshaphal_mudda_dasha" },
  { key: "panchavargeeya_bala", endpoint: "varshaphal_panchavargeeya_bala" },
  { key: "harsha_bala", endpoint: "varshaphal_harsha_bala" },
  { key: "yoga", endpoint: "varshaphal_yoga" },
  { key: "saham_points", endpoint: "varshaphal_saham_points" },
];

async function fetchAPI(endpoint: string, data: VarshaphalRequest) {
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
    const requestData: VarshaphalRequest = await request.json();

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
      "varshaphal_year",
    ];

    for (const field of requiredFields) {
      if (requestData[field as keyof VarshaphalRequest] === undefined) {
        return NextResponse.json(
          { status: "Fail", message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate varshaphal_year
    const currentYear = new Date().getFullYear();
    const birthYear = requestData.year;

    if (requestData.varshaphal_year < birthYear) {
      return NextResponse.json(
        {
          status: "Fail",
          message: "Varshaphal year cannot be before birth year",
        },
        { status: 400 }
      );
    }

    if (requestData.varshaphal_year > currentYear + 10) {
      return NextResponse.json(
        {
          status: "Fail",
          message: "Varshaphal year cannot be more than 10 years in the future",
        },
        { status: 400 }
      );
    }

    // Fetch all Varshaphal APIs in parallel
    const apiPromises = VARSHAPHAL_ENDPOINTS.map((api) =>
      fetchAPI(api.endpoint, requestData).then((data) => ({
        key: api.key,
        endpoint: api.endpoint,
        data,
      }))
    );

    const results = await Promise.all(apiPromises);

    // Build response data object
    const varshaphalData: Record<string, unknown> = {};
    for (const result of results) {
      varshaphalData[result.key] = result.data;
    }

    // Count successful APIs
    const totalApis = VARSHAPHAL_ENDPOINTS.length;
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

    // Calculate age at varshaphal year
    const ageAtVarshaphal = requestData.varshaphal_year - birthYear;

    return NextResponse.json({
      status,
      message:
        status === "Pass"
          ? "All Varshaphal data fetched successfully"
          : status === "Partial"
            ? `${successful} of ${totalApis} APIs succeeded`
            : "Failed to fetch Varshaphal data",
      data: varshaphalData,
      meta: {
        varshaphal_year: requestData.varshaphal_year,
        age_at_varshaphal: ageAtVarshaphal,
        total_apis: totalApis,
        successful,
        failed,
        failed_endpoints: failedEndpoints.length > 0 ? failedEndpoints : undefined,
        success_rate: `${Math.round((successful / totalApis) * 100)}%`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Varshaphal API Error:", error);
    return NextResponse.json(
      {
        status: "Fail",
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null,
        meta: {
          total_apis: VARSHAPHAL_ENDPOINTS.length,
          successful: 0,
          failed: VARSHAPHAL_ENDPOINTS.length,
          success_rate: "0%",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}