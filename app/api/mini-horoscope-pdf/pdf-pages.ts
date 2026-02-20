// pdf-pages.ts — Page rendering functions for Mini Horoscope PDF (Pages 1–9)
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ZODIAC_SIGNS,
  SIGN_LORDS,
  PLANET_SYMBOLS,
  DASHA_ORDER_PAGE5,
  DASHA_ORDER_PAGE6,
  COLORS,
  Labels,
  ASCENDANT_DATA,
  drawDecoLine,
} from "./constants";
import {
  addPageBackground,
  addPageHeader,
  addSectionTitle,
  drawCornerDecoration,
  drawNorthIndianChart,
} from "./helpers";

type Color3 = [number, number, number];

// Safe value extractor
function safeVal(obj: any, ...keys: string[]): string {
  if (!obj) return "N/A";
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null) return String(v);
  }
  return "N/A";
}

// ============================================================
// PAGE 1 — COVER PAGE
// ============================================================

function getDevanagariImage(text: string, colorHex: string) {
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

// ==========================================
// HELPER 2: Auto-Generate Ganesha Icon
// ==========================================
function getGaneshaImage() {
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

export function renderCoverPage(
  doc: any, // or jsPDF
  name: string,
  dob: string,
  tob: string,
  pob: string,
  lang: string,
  L: any, // Labels
) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // ==========================================
  // 1. ── DRAW BACKGROUND PATTERN ──
  // ==========================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, "F");

  // Subtle mandala/floral geometric background
  doc.setDrawColor(245, 245, 245);
  doc.setLineWidth(0.3);
  for (let x = 0; x <= w + 20; x += 30) {
    for (let y = 0; y <= h + 20; y += 30) {
      doc.circle(x, y, 10, "S");
      doc.circle(x, y, 15, "S");
      doc.circle(x, y, 22, "S");
    }
  }

  // ==========================================
  // 2. ── GANESHA IMAGE & MANTRA ──
  // ==========================================
  const cx = w / 2;

  // A. Draw Generated Ganesha Image
  const ganeshaData = getGaneshaImage();
  const imgSize = 55;
  if (ganeshaData) {
    // Agar future mein aapko apni asli image lagani ho, toh 'ganeshaData' ki jagah apni image ka path dal dijiyega
    doc.addImage(ganeshaData, "JPEG", cx - imgSize / 2, 25, imgSize, imgSize);
  }

  // B. Draw Hindi Mantra (॥ श्री गणेशाय नमः ॥)
  const mantraY = 25 + imgSize + 5;
  const mantraText = "॥ श्री गणेशाय नमः ॥";
  const mantraImg = getDevanagariImage(mantraText, "#E33510"); // Red color

  if (mantraImg) {
    const mH = 10;
    const mW = (mantraImg.w / mantraImg.h) * mH;
    doc.addImage(mantraImg.data, "JPEG", cx - mW / 2, mantraY, mW, mH);
  } else {
    // Canvas fail safe
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(227, 53, 16);
    doc.text("|| Shree Ganeshay Namah ||", cx, mantraY + 6, {
      align: "center",
    });
  }

  // ==========================================
  // 3. ── THE BRIGHT ORANGE CENTER BAND ──
  // ==========================================
  const bandY = 125;
  const bandH = 55;

  doc.setFillColor(232, 119, 0); // Exact bright orange from Image 1
  doc.rect(0, bandY, w, bandH, "F");

  // ==========================================
  // 4. ── TEXT INSIDE THE BAND (Center Aligned) ──
  // ==========================================
  let textY = bandY + 16;

  // "HOROSCOPE FOR"
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255); // White
  doc.text(L.title || "HOROSCOPE FOR", cx, textY, { align: "center" });

  // NAME
  textY += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(String(name).toUpperCase(), cx, textY, { align: "center" });

  // DATE AND TIME
  textY += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`${dob}    ${tob}`, cx, textY, { align: "center" });

  // PLACE OF BIRTH
  textY += 6;
  doc.text(String(pob), cx, textY, { align: "center" });

  // ==========================================
  // 5. ── FOOTER LOGO (astrologyAPI) ──
  // ==========================================
  const footerY = h - 35;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("generated by", cx, footerY, { align: "center" });

  // Custom multi-colored logo text like the screenshot
  const logoY = footerY + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  // "astrology" in Pink
  doc.setTextColor(219, 39, 119);
  doc.text("astrology", cx - 18, logoY, { align: "center" });

  // "API" in Blue
  doc.setTextColor(59, 130, 246);
  doc.text("API", cx + 22, logoY, { align: "center" });
}

// ============================================================
// PAGE 2 — BASIC ASTROLOGICAL DETAILS
// ============================================================

export function renderBasicDetailsPage(
  doc: any, // or jsPDF
  name: string,
  dob: string,
  tob: string,
  pob: string,
  lat: number,
  lon: number,
  tz: number,
  apiData: Record<string, any>,
  L: any, // Labels
) {
  doc.addPage();

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // ==========================================
  // 1. ── DRAW BACKGROUND & WATERMARK ──
  // ==========================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, "F");

  // Subtle watermark curves at bottom corners (like Image 1)
  doc.setDrawColor(245, 245, 245);
  doc.setLineWidth(0.5);
  for (let r = 10; r < 80; r += 10) {
    doc.circle(0, h, r, "S");
    doc.circle(w, h, r, "S");
  }

  // ==========================================
  // 2. ── PREMIUM TOP HEADER (Badge Style) ──
  // ==========================================
  const orange = [242, 114, 0];
  const titleBlue = [30, 50, 100]; // Dark blue for subheadings

  // Top line
  doc.setDrawColor(orange[0], orange[1], orange[2]);
  doc.setLineWidth(0.8);
  doc.line(10, 20, w - 10, 20);

  // Center Badge
  const titleText = L.basicDetails || "Basic Astrological Details";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const textW = doc.getTextWidth(titleText) + 20;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(w / 2 - textW / 2, 14, textW, 12, 6, 6, "FD"); // Fill white, Stroke orange

  doc.setTextColor(orange[0], orange[1], orange[2]);
  doc.text(titleText, w / 2, 22.5, { align: "center" });

  let y = 45;

  // ==========================================
  // 3. ── EXTRACT DATA ──
  // ==========================================
  const bd = apiData?.birth_details || {};
  const ad = apiData?.astro_details || {};
  const gd = apiData?.ghat_chakra || {};

  // ==========================================
  // 4. ── TABLE STYLING OPTIONS (Image 1 Style) ──
  // ==========================================
  const tableStyles = {
    theme: "plain" as const,
    styles: {
      cellPadding: 2.5,
      fontSize: 8,
      font: "helvetica",
    },
    bodyStyles: { textColor: [80, 80, 80] as [number, number, number] },
    columnStyles: {
      0: {
        fontStyle: "bold" as const,
        cellWidth: 35,
        textColor: [50, 50, 50] as [number, number, number],
      },
    },
    alternateRowStyles: {
      fillColor: [253, 238, 242] as [number, number, number],
    },
    margin: { top: 0, bottom: 0 },
  };

  const margin = 14;
  const gap = 15;
  const colW = (w - margin * 2 - gap) / 2;
  const col1X = margin;
  const col2X = margin + colW + gap;

  // ==========================================
  // 5. ── LEFT COLUMN: Basic Details & Ghat Chakra ──
  // ==========================================

  // -- A. Basic Details --
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text("Basic Details", col1X + colW / 2, y, { align: "center" });
  drawDecoLine(doc, col1X + colW / 2, y + 4);

  const basicRows = [
    ["Date of birth", dob],
    ["Time of birth", tob],
    ["Place of birth", pob],
    ["Latitude", String(lat)],
    ["Longitude", String(lon)],
    ["Timezone", String(tz)],
    ["Ayanamsha", String(bd?.ayanamsha || "N/A")],
    ["Sunrise", bd?.sunrise || "—"],
    ["Sunset", bd?.sunset || "—"],
  ];

  // Draw thin orange box ONLY around Basic Details (as seen in Image 1)
  doc.setDrawColor(orange[0], orange[1], orange[2]);
  doc.setLineWidth(0.3);
  doc.rect(col1X, y + 8, colW, basicRows.length * 6.5); // Approx height

  autoTable(doc, {
    ...tableStyles,
    startY: y + 8,
    margin: { left: col1X + 1, right: colW + gap }, // Small pad inside box
    tableWidth: colW - 2,
    body: basicRows,
    alternateRowStyles: { fillColor: [253, 238, 242] },
  });

  // @ts-expect-error
  let leftY = doc.lastAutoTable?.finalY + 15;

  // -- B. Ghat Chakra --
  if (gd && Object.keys(gd).length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
    doc.text("Ghat Chakra", col1X + colW / 2, leftY, { align: "center" });
    drawDecoLine(doc, col1X + colW / 2, leftY + 4);

    const ghatRows: string[][] = [];
    Object.entries(gd).forEach(([key, value]) => {
      if (key !== "statusCode" && key !== "status") {
        ghatRows.push([
          key.charAt(0).toUpperCase() + key.slice(1),
          String(value),
        ]);
      }
    });

    autoTable(doc, {
      ...tableStyles,
      startY: leftY + 10,
      margin: { left: col1X },
      tableWidth: colW,
      body: ghatRows,
    });
  }

  // ==========================================
  // 6. ── RIGHT COLUMN: Panchang & Astrological ──
  // ==========================================

  // -- C. Panchang Details --
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text("Panchang Details", col2X + colW / 2, y, { align: "center" });
  drawDecoLine(doc, col2X + colW / 2, y + 4);

  const panchangRows = [
    ["Tithi", ad?.Tithi || "—"],
    ["Yog", ad?.Yog || "—"],
    ["Nakshatra", ad?.Naksahtra || "—"],
    ["Karan", ad?.Karan || "—"],
  ];

  autoTable(doc, {
    ...tableStyles,
    startY: y + 10,
    margin: { left: col2X },
    tableWidth: colW,
    body: panchangRows,
  });

  // @ts-ignore
  let rightY = doc.lastAutoTable?.finalY + 15;

  // -- D. Astrological Details --
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text("Astrological Details", col2X + colW / 2, rightY, {
    align: "center",
  });
  drawDecoLine(doc, col2X + colW / 2, rightY + 4);

  const astroRows = [
    ["Varna", ad?.Varna || "—"],
    ["Vashya", ad?.Vashya || "—"],
    ["Yoni", ad?.Yoni || "—"],
    ["Gan", ad?.Gan || "—"],
    ["Nadi", ad?.Nadi || "—"],
    ["Sign", ad?.sign || "—"],
    ["Sign Lord", ad?.SignLord || "—"],
    ["Nakshatra", ad?.Naksahtra || "—"],
    ["Nakshatra Lord", ad?.NaksahtraLord || "—"],
    ["Charan", String(ad?.Charan || "—")],
    ["Yunja", ad?.yunja || "—"],
    ["Tatva", ad?.tatva || "—"],
    ["Name Alphabet", ad?.name_alphabet || "—"],
    ["Paya", ad?.paya || "—"],
    ["Ascendant", ad?.ascendant || "—"],
    ["Ascendant Lord", ad?.ascendant_lord || "—"],
  ];

  autoTable(doc, {
    ...tableStyles,
    startY: rightY + 10,
    margin: { left: col2X },
    tableWidth: colW,
    body: astroRows,
  });
}

// ==========================================
// HELPER: Convert Decimal Degree to DD:MM:SS
// ==========================================
function formatDegree(degDec: number | string): string {
  if (degDec === undefined || degDec === null || isNaN(Number(degDec)))
    return "—";
  const num = Number(degDec);
  const d = Math.floor(num);
  const m = Math.floor((num - d) * 60);
  const s = Math.floor(((num - d) * 60 - m) * 60);
  return `${String(d).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ==========================================
// HELPER: Draw Custom Planet Vector Icons
// ==========================================
function drawPlanetIcon(doc: any, name: string, cx: number, cy: number) {
  const n = name.toUpperCase();
  const c = [220, 85, 80]; // Coral Red color
  doc.setDrawColor(c[0], c[1], c[2]);
  doc.setFillColor(c[0], c[1], c[2]);
  doc.setLineWidth(0.8);

  if (n.includes("SUN")) {
    doc.circle(cx, cy, 2.5, "S");
    for (let i = 0; i < 8; i++) {
      const ang = (i * 45 * Math.PI) / 180;
      doc.line(
        cx + Math.cos(ang) * 3.5,
        cy + Math.sin(ang) * 3.5,
        cx + Math.cos(ang) * 5.5,
        cy + Math.sin(ang) * 5.5,
      );
    }
  } else if (n.includes("MOON")) {
    doc.circle(cx, cy, 4, "F");
    doc.setFillColor(255, 255, 255);
    doc.circle(cx + 1.5, cy - 1.5, 4, "F");
  } else if (n.includes("MARS")) {
    doc.circle(cx - 1.5, cy + 1.5, 2.5, "S");
    doc.line(cx + 0.5, cy - 0.5, cx + 3.5, cy - 3.5);
    doc.line(cx + 3.5, cy - 3.5, cx + 1, cy - 3.5);
    doc.line(cx + 3.5, cy - 3.5, cx + 3.5, cy - 1);
  } else if (n.includes("MERCURY")) {
    doc.circle(cx, cy, 2, "S");
    doc.line(cx, cy + 2, cx, cy + 5);
    doc.line(cx - 2, cy + 3.5, cx + 2, cy + 3.5);
    doc.ellipse(cx, cy - 2, 2, 1.5, "S");
    doc.setFillColor(255, 255, 255);
    doc.rect(cx - 3, cy - 3.5, 6, 1.5, "F");
  } else if (n.includes("JUPITER")) {
    doc.circle(cx, cy, 3.5, "S");
    doc.line(cx - 3, cy - 1.5, cx + 3, cy - 1.5);
    doc.line(cx - 3, cy + 1.5, cx + 3, cy + 1.5);
  } else if (n.includes("VENUS")) {
    doc.circle(cx, cy - 1.5, 2.5, "S");
    doc.line(cx, cy + 1, cx, cy + 5);
    doc.line(cx - 2, cy + 3, cx + 2, cy + 3);
  } else if (n.includes("SATURN")) {
    doc.circle(cx, cy, 2.5, "F");
    doc.setDrawColor(c[0], c[1], c[2]);
    doc.ellipse(cx, cy, 5.5, 1.5, "S");
  } else if (n.includes("RAHU")) {
    doc.ellipse(cx, cy, 3, 3, "S");
    doc.setFillColor(255, 255, 255);
    doc.rect(cx - 4, cy, 8, 4, "F");
    doc.setFillColor(c[0], c[1], c[2]);
    doc.circle(cx - 2.5, cy, 0.8, "S");
    doc.circle(cx + 2.5, cy, 0.8, "S");
  } else if (n.includes("KETU")) {
    doc.ellipse(cx, cy, 3, 3, "S");
    doc.setFillColor(255, 255, 255);
    doc.rect(cx - 4, cy - 4, 8, 4, "F");
    doc.setFillColor(c[0], c[1], c[2]);
    doc.circle(cx - 2.5, cy, 0.8, "S");
    doc.circle(cx + 2.5, cy, 0.8, "S");
  }
}

// ============================================================
// PAGE 3 — PLANETARY POSITIONS (Strict Single Page 3x3 Layout)
// ============================================================
export function renderPlanetaryPositionsPage(
  doc: any, // or jsPDF
  apiData: Record<string, any>,
  L: any, // Labels
) {
  doc.addPage();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // 1. ── BACKGROUND WATERMARK ──
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, "F");
  doc.setDrawColor(245, 245, 245);
  doc.setLineWidth(0.5);
  for (let r = 10; r < 100; r += 15) {
    doc.circle(0, h, r, "S");
    doc.circle(w, h, r, "S");
  }

  // 2. ── TOP HEADER (Badge Style) ──
  const orange = [242, 114, 0];
  doc.setDrawColor(orange[0], orange[1], orange[2]);
  doc.setLineWidth(0.8);
  doc.line(10, 18, w - 10, 18);

  const titleText = L.planetaryPositions || "Planetary Positions";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15); // Thoda chhota taaki upar fit ho
  const textW = doc.getTextWidth(titleText) + 16;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(w / 2 - textW / 2, 12, textW, 11, 5, 5, "FD");
  doc.setTextColor(orange[0], orange[1], orange[2]);
  doc.text(titleText, w / 2, 19.5, { align: "center" });

  // 3. ── EXTRACT PLANET DATA ──
  const planets = apiData.planets_extended || apiData.planets || [];
  const planetArray: any[] = Array.isArray(planets) ? planets : [];

  // 4. ── COMPACT PREMIUM TABLE ──
  const tableBody: string[][] = [];
  planetArray.forEach((p: any) => {
    const pName = p.name || p.Name || p.planet || "—";
    const retro =
      p.isRetro === true || p.isRetro === "true" || p.is_retro === true
        ? "Yes"
        : "--";
    const sign = p.sign || p.Sign || p.rpiSign || "—";
    const degreeVal = p.normDegree ?? p.fullDegree;
    const degStr = formatDegree(degreeVal);
    const signLord = p.signLord || p.sign_lord || "—";
    const naksh = p.nakshatra || p.Nakshatra || "—";
    const nakshLord = p.nakshatraLord || p.nakshatra_lord || "—";
    const house = p.house || p.House || "—";

    tableBody.push([
      pName,
      retro,
      sign,
      degStr,
      signLord,
      naksh,
      nakshLord,
      String(house),
    ]);
  });

  let y = 30; // Table starts slightly higher to save space

  if (tableBody.length > 0) {
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [
        [
          L.planet || "Planets",
          "R",
          L.sign || "Sign",
          L.degrees || "Degrees",
          L.signLord || "Sign Lord",
          L.nakshatra || "Nakshatra",
          L.nakshatraLord || "Nakshatra Lord",
          L.house || "House",
        ],
      ],
      body: tableBody,
      theme: "plain" as const,
      headStyles: {
        fillColor: [242, 114, 0],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 7.5, // Slightly smaller font
        halign: "left",
      },
      bodyStyles: { textColor: [80, 80, 80], fontSize: 7.5 },
      styles: { cellPadding: 2.2 }, // Tighter padding to shrink height
      alternateRowStyles: { fillColor: [253, 240, 243] },
      columnStyles: { 0: { fontStyle: "bold", textColor: [50, 50, 50] } },
    });
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 12; // Less gap after table
  }

  // 5. ── PLANET GRID (Strict 3x3 Layout) ──
  // Always exactly 9 planets for 3x3 Grid
  const gridPlanets = planetArray.slice(0, 9);

  const margin = 14;
  const gap = 6;
  const colCount = 3;
  const cardW = (w - margin * 2 - gap * (colCount - 1)) / colCount;
  const cardH = 26; // Adjusted height for strict single-page fit

  const getStatus = (pName: string) => {
    const n = pName.toUpperCase();
    if (["SUN", "MARS", "JUPITER"].includes(n))
      return { text: "Unfavorable", color: [220, 100, 100] };
    if (["MOON", "MERCURY"].includes(n))
      return { text: "Neutral", color: [100, 180, 220] };
    if (["VENUS", "SATURN"].includes(n))
      return { text: "Favorable", color: [100, 200, 140] };
    return { text: "--", color: [150, 150, 150] };
  };

  gridPlanets.forEach((p: any, index: number) => {
    const row = Math.floor(index / colCount);
    const col = index % colCount;
    const cx = margin + col * (cardW + gap);
    const cy = y + row * (cardH + gap);

    const pName = p.name || p.Name || p.planet || "—";
    const sign = p.sign || p.Sign || "—";
    const naksh = p.nakshatra || p.Nakshatra || "—";
    const status = getStatus(pName);

    // Draw Box
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cx, cy, cardW, cardH, 2, 2, "FD");

    // Icon on the left
    drawPlanetIcon(doc, pName, cx + 10, cy + 9);

    // Text: Name (Next to icon)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text(pName, cx + 20, cy + 6.5);

    // Text: Sign & Nakshatra
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(120, 120, 120);
    doc.text(sign, cx + 20, cy + 10.5);
    doc.text(naksh, cx + 20, cy + 14);

    // Text: Favorable / Unfavorable Status (Centered at bottom)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(status.color[0], status.color[1], status.color[2]);
    doc.text(status.text, cx + cardW / 2, cy + 22, { align: "center" });
  });
}
// ============================================================
// PAGE 4 — HOROSCOPE CHARTS
// ============================================================
export function renderChartsPage(
  doc: any, // or jsPDF
  apiData: Record<string, any>,
  L: any, // Labels
) {
  doc.addPage();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // ==========================================
  // 1. ── DRAW BACKGROUND & WATERMARK ──
  // ==========================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, "F");

  doc.setDrawColor(245, 245, 245);
  doc.setLineWidth(0.5);
  for (let r = 10; r < 100; r += 15) {
    doc.circle(0, h, r, "S");
    doc.circle(w, h, r, "S");
  }

  // ==========================================
  // 2. ── PREMIUM TOP HEADER (Badge Style) ──
  // ==========================================
  const orange = [242, 114, 0];
  const titleBlue = [30, 50, 100];

  doc.setDrawColor(orange[0], orange[1], orange[2]);
  doc.setLineWidth(0.8);
  doc.line(10, 20, w - 10, 20);

  const titleText = L.horoscopeCharts || "Horoscope Charts";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const textW = doc.getTextWidth(titleText) + 20;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(w / 2 - textW / 2, 14, textW, 12, 6, 6, "FD");
  doc.setTextColor(orange[0], orange[1], orange[2]);
  doc.text(titleText, w / 2, 22.5, { align: "center" });

  // ==========================================
  // 3. ── DATA EXTRACTION & MAPPING ──
  // ==========================================
  const planets = apiData?.planets_extended || apiData?.planets;
  const planetArray: any[] = Array.isArray(planets) ? planets : [];

  const ascendant =
    apiData?.astro_details?.ascendant ||
    apiData?.astro_details?.Ascendant ||
    "Aries";

  // Safe fallback for ZODIAC_SIGNS if not globally available
  const ZODIAC_SIGNS = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];
  const ascIdx = ZODIAC_SIGNS.findIndex(
    (s) => s.toLowerCase() === String(ascendant).toLowerCase(),
  );
  const lagnaHouse = ascIdx >= 0 ? ascIdx + 1 : 1;

  const PLANET_SYMBOLS: Record<string, string> = {
    SUN: "Su",
    MOON: "Mo",
    MARS: "Ma",
    MERCURY: "Me",
    JUPITER: "Ju",
    VENUS: "Ve",
    SATURN: "Sa",
    RAHU: "Ra",
    KETU: "Ke",
    URANUS: "Ur",
    NEPTUNE: "Ne",
    PLUTO: "Pl",
    ASCENDANT: "As",
  };

  const buildPositions = (signKey: string) => {
    const positions: Record<number, string[]> = {};
    for (let i = 1; i <= 12; i++) positions[i] = [];

    positions[lagnaHouse].push("As");

    planetArray.forEach((p: any) => {
      const pName = p.name || p.Name || p.planet || "";
      const signVal = p[signKey] || p.sign || p.Sign || "";

      let houseNum = 1;
      const signNum = Number(signVal);
      if (!isNaN(signNum) && signNum >= 1 && signNum <= 12) {
        houseNum = signNum;
      } else {
        const idx = ZODIAC_SIGNS.findIndex(
          (s) => s.toLowerCase() === String(signVal).toLowerCase(),
        );
        houseNum = idx >= 0 ? idx + 1 : 1;
      }

      const sym = PLANET_SYMBOLS[pName.toUpperCase()] || pName.substring(0, 2);
      const retro = p.isRetro === true || p.isRetro === "true" ? "(R)" : "";

      positions[houseNum].push(sym + retro);
    });

    return positions;
  };

  // ==========================================
  // 4. ── PREMIUM CHART LAYOUT ──
  // ==========================================
  let y = 45;
  const chartSize = 85; // Optimized size so 2 charts fit side by side comfortably
  const gap = 15;
  const sideMargin = (w - (chartSize * 2 + gap)) / 2;

  // Helper to draw a chart with Title & Deco Line
  const drawPremiumChartBox = (
    title: string,
    cx: number,
    cy: number,
    positions: any,
    label: string,
  ) => {
    // Section Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
    doc.text(title, cx + chartSize / 2, cy, { align: "center" });
    drawDecoLine(doc, cx + chartSize / 2, cy + 4);

    // Light Background Box for the Chart
    doc.setFillColor(253, 248, 242); // Very light cream/orange
    doc.setDrawColor(orange[0], orange[1], orange[2]);
    doc.setLineWidth(0.4);
    doc.rect(cx, cy + 10, chartSize, chartSize, "FD");

    // Call your existing North Indian Chart drawer
    // Make sure drawNorthIndianChart uses transparent background so the cream shows through!
    drawNorthIndianChart(doc, cx, cy + 10, chartSize, positions, label);
  };

  // Row 1: Lagna Chart (Left) & Moon Chart (Right)
  const lagnaPos = buildPositions("sign");
  drawPremiumChartBox("Lagna Chart (D-1)", sideMargin, y, lagnaPos, "D1");
  drawPremiumChartBox(
    "Moon Chart",
    sideMargin + chartSize + gap,
    y,
    lagnaPos,
    "Moon",
  );

  // Row 2: Navamsha Chart (Centered)
  y += chartSize + 30; // Move down
  const navPos = buildPositions("nakDegree");
  drawPremiumChartBox(
    "Navamsha Chart (D-9)",
    (w - chartSize) / 2,
    y,
    navPos,
    "D9",
  );

  // ==========================================
  // 5. ── CLEAN CENTERED LEGEND ──
  // ==========================================
  y += chartSize + 25;

  const legendText =
    "Su = Sun, Mo = Moon, Ma = Mars, Me = Mercury, Ju = Jupiter, Ve = Venus, Sa = Saturn, Ra = Rahu, Ke = Ketu, As = Ascendant, (R) = Retrograde";

  // Beautiful grey capsule for legend
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(14, y, w - 28, 12, 4, 4, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(legendText, w / 2, y + 7.5, { align: "center" });
}

// ============================================================
// PAGE 5 — VIMSHOTTARI DASHA I
// ============================================================

export function renderDashaPage1(
  doc: any, // or jsPDF
  apiData: Record<string, any>,
  subDashaData: Record<string, any>,
  L: any, // Labels
) {
  doc.addPage();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // ==========================================
  // 1. ── BACKGROUND WATERMARK ──
  // ==========================================
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, "F");
  doc.setDrawColor(245, 245, 245);
  doc.setLineWidth(0.5);
  for (let r = 10; r < 100; r += 15) {
    doc.circle(0, h, r, "S");
    doc.circle(w, h, r, "S");
  }

  // ==========================================
  // 2. ── TOP HEADER (Badge Style) ──
  // ==========================================
  const orange = [242, 114, 0];
  const titleBlue = [30, 50, 100]; // Dark blue for planet names
  const rowPink = [253, 240, 243]; // Light pink alternate row

  doc.setDrawColor(orange[0], orange[1], orange[2]);
  doc.setLineWidth(0.8);
  doc.line(10, 20, w - 10, 20);

  const titleText = L.vimshottariDasha1 || "Vimshottari Dasha - I";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const textW = doc.getTextWidth(titleText) + 20;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(w / 2 - textW / 2, 14, textW, 12, 6, 6, "FD");
  doc.setTextColor(orange[0], orange[1], orange[2]);
  doc.text(titleText, w / 2, 22.5, { align: "center" });

  // ==========================================
  // 3. ── DATA EXTRACTION ──
  // ==========================================
  const majorDasha = apiData?.major_vdasha;
  const dashaList = Array.isArray(majorDasha) ? majorDasha : [];

  // We process the planets array provided externally (e.g. DASHA_ORDER_PAGE5)
  // Assuming DASHA_ORDER_PAGE5 is available in scope or passed as param
  const planetsToRender =
    typeof DASHA_ORDER_PAGE5 !== "undefined"
      ? DASHA_ORDER_PAGE5
      : ["Mars", "Rahu", "Jupiter", "Saturn", "Mercury", "Ketu"];

  const margin = 14;
  const gap = 12; // Gap between columns
  const colWidth = (w - margin * 2 - gap * 2) / 3;
  const cols = [margin, margin + colWidth + gap, margin + (colWidth + gap) * 2];
  const colY = [35, 35, 35]; // Start Y position for each column

  // ==========================================
  // 4. ── RENDER COLUMNS ──
  // ==========================================
  planetsToRender.forEach((planet, idx) => {
    const col = idx % 3;
    const colX = cols[col];
    const centerColX = colX + colWidth / 2;
    let y = colY[col];

    // Page Break Logic
    if (y > h - 45) {
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, w, h, "F");

      doc.setDrawColor(orange[0], orange[1], orange[2]);
      doc.setLineWidth(0.8);
      doc.line(10, 20, w - 10, 20);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(w / 2 - textW / 2, 14, textW, 12, 6, 6, "FD");
      doc.setTextColor(orange[0], orange[1], orange[2]);
      doc.text(titleText + " (contd.)", w / 2, 22.5, { align: "center" });

      colY.fill(35);
      y = 35;
    }

    const dasha = dashaList.find(
      (d: any) =>
        (d.planet || d.Planet || d.name || "").toLowerCase() ===
        planet.toLowerCase(),
    );
    const startDate = dasha ? dasha.start || dasha.startDate || "" : "";
    const endDate = dasha ? dasha.end || dasha.endDate || "" : "";

    // -- A. Planet Header (Clean, borderless, centered) --
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
    doc.text(planet, centerColX, y + 10, { align: "center" });

    if (startDate || endDate) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);

      // Clean dates below planet name
      if (startDate)
        doc.text(startDate.replace("  ", " "), centerColX, y + 14, {
          align: "center",
        });
      if (endDate)
        doc.text(endDate.replace("  ", " "), centerColX, y + 17.5, {
          align: "center",
        });
    }

    // Divider Line under dates
    y += 21;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(colX + 5, y, colX + colWidth - 5, y);
    y += 4; // Gap before table

    // -- B. Antardasha Table (Striped, No borders) --
    const subData = subDashaData?.[planet];
    const subList = Array.isArray(subData) ? subData : [];

    if (subList.length > 0) {
      const tableBody = subList.map((s: any) => [
        s.planet || s.Planet || s.name || "—",
        (s.end || s.endDate || s.end_date || "—").replace("  ", " "), // Clean double spaces in dates
      ]);

      autoTable(doc, {
        startY: y,
        margin: { left: colX, right: 14 },
        tableWidth: colWidth,
        body: tableBody,
        theme: "plain", // Removes all borders
        bodyStyles: {
          fontSize: 7.5,
          cellPadding: 2,
        },
        alternateRowStyles: { fillColor: rowPink as [number, number, number] }, // Light pink stripes like Image 1
        columnStyles: {
          0: {
            fontStyle: "bold",
            textColor: titleBlue as [number, number, number],
            halign: "left",
          }, // Bold blue planet name
          1: { textColor: [100, 100, 100], halign: "right" }, // Grey date aligned right
        },
      });

      // @ts-expect-error - jsPDF autotable types don't expose finalY properly
      colY[col] = doc.lastAutoTable?.finalY + 15; // Save bottom position for next row in this column
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text("(data unavailable)", centerColX, y + 5, { align: "center" });
      colY[col] = y + 15;
    }
  });
}
// ============================================================
// PAGE 6 — VIMSHOTTARI DASHA II + CURRENT DASHA
// ============================================================

export function renderDashaPage2(
  doc: jsPDF,
  apiData: Record<string, any>,
  subDashaData: Record<string, any>,
  L: any,
  DASHA_ORDER_PAGE6: string[] = [
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
  ], // Fallback fallback if not defined outside
) {
  try {
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    doc.addPage();

    // ==========================================
    // BACKGROUND & WATERMARK
    // ==========================================
    // Light cream page background (optional, for warmer tone)
    doc.setFillColor(255, 254, 252);
    doc.rect(0, 0, w, h, "F");

    // NOTE: Agar aapke paas floral watermark ka Base64 code hai, toh usko yaha add karein.
    // Example:
    // const watermarkBase64 = "data:image/png;base64,iVBORw0KGgo...";
    // doc.addImage(watermarkBase64, "PNG", w/2 - 50, h/2 - 50, 100, 100, undefined, 'FAST');

    // ==========================================
    // HEADER DESIGN (Orange Theme)
    // ==========================================
    const title = L.vimshottariDasha2 || "Vimshottari Dasha - II";

    // Horizontal orange line
    doc.setDrawColor(239, 126, 34); // Orange color
    doc.setLineWidth(0.5);
    doc.line(15, 20, w - 15, 20);

    // Rounded Pill
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(w / 2 - 35, 14, 70, 12, 6, 6, "FD");

    // Text inside Pill
    doc.setTextColor(239, 126, 34);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, w / 2, 22, { align: "center" });

    // ==========================================
    // COLUMNS LAYOUT (3-Column Sub-Dashas)
    // ==========================================
    const majorDasha = apiData?.major_vdasha;
    const dashaList = Array.isArray(majorDasha) ? majorDasha : [];

    const margin = 15;
    const gap = 10;
    const colWidth = (w - margin * 2 - gap * 2) / 3;
    const cols = [
      margin,
      margin + colWidth + gap,
      margin + (colWidth + gap) * 2,
    ];
    let colY = [38, 38, 38];

    DASHA_ORDER_PAGE6.forEach((planet, idx) => {
      const col = idx % 3;
      const colX = cols[col];
      let y = colY[col];

      // Page Break logic
      if (y > h - 60) {
        doc.addPage();
        doc.setFillColor(255, 254, 252);
        doc.rect(0, 0, w, h, "F");

        doc.setDrawColor(239, 126, 34);
        doc.line(15, 20, w - 15, 20);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(w / 2 - 40, 14, 80, 12, 6, 6, "FD");
        doc.setTextColor(239, 126, 34);
        doc.text(title + " (contd.)", w / 2, 22, { align: "center" });

        colY.fill(38);
        y = 38;
      }

      const dasha = dashaList.find(
        (d: any) =>
          (d.planet || d.Planet || d.name || "").toLowerCase() ===
          planet.toLowerCase(),
      );

      const startDate = dasha ? dasha.start || dasha.startDate || "" : "";
      const endDate = dasha ? dasha.end || dasha.endDate || "" : "";

      // 1. Planet Name Heading
      doc.setFontSize(10);
      doc.setTextColor(34, 46, 93); // Dark Blue
      doc.setFont("helvetica", "bold");
      doc.text(planet.toUpperCase(), colX + colWidth / 2, y, {
        align: "center",
      });
      y += 4;

      // 2. Top Divider
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(colX, y, colX + colWidth, y);
      y += 5;

      // 3. Date Range
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(`${startDate}\n${endDate}`, colX + colWidth / 2, y, {
        align: "center",
        lineHeightFactor: 1.5,
      });
      y += 8;

      // 4. Bottom Divider
      doc.line(colX, y, colX + colWidth, y);
      y += 3;

      // 5. Sub-dasha autoTable
      const subData = subDashaData?.[planet];
      const subList = Array.isArray(subData) ? subData : [];

      if (subList.length > 0) {
        autoTable(doc, {
          startY: y,
          margin: { left: colX },
          tableWidth: colWidth,
          showHead: "never",
          body: subList.map((s: any) => [
            s.planet || s.Planet || s.name || "—",
            s.end || s.endDate || s.end_date || "—",
          ]),
          theme: "plain",
          styles: {
            cellPadding: { top: 2, bottom: 2, left: 1, right: 1 },
            fontSize: 8,
          },
          columnStyles: {
            0: { fontStyle: "bold", textColor: [106, 26, 26], halign: "left" }, // Maroon text for planets
            1: { halign: "right", textColor: [80, 80, 80] },
          },
          alternateRowStyles: {
            fillColor: [252, 238, 238], // Light Pink stripes
          },
        });

        // @ts-ignore
        colY[col] = doc.lastAutoTable.finalY + 12; // Gap before next planet block
      } else {
        colY[col] = y + 10;
      }
    });

    const finalY = Math.max(...colY) + 10;

    // ==========================================
    // FOOTER NOTE
    // ==========================================
    if (finalY < h - 20) {
      doc.setFontSize(9);
      doc.setTextColor(34, 46, 93);
      doc.setFont("helvetica", "bold");
      doc.text(
        "* NOTE : All the dates are indicating dasha end date.",
        15,
        finalY,
      );
    }
  } catch (error) {
    console.error("Error rendering Dasha Page 2: ", error);
  }
}
// ============================================================
// PAGE 7 — VIMSHOTTARI DASHA III + CURRENT DASHA
// ============================================================
export function renderDashaPage3(
  doc: jsPDF,
  apiData: Record<string, any>,
  subDashaData: Record<string, any>,
  L: any,
  DASHA_ORDER_PAGE6: string[] = ["Saturn", "Mercury", "Ketu"], // Fallback fallback if not defined outside
) {
  try {
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    doc.addPage();

    // ==========================================
    // BACKGROUND & WATERMARK
    // ==========================================
    // Light cream page background (optional, for warmer tone)
    doc.setFillColor(255, 254, 252);
    doc.rect(0, 0, w, h, "F");

    // NOTE: Agar aapke paas floral watermark ka Base64 code hai, toh usko yaha add karein.
    // Example:
    // const watermarkBase64 = "data:image/png;base64,iVBORw0KGgo...";
    // doc.addImage(watermarkBase64, "PNG", w/2 - 50, h/2 - 50, 100, 100, undefined, 'FAST');

    // ==========================================
    // HEADER DESIGN (Orange Theme)
    // ==========================================
    const title = L.vimshottariDasha3 || "Vimshottari Dasha - III";

    // Horizontal orange line
    doc.setDrawColor(239, 126, 34); // Orange color
    doc.setLineWidth(0.5);
    doc.line(15, 20, w - 15, 20);

    // Rounded Pill
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(w / 2 - 35, 14, 70, 12, 6, 6, "FD");

    // Text inside Pill
    doc.setTextColor(239, 126, 34);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, w / 2, 22, { align: "center" });

    // ==========================================
    // COLUMNS LAYOUT (3-Column Sub-Dashas)
    // ==========================================
    const majorDasha = apiData?.major_vdasha;
    const dashaList = Array.isArray(majorDasha) ? majorDasha : [];

    const margin = 15;
    const gap = 10;
    const colWidth = (w - margin * 2 - gap * 2) / 3;
    const cols = [
      margin,
      margin + colWidth + gap,
      margin + (colWidth + gap) * 2,
    ];
    let colY = [38, 38, 38];

    DASHA_ORDER_PAGE6.forEach((planet, idx) => {
      const col = idx % 3;
      const colX = cols[col];
      let y = colY[col];

      // Page Break logic
      if (y > h - 60) {
        doc.addPage();
        doc.setFillColor(255, 254, 252);
        doc.rect(0, 0, w, h, "F");

        doc.setDrawColor(239, 126, 34);
        doc.line(15, 20, w - 15, 20);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(w / 2 - 40, 14, 80, 12, 6, 6, "FD");
        doc.setTextColor(239, 126, 34);
        doc.text(title + " (contd.)", w / 2, 22, { align: "center" });

        colY.fill(38);
        y = 38;
      }

      const dasha = dashaList.find(
        (d: any) =>
          (d.planet || d.Planet || d.name || "").toLowerCase() ===
          planet.toLowerCase(),
      );

      const startDate = dasha ? dasha.start || dasha.startDate || "" : "";
      const endDate = dasha ? dasha.end || dasha.endDate || "" : "";

      // 1. Planet Name Heading
      doc.setFontSize(10);
      doc.setTextColor(34, 46, 93); // Dark Blue
      doc.setFont("helvetica", "bold");
      doc.text(planet.toUpperCase(), colX + colWidth / 2, y, {
        align: "center",
      });
      y += 4;

      // 2. Top Divider
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(colX, y, colX + colWidth, y);
      y += 5;

      // 3. Date Range
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(`${startDate}\n${endDate}`, colX + colWidth / 2, y, {
        align: "center",
        lineHeightFactor: 1.5,
      });
      y += 8;

      // 4. Bottom Divider
      doc.line(colX, y, colX + colWidth, y);
      y += 3;

      // 5. Sub-dasha autoTable
      const subData = subDashaData?.[planet];
      const subList = Array.isArray(subData) ? subData : [];

      if (subList.length > 0) {
        autoTable(doc, {
          startY: y,
          margin: { left: colX },
          tableWidth: colWidth,
          showHead: "never",
          body: subList.map((s: any) => [
            s.planet || s.Planet || s.name || "—",
            s.end || s.endDate || s.end_date || "—",
          ]),
          theme: "plain",
          styles: {
            cellPadding: { top: 2, bottom: 2, left: 1, right: 1 },
            fontSize: 8,
          },
          columnStyles: {
            0: { fontStyle: "bold", textColor: [106, 26, 26], halign: "left" }, // Maroon text for planets
            1: { halign: "right", textColor: [80, 80, 80] },
          },
          alternateRowStyles: {
            fillColor: [252, 238, 238], // Light Pink stripes
          },
        });

        // @ts-ignore
        colY[col] = doc.lastAutoTable.finalY + 12; // Gap before next planet block
      } else {
        colY[col] = y + 10;
      }
    });

    // ==========================================
    // CURRENT UNDERGOING DASHA SECTION
    // ==========================================
    let finalY = Math.max(...colY) + 10;

    // Page Break if needed
    if (finalY > h - 70) {
      doc.addPage();
      doc.setFillColor(255, 254, 252);
      doc.rect(0, 0, w, h, "F");
      finalY = 30;
    }

    // Title
    doc.setFontSize(14);
    doc.setTextColor(34, 46, 93); // Dark blue
    doc.setFont("helvetica", "bold");
    doc.text(L.currentDasha || "Current Undergoing Dasha", w / 2, finalY, {
      align: "center",
    });
    finalY += 4;

    // Decorative underline (Line with a small center break/design)
    doc.setDrawColor(106, 26, 26);
    doc.setLineWidth(0.5);
    doc.line(w / 2 - 25, finalY, w / 2 - 6, finalY);
    // Tiny decorative curve in center
    doc.line(w / 2 - 6, finalY, w / 2, finalY + 2);
    doc.line(w / 2, finalY + 2, w / 2 + 6, finalY);
    doc.line(w / 2 + 6, finalY, w / 2 + 25, finalY);
    finalY += 10;

    // Format Current Dasha Data accurately
    const currentDasha = apiData?.current_vdasha;
    if (currentDasha) {
      const rows: string[][] = [];

      const addRow = (label: string, obj: any) => {
        if (!obj) return;
        const planet = obj.planet || obj.Planet || "—";
        const start = obj.start || obj.startDate || "—";
        const end = obj.end || obj.endDate || "—";
        rows.push([label, planet, start, end]);
      };

      // Ensure proper object mapping matching our API logs
      addRow(
        L.mahadasha || "MAHADASHA",
        currentDasha.major || currentDasha.major_dasha,
      );
      addRow(
        L.antardasha || "ANTARDASHA",
        currentDasha.minor || currentDasha.sub_dasha,
      );
      addRow(
        "PRTYANTAR DASHA",
        currentDasha.sub_minor || currentDasha.sub_sub_dasha,
      );
      addRow(
        "SOOKSHM DASHA",
        currentDasha.sub_sub_minor || currentDasha.sub_sub_sub_dasha,
      );

      if (rows.length > 0) {
        autoTable(doc, {
          startY: finalY,
          margin: { left: 15, right: 15 },
          head: [
            [
              L.dashaName || "Dasha Name",
              L.planet || "Planets",
              L.startDate || "Start Date",
              L.endDate || "End Date",
            ],
          ],
          body: rows,
          theme: "plain",
          headStyles: {
            fillColor: [239, 126, 34], // Orange
            textColor: 255,
            fontStyle: "bold",
            halign: "left",
          },
          styles: {
            cellPadding: 4,
            fontSize: 9,
            textColor: [34, 46, 93], // Dark Blue Text
          },
          alternateRowStyles: {
            fillColor: [252, 238, 238], // Light Pink Stripes
          },
        });

        // @ts-ignore
        finalY = doc.lastAutoTable.finalY + 12;
      }
    }

    // ==========================================
    // FOOTER NOTE
    // ==========================================
    if (finalY < h - 20) {
      doc.setFontSize(9);
      doc.setTextColor(34, 46, 93);
      doc.setFont("helvetica", "bold");
      doc.text(
        "* NOTE : All the dates are indicating dasha end date.",
        15,
        finalY,
      );
    }
  } catch (error) {
    console.error("Error rendering Dasha Page 2: ", error);
  }
}
// ============================================================
// PAGE 8 — ASCENDANT REPORT
// ============================================================
export function renderAscendantPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: any,
  ZODIAC_SIGNS: string[] = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ],
  SIGN_LORDS: string[] = [
    "Mars",
    "Venus",
    "Mercury",
    "Moon",
    "Sun",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
    "Saturn",
    "Jupiter",
  ],
  ASCENDANT_DATA: Record<string, any> = {},
): string {
  try {
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    doc.addPage();

    // ==========================================
    // 1. BACKGROUND
    // ==========================================
    doc.setFillColor(255, 254, 252);
    doc.rect(0, 0, w, h, "F");

    // ==========================================
    // 2. HEADER DESIGN (Matches Image 1 exactly)
    // ==========================================
    const title = L.ascendantReport || "Ascendant Report";

    // Orange Line in background
    doc.setDrawColor(239, 126, 34);
    doc.setLineWidth(0.8);
    doc.line(15, 20, w - 15, 20);

    // Pill shape overlapping the line
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(239, 126, 34);
    doc.setLineWidth(0.5);
    doc.roundedRect(w / 2 - 40, 12, 80, 15, 7, 7, "FD"); // Fill and Outline

    // Header Text
    doc.setTextColor(239, 126, 34);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(title, w / 2, 22.5, { align: "center" });

    // ==========================================
    // 3. DATA PREPARATION
    // ==========================================
    const ascName =
      apiData?.astro_details?.ascendant ||
      apiData?.astro_details?.Ascendant ||
      "Aries";
    const meta = ASCENDANT_DATA[ascName] || ASCENDANT_DATA["Aries"] || {};
    const signIndex = ZODIAC_SIGNS.indexOf(ascName);
    const lord = SIGN_LORDS[signIndex] || "—";

    let currentY = 45;

    // ==========================================
    // 4. TOP SECTION: IMAGE (LEFT) & TABLE (RIGHT)
    // ==========================================

    // --- LEFT SIDE: ZODIAC IMAGE PLACEHOLDER ---
    // Make it subtler so it doesn't distract, keeping space for the actual image.
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.circle(45, currentY + 20, 20, "S");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text("(Image Placeholder)", 45, currentY + 22, { align: "center" });

    // --- RIGHT SIDE: ATTRIBUTES TABLE ---
    const tableStartX = w * 0.45; // Start exactly at 45% of page width
    const tableWidth = w * 0.45; // Take up the remaining space

    // Table Title
    doc.setFontSize(11);
    doc.setTextColor(34, 46, 93); // Dark Blue
    doc.setFont("helvetica", "bold");
    doc.text(`${title} - ${ascName}`, tableStartX + 5, currentY + 5);

    const charStr = [meta?.element, meta?.nature, meta?.direction]
      .filter(Boolean)
      .join(", ");

    const attrRows = [
      [L.lord || "Lord", lord],
      [L.symbol || "Symbol", meta?.symbol || "—"],
      [L.characteristics || "Characteristics", charStr || "—"],
      [L.luckyGem || "Lucky gems", meta?.luckyGem || "—"],
      [L.dayOfFast || "Day of fast", meta?.dayOfFast || "—"],
    ];

    autoTable(doc, {
      startY: currentY + 10,
      margin: { left: tableStartX },
      tableWidth: tableWidth,
      body: attrRows,
      theme: "plain", // No borders
      styles: {
        cellPadding: { top: 3.5, bottom: 3.5, left: 5, right: 5 },
        fontSize: 9.5,
      },
      columnStyles: {
        0: { cellWidth: 35, textColor: [34, 46, 93], fontStyle: "normal" }, // Narrow left column
        1: { textColor: [100, 100, 100], fontStyle: "normal" }, // Greyish text for values
      },
      alternateRowStyles: {
        fillColor: [253, 240, 240], // Very Light Pink matching Image 1
      },
    });

    // @ts-ignore
    currentY = Math.max(currentY + 60, doc.lastAutoTable.finalY + 20);

    // ==========================================
    // 5. SHLOKA SECTION
    // ==========================================
    const shlokaText =
      meta?.shloka ||
      "देहं रूपं च ज्ञानं च वर्णं चैव बलाबलम् |\nसुखं दुःखं स्वभावञ्च लग्नभावात्रिरीक्षयेत ||";

    if (shlokaText && shlokaText !== "—") {
      const shlokaLines = doc.splitTextToSize(shlokaText, w - 40);
      doc.setFontSize(15);
      doc.setTextColor(218, 83, 44); // Reddish-Orange
      doc.setFont("helvetica", "bold");
      doc.text(shlokaLines, w / 2, currentY, {
        align: "center",
        lineHeightFactor: 1.5,
      });
      currentY += shlokaLines.length * 8 + 15;
    }

    // ==========================================
    // 6. PERSONALITY SECTION (Text & Quote Block)
    // ==========================================
    let allParas: string[] = [];
    const apiReport =
      apiData?.general_ascendant_report?.asc_report?.report ||
      apiData?.general_ascendant_report?.report;

    if (apiReport && typeof apiReport === "string") {
      // Intelligently split the long paragraph into 3 blocks so the middle one becomes the "Quote"
      const sentences = apiReport
        .split(". ")
        .filter((s) => s.trim().length > 0);
      let p1 = sentences.slice(0, 3).join(". ") + ".";
      let p2 = sentences.slice(3, 5).join(". ") + ".";
      let p3 =
        sentences.slice(5).join(". ") + (sentences.length > 5 ? "." : "");

      if (p1.length > 2) allParas.push(p1);
      if (p2.length > 2) allParas.push(p2);
      if (p3.length > 2) allParas.push(p3);
    } else if (meta?.personality) {
      allParas = [...meta.personality];
    }

    allParas.forEach((para, index) => {
      if (!para || para.trim() === "") return;

      // Formatting logic
      const isQuote = index === 1;
      const textWidth = isQuote ? w - 55 : w - 30; // Quote has wider margins
      const lines = doc.splitTextToSize(para, textWidth);
      const blockH = lines.length * 6;

      // Page Break Handler
      if (currentY + blockH > h - 20) {
        doc.addPage();
        doc.setFillColor(255, 254, 252);
        doc.rect(0, 0, w, h, "F");

        doc.setDrawColor(239, 126, 34);
        doc.line(15, 20, w - 15, 20);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(w / 2 - 40, 12, 80, 15, 7, 7, "FD");
        doc.setTextColor(239, 126, 34);
        doc.setFontSize(16);
        doc.text(title + " (contd.)", w / 2, 22.5, { align: "center" });
        currentY = 45;
      }

      if (isQuote) {
        // --- QUOTE BLOCK STYLE ---
        const quoteBoxY = currentY;

        // 1. Thick Orange Left Border
        doc.setDrawColor(239, 126, 34);
        doc.setLineWidth(1.5);
        doc.line(20, quoteBoxY, 20, quoteBoxY + blockH);

        // 2. Large Quote Mark (Shifted right so it doesn't overlap text)
        doc.setTextColor(239, 126, 34);
        doc.setFontSize(26);
        doc.setFont("helvetica", "bold");
        doc.text('"', 25, quoteBoxY + 8);

        // 3. Italic Orange Text (Shifted completely clear of the quote mark)
        doc.setFontSize(10.5);
        doc.setFont("helvetica", "italic");
        doc.text(lines, 34, quoteBoxY + 6, { lineHeightFactor: 1.5 });

        currentY += blockH + 15; // Extra gap after quote
      } else {
        // --- NORMAL TEXT STYLE ---
        doc.setTextColor(80, 80, 80); // Dark grey
        doc.setFontSize(9.5);
        doc.setFont("helvetica", "normal");
        doc.text(lines, 15, currentY + 4, { lineHeightFactor: 1.6 });

        currentY += blockH + 10;
      }
    });

    return ascName;
  } catch (error) {
    console.error("Error rendering Ascendant Page: ", error);
    return "Aries";
  }
}
// ============================================================
// PAGE 9 — ASCENDANT ANALYSIS CONTINUED
// ============================================================
export function renderAscendantAnalysisPage(
  doc: jsPDF,
  ascName: string,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(
    doc,
    `${L.ascendantAnalysis || "Ascendant Analysis"} — ${ascName}`,
  );

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const meta = ASCENDANT_DATA[ascName] || ASCENDANT_DATA["Aries"];
  const lord = SIGN_LORDS[ZODIAC_SIGNS.indexOf(ascName)] || "—";
  let y = 34;

  // ── Helper: overflow-safe page break ──
  const safeNewPage = (sectionTitle: string) => {
    doc.addPage();
    addPageBackground(doc);
    addPageHeader(
      doc,
      `${L.ascendantAnalysis || "Ascendant Analysis"} — ${ascName} (contd.)`,
    );
    y = addSectionTitle(doc, sectionTitle, 34);
  };

  // ── Ruling Planet Importance ──
  y = addSectionTitle(doc, `${lord} — Importance for ${ascName}`, y);
  const impText = `As the ruling planet of ${ascName}, ${lord} plays a pivotal role in shaping the native's personality, health, and life direction. A well-placed ${lord} in the birth chart strengthens the ascendant and brings favorable results in the areas governed by the house it occupies. The strength, dignity, and aspects on ${lord} are crucial in determining the overall quality of life for ${ascName} ascendant natives.`;
  const impLines = doc.splitTextToSize(impText, w - 28);

  if (y + impLines.length * 5.2 + 12 > h - 18)
    safeNewPage(`${lord} — Importance for ${ascName}`);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.text(impLines, 14, y);
  y += impLines.length * 5.2 + 12;

  // ── Spiritual Lesson card ──
  if (y > h - 40) safeNewPage(L.spiritualLesson || "Spiritual Lesson");
  else
    y = addSectionTitle(
      doc,
      L.spiritualLesson || "Spiritual Lesson to Learn",
      y,
    );

  const spiritText = meta.spiritualLesson || "—";
  const spiritLines = doc.splitTextToSize(spiritText, w - 48);
  const spiritCardH = spiritLines.length * 6 + 14;

  doc.setFillColor(COLORS.chartBg[0], COLORS.chartBg[1], COLORS.chartBg[2]);
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y - 2, w - 28, spiritCardH, 4, 4, "FD");

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10.5);
  doc.setTextColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
  doc.text(spiritLines, w / 2, y + 7, { align: "center" });
  y += spiritCardH + 12;

  // ── Gold separator ──
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(0.8);
  doc.line(14, y, w - 14, y);
  y += 10;

  // ── Positive Traits ──
  if (y > h - 40) safeNewPage(L.positiveTraits || "Positive Traits");
  else y = addSectionTitle(doc, L.positiveTraits || "Positive Traits", y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  for (const trait of meta.positiveTraits || []) {
    if (y > h - 20) safeNewPage(L.positiveTraits || "Positive Traits (contd.)");

    doc.setFillColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.circle(18, y - 1.5, 1.8, "F");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(trait, 23, y);
    y += 8;
  }
  y += 6;

  // ── Gold separator ──
  if (y < h - 24) {
    doc.setDrawColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.setLineWidth(0.8);
    doc.line(14, y, w - 14, y);
    y += 10;
  }

  // ── Negative Traits ──
  if (y > h - 40) safeNewPage(L.negativeTraits || "Negative Traits");
  else y = addSectionTitle(doc, L.negativeTraits || "Negative Traits", y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  for (const trait of meta.negativeTraits || []) {
    if (y > h - 20) safeNewPage(L.negativeTraits || "Negative Traits (contd.)");

    doc.setFillColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
    doc.circle(18, y - 1.5, 1.8, "F");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(trait, 23, y);
    y += 8;
  }
}

// ============================================================
// PAGE 10 — DISCLAIMER
// ============================================================
export function renderDisclaimerPage(doc: jsPDF, L: Labels) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.disclaimer || "Disclaimer");

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  let y = 34;

  // ── Disclaimer box — dynamic height ──
  const disclaimerText = L.disclaimerText || "";
  const disclaimerLines = doc.splitTextToSize(disclaimerText, w - 60);
  const boxH = disclaimerLines.length * 5.5 + 36;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(1);
  doc.roundedRect(14, y, w - 28, boxH, 5, 5, "FD");

  y += 12;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
  doc.text(L.disclaimer || "Disclaimer", w / 2, y, { align: "center" });

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.text(disclaimerLines, 22, y);

  y += disclaimerLines.length * 5.5 + 18;

  // ── Gold separator ──
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(1.5);
  doc.line(40, y, w - 40, y);
  y += 12;

  // ── Brand card ──
  const brandCardH = 36;
  if (y + brandCardH < h - 16) {
    doc.setFillColor(COLORS.chartBg[0], COLORS.chartBg[1], COLORS.chartBg[2]);
    doc.setDrawColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(14, y, w - 28, brandCardH, 4, 4, "FD");

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(L.generatedBy || "Generated by Astroweb", w / 2, y, {
      align: "center",
    });

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(
      COLORS.lightText[0],
      COLORS.lightText[1],
      COLORS.lightText[2],
    );
    doc.text(L.contactInfo || "For queries, visit: www.astroweb.in", w / 2, y, {
      align: "center",
    });
  }
}
