import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

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

  return null;
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

    // Set default house type
    if (!body.house_type) {
      body.house_type = "placidus";
    }

    const authHeader = req.headers.get("authorization");

    // Fetch personality report
    const response = await fetch(
      `${BASE_URL}/api/personality_report/tropical`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Backend request failed",
          status: response.status,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: "Personality Report Generated",
        birthDetails: {
          date: `${body.day}/${body.month}/${body.year}`,
          time: `${String(body.hour).padStart(2, "0")}:${String(body.min).padStart(2, "0")}`,
          location: { lat: body.lat, lon: body.lon },
          timezone: body.tzone,
          houseSystem: body.house_type,
        },
        data: data,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("❌ Personality API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    );
  }
}
