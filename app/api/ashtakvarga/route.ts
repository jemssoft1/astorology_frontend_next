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

// Type for planet ashtakvarga API response
interface PlanetAshtakData {
  [key: string]: unknown;
}

// 7 Planets used in Ashtakvarga
const ASHTAKVARGA_PLANETS = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
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
      if (birthData[field as keyof BirthData] === undefined) {
        return NextResponse.json(
          { status: "Fail", message: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Fetch Sarvashtakvarga
    const sarvashtakPromise = fetchAPI("sarvashtak", birthData);

    // Fetch Planet Ashtakvarga for all 7 planets
    const planetAshtakPromises = ASHTAKVARGA_PLANETS.map((planet) =>
      fetchAPI(`planet_ashtak/${planet}`, birthData).then((data) => ({
        planet,
        data,
      })),
    );

    // Execute all API calls in parallel
    const [sarvashtakData, ...planetResults] = await Promise.all([
      sarvashtakPromise,
      ...planetAshtakPromises,
    ]);

    // Build planet ashtakvarga object
    const planetAshtak: Record<string, PlanetAshtakData | null> = {};
    for (const result of planetResults) {
      planetAshtak[result.planet] = result.data;
    }

    const results = {
      sarvashtakvarga: sarvashtakData,
      planet_ashtakvarga: planetAshtak,
    };

    // Count successful APIs
    const totalApis = 8; // 1 sarvashtakvarga + 7 planets
    let successful = sarvashtakData ? 1 : 0;
    successful += Object.values(planetAshtak).filter((r) => r !== null).length;
    const failed = totalApis - successful;

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
          ? "All Ashtakvarga data fetched successfully"
          : status === "Partial"
            ? `${successful} of ${totalApis} APIs succeeded`
            : "Failed to fetch Ashtakvarga data",
      data: results,
      meta: {
        total_apis: totalApis,
        successful,
        failed,
        success_rate: `${Math.round((successful / totalApis) * 100)}%`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Ashtakvarga API Error:", error);
    return NextResponse.json(
      {
        status: "Fail",
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null,
        meta: {
          total_apis: 8,
          successful: 0,
          failed: 8,
          success_rate: "0%",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    );
  }
}
