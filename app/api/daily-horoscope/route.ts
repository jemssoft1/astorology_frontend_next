import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

// ✅ Normalized prediction structure for frontend
interface NormalizedPrediction {
  personal_life: string | null;
  profession: string | null;
  health: string | null;
  emotions: string | null;
  travel: string | null;
  luck: string | null;
  prediction: string | null; // for old plain string format
  personal_life_rating: number | null;
  profession_rating: number | null;
  health_rating: number | null;
  emotions_rating: number | null;
  travel_rating: number | null;
  luck_rating: number | null;
}

interface ApiResult {
  day: "yesterday" | "today" | "tomorrow";
  success: boolean;
  data?: NormalizedPrediction;
  error?: string;
}

const VALID_SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

// ✅ Normalize any response format into consistent structure
function normalizeResponse(raw: any): NormalizedPrediction {
  // Format 4: { status, prediction: "plain string" }
  if (raw?.prediction && typeof raw.prediction === "string") {
    return {
      personal_life: null,
      profession: null,
      health: null,
      emotions: null,
      travel: null,
      luck: null,
      prediction: raw.prediction,
      personal_life_rating: null,
      profession_rating: null,
      health_rating: null,
      emotions_rating: null,
      travel_rating: null,
      luck_rating: null,
    };
  }

  // Format 2 & 3: { status, prediction: { personal_life, ..., ratings } }
  if (raw?.prediction && typeof raw.prediction === "object") {
    const p = raw.prediction;
    return {
      personal_life: p.personal_life || null,
      profession: p.profession || null,
      health: p.health || null,
      emotions: p.emotions || null,
      travel: p.travel || null,
      luck: p.luck || null,
      prediction: null,
      personal_life_rating: p.personal_life_rating ?? null,
      profession_rating: p.profession_rating ?? null,
      health_rating: p.health_rating ?? null,
      emotions_rating: p.emotions_rating ?? null,
      travel_rating: p.travel_rating ?? null,
      luck_rating: p.luck_rating ?? null,
    };
  }

  // Format 1: Direct object { personal_life, profession, ... }
  if (raw?.personal_life || raw?.profession || raw?.health) {
    return {
      personal_life: raw.personal_life || null,
      profession: raw.profession || null,
      health: raw.health || null,
      emotions: raw.emotions || null,
      travel: raw.travel || null,
      luck: raw.luck || null,
      prediction: null,
      personal_life_rating: raw.personal_life_rating ?? null,
      profession_rating: raw.profession_rating ?? null,
      health_rating: raw.health_rating ?? null,
      emotions_rating: raw.emotions_rating ?? null,
      travel_rating: raw.travel_rating ?? null,
      luck_rating: raw.luck_rating ?? null,
    };
  }

  // Fallback: unknown format
  return {
    personal_life: null,
    profession: null,
    health: null,
    emotions: null,
    travel: null,
    luck: null,
    prediction: JSON.stringify(raw),
    personal_life_rating: null,
    profession_rating: null,
    health_rating: null,
    emotions_rating: null,
    travel_rating: null,
    luck_rating: null,
  };
}

async function fetchPrediction(
  zodiacName: string,
  timezone: number,
  endpointType: "previous" | "current" | "next",
): Promise<ApiResult> {
  const endpointMap = {
    previous: `/api/sun_sign_prediction/previous/${zodiacName}`,
    current: `/api/sun_sign_prediction/daily/${zodiacName}`,
    next: `/api/sun_sign_prediction/next/${zodiacName}`,
  };

  const dayMap = {
    previous: "yesterday",
    current: "today",
    next: "tomorrow",
  } as const;

  const url = `${BASE_URL}${endpointMap[endpointType]}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timezone }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ [${endpointType}] Failed (${response.status}):`,
        errorText,
      );
      return {
        day: dayMap[endpointType],
        success: false,
        error: `HTTP ${response.status}`,
      };
    }

    const rawData = await response.json();

    // ✅ Normalize the response
    const normalized = normalizeResponse(rawData);

    return { day: dayMap[endpointType], success: true, data: normalized };
  } catch (error) {
    console.error(`❌ [${endpointType}] Network Error:`, error);
    return {
      day: dayMap[endpointType],
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

export async function POST(req: NextRequest) {
  if (!BASE_URL) {
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const { sign, timezone = 5.5 } = body;

    if (!sign) {
      return NextResponse.json(
        { success: false, error: "sign is required in body" },
        { status: 400 },
      );
    }

    const normalizedSign = sign.toLowerCase().trim();

    if (!VALID_SIGNS.includes(normalizedSign)) {
      return NextResponse.json(
        { success: false, error: `Invalid sign: ${sign}` },
        { status: 400 },
      );
    }

    // ✅ Parallel fetch
    const results = await Promise.all([
      fetchPrediction(normalizedSign, timezone, "previous"),
      fetchPrediction(normalizedSign, timezone, "current"),
      fetchPrediction(normalizedSign, timezone, "next"),
    ]);

    const responseData = {
      sign: normalizedSign,
      timezone,
      predictions: {
        yesterday: results.find((r) => r.day === "yesterday")?.data || null,
        today: results.find((r) => r.day === "today")?.data || null,
        tomorrow: results.find((r) => r.day === "tomorrow")?.data || null,
      },
      meta: {
        success: results.every((r) => r.success),
        errors: results
          .filter((r) => !r.success)
          .map((r) => ({ day: r.day, error: r.error })),
      },
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error("❌ Overall Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
