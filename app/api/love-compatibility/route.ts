import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

// All Compatibility Endpoints
const ENDPOINTS = {
  // Two persons endpoints (p_ and s_ prefixes)
  synastry: { path: "synastry_horoscope", requiresTwoPersons: true },
  composite: { path: "composite_horoscope", requiresTwoPersons: true },
  romantic_forecast_couple: {
    path: "romantic_forecast_couple_report/tropical",
    requiresTwoPersons: true,
  },
  love_compatibility: {
    path: "love_compatibility_report/tropical",
    requiresTwoPersons: true,
  },
  karma_destiny: {
    path: "karma_destiny_report/tropical",
    requiresTwoPersons: true,
  },
  friendship: { path: "friendship_report/tropical", requiresTwoPersons: true },

  // Single person endpoints (primary person)
  romantic_forecast: {
    path: "romantic_forecast_report/tropical",
    requiresTwoPersons: false,
  },
  romantic_personality: {
    path: "romantic_personality_report/tropical",
    requiresTwoPersons: false,
  },
};

// Two persons request body
interface TwoPersonsBody {
  p_day: number;
  p_month: number;
  p_year: number;
  p_hour: number;
  p_min: number;
  p_lat: number;
  p_lon: number;
  p_tzone: number;
  s_day: number;
  s_month: number;
  s_year: number;
  s_hour: number;
  s_min: number;
  s_lat: number;
  s_lon: number;
  s_tzone: number;
}

// Single person request body
interface SinglePersonBody {
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

// Validate two persons body
function validateTwoPersonsBody(body: TwoPersonsBody): string | null {
  // Primary person
  if (!body.p_day || body.p_day < 1 || body.p_day > 31)
    return "Invalid primary day";
  if (!body.p_month || body.p_month < 1 || body.p_month > 12)
    return "Invalid primary month";
  if (!body.p_year || body.p_year < 1900 || body.p_year > 2100)
    return "Invalid primary year";
  if (body.p_hour === undefined || body.p_hour < 0 || body.p_hour > 23)
    return "Invalid primary hour";
  if (body.p_min === undefined || body.p_min < 0 || body.p_min > 59)
    return "Invalid primary minute";
  if (!body.p_lat || body.p_lat < -90 || body.p_lat > 90)
    return "Invalid primary latitude";
  if (!body.p_lon || body.p_lon < -180 || body.p_lon > 180)
    return "Invalid primary longitude";
  if (body.p_tzone === undefined || body.p_tzone < -12 || body.p_tzone > 14)
    return "Invalid primary timezone";

  // Secondary person
  if (!body.s_day || body.s_day < 1 || body.s_day > 31)
    return "Invalid secondary day";
  if (!body.s_month || body.s_month < 1 || body.s_month > 12)
    return "Invalid secondary month";
  if (!body.s_year || body.s_year < 1900 || body.s_year > 2100)
    return "Invalid secondary year";
  if (body.s_hour === undefined || body.s_hour < 0 || body.s_hour > 23)
    return "Invalid secondary hour";
  if (body.s_min === undefined || body.s_min < 0 || body.s_min > 59)
    return "Invalid secondary minute";
  if (!body.s_lat || body.s_lat < -90 || body.s_lat > 90)
    return "Invalid secondary latitude";
  if (!body.s_lon || body.s_lon < -180 || body.s_lon > 180)
    return "Invalid secondary longitude";
  if (body.s_tzone === undefined || body.s_tzone < -12 || body.s_tzone > 14)
    return "Invalid secondary timezone";

  return null;
}

// Get zodiac sign from date
function getZodiacSign(day: number, month: number): string {
  const signs = [
    { sign: "Capricorn", end: { month: 1, day: 19 } },
    { sign: "Aquarius", end: { month: 2, day: 18 } },
    { sign: "Pisces", end: { month: 3, day: 20 } },
    { sign: "Aries", end: { month: 4, day: 19 } },
    { sign: "Taurus", end: { month: 5, day: 20 } },
    { sign: "Gemini", end: { month: 6, day: 20 } },
    { sign: "Cancer", end: { month: 7, day: 22 } },
    { sign: "Leo", end: { month: 8, day: 22 } },
    { sign: "Virgo", end: { month: 9, day: 22 } },
    { sign: "Libra", end: { month: 10, day: 22 } },
    { sign: "Scorpio", end: { month: 11, day: 21 } },
    { sign: "Sagittarius", end: { month: 12, day: 21 } },
    { sign: "Capricorn", end: { month: 12, day: 31 } },
  ];

  for (const { sign, end } of signs) {
    if (month < end.month || (month === end.month && day <= end.day)) {
      return sign.toLowerCase();
    }
  }
  return "capricorn";
}

// Fetch endpoint
async function fetchEndpoint(
  path: string,
  body: any,
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

// Fetch GET endpoint
async function fetchGetEndpoint(
  path: string,
  authHeader: string | null,
): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/api/${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
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
    let body: TwoPersonsBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const validationError = validateTwoPersonsBody(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization");

    // Prepare request bodies
    const twoPersonsBody: TwoPersonsBody = body;

    const primaryPersonBody: SinglePersonBody = {
      day: body.p_day,
      month: body.p_month,
      year: body.p_year,
      hour: body.p_hour,
      min: body.p_min,
      lat: body.p_lat,
      lon: body.p_lon,
      tzone: body.p_tzone,
      house_type: "placidus",
    };

    // Get zodiac signs for compatibility endpoints
    const primaryZodiac = getZodiacSign(body.p_day, body.p_month);
    const secondaryZodiac = getZodiacSign(body.s_day, body.s_month);

    // Fetch all endpoints in parallel
    const [
      synastryData,
      compositeData,
      romanticForecastData,
      romanticForecastCoupleData,
      loveCompatibilityData,
      karmaDestinyData,
      friendshipData,
      romanticPersonalityData,
      zodiacCompatibilityData,
    ] = await Promise.all([
      // Two persons endpoints
      fetchEndpoint(ENDPOINTS.synastry.path, twoPersonsBody, authHeader),
      fetchEndpoint(ENDPOINTS.composite.path, twoPersonsBody, authHeader),
      fetchEndpoint(
        ENDPOINTS.romantic_forecast_couple.path,
        twoPersonsBody,
        authHeader,
      ),
      fetchEndpoint(
        ENDPOINTS.love_compatibility.path,
        twoPersonsBody,
        authHeader,
      ),
      fetchEndpoint(ENDPOINTS.karma_destiny.path, twoPersonsBody, authHeader),
      fetchEndpoint(ENDPOINTS.friendship.path, twoPersonsBody, authHeader),

      // Single person endpoints
      fetchEndpoint(
        ENDPOINTS.romantic_forecast.path,
        primaryPersonBody,
        authHeader,
      ),
      fetchEndpoint(
        ENDPOINTS.romantic_personality.path,
        primaryPersonBody,
        authHeader,
      ),

      // Zodiac compatibility (GET request)
      fetchGetEndpoint(
        `zodiac_compatibility/${primaryZodiac}/${secondaryZodiac}`,
        authHeader,
      ),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Complete Compatibility Report Generated",
        partners: {
          primary: {
            date: `${body.p_day}/${body.p_month}/${body.p_year}`,
            time: `${String(body.p_hour).padStart(2, "0")}:${String(body.p_min).padStart(2, "0")}`,
            location: { lat: body.p_lat, lon: body.p_lon },
            timezone: body.p_tzone,
            zodiac: primaryZodiac,
          },
          secondary: {
            date: `${body.s_day}/${body.s_month}/${body.s_year}`,
            time: `${String(body.s_hour).padStart(2, "0")}:${String(body.s_min).padStart(2, "0")}`,
            location: { lat: body.s_lat, lon: body.s_lon },
            timezone: body.s_tzone,
            zodiac: secondaryZodiac,
          },
        },
        data: {
          synastry: synastryData,
          composite: compositeData,
          romantic_forecast: romanticForecastData,
          romantic_forecast_couple: romanticForecastCoupleData,
          love_compatibility: loveCompatibilityData,
          karma_destiny: karmaDestinyData,
          friendship: friendshipData,
          romantic_personality: romanticPersonalityData,
          zodiac_compatibility: zodiacCompatibilityData,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("❌ Love Compatibility API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    );
  }
}
