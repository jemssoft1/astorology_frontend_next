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

// Char Dasha endpoints
const CHARDASHA_ENDPOINTS = [
  { key: "major_chardasha", endpoint: "major_chardasha" },
  { key: "current_chardasha", endpoint: "current_chardasha" },
 
];

// All 12 signs for sub_chardasha
const SIGNS_FOR_SUB_DASHA = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
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
    const birthData: BirthData = await request.json();

    // Validate required fields
    const requiredFields = ["day", "month", "year", "hour", "min", "lat", "lon", "tzone"];
    for (const field of requiredFields) {
      if (birthData[field as keyof BirthData] === undefined) {
        return NextResponse.json(
          { status: "Fail", message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Fetch main endpoints
    const mainPromises = CHARDASHA_ENDPOINTS.map((api) =>
      fetchAPI(api.endpoint, birthData).then((data) => ({
        key: api.key,
        endpoint: api.endpoint,
        data,
      }))
    );

    // Fetch sub_chardasha for all 12 signs
    const subDashaPromises = SIGNS_FOR_SUB_DASHA.map((sign) =>
      fetchAPI(`sub_chardasha/${sign}`, birthData).then((data) => ({
        sign,
        data,
      }))
    );

    // Execute all API calls in parallel
    const [mainResults, subDashaResults] = await Promise.all([
      Promise.all(mainPromises),
      Promise.all(subDashaPromises),
    ]);

    // Build response data object
    const chardashaData: Record<string, unknown> = {};
    for (const result of mainResults) {
      chardashaData[result.key] = result.data;
    }

    // Build sub_chardasha object with all signs
    const subChardashaDetails: Record<string, unknown> = {};
    for (const result of subDashaResults) {
      subChardashaDetails[result.sign] = result.data;
    }
    chardashaData["sub_chardasha_details"] = subChardashaDetails;

    // Count successful APIs
    const totalMainApis = CHARDASHA_ENDPOINTS.length;
    const totalSubApis = SIGNS_FOR_SUB_DASHA.length;
    const totalApis = totalMainApis + totalSubApis;

    const successfulMain = mainResults.filter((r) => r.data !== null).length;
    const successfulSub = subDashaResults.filter((r) => r.data !== null).length;
    const successful = successfulMain + successfulSub;
    const failed = totalApis - successful;

    // Failed endpoints for debugging
    const failedEndpoints = [
      ...mainResults.filter((r) => r.data === null).map((r) => r.endpoint),
      ...subDashaResults.filter((r) => r.data === null).map((r) => `sub_chardasha/${r.sign}`),
    ];

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
          ? "All Char Dasha data fetched successfully"
          : status === "Partial"
            ? `${successful} of ${totalApis} APIs succeeded`
            : "Failed to fetch Char Dasha data",
      data: chardashaData,
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
    console.error("Char Dasha API Error:", error);
    return NextResponse.json(
      {
        status: "Fail",
        message: error instanceof Error ? error.message : "Internal server error",
        data: null,
        meta: {
          total_apis: 15,
          successful: 0,
          failed: 15,
          success_rate: "0%",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}