import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_URL;

// All numerology endpoints
const ALL_ENDPOINTS = [
  {
    key: "numerological_numbers",
    path: "numerological_numbers",
    label: "All Numerological Numbers",
  },
  {
    key: "lifepath_number",
    path: "lifepath_number",
    label: "Life Path Number",
  },
  {
    key: "personality_number",
    path: "personality_number",
    label: "Personality Number",
  },
  {
    key: "expression_number",
    path: "expression_number",
    label: "Expression Number",
  },
  {
    key: "soul_urge_number",
    path: "soul_urge_number",
    label: "Soul Urge Number",
  },
  {
    key: "challenge_numbers",
    path: "challenge_numbers",
    label: "Challenge Numbers",
  },
  {
    key: "sub_conscious_self_number",
    path: "sub_conscious_self_number",
    label: "Subconscious Self Number",
  },
  {
    key: "personal_day",
    path: "personal_day_prediction",
    label: "Personal Day Prediction",
  },
  {
    key: "personal_month",
    path: "personal_month_prediction",
    label: "Personal Month Prediction",
  },
  {
    key: "personal_year",
    path: "personal_year_prediction",
    label: "Personal Year Prediction",
  },
];

interface RequestBody {
  day: number;
  month: number;
  year: number;
  name: string;
}

// Validate request body
function validateRequestBody(body: RequestBody): string | null {
  const { day, month, year, name } = body;

  if (!day || day < 1 || day > 31) return "Invalid day";
  if (!month || month < 1 || month > 12) return "Invalid month";
  if (!year || year < 1900 || year > 2100) return "Invalid year";
  if (!name || name.trim().length === 0) return "Name is required";

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

    const authHeader = req.headers.get("authorization");

    // Fetch all endpoints in parallel
    const promises = ALL_ENDPOINTS.map(async (endpoint) => {
      const data = await fetchEndpoint(endpoint.path, body, authHeader);
      return { key: endpoint.key, label: endpoint.label, data };
    });

    const results = await Promise.all(promises);

    // Organize results
    const organizedResults: Record<string, any> = {};
    for (const result of results) {
      organizedResults[result.key] = {
        label: result.label,
        data: result.data,
      };
    }

    return NextResponse.json(
      {
        success: true,
        birthDetails: {
          name: body.name,
          date: `${body.day}/${body.month}/${body.year}`,
        },
        data: organizedResults,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("❌ Numerology API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    );
  }
}

// GET method for API documentation
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Numerology API",
    usage: "POST /api/numerology",
    endpoints: ALL_ENDPOINTS.map((e) => ({ key: e.key, label: e.label })),
    bodySchema: {
      day: { type: "int", required: true, example: 15 },
      month: { type: "int", required: true, example: 8 },
      year: { type: "int", required: true, example: 1990 },
      name: { type: "string", required: true, example: "John Doe" },
    },
  });
}
