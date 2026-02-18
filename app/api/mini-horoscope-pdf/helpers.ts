// helpers.ts — PDF helper functions and API fetch utilities
import { jsPDF } from "jspdf";
import { COLORS } from "./constants";

const BASE_URL = process.env.BACKEND_URL;

// ============================================
// API Fetch Helper
// ============================================
export interface BirthParams {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
}

export async function fetchAPI(
  endpoint: string,
  data: BirthParams,
): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok)
      throw new Error(`API ${endpoint} failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export async function fetchAllMiniHoroscopeData(params: BirthParams) {
  const endpoints: Record<string, string> = {
    birth_details: "birth_details",
    astro_details: "astro_details",
    planets: "planets",
    planets_extended: "planets/extended",
    ghat_chakra: "ghat_chakra",
    panchang: "panchang",
    major_vdasha: "major_vdasha",
    current_vdasha: "current_vdasha",
    general_ascendant_report: "general_ascendant_report",
  };

  const keys = Object.keys(endpoints);
  const promises = keys.map((key) => fetchAPI(endpoints[key], params));
  const results = await Promise.allSettled(promises);

  const data: Record<string, any> = {};
  results.forEach((result, index) => {
    data[keys[index]] = result.status === "fulfilled" ? result.value : null;
  });
  return data;
}

export async function fetchSubDasha(
  planet: string,
  params: BirthParams,
): Promise<any> {
  return fetchAPI(`sub_vdasha/${planet}`, params);
}

// ============================================
// PDF Page Helpers
// ============================================
export function addPageBackground(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setFillColor(COLORS.cream[0], COLORS.cream[1], COLORS.cream[2]);
  doc.rect(0, 0, w, h, "F");
}

export function addPageHeader(doc: jsPDF, title: string) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, 0, w, 25, "F");
  doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, w / 2, 16, { align: "center" });
}

export function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  const w = doc.internal.pageSize.getWidth();
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, y);
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(1);
  doc.line(14, y + 2, w - 14, y + 2);
  return y + 10;
}

export function addFooters(doc: jsPDF, personName: string) {
  const pageCount = doc.getNumberOfPages();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.rect(0, h - 12, w, 12, "F");
    doc.setTextColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Western Astro | ${personName} | Page ${i} of ${pageCount}`,
      w / 2,
      h - 4,
      { align: "center" },
    );
  }
}

// ============================================
// Corner Decoration
// ============================================
export function drawCornerDecoration(
  doc: jsPDF,
  x: number,
  y: number,
  color: [number, number, number],
  flipX = false,
  flipY = false,
) {
  const size = 15;
  const dirX = flipX ? -1 : 1;
  const dirY = flipY ? -1 : 1;
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(1);
  doc.line(x, y, x + size * dirX, y);
  doc.line(x, y, x, y + size * dirY);
  doc.setFillColor(color[0], color[1], color[2]);
  doc.circle(x + 8 * dirX, y + 8 * dirY, 1.5, "F");
}

// ============================================
// North Indian Chart Drawing
// ============================================
export function drawNorthIndianChart(
  doc: jsPDF,
  x: number,
  y: number,
  size: number,
  planetPositions: Record<number, string[]>,
  chartLabel: string,
) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const halfSize = size / 2;

  // Background
  doc.setFillColor(COLORS.chartBg[0], COLORS.chartBg[1], COLORS.chartBg[2]);
  doc.rect(x, y, size, size, "F");

  // Border
  doc.setDrawColor(
    COLORS.chartLine[0],
    COLORS.chartLine[1],
    COLORS.chartLine[2],
  );
  doc.setLineWidth(2);
  doc.rect(x, y, size, size);

  // Inner diamond
  doc.setLineWidth(1.5);
  doc.line(centerX, y, x + size, centerY);
  doc.line(x + size, centerY, centerX, y + size);
  doc.line(centerX, y + size, x, centerY);
  doc.line(x, centerY, centerX, y);

  // Dividing lines
  doc.setLineWidth(1);
  doc.line(centerX, y, centerX, centerY);
  doc.line(x, y, centerX, centerY);
  doc.line(x + size, y, centerX, centerY);
  doc.line(centerX, y + size, centerX, centerY);
  doc.line(x, y + size, centerX, centerY);
  doc.line(x + size, y + size, centerX, centerY);

  // House positions
  const housePos: Record<number, { x: number; y: number }> = {
    12: { x: centerX - 20, y: y + 18 },
    1: { x: centerX + 15, y: y + 18 },
    2: { x: x + size - 25, y: y + halfSize * 0.45 },
    3: { x: x + size - 25, y: centerY + 5 },
    4: { x: x + size - 25, y: y + halfSize * 1.55 },
    5: { x: centerX + 15, y: y + size - 18 },
    6: { x: centerX - 20, y: y + size - 18 },
    7: { x: x + 8, y: y + halfSize * 1.55 },
    8: { x: x + 8, y: centerY + 5 },
    9: { x: x + 8, y: y + halfSize * 0.45 },
    10: { x: centerX - 15, y: centerY - 10 },
    11: { x: centerX + 10, y: centerY + 15 },
  };

  doc.setFontSize(7);
  for (let house = 1; house <= 12; house++) {
    const pos = housePos[house];
    if (!pos) continue;
    doc.setTextColor(
      COLORS.lightText[0],
      COLORS.lightText[1],
      COLORS.lightText[2],
    );
    doc.setFont("helvetica", "normal");
    doc.text(String(house), pos.x, pos.y - 2);
    const planets = planetPositions[house] || [];
    if (planets.length > 0) {
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(planets.join(" "), pos.x, pos.y + 8);
    }
  }

  // Center label
  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(chartLabel, centerX, centerY, { align: "center" });
}
