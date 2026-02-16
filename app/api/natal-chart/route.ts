import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

// All endpoints to call at once
const ALL_ENDPOINTS = [
  { key: "chart_data", path: "western_chart_data", label: "Birth Chart Data" },
  { key: "horoscope", path: "western_horoscope", label: "Western Horoscope" },
  { key: "planets", path: "planets/tropical", label: "Planetary Positions" },
  { key: "house_cusps", path: "house_cusps/tropical", label: "House Cusps" },
  {
    key: "house_cusps_report",
    path: "house_cusps_report/tropical",
    label: "House Cusps Report",
  },
  { key: "natal_wheel", path: "natal_wheel_chart", label: "Natal Wheel Chart" },
  {
    key: "interpretation",
    path: "natal_chart_interpretation",
    label: "Chart Interpretation",
  },
  {
    key: "ascendant_report",
    path: "general_ascendant_report/tropical",
    label: "Ascendant Report",
  },
];

// Planet-specific endpoints
const PLANET_ENDPOINTS = [
  {
    key: "sign_report",
    path: "general_sign_report/tropical",
    label: "Sign Report",
  },
  {
    key: "house_report",
    path: "general_house_report/tropical",
    label: "House Report",
  },
];

const PLANETS = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
];

const VALID_HOUSE_TYPES = [
  "placidus",
  "koch",
  "topocentric",
  "poryphry",
  "equal_house",
  "whole_sign",
];

interface RequestBody {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
  house_type?: string;
}

// Validate request body
function validateRequestBody(body: RequestBody): string | null {
  const { day, month, year, hour, min, lat, lon, tzone } = body;

  if (!day || day < 1 || day > 31) return "Invalid day";
  if (!month || month < 1 || month > 12) return "Invalid month";
  if (!year || year < 1900 || year > 2100) return "Invalid year";
  if (hour === undefined || hour < 0 || hour > 23) return "Invalid hour";
  if (min === undefined || min < 0 || min > 59) return "Invalid minute";
  if (!lat || lat < -90 || lat > 90) return "Invalid latitude";
  if (!lon || lon < -180 || lon > 180) return "Invalid longitude";
  if (tzone === undefined || tzone < -12 || tzone > 14)
    return "Invalid timezone";
  if (body.house_type && !VALID_HOUSE_TYPES.includes(body.house_type)) {
    return "Invalid house_type";
  }

  return null;
}

// Fetch single endpoint
async function fetchEndpoint(
  path: string,
  body: RequestBody,
  authHeader: string | null,
): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/api/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return { error: true, status: response.status };
    }

    return await response.json();
  } catch (error) {
    return { error: true, message: "Failed to fetch" };
  }
}

export async function POST(req: NextRequest) {
  if (!BASE_URL) {
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 },
    );
  }

  try {
    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const validationError = validateRequestBody(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 },
      );
    }

    if (!body.house_type) {
      body.house_type = "placidus";
    }

    const authHeader = req.headers.get("authorization");

    // Fetch all basic endpoints in parallel
    const basicPromises = ALL_ENDPOINTS.map(async (endpoint) => {
      const data = await fetchEndpoint(endpoint.path, body, authHeader);
      return { key: endpoint.key, label: endpoint.label, data };
    });

    // Fetch planet-specific endpoints for all planets
    const planetPromises: Promise<any>[] = [];

    for (const planet of PLANETS) {
      for (const endpoint of PLANET_ENDPOINTS) {
        planetPromises.push(
          fetchEndpoint(`${endpoint.path}/${planet}`, body, authHeader).then(
            (data) => ({
              key: `${endpoint.key}_${planet}`,
              label: `${planet.charAt(0).toUpperCase() + planet.slice(1)} ${endpoint.label}`,
              planet,
              type: endpoint.key,
              data,
            }),
          ),
        );
      }
    }

    // Wait for all requests
    const [basicResults, planetResults] = await Promise.all([
      Promise.all(basicPromises),
      Promise.all(planetPromises),
    ]);

    // Organize results
    const results: any = {
      basic: {},
      planets: {},
    };

    // Process basic results
    for (const result of basicResults) {
      results.basic[result.key] = {
        label: result.label,
        data: result.data,
      };
    }

    // Process planet results
    for (const planet of PLANETS) {
      results.planets[planet] = {
        sign_report: null,
        house_report: null,
      };
    }

    for (const result of planetResults) {
      if (results.planets[result.planet]) {
        results.planets[result.planet][result.type] = result.data;
      }
    }

    return NextResponse.json(
      {
        success: true,
        birthDetails: {
          date: `${body.day}/${body.month}/${body.year}`,
          time: `${body.hour}:${body.min}`,
          location: { lat: body.lat, lon: body.lon },
          timezone: body.tzone,
          houseSystem: body.house_type,
        },
        data: results,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("❌ Western API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    );
  }
}
