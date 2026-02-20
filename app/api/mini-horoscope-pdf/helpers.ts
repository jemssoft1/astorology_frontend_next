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

const isDev = process.env.NODE_ENV === "development";

export async function fetchAPI(
  endpoint: string,
  data: BirthParams,
): Promise<any> {
  const url = `${BASE_URL}/api/${endpoint}`;
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API ${endpoint} failed: ${response.status} - ${errorText}`,
      );
    }

    const json = await response.json();

    return json;
  } catch (error) {
    console.error("❌ [API ERROR]", endpoint, error);
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
      `Astroweb | ${personName} | Page ${i} of ${pageCount}`,
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

// export function drawNorthIndianChart(
//   doc: jsPDF,
//   x: number,
//   y: number,
//   size: number,
//   positions: Record<number, string[]>,
//   signsOrChartType: Record<number, number> | string, // backwards-compatible
//   chartType?: string,
// ) {
//   // Handle old callers: drawNorthIndianChart(doc, x, y, size, positions, "D1")
//   let signs: Record<number, number> = {};
//   if (typeof signsOrChartType === "string") {
//     chartType = signsOrChartType;
//   } else {
//     signs = signsOrChartType || {};
//   }
//   const half = size / 2;

//   // 1. Outer Border
//   doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
//   doc.setLineWidth(0.8);
//   doc.rect(x, y, size, size);

//   // 2. Draw Main Diagonals (The "X" lines)
//   doc.line(x, y, x + size, y + size);
//   doc.line(x + size, y, x, y + size);

//   // 3. Draw Inner Diamond
//   doc.line(x + half, y, x, y + half);
//   doc.line(x, y + half, x + half, y + size);
//   doc.line(x + half, y + size, x + size, y + half);
//   doc.line(x + size, y + half, x + half, y);

//   // Chart Title
//   doc.setFontSize(10);
//   doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
//   doc.text(chartType || "", x + half, y + half + 2, { align: "center" });

//   // 4. Coordinates for Planets
//   const housePos: Record<number, { x: number; y: number }> = {
//     1: { x: x + half, y: y + size * 0.18 },
//     2: { x: x + size * 0.28, y: y + size * 0.15 },
//     3: { x: x + size * 0.12, y: y + size * 0.3 },
//     4: { x: x + size * 0.18, y: y + half },
//     5: { x: x + size * 0.12, y: y + size * 0.7 },
//     6: { x: x + size * 0.28, y: y + size * 0.85 },
//     7: { x: x + half, y: y + size * 0.82 },
//     8: { x: x + size * 0.72, y: y + size * 0.85 },
//     9: { x: x + size * 0.88, y: y + size * 0.7 },
//     10: { x: x + size * 0.82, y: y + half },
//     11: { x: x + size * 0.88, y: y + size * 0.3 },
//     12: { x: x + size * 0.72, y: y + size * 0.15 },
//   };

//   // 5. NEW: Coordinates for Sign Numbers (Inner corners)
//   const signPos: Record<number, { x: number; y: number }> = {
//     1: { x: x + half, y: y + size * 0.42 },
//     2: { x: x + size * 0.42, y: y + size * 0.3 },
//     3: { x: x + size * 0.3, y: y + size * 0.42 },
//     4: { x: x + size * 0.42, y: y + half + 2 },
//     5: { x: x + size * 0.3, y: y + size * 0.58 },
//     6: { x: x + size * 0.42, y: y + size * 0.7 },
//     7: { x: x + half, y: y + size * 0.58 },
//     8: { x: x + size * 0.58, y: y + size * 0.7 },
//     9: { x: x + size * 0.7, y: y + size * 0.58 },
//     10: { x: x + size * 0.58, y: y + half + 2 },
//     11: { x: x + size * 0.7, y: y + size * 0.42 },
//     12: { x: x + size * 0.58, y: y + size * 0.3 },
//   };

//   for (let house = 1; house <= 12; house++) {
//     // A. Draw Sign Numbers
//     const signNum = signs[house];
//     if (signNum) {
//       doc.setFontSize(10);
//       doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
//       doc.text(String(signNum), signPos[house].x, signPos[house].y, {
//         align: "center",
//       });
//     }

//     // B. Draw Planets
//     const planets = positions[house] || [];
//     if (planets.length > 0) {
//       doc.setFontSize(10);
//       doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
//       const pos = housePos[house];

//       if (planets.length <= 2) {
//         doc.text(planets.join(" "), pos.x, pos.y, { align: "center" });
//       } else {
//         const mid = Math.ceil(planets.length / 2);
//         doc.text(planets.slice(0, mid).join(" "), pos.x, pos.y - 2, {
//           align: "center",
//         });
//         doc.text(planets.slice(mid).join(" "), pos.x, pos.y + 3, {
//           align: "center",
//         });
//       }
//     }
//   }
// }
export function drawNorthIndianChart(
  doc: any, // or jsPDF based on your import
  x: number,
  y: number,
  size: number,
  positions: Record<number, string[]>,
  signsOrChartType: Record<number, number> | string, // backwards-compatible
  chartType?: string,
) {
  // Handle old callers: drawNorthIndianChart(doc, x, y, size, positions, "D1")
  let signs: Record<number, number> = {};
  if (typeof signsOrChartType === "string") {
    chartType = signsOrChartType;
  } else {
    signs = signsOrChartType || {};
  }
  const half = size / 2;

  // 1. Outer Border
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.8);
  doc.rect(x, y, size, size);

  // 2. Draw Main Diagonals (The "X" lines)
  doc.line(x, y, x + size, y + size);
  doc.line(x + size, y, x, y + size);

  // 3. Draw Inner Diamond
  doc.line(x + half, y, x, y + half);
  doc.line(x, y + half, x + half, y + size);
  doc.line(x + half, y + size, x + size, y + half);
  doc.line(x + size, y + half, x + half, y);

  // 4. Corrected Coordinates for Planets (Pushed towards the wider/outer areas)
  const housePos: Record<number, { x: number; y: number }> = {
    1: { x: x + size * 0.5, y: y + size * 0.18 },
    2: { x: x + size * 0.25, y: y + size * 0.12 },
    3: { x: x + size * 0.12, y: y + size * 0.25 },
    4: { x: x + size * 0.18, y: y + size * 0.5 },
    5: { x: x + size * 0.12, y: y + size * 0.75 },
    6: { x: x + size * 0.25, y: y + size * 0.88 },
    7: { x: x + size * 0.5, y: y + size * 0.82 },
    8: { x: x + size * 0.75, y: y + size * 0.88 },
    9: { x: x + size * 0.88, y: y + size * 0.75 },
    10: { x: x + size * 0.82, y: y + size * 0.5 },
    11: { x: x + size * 0.88, y: y + size * 0.25 },
    12: { x: x + size * 0.75, y: y + size * 0.12 },
  };

  // 5. Corrected Coordinates for Sign Numbers (Tucked neatly into inner corners)
  const signPos: Record<number, { x: number; y: number }> = {
    1: { x: x + size * 0.5, y: y + size * 0.36 },
    2: { x: x + size * 0.25, y: y + size * 0.22 },
    3: { x: x + size * 0.22, y: y + size * 0.25 },
    4: { x: x + size * 0.36, y: y + size * 0.5 },
    5: { x: x + size * 0.22, y: y + size * 0.75 },
    6: { x: x + size * 0.25, y: y + size * 0.78 },
    7: { x: x + size * 0.5, y: y + size * 0.64 },
    8: { x: x + size * 0.75, y: y + size * 0.78 },
    9: { x: x + size * 0.78, y: y + size * 0.75 },
    10: { x: x + size * 0.64, y: y + size * 0.5 },
    11: { x: x + size * 0.78, y: y + size * 0.25 },
    12: { x: x + size * 0.75, y: y + size * 0.22 },
  };

  for (let house = 1; house <= 12; house++) {
    // A. Draw Sign Numbers
    const signNum = signs[house];
    if (signNum) {
      doc.setFontSize(7);
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text(String(signNum), signPos[house].x, signPos[house].y, {
        align: "center",
      });
    }

    // B. Draw Planets
    const planets = positions[house] || [];
    if (planets.length > 0) {
      doc.setFontSize(7);
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      const pos = housePos[house];

      if (planets.length <= 2) {
        doc.text(planets.join(" "), pos.x, pos.y, { align: "center" });
      } else {
        const mid = Math.ceil(planets.length / 2);
        doc.text(planets.slice(0, mid).join(" "), pos.x, pos.y - 2, {
          align: "center",
        });
        doc.text(planets.slice(mid).join(" "), pos.x, pos.y + 3, {
          align: "center",
        });
      }
    }
  }
}
