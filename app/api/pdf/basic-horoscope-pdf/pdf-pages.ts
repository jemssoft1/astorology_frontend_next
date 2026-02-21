// pdf-pages.ts — Page rendering functions for Basic Horoscope PDF (Pages 1–13)
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ZODIAC_SIGNS,
  PLANET_SYMBOLS,
  COLORS,
  DIVISIONAL_CHARTS,
  DASHA_ORDER_PAGE7,
  NUMEROLOGY_FIELDS_EN,
  NUMEROLOGY_FIELDS_HI,
  HOUSE_CUSPS_DESCRIPTION_EN,
  HOUSE_CUSPS_DESCRIPTION_HI,
  ASCENDANT_DATA,
  PLANET_ID_MAP,
  GEM_COLORS,
  ZODIAC_GLYPHS,
  ZODIAC_LORDS,
} from "./constants";
import type { Labels } from "./constants";
import {
  addPageBackground,
  addPageHeader,
  addSectionTitle,
  drawNorthIndianChart,
} from "./helpers";

export interface AstroPlanet {
  name?: string;
  Name?: string;
  planet?: string | number;
  isRetro?: boolean | string;
  is_retro?: boolean;
  isRetrograde?: boolean;
  sign?: unknown;
  normDegree?: string;
  fullDegree?: string;
  norm_degree?: number;
  full_degree?: number;
  longitude?: { totalDegrees?: number };
  signLord?: string;
  sign_lord?: string;
  nakshatra?: string;
  Nakshatra?: string;
  nakshatraLord?: string;
  nakshatra_lord?: string;
  house?: string | number;
  House?: string | number;
  [key: string]: unknown;
}

export interface AstroApiData {
  astro_details?: Record<string, unknown>;
  ghat_chakra?: Record<string, unknown>;
  planets?: { data?: AstroPlanet[] } | AstroPlanet[];
  planets_extended?: AstroPlanet[];
  lagna?: { sign?: unknown };
  ascendant?: unknown;
  sadhesati_current_status?: Record<string, unknown> & {
    what_is_sadhesati?: string;
  };
  manglik?: Record<string, unknown>;
  simple_manglik?: Record<string, unknown>;
  kalsarpa_details?: Record<string, unknown>;
  basic_gem_suggestion?: Record<
    string,
    { name?: string; [key: string]: unknown }
  >;
  major_vdasha?: Record<string, unknown>;
  current_vdasha?: Record<string, unknown>;
  major_yogini_dasha?: Record<string, unknown>;
  sub_yogini_dasha?: Record<string, unknown>;
  current_yogini_dasha?: Record<string, unknown>;
  kp_house_cusps?: unknown[];
  numero_table?: unknown;
  numero_report?: unknown;
  numero_fav_time?: unknown;
  numero_fav_lord?: unknown;
  numero_fav_mantra?: unknown;
  [key: string]: unknown;
}

import { getLocalImageBase64 } from "./image-loader";

// Safe value extractor
function safeVal(
  obj: Record<string, unknown> | null | undefined,
  ...keys: string[]
): string {
  if (!obj) return "N/A";
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null) return String(v);
  }
  return "N/A";
}

// Section title at specific X
function addSectionTitleAt(
  doc: jsPDF,
  title: string,
  x: number,
  y: number,
): number {
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(title, x, y);
  return y + 6;
}

// ============================================================
// PAGE 1 — COVER PAGE
// ============================================================
export function renderCoverPage(
  doc: jsPDF, // or jsPDF
  name: string,
  dob: string,
  tob: string,
  pob: string,
  lang: string,
  L: Labels, // Labels
) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // ==========================================
  // 1. ── DRAW BACKGROUND PATTERN ──
  // ==========================================
  // Fill base white
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, "F");

  // Draw subtle mandala/floral geometric pattern
  doc.setDrawColor(242, 242, 242); // Very faint grey
  doc.setLineWidth(0.3);
  for (let x = 0; x <= w + 20; x += 25) {
    for (let y = 0; y <= h + 20; y += 25) {
      doc.circle(x, y, 8, "S");
      doc.circle(x, y, 12, "S");
      doc.circle(x, y, 18, "S");
      doc.line(x - 4, y, x + 4, y);
      doc.line(x, y - 4, x, y + 4);
    }
  }

  // ==========================================
  // 2. ── LORD GANESHA PLACEHOLDER & MANTRA ──
  // ==========================================
  const cx = w / 2;
  const cy = 70;

  // Premium Golden Mandala Placeholder (In place of Ganesha Image)
  const ganeshaImg = getLocalImageBase64("ganesh.png");
  if (ganeshaImg) {
    const imgSize = 75;
    doc.addImage(
      ganeshaImg,
      "PNG",
      cx - imgSize / 2,
      cy - imgSize / 2,
      imgSize,
      imgSize,
    );
  } else {
    // Fallback if image not found
    doc.setFillColor(255, 250, 240);
    doc.circle(cx, cy, 35, "F");

    const gold = [242, 175, 41];
    doc.setDrawColor(gold[0], gold[1], gold[2]);
    doc.setLineWidth(1.5);
    doc.circle(cx, cy, 32, "S");
    doc.setLineWidth(0.4);
    doc.circle(cx, cy, 28, "S");

    // Decorative petals around circle
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const px = cx + Math.cos(angle) * 35;
      const py = cy + Math.sin(angle) * 35;
      doc.setFillColor(gold[0], gold[1], gold[2]);
      doc.circle(px, py, 2, "F");
    }

    const omImg = getLocalImageBase64("Om.jpg");
    if (omImg) {
      doc.addImage(omImg, "JPEG", cx - 14, cy - 14, 28, 28);
    }
  }

  // Shree Ganeshay Namah Text
  const mantraY = cy + 45;
  const mantraText = "॥ श्री गणेशाय नमः ॥";

  const mantraImg = getDevanagariImage(mantraText, "#E33510", "#FFFFFF");
  if (mantraImg) {
    const mH = 10;
    const mW = (mantraImg.w / mantraImg.h) * mH;
    doc.addImage(mantraImg.data, "JPEG", cx - mW / 2, mantraY, mW, mH);
  } else {
    // Fallback if canvas fails
    const red = [227, 53, 16];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(red[0], red[1], red[2]);
    doc.text("|| Shree Ganeshay Namah ||", cx, mantraY + 6, {
      align: "center",
    });
  }

  // ==========================================
  // 3. ── THE GOLDEN HORIZONTAL BAND ──
  // ==========================================
  const bandY = 150;
  const bandH = 45;

  doc.setFillColor(242, 208, 145); // Exact golden/orange color from Image
  doc.rect(0, bandY, w, bandH, "F");

  // ==========================================
  // 4. ── TEXT INSIDE THE BAND (Right Aligned) ──
  // ==========================================
  const rightMargin = w - 25;
  let textY = bandY + 14;

  // "HOROSCOPE FOR"
  doc.setFont("helvetica", "normal");
  doc.setFontSize(18);
  doc.setTextColor(216, 90, 58); // Deep orange/red text
  doc.text(L.title || "HOROSCOPE FOR", rightMargin, textY, { align: "right" });

  // NAME
  textY += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(50, 50, 50); // Dark grey
  doc.text(String(name).toUpperCase(), rightMargin, textY, { align: "right" });

  // DATE AND TIME
  textY += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  doc.text(`${dob}    ${tob}`, rightMargin, textY, { align: "right" });

  // PLACE OF BIRTH
  textY += 5.5;
  doc.text(String(pob), rightMargin, textY, { align: "right" });

  // ==========================================
  // 5. ── FOOTER OPTIONAL (If needed) ──
  // ==========================================
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(L.generatedBy || "Generated by Astroweb", w / 2, h - 15, {
    align: "center",
  });
}

// ============================================================
// PAGE 2 — BASIC DETAILS
// ============================================================
export function renderBasicDetailsPage(
  doc: jsPDF,
  name: string,
  dob: string,
  tob: string,
  pob: string,
  lat: number,
  lon: number,
  tz: number,
  apiData: AstroApiData,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.basicDetails);

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const colWidth = (pageWidth - margin * 3) / 2;
  const startY = 34;
  const rowGap = 8;
  const col1X = margin;
  const col2X = margin + colWidth + margin;
  const astroDetails = apiData.astro_details;
  const ghatData = apiData.ghat_chakra;

  // Section 1: Basic Details
  const y1 = addSectionTitleAt(doc, `1. ${L.basicDetails}`, col1X, startY);
  const basicRows = [
    [L.name, name],
    [L.dob, dob],
    [L.tob, tob],
    [L.pob, pob],
    [L.latitude, String(lat)],
    [L.longitude, String(lon)],
    [L.timezone, String(tz)],
    [L.ayanamsa, safeVal(astroDetails, "ayanamsha", "Ayanamsha")],
  ];
  autoTable(doc, {
    startY: y1,
    margin: { left: col1X },
    tableWidth: colWidth,
    body: basicRows,
    theme: "grid",
    bodyStyles: { textColor: COLORS.text, fontSize: 8 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35, fillColor: COLORS.chartBg },
    },
    styles: { cellPadding: 2.5, lineColor: COLORS.accent, lineWidth: 0.3 },
  });

  // @ts-expect-error - lastAutoTable is added by jspdf-autotable plugin at runtime
  const row1Col1EndY = doc.lastAutoTable.finalY;

  // Section 2: Panchang
  const y2 = addSectionTitleAt(doc, `2. ${L.panchangDetails}`, col2X, startY);
  const panchangRows = [
    [L.tithi, safeVal(astroDetails, "Tithi", "tithi")],
    [L.nakshatra, safeVal(astroDetails, "Naksahtra", "nakshatra", "Nakshatra")],
    [L.yoga, safeVal(astroDetails, "Yog", "yoga", "Yoga")],
    [L.karana, safeVal(astroDetails, "Karan", "karana", "Karana")],
    [L.day, safeVal(astroDetails, "yunja", "Yunja")],
    [L.paksha, safeVal(astroDetails, "tatva", "Tatva")],
  ];
  autoTable(doc, {
    startY: y2,
    margin: { left: col2X },
    tableWidth: colWidth,
    body: panchangRows,
    theme: "grid",
    bodyStyles: { textColor: COLORS.text, fontSize: 8 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35, fillColor: COLORS.chartBg },
    },
    styles: { cellPadding: 2.5, lineColor: COLORS.accent, lineWidth: 0.3 },
  });

  // @ts-expect-error - lastAutoTable is added by jspdf-autotable plugin at runtime
  const row1Col2EndY = doc.lastAutoTable.finalY;
  const row2StartY = Math.max(row1Col1EndY, row1Col2EndY) + rowGap;

  // Section 3: Astro Details
  const y3 = addSectionTitleAt(doc, `3. ${L.astroDetails}`, col1X, row2StartY);
  const astroRows = [
    [L.ascendant, safeVal(astroDetails, "ascendant", "Ascendant")],
    [
      "Ascendant Lord",
      safeVal(astroDetails, "ascendant_lord", "AscendantLord"),
    ],
    [L.moonSign, safeVal(astroDetails, "sign", "Sign")],
    [L.rashiLord, safeVal(astroDetails, "SignLord", "sign_lord")],
    [L.nakshatra, safeVal(astroDetails, "Naksahtra", "nakshatra")],
    [L.nakshatraLord, safeVal(astroDetails, "NaksahtraLord", "nakshatraLord")],
    ["Charan (Pada)", safeVal(astroDetails, "Charan", "charan")],
    ["Varna", safeVal(astroDetails, "Varna", "varna")],
    ["Vashya", safeVal(astroDetails, "Vashya", "vashya")],
    ["Yoni", safeVal(astroDetails, "Yoni", "yoni")],
    ["Gan", safeVal(astroDetails, "Gan", "gan")],
    ["Nadi", safeVal(astroDetails, "Nadi", "nadi")],
  ];
  autoTable(doc, {
    startY: y3,
    margin: { left: col1X },
    tableWidth: colWidth,
    body: astroRows,
    theme: "grid",
    bodyStyles: { textColor: COLORS.text, fontSize: 8 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 35, fillColor: COLORS.chartBg },
    },
    styles: { cellPadding: 2.5, lineColor: COLORS.accent, lineWidth: 0.3 },
  });

  // Section 4: Ghat Chakra
  if (ghatData) {
    const y4 = addSectionTitleAt(doc, `4. ${L.ghatChakra}`, col2X, row2StartY);
    const ghatRows: string[][] = [];
    if (typeof ghatData === "object") {
      Object.entries(ghatData).forEach(([key, value]) => {
        if (key !== "statusCode" && key !== "status")
          ghatRows.push([key, String(value)]);
      });
    }
    if (ghatRows.length > 0) {
      autoTable(doc, {
        startY: y4,
        margin: { left: col2X },
        tableWidth: colWidth,
        body: ghatRows,
        theme: "grid",
        bodyStyles: { textColor: COLORS.text, fontSize: 8 },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 35, fillColor: COLORS.chartBg },
        },
        styles: { cellPadding: 2.5, lineColor: COLORS.accent, lineWidth: 0.3 },
      });
    }
  }
}

// ============================================================
// PAGE 3 — PLANETARY POSITIONS
// ============================================================
export function renderPlanetaryPositionsPage(
  doc: jsPDF,
  apiData: AstroApiData,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.planetaryPositions);

  const w = doc.internal.pageSize.getWidth();
  let y = 34;
  const planets = apiData.planets_extended || apiData.planets;
  const planetArray: AstroPlanet[] = Array.isArray(planets) ? planets : [];

  y = addSectionTitle(doc, `${L.planet} ${L.planetaryPositions}`, y);
  const tableBody: string[][] = [];
  planetArray.forEach((p: AstroPlanet) => {
    const pName = String(p.name || p.Name || p.planet || "—");
    const retro =
      p.isRetro === true || p.isRetro === "true" || p.is_retro === true
        ? "R"
        : "";
    const sign = String(p.sign || p.Sign || "—");
    const deg = p.normDegree
      ? `${parseFloat(p.normDegree).toFixed(2)}°`
      : p.fullDegree
        ? `${parseFloat(p.fullDegree).toFixed(2)}°`
        : "—";
    const signLord = p.signLord || p.sign_lord || "—";
    const naksh = p.nakshatra || p.Nakshatra || "—";
    const nakshLord = p.nakshatraLord || p.nakshatra_lord || "—";
    const house = p.house || p.House || "—";
    tableBody.push([
      pName,
      retro,
      sign,
      deg,
      signLord,
      naksh,
      nakshLord,
      String(house),
    ]);
  });

  if (tableBody.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [
        [
          L.planet,
          L.retrograde,
          L.sign,
          L.degrees,
          L.signLord,
          L.nakshatra,
          L.nakshatraLord,
          L.house,
        ],
      ],
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontStyle: "bold",
        fontSize: 8,
        halign: "center",
      },
      bodyStyles: { textColor: COLORS.text, fontSize: 8 },
      styles: {
        cellPadding: 3,
        halign: "center",
        lineColor: COLORS.accent,
        lineWidth: 0.3,
      },
      alternateRowStyles: { fillColor: [255, 250, 240] },
      columnStyles: {
        0: { halign: "left", fontStyle: "bold" },
        1: { cellWidth: 10 },
      },
    });

    // @ts-expect-error - lastAutoTable is added by jspdf-autotable plugin at runtime
    y = doc.lastAutoTable.finalY + 10;
  }

  // Planet Grid
  y = addSectionTitle(doc, L.planetGrid, y);
  const gridCols = 3;
  const cardW = (w - 40) / gridCols;
  const cardH = 28;
  let col = 0;
  planetArray.forEach((p: AstroPlanet) => {
    const pName = String(p.name || p.Name || p.planet || "—");
    const sign = p.sign || p.Sign || "—";
    const naksh = p.nakshatra || p.Nakshatra || "—";
    const cx = 14 + col * (cardW + 4);
    const cy = y;
    if (cy + cardH > doc.internal.pageSize.getHeight() - 20) return;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
    doc.roundedRect(cx, cy, cardW, cardH, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(pName, cx + 4, cy + 9);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(`${sign} - ${naksh}`, cx + 4, cy + 18);
    col++;
    if (col >= gridCols) {
      col = 0;
      y += cardH + 4;
    }
  });
}

// ============================================================
// PAGE 4 — HOROSCOPE CHARTS (Lagna, Moon, Navamsha)
// ============================================================

export function renderChartsPage(doc: jsPDF, apiData: AstroApiData, L: Labels) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.horoscopeCharts || "Horoscope Charts");

  const w = doc.internal.pageSize.getWidth();

  // Get planets data
  const rawPlanets = apiData.planets;
  const planets = Array.isArray(rawPlanets)
    ? rawPlanets
    : (rawPlanets?.data ?? apiData.planets_extended ?? []);
  const planetArray: AstroPlanet[] = Array.isArray(planets) ? planets : [];

  // ============ HELPER FUNCTIONS ============

  const getPlanetName = (p: AstroPlanet): string => {
    if (typeof p.planet === "number") {
      return PLANET_ID_MAP[p.planet] || `P${p.planet}`;
    }
    return p.name || p.Name || String(p.planet) || "Unknown";
  };

  const getSignNumber = (p: AstroPlanet): number => {
    if (p.sign && typeof p.sign === "object") {
      const signObj = p.sign as Record<string, unknown>;
      if (
        typeof signObj.id === "number" &&
        signObj.id >= 1 &&
        signObj.id <= 12
      ) {
        return signObj.id;
      }
      if (typeof signObj.sign_number === "number") {
        return signObj.sign_number;
      }
      if (typeof signObj.name === "number") {
        return signObj.name;
      }
      if (typeof signObj.name === "string") {
        const parsed = parseInt(signObj.name, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 12) {
          return parsed;
        }
        const idx = ZODIAC_SIGNS.findIndex(
          (s) => s.toLowerCase() === (signObj.name as string).toLowerCase(),
        );
        if (idx >= 0) return idx + 1;
      }
    }
    if (typeof p.sign === "number" && p.sign >= 1 && p.sign <= 12) {
      return p.sign;
    }
    if (typeof p.sign === "string") {
      const signStr = p.sign as string;
      const parsed = parseInt(signStr, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 12) {
        return parsed;
      }
      const idx = ZODIAC_SIGNS.findIndex(
        (s) => s.toLowerCase() === signStr.toLowerCase(),
      );
      return idx >= 0 ? idx + 1 : 1;
    }
    return 1;
  };

  const extractSignNumber = (signData: unknown): number => {
    if (typeof signData === "number" && signData >= 1 && signData <= 12) {
      return signData;
    }
    if (typeof signData === "string") {
      const parsed = parseInt(signData, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 12) {
        return parsed;
      }
      const idx = ZODIAC_SIGNS.findIndex(
        (s) => s.toLowerCase() === signData.toLowerCase(),
      );
      return idx >= 0 ? idx + 1 : 1;
    }
    if (typeof signData === "object" && signData !== null) {
      const signObj = signData as Record<string, unknown>;
      if (typeof signObj.id === "number") return signObj.id;
      if (typeof signObj.sign_number === "number") return signObj.sign_number;
      if (signObj.name !== undefined) return extractSignNumber(signObj.name);
    }
    return 1;
  };

  // ============ GET ASCENDANT AND MOON SIGNS ============

  // Get Lagna (Ascendant) Sign Number
  let lagnaSignNum = 1;
  if (apiData.astro_details?.ascendant !== undefined) {
    lagnaSignNum = extractSignNumber(apiData.astro_details.ascendant);
  } else if (apiData.lagna?.sign !== undefined) {
    lagnaSignNum = extractSignNumber(apiData.lagna.sign);
  } else if (apiData.ascendant !== undefined) {
    lagnaSignNum = extractSignNumber(apiData.ascendant);
  }

  // Get Moon Sign Number
  const moonPlanet = planetArray.find(
    (p: AstroPlanet) =>
      p.planet === 1 ||
      p.name?.toLowerCase() === "moon" ||
      p.Name?.toLowerCase() === "moon",
  );
  const moonSignNum = moonPlanet ? getSignNumber(moonPlanet) : 1;

  // ============ BUILD CHART POSITIONS AND SIGNS ============

  // Build Lagna Chart (D1) Positions
  const buildLagnaPositions = (): Record<number, string[]> => {
    const positions: Record<number, string[]> = {};
    for (let i = 1; i <= 12; i++) positions[i] = [];

    // Add Ascendant marker in Lagna (House 1)
    positions[1].push("As");

    planetArray.forEach((p: AstroPlanet) => {
      const planetName = getPlanetName(p);
      const signNum = getSignNumber(p);
      const sym = PLANET_SYMBOLS[planetName] || planetName.substring(0, 2);
      const retro = p.isRetrograde === true || p.is_retro === true ? "(R)" : "";

      // Calculate house number: Lagna sign becomes House 1
      const houseNum = ((signNum - lagnaSignNum + 12) % 12) + 1;

      if (positions[houseNum]) {
        positions[houseNum].push(sym + retro);
      }
    });

    return positions;
  };

  // Build Lagna Signs Mapping (House 1 = Lagna Sign, House 2 = Next Sign, etc.)
  const buildLagnaSigns = (): Record<number, number> => {
    const signs: Record<number, number> = {};
    for (let house = 1; house <= 12; house++) {
      // House 1 has lagnaSignNum, House 2 has next sign, etc.
      signs[house] = ((lagnaSignNum - 1 + house - 1) % 12) + 1;
    }
    return signs;
  };

  // Build Moon Chart Positions
  const buildMoonPositions = (): Record<number, string[]> => {
    const positions: Record<number, string[]> = {};
    for (let i = 1; i <= 12; i++) positions[i] = [];

    planetArray.forEach((p: AstroPlanet) => {
      const planetName = getPlanetName(p);
      const signNum = getSignNumber(p);

      // Calculate house relative to Moon's sign (Moon's sign becomes House 1)
      const houseNum = ((signNum - moonSignNum + 12) % 12) + 1;

      const sym = PLANET_SYMBOLS[planetName] || planetName.substring(0, 2);
      const retro = p.isRetrograde === true || p.is_retro === true ? "(R)" : "";

      if (positions[houseNum]) {
        positions[houseNum].push(sym + retro);
      }
    });

    // Add Ascendant relative to Moon
    const ascHouseInMoon = ((lagnaSignNum - moonSignNum + 12) % 12) + 1;
    if (positions[ascHouseInMoon]) {
      positions[ascHouseInMoon].push("As");
    }

    return positions;
  };

  // Build Moon Signs Mapping (House 1 = Moon Sign)
  const buildMoonSigns = (): Record<number, number> => {
    const signs: Record<number, number> = {};
    for (let house = 1; house <= 12; house++) {
      signs[house] = ((moonSignNum - 1 + house - 1) % 12) + 1;
    }
    return signs;
  };

  // Build Navamsha (D9) Positions
  const buildNavamshaPositions = (): Record<number, string[]> => {
    const positions: Record<number, string[]> = {};
    for (let i = 1; i <= 12; i++) positions[i] = [];

    planetArray.forEach((p: AstroPlanet) => {
      const planetName = getPlanetName(p);

      // Get degrees in sign (0-30)
      let degreesInSign = 0;
      const signObj =
        typeof p.sign === "object" && p.sign !== null
          ? (p.sign as Record<string, unknown>)
          : null;
      const signDegObj =
        typeof signObj?.degreesInSign === "object" &&
        signObj.degreesInSign !== null
          ? (signObj.degreesInSign as Record<string, unknown>)
          : null;
      if (typeof signDegObj?.totalDegrees === "number") {
        degreesInSign = signDegObj.totalDegrees;
      } else if (p.longitude?.totalDegrees !== undefined) {
        degreesInSign = p.longitude.totalDegrees % 30;
      } else if (p.norm_degree !== undefined) {
        degreesInSign = p.norm_degree;
      } else if (p.full_degree !== undefined) {
        degreesInSign = p.full_degree % 30;
      }

      const signNum = getSignNumber(p);

      // Calculate Navamsha division (1-9)
      const navamshaNum = Math.floor(degreesInSign / (30 / 9)) + 1;
      const clampedNavamshaNum = Math.min(Math.max(navamshaNum, 1), 9);

      // Navamsha starting sign based on sign element
      const signElement = (signNum - 1) % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
      const startSigns = [1, 10, 7, 4];
      const startSign = startSigns[signElement];

      const navamshaSignNum =
        ((startSign - 1 + clampedNavamshaNum - 1) % 12) + 1;

      const sym = PLANET_SYMBOLS[planetName] || planetName.substring(0, 2);
      const retro = p.isRetrograde === true || p.is_retro === true ? "(R)" : "";

      if (positions[navamshaSignNum]) {
        positions[navamshaSignNum].push(sym + retro);
      }
    });

    // Add Navamsha Ascendant
    if (apiData.astro_details?.ascendant_degree !== undefined) {
      const ascDegree = Number(apiData.astro_details.ascendant_degree) % 30;
      const ascNavamshaNum = Math.floor(ascDegree / (30 / 9)) + 1;
      const clampedAscNavamsha = Math.min(Math.max(ascNavamshaNum, 1), 9);

      const signElement = (lagnaSignNum - 1) % 4;
      const startSigns = [1, 10, 7, 4];
      const startSign = startSigns[signElement];

      const navamshaAscSign =
        ((startSign - 1 + clampedAscNavamsha - 1) % 12) + 1;
      if (positions[navamshaAscSign]) {
        positions[navamshaAscSign].push("As");
      }
    }

    return positions;
  };

  // Build Navamsha Signs Mapping (Simple 1-12 for now)
  const buildNavamshaSigns = (): Record<number, number> => {
    const signs: Record<number, number> = {};
    for (let house = 1; house <= 12; house++) {
      // Calculate based on navamsha ascendant if available, else 1-12
      if (apiData.astro_details?.ascendant_degree !== undefined) {
        const ascDegree = Number(apiData.astro_details.ascendant_degree) % 30;
        const ascNavamshaNum = Math.floor(ascDegree / (30 / 9)) + 1;
        const signElement = (lagnaSignNum - 1) % 4;
        const startSigns = [1, 10, 7, 4];
        const startSign = startSigns[signElement];
        const navamshaAsc = ((startSign - 1 + ascNavamshaNum - 1) % 12) + 1;
        signs[house] = ((navamshaAsc - 1 + house - 1) % 12) + 1;
      } else {
        signs[house] = house;
      }
    }
    return signs;
  };

  // ============ CHART LAYOUT ============
  const chartSize = 85;
  const gap = 15;
  const row1Y = 40;
  const row1X1 = (w - (chartSize * 2 + gap)) / 2;
  const row1X2 = row1X1 + chartSize + gap;
  const row2Y = row1Y + chartSize + 25;
  const row2X = (w - chartSize) / 2;

  // ============ DRAW LAGNA CHART (D1) ============
  const lagnaPos = buildLagnaPositions();
  const lagnaSigns = buildLagnaSigns(); // ⭐ Signs banaye

  drawNorthIndianChart(
    doc,
    row1X1,
    row1Y,
    chartSize,
    lagnaPos,
    lagnaSigns, // ⭐ Signs pass kiye
    "D1",
  );

  doc.setFontSize(10);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.setFont("helvetica", "bold");
  doc.text(
    L.lagnaChart || "Lagna Chart (D1)",
    row1X1 + chartSize / 2,
    row1Y + chartSize + 10,
    { align: "center" },
  );

  // ============ DRAW MOON CHART ============
  const moonPos = buildMoonPositions();
  const moonSigns = buildMoonSigns(); // ⭐ Signs banaye

  drawNorthIndianChart(
    doc,
    row1X2,
    row1Y,
    chartSize,
    moonPos,
    moonSigns, // ⭐ Signs pass kiye
    "Moon",
  );

  doc.text(
    L.moonChart || "Moon Chart",
    row1X2 + chartSize / 2,
    row1Y + chartSize + 10,
    { align: "center" },
  );

  // ============ DRAW NAVAMSHA CHART (D9) ============
  const navPos = buildNavamshaPositions();
  const navSigns = buildNavamshaSigns(); // ⭐ Signs banaye

  drawNorthIndianChart(
    doc,
    row2X,
    row2Y,
    chartSize,
    navPos,
    navSigns, // ⭐ Signs pass kiye
    "D9",
  );

  doc.text(
    L.navamshaChart || "Navamsha Chart (D9)",
    row2X + chartSize / 2,
    row2Y + chartSize + 10,
    { align: "center" },
  );

  // Legend
  const y = row2Y + chartSize + 25;
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(
    COLORS.lightText[0],
    COLORS.lightText[1],
    COLORS.lightText[2],
  );

  const legendText =
    "Su=Sun, Mo=Moon, Ma=Mars, Me=Mercury, Ju=Jupiter, Ve=Venus, Sa=Saturn, Ra=Rahu, Ke=Ketu, As=Ascendant, (R)=Retrograde";
  const legendLines = doc.splitTextToSize(legendText, w - 28);
  doc.text(legendLines, w / 2, y, { align: "center" });
}
// ============================================================
// PAGE 5 — DIVISIONAL CHARTS (3×3 grid)
// ============================================================

export function getDivisionalChartPositions(chartData: unknown): {
  positions: Record<number, string[]>;
  signs: Record<number, number>;
} {
  const positions: Record<number, string[]> = {};
  const signs: Record<number, number> = {};
  // Default empty arrays and fallback signs
  for (let h = 1; h <= 12; h++) {
    positions[h] = [];
    signs[h] = 1;
  }

  if (Array.isArray(chartData)) {
    chartData.forEach((rawEntry: unknown, index: number) => {
      // Narrow type to a record so we can safely access properties
      const entry =
        rawEntry !== null && typeof rawEntry === "object"
          ? (rawEntry as Record<string, unknown>)
          : ({} as Record<string, unknown>);

      // 1. Array index + 1 determines the house number directly
      let houseNum = Number(entry.house || entry.House);
      if (isNaN(houseNum) || houseNum < 1 || houseNum > 12) {
        houseNum = index + 1; // 0th item = House 1, 1st item = House 2
      }

      // 2. Extract Sign (Rashi) Number directly from API
      if (entry.sign) {
        signs[houseNum] = Number(entry.sign);
      }

      // 3. Extract Planets (API directly gives planet_small array)
      if (Array.isArray(entry.planet_small) && entry.planet_small.length > 0) {
        entry.planet_small.forEach((pStr: string) => {
          const sym = String(pStr).trim();
          if (sym && !sym.toLowerCase().includes("asc")) {
            positions[houseNum].push(sym);
          }
        });
      }
      // Fallback: If planet_small is missing but planet array is there
      else if (Array.isArray(entry.planet)) {
        entry.planet.forEach((pStr: string) => {
          const pName = String(pStr).trim();
          if (pName && !pName.toLowerCase().includes("asc")) {
            // Accessing global PLANET_SYMBOLS or making a 2-letter substring
            const sym = PLANET_SYMBOLS?.[pName] || pName.substring(0, 2);
            positions[houseNum].push(sym);
          }
        });
      }
    });
  } else if (chartData && typeof chartData === "object") {
    // Handle object-format chart data (Fallback just in case)
    Object.entries(chartData as Record<string, unknown>).forEach(
      ([key, val]) => {
        if (key === "statusCode" || key === "status") return;
        const houseNum = Number(key);
        if (!isNaN(houseNum) && houseNum >= 1 && houseNum <= 12) {
          const valObj =
            val !== null && typeof val === "object"
              ? (val as Record<string, unknown>)
              : ({} as Record<string, unknown>);

          if (valObj.sign) signs[houseNum] = Number(valObj.sign);

          const planets = Array.isArray(valObj.planet_small)
            ? valObj.planet_small
            : Array.isArray(val)
              ? (val as unknown[])
              : [val];

          planets.forEach((p: AstroPlanet) => {
            const pStr = String(
              typeof p === "string" ? p : p?.name || p?.planet || "",
            );
            if (pStr && !pStr.toLowerCase().includes("asc")) {
              const cleanSym = pStr.trim();
              const sym =
                PLANET_SYMBOLS?.[cleanSym] || cleanSym.substring(0, 2);
              positions[houseNum].push(sym);
            }
          });
        }
      },
    );
  }

  return { positions, signs };
}

export function renderDivisionalChartsPage(
  doc: jsPDF,
  apiData: AstroApiData,
  lang: string,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.divisionalCharts || "Divisional Charts");

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const margin = 10;
  const gap = 6;
  const cols = 3;
  const rows = 3;
  const chartW = (w - margin * 2 - gap * (cols - 1)) / cols;
  const availH = h - 35 - 15; // header + footer
  const chartH = (availH - gap * (rows - 1)) / rows;
  const chartSize = Math.min(chartW - 4, chartH - 18);

  for (let i = 0; i < DIVISIONAL_CHARTS.length && i < 9; i++) {
    const cfg = DIVISIONAL_CHARTS[i];
    const row = Math.floor(i / cols);
    const col = i % cols;
    const cx = margin + col * (chartW + gap);
    const cy = 32 + row * (chartH + gap);

    // Get both positions and signs
    const chartData = apiData[`horo_chart_${cfg.apiChart}`];
    const { positions, signs } = getDivisionalChartPositions(chartData);

    // Draw chart and pass the signs map
    const label = cfg.apiChart === "SUN" ? "Sun" : cfg.apiChart;
    drawNorthIndianChart(
      doc,
      cx + (chartW - chartSize) / 2,
      cy,
      chartSize,
      positions,
      signs, // NEW: passing signs here
      label,
    );

    // Title below chart
    const title = lang === "hi" ? cfg.titleHi : cfg.title;
    const subtitle = lang === "hi" ? cfg.subtitleHi : cfg.subtitle;
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(title, cx + chartW / 2, cy + chartSize + 6, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(
      COLORS.lightText[0],
      COLORS.lightText[1],
      COLORS.lightText[2],
    );
    doc.text(subtitle, cx + chartW / 2, cy + chartSize + 11, {
      align: "center",
    });
  }
}

// ============================================================
// PAGE 7 — VIMSHOTTARI DASHA I (3×2 grid)
// ============================================================

export function renderHouseCuspsPage(
  doc: jsPDF, // jsPDF
  apiData: AstroApiData,
  lang: string,
  L: Labels, // Labels type
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.houseCusps || "House Cusps and Sandhi");

  const w = doc.internal.pageSize.getWidth();
  let y = 34;
  const cuspsData = apiData.kp_house_cusps;

  // Show Ascendant and Midheaven
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);

  // Checking ascendant degree from array format or fallback
  let ascDeg = "—";
  let mcDeg = "—";
  if (Array.isArray(cuspsData)) {
    const ascHouse = cuspsData.find(
      (h: unknown) =>
        h !== null &&
        typeof h === "object" &&
        (h as Record<string, unknown>).house_id === 1,
    ) as Record<string, unknown> | undefined;
    const mcHouse = cuspsData.find(
      (h: unknown) =>
        h !== null &&
        typeof h === "object" &&
        (h as Record<string, unknown>).house_id === 10,
    ) as Record<string, unknown> | undefined;
    if (ascHouse)
      ascDeg = String(
        ascHouse.formatted_degree || ascHouse.cusp_full_degree || "—",
      );
    if (mcHouse)
      mcDeg = String(
        mcHouse.formatted_degree || mcHouse.cusp_full_degree || "—",
      );
  } else {
    ascDeg = safeVal(cuspsData, "ascendant", "Ascendant", "asc_degree") || "—";
    mcDeg = safeVal(cuspsData, "midheaven", "Midheaven", "mc_degree") || "—";
  }

  doc.text(`${L.ascendantLabel || "Ascendant"} - ${ascDeg}`, 14, y);
  doc.text(`${L.midheavenLabel || "Midheaven"} - ${mcDeg}`, w / 2, y);
  y += 10;

  // Build house cusps table dynamically based on API format
  const tableBody: string[][] = [];

  if (Array.isArray(cuspsData)) {
    // Naya Array format (jo aapne bheja hai)
    cuspsData.forEach((rawHouseData: unknown) => {
      const houseData =
        rawHouseData !== null && typeof rawHouseData === "object"
          ? (rawHouseData as Record<string, unknown>)
          : ({} as Record<string, unknown>);
      const h = String(houseData.house_id || "");
      const sign = String(houseData.sign || "—");
      const bhavMadhya = String(
        houseData.formatted_degree || houseData.cusp_full_degree || "—",
      );
      // Sandhi aapke data mein abhi nahi hai, toh gracefully "—" dikhayega
      const sandhi = String(
        houseData.sandhi ||
          houseData.bhav_sandhi ||
          houseData.end_degree ||
          "—",
      );

      tableBody.push([h, sign, bhavMadhya, sign, sandhi]);
    });
  } else {
    // Purana Object Format (Fallback ke liye)
    for (let h = 1; h <= 12; h++) {
      const houseData =
        cuspsData?.[`house_${h}`] || cuspsData?.[String(h)] || {};
      const houseDataRecord =
        typeof houseData === "object" && houseData !== null
          ? (houseData as Record<string, unknown>)
          : null;
      const sign = houseDataRecord
        ? safeVal(houseDataRecord, "sign", "Sign", "rpiSign")
        : String(houseData);
      const bhavMadhya = houseDataRecord
        ? safeVal(
            houseDataRecord,
            "formatted_degree",
            "degree",
            "cusp_degree",
            "bhav_madhya",
          )
        : "—";
      const sandhi = houseDataRecord
        ? safeVal(houseDataRecord, "sandhi", "bhav_sandhi", "end_degree")
        : "—";

      tableBody.push([
        String(h),
        sign || "—",
        bhavMadhya || "—",
        sign || "—",
        sandhi || "—",
      ]);
    }
  }

  // Draw the Table
  autoTable(doc, {
    startY: y,
    head: [
      [
        L.house || "House",
        L.sign || "Sign",
        L.bhavMadhya || "Bhav Madhya",
        L.sign || "Sign", // Often sign lord is kept here, keeping as per your layout
        L.bhavSandhi || "Bhav Sandhi",
      ],
    ],
    body: tableBody,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { textColor: COLORS.text, fontSize: 8 },
    styles: {
      cellPadding: 2.5,
      halign: "center",
      lineColor: COLORS.accent,
      lineWidth: 0.3,
    },
    alternateRowStyles: { fillColor: [255, 250, 240] },
  });

  // @ts-expect-error - lastAutoTable is added by jspdf-autotable plugin at runtime
  y = doc.lastAutoTable.finalY + 8;

  // Chalit Chart section
  y = addSectionTitle(doc, L.chalitChart || "Chalit Chart", y);
  const chalitData = apiData.horo_chart_chalit;

  // Naya bulletproof extraction function chalit chart ke liye
  const { positions, signs } = getDivisionalChartPositions(chalitData);

  const chartSize = 75;
  const chartX = 14;
  const chartY = y;

  // Draw chart with perfectly aligned numbers and planets
  drawNorthIndianChart(
    doc,
    chartX,
    chartY,
    chartSize,
    positions,
    signs,
    "Chalit",
  );

  // Description text
  const textX = chartX + chartSize + 10;
  const textW = w - textX - 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const descText =
    lang === "hi" ? HOUSE_CUSPS_DESCRIPTION_HI : HOUSE_CUSPS_DESCRIPTION_EN;
  const descLines = doc.splitTextToSize(descText, textW);
  doc.text(descLines, textX, chartY + 8);
}
export function renderVimshottariDasha1Page(
  doc: jsPDF,
  apiData: AstroApiData,
  subDashaData: AstroApiData,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.vimshottariDasha1);

  const w = doc.internal.pageSize.getWidth();
  const majorDasha = apiData.major_vdasha;

  const dashaList = Array.isArray(majorDasha) ? majorDasha : [];
  const margin = 10;
  const gap = 6;
  const colWidth = (w - margin * 2 - gap * 2) / 3;
  const cols = [margin, margin + colWidth + gap, margin + (colWidth + gap) * 2];
  const colY = [34, 34, 34];

  DASHA_ORDER_PAGE7.forEach((planet, idx) => {
    const col = idx % 3;
    let y = colY[col];
    const colX = cols[col];
    const dasha = dashaList.find(
      (d: Record<string, unknown>) =>
        String(d.planet || d.Planet || d.name || "").toLowerCase() ===
        planet.toLowerCase(),
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    const startD = dasha
      ? dasha.start || dasha.startDate || dasha.start_date || ""
      : "";
    const endD = dasha
      ? dasha.end || dasha.endDate || dasha.end_date || ""
      : "";
    doc.text(planet, colX, y);
    if (startD || endD) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.text(`${startD} - ${endD}`, colX, y + 4);
    }
    y += 8;

    const subData = subDashaData[planet];
    const subList = Array.isArray(subData) ? subData : [];
    if (subList.length > 0) {
      autoTable(doc, {
        startY: y,
        margin: { left: colX },
        tableWidth: colWidth,
        head: [[L.planet, L.startDate, L.endDate]],
        body: subList.map((s: Record<string, unknown>) => [
          String(s.planet || s.Planet || s.name || "—"),
          String(s.start || s.startDate || s.start_date || "—"),
          String(s.end || s.endDate || s.end_date || "—"),
        ]),
        theme: "grid",
        headStyles: {
          fillColor: COLORS.accent,
          textColor: COLORS.white,
          fontSize: 6,
          cellPadding: 1.2,
        },
        bodyStyles: { textColor: COLORS.text, fontSize: 6, cellPadding: 1.2 },
        styles: { lineColor: COLORS.accent, lineWidth: 0.2 },
        alternateRowStyles: { fillColor: [255, 250, 240] },
      });

      // @ts-expect-error - lastAutoTable is added by jspdf-autotable plugin at runtime
      colY[col] = doc.lastAutoTable.finalY + 6;
    } else {
      colY[col] = y + 4;
    }
  });
}

// ============================================================
// PAGE 8 — VIMSHOTTARI DASHA II + CURRENT DASHA
// ============================================================
export function renderVimshottariDasha2Page(
  doc: jsPDF,
  apiData: AstroApiData,
  subDashaData: AstroApiData,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.vimshottariDasha2);

  const colY = [34, 34, 34];

  // Current Dasha section
  let y = Math.max(...colY);
  if (y > doc.internal.pageSize.getHeight() - 70) {
    doc.addPage();
    addPageBackground(doc);
    y = 30;
  }
  y = addSectionTitle(doc, L.currentDasha, y + 4);
  const currentDasha = apiData.current_vdasha;
  // Prefer current_vdasha (flat structure with planet/start/end)
  // over current_vdasha_all (has dasha_period arrays, not directly usable)
  const src = currentDasha;

  if (src) {
    const rows: string[][] = [];
    // API field names: major, minor, sub_minor, sub_sub_minor, sub_sub_sub_minor
    const md = (src.major || src.major_dasha || src.mahadasha || {}) as Record<
      string,
      unknown
    >;
    if (md.planet || md.Planet) {
      rows.push([
        L.mahadasha,
        String(md.planet || md.Planet || "—"),
        String(md.start || md.startDate || "—"),
        String(md.end || md.endDate || "—"),
      ]);
    }
    const ad = (src.minor || src.sub_dasha || src.antardasha || {}) as Record<
      string,
      unknown
    >;
    if (ad.planet || ad.Planet) {
      rows.push([
        L.antardasha,
        String(ad.planet || ad.Planet || "—"),
        String(ad.start || ad.startDate || "—"),
        String(ad.end || ad.endDate || "—"),
      ]);
    }
    const pd = (src.sub_minor ||
      src.sub_sub_dasha ||
      src.pratyantardasha ||
      {}) as Record<string, unknown>;
    if (pd.planet || pd.Planet) {
      rows.push([
        L.pratyantarDasha || "Prtyantar Dasha",
        String(pd.planet || pd.Planet || "—"),
        String(pd.start || pd.startDate || "—"),
        String(pd.end || pd.endDate || "—"),
      ]);
    }
    const sd = (src.sub_sub_minor ||
      src.sub_sub_sub_dasha ||
      src.sookshm ||
      {}) as Record<string, unknown>;
    if (sd.planet || sd.Planet) {
      rows.push([
        L.sookshmDasha || "Sookshm Dasha",
        String(sd.planet || sd.Planet || "—"),
        String(sd.start || sd.startDate || "—"),
        String(sd.end || sd.endDate || "—"),
      ]);
    }
    const prd = (src.sub_sub_sub_minor || {}) as Record<string, unknown>;
    if (prd.planet || prd.Planet) {
      rows.push([
        "Pran Dasha",
        String(prd.planet || prd.Planet || "—"),
        String(prd.start || prd.startDate || "—"),
        String(prd.end || prd.endDate || "—"),
      ]);
    }
    if (rows.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [[L.dashaName, L.planet, L.startDate, L.endDate]],
        body: rows,
        theme: "grid",
        headStyles: {
          fillColor: COLORS.darkRed,
          textColor: COLORS.white,
          fontStyle: "bold",
          fontSize: 9,
        },
        bodyStyles: {
          textColor: COLORS.text,
          fontSize: 9,
          fillColor: COLORS.highlight,
        },
        styles: { cellPadding: 3.5, lineColor: COLORS.primary, lineWidth: 0.5 },
      });
    }
  }
}

// ============================================================
// YOGINI DASHA HELPER — renders a grid page of yogini dasha blocks
// ============================================================
function renderYoginiDashaGrid(
  doc: jsPDF,
  yoginiData: AstroApiData,
  startIndex: number,
  endIndex: number,
  L: Labels,
) {
  const w = doc.internal.pageSize.getWidth();
  const margin = 10;
  const gap = 6;
  const colWidth = (w - margin * 2 - gap * 2) / 3;
  const cols = [margin, margin + colWidth + gap, margin + (colWidth + gap) * 2];
  const colY = [34, 34, 34];

  const majorList = Array.isArray(yoginiData.major_yogini_dasha)
    ? yoginiData.major_yogini_dasha
    : [];
  const subDashaList = Array.isArray(yoginiData.sub_yogini_dasha)
    ? yoginiData.sub_yogini_dasha
    : [];

  // Get the dashas for this page (by index from majorList)
  const dashesToRender = majorList.slice(startIndex, endIndex);

  dashesToRender.forEach((dasha: Record<string, unknown>, idx: number) => {
    const col = idx % 3;
    let y = colY[col];
    const colX = cols[col];

    const dashaName = dasha.dasha_name || dasha.name || "Unknown";
    const startD = dasha.start_date || dasha.start || "";
    const endD = dasha.end_date || dasha.end || "";
    const duration = dasha.duration || "";

    // Dasha Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(`${dashaName} (${duration} Years)`, colX, y);

    // Date Range
    if (startD || endD) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.text(`${startD} - ${endD}`, colX, y + 4);
    }
    y += 8;

    // Find matching sub-dasha entry by index (same index as major dasha)
    const actualIndex = startIndex + idx;
    const subEntry = subDashaList[actualIndex];
    const subList = Array.isArray(subEntry?.sub_dasha)
      ? subEntry.sub_dasha
      : [];

    if (subList.length > 0) {
      autoTable(doc, {
        startY: y,
        margin: { left: colX },
        tableWidth: colWidth,
        head: [
          [L.dasha || "Dasha", L.startDate || "Start", L.endDate || "End"],
        ],
        body: subList.map((s: Record<string, unknown>) => [
          String(s.dasha_name || s.name || "—"),
          String(s.start_date || s.start || "—"),
          String(s.end_date || s.end || "—"),
        ]),
        theme: "grid",
        headStyles: {
          fillColor: COLORS.accent,
          textColor: COLORS.white,
          fontSize: 6,
          cellPadding: 1.2,
        },
        bodyStyles: { textColor: COLORS.text, fontSize: 6, cellPadding: 1.2 },
        styles: { lineColor: COLORS.accent, lineWidth: 0.2 },
        alternateRowStyles: { fillColor: [255, 250, 240] },
      });

      // @ts-expect-error - lastAutoTable is added by jspdf-autotable plugin at runtime
      colY[col] = doc.lastAutoTable.finalY + 6;
    } else {
      // No sub-dasha, show placeholder
      doc.setFont("helvetica", "italic");
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 150);
      doc.text("No sub-dasha data", colX, y);
      colY[col] = y + 8;
    }
  });
}

// PAGE 9 — YOGINI DASHA I
// PAGE 9 — YOGINI DASHA I (First 6 dashas: index 0-5)
// export function renderYoginiDasha1Page(
//   doc: jsPDF,
//   yoginiData: AstroApiData,
//   L: Labels,
// ) {
//   doc.addPage();
//   addPageBackground(doc);
//   addPageHeader(doc, L.yoginiDasha1 || "Yogini Dasha - I");

//   // Render first 6 major dashas (index 0 to 5)
//   renderYoginiDashaGrid(doc, yoginiData, 0, 12, L);
// }

export function renderYoginiDasha1Page(
  doc: jsPDF,
  yoginiData: AstroApiData,
  L: Labels,
) {
  const pageTitle = L.yoginiDasha1 || "Yogini Dasha - I";

  // 1. Data Integrity Log
  if (process.env.NODE_ENV === "development") {
    console.group(`PDF Debug: ${pageTitle}`);
    console.log("📊 Data received:", yoginiData);
    console.log("🏷️ Labels:", L);

    if (!yoginiData || Object.keys(yoginiData).length === 0) {
      console.warn(
        "⚠️ Warning: yoginiData is empty. PDF might render blank tables.",
      );
    }
  }

  try {
    doc.addPage();
    addPageBackground(doc);
    addPageHeader(doc, pageTitle);

    // 2. Visual Layout Debugging (Optional)
    // Uncomment the line below to draw a red border around your "safe area"
    // doc.setDrawColor(255, 0, 0); doc.rect(10, 10, 190, 277);

    // Render first 6 major dashas (index 0 to 5)
    renderYoginiDashaGrid(doc, yoginiData, 0, 12, L);

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Successfully rendered Yogini Dasha Grid.");
      console.groupEnd();
    }
  } catch (error) {
    console.error(`❌ Error rendering ${pageTitle}:`, error);
    console.groupEnd();

    // Optional: Render error text directly on the PDF for easier troubleshooting
    if (process.env.NODE_ENV === "development") {
      const errMsg = error instanceof Error ? error.message : String(error);
      doc.setTextColor(255, 0, 0);
      doc.text(`Render Error: ${errMsg}`, 20, 50);
    }
  }
}
// PAGE 10 — YOGINI DASHA II (Next 6 dashas: index 6-11)
export function renderYoginiDasha2Page(
  doc: jsPDF,
  yoginiData: AstroApiData,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.yoginiDasha2 || "Yogini Dasha - II");

  // Render dashas 7-12 (index 6 to 11)
  renderYoginiDashaGrid(doc, yoginiData, 12, 18, L);
}

// // PAGE 11 — YOGINI DASHA III (Next 6 dashas: index 12-17)
// export function renderYoginiDasha3Page(
//   doc: jsPDF,
//   yoginiData: AstroApiData,
//   L: Labels,
// ) {
//   doc.addPage();
//   addPageBackground(doc);
//   addPageHeader(doc, L.yoginiDasha3 || "Yogini Dasha - III");

//   // Render dashas 13-18 (index 12 to 17)
//   renderYoginiDashaGrid(doc, yoginiData, 12, 18, L);
// }
const NUMBER_COLORS = [
  [0, 180, 80], // Green for Destiny Number
  [255, 80, 60], // Orange-Red for Radical Number
  [0, 100, 200], // Blue for Name Number
];
// ============================================================
// PAGE 12 — FAVOURABLE POINTS
// ============================================================

export function renderFavourablePointsPage(
  doc: jsPDF,
  apiData: AstroApiData,
  numerologyData: AstroApiData,
  name: string,
  dob: string,
  lang: string,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.favourablePoints || "Favourable Points");

  const w = doc.internal.pageSize.getWidth();
  let y = 38;
  const numTable = numerologyData?.numero_table;

  // Top row: 3 number boxes, styled like Image 1
  const boxW = (w - 40 - 16) / 3;
  const boxH = 35;
  const labels = [
    L.destinyNumber || "Destiny Number",
    L.radicalNumber || "Radical Number",
    L.nameNumber || "Name Number",
  ];
  const keys = ["destiny_number", "radical_number", "name_number"];
  const altKeys = ["destinyNumber", "radicalNumber", "nameNumber"];

  for (let i = 0; i < 3; i++) {
    const bx = 20 + i * (boxW + 8);

    // Box with thin, light border
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]); // Use a lighter accent color for the border
    doc.setLineWidth(0.5); // Thin border
    doc.roundedRect(bx, y, boxW, boxH, 5, 5, "FD"); // More rounded corners

    const val = safeVal(numTable, keys[i], altKeys[i]);

    // Number text: Large, bold, and specific colored
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32); // Much larger font size for the number
    doc.setTextColor(
      NUMBER_COLORS[i][0],
      NUMBER_COLORS[i][1],
      NUMBER_COLORS[i][2],
    );
    doc.text(String(val || "—"), bx + boxW / 2, y + 18, { align: "center" });

    // Label text: Smaller, muted color, below the number
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(
      COLORS.lightText[0],
      COLORS.lightText[1],
      COLORS.lightText[2],
    ); // Muted text color
    doc.text(labels[i], bx + boxW / 2, y + 30, { align: "center" });
  }
  y += boxH + 12;

  const fieldLabels =
    lang === "hi" ? NUMEROLOGY_FIELDS_HI : NUMEROLOGY_FIELDS_EN;
  const fieldKeys = [
    "name",
    "dob",
    "radical_number",
    "radical_ruler",
    "friendly_num",
    "neutral_num",
    "evil_num",
    "fav_day",
    "fav_stone",
    "fav_substone",
    "fav_god",
    "fav_metal",
    "fav_color",
    "fav_mantra",
  ];
  const altFieldKeys = [
    "Name",
    "DateOfBirth",
    "radicalNumber",
    "radicalRuler",
    "friendlyNumbers",
    "neutralNumbers",
    "evilNumbers",
    "favDay",
    "favStone",
    "favSubStone",
    "favGod",
    "favMetal",
    "favColor",
    "favMantra",
  ];
  const tableRows: string[][] = [];

  fieldKeys.forEach((key, idx) => {
    let val: string;
    if (key === "name") val = name;
    else if (key === "dob") val = dob;
    else val = safeVal(numTable, key, altFieldKeys[idx]);

    tableRows.push([fieldLabels[idx] || key, String(val || "—")]);
  });

  autoTable(doc, {
    startY: y,
    body: tableRows,
    theme: "grid",
    bodyStyles: { textColor: COLORS.text, fontSize: 9 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60, fillColor: COLORS.chartBg },
    },
    styles: { cellPadding: 3.5, lineColor: COLORS.accent, lineWidth: 0.3 },
    alternateRowStyles: { fillColor: [255, 250, 240] },
  });
}
// ============================================================
// PAGE 13 — NUMEROLOGY REPORT
// ============================================================

export function renderNumerologyReportPage(
  doc: jsPDF, // or jsPDF
  numerologyData: AstroApiData,
  lang: string,
  L: Labels, // or Labels
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.numerologyReport || "Numerology Report");

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const y = 38;
  const numTable = numerologyData?.numero_table;
  const numReport = numerologyData?.numero_report;
  const numFavTime = numerologyData?.numero_fav_time;
  const numFavMantra = numerologyData?.numero_fav_mantra;

  const margin = 14;
  const gap = 16; // Column ke beech ki gap thodi bada di taaki saaf dikhe
  const colW = (w - margin * 2 - gap) * 0.5;
  const rightX = margin + colW + gap;

  // --- Image 1 Exact Colors ---
  const borderYellow = [242, 196, 75]; // Left box outline color
  const circleFill = [255, 239, 178]; // Light yellow background for circle
  const numOrange = [242, 114, 0]; // Large number color
  const titleBlue = [122, 152, 172]; // Slate-blue color for sub-headings
  const decoLineColor = [112, 60, 70]; // Brownish line color

  // ==========================================
  // ── LEFT COLUMN: About You & Report Box ──
  // ==========================================

  const leftBoxH = h - y - 20; // Box page ke end tak jayega

  // 1. Draw outer thin yellow border (Full Box)
  doc.setDrawColor(borderYellow[0], borderYellow[1], borderYellow[2]);
  doc.setLineWidth(0.5);
  doc.rect(margin, y, colW, leftBoxH);

  // 2. Draw Yellow Circle
  const circleR = 22;
  const circleX = margin + colW / 2;
  const circleY = y + 30;
  doc.setFillColor(circleFill[0], circleFill[1], circleFill[2]);
  doc.circle(circleX, circleY, circleR, "F");

  // 3. Draw Large Orange Number
  const radNum =
    safeVal(numTable, "radical_number", "radicalNumber", "radical_num") || "";
  doc.setFontSize(36);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(numOrange[0], numOrange[1], numOrange[2]);
  doc.text(String(radNum), circleX, circleY + 12, { align: "center" });

  // 4. "About You" subtitle
  let ly = circleY + circleR + 15;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(L.aboutYou || "About You", circleX, ly, { align: "center" });

  // 5. Decorative line under "About You"
  ly += 4;
  doc.setDrawColor(decoLineColor[0], decoLineColor[1], decoLineColor[2]);
  doc.setLineWidth(0.4);
  doc.line(circleX - 12, ly, circleX + 12, ly); // Base line
  doc.setLineWidth(1);
  doc.line(circleX - 4, ly, circleX + 4, ly); // Thick center part for style

  // 6. Numerology Report Text (Inside Box)
  ly += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  if (numReport && typeof numReport === "object") {
    const nr = numReport as Record<string, unknown>;
    const reportText =
      nr.description || nr.report || nr.prediction || JSON.stringify(numReport);

    const textPad = 8;
    const textWidth = colW - textPad * 2;
    const reportLines = doc.splitTextToSize(String(reportText), textWidth);

    // Ensure text doesn't overflow the box bottom
    const maxReportLines = Math.floor((leftBoxH - (ly - y) - 10) / 4);
    doc.text(reportLines.slice(0, maxReportLines), margin + textPad, ly);
  }

  // ==========================================
  // ── RIGHT COLUMN: Favourable Time & Mantra ──
  // ==========================================
  let ry = y + 15; // Thoda neeche se start hoga

  // Helper function for Right Sections (Title + Deco Line + Text)
  const drawRightSection = (
    title: string,
    dataObj: Record<string, unknown>,
  ) => {
    if (!dataObj || typeof dataObj !== "object") return;

    const text =
      dataObj.description ||
      dataObj.fav_time ||
      dataObj.mantra ||
      dataObj.report ||
      "";
    if (!text) return;

    // Center Title
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
    doc.text(title, rightX + colW / 2, ry, { align: "center" });

    // Decorative line
    ry += 4;
    doc.setDrawColor(decoLineColor[0], decoLineColor[1], decoLineColor[2]);
    doc.setLineWidth(0.4);
    doc.line(rightX + colW / 2 - 12, ry, rightX + colW / 2 + 12, ry);
    doc.setLineWidth(1);
    doc.line(rightX + colW / 2 - 4, ry, rightX + colW / 2 + 4, ry);

    // Paragraph Text
    ry += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    const lines = doc.splitTextToSize(String(text), colW) as string[];
    doc.text(lines, rightX, ry);

    // Add gap for the next section
    ry += lines.length * 4 + 25;
  };

  drawRightSection(
    L.favTimeForYou || "Favourable Time For You",
    numFavTime as Record<string, unknown>,
  );
  drawRightSection(
    L.favGayatriMantra || "Favourable Gayatri Mantra For You",
    numFavMantra as Record<string, unknown>,
  );
}
// ============================================================
// PAGE 14 — KALSARPA DOSHA
// ============================================================

export function renderKalsarpaDoshaPage(
  doc: jsPDF, // or jsPDF
  kalsarpaData: AstroApiData,
  L: Labels, // Labels type
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.kalsarpaDosha || "Kalsarpa Dosha");

  const w = doc.internal.pageSize.getWidth();
  let y = 38;
  const kd = kalsarpaData?.kalsarpa_details || kalsarpaData || {};

  // ==========================================
  // ── TOP SECTION: Image + Description ──
  // ==========================================
  const imgW = 60;
  const imgH = 50;

  // 1. Draw Placeholder Astrological Image
  const ksImg = getLocalImageBase64("Kalsarpa_Dosha.jpg");
  if (ksImg) {
    doc.addImage(ksImg, "JPEG", 14, y, imgW, imgH);
  } else {
    doc.setFillColor(248, 240, 225); // Light sandy background
    doc.setDrawColor(210, 180, 140);
    doc.setLineWidth(0.5);
    doc.rect(14, y, imgW, imgH, "FD");

    // Drawing some geometric mandala-style shapes inside placeholder
    const cx = 14 + imgW / 2;
    const cy = y + imgH / 2;
    doc.setDrawColor(200, 160, 110);
    doc.setLineWidth(0.3);
    doc.circle(cx, cy, 18, "S");
    doc.circle(cx, cy, 14, "S");
    doc.circle(cx, cy, 6, "S");
    doc.line(cx - 18, cy, cx + 18, cy);
    doc.line(cx, cy - 18, cx, cy + 18);
    doc.line(cx - 12, cy - 12, cx + 12, cy + 12);
    doc.line(cx + 12, cy - 12, cx - 12, cy + 12);
    doc.setFontSize(7);
    doc.setTextColor(180, 140, 90);
    doc.text("Rahu/Ketu Symbol", cx, y + imgH - 4, { align: "center" });
  }

  // 2. Right Side Description Text
  const textX = 14 + imgW + 10;
  const textW = w - textX - 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  // Splitting description into normal and bold parts
  const p1 =
    "Rahu and Ketu are two nodes of Moon and they are regarded as full-fledged planets in Vedic Astrology. They are considered as most dreaded planets due to their heavy karmic effects. If all the 7 planets are situated between Rahu and Ketu then Kaal Sarp Yog is formed.";
  const p2 =
    "Most of the Kalasarpa dosha effects are negative, while few can be positive too. Rahu or Ketu gives sudden positive changes which are huge and can happen overnight or within a span of few days.";

  const lines1 = doc.splitTextToSize(p1, textW);
  doc.text(lines1, textX, y + 4);

  const ty = y + 4 + lines1.length * 4.5 + 4;

  doc.setFont("helvetica", "bold"); // Bold for 2nd para
  const lines2 = doc.splitTextToSize(p2, textW);
  doc.text(lines2, textX, ty);

  y += imgH + 12;

  // ==========================================
  // ── MIDDLE SECTION: Colorful Grid ──
  // ==========================================
  const KALSARPA_TYPES_UI = [
    { name: "Anant", bg: [249, 150, 133] },
    { name: "Kulik", bg: [115, 194, 251] },
    { name: "Vasuki", bg: [236, 119, 163] },
    { name: "Shankhpal", bg: [86, 175, 154] },
    { name: "Padma", bg: [111, 202, 246] },
    { name: "Mahapadma", bg: [160, 201, 102] },
    { name: "Takshak", bg: [249, 195, 101] },
    { name: "Karkotak", bg: [245, 148, 118] },
    { name: "Shankhchoor", bg: [254, 165, 142] },
    { name: "Ghatak", bg: [86, 175, 154] },
    { name: "Vishdhar", bg: [249, 204, 118] },
    { name: "Sheshnaag", bg: [122, 206, 248] },
  ];

  const cols = 4;
  const gap = 4;
  const pillW = (w - 28 - gap * (cols - 1)) / cols;
  const pillH = 10;

  KALSARPA_TYPES_UI.forEach((item, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const px = 14 + col * (pillW + gap);
    const py = y + row * (pillH + gap);

    doc.setFillColor(item.bg[0], item.bg[1], item.bg[2]);
    doc.roundedRect(px, py, pillW, pillH, 2, 2, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text(item.name, px + pillW / 2, py + 6.5, { align: "center" });
  });

  y += 3 * (pillH + gap) + 15;

  // ==========================================
  // ── BOTTOM SECTION: Presence Boxes ──
  // ==========================================
  const titleBlue = [104, 131, 168];

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text("Presence of Kalsarpa yoga in your Horoscope", 14, y);

  y += 6;

  const boxW = (w - 28 - 6) / 2;
  const boxH = 50;
  const boxBorder = [245, 215, 175];

  // 1. LEFT BOX
  doc.setDrawColor(boxBorder[0], boxBorder[1], boxBorder[2]);
  doc.setLineWidth(0.5);
  doc.setFillColor(255, 255, 255);
  doc.rect(14, y, boxW, boxH, "FD");

  // Determine Presence
  const isPresent = kd.present || false;

  const faceX = 14 + boxW / 2;
  const faceY = y + 16;

  // Draw Face Icon
  if (isPresent) {
    doc.setDrawColor(220, 70, 50); // Red
    doc.circle(faceX, faceY, 7, "S");
    doc.circle(faceX - 2.5, faceY - 1.5, 0.6, "F");
    doc.circle(faceX + 2.5, faceY - 1.5, 0.6, "F");
    doc.line(faceX - 2.5, faceY + 3.5, faceX, faceY + 1.5);
    doc.line(faceX, faceY + 1.5, faceX + 2.5, faceY + 3.5);
  } else {
    doc.setDrawColor(60, 160, 80); // Green
    doc.circle(faceX, faceY, 7, "S");
    doc.circle(faceX - 2.5, faceY - 1.5, 0.6, "F");
    doc.circle(faceX + 2.5, faceY - 1.5, 0.6, "F");
    doc.line(faceX - 2.5, faceY + 1.5, faceX, faceY + 3.5);
    doc.line(faceX, faceY + 3.5, faceX + 2.5, faceY + 1.5);
  }

  // Text
  doc.setFontSize(11);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(
    isPresent ? "Kalsarpa is present" : "Kalsarpa is not present",
    faceX,
    y + 32,
    { align: "center" },
  );

  const oneLineDesc =
    kd.one_line ||
    (isPresent
      ? "You have descending kalsarpa dosha direction. The KalSarpa Dosha is having full effect in your horoscope."
      : "Kalsarpa dosha is not detected in your horoscope.");

  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const leftLines = doc.splitTextToSize(oneLineDesc, boxW - 14);
  doc.text(leftLines, faceX, y + 40, { align: "center" });

  // 2. RIGHT BOX
  const rightX = 14 + boxW + 6;
  doc.setDrawColor(boxBorder[0], boxBorder[1], boxBorder[2]);
  doc.setFillColor(255, 255, 255);
  doc.rect(rightX, y, boxW, boxH, "FD");

  let ry = y + 10;
  const centerRight = rightX + boxW / 2;
  const decoColor = [112, 60, 70];

  const drawRightItem = (title: string, value: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
    doc.text(title, centerRight, ry, { align: "center" });

    ry += 3;
    doc.setDrawColor(decoColor[0], decoColor[1], decoColor[2]);
    doc.setLineWidth(0.3);
    doc.line(centerRight - 10, ry, centerRight + 10, ry);
    doc.setLineWidth(0.8);
    doc.line(centerRight - 3, ry, centerRight + 3, ry);

    ry += 3;
    doc.setFillColor(242, 114, 0);
    doc.rect(centerRight - 22, ry, 44, 8, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(String(value).toUpperCase(), centerRight, ry + 5.5, {
      align: "center",
    });

    ry += 15;
  };

  const kName = kd.type || (isPresent ? "SHANKHCHOOR" : "—");
  const kDir = kd.direction || (isPresent ? "FULL DESCENDING" : "—");

  drawRightItem(L.kalsarpaName || "Kalsarpa Name", kName);
  drawRightItem(L.kalsarpaDirection || "Direction", kDir);
}
// ============================================================
// PAGE 15 — KALSARPA REPORT
// ============================================================
export function renderKalsarpaEffectPage(
  doc: jsPDF,
  kalsarpaData: AstroApiData,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.kalsarpaReport || "Kaal Sarp Dosh Report");

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  let y = 34;

  const kd = (kalsarpaData.kalsarpa_details || {}) as Record<string, unknown>;
  // Report
  // Report
  const reportRaw = kd.report as Record<string, unknown> | undefined;
  let reportText: string = String(
    reportRaw?.report ||
      reportRaw?.bot_response ||
      kd.one_line ||
      (kd.present === false
        ? "Kalsarpa Dosha is not present in the horoscope. No remedial measures are required."
        : "No detailed report available."),
  );

  // Strip HTML tags if present (e.g. <p>)
  reportText = reportText.replace(/<[^>]+>/g, "");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const lines = doc.splitTextToSize(reportText, w - 28) as string[];
  doc.text(lines, 14, y);
  y += lines.length * 4.5 + 10;

  // Remedies
  // Remedies
  const remedies = (reportRaw?.remedies ?? kd.remedies ?? []) as string[];

  if (Array.isArray(remedies) && remedies.length > 0) {
    y = addSectionTitle(doc, L.remediesOfKalsarpa || "Remedies", y);
    doc.setFontSize(9);
    remedies.forEach((rem: string) => {
      // Check for page overflow
      if (y > h - 20) {
        doc.addPage();
        addPageBackground(doc);
        y = 30;
      }
      const bulletText = `• ${rem}`;
      const remLines = doc.splitTextToSize(bulletText, w - 30);
      doc.text(remLines, 14, y);
      y += remLines.length * 4.5 + 3;
    });
  }
}

// ============================================================
// PAGE 16 — MANGLIK ANALYSIS I
// ============================================================

export function renderManglik1Page(
  doc: jsPDF, // or jsPDF
  manglikData: AstroApiData,
  simpleManglikParam: AstroApiData | null,
  L: Labels, // Labels
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.manglikAnalysis || "Manglik Analysis");

  const w = doc.internal.pageSize.getWidth();
  let y = 38;

  const mData = manglikData?.manglik || {};
  const simpleManglik = manglikData?.simple_manglik || simpleManglikParam || {};

  const titleBlue = [104, 131, 168];

  // ==========================================
  // ── TOP SECTION: Image + What is Manglik? ──
  // ==========================================
  const imgW = 65;
  const imgH = 45;
  const margin = 14;

  // Placeholder Image
  const manglikImg = getLocalImageBase64("Manglik_Analysis.jpg");
  if (manglikImg) {
    doc.addImage(manglikImg, "JPEG", margin, y, imgW, imgH);
  } else {
    doc.setFillColor(245, 240, 230);
    doc.setDrawColor(200, 190, 180);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, imgW, imgH, "FD");

    doc.setDrawColor(180, 150, 120);
    doc.setLineWidth(0.3);
    doc.rect(margin + 5, y + 5, imgW - 10, imgH - 10);
    doc.circle(margin + imgW / 2, y + imgH / 2, 10, "S");
    doc.line(margin + 5, y + imgH / 2, margin + imgW - 5, y + imgH / 2);
    doc.line(margin + imgW / 2, y + 5, margin + imgW / 2, y + imgH - 5);
    doc.setFontSize(7);
    doc.setTextColor(150, 130, 110);
    doc.text("Manglik Image", margin + imgW / 2, y + imgH / 2 + 15, {
      align: "center",
    });
  }

  // Text Content Next to Image
  const textX = margin + imgW + 10;
  const textW = w - textX - margin;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(L.whatIsManglik || "What is manglik dosha?", textX, y + 4);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  const p1 =
    "In the boy or the girls horoscope when Mars, Sun, Saturn, Rahu Or Ketu is in ascendant, fourth house, seventh house, eighth house or twelfth house then it is called Manglik dosh.";
  const p2 =
    "Manglik dosh is considered stronger when Mars is placed in the ascendant than when Mars is conjoined with Moon in ascendant.";
  const p3 =
    "If according to the Shastras the Manglik dosh of both the boy and the girl is getting cancelled then they are guaranteed a happily married life. On the other hand, if this Manglik dosh is not cancelled then they are likely to face unnecessary problems and hurdles in life.";
  const p4 =
    "So one must begin his/her married life after getting their horoscopes thoroughly matched. After getting the Manglik dosh properly cancelled the native shall be bestowed with a peaceful and wealthy life.";

  let textY = y;

  let lines = doc.splitTextToSize(p1, textW);
  doc.text(lines, textX, textY);
  textY += lines.length * 4 + 2;

  lines = doc.splitTextToSize(p2, textW);
  doc.text(lines, textX, textY);
  textY += lines.length * 4 + 6;

  let belowImageY = Math.max(textY, y + imgH - 10 + 12);

  lines = doc.splitTextToSize(p3, w - 28);
  doc.text(lines, margin, belowImageY);
  belowImageY += lines.length * 4 + 2;

  lines = doc.splitTextToSize(p4, w - 28);
  doc.text(lines, margin, belowImageY);
  belowImageY += lines.length * 4 + 15;

  // ==========================================
  // ── SANSKRIT SHLOKA (Canvas Image Trick) ──
  // ==========================================
  const shloka1 = "लग्ने व्यये सुखे वापि सप्तमे वा अष्टमे कुजे |";
  const shloka2 = "शुभ दृग् योग हीने च पतिं हन्ति न संशयम् ||";

  const shColor = "#DC4632"; // Hex for rgb(220, 70, 50)
  const sh1Img = getDevanagariImage(shloka1, shColor);
  const sh2Img = getDevanagariImage(shloka2, shColor);

  if (sh1Img && sh2Img) {
    const pdfH = 6; // Height in PDF units

    // Render Shloka 1
    const pdfW1 = (sh1Img.w / sh1Img.h) * pdfH;
    doc.addImage(
      sh1Img.data,
      "PNG",
      w / 2 - pdfW1 / 2,
      belowImageY - 4,
      pdfW1,
      pdfH,
    );

    // Render Shloka 2
    const pdfW2 = (sh2Img.w / sh2Img.h) * pdfH;
    doc.addImage(
      sh2Img.data,
      "PNG",
      w / 2 - pdfW2 / 2,
      belowImageY + 4,
      pdfW2,
      pdfH,
    );
  }

  belowImageY += 25;

  // ==========================================
  // ── MANGLIK PERCENTAGE BLOCK ──
  // ==========================================
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(L.manglikAnalysis || "Manglik Analysis", margin, belowImageY);
  belowImageY += 6;

  const percentage = mData?.percentage_manglik_present ?? 0;

  const blockH = 14;
  const leftBlockW = (w - 28) * 0.75;
  const rightBlockW = (w - 28) * 0.25;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.rect(margin, belowImageY, leftBlockW, blockH, "FD");

  const orange = [252, 104, 56];
  doc.setFillColor(orange[0], orange[1], orange[2]);
  doc.rect(margin + leftBlockW, belowImageY, rightBlockW, blockH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(orange[0], orange[1], orange[2]);
  doc.text(
    "TOTAL MANGLIK PERCENTAGE",
    margin + leftBlockW / 2,
    belowImageY + 9,
    { align: "center" },
  );

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `${percentage}%`,
    margin + leftBlockW + rightBlockW / 2,
    belowImageY + 10,
    { align: "center" },
  );

  belowImageY += 25;

  // ==========================================
  // ── MANGLIK REPORT ──
  // ==========================================
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(L.manglikReport || "Manglik Report", margin, belowImageY);
  belowImageY += 6;

  const mReport = mData?.manglik_report;
  const sReport = simpleManglik?.msg || simpleManglik?.manglik_report;
  let reportText = "";

  if (simpleManglik?.is_present === false && simpleManglik?.msg) {
    reportText = simpleManglik.msg;
  } else if (mData?.is_present === false && mReport) {
    reportText = mReport;
  } else {
    reportText = mReport || sReport || "Manglik analysis not available.";
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  const rLines = doc.splitTextToSize(reportText, w - 28);
  doc.text(rLines, margin, belowImageY);
}
// Helper function to render Hindi/Sanskrit text flawlessly in PDF
// Updated Helper: Uses JPEG and Solid White Background to prevent jsPDF blank issues
function getDevanagariImage(text: string, colorHex: string, _bgColor?: string) {
  if (typeof document === "undefined") {
    console.warn("Canvas not available (Server Side).");
    return null;
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const fontSize = 50;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  const width = ctx.measureText(text).width + 40;
  const height = fontSize * 1.5;

  canvas.width = width;
  canvas.height = height;

  // Fill background with white (Crucial for jsPDF JPEG)
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  // Draw Text
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = colorHex;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(text, width / 2, height / 2);

  // Return as JPEG
  return { data: canvas.toDataURL("image/jpeg", 1.0), w: width, h: height };
}
// ============================================================
// PAGE 17 — MANGLIK ANALYSIS II
// ============================================================

export function renderManglik2Page(
  doc: jsPDF, // or jsPDF
  manglikData: AstroApiData,
  simpleManglik: AstroApiData | null,
  L: Labels, // Labels
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.manglikAnalysis || "Manglik Analysis - II");

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  let y = 38;
  const mData = manglikData?.manglik || {};

  const titleBlue = [104, 131, 168]; // Slate blue for headings
  const orange = [242, 114, 0]; // Orange for icons

  const margin = 14;
  const gap = 16;
  const colW = (w - margin * 2 - gap) / 2;
  const leftX = margin;
  const rightX = margin + colW + gap;

  // ==========================================
  // ── LEFT COLUMN: Based On House ──
  // ==========================================

  // Draw House Icon (Circle + House inside)
  const iconR = 8;
  const lIconX = leftX + iconR;
  const lIconY = y + iconR;

  doc.setDrawColor(orange[0], orange[1], orange[2]);
  doc.setLineWidth(0.4);
  doc.circle(lIconX, lIconY, iconR, "S"); // Outer circle
  // Draw simple house inside
  doc.line(lIconX - 4, lIconY + 1, lIconX, lIconY - 4); // Roof left
  doc.line(lIconX, lIconY - 4, lIconX + 4, lIconY + 1); // Roof right
  doc.rect(lIconX - 3, lIconY + 1, 6, 4, "S"); // House base
  doc.rect(lIconX - 1, lIconY + 2.5, 2, 2.5, "S"); // Door

  // Heading
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(L.basedOnHouse || "Based On House", lIconX + iconR + 6, lIconY + 3);

  let leftY = lIconY + iconR + 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  const mDataR = mData as Record<string, unknown>;
  const mPresentRule = mDataR.manglik_present_rule as
    | Record<string, unknown>
    | undefined;
  const houseList = (mPresentRule?.based_on_house as string[]) || [];
  if (Array.isArray(houseList) && houseList.length > 0) {
    houseList.forEach((text: string) => {
      const hLines = doc.splitTextToSize(text, colW);
      doc.text(hLines, leftX, leftY);
      leftY += hLines.length * 4.5 + 4;
    });
  } else {
    doc.text("No detailed house analysis available.", leftX, leftY);
  }

  // ==========================================
  // ── RIGHT COLUMN: Based On Aspects ──
  // ==========================================

  // Draw Eye Icon (Circle + Eye inside)
  const rIconX = rightX + iconR;
  const rIconY = y + iconR;

  doc.setDrawColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.setLineWidth(0.4);
  doc.circle(rIconX, rIconY, iconR, "S"); // Outer circle
  // Draw simple eye inside
  doc.ellipse(rIconX, rIconY, 4.5, 2.5, "S"); // Eye shape
  doc.circle(rIconX, rIconY, 1.2, "F"); // Pupil

  // Heading
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(
    L.basedOnAspects || "Based On Aspects",
    rIconX + iconR + 6,
    rIconY + 3,
  );

  let rightY = rIconY + iconR + 10;

  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  const aspectList = (mPresentRule?.based_on_aspect as string[]) || [];
  if (Array.isArray(aspectList) && aspectList.length > 0) {
    aspectList.forEach((text: string, index: number) => {
      const aLines = doc.splitTextToSize(text, colW - 4);
      const textH = aLines.length * 4.5;

      // Alternate Background Highlight (Image 1 style)
      if (index % 2 !== 0) {
        doc.setFillColor(253, 242, 230); // Light beige/orange
        doc.rect(rightX, rightY - 3, colW, textH + 4, "F");
      }

      doc.text(aLines, rightX + 2, rightY + 1);
      rightY += textH + 6;
    });
  } else {
    doc.text("No detailed aspect analysis available.", rightX, rightY);
  }

  // Move Y pointer below both columns
  y = Math.max(leftY, rightY) + 20;

  // ==========================================
  // ── REMEDIES SECTION ──
  // ==========================================

  // Dummy remedies array if API doesn't provide it, just to ensure the UI shows up
  let remedies = mData.remedies || [];

  // If no remedies, we can optionally skip or show a fallback message.
  if (!Array.isArray(remedies) || remedies.length === 0) {
    // Fallback remedies just to replicate the Image 1 UI if data is missing
    remedies = [
      "Install an energized Mangal Yantra in your place of worship. Meditate on the triangular Mangal Yantra along with the recitation of Mangal mantra: Om Kram Krim Krom Sah Bhomayay Namah.",
      "In the evening, visit a Hanuman temple draw a triangle with red kumkum (roli) on a plate and worship Hanumanji with sindoor or red sandalwood, red flowers and a lighted lamp.",
      "Worship Lord Hanuman with the mantra: || OM SHREEM HANUMATE NAMAH ||",
    ];
  }

  if (Array.isArray(remedies) && remedies.length > 0) {
    // Heading
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
    doc.text(L.remediesOfManglik || "Remedies Of Manglik Dosha", margin, y);
    y += 8;

    // Calculate total height needed for the remedies box
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const boxTextPad = 8;
    const boxW = w - margin * 2;
    const innerW = boxW - boxTextPad * 2 - 4; // -4 for the thick left border

    let totalTextH = 0;
    const formattedRemedies: string[][] = [];

    remedies.forEach((rem: string) => {
      // Clean up HTML tags like <br> that might come from API
      const cleanText = rem
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]*>?/gm, "");
      const bulletText = `- ${cleanText}`;
      const lines = doc.splitTextToSize(bulletText, innerW) as string[];
      formattedRemedies.push(lines);
      totalTextH += lines.length * 4.5 + 6;
    });

    const boxH = totalTextH + boxTextPad * 2;

    // Check Page break
    if (y + boxH > h - 20) {
      doc.addPage();
      addPageBackground(doc);
      y = 30;
    }

    // Draw the Background Box
    doc.setFillColor(245, 248, 248); // Very light greyish-cyan
    doc.rect(margin, y, boxW, boxH, "F");

    // Draw Thick Left Teal Border
    doc.setFillColor(0, 150, 130); // Teal color
    doc.rect(margin, y, 4, boxH, "F");

    // Draw Text inside the box
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    let textY = y + boxTextPad + 3;

    formattedRemedies.forEach((lines: string[]) => {
      doc.text(lines, margin + 4 + boxTextPad, textY);
      textY += lines.length * 4.5 + 6;
    });
  }
}
// ============================================================
// PAGE 18 — SADHESATI ANALYSIS
// ============================================================

export function renderSadhesatiPage(
  doc: jsPDF, // or jsPDF
  apiData: AstroApiData,
  L: Labels, // Labels
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.sadhesatiAnalysis || "Sadhesati Analysis");

  const w = doc.internal.pageSize.getWidth();
  let y = 38;

  // Extract proper sections
  const sData = apiData?.sadhesati_current_status || apiData || {};

  const titleBlue = [104, 131, 168];
  const margin = 14;

  // ==========================================
  // ── TOP SECTION: Image + What is Sadhesati ──
  // ==========================================
  const imgW = 60;
  const imgH = 55;

  // 1. Placeholder Image (Saturn/Shani Theme)
  const sadhesatiImg = getLocalImageBase64("Sadhesati_Analysis.webp");
  if (sadhesatiImg) {
    doc.addImage(sadhesatiImg, "WEBP", margin, y, imgW, imgH);
  } else {
    doc.setFillColor(245, 240, 230); // Premium light beige background
    doc.setDrawColor(200, 190, 180);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, imgW, imgH, "FD");

    // Draw abstract Saturn (Planet with rings)
    const cx = margin + imgW / 2;
    const cy = y + imgH / 2 - 5;
    doc.setDrawColor(180, 150, 120);
    doc.setFillColor(200, 180, 150);
    doc.circle(cx, cy, 12, "FD"); // Planet body
    // Draw Ring
    doc.setLineWidth(1.5);
    doc.ellipse(cx, cy, 22, 6, "S");
    doc.setFontSize(7);
    doc.setTextColor(150, 130, 110);
    doc.text("Shani (Saturn) Symbol", cx, y + imgH - 6, { align: "center" });
  }

  // 2. Text Content Next to Image
  const textX = margin + imgW + 10;
  const textW = w - textX - margin;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(L.whatIsSadhesati || "What is Sadhesati Dosha?", textX, y + 5);

  let textY = y + 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  const rawDesc = String(
    sData.what_is_sadhesati ||
      "Sadhe Sati refers to the seven-and-a-half year period in which Saturn moves through three signs, the moon sign, one before the moon and the one after it.",
  );

  // Split into paragraphs for better readability
  const sentences = rawDesc.split(". ");
  const p1 =
    sentences.slice(0, 3).join(". ") + (sentences.length > 3 ? "." : "");
  const p2 = sentences.slice(3).join(". ");

  let lines = doc.splitTextToSize(p1, textW);
  doc.text(lines, textX, textY);
  textY += lines.length * 4.5 + 4;

  if (p2.trim() !== "") {
    lines = doc.splitTextToSize(p2, textW);
    // If text goes below image, give it full width
    if (textY > y + imgH) {
      lines = doc.splitTextToSize(p2, w - 28);
      doc.text(lines, margin, textY);
    } else {
      doc.text(lines, textX, textY);
    }
  }

  y = Math.max(textY + lines.length * 4.5 + 10, y + imgH + 20);

  // ==========================================
  // ── BOTTOM SECTION: Presence Boxes ──
  // ==========================================
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(
    L.presenceOfSadhesati || "Presence of Sadhesati in your Horoscope",
    margin,
    y,
  );

  y += 8;

  const boxW = (w - 28 - 8) / 2;
  const boxH = 90; // Height increased to comfortably fit 4 orange blocks
  const boxBorder = [245, 215, 175]; // Light beige border

  const isPresent =
    sData.sadhesati_status === true ||
    String(sData.sadhesati_status).toLowerCase() === "true";

  // 1. LEFT BOX (Status and Icon)
  doc.setDrawColor(boxBorder[0], boxBorder[1], boxBorder[2]);
  doc.setLineWidth(0.5);
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, boxW, boxH, "FD");

  const faceX = margin + boxW / 2;
  const faceY = y + 25;

  // Draw Checkmark or Cross (Much cleaner than faces)
  doc.setLineWidth(1.2);
  if (isPresent) {
    doc.setDrawColor(220, 70, 50); // Red
    doc.circle(faceX, faceY, 10, "S");
    // Cross lines
    doc.line(faceX - 4, faceY - 4, faceX + 4, faceY + 4);
    doc.line(faceX + 4, faceY - 4, faceX - 4, faceY + 4);
  } else {
    doc.setDrawColor(60, 160, 80); // Green
    doc.circle(faceX, faceY, 10, "S");
    // Checkmark lines
    doc.line(faceX - 4, faceY + 1, faceX - 1, faceY + 4);
    doc.line(faceX - 1, faceY + 4, faceX + 5, faceY - 3);
  }

  // Status Heading
  doc.setFontSize(12);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  const statusHeading = isPresent
    ? "Sadhesati is present"
    : "Sadhesati is not present";
  doc.text(statusHeading, faceX, y + 45, { align: "center" });

  // Status Description Text
  const statusMsg =
    sData.is_undergoing_sadhesati ||
    (isPresent
      ? "You are currently undergoing Sadhe Sati."
      : "No, currently you are not undergoing Sadhesati.");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const leftLines = doc.splitTextToSize(statusMsg, boxW - 14);
  doc.text(leftLines, faceX, y + 55, { align: "center" });

  // 2. RIGHT BOX (Astrological Details with Orange Blocks)
  const rightX = margin + boxW + 8;
  doc.setDrawColor(boxBorder[0], boxBorder[1], boxBorder[2]);
  doc.setLineWidth(0.5);
  doc.setFillColor(255, 255, 255);
  doc.rect(rightX, y, boxW, boxH, "FD");

  let ry = y + 8;
  const centerRight = rightX + boxW / 2;
  const decoColor = [112, 60, 70];

  const drawRightItem = (title: string, value: string) => {
    // Title
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
    doc.text(title, centerRight, ry, { align: "center" });

    // Decorative Line
    ry += 3;
    doc.setDrawColor(decoColor[0], decoColor[1], decoColor[2]);
    doc.setLineWidth(0.3);
    doc.line(centerRight - 8, ry, centerRight + 8, ry);
    doc.setLineWidth(0.8);
    doc.line(centerRight - 2, ry, centerRight + 2, ry);

    // Orange Box Background
    ry += 3;
    doc.setFillColor(242, 114, 0); // Vibrant orange from premium UI
    doc.rect(centerRight - 20, ry, 40, 6, "F");

    // Value text in white inside orange box
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(String(value).toUpperCase(), centerRight, ry + 4.5, {
      align: "center",
    });

    ry += 14; // Proper gap before next item
  };

  const cDate = sData.consideration_date || "—";
  const mSign = sData.moon_sign || "—";
  const sSign = sData.saturn_sign || "—";
  const sRetro = sData.is_saturn_retrograde ? "YES" : "NO";

  drawRightItem(L.considerationDate || "Consideration Date", cDate);
  drawRightItem(L.moonSign || "Moon Sign", mSign);
  drawRightItem(L.saturnSign || "Saturn Sign", sSign);
  drawRightItem(L.saturnRetrograde || "Saturn Retrograde", sRetro);
}
// ============================================================
// PAGE 19 — GEMSTONE SUGGESTIONS
// ============================================================

export function renderGemstoneSuggestionsPage(
  doc: jsPDF, // or jsPDF
  gemData: AstroApiData,
  L: Labels, // Labels
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.gemstoneSuggestions || "Gemstone Suggestions");

  const w = doc.internal.pageSize.getWidth();
  let y = 38;

  const gd = gemData?.basic_gem_suggestion || {};

  // ==========================================
  // ── TOP DESCRIPTION ──
  // ==========================================
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110); // Soft grey to match Image 1

  const desc =
    L.gemstoneDescription ||
    "Each planet has its unique corresponding astrological gemstone which radiates the same cosmic color energies as the planet itself. The gemstones work by reflection of positive rays or absorption of negative rays. Wearing the appropriate gemstone can increase the corresponding planet's positive effect on its wearer as the gem filters and allows only the positive vibrations to penetrate in the wearer's body.";

  const descLines = doc.splitTextToSize(desc, w - 28);
  doc.text(descLines, 14, y);
  y += descLines.length * 4.5 + 14;

  const margin = 14;
  const gap = 8;
  const colW = (w - 2 * margin - 2 * gap) / 3;

  // Exact Colors from Image 1
  const THEMES = {
    LIFE: { head: [92, 184, 116], foot: [164, 214, 178] }, // Mint Green
    BENEFIC: { head: [39, 154, 222], foot: [122, 196, 237] }, // Sky Blue
    LUCKY: { head: [250, 166, 52], foot: [252, 210, 145] }, // Golden Orange
  };

  const DESCRIPTIONS = {
    LIFE: "The Ascendant or the LAGNA signifies the body and everything related to it, viz health, longevity, name, status, life path, etc. In short, it holds the essence of the whole life. Hence the gemstone corresponding to the LAGNESH, the lord of the Ascendant is called the LIFE STONE. One can and should wear this stone throughout life to fully experience and exploit its advantages and powers.",
    BENEFIC:
      "The Fifth house of the birth chart is another auspicious house. The fifth house is the significator of the intellect, higher education, children, windfall gains etc. this house is also the STHANA of PURVA PUNYA KARMAS i.e. past good deeds. Hence it is considered to be an auspicious house. The gemstone corresponding to the lord of the fifth house is called the BENEFIC STONE.",
    LUCKY:
      "The Ninth house of a birth chart is called the BHAGYA STHAANA viz the House of Luck or Destiny. This house is related to fortune, success, merits and achievements, knowledge, etc. This house indicates the fruits one will be able to enjoy due to the good deeds done by him in the previous births. The gemstone corresponding to the lord of the ninth house is called the LUCKY STONE.",
  };

  const stones = [
    {
      title: L.lifeStone || "LIFE STONE",
      data: gd?.LIFE || gd?.life,
      theme: THEMES.LIFE,
      desc: DESCRIPTIONS.LIFE,
    },
    {
      title: L.beneficStone || "BENEFIC STONE",
      data: gd?.BENEFIC || gd?.benefic,
      theme: THEMES.BENEFIC,
      desc: DESCRIPTIONS.BENEFIC,
    },
    {
      title: L.luckyStone || "LUCKY STONE",
      data: gd?.LUCKY || gd?.lucky,
      theme: THEMES.LUCKY,
      desc: DESCRIPTIONS.LUCKY,
    },
  ];

  const cardY = y;
  const headerH = 10;
  const imageH = 50;
  const footerH = 10;
  const cardH = headerH + imageH + footerH;

  stones.forEach((stone, index) => {
    const px = margin + index * (colW + gap);
    const stoneName = stone.data?.name || "—";

    // 1. Draw Card Background/Border
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.setFillColor(255, 255, 255);
    doc.rect(px, cardY, colW, cardH, "FD");

    // 2. Header Box
    doc.setFillColor(
      stone.theme.head[0],
      stone.theme.head[1],
      stone.theme.head[2],
    );
    doc.rect(px, cardY, colW, headerH, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(stone.title, px + colW / 2, cardY + 7, { align: "center" });

    // ==========================================
    // 3. 3D GLOSSY GEMSTONE DRAWING LOGIC OR IMAGE
    // ==========================================
    const imgFilename =
      stone.title === L.lifeStone || stone.title === "LIFE STONE"
        ? "LIFE_STONE.jpg"
        : stone.title === L.beneficStone || stone.title === "BENEFIC STONE"
          ? "BENEFIC_STONE.jpg"
          : "LUCKY_STONE.jpg";

    const gemImg = getLocalImageBase64(imgFilename);

    if (gemImg) {
      // Draw image filling the space
      doc.addImage(
        gemImg,
        "JPEG",
        px + 4,
        cardY + headerH + 4,
        colW - 8,
        imageH - 8,
      );
    } else {
      const cx = px + colW / 2;
      const cy = cardY + headerH + imageH / 2 - 4;
      const r = 14; // Size of the gem

      const safeName = stoneName.toLowerCase().trim();
      const gColor = GEM_COLORS[safeName] || [130, 130, 130];

      // A. Soft Realistic Drop Shadow (Multiple layers)
      const shadowY = cy + r + 6;
      doc.setFillColor(245, 245, 245);
      doc.ellipse(cx, shadowY, r * 1.5, r * 0.4, "F");
      doc.setFillColor(230, 230, 230);
      doc.ellipse(cx, shadowY, r * 1.1, r * 0.25, "F");
      doc.setFillColor(210, 210, 210);
      doc.ellipse(cx, shadowY, r * 0.7, r * 0.15, "F");

      // B. 3D Sphere Gradient Generation
      const steps = 20;
      const highlightX = cx - r * 0.35;
      const highlightY = cy - r * 0.35;

      for (let i = 0; i <= steps; i++) {
        const stepR = r - (r * i) / steps;
        const stepX = cx + ((highlightX - cx) * i) / steps;
        const stepY = cy + ((highlightY - cy) * i) / steps;

        // Calculate color interpolation (Dark base -> Bright White)
        const factor = i / steps;
        const easeFactor = Math.pow(factor, 1.4); // Creates a glossy curve
        const rCol = Math.min(
          255,
          Math.floor(gColor[0] + (255 - gColor[0]) * easeFactor),
        );
        const gCol = Math.min(
          255,
          Math.floor(gColor[1] + (255 - gColor[1]) * easeFactor),
        );
        const bCol = Math.min(
          255,
          Math.floor(gColor[2] + (255 - gColor[2]) * easeFactor),
        );

        doc.setFillColor(rCol, gCol, bCol);
        doc.setDrawColor(rCol, gCol, bCol); // Avoid anti-aliasing gaps
        doc.circle(stepX, stepY, stepR, "FD");
      }

      // C. Strong Specular Highlight (The white reflection dot)
      doc.setFillColor(255, 255, 255);
      doc.ellipse(highlightX - 1, highlightY - 1, r * 0.25, r * 0.15, "F");
    }

    // ==========================================
    // 4. Footer Box
    // ==========================================
    doc.setFillColor(
      stone.theme.foot[0],
      stone.theme.foot[1],
      stone.theme.foot[2],
    );
    doc.rect(px, cardY + headerH + imageH, colW, footerH, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70); // Dark grey text matching Image 1
    doc.text(
      stoneName.toUpperCase(),
      px + colW / 2,
      cardY + headerH + imageH + 6.5,
      { align: "center" },
    );

    // 5. Explanatory Paragraph
    const textY = cardY + cardH + 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);

    const lines = doc.splitTextToSize(stone.desc, colW);
    doc.text(lines, px, textY);
  });
}
// ============================================================
// PAGE 20-22 — GEMSTONE DETAIL PAGE
// ============================================================

export function renderGemstoneDetailPage(
  doc: jsPDF, // or jsPDF
  gemData: AstroApiData,
  type: "life" | "benefic" | "lucky",
  L: Labels, // Labels
) {
  const gd = gemData?.basic_gem_suggestion || {};
  const data = gd?.[type] || gd?.[type?.toUpperCase()] || {};

  let titleText = "";
  if (type === "life") titleText = L.lifeStone || "LIFE STONE";
  else if (type === "benefic") titleText = L.beneficStone || "BENEFIC STONE";
  else titleText = L.luckyStone || "LUCKY STONE";

  const stoneName = data?.name || "—";

  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, titleText);

  const w = doc.internal.pageSize.getWidth();
  let y = 34;
  const margin = 14;

  const titleBlue = [104, 131, 168];
  const orange = [242, 114, 0];

  // ==========================================
  // ── TOP SECTION: Stone Name & Image ──
  // ==========================================

  // Title (e.g. "LIFE STONE - Red Coral")
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(`${titleText} - ${stoneName}`, margin, y + 4);

  // Decorative Line below title
  y += 8;
  const decoColor = [112, 60, 70];
  doc.setDrawColor(decoColor[0], decoColor[1], decoColor[2]);
  doc.setLineWidth(0.3);
  doc.line(margin + 10, y, margin + 40, y);
  doc.setLineWidth(1);
  doc.line(margin + 20, y, margin + 30, y); // Thick center

  // ==========================================
  // ── 3D Gemstone Image OR Drawing ──
  // ==========================================
  y += 20;
  const cx = margin + 25;
  const cy = y;
  const r = 16;
  const safeName = stoneName.toLowerCase().trim();
  const gColor = GEM_COLORS[safeName] || [130, 130, 130];

  const imgFilename =
    type === "life"
      ? "LIFE_STONE.jpg"
      : type === "benefic"
        ? "BENEFIC_STONE.jpg"
        : "LUCKY_STONE.jpg";

  const gemImg = getLocalImageBase64(imgFilename);

  if (gemImg) {
    // Draw the actual gemstone image
    doc.addImage(gemImg, "JPEG", cx - r, cy - r, r * 2, r * 2);
  } else {
    // Shadow
    doc.setFillColor(240, 240, 240);
    doc.ellipse(cx, cy + r + 6, r * 1.5, r * 0.4, "F");
    doc.setFillColor(220, 220, 220);
    doc.ellipse(cx, cy + r + 6, r * 1.1, r * 0.25, "F");

    // 3D Sphere Gradient
    const steps = 20;
    const highlightX = cx - r * 0.35;
    const highlightY = cy - r * 0.35;

    for (let i = 0; i <= steps; i++) {
      const stepR = r - (r * i) / steps;
      const stepX = cx + ((highlightX - cx) * i) / steps;
      const stepY = cy + ((highlightY - cy) * i) / steps;

      const factor = i / steps;
      const easeFactor = Math.pow(factor, 1.4);
      const rCol = Math.min(
        255,
        Math.floor(gColor[0] + (255 - gColor[0]) * easeFactor),
      );
      const gCol = Math.min(
        255,
        Math.floor(gColor[1] + (255 - gColor[1]) * easeFactor),
      );
      const bCol = Math.min(
        255,
        Math.floor(gColor[2] + (255 - gColor[2]) * easeFactor),
      );

      doc.setFillColor(rCol, gCol, bCol);
      doc.setDrawColor(rCol, gCol, bCol);
      doc.circle(stepX, stepY, stepR, "FD");
    }

    // Specular Highlight
    doc.setFillColor(255, 255, 255);
    doc.ellipse(highlightX - 1, highlightY - 1, r * 0.25, r * 0.15, "F");
  }

  // ==========================================
  // ── TOP RIGHT: Basic Details Table ──
  // ==========================================
  const tableX = margin + 60;
  let tableY = y - 20;

  doc.setFontSize(8);
  const rowH = 6;
  const col1W = 20;
  const col2W = 35;

  const drawTableRow = (k1: string, v1: string, k2: string, v2: string) => {
    // Key 1
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(k1, tableX, tableY);
    // Value 1
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(v1, tableX + col1W, tableY);

    // Key 2
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(k2, tableX + col1W + col2W, tableY);
    // Value 2
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(v2, tableX + col1W + col2W + col1W, tableY);

    // Light divider line
    tableY += 2;
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.2);
    doc.line(tableX, tableY, w - margin, tableY);
    tableY += 6;
  };

  const substitutes =
    data?.substitue || data?.substitute || data?.semi_gem || "—";
  drawTableRow("Substitutes", substitutes, "Day", data?.wear_day || "—");
  drawTableRow(
    "Finger",
    data?.wear_finger || "—",
    "Deity",
    data?.deity || data?.gem_deity || "—",
  );
  drawTableRow(
    "Weight",
    data?.weight_caret || "—",
    "Metal",
    data?.wear_metal || "—",
  );

  y += 35; // Move down below the top section

  // Light full-width separator line
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, y, w - margin, y);
  y += 10;

  // ==========================================
  // ── MASONRY GRID (Boxes for Details) ──
  // ==========================================

  // Placeholder detailed texts (Ideally these should come from your API)
  const defaultDesc = `Wearing ${stoneName} makes one courageous and his enemies are vanquished. ${stoneName} protects from evil spirits, sorcery, and bad dreams.`;
  const defaultTime = `${stoneName} should be worn on a ${data?.wear_day || "auspicious day"} morning one hour after Sunrise on the bright half of lunar month.`;
  const defaultFinger = `After the recitation of mantra the ${stoneName} should be worn in the ${data?.wear_finger || "appropriate"} finger of right hand.`;
  const defaultWeight = `${stoneName} should weigh more than 6 carats. It should be set in ${data?.wear_metal || "suitable metal"}. The ring should be made such that the stone touches skin.`;
  const defaultMantra = `Once the energizing rituals are completed one must worship stone with flower and incense. For ${stoneName} following mantra to be recited 108 times.\n\nOm Hreem Dum Durgaye Namah`; // Default fallback mantra
  const defaultSubst = `One can also use the substitutes for ${stoneName} like ${substitutes}.`;
  const defaultRitual = `Before wearing the ${stoneName} one should keep the ring immersed in unboiled milk or ganges water for sometime.`;
  const defaultCaution = `One should take care that ${stoneName} should not be worn with incompatible stones and their substitutes.`;

  const gridItems = [
    { title: "Description", text: defaultDesc, icon: "i" },
    { title: "Time to wear", text: defaultTime, icon: "t" },
    { title: "Finger", text: defaultFinger, icon: "f" },
    { title: "Weight and metal", text: defaultWeight, icon: "w" },
    { title: "Mantra", text: defaultMantra, icon: "m", highlight: true }, // Highlighted box like Image 1
    { title: "Substitutes", text: defaultSubst, icon: "s" },
    { title: "Energizing Rituals", text: defaultRitual, icon: "e" },
    { title: "Caution", text: defaultCaution, icon: "c" },
  ];

  const colCount = 3;
  const boxGap = 6;
  const boxW = (w - margin * 2 - boxGap * (colCount - 1)) / colCount;

  // Distinct badge color per icon type
  const BADGE_COLORS: Record<string, number[]> = {
    i: [104, 131, 168], // blue — Description
    t: [86, 175, 154], // teal — Time to wear
    f: [160, 100, 180], // purple — Finger
    w: [242, 114, 0], // orange — Weight & metal
    m: [220, 60, 60], // red — Mantra
    s: [60, 160, 100], // green — Substitutes
    e: [230, 150, 40], // amber — Energizing Rituals
    c: [100, 110, 125], // slate — Caution
  };
  const BADGE_LABELS: Record<string, string> = {
    i: "i",
    t: "T",
    f: "F",
    w: "W",
    m: "M",
    s: "S",
    e: "E",
    c: "!",
  };

  let colY = [y, y, y];

  gridItems.forEach((item) => {
    // Find shortest column
    let shortestCol = 0;
    for (let c = 1; c < colCount; c++) {
      if (colY[c] < colY[shortestCol]) shortestCol = c;
    }

    const bx = margin + shortestCol * (boxW + boxGap);
    let by = colY[shortestCol];

    // Measure body text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    const lines = doc.splitTextToSize(item.text, boxW - 10);
    const boxH = lines.length * 4.5 + 26; // header row 16 + top pad 5 + bottom pad 5

    // Page break guard
    if (by + boxH > doc.internal.pageSize.getHeight() - 15) {
      doc.addPage();
      addPageBackground(doc);
      by = 30;
      colY = [30, 30, 30];
    }

    // Box background & border
    doc.setLineWidth(0.3);
    if (item.highlight) {
      doc.setFillColor(255, 245, 215);
      doc.setDrawColor(240, 200, 100);
    } else {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(215, 215, 215);
    }
    doc.roundedRect(bx, by, boxW, boxH, 2, 2, "FD");

    // ── FILLED ICON BADGE ──
    const badgeColor = BADGE_COLORS[item.icon] || orange;
    const badgeX = bx + 5;
    const badgeY = by + 4;
    const badgeSize = 10;

    doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    doc.setDrawColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    doc.roundedRect(badgeX, badgeY, badgeSize, badgeSize, 2, 2, "F");

    // White letter inside badge
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(
      BADGE_LABELS[item.icon] ?? item.icon.toUpperCase(),
      badgeX + badgeSize / 2,
      badgeY + 7,
      { align: "center" },
    );

    // Title beside badge (same row)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
    doc.text(item.title, badgeX + badgeSize + 3, by + 11);

    // Thin separator line below header
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.line(bx + 3, by + 16, bx + boxW - 3, by + 16);

    // Body text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(90, 90, 90);
    doc.text(lines, bx + 5, by + 22);

    colY[shortestCol] = by + boxH + boxGap;
  });
}
// ============================================================
// PAGE 23 — ASCENDANT REPORT I
// ============================================================
export function renderAscendantReport1Page(
  doc: jsPDF, // or jsPDF
  ascendantName: string,
  L: Labels, // Labels
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.ascendantReportTitle || "Ascendant Report");

  const w = doc.internal.pageSize.getWidth();
  let y = 38;

  const meta = ASCENDANT_DATA?.[ascendantName] || ASCENDANT_DATA?.["Aries"];
  if (!meta) return;

  const titleBlue = [104, 131, 168];
  const margin = 14;

  // ==========================================
  // ── TOP LEFT: Ascendant Report Image ──
  // ==========================================
  const imgW = 70;
  const imgH = 70;

  // Try zodiac specific first, then fallback to generic
  const ascReportImg =
    getLocalImageBase64(`${ascendantName}.jpg`) ||
    getLocalImageBase64("Ascendant_Report.jpg");

  if (ascReportImg) {
    doc.addImage(ascReportImg, "JPEG", margin, y, imgW, imgH);
  } else {
    const cx = margin + imgW / 2;
    const cy = y + imgH / 2;

    // Draw premium vector mandala/badge
    doc.setDrawColor(210, 190, 160);
    doc.setLineWidth(0.3);
    doc.setFillColor(252, 248, 242);
    doc.circle(cx, cy, 30, "FD"); // Outer circle

    doc.setLineWidth(1.5);
    doc.setDrawColor(180, 160, 130);
    doc.circle(cx, cy, 26, "S"); // Inner ring

    // Zodiac Glyph
    const glyph = ZODIAC_GLYPHS[ascendantName] || "☉";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(55);
    doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
    doc.text(glyph, cx, cy + 18, { align: "center" });

    doc.setFontSize(10);
    doc.text(ascendantName.toUpperCase(), cx, cy + 38, { align: "center" });
  }

  // ==========================================
  // ── TOP RIGHT: Clean Information Table ──
  // ==========================================
  const tableX = margin + imgW + 10;
  const tableW = w - tableX - margin;
  let ty = y + 5;

  // Title
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(`Ascendant Report - ${ascendantName}`, tableX, ty);
  ty += 8;

  // Missing 'Lord' in API, mapped manually
  const lord = ZODIAC_LORDS[ascendantName] || "—";
  const characteristics =
    [meta.element, meta.nature].filter(Boolean).join(", ") || "—";

  const rows = [
    [L.lord || "Lord", lord],
    [L.symbol || "Symbol", meta.symbol],
    [L.characteristics || "Characteristics", characteristics],
    [L.luckyGems || "Lucky gems", meta.luckyGem],
    [L.dayOfFast || "Day of fast", meta.dayOfFast],
  ];

  const col1W = 35;

  rows.forEach((row, idx) => {
    // Alternate Background (Image 1 Style)
    if (idx % 2 !== 0) {
      doc.setFillColor(242, 242, 242); // Light grey
      doc.rect(tableX, ty - 4, tableW, 8, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(String(row[0]), tableX + 3, ty + 1.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(String(row[1]), tableX + col1W, ty + 1.5);

    ty += 8;
  });

  y += imgH + 15;

  // ==========================================
  // ── SANSKRIT SHLOKA (Centered Red/Orange) ──
  // ==========================================
  const shloka =
    meta.shloka ||
    "देहे रूपं च ज्ञानं च वर्णं चैव बलाबलम् | सुखं दुःखं स्वभावञ्च लग्नभावात्रिरीक्षयेत ||";
  const shColor = "#DC4632"; // Reddish-orange

  // Try to render as an image so Hindi looks perfect
  const shImg = getDevanagariImage(shloka, shColor);
  if (shImg) {
    const pdfH = 8;
    const pdfW = (shImg.w / shImg.h) * pdfH;
    // We split into two lines manually if it's too long, but if the API gives one string, we scale it.
    // If it's too wide, scale it down
    const finalW = Math.min(pdfW, w - 28);
    const finalH = (finalW / pdfW) * pdfH;
    doc.addImage(shImg.data, "JPEG", w / 2 - finalW / 2, y, finalW, finalH);
    y += finalH + 15;
  } else {
    // Fallback if canvas fails
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(220, 70, 50);
    const sLines = doc.splitTextToSize(shloka, w - 28);
    doc.text(sLines, w / 2, y, { align: "center" });
    y += sLines.length * 5 + 10;
  }

  // ==========================================
  // ── PERSONALITY TEXT & QUOTE BOX ──
  // ==========================================
  const personalityArray = meta.personality || [];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);

  // Paragraph 1 (Top Text)
  if (personalityArray.length > 0) {
    const p1Lines = doc.splitTextToSize(personalityArray[0], w - 28);
    doc.text(p1Lines, margin, y);
    y += p1Lines.length * 4.5 + 8;
  }

  // Quote Box (Middle Text)
  if (personalityArray.length > 1) {
    const quoteText = personalityArray[1];
    const qLines = doc.splitTextToSize(quoteText, w - 28 - 15);
    const qBoxH = qLines.length * 5 + 10;

    // Check page break for box
    if (y + qBoxH > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      addPageBackground(doc);
      y = 30;
    }

    // Light grey box background
    doc.setFillColor(248, 248, 248);
    doc.rect(margin, y, w - 28, qBoxH, "F");

    // Thick Orange Left Border
    const orange = [242, 114, 0];
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(margin, y, 4, qBoxH, "F");

    // Big Quote Mark (")
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.setTextColor(orange[0], orange[1], orange[2]);
    doc.text('"', margin + 8, y + 12);

    // Quote Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9); // slightly bigger than normal text
    doc.text(qLines, margin + 15, y + 8);

    y += qBoxH + 12;
  }

  // Paragraph 3 (Bottom Text)
  if (personalityArray.length > 2) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);

    // Remaining paragraphs
    for (let i = 2; i < personalityArray.length; i++) {
      const pLines = doc.splitTextToSize(personalityArray[i], w - 28);

      if (y + pLines.length * 4.5 > doc.internal.pageSize.getHeight() - 15) {
        doc.addPage();
        addPageBackground(doc);
        y = 30;
      }

      doc.text(pLines, margin, y);
      y += pLines.length * 4.5 + 6;
    }
  }
}

export function renderAscendantReport2Page(
  doc: jsPDF, // or jsPDF
  ascendantName: string,
  apiReport: any,
  L: Labels, // Labels
) {
  doc.addPage();
  addPageBackground(doc);

  const w = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  let y = 30; // Thoda upar se start karenge taaki space bache
  const margin = 14;

  const meta = ASCENDANT_DATA?.[ascendantName] || ASCENDANT_DATA?.["Aries"];
  if (!meta) return;

  const titleBlue = [104, 131, 168];
  const decoColor = [112, 60, 70]; // Dark brown/maroon for decorative lines

  // ==========================================
  // ── PERSONALITY CONTINUATION ──
  // ==========================================
  const p3 = meta?.personality?.[2] || "";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);

  if (p3) {
    const p3Lines = doc.splitTextToSize(p3, w - 28);
    doc.text(p3Lines, margin, y);
    y += p3Lines.length * 4.5 + 8;
  }

  // ==========================================
  // ── DETAILED ANALYSIS (API Report) ──
  // ==========================================
  if (apiReport) {
    const apiText =
      apiReport?.asc_report?.report ||
      apiReport?.report ||
      apiReport?.description ||
      apiReport?.Report ||
      "";

    if (apiText) {
      const apiLines = doc.splitTextToSize(String(apiText), w - 28);

      // We'll write the text directly without a heavy heading
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 100, 100);

      // Calculate how many lines we can safely fit before the Spiritual box
      const availableH = pageH - y - 130;
      const maxLines = Math.floor(availableH / 4.5);
      const linesToShow = apiLines.slice(0, Math.max(0, maxLines));

      doc.text(linesToShow, margin, y);
      y += linesToShow.length * 4.5 + 15;
    }
  }

  // ==========================================
  // ── SPIRITUAL LESSON BOX (Image 1 Style) ──
  // ==========================================

  if (y > pageH - 120) {
    doc.addPage();
    addPageBackground(doc);
    y = 30;
  }

  const boxH = 40;
  doc.setFillColor(242, 242, 242); // Very light grey
  doc.rect(margin, y, w - 28, boxH, "F");

  // Center coordinate of the box
  const cx = w / 2;

  // Custom "Om" Image / Icon Placeholder (Golden color)
  const omY = y + 12;
  const golden = [242, 175, 41];
  doc.setDrawColor(golden[0], golden[1], golden[2]);
  doc.setLineWidth(0.6);
  doc.circle(cx, omY, 4, "S");
  doc.circle(cx, omY, 2, "F"); // Inner dot
  // Little semi-circle above (chandrabindu style)
  doc.setLineWidth(0.4);
  doc.ellipse(cx, omY - 6, 3, 1.5, "S");
  doc.circle(cx, omY - 7.5, 0.8, "F");

  // Title: Spiritual lesson to learn
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
  doc.text(L.spiritualLesson || "Spiritual lesson to learn", cx, omY + 10, {
    align: "center",
  });

  // Decorative line under title
  const lineY = omY + 14;
  doc.setDrawColor(decoColor[0], decoColor[1], decoColor[2]);
  doc.setLineWidth(0.3);
  doc.line(cx - 15, lineY, cx + 15, lineY);
  doc.setLineWidth(1);
  doc.line(cx - 3, lineY, cx + 3, lineY); // Thicker center

  // The actual lesson (Green colored text in Image 1)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(50, 150, 80); // Green color
  doc.text(String(meta?.spiritualLesson || "—"), cx, lineY + 8, {
    align: "center",
  });

  y += boxH + 15;

  // ==========================================
  // ── HELPER FUNCTION: DRAW PILLS ──
  // ==========================================
  // Image 1 draws traits as colorful pill badges instead of bullet points.

  const drawTraitPills = (
    title: string,
    traits: string[],
    colors: number[][],
    currentY: number,
  ) => {
    // Section Title
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2]);
    doc.text(title, cx, currentY, { align: "center" });

    // Decorative line
    const ly = currentY + 4;
    doc.setDrawColor(decoColor[0], decoColor[1], decoColor[2]);
    doc.setLineWidth(0.3);
    doc.line(cx - 15, ly, cx + 15, ly);
    doc.setLineWidth(1);
    doc.line(cx - 3, ly, cx + 3, ly);

    const py = ly + 10;

    // Draw Pills centered
    if (Array.isArray(traits) && traits.length > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      const pillGap = 4;
      const pillHeight = 7;
      const pillPadding = 10; // Extra width padding inside the pill

      // Calculate total width of all pills to center them
      let totalWidth = 0;
      const pillWidths = traits.map((t) => {
        const tw = doc.getTextWidth(t) + pillPadding;
        totalWidth += tw;
        return tw;
      });
      totalWidth += (traits.length - 1) * pillGap;

      let currentX = cx - totalWidth / 2; // Start drawing from here to be perfectly centered

      traits.forEach((trait, i) => {
        const pWidth = pillWidths[i];
        const c = colors[i % colors.length]; // Loop through provided colors

        // Draw Pill background
        doc.setFillColor(c[0], c[1], c[2]);
        doc.roundedRect(currentX, py - 5, pWidth, pillHeight, 3.5, 3.5, "F");

        // Draw Text
        doc.setTextColor(255, 255, 255);
        doc.text(trait, currentX + pWidth / 2, py - 0.5, { align: "center" });

        currentX += pWidth + pillGap;
      });
    }

    return py + 15; // Return new Y position
  };

  // ==========================================
  // ── POSITIVE TRAITS (Greenish Colors) ──
  // ==========================================
  const posColors = [
    [40, 140, 60], // Dark Green
    [60, 180, 100], // Medium Green
    [0, 150, 150], // Teal
    [40, 180, 200], // Cyan
  ];
  y = drawTraitPills(
    L.positiveTraits || "Positive Traits",
    meta.positiveTraits || [],
    posColors,
    y,
  );

  y += 5; // Gap between sections

  // ==========================================
  // ── NEGATIVE TRAITS (Warm Colors) ──
  // ==========================================
  const negColors = [
    [242, 140, 0], // Orange
    [230, 80, 40], // Red-Orange
    [240, 160, 0], // Yellow-Orange
    [250, 190, 0], // Golden Yellow
  ];
  y = drawTraitPills(
    L.negativeTraits || "Negative Traits",
    meta.negativeTraits || [],
    negColors,
    y,
  );
}
