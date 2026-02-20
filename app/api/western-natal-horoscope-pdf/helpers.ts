/* eslint-disable @typescript-eslint/no-explicit-any */
// helpers.ts — Data fetching and utilities for Western Natal Horoscope PDF

const BASE_URL = process.env.BACKEND_URL;

// All endpoints to call
const ALL_ENDPOINTS = [
  { key: "chart_data", path: "western_chart_data", label: "Birth Chart Data" },
  { key: "horoscope", path: "western_horoscope", label: "Western Horoscope" },
  { key: "planets", path: "planets/tropical", label: "Planetary Positions" },
  { key: "house_cusps", path: "house_cusps/tropical", label: "House Cusps" },
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
  "uranus",
  "neptune",
  "pluto",
  "chiron",
  "node",
  "lilith",
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
  name?: string;
  place?: string;
}

// Fetch single endpoint
async function fetchEndpoint(path: string, body: RequestBody): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/api/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// Fetch all Western data in parallel
export async function fetchWesternData(body: RequestBody) {
  const payload = {
    day: body.day,
    month: body.month,
    year: body.year,
    hour: body.hour,
    min: body.min,
    lat: body.lat,
    lon: body.lon,
    tzone: body.tzone,
    house_type: body.house_type || "placidus",
  };

  // 1. Fetch Basic Endpoints
  const basicPromises = ALL_ENDPOINTS.map(async (endpoint) => {
    const data = await fetchEndpoint(endpoint.path, payload);
    return { key: endpoint.key, data };
  });

  // 2. Fetch Planet Specific Reports (Sign + House)
  const planetPromises: Promise<any>[] = [];
  for (const planet of PLANETS) {
    for (const endpoint of PLANET_ENDPOINTS) {
      planetPromises.push(
        fetchEndpoint(`${endpoint.path}/${planet}`, payload).then((data) => ({
          key: `${endpoint.key}_${planet}`,
          planet,
          type: endpoint.key,
          data,
        })),
      );
    }
  }

  // Execute all
  const [basicResults, planetResults] = await Promise.all([
    Promise.all(basicPromises),
    Promise.all(planetPromises),
  ]);

  // Organize Data

  const data: Record<string, any> = {
    basic: {},
    planets: {},
  };

  basicResults.forEach((res) => {
    data.basic[res.key] = res.data;
  });

  // Initialize planets structure
  PLANETS.forEach((p) => {
    data.planets[p] = { sign_report: null, house_report: null };
  });

  planetResults.forEach((res) => {
    if (data.planets[res.planet]) {
      data.planets[res.planet][res.type] = res.data;
    }
  });

  return data;
}

// Helper to add background to PDF page (if needed)
export function addPageBackground(doc: any) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setFillColor(255, 255, 255); // White background
  doc.rect(0, 0, w, h, "F");
}

// Helper to add section title
export function addSectionTitle(doc: any, title: string, y: number) {
  doc.setFontSize(16);
  doc.setTextColor(200, 150, 50); // Gold
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, y);
  doc.setDrawColor(200, 150, 50);
  doc.line(20, y + 2, 80, y + 2);
}

// ═══════════════════════════════════════════════
//  HELPER: SAFE FIXED (to avoid .toFixed on undefined)
// ═══════════════════════════════════════════════
export function safeFixed(val: any, fractionDigits = 2): string {
  if (val === null || val === undefined || val === "") return "0.00";
  const num = parseFloat(val);
  return isNaN(num) ? "0.00" : num.toFixed(fractionDigits);
}
