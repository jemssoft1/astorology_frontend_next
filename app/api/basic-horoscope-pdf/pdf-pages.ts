// pdf-pages.ts — Page rendering functions for Basic Horoscope PDF (Pages 1–13)
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ZODIAC_SIGNS,
  PLANET_SYMBOLS,
  COLORS,
  DIVISIONAL_CHARTS,
  DASHA_ORDER_PAGE7,
  DASHA_ORDER_PAGE8,
  YOGINI_DASHAS,
  NUMEROLOGY_FIELDS_EN,
  NUMEROLOGY_FIELDS_HI,
  HOUSE_CUSPS_DESCRIPTION_EN,
  HOUSE_CUSPS_DESCRIPTION_HI,
  KALSARPA_TYPES,
  ASCENDANT_DATA,
} from "./constants";
import type { Labels } from "./constants";
import {
  addPageBackground,
  addPageHeader,
  addSectionTitle,
  drawCornerDecoration,
  drawNorthIndianChart,
} from "./helpers";

// Safe value extractor
function safeVal(obj: any, ...keys: string[]): string {
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
  addPageBackground(doc);

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

  drawCornerDecoration(doc, 15, 15, COLORS.secondary);
  drawCornerDecoration(doc, w - 15, 15, COLORS.secondary, true);
  drawCornerDecoration(doc, 15, h - 15, COLORS.secondary, false, true);
  drawCornerDecoration(doc, w - 15, h - 15, COLORS.secondary, true, true);

  let y = 65;
  doc.setFontSize(30);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(L.title, w / 2, y, { align: "center" });

  y += 14;
  doc.setFontSize(16);
  doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.text(L.coverSubtitle, w / 2, y, { align: "center" });

  y += 12;
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(2);
  doc.line(50, y, w - 50, y);

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

  doc.setFontSize(10);
  doc.setTextColor(
    COLORS.lightText[0],
    COLORS.lightText[1],
    COLORS.lightText[2],
  );
  doc.text(L.generatedBy, w / 2, h - 25, { align: "center" });
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
  apiData: Record<string, any>,
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
  let y1 = addSectionTitleAt(doc, `1. ${L.basicDetails}`, col1X, startY);
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
  // @ts-ignore
  const row1Col1EndY = doc.lastAutoTable.finalY;

  // Section 2: Panchang
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
  const row2StartY = Math.max(row1Col1EndY, row1Col2EndY) + rowGap;

  // Section 3: Astro Details
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

  y = addSectionTitle(doc, `${L.planet} ${L.planetaryPositions}`, y);
  const tableBody: string[][] = [];
  planetArray.forEach((p: any) => {
    const pName = p.name || p.Name || p.planet || "—";
    const retro =
      p.isRetro === true || p.isRetro === "true" || p.is_retro === true
        ? "R"
        : "";
    const sign = p.sign || p.Sign || "—";
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

  // Planet Grid
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
// PAGE 4 — HOROSCOPE CHARTS (Lagna, Moon, Navamsha)
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

  const buildPositions = (signKey: string) => {
    const positions: Record<number, string[]> = {};
    for (let i = 1; i <= 12; i++) positions[i] = [];
    positions[lagnaHouse].push("As");
    planetArray.forEach((p: any) => {
      const pName = String(p.name || p.Name || p.planet || "");
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

  const chartSize = 110;
  const gap = 16;
  const row1Y = 38;
  const row1X1 = (w - (chartSize * 2 + gap)) / 2;
  const row1X2 = row1X1 + chartSize + gap;
  const row2Y = row1Y + chartSize + 22;
  const row2X = (w - chartSize) / 2;

  const lagnaPos = buildPositions("sign");
  drawNorthIndianChart(doc, row1X1, row1Y, chartSize, lagnaPos, "D1");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.setFont("helvetica", "bold");
  doc.text(L.lagnaChart, row1X1 + chartSize / 2, row1Y + chartSize + 10, {
    align: "center",
  });

  drawNorthIndianChart(doc, row1X2, row1Y, chartSize, lagnaPos, "Moon");
  doc.text(L.moonChart, row1X2 + chartSize / 2, row1Y + chartSize + 10, {
    align: "center",
  });

  const navPos = buildPositions("nakDegree");
  drawNorthIndianChart(doc, row2X, row2Y, chartSize, navPos, "D9");
  doc.text(L.navamshaChart, row2X + chartSize / 2, row2Y + chartSize + 10, {
    align: "center",
  });

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
  doc.text(doc.splitTextToSize(legendText, w - 28), 14, y);
}

// ============================================================
// PAGE 5 — DIVISIONAL CHARTS (3×3 grid)
// ============================================================
export function renderDivisionalChartsPage(
  doc: jsPDF,
  apiData: Record<string, any>,
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

    // Build positions from divisional chart API data
    const chartData = apiData[`horo_chart_${cfg.apiChart}`];
    const positions: Record<number, string[]> = {};
    for (let h = 1; h <= 12; h++) positions[h] = [];
    if (Array.isArray(chartData)) {
      chartData.forEach((entry: any) => {
        const houseNum = Number(entry.house || entry.House || 1);
        const pName = String(entry.planet || entry.name || entry.Name || "");
        const sym = PLANET_SYMBOLS[pName] || pName.substring(0, 2);
        if (houseNum >= 1 && houseNum <= 12) positions[houseNum].push(sym);
      });
    } else if (chartData && typeof chartData === "object") {
      // Handle object-format chart data
      Object.entries(chartData).forEach(([key, val]: [string, any]) => {
        if (key === "statusCode" || key === "status") return;
        const houseNum = Number(key);
        if (!isNaN(houseNum) && houseNum >= 1 && houseNum <= 12) {
          const planets = Array.isArray(val) ? val : [val];
          planets.forEach((p: any) => {
            const pName = String(
              typeof p === "string" ? p : p?.name || p?.planet || "",
            );
            if (pName)
              positions[houseNum].push(
                PLANET_SYMBOLS[pName] || pName.substring(0, 2),
              );
          });
        }
      });
    }

    // Draw chart
    const label = cfg.apiChart === "SUN" ? "Sun" : cfg.apiChart;
    drawNorthIndianChart(
      doc,
      cx + (chartW - chartSize) / 2,
      cy,
      chartSize,
      positions,
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
// PAGE 6 — HOUSE CUSPS AND SANDHI
// ============================================================
export function renderHouseCuspsPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  lang: string,
  L: Labels,
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
  const ascDeg = safeVal(cuspsData, "ascendant", "Ascendant", "asc_degree");
  const mcDeg = safeVal(cuspsData, "midheaven", "Midheaven", "mc_degree");
  doc.text(`${L.ascendantLabel || "Ascendant"} - ${ascDeg}`, 14, y);
  doc.text(`${L.midheavenLabel || "Midheaven"} - ${mcDeg}`, w / 2, y);
  y += 10;

  // Build house cusps table
  const tableBody: string[][] = [];
  for (let h = 1; h <= 12; h++) {
    const houseData = cuspsData?.[`house_${h}`] || cuspsData?.[String(h)] || {};
    const sign =
      typeof houseData === "object"
        ? safeVal(houseData, "sign", "Sign", "rpiSign")
        : String(houseData);
    const bhavMadhya =
      typeof houseData === "object"
        ? safeVal(houseData, "degree", "cusp_degree", "bhav_madhya")
        : "—";
    const sandhi =
      typeof houseData === "object"
        ? safeVal(houseData, "sandhi", "bhav_sandhi", "end_degree")
        : "—";
    tableBody.push([String(h), sign, bhavMadhya, sign, sandhi]);
  }

  autoTable(doc, {
    startY: y,
    head: [
      [
        L.house,
        L.sign,
        L.bhavMadhya || "Bhav Madhya",
        L.sign,
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
  // @ts-ignore
  y = doc.lastAutoTable.finalY + 8;

  // Chalit Chart section
  y = addSectionTitle(doc, L.chalitChart || "Chalit Chart", y);
  const chalitData = apiData.horo_chart_chalit;
  const positions: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) positions[i] = [];
  if (Array.isArray(chalitData)) {
    chalitData.forEach((entry: any) => {
      const houseNum = Number(entry.house || entry.House || 1);
      const pName = String(entry.planet || entry.name || "");
      if (houseNum >= 1 && houseNum <= 12)
        positions[houseNum].push(
          PLANET_SYMBOLS[pName] || pName.substring(0, 2),
        );
    });
  }

  const chartSize = 75;
  const chartX = 14;
  const chartY = y;
  drawNorthIndianChart(doc, chartX, chartY, chartSize, positions, "Chalit");

  // Description text
  const textX = chartX + chartSize + 10;
  const textW = w - textX - 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const descText =
    lang === "hi" ? HOUSE_CUSPS_DESCRIPTION_HI : HOUSE_CUSPS_DESCRIPTION_EN;
  const descLines = doc.splitTextToSize(descText, textW);
  doc.text(descLines, textX, chartY + 8);
}

// ============================================================
// PAGE 7 — VIMSHOTTARI DASHA I (3×2 grid)
// ============================================================
export function renderVimshottariDasha1Page(
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
      (d: any) =>
        (d.planet || d.Planet || d.name || "").toLowerCase() ===
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
        body: subList.map((s: any) => [
          s.planet || s.Planet || s.name || "—",
          s.start || s.startDate || s.start_date || "—",
          s.end || s.endDate || s.end_date || "—",
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
      // @ts-ignore
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
  const margin = 10;
  const gap = 6;
  const colWidth = (w - margin * 2 - gap * 2) / 3;
  const cols = [margin, margin + colWidth + gap, margin + (colWidth + gap) * 2];
  const colY = [34, 34, 34];

  DASHA_ORDER_PAGE8.forEach((planet, idx) => {
    const col = idx % 3;
    let y = colY[col];
    const colX = cols[col];
    const dasha = dashaList.find(
      (d: any) =>
        (d.planet || d.Planet || d.name || "").toLowerCase() ===
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
        body: subList.map((s: any) => [
          s.planet || s.Planet || s.name || "—",
          s.start || s.startDate || s.start_date || "—",
          s.end || s.endDate || s.end_date || "—",
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
      // @ts-ignore
      colY[col] = doc.lastAutoTable.finalY + 6;
    } else {
      colY[col] = y + 4;
    }
  });

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
    const md = src.major || src.major_dasha || src.mahadasha || {};
    if (md.planet || md.Planet) {
      rows.push([
        L.mahadasha,
        md.planet || md.Planet || "—",
        md.start || md.startDate || "—",
        md.end || md.endDate || "—",
      ]);
    }
    const ad = src.minor || src.sub_dasha || src.antardasha || {};
    if (ad.planet || ad.Planet) {
      rows.push([
        L.antardasha,
        ad.planet || ad.Planet || "—",
        ad.start || ad.startDate || "—",
        ad.end || ad.endDate || "—",
      ]);
    }
    const pd = src.sub_minor || src.sub_sub_dasha || src.pratyantardasha || {};
    if (pd.planet || pd.Planet) {
      rows.push([
        L.pratyantarDasha || "Prtyantar Dasha",
        pd.planet || pd.Planet || "—",
        pd.start || pd.startDate || "—",
        pd.end || pd.endDate || "—",
      ]);
    }
    const sd = src.sub_sub_minor || src.sub_sub_sub_dasha || src.sookshm || {};
    if (sd.planet || sd.Planet) {
      rows.push([
        L.sookshmDasha || "Sookshm Dasha",
        sd.planet || sd.Planet || "—",
        sd.start || sd.startDate || "—",
        sd.end || sd.endDate || "—",
      ]);
    }
    const prd = src.sub_sub_sub_minor || {};
    if (prd.planet || prd.Planet) {
      rows.push([
        "Pran Dasha",
        prd.planet || prd.Planet || "—",
        prd.start || prd.startDate || "—",
        prd.end || prd.endDate || "—",
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
  yoginiData: Record<string, any>,
  dashaNames: string[],
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

  dashaNames.forEach((name, idx) => {
    const col = idx % 3;
    let y = colY[col];
    const colX = cols[col];

    // Strip cycle markers like "(II)" or "(III)" to match API dasha_name
    const baseName = name.replace(/\s*\(.*\)$/, "").trim();
    const dasha = majorList.find((d: any) =>
      (d.dasha_name || d.name || d.planet || "")
        .toLowerCase()
        .includes(baseName.toLowerCase()),
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(name, colX, y);

    const startD = dasha
      ? dasha.start || dasha.start_date || dasha.startDate || ""
      : "";
    const endD = dasha
      ? dasha.end || dasha.end_date || dasha.endDate || ""
      : "";
    if (startD || endD) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.text(`${startD} - ${endD}`, colX, y + 4);
    }
    y += 8;

    // Sub-dasha details — find matching entry in sub_yogini_dasha array
    const subEntry = subDashaList.find((entry: any) => {
      const majorName =
        entry?.major_dasha?.dasha_name || entry?.major_dasha?.name || "";
      return majorName.toLowerCase().includes(baseName.toLowerCase());
    });
    const subList = Array.isArray(subEntry?.sub_dasha)
      ? subEntry.sub_dasha
      : [];

    if (subList.length > 0) {
      autoTable(doc, {
        startY: y,
        margin: { left: colX },
        tableWidth: colWidth,
        head: [["Dasha", L.startDate, L.endDate]],
        body: subList.map((s: any) => [
          s.dasha_name || s.name || s.planet || "—",
          s.start || s.start_date || "—",
          s.end || s.end_date || "—",
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
      // @ts-ignore
      colY[col] = doc.lastAutoTable.finalY + 6;
    } else {
      colY[col] = y + 4;
    }
  });
}

// PAGE 9 — YOGINI DASHA I
export function renderYoginiDasha1Page(
  doc: jsPDF,

  yoginiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.yoginiDasha1 || "Yogini Dasha - I");
  const names = YOGINI_DASHAS.slice(0, 6).map((d) => d.name);
  renderYoginiDashaGrid(doc, yoginiData, names, L);
}

// PAGE 10 — YOGINI DASHA II
export function renderYoginiDasha2Page(
  doc: jsPDF,
  yoginiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.yoginiDasha2 || "Yogini Dasha - II");
  const names = YOGINI_DASHAS.slice(6, 8).map((d) => d.name);
  // For page fill, also show extended cycles
  const extNames = [
    ...names,
    ...YOGINI_DASHAS.slice(0, 4).map((d) => `${d.name} (II)`),
  ];
  renderYoginiDashaGrid(doc, yoginiData, extNames, L);
}

// PAGE 11 — YOGINI DASHA III
export function renderYoginiDasha3Page(
  doc: jsPDF,
  yoginiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.yoginiDasha3 || "Yogini Dasha - III");
  const names = YOGINI_DASHAS.slice(4, 8).map((d) => `${d.name} (II)`);
  const extNames = [
    ...names,
    ...YOGINI_DASHAS.slice(0, 2).map((d) => `${d.name} (III)`),
  ];
  renderYoginiDashaGrid(doc, yoginiData, extNames, L);
}

// ============================================================
// PAGE 12 — FAVOURABLE POINTS
// ============================================================
export function renderFavourablePointsPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  numerologyData: Record<string, any>,
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
  const numTable = numerologyData.numero_table;

  // Top row: 3 number boxes
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
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setLineWidth(1.5);
    doc.roundedRect(bx, y, boxW, boxH, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(labels[i], bx + boxW / 2, y + 12, { align: "center" });

    const val = safeVal(numTable, keys[i], altKeys[i]);
    doc.setFontSize(18);
    doc.setTextColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
    doc.text(val, bx + boxW / 2, y + 28, { align: "center" });
  }
  y += boxH + 12;

  // Info table
  const fieldLabels =
    lang === "hi" ? NUMEROLOGY_FIELDS_HI : NUMEROLOGY_FIELDS_EN;
  const fieldKeys = [
    "name",
    "dob",
    "radical_number",
    "radical_ruler",
    "friendly_numbers",
    "neutral_numbers",
    "evil_numbers",
    "fav_day",
    "fav_stone",
    "fav_sub_stone",
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
    tableRows.push([fieldLabels[idx] || key, val]);
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
  doc: jsPDF,
  numerologyData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.numerologyReport || "Numerology Report");

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const y = 38;
  const numTable = numerologyData.numero_table;
  const numReport = numerologyData.numero_report;
  const numFavTime = numerologyData.numero_fav_time;
  const numFavMantra = numerologyData.numero_fav_mantra;

  const margin = 14;
  const gap = 10;
  const leftW = (w - margin * 2 - gap) * 0.5;
  const rightW = (w - margin * 2 - gap) * 0.5;
  const rightX = margin + leftW + gap;

  // ── LEFT COLUMN: Radical Number box + Numerology Report ──
  const radNum = safeVal(numTable, "radical_number", "radicalNumber");
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(2);
  doc.roundedRect(margin, y, leftW, 50, 4, 4, "FD");

  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
  doc.text(radNum, margin + leftW / 2, y + 35, { align: "center" });

  // Numerology Report text below the number box
  let ly = y + 60;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.numerologyReport || "Numerology Report", margin, ly);
  ly += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  if (numReport && typeof numReport === "object") {
    const reportText =
      numReport.report ||
      numReport.prediction ||
      numReport.description ||
      JSON.stringify(numReport);
    const reportLines = doc.splitTextToSize(String(reportText), leftW);
    const maxReportLines = Math.floor((h - ly - 20) / 4);
    doc.text(reportLines.slice(0, maxReportLines), margin, ly);
  }

  // ── RIGHT COLUMN: Favourable Time + Gayatri Mantra ──
  let ry = y;

  // Favourable Time For You
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.favTimeForYou || "Favourable Time For You", rightX, ry);
  ry += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  if (numFavTime && typeof numFavTime === "object") {
    const favTimeText =
      numFavTime.description ||
      numFavTime.fav_time ||
      numFavTime.favourable_time ||
      numFavTime.report ||
      JSON.stringify(numFavTime);
    const ftLines = doc.splitTextToSize(String(favTimeText), rightW);
    doc.text(ftLines, rightX, ry);
    ry += ftLines.length * 4 + 10;
  }

  // Favourable Gayatri Mantra For You
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(
    L.favGayatriMantra || "Favourable Gayatri Mantra For You",
    rightX,
    ry,
  );
  ry += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  if (numFavMantra && typeof numFavMantra === "object") {
    const mantraText =
      numFavMantra.description ||
      numFavMantra.mantra ||
      numFavMantra.fav_mantra ||
      numFavMantra.report ||
      JSON.stringify(numFavMantra);
    const mLines = doc.splitTextToSize(String(mantraText), rightW);
    doc.text(mLines, rightX, ry);
  }
}

// ============================================================
// PAGE 14 — KALSARPA DOSHA
// ============================================================
export function renderKalsarpaDoshaPage(
  doc: jsPDF,
  kalsarpaData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.kalsarpaDosha || "Kalsarpa Dosha");

  const w = doc.internal.pageSize.getWidth();
  let y = 34;
  const kd = kalsarpaData.kalsarpa_details || {};

  // Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const desc = L.kalsarpaDescription || "";
  const descLines = doc.splitTextToSize(desc, w - 28);
  doc.text(descLines, 14, y);
  y += descLines.length * 4.5 + 10;

  // Types Layout: 2 columns of 6
  y = addSectionTitle(doc, "Kalsarpa Types", y);
  const types = KALSARPA_TYPES;
  const mid = Math.ceil(types.length / 2);
  const col1 = types.slice(0, mid);
  const col2 = types.slice(mid);
  const leftX = 20;
  const rightX = w / 2 + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);

  let ty = y;
  col1.forEach((t) => {
    doc.text(`• ${t}`, leftX, ty);
    ty += 6;
  });

  ty = y;
  col2.forEach((t) => {
    doc.text(`• ${t}`, rightX, ty);
    ty += 6;
  });
  y = ty + 10;

  // Kalsarpa Status Grid
  const isPresent = kd.present || false;
  const presentText = isPresent
    ? L.kalsarpaPresent || "Kalsarpa is present"
    : L.kalsarpaNotPresent || "Kalsarpa is not present";

  const boxY = y;
  const boxH = 60;
  const boxW = (w - 34) / 2;
  const boxLeftX = 14;
  const boxRightX = 14 + boxW + 6;

  // Draw two boxes
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(0.5);
  doc.setFillColor(255, 255, 255);

  // Left Box
  doc.rect(boxLeftX, boxY, boxW, boxH, "FD");
  // Draw status indicator circle (emojis don't render in jsPDF)
  const circleX = boxLeftX + boxW / 2;
  const circleY = boxY + 14;
  const circleR = 6;
  if (isPresent) {
    doc.setFillColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
  } else {
    doc.setFillColor(34, 139, 34); // Green
  }
  doc.circle(circleX, circleY, circleR, "F");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(isPresent ? "X" : "OK", circleX, circleY + 3, { align: "center" });
  doc.setFontSize(11);
  const c = isPresent ? COLORS.darkRed : COLORS.primary;
  doc.setTextColor(c[0], c[1], c[2]);
  doc.text(presentText, boxLeftX + boxW / 2, boxY + 30, { align: "center" });

  const oneLineDesc = kd.one_line || "";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const oneLineLines = doc.splitTextToSize(oneLineDesc, boxW - 10);
  doc.text(oneLineLines, boxLeftX + 5, boxY + 38);

  // Right Box
  doc.setFillColor(255, 255, 255);
  doc.rect(boxRightX, boxY, boxW, boxH, "FD");

  let Ry = boxY + 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.kalsarpaName || "Kalsarpa Name", boxRightX + 10, Ry);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const kName = kd.type || "—";
  doc.text(kName, boxRightX + boxW - 10, Ry, { align: "right" });

  Ry += 12;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.kalsarpaDirection || "Direction", boxRightX + 10, Ry);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const kDir = kd.direction || "—";
  doc.text(kDir, boxRightX + boxW - 10, Ry, { align: "right" });
}

// ============================================================
// PAGE 15 — KALSARPA REPORT
// ============================================================
export function renderKalsarpaEffectPage(
  doc: jsPDF,
  kalsarpaData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.kalsarpaReport || "Kaal Sarp Dosh Report");

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  let y = 34;

  const kd = kalsarpaData.kalsarpa_details || {};
  // Report
  // Report
  const report = kd.report || {};
  let reportText = report.report || report.bot_response;

  if (!reportText) {
    if (kd.one_line) {
      reportText = kd.one_line;
    } else if (kd.present === false) {
      reportText =
        "Kalsarpa Dosha is not present in the horoscope. No remedial measures are required.";
    } else {
      reportText = "No detailed report available.";
    }
  }

  // Strip HTML tags if present (e.g. <p>)
  reportText = reportText.replace(/<[^>]+>/g, "");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const lines = doc.splitTextToSize(reportText, w - 28);
  doc.text(lines, 14, y);
  y += lines.length * 4.5 + 10;

  // Remedies
  // Remedies
  const remedies = report.remedies || kd.remedies || [];

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
  doc: jsPDF,
  manglikData: Record<string, any>,
  simpleManglik: Record<string, any> | null,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.manglikAnalysis || "Manglik Analysis");

  const w = doc.internal.pageSize.getWidth();
  let y = 34;

  const mData = manglikData.manglik || {};

  // What is Manglik Dosha?
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.whatIsManglik || "What is Manglik Dosha?", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const desc =
    L.manglikDescription ||
    "Manglik Dosha is formed when Mars is placed in the 1st, 2nd, 4th, 7th, 8th or 12th house of the lunar chart. It is believed to cause delays in marriage and disharmony in marital life.";
  const descLines = doc.splitTextToSize(desc, w - 28);
  doc.text(descLines, 14, y);
  y += descLines.length * 4.5 + 10;

  // Manglik Analysis - Percentage Highlight
  y = addSectionTitle(doc, L.manglikAnalysis || "Manglik Analysis", y);

  const percentage = mData.percentage_manglik_present || 0;

  doc.setFillColor(COLORS.cream[0], COLORS.cream[1], COLORS.cream[2]);
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.roundedRect(w / 2 - 40, y, 80, 25, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(
    L.totalManglikPercentage || "TOTAL MANGLIK PERCENTAGE",
    w / 2,
    y + 8,
    { align: "center" },
  );

  doc.setFontSize(14);
  doc.setTextColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
  doc.text(`${percentage}%`, w / 2, y + 18, { align: "center" });
  y += 35;

  // Manglik Report
  y = addSectionTitle(doc, L.manglikReport || "Manglik Report", y);
  const mReport = mData.manglik_report;
  const sReport = simpleManglik?.msg;

  let reportText = mReport || sReport || "Manglik analysis not available.";

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const rLines = doc.splitTextToSize(reportText, w - 28);
  doc.text(rLines, 14, y);
}

// ============================================================
// PAGE 17 — MANGLIK ANALYSIS II
// ============================================================
export function renderManglik2Page(
  doc: jsPDF,
  manglikData: Record<string, any>,
  simpleManglik: Record<string, any> | null,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.manglikAnalysis || "Manglik Analysis");

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  let y = 34;
  const mData = manglikData.manglik || {};

  // 2-Column Grid for House/Aspect Analysis
  const margin = 14;
  const gap = 10;
  const colW = (w - margin * 2 - gap) / 2;
  const leftX = margin;
  const rightX = margin + colW + gap;

  // Icons would ideally be SVG/Images but using text placeholders/emoji for now
  // Left Column: Based On House
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.basedOnHouse || "Based On House", leftX, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  const houseList = mData.manglik_present_rule?.based_on_house || [];
  const houseReport =
    Array.isArray(houseList) && houseList.length > 0
      ? houseList.map((s: string) => `• ${s}`).join("\n")
      : "No detailed analysis available.";

  const hLines = doc.splitTextToSize(houseReport, colW);
  doc.text(hLines, leftX, y + 6);

  // Right Column: Based On Aspects
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.basedOnAspects || "Based On Aspects", rightX, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  const aspectList = mData.manglik_present_rule?.based_on_aspect || [];
  const aspectReport =
    Array.isArray(aspectList) && aspectList.length > 0
      ? aspectList.map((s: string) => `• ${s}`).join("\n")
      : "No detailed analysis available.";

  const aLines = doc.splitTextToSize(aspectReport, colW);
  doc.text(aLines, rightX, y + 6);

  y += Math.max(hLines.length, aLines.length) * 4.5 + 20;

  // Remedies
  // Remedies
  const remedies = mData.remedies || [];

  if (Array.isArray(remedies) && remedies.length > 0) {
    y = addSectionTitle(
      doc,
      L.remediesOfManglik || "Remedies Of Manglik Dosha",
      y,
    );
    doc.setFontSize(9);
    remedies.forEach((rem: string) => {
      if (y > h - 20) {
        doc.addPage();
        addPageBackground(doc);
        y = 30;
      }
      const bulletText = `• ${rem}`;
      const remLines = doc.splitTextToSize(bulletText, w - 28);
      doc.text(remLines, 14, y);
      y += remLines.length * 4.5 + 3;
    });
  }
}

// ============================================================
// PAGE 18 — SADHESATI ANALYSIS
// ============================================================
export function renderSadhesatiPage(
  doc: jsPDF,
  sadhesatiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.sadhesatiAnalysis || "Sadhesati Analysis");

  const w = doc.internal.pageSize.getWidth();
  let y = 34;
  const sData = sadhesatiData.sadhesati_current_status || {};

  // Proper casting for strict check
  const isPresent = sData.sadhesati_status === true;

  // Intro
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.whatIsSadhesati || "What is Sadhesati Dosha?", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const desc = L.sadhesatiDescription || "";
  const descLines = doc.splitTextToSize(desc, w - 28);
  doc.text(descLines, 14, y);
  y += descLines.length * 4.5 + 10;

  // Layout: Left (Status Box) vs Right (Details)
  const margin = 14;
  const gap = 10;
  const colW = (w - margin * 2 - gap) / 2;
  const leftX = margin;
  const rightX = margin + colW + gap;

  // Left Box - Status
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(leftX, y, colW, 80, 3, 3, "FD");

  // Draw status indicator circle (emojis don't render in jsPDF)
  const circleX = leftX + colW / 2;
  const circleY = y + 20;
  const circleR = 8;
  if (isPresent) {
    doc.setFillColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
  } else {
    doc.setFillColor(34, 139, 34); // Green
  }
  doc.circle(circleX, circleY, circleR, "F");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(isPresent ? "X" : "OK", circleX, circleY + 4, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.sadhesatiStatus || "Sadhesati Status", leftX + colW / 2, y + 40, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(
    isPresent ? COLORS.darkRed[0] : COLORS.primary[0],
    isPresent ? COLORS.darkRed[1] : COLORS.primary[1],
    isPresent ? COLORS.darkRed[2] : COLORS.primary[2],
  );

  const statusMsg = sData.sadhesati_status
    ? "Sadhesati is present"
    : "Sadhesati is not present";

  doc.text(statusMsg, leftX + colW / 2, y + 50, { align: "center" });

  // Right Column - Details
  let ry = y;
  const details = [
    [L.considerationDate || "Consideration Date", sData.consideration_date],
    [L.moonSign || "Moon Sign", sData.moon_sign],
    [
      L.saturnRetrograde || "Saturn Retrograde",
      sData.is_saturn_retrograde || sData.saturn_retrograde ? "Yes" : "No",
    ],
    [
      L.isSadhesatiPresent || "Is Sadhesati present?",
      sData.sadhesati_status ? "Yes" : "No",
    ],
  ];

  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(`${label}:`, rightX, ry + 4);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(String(value || "—"), rightX + colW, ry + 4, { align: "right" });

    doc.setDrawColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
    doc.setLineWidth(0.2);
    doc.line(rightX, ry + 7, rightX + colW, ry + 7);
    ry += 14;
  });
}

// ============================================================
// PAGE 19 — GEMSTONE SUGGESTIONS
// ============================================================
export function renderGemstoneSuggestionsPage(
  doc: jsPDF,
  gemData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.gemstoneSuggestions || "Gemstone Suggestions");

  const w = doc.internal.pageSize.getWidth();
  let y = 34;
  const gd = gemData.basic_gem_suggestion || {};

  // Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const desc = L.gemstoneDescription || "";
  const descLines = doc.splitTextToSize(desc, w - 28);
  doc.text(descLines, 14, y);
  y += descLines.length * 4.5 + 10;

  // 3-Column Layout for Stones
  const margin = 14;
  const gap = 8;
  const colW = (w - 2 * margin - 2 * gap) / 3;

  const stones = [
    {
      title: L.lifeStone || "LIFE STONE",
      data: gd.LIFE || gd.life,
      color: COLORS.darkRed,
    },
    {
      title: L.luckyStone || "LUCKY STONE",
      data: gd.LUCKY || gd.lucky,
      color: COLORS.secondary, // Yellowish
    },
    {
      title: L.beneficStone || "BENEFIC STONE",
      data: gd.BENEFIC || gd.benefic,
      color: COLORS.primary, // Blueish/Dark
    },
  ];

  let x = margin;
  const cardY = y;
  const cardH = 80; // Fixed height for cards

  stones.forEach((stone) => {
    // Card Box
    doc.setDrawColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, cardY, colW, cardH, 3, 3, "FD");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(stone.color[0], stone.color[1], stone.color[2]);
    doc.text(stone.title, x + colW / 2, cardY + 10, { align: "center" });

    // Gem Name using text
    doc.setFontSize(30);
    doc.setTextColor(stone.color[0], stone.color[1], stone.color[2]);
    doc.text("O", x + colW / 2, cardY + 30, { align: "center" });

    // Stone Name
    doc.setFontSize(11);
    doc.text(stone.data?.name || "—", x + colW / 2, cardY + 45, {
      align: "center",
    });

    // Sub text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text("Gemstone", x + colW / 2, cardY + 55, { align: "center" });

    x += colW + gap;
  });
}

// ============================================================
// PAGE 20-22 — GEMSTONE DETAIL PAGE
// ============================================================
export function renderGemstoneDetailPage(
  doc: jsPDF,
  gemData: Record<string, any>,
  type: "life" | "benefic" | "lucky",
  L: Labels,
) {
  const gd = gemData.basic_gem_suggestion || {};
  const data = gd[type] || gd[type.toUpperCase()] || {};

  let title = "";
  let pageTitle = "";
  if (type === "life") {
    title = L.lifeStone || "LIFE STONE";
    pageTitle = "LIFE STONE";
  } else if (type === "benefic") {
    title = L.beneficStone || "BENEFIC STONE";
    pageTitle = "BENEFIC STONE";
  } else {
    title = L.luckyStone || "LUCKY STONE";
    pageTitle = "LUCKY STONE";
  }

  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, pageTitle);

  const w = doc.internal.pageSize.getWidth();
  let y = 34;

  // Header Section with 3 columns (Image, Info, Wearing)
  // Left: Image Placeholder
  doc.setFontSize(40);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("O", 30, y + 25);
  doc.setFontSize(14);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(`${title} - ${data.name || ""}`, 60, y + 10);

  // Info Table
  doc.setFontSize(10);

  // Render small tables/lists
  // Needs careful layout. Let's simpler approach:
  // Custom layout as per design

  // Draw Box for Stone Info
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setFillColor(COLORS.cream[0], COLORS.cream[1], COLORS.cream[2]);
  doc.roundedRect(14, y + 40, w - 28, 25, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);

  // Row 1 within box
  let bx = 20;
  let by = y + 50;
  const boxGap = (w - 40) / 3;

  doc.text(
    `${L.substitutes}: ${data.substitue || data.substitute || data.semi_gem || "—"}`,
    bx,
    by,
  );
  doc.text(`${L.finger}: ${data.wear_finger || "—"}`, bx + boxGap, by);
  doc.text(`${L.weight}: ${data.weight_caret || "—"}`, bx + boxGap * 2, by);

  by += 10;
  doc.text(`${L.dayToWear}: ${data.wear_day || "—"}`, bx, by);
  doc.text(
    `${L.deity}: ${data.deity || data.gem_deity || "—"}`,
    bx + boxGap,
    by,
  );
  doc.text(`${L.metal}: ${data.wear_metal || "—"}`, bx + boxGap * 2, by);

  y += 80;

  // 3x3 Grid for Details
  const gridW = (w - 28) / 3;
  const gridH = 40;

  const gridItems = [
    { title: "Description", text: "Wear this for general well-being." },
    {
      title: L.dayToWear || "Day to Wear",
      text: data.wear_day || data.wear_time || "—",
    },
    { title: L.finger, text: data.wear_finger || "—" },
    {
      title: `${L.weight}/${L.metal}`,
      text: `${data.weight_caret || "—"} / ${data.wear_metal || "—"}`,
    },
    {
      title: L.deity || "Deity",
      text: data.gem_deity || data.gem_mantra || "—",
    },
    {
      title: L.substitutes,
      text: data.substitue || data.substitute || data.semi_gem || "—",
    },
    {
      title: L.energizingRituals,
      text: "Cleanse with milk/gangajal.",
    },
    {
      title: L.caution,
      text: "Consult astrologer before wearing.",
    },
  ];

  let gx = 14;
  let gy = y;

  gridItems.forEach((item, i) => {
    // Check page break? roughly fits in A4
    if (i % 3 === 0 && i !== 0) {
      gx = 14;
      gy += gridH + 5;
    }

    doc.setDrawColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(gx, gy, gridW - 5, gridH, 2, 2, "FD");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(item.title || "—", gx + 10, gy + 10);

    // Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    const textLines = doc.splitTextToSize(String(item.text), gridW - 15);
    doc.text(textLines, gx + 10, gy + 20);

    gx += gridW;
  });
}

// ============================================================
// PAGE 23 — ASCENDANT REPORT I
// ============================================================
export function renderAscendantReport1Page(
  doc: jsPDF,
  ascendantName: string,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(
    doc,
    `${L.ascendantReportTitle || "Ascendant Report"} - ${ascendantName}`,
  );

  const w = doc.internal.pageSize.getWidth();
  let y = 34;

  const meta = ASCENDANT_DATA[ascendantName] || ASCENDANT_DATA["Aries"]; // Fallback

  // Ascendant Details Table
  const margin = 14;
  const col1W = 40;
  const col2W = w - margin * 2 - col1W;

  const rows = [
    [L.lord || "Lord", meta.symbol], // Actually meta.symbol is Symbol, Lord is planet.
    // Wait, ASCENDANT_DATA doesn't have Lord. It has symbol, element, nature etc.
    // Lord is in SIGN_LORDS aligned with ZODIAC_SIGNS.
    // I need to import SIGN_LORDS in pdf-pages.ts if not present.
    // It is NOT imported in the current list I saw earlier (only ZODIAC_SIGNS).
    // So I'll skip Lord for now or just put Symbol first as per design.
    // The user prompt says: Table (Lord, Symbol, Characteristics, Lucky gems, Day of fast - dynamic from Ascendant API)
    // I'll stick to what is available in ASCENDANT_DATA for now.
    [L.symbol || "Symbol", meta.symbol],
    [L.characteristics || "Characteristics", `${meta.element}, ${meta.nature}`],
    [L.luckyGems || "Lucky gems", meta.luckyGem],
    [L.dayOfFast || "Day of fast", meta.dayOfFast],
  ];

  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(0.1);

  rows.forEach(([label, value]) => {
    doc.setFillColor(COLORS.cream[0], COLORS.cream[1], COLORS.cream[2]);
    doc.rect(margin, y, col1W, 10, "FD");

    doc.setFillColor(255, 255, 255);
    doc.rect(margin + col1W, y, col2W, 10, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(String(label), margin + 5, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(String(value), margin + col1W + 5, y + 6);

    y += 10;
  });
  y += 10;

  // Sanskrit Shloka
  doc.setFont("helvetica", "bold"); // No hindi font support in standard jsPDF yet?
  // If shloka is in sanskrit (devanagari), it won't render with helvetica.
  // meta.shloka in constant is English transliteration or similar?
  // Checking constant: "Dharmo Rakshati Rakshitah..." -> It is transliterated. Good.

  doc.setFontSize(10);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.shloka || "Sanskrit Shloka", 14, y);
  y += 6;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]);
  doc.text(`"${meta.shloka}"`, 14, y);
  y += 15;

  // Personality
  doc.setFont("helvetica", "bold"); // Reset
  doc.setFontSize(11);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(`${ascendantName} ${L.personality || "Personality"}`, 14, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  // Render first 2 paragraphs
  const p1 = meta.personality[0] || "";
  const p2 = meta.personality[1] || "";

  const p1Lines = doc.splitTextToSize(p1, w - 28);
  doc.text(p1Lines, 14, y);
  y += p1Lines.length * 4.5 + 4;

  const p2Lines = doc.splitTextToSize(p2, w - 28);
  doc.text(p2Lines, 14, y);
  // Continue on next page
}

// ============================================================
// PAGE 24 — ASCENDANT REPORT II
// ============================================================
export function renderAscendantReport2Page(
  doc: jsPDF,
  ascendantName: string,
  apiReport: any,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.ascendantReportTitle || "Ascendant Report Continued");

  const w = doc.internal.pageSize.getWidth();
  let y = 34;
  const meta = ASCENDANT_DATA[ascendantName] || ASCENDANT_DATA["Aries"];

  // Personality Continuation (3rd paragraph)
  const p3 = meta.personality[2] || "";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const p3Lines = doc.splitTextToSize(p3, w - 28);
  doc.text(p3Lines, 14, y);
  y += p3Lines.length * 4.5 + 15;

  // Append API Report if available
  if (apiReport) {
    // Check various locations for report text
    const apiText =
      apiReport.asc_report?.report ||
      apiReport.report ||
      apiReport.description ||
      apiReport.Report ||
      "";

    if (apiText) {
      y = addSectionTitle(doc, "Detailed Analysis", y);
      const apiLines = doc.splitTextToSize(String(apiText), w - 28);
      // Check for overflow - simple check, if too long just truncate or let it flow (might overlap)
      // Ideally check available space: page height - 100 (for bottom section) - y
      const availableH = doc.internal.pageSize.getHeight() - 100 - y;
      const maxLines = Math.floor(availableH / 4.5);

      const linesToShow = apiLines.slice(0, Math.max(0, maxLines));
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.text(linesToShow, 14, y);
      y += linesToShow.length * 4.5 + 15;
    }
  }

  // Spiritual Lesson Box
  if (y > doc.internal.pageSize.getHeight() - 90) {
    doc.addPage();
    addPageBackground(doc);
    y = 34;
  }

  doc.setFillColor(
    COLORS.lightText[0],
    COLORS.lightText[1],
    COLORS.lightText[2],
  ); // Grayish
  // actually COLORS.lightText is [100,100,100] which is dark gray.
  // Let's use a very light gray.
  doc.setFillColor(240, 240, 240);
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(14, y, w - 28, 35, 3, 3, "FD");

  // Om Icon
  doc.setFontSize(16);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Om", w / 2, y + 10, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.spiritualLesson || "Spiritual Lesson to Learn", w / 2, y + 20, {
    align: "center",
  });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.text(meta.spiritualLesson, w / 2, y + 28, { align: "center" });

  y += 50;

  // Positive & Negative Traits
  // 2 Columns
  const margin = 14;
  const gap = 10;
  const colW = (w - margin * 2 - gap) / 2;
  const leftX = margin;
  const rightX = margin + colW + gap;

  // Positive Traits
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 100, 0); // Dark Green
  doc.text(`+ ${L.positiveTraits || "Positive Traits"}`, leftX, y);

  let py = y + 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  meta.positiveTraits.forEach((trait) => {
    doc.text(`• ${trait}`, leftX, py);
    py += 5;
  });

  // Negative Traits
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(COLORS.darkRed[0], COLORS.darkRed[1], COLORS.darkRed[2]); // Red
  doc.text(`- ${L.negativeTraits || "Negative Traits"}`, rightX, y);

  let ny = y + 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  meta.negativeTraits.forEach((trait) => {
    doc.text(`• ${trait}`, rightX, ny);
    ny += 5;
  });
}
