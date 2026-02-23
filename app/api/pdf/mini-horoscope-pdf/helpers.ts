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
      // 2. Log Failure Status
      console.error(`❌ [API FAIL] ${endpoint} (${duration}ms)`, {
        status: response.status,
        error: errorText,
      });

      throw new Error(
        `API ${endpoint} failed: ${response.status} - ${errorText}`,
      );
    }

    const json = await response.json();

    return json;
  } catch (error) {
    // 4. Log Catch-all Errors
    console.error(`💥 [API CRASH] ${endpoint}`, error);
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
// PDF Page Helpers (MINI / PREMIUM VERSION)
// ============================================

/**
 * Page Background - White with subtle corner watermarks
 * (Replaces old cream solid background)
 */
export function addPageBackground(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Clean white background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, "F");

  // Subtle watermark circles at bottom corners (matching pdf-pages style)
  doc.setDrawColor(245, 245, 245);
  doc.setLineWidth(0.5);
  for (let r = 10; r < 80; r += 15) {
    doc.circle(0, h, r, "S");
    doc.circle(w, h, r, "S");
  }
}

/**
 * Page Header - Orange badge/pill style
 * (Replaces old solid orange bar header)
 */
export function addPageHeader(doc: jsPDF, title: string): number {
  const w = doc.internal.pageSize.getWidth();
  const orange: [number, number, number] = [242, 114, 0];

  // Horizontal orange line
  doc.setDrawColor(orange[0], orange[1], orange[2]);
  doc.setLineWidth(0.8);
  doc.line(10, 20, w - 10, 20);

  // Center badge/pill with white fill
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const textW = doc.getTextWidth(title) + 20;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(orange[0], orange[1], orange[2]);
  doc.roundedRect(w / 2 - textW / 2, 14, textW, 12, 6, 6, "FD");

  // Title text
  doc.setTextColor(orange[0], orange[1], orange[2]);
  doc.text(title, w / 2, 22.5, { align: "center" });

  return 35; // Returns starting Y position after header
}

/**
 * Section Title - Compact with decorative wave line
 * (Replaces old underline style)
 */
export function addSectionTitle(
  doc: jsPDF,
  title: string,
  y: number,
  options?: { centerX?: number; fontSize?: number; align?: "center" | "left" },
): number {
  const w = doc.internal.pageSize.getWidth();
  const titleBlue: [number, number, number] = [30, 50, 100];
  const align = options?.align ?? "center";
  const fontSize = options?.fontSize ?? 11;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);

  if (align === "center") {
    const cx = options?.centerX ?? w / 2;
    doc.text(title, cx, y, { align: "center" });
    // Decorative wave underline
    drawDecoLine(doc, cx, y + 4);
  } else {
    doc.text(title, 14, y);
    // Decorative wave underline (left aligned)
    const textWidth = doc.getTextWidth(title);
    drawDecoLine(doc, 14 + textWidth / 2, y + 4);
  }

  return y + 12; // Return next Y position
}

/**
 * Decorative Wave Line (used in section titles)
 * Export for use in pdf-pages.ts
 */
export function drawDecoLine(doc: jsPDF, cx: number, y: number) {
  const maroon: [number, number, number] = [106, 26, 26];
  doc.setDrawColor(maroon[0], maroon[1], maroon[2]);
  doc.setLineWidth(0.4);

  // Left line
  doc.line(cx - 20, y, cx - 5, y);
  // Center wave
  doc.line(cx - 5, y, cx, y + 1.5);
  doc.line(cx, y + 1.5, cx + 5, y);
  // Right line
  doc.line(cx + 5, y, cx + 20, y);
}

/**
 * Corner Decoration - Smaller and subtler
 * (Replaces old larger corner decoration)
 */
export function drawCornerDecoration(
  doc: jsPDF,
  x: number,
  y: number,
  color: [number, number, number],
  flipX = false,
  flipY = false,
) {
  const size = 10; // Smaller than original (15 → 10)
  const dirX = flipX ? -1 : 1;
  const dirY = flipY ? -1 : 1;

  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.6);
  doc.line(x, y, x + size * dirX, y);
  doc.line(x, y, x, y + size * dirY);

  doc.setFillColor(color[0], color[1], color[2]);
  doc.circle(x + 5 * dirX, y + 5 * dirY, 1, "F");
}

// ============================================
// Footer Helper
// ============================================
export function addFooters(doc: jsPDF, personName: string) {
  const pageCount = doc.getNumberOfPages();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const orange: [number, number, number] = [242, 114, 0];

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Slim orange footer bar
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(0, h - 10, w, 10, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Astroweb | ${personName} | Page ${i} of ${pageCount}`,
      w / 2,
      h - 3.5,
      { align: "center" },
    );
  }
}

// ============================================
// Cover Page UI Helpers
// ============================================

export function getDevanagariImage(text: string, colorHex: string) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const fontSize = 50;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  const width = ctx.measureText(text).width + 40;
  const height = fontSize * 1.5;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = colorHex;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(text, width / 2, height / 2);

  return { data: canvas.toDataURL("image/jpeg", 1.0), w: width, h: height };
}

export function getGaneshaImage() {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 200, 200);

  // Golden Halo/Aura
  ctx.fillStyle = "#FFF4E6";
  ctx.beginPath();
  ctx.arc(100, 100, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Ears (Elephant ears)
  ctx.fillStyle = "#FADADD"; // Light pinkish
  ctx.beginPath();
  ctx.ellipse(55, 90, 35, 45, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(145, 90, 35, 45, Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.beginPath();
  ctx.arc(100, 95, 40, 0, Math.PI * 2);
  ctx.fill();

  // Trunk
  ctx.beginPath();
  ctx.moveTo(85, 110);
  ctx.quadraticCurveTo(80, 180, 130, 160);
  ctx.lineTo(130, 145);
  ctx.quadraticCurveTo(100, 155, 115, 110);
  ctx.fill();

  // Crown (Mukut)
  ctx.fillStyle = "#FFC000"; // Gold
  ctx.beginPath();
  ctx.moveTo(65, 65);
  ctx.lineTo(135, 65);
  ctx.lineTo(100, 15);
  ctx.fill();
  ctx.fillStyle = "#FF0000"; // Red gem
  ctx.beginPath();
  ctx.arc(100, 45, 6, 0, Math.PI * 2);
  ctx.fill();

  // Tilak
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(98, 75, 4, 15);

  return canvas.toDataURL("image/jpeg", 1.0);
}

// ============================================
// North Indian Chart Drawing
// ============================================

export function drawNorthIndianChart(
  doc: jsPDF,
  x: number,
  y: number,
  size: number,
  positions: Record<number, string[]>,
  signsOrChartType: Record<number, number> | string,
  chartType?: string,
) {
  let signs: Record<number, number> = {};
  if (typeof signsOrChartType === "string") {
    chartType = signsOrChartType;
  } else {
    signs = signsOrChartType || {};
  }
  const half = size / 2;

  // Color definitions
  const BG_COLOR = [255, 251, 190] as const; // #FFFBBE - Background
  const LINE_COLOR = [255, 202, 41] as const; // #FFCA29 - Lines
  const HOUSE_TEXT_COLOR = [255, 170, 79] as const; // #FFAA4F - House/Planet text
  const SIGN_NUMBER_COLOR = [63, 73, 100] as const; // #3F4964 - Sign numbers

  // 1. Fill Background
  doc.setFillColor(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2]);
  doc.rect(x, y, size, size, "F");

  // 2. Crisp Outer Border
  doc.setDrawColor(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2]);
  doc.setLineWidth(1.0);
  doc.rect(x, y, size, size);

  // 3. Draw Main Diagonals
  doc.setLineWidth(0.6);
  doc.line(x, y, x + size, y + size);
  doc.line(x + size, y, x, y + size);

  // 4. Draw Inner Diamond
  doc.line(x + half, y, x, y + half);
  doc.line(x, y + half, x + half, y + size);
  doc.line(x + half, y + size, x + size, y + half);
  doc.line(x + size, y + half, x + half, y);

  // 5. Coordinates for Planets
  const housePos: Record<number, { x: number; y: number }> = {
    1: { x: x + size * 0.5, y: y + size * 0.2 },
    2: { x: x + size * 0.28, y: y + size * 0.12 },
    3: { x: x + size * 0.12, y: y + size * 0.28 },
    4: { x: x + size * 0.2, y: y + size * 0.5 },
    5: { x: x + size * 0.12, y: y + size * 0.72 },
    6: { x: x + size * 0.28, y: y + size * 0.88 },
    7: { x: x + size * 0.5, y: y + size * 0.8 },
    8: { x: x + size * 0.72, y: y + size * 0.88 },
    9: { x: x + size * 0.88, y: y + size * 0.72 },
    10: { x: x + size * 0.8, y: y + size * 0.5 },
    11: { x: x + size * 0.88, y: y + size * 0.28 },
    12: { x: x + size * 0.72, y: y + size * 0.12 },
  };

  // 5. Corrected Coordinates for Sign Numbers (Orthogonal Offsets)
  const offset = 0.035; // 3.5% orthogonal offset from intersections
  const signPos: Record<number, { x: number; y: number }> = {
    1: { x: x + size * 0.5, y: y + size * (0.5 - offset) }, // Top Diamond (Above center)
    2: { x: x + size * 0.25, y: y + size * (0.25 - offset) }, // Top-Left (Above intersection)
    3: { x: x + size * (0.25 - offset), y: y + size * 0.25 }, // Top-Left (Left of intersection)
    4: { x: x + size * (0.5 - offset), y: y + size * 0.5 }, // Left Diamond (Left of center)
    5: { x: x + size * (0.25 - offset), y: y + size * 0.75 }, // Bottom-Left (Left of intersection)
    6: { x: x + size * 0.25, y: y + size * (0.75 + offset) }, // Bottom-Left (Below intersection)
    7: { x: x + size * 0.5, y: y + size * (0.5 + offset) }, // Bottom Diamond (Below center)
    8: { x: x + size * 0.75, y: y + size * (0.75 + offset) }, // Bottom-Right (Below intersection)
    9: { x: x + size * (0.75 + offset), y: y + size * 0.75 }, // Bottom-Right (Right of intersection)
    10: { x: x + size * (0.5 + offset), y: y + size * 0.5 }, // Right Diamond (Right of center)
    11: { x: x + size * (0.75 + offset), y: y + size * 0.25 }, // Top-Right (Right of intersection)
    12: { x: x + size * 0.75, y: y + size * (0.25 - offset) }, // Top-Right (Above intersection)
  };

  for (let house = 1; house <= 12; house++) {
    // A. Draw Sign Numbers
    const signNum = signs[house];
    if (signNum) {
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(
        SIGN_NUMBER_COLOR[0],
        SIGN_NUMBER_COLOR[1],
        SIGN_NUMBER_COLOR[2],
      );
      doc.text(String(signNum), signPos[house].x, signPos[house].y, {
        align: "center",
        baseline: "middle",
      });
    }

    // B. Draw Planets
    const planets = positions[house] || [];
    if (planets.length > 0) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(
        HOUSE_TEXT_COLOR[0],
        HOUSE_TEXT_COLOR[1],
        HOUSE_TEXT_COLOR[2],
      );
      const pos = housePos[house];

      if (planets.length <= 2) {
        doc.text(planets.join(" "), pos.x, pos.y, {
          align: "center",
          baseline: "middle",
        });
      } else if (planets.length <= 4) {
        const mid = Math.ceil(planets.length / 2);
        doc.text(planets.slice(0, mid).join(" "), pos.x, pos.y - 2, {
          align: "center",
          baseline: "middle",
        });
        doc.text(planets.slice(mid).join(" "), pos.x, pos.y + 4, {
          align: "center",
          baseline: "middle",
        });
      } else {
        const third = Math.ceil(planets.length / 3);
        doc.text(planets.slice(0, third).join(" "), pos.x, pos.y - 4, {
          align: "center",
          baseline: "middle",
        });
        doc.text(planets.slice(third, third * 2).join(" "), pos.x, pos.y + 1, {
          align: "center",
          baseline: "middle",
        });
        doc.text(planets.slice(third * 2).join(" "), pos.x, pos.y + 6, {
          align: "center",
        });
      }
    }
  }
}
// ============================================
// Quick Page Setup Helper
// ============================================

/**
 * Full Page Setup - Combines background + header in one call
 * Returns starting Y position after header
 */
export function setupPage(doc: jsPDF, title: string): number {
  addPageBackground(doc);
  return addPageHeader(doc, title);
}

// ============================================
// Local Image Loader (from public/basic_pdf_images)
// ============================================
import fs from "fs";
import path from "path";

const _imageCache: Record<string, string> = {};

/**
 * Loads an image from public/basic_pdf_images and returns it as a base64 Data URL.
 * Returns null if the image cannot be found.
 */
export function getLocalImageBase64(filename: string): string | null {
  if (_imageCache[filename]) return _imageCache[filename];

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "basic_pdf_images",
      filename,
    );
    if (!fs.existsSync(filePath)) {
      console.warn(`[MINI PDF IMAGE] Not found: ${filePath}`);
      return null;
    }
    const ext = path.extname(filename).toLowerCase();
    let mimeType = "image/jpeg";
    if (ext === ".png") mimeType = "image/png";
    else if (ext === ".webp") mimeType = "image/webp";

    const base64Data = fs.readFileSync(filePath).toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    _imageCache[filename] = dataUrl;
    return dataUrl;
  } catch (error) {
    console.error(`[MINI PDF IMAGE] Error loading ${filename}:`, error);
    return null;
  }
}
