// pdf-pages.ts — Page rendering functions for Mini Horoscope PDF (Pages 1–9)
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ZODIAC_SIGNS,
  SIGN_LORDS,
  NAKSHATRAS,
  NAKSHATRA_LORDS,
  PLANET_SYMBOLS,
  DASHA_ORDER_PAGE5,
  DASHA_ORDER_PAGE6,
  COLORS,
  Labels,
  ASCENDANT_DATA,
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
export function renderCoverPage(
  doc: jsPDF,
  name: string,
  dob: string,
  tob: string,
  pob: string,
  lang: string,
  L: Labels,
) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Cream background
  addPageBackground(doc);

  // Decorative borders
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(3);
  doc.rect(10, 10, w - 20, h - 20);
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(1);
  doc.rect(15, 15, w - 30, h - 30);

  // Corner decorations
  drawCornerDecoration(doc, 15, 15, COLORS.secondary);
  drawCornerDecoration(doc, w - 15, 15, COLORS.secondary, true);
  drawCornerDecoration(doc, 15, h - 15, COLORS.secondary, false, true);
  drawCornerDecoration(doc, w - 15, h - 15, COLORS.secondary, true, true);

  // Title
  let y = 65;
  doc.setFontSize(30);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(L.title, w / 2, y, { align: "center" });

  y += 14;
  doc.setFontSize(16);
  doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.text(L.coverSubtitle, w / 2, y, { align: "center" });

  // Gold line
  y += 12;
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(2);
  doc.line(50, y, w - 50, y);

  // Person details box
  y += 20;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(1);
  doc.roundedRect(30, y, w - 60, 95, 5, 5, "FD");

  y += 18;
  doc.setFontSize(20);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(name, w / 2, y, { align: "center" });

  const details = [
    [L.dob, dob],
    [L.tob, tob],
    [L.pob, pob],
    [L.language, L.langName],
    [L.generatedOn, new Date().toLocaleDateString()],
  ];

  y += 14;
  doc.setFontSize(11);
  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(`${label}: `, 50, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(value, 110, y);
    y += 12;
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(
    COLORS.lightText[0],
    COLORS.lightText[1],
    COLORS.lightText[2],
  );
  doc.text(L.generatedBy, w / 2, h - 25, { align: "center" });
}

// ============================================================
// PAGE 2 — BASIC ASTROLOGICAL DETAILS
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
  apiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.basicDetails);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Grid Configuration
  const margin = 10;
  const colWidth = (pageWidth - margin * 3) / 2; // 2 columns
  const startY = 34;
  const rowGap = 8;

  // Column positions
  const col1X = margin;
  const col2X = margin + colWidth + margin;

  const birthDetails = apiData.birth_details;
  const astroDetails = apiData.astro_details;
  const ghatData = apiData.ghat_chakra;
  // Panchang data comes from astro_details (Tithi, Yog, Karan, etc.)
  // The separate panchang endpoint returns nested objects/numbers, not strings.

  // ============ ROW 1 ============

  // Section 1: Basic Details (Row 1, Col 1)
  let y1 = addSectionTitleAt(doc, `1. ${L.basicDetails}`, col1X, startY);
  const basicRows = [
    [L.name, name],
    [L.dob, dob],
    [L.tob, tob],
    [L.pob, pob],
    [L.latitude, String(lat)],
    [L.longitude, String(lon)],
    [L.timezone, String(tz)],
    [L.ayanamsa, safeVal(apiData.astro_details, "ayanamsha", "Ayanamsha")],
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
  // @ts-ignore
  const row1Col1EndY = doc.lastAutoTable.finalY;

  // Section 2: Panchang Details (Row 1, Col 2)
  let y2 = addSectionTitleAt(doc, `2. ${L.panchangDetails}`, col2X, startY);
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
  // @ts-ignore
  const row1Col2EndY = doc.lastAutoTable.finalY;

  // Get max Y of Row 1 for Row 2 start
  const row2StartY = Math.max(row1Col1EndY, row1Col2EndY) + rowGap;

  // ============ ROW 2 ============

  // Section 3: Astrological Details (Row 2, Col 1)
  let y3 = addSectionTitleAt(doc, `3. ${L.astroDetails}`, col1X, row2StartY);
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
    [L.tithi, safeVal(astroDetails, "Tithi", "tithi")],
    [L.yoga, safeVal(astroDetails, "Yog", "yoga")],
    [L.karana, safeVal(astroDetails, "Karan", "karana")],
    ["Yunja", safeVal(astroDetails, "yunja", "Yunja")],
    ["Tatva", safeVal(astroDetails, "tatva", "Tatva")],
    ["Name Alphabet", safeVal(astroDetails, "name_alphabet", "NameAlphabet")],
    ["Paya", safeVal(astroDetails, "paya", "Paya")],
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

  // Section 4: Ghat Chakra (Row 2, Col 2)
  if (ghatData) {
    let y4 = addSectionTitleAt(doc, `4. ${L.ghatChakra}`, col2X, row2StartY);
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

// Helper function for section title at specific X position
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
// PAGE 3 — PLANETARY POSITIONS
// ============================================================
export function renderPlanetaryPositionsPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.planetaryPositions);

  const w = doc.internal.pageSize.getWidth();
  let y = 34;

  const planets = apiData.planets_extended || apiData.planets;
  const planetArray: any[] = Array.isArray(planets) ? planets : [];

  // Section 1: Planetary Table
  y = addSectionTitle(doc, `${L.planet} ${L.planetaryPositions}`, y);
  const tableBody: string[][] = [];

  planetArray.forEach((p: any) => {
    const pName = p.name || p.Name || p.planet || "—";
    const retro =
      p.isRetro === true || p.isRetro === "true" || p.is_retro === true
        ? "R"
        : "";
    const sign = p.sign || p.Sign || p.rpiSign || "—";
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
    // @ts-ignore
    y = doc.lastAutoTable.finalY + 10;
  }

  // Section 2: Planet Grid
  y = addSectionTitle(doc, L.planetGrid, y);
  const gridCols = 3;
  const cardW = (w - 40) / gridCols;
  const cardH = 28;
  let col = 0;

  planetArray.forEach((p: any) => {
    const pName = p.name || p.Name || p.planet || "—";
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
// PAGE 4 — HOROSCOPE CHARTS
// ============================================================
export function renderChartsPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.horoscopeCharts);

  const w = doc.internal.pageSize.getWidth();
  const planets = apiData.planets_extended || apiData.planets;
  const planetArray: any[] = Array.isArray(planets) ? planets : [];
  const ascendant =
    apiData.astro_details?.ascendant ||
    apiData.astro_details?.Ascendant ||
    "Aries";
  const ascIdx = ZODIAC_SIGNS.findIndex(
    (s) => s.toLowerCase() === String(ascendant).toLowerCase(),
  );
  const lagnaHouse = ascIdx >= 0 ? ascIdx + 1 : 1;

  // Build planet positions per house
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
      const sym = PLANET_SYMBOLS[pName] || pName.substring(0, 2);
      const retro = p.isRetro === true || p.isRetro === "true" ? "(R)" : "";
      positions[houseNum].push(sym + retro);
    });
    return positions;
  };

  // 3 charts in a 2×1 + 1 grid (2 top, 1 centered bottom)
  const chartSize = 110;
  const gap = 16;
  const row1Y = 38;
  const row1X1 = (w - (chartSize * 2 + gap)) / 2; // Left chart in top row
  const row1X2 = row1X1 + chartSize + gap; // Right chart in top row
  const row2Y = row1Y + chartSize + 22;
  const row2X = (w - chartSize) / 2; // Centered bottom chart

  // Lagna chart (top-left)
  const lagnaPos = buildPositions("sign");
  drawNorthIndianChart(doc, row1X1, row1Y, chartSize, lagnaPos, "D1");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.setFont("helvetica", "bold");
  doc.text(L.lagnaChart, row1X1 + chartSize / 2, row1Y + chartSize + 10, {
    align: "center",
  });

  // Moon chart (top-right)
  drawNorthIndianChart(doc, row1X2, row1Y, chartSize, lagnaPos, "Moon");
  doc.text(L.moonChart, row1X2 + chartSize / 2, row1Y + chartSize + 10, {
    align: "center",
  });

  // Navamsha chart (bottom-center)
  const navPos = buildPositions("nakDegree");
  drawNorthIndianChart(doc, row2X, row2Y, chartSize, navPos, "D9");
  doc.text(L.navamshaChart, row2X + chartSize / 2, row2Y + chartSize + 10, {
    align: "center",
  });

  // Legend
  let y = row2Y + chartSize + 20;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(
    COLORS.lightText[0],
    COLORS.lightText[1],
    COLORS.lightText[2],
  );
  const legendText =
    "Su=Sun, Mo=Moon, Ma=Mars, Me=Mercury, Ju=Jupiter, Ve=Venus, Sa=Saturn, Ra=Rahu, Ke=Ketu, As=Ascendant, (R)=Retrograde";
  const legendLines = doc.splitTextToSize(legendText, w - 28);
  doc.text(legendLines, 14, y);
}

// ============================================================
// PAGE 5 — VIMSHOTTARI DASHA I
// ============================================================
export function renderDashaPage1(
  doc: jsPDF,
  apiData: Record<string, any>,
  subDashaData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.vimshottariDasha1);

  const w = doc.internal.pageSize.getWidth();
  const majorDasha = apiData.major_vdasha;
  const dashaList = Array.isArray(majorDasha) ? majorDasha : [];

  // Grid config: 3 columns
  const margin = 10;
  const gap = 6;
  const colWidth = (w - margin * 2 - gap * 2) / 3;
  const cols = [margin, margin + colWidth + gap, margin + (colWidth + gap) * 2];

  // Track Y position per column
  const colY = [34, 34, 34];

  DASHA_ORDER_PAGE5.forEach((planet, idx) => {
    const col = idx % 3;
    let y = colY[col];
    const colX = cols[col];

    const dasha = dashaList.find(
      (d: any) =>
        (d.planet || d.Planet || d.name || "").toLowerCase() ===
        planet.toLowerCase(),
    );

    // Mahadasha header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    const endDate = dasha
      ? dasha.end || dasha.endDate || dasha.end_date || ""
      : "";
    doc.text(`${planet}`, colX, y);
    if (endDate) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.text(`(${endDate})`, colX, y + 5);
    }
    y += 8;

    // Antardasha table — Planet + End Date only
    const subData = subDashaData[planet];
    const subList = Array.isArray(subData) ? subData : [];
    if (subList.length > 0) {
      autoTable(doc, {
        startY: y,
        margin: { left: colX },
        tableWidth: colWidth,
        head: [[L.planet, L.endDate]],
        body: subList.map((s: any) => [
          s.planet || s.Planet || s.name || "—",
          s.end || s.endDate || s.end_date || "—",
        ]),
        theme: "grid",
        headStyles: {
          fillColor: COLORS.accent,
          textColor: COLORS.white,
          fontSize: 7,
          cellPadding: 1.5,
        },
        bodyStyles: { textColor: COLORS.text, fontSize: 7, cellPadding: 1.5 },
        styles: { lineColor: COLORS.accent, lineWidth: 0.2 },
        alternateRowStyles: { fillColor: [255, 250, 240] },
      });
      // @ts-ignore
      colY[col] = doc.lastAutoTable.finalY + 6;
    } else {
      colY[col] = y + 4;
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
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.vimshottariDasha2);

  const w = doc.internal.pageSize.getWidth();
  const majorDasha = apiData.major_vdasha;
  const dashaList = Array.isArray(majorDasha) ? majorDasha : [];

  // Grid config: 3 columns
  const margin = 10;
  const gap = 6;
  const colWidth = (w - margin * 2 - gap * 2) / 3;
  const cols = [margin, margin + colWidth + gap, margin + (colWidth + gap) * 2];

  // Track Y position per column
  const colY = [34, 34, 34];

  DASHA_ORDER_PAGE6.forEach((planet, idx) => {
    const col = idx % 3;
    let y = colY[col];
    const colX = cols[col];

    const dasha = dashaList.find(
      (d: any) =>
        (d.planet || d.Planet || d.name || "").toLowerCase() ===
        planet.toLowerCase(),
    );

    // Mahadasha header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    const endDate = dasha
      ? dasha.end || dasha.endDate || dasha.end_date || ""
      : "";
    doc.text(`${planet}`, colX, y);
    if (endDate) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.text(`(${endDate})`, colX, y + 5);
    }
    y += 8;

    // Antardasha table — Planet + End Date only
    const subData = subDashaData[planet];
    const subList = Array.isArray(subData) ? subData : [];
    if (subList.length > 0) {
      autoTable(doc, {
        startY: y,
        margin: { left: colX },
        tableWidth: colWidth,
        head: [[L.planet, L.endDate]],
        body: subList.map((s: any) => [
          s.planet || s.Planet || s.name || "—",
          s.end || s.endDate || s.end_date || "—",
        ]),
        theme: "grid",
        headStyles: {
          fillColor: COLORS.accent,
          textColor: COLORS.white,
          fontSize: 7,
          cellPadding: 1.5,
        },
        bodyStyles: { textColor: COLORS.text, fontSize: 7, cellPadding: 1.5 },
        styles: { lineColor: COLORS.accent, lineWidth: 0.2 },
        alternateRowStyles: { fillColor: [255, 250, 240] },
      });
      // @ts-ignore
      colY[col] = doc.lastAutoTable.finalY + 6;
    } else {
      colY[col] = y + 4;
    }
  });

  // Get max Y from all columns for Current Dasha placement
  let y = Math.max(...colY);

  // Current Dasha section
  if (y > doc.internal.pageSize.getHeight() - 60) {
    doc.addPage();
    addPageBackground(doc);
    y = 30;
  }
  y = addSectionTitle(doc, L.currentDasha, y + 4);
  const currentDasha = apiData.current_vdasha;

  if (currentDasha) {
    const rows: string[][] = [];
    if (currentDasha.major_dasha || currentDasha.mahadasha) {
      const md = currentDasha.major_dasha || currentDasha.mahadasha || {};
      rows.push([
        L.mahadasha,
        md.planet || md.Planet || "—",
        md.start || md.startDate || "—",
        md.end || md.endDate || "—",
      ]);
    }
    if (currentDasha.sub_dasha || currentDasha.antardasha) {
      const ad = currentDasha.sub_dasha || currentDasha.antardasha || {};
      rows.push([
        L.antardasha,
        ad.planet || ad.Planet || "—",
        ad.start || ad.startDate || "—",
        ad.end || ad.endDate || "—",
      ]);
    }
    if (currentDasha.sub_sub_dasha || currentDasha.pratyantardasha) {
      const pd =
        currentDasha.sub_sub_dasha || currentDasha.pratyantardasha || {};
      rows.push([
        "Pratyantardasha",
        pd.planet || pd.Planet || "—",
        pd.start || pd.startDate || "—",
        pd.end || pd.endDate || "—",
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
// PAGE 7 — ASCENDANT REPORT
// ============================================================
export function renderAscendantPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: Labels,
): string {
  doc.addPage();
  addPageBackground(doc);

  const w = doc.internal.pageSize.getWidth();
  const ascName =
    apiData.astro_details?.ascendant ||
    apiData.astro_details?.Ascendant ||
    "Aries";
  const meta = ASCENDANT_DATA[ascName] || ASCENDANT_DATA["Aries"];

  addPageHeader(doc, `${L.ascendantReport} - ${ascName}`);
  let y = 34;

  // Sign attributes table
  const attrRows = [
    [L.lord, SIGN_LORDS[ZODIAC_SIGNS.indexOf(ascName)] || "—"],
    [L.symbol, meta.symbol],
    [L.element, meta.element],
    [L.nature, meta.nature],
    [L.direction, meta.direction],
    [L.luckyGem, meta.luckyGem],
    [L.dayOfFast, meta.dayOfFast],
  ];
  autoTable(doc, {
    startY: y,
    body: attrRows,
    theme: "grid",
    bodyStyles: { textColor: COLORS.text, fontSize: 10 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50, fillColor: COLORS.chartBg },
    },
    styles: { cellPadding: 4, lineColor: COLORS.accent, lineWidth: 0.3 },
  });
  // @ts-ignore
  y = doc.lastAutoTable.finalY + 10;

  // Sanskrit Shloka
  y = addSectionTitle(doc, L.shloka, y);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
  const shlokaLines = doc.splitTextToSize(meta.shloka, w - 40);
  doc.text(shlokaLines, 20, y);
  y += shlokaLines.length * 6 + 10;

  // Personality paragraphs
  y = addSectionTitle(doc, L.personality, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  // Also include API ascendant report if available
  const apiReport = apiData.general_ascendant_report;
  const paragraphs = [...meta.personality];
  if (apiReport && typeof apiReport === "object") {
    const reportText =
      apiReport.report || apiReport.Report || apiReport.description || "";
    if (reportText) paragraphs.push(String(reportText));
  }

  paragraphs.forEach((para) => {
    if (y > doc.internal.pageSize.getHeight() - 30) return;
    const lines = doc.splitTextToSize(para, w - 40);
    doc.text(lines, 20, y);
    y += lines.length * 5 + 6;
  });

  return ascName;
}

// ============================================================
// PAGE 8 — ASCENDANT ANALYSIS CONTINUED
// ============================================================
export function renderAscendantAnalysisPage(
  doc: jsPDF,
  ascName: string,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, `${L.ascendantAnalysis} - ${ascName}`);

  const w = doc.internal.pageSize.getWidth();
  const meta = ASCENDANT_DATA[ascName] || ASCENDANT_DATA["Aries"];
  const lord = SIGN_LORDS[ZODIAC_SIGNS.indexOf(ascName)] || "—";
  let y = 34;

  // Planet importance section
  y = addSectionTitle(doc, `${lord} - Importance for ${ascName}`, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const impText = `As the ruling planet of ${ascName}, ${lord} plays a pivotal role in shaping the native's personality, health, and life direction. A well-placed ${lord} in the birth chart strengthens the ascendant and brings favorable results in the areas governed by the house it occupies. The strength, dignity, and aspects on ${lord} are crucial in determining the overall quality of life for ${ascName} ascendant natives.`;
  const impLines = doc.splitTextToSize(impText, w - 40);
  doc.text(impLines, 20, y);
  y += impLines.length * 5 + 12;

  // Spiritual Lesson
  y = addSectionTitle(doc, L.spiritualLesson, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const spiritLines = doc.splitTextToSize(meta.spiritualLesson, w - 40);
  doc.text(spiritLines, 20, y);
  y += spiritLines.length * 5 + 12;

  // Positive Traits
  y = addSectionTitle(doc, L.positiveTraits, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  meta.positiveTraits.forEach((trait) => {
    if (y > doc.internal.pageSize.getHeight() - 20) return;
    doc.setFillColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.circle(18, y - 1.5, 1.5, "F");
    doc.text(`  ${trait}`, 22, y);
    y += 8;
  });
  y += 6;

  // Negative Traits
  y = addSectionTitle(doc, L.negativeTraits, y);
  meta.negativeTraits.forEach((trait) => {
    if (y > doc.internal.pageSize.getHeight() - 20) return;
    doc.setFillColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
    doc.circle(18, y - 1.5, 1.5, "F");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(`  ${trait}`, 22, y);
    y += 8;
  });
}

// ============================================================
// PAGE 9 — DISCLAIMER
// ============================================================
export function renderDisclaimerPage(doc: jsPDF, L: Labels) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.disclaimer);

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  let y = 50;

  // Disclaimer box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(1);
  doc.roundedRect(20, y, w - 40, 100, 5, 5, "FD");

  y += 18;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
  doc.text(L.disclaimer, w / 2, y, { align: "center" });

  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const disclaimerLines = doc.splitTextToSize(L.disclaimerText, w - 60);
  doc.text(disclaimerLines, 30, y);

  // Brand info
  y = 185;
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(1.5);
  doc.line(50, y, w - 50, y);

  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.generatedBy, w / 2, y, { align: "center" });

  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(
    COLORS.lightText[0],
    COLORS.lightText[1],
    COLORS.lightText[2],
  );
  doc.text(L.contactInfo, w / 2, y, { align: "center" });
}
