// pdf-pages-1.ts — Pages 1–11: Cover, Basic Details, Planets, Charts, Cusps,
// Divisional Charts 1&2, Friendship, KP System

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ZODIAC_SIGNS,
  PLANET_SYMBOLS,
  COLORS,
  DIVISIONAL_CHARTS,
  EXTENDED_DIVISIONAL_CHARTS,
} from "./constants";
import type { Labels } from "./constants";
import {
  addPageBackground,
  addPageHeader,
  addSectionTitle,
  drawCornerDecoration,
  drawNorthIndianChart,
} from "./helpers";

// ──────────────────────── Utilities ────────────────────────

function safeVal(obj: any, ...keys: string[]): string {
  if (!obj) return "N/A";
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null) return String(v);
  }
  return "N/A";
}

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

/** Build planet-position map from chart data: { houseNumber: [planetSymbols] } */
function buildPlanetPositions(chartData: any): Record<number, string[]> {
  const positions: Record<number, string[]> = {};
  if (!chartData) return positions;
  const planets = Array.isArray(chartData)
    ? chartData
    : chartData.planets || chartData;
  if (!Array.isArray(planets)) return positions;
  for (const p of planets) {
    const house = p.house || p.House;
    const name = p.name || p.planet || p.Name;
    if (house && name) {
      const sym = PLANET_SYMBOLS[name] || name.slice(0, 2);
      if (!positions[house]) positions[house] = [];
      positions[house].push(sym);
    }
  }
  return positions;
}

// ═══════════════════════════════════════════════════════════
//  PAGE 1: COVER PAGE
// ═══════════════════════════════════════════════════════════
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

  // Background
  addPageBackground(doc);

  // Premium border
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(3);
  doc.rect(8, 8, w - 16, h - 16);
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(1);
  doc.rect(12, 12, w - 24, h - 24);

  // Corner decorations
  drawCornerDecoration(doc, 14, 14, COLORS.secondary);
  drawCornerDecoration(doc, w - 14, 14, COLORS.secondary, true);
  drawCornerDecoration(doc, 14, h - 14, COLORS.secondary, false, true);
  drawCornerDecoration(doc, w - 14, h - 14, COLORS.secondary, true, true);

  // Om symbol
  doc.setFontSize(42);
  doc.setTextColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setFont("helvetica", "bold");
  doc.text("OM", w / 2, 55, { align: "center" });

  // Decorative line
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(2);
  doc.line(w / 2 - 50, 65, w / 2 + 50, 65);

  // Title
  doc.setFontSize(28);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(L.title, w / 2, 90, { align: "center" });

  // Subtitle
  doc.setFontSize(14);
  doc.setTextColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setFont("helvetica", "normal");
  doc.text(L.coverSubtitle, w / 2, 105, { align: "center" });

  // Decorative diamond
  const midY = 130;
  doc.setFillColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  const dw = 6;
  doc.line(w / 2 - 60, midY, w / 2 - dw, midY);
  doc.line(w / 2 + dw, midY, w / 2 + 60, midY);
  // Diamond shape
  doc.setLineWidth(1.5);
  doc.line(w / 2 - dw, midY, w / 2, midY - dw);
  doc.line(w / 2, midY - dw, w / 2 + dw, midY);
  doc.line(w / 2 + dw, midY, w / 2, midY + dw);
  doc.line(w / 2, midY + dw, w / 2 - dw, midY);

  // Personal details box
  const boxY = 155;
  const boxW = 130;
  const boxX = (w - boxW) / 2;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(1.5);
  doc.roundedRect(boxX, boxY, boxW, 85, 4, 4, "FD");

  // Personal info
  const infoItems = [
    { label: L.name, value: name },
    { label: L.dob, value: dob },
    { label: L.tob, value: tob },
    { label: L.pob, value: pob },
    {
      label: L.generatedOn,
      value: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
    { label: L.language, value: L.langName },
  ];

  let infoY = boxY + 14;
  infoItems.forEach((item) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(`${item.label}:`, boxX + 8, infoY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(item.value || "N/A", boxX + 50, infoY);
    infoY += 12;
  });

  // Bottom decoration
  doc.setFontSize(11);
  doc.setTextColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setFont("helvetica", "italic");
  doc.text(L.generatedBy, w / 2, h - 45, { align: "center" });
  doc.setFontSize(9);
  doc.setTextColor(
    COLORS.lightText[0],
    COLORS.lightText[1],
    COLORS.lightText[2],
  );
  doc.text(L.contactInfo, w / 2, h - 35, { align: "center" });
}

// ═══════════════════════════════════════════════════════════
//  PAGE 2: BASIC ASTROLOGICAL DETAILS
// ═══════════════════════════════════════════════════════════
export function renderBasicDetailsPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.basicDetails);

  const birthDetails = apiData.birth_details;
  const panchang = apiData.panchang;
  const astroDetails = apiData.astro_details;
  const ghatChakra = apiData.ghat_chakra;
  const halfW = doc.internal.pageSize.getWidth() / 2;

  // ── Left Column: Basic Details ──
  let y = addSectionTitleAt(doc, L.basicDetails, 14, 38);
  const basicRows = [
    [L.latitude, safeVal(birthDetails, "latitude", "lat")],
    [L.longitude, safeVal(birthDetails, "longitude", "lon")],
    [L.timezone, safeVal(birthDetails, "timezone", "tzone")],
    [L.ayanamsa, safeVal(birthDetails, "ayanamsa")],
    [L.sunSign, safeVal(birthDetails, "sun_sign")],
    [L.moonSign, safeVal(birthDetails, "moon_sign")],
  ];
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: halfW + 4 },
    head: [],
    body: basicRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 35,
        textColor: COLORS.primary,
      },
    },
    alternateRowStyles: { fillColor: [255, 248, 240] },
  });

  // ── Right Column: Panchang Details ──
  let yR = addSectionTitleAt(doc, L.panchangDetails, halfW + 4, 38);
  const panchangRows = [
    [L.tithi, safeVal(panchang, "tithi")],
    [L.day, safeVal(panchang, "day")],
    [L.nakshatra, safeVal(panchang, "nakshatra")],
    [L.yoga, safeVal(panchang, "yog")],
    [L.karana, safeVal(panchang, "karan")],
    [L.paksha, safeVal(panchang, "paksha")],
  ];
  autoTable(doc, {
    startY: yR,
    margin: { left: halfW + 4, right: 14 },
    head: [],
    body: panchangRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 35,
        textColor: COLORS.primary,
      },
    },
    alternateRowStyles: { fillColor: [255, 248, 240] },
  });

  // ── Astro Details ──
  const yAstro = Math.max((doc as any).lastAutoTable?.finalY ?? 110, 110);
  let yA = addSectionTitleAt(doc, L.astroDetails, 14, yAstro + 10);
  const astroRows = [
    [L.ascendant, safeVal(astroDetails, "ascendant")],
    [L.rashiLord, safeVal(astroDetails, "Varna", "vpifall")],
    [L.nakshatraLord, safeVal(astroDetails, "Yoni", "npifall")],
    [L.sunSign, safeVal(astroDetails, "KasunSign", "sun_sign")],
    [L.moonSign, safeVal(astroDetails, "MoonSign", "moon_sign")],
  ];
  autoTable(doc, {
    startY: yA,
    margin: { left: 14, right: halfW + 4 },
    head: [],
    body: astroRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 40,
        textColor: COLORS.primary,
      },
    },
    alternateRowStyles: { fillColor: [255, 248, 240] },
  });

  // ── Ghat Chakra ──
  const yGhat = addSectionTitleAt(doc, L.ghatChakra, halfW + 4, yAstro + 10);
  if (ghatChakra) {
    const ghatRows = Object.entries(ghatChakra)
      .filter(([k]) => !k.startsWith("_"))
      .slice(0, 8)
      .map(([k, v]) => [k.replace(/_/g, " "), String(v)]);
    autoTable(doc, {
      startY: yGhat,
      margin: { left: halfW + 4, right: 14 },
      head: [],
      body: ghatRows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: 35,
          textColor: COLORS.primary,
        },
      },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
  }
}

// ═══════════════════════════════════════════════════════════
//  PAGE 3: PLANETARY POSITIONS
// ═══════════════════════════════════════════════════════════
export function renderPlanetaryPositionsPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.planetaryPositions);

  const planets = apiData.planets;
  let y = 35;

  // Planet table
  if (planets && Array.isArray(planets)) {
    const headRow = [
      L.planet,
      L.sign,
      L.degrees,
      L.signLord,
      L.nakshatra,
      L.nakshatraLord,
      L.house,
      L.retrograde,
    ];
    const bodyRows = planets.map((p: any) => [
      p.name || p.planet || "N/A",
      ZODIAC_SIGNS[(p.sign || 1) - 1] || p.sign || "N/A",
      p.fullDegree
        ? `${Math.floor(p.fullDegree)}° ${Math.floor((p.fullDegree % 1) * 60)}'`
        : safeVal(p, "normDegree", "local_degree"),
      p.sign_lord || "N/A",
      p.nakshatra || "N/A",
      p.nakshatra_lord || "N/A",
      p.house || "N/A",
      p.isRetro === "true" || p.isRetro === true ? "R" : "",
    ]);

    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [headRow],
      body: bodyRows,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 8,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        textColor: COLORS.text,
      },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y + 80;
  }

  // Planet overview grid
  y = addSectionTitle(doc, L.planetGrid, y + 10);
  const planetsExtended = apiData.planets_extended || apiData.planets;
  if (planetsExtended && Array.isArray(planetsExtended)) {
    const gridW = 50;
    const gridH = 30;
    const cols = 3;
    const startX = 14;
    planetsExtended.slice(0, 9).forEach((p: any, i: number) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const gx = startX + col * (gridW + 8);
      const gy = y + row * (gridH + 5);

      // Card background
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(
        COLORS.chartLine[0],
        COLORS.chartLine[1],
        COLORS.chartLine[2],
      );
      doc.setLineWidth(0.5);
      doc.roundedRect(gx, gy, gridW, gridH, 2, 2, "FD");

      // Planet name
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text(p.name || p.planet || "", gx + 3, gy + 8);

      // Sign and house
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      const signName = ZODIAC_SIGNS[(p.sign || 1) - 1] || p.sign || "";
      doc.text(`${signName} | H${p.house || ""}`, gx + 3, gy + 16);
      const deg = p.fullDegree
        ? `${Math.floor(p.fullDegree)}° ${Math.floor((p.fullDegree % 1) * 60)}'`
        : "";
      doc.text(deg, gx + 3, gy + 23);
      if (p.isRetro === "true" || p.isRetro === true) {
        doc.setTextColor(
          COLORS.darkRed[0],
          COLORS.darkRed[1],
          COLORS.darkRed[2],
        );
        doc.setFontSize(7);
        doc.text("(R)", gx + gridW - 12, gy + 8);
      }
    });
  }
}

// ═══════════════════════════════════════════════════════════
//  PAGE 4: HOROSCOPE CHARTS (Lagna, Moon, Navamsha)
// ═══════════════════════════════════════════════════════════
export function renderHoroscopeChartsPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.horoscopeCharts);

  const w = doc.internal.pageSize.getWidth();
  const chartSize = 80;
  const gap = 8;

  // Row 1: Lagna (D1) + Description box
  const y1 = 38;
  const lagnaData = apiData.horo_chart_D1;
  const lagnaPositions = buildPlanetPositions(lagnaData);
  drawNorthIndianChart(doc, 14, y1, chartSize, lagnaPositions, L.lagnaChart);

  // Lagna description box
  const descX = 14 + chartSize + gap;
  const descW = w - descX - 14;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(
    COLORS.chartLine[0],
    COLORS.chartLine[1],
    COLORS.chartLine[2],
  );
  doc.setLineWidth(0.5);
  doc.roundedRect(descX, y1, descW, chartSize, 3, 3, "FD");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.lagnaChart, descX + 5, y1 + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const descText = L.lagnaDescription || "";
  const lines = doc.splitTextToSize(descText, descW - 10);
  doc.text(lines, descX + 5, y1 + 22);

  // Row 2: Moon + Navamsha
  const y2 = y1 + chartSize + gap + 5;
  const moonData = apiData.horo_chart_MOON;
  const moonPositions = buildPlanetPositions(moonData);
  drawNorthIndianChart(doc, 14, y2, chartSize, moonPositions, L.moonChart);

  const navamshaData = apiData.horo_chart_D9;
  const navamshaPositions = buildPlanetPositions(navamshaData);
  drawNorthIndianChart(
    doc,
    14 + chartSize + gap,
    y2,
    chartSize,
    navamshaPositions,
    L.navamshaChart,
  );
}

// ═══════════════════════════════════════════════════════════
//  PAGE 5: HOUSE CUSPS AND SANDHI
// ═══════════════════════════════════════════════════════════
export function renderHouseCuspsPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.houseCusps);

  const cuspsData = apiData.kp_house_cusps;
  let y = 35;

  if (cuspsData && Array.isArray(cuspsData)) {
    const headRow = [L.house, L.bhavMadhya, L.sign, L.bhavSandhi];
    const bodyRows = cuspsData.map((c: any, i: number) => [
      `${i + 1}`,
      safeVal(c, "house_start_degree", "degree"),
      ZODIAC_SIGNS[(c.sign || 1) - 1] || safeVal(c, "sign"),
      safeVal(c, "house_end_degree", "end_degree"),
    ]);
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 110 },
      head: [headRow],
      body: bodyRows,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 8,
      },
      styles: { fontSize: 7.5, cellPadding: 2, textColor: COLORS.text },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
  }

  // Chalit chart on right
  const chalitData = apiData.horo_chart_chalit;
  const chalitPositions = buildPlanetPositions(chalitData);
  const chartSize = 80;
  const w = doc.internal.pageSize.getWidth();
  drawNorthIndianChart(
    doc,
    w - chartSize - 14,
    45,
    chartSize,
    chalitPositions,
    L.chalitChart,
  );
}

// ═══════════════════════════════════════════════════════════
//  PAGE 6: DIVISIONAL CHARTS GRID 1 (3×3)
// ═══════════════════════════════════════════════════════════
export function renderDivisionalChartsPage1(
  doc: jsPDF,
  apiData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.divisionalCharts);

  const chartSize = 52;
  const gap = 6;
  const startX = 14;
  const startY = 35;

  for (let i = 0; i < DIVISIONAL_CHARTS.length && i < 9; i++) {
    const cfg = DIVISIONAL_CHARTS[i];
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = startX + col * (chartSize + gap);
    const cy = startY + row * (chartSize + gap + 12);

    const chartKey = `horo_chart_${cfg.apiChart}`;
    const chartData = apiData[chartKey];
    const positions = buildPlanetPositions(chartData);

    const title = lang === "hi" ? cfg.titleHi : cfg.title;
    drawNorthIndianChart(doc, cx, cy, chartSize, positions, title);

    // Subtitle
    doc.setFontSize(6);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(
      COLORS.lightText[0],
      COLORS.lightText[1],
      COLORS.lightText[2],
    );
    const subtitle = lang === "hi" ? cfg.subtitleHi : cfg.subtitle;
    doc.text(subtitle, cx + chartSize / 2, cy + chartSize + 6, {
      align: "center",
    });
  }
}

// ═══════════════════════════════════════════════════════════
//  PAGE 7: DIVISIONAL CHARTS GRID 2 (Extended D16–D60)
// ═══════════════════════════════════════════════════════════
export function renderDivisionalChartsPage2(
  doc: jsPDF,
  apiData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.extDivisionalCharts);

  const chartSize = 52;
  const gap = 6;
  const startX = 14;
  const startY = 35;

  for (let i = 0; i < EXTENDED_DIVISIONAL_CHARTS.length && i < 9; i++) {
    const cfg = EXTENDED_DIVISIONAL_CHARTS[i];
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = startX + col * (chartSize + gap);
    const cy = startY + row * (chartSize + gap + 12);

    const chartKey = `horo_chart_${cfg.apiChart}`;
    const chartData = apiData[chartKey];
    const positions = buildPlanetPositions(chartData);

    const title = lang === "hi" ? cfg.titleHi : cfg.title;
    drawNorthIndianChart(doc, cx, cy, chartSize, positions, title);

    doc.setFontSize(6);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(
      COLORS.lightText[0],
      COLORS.lightText[1],
      COLORS.lightText[2],
    );
    const subtitle = lang === "hi" ? cfg.subtitleHi : cfg.subtitle;
    doc.text(subtitle, cx + chartSize / 2, cy + chartSize + 6, {
      align: "center",
    });
  }
}

// ═══════════════════════════════════════════════════════════
//  PAGE 8: COMPOSITE FRIENDSHIP (Permanent + Temporal)
// ═══════════════════════════════════════════════════════════
export function renderCompositeFriendshipPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.compositeFriendship);

  const friendship = apiData.planetary_friendship;
  let y = 35;

  // Permanent Friendship table
  y = addSectionTitle(doc, L.permanentFriendship, y);
  if (friendship?.naisargik_maitri || friendship?.permanent) {
    const data = friendship.naisargik_maitri || friendship.permanent;
    const planets = Object.keys(data).slice(0, 7);
    const headRow = [L.planet, ...planets];
    const bodyRows = planets.map((p) => {
      const row = [p];
      planets.forEach((q) => {
        const val = data[p]?.[q] || data[p]?.[q.toLowerCase()] || "-";
        row.push(String(val));
      });
      return row;
    });
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [headRow],
      body: bodyRows,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 7,
      },
      styles: { fontSize: 6.5, cellPadding: 1.5, textColor: COLORS.text },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y + 60;
  }

  // Temporal Friendship table
  y = addSectionTitle(doc, L.temporalFriendship, y + 10);
  if (friendship?.tatkalik_maitri || friendship?.temporal) {
    const data = friendship.tatkalik_maitri || friendship.temporal;
    const planets = Object.keys(data).slice(0, 7);
    const headRow = [L.planet, ...planets];
    const bodyRows = planets.map((p) => {
      const row = [p];
      planets.forEach((q) => {
        const val = data[p]?.[q] || data[p]?.[q.toLowerCase()] || "-";
        row.push(String(val));
      });
      return row;
    });
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [headRow],
      body: bodyRows,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 7,
      },
      styles: { fontSize: 6.5, cellPadding: 1.5, textColor: COLORS.text },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
  }
}

// ═══════════════════════════════════════════════════════════
//  PAGE 9: FIVE-FOLD FRIENDSHIP
// ═══════════════════════════════════════════════════════════
export function renderFiveFoldFriendshipPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.fiveFoldFriendship);

  const friendship = apiData.planetary_friendship;
  let y = 35;

  if (friendship?.panch_maitri || friendship?.five_fold) {
    const data = friendship.panch_maitri || friendship.five_fold;
    const planets = Object.keys(data).slice(0, 7);
    const headRow = [L.planet, ...planets];
    const bodyRows = planets.map((p) => {
      const row = [p];
      planets.forEach((q) => {
        const val = data[p]?.[q] || data[p]?.[q.toLowerCase()] || "-";
        row.push(String(val));
      });
      return row;
    });
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [headRow],
      body: bodyRows,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 7,
      },
      styles: { fontSize: 6.5, cellPadding: 1.5, textColor: COLORS.text },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y + 80;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text("Five-fold friendship data not available.", 14, y);
  }
}

// ═══════════════════════════════════════════════════════════
//  PAGE 10: KP PLANETARY DETAILS
// ═══════════════════════════════════════════════════════════
export function renderKPPlanetaryPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.kpPlanetaryDetails);

  const kpPlanets = apiData.kp_planets;
  let y = 35;

  if (kpPlanets && Array.isArray(kpPlanets)) {
    // Table 1: Sign, House, Degree
    const headRow1 = [L.planet, L.sign, L.house, L.degrees, L.signLord];
    const bodyRows1 = kpPlanets.map((p: any) => [
      p.name || p.planet || "N/A",
      ZODIAC_SIGNS[(p.sign || 1) - 1] || safeVal(p, "sign"),
      safeVal(p, "house"),
      p.fullDegree
        ? `${Math.floor(p.fullDegree)}° ${Math.floor((p.fullDegree % 1) * 60)}'`
        : safeVal(p, "degree"),
      safeVal(p, "sign_lord"),
    ]);
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [headRow1],
      body: bodyRows1,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 8,
      },
      styles: { fontSize: 7.5, cellPadding: 2, textColor: COLORS.text },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y + 80;

    // Table 2: Nakshatra, Sub Lord, Sub-Sub Lord
    y += 10;
    y = addSectionTitle(doc, `${L.kpPlanetaryDetails} - II`, y);
    const headRow2 = [
      L.planet,
      L.nakshatra,
      L.nakshatraLord,
      L.subLord,
      L.subSubLord,
    ];
    const bodyRows2 = kpPlanets.map((p: any) => [
      p.name || p.planet || "N/A",
      safeVal(p, "nakshatra"),
      safeVal(p, "nakshatra_lord"),
      safeVal(p, "sub_lord"),
      safeVal(p, "sub_sub_lord"),
    ]);
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [headRow2],
      body: bodyRows2,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 8,
      },
      styles: { fontSize: 7.5, cellPadding: 2, textColor: COLORS.text },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
  }
}

// ═══════════════════════════════════════════════════════════
//  PAGE 11: KP HOUSE CUSPS + CHART
// ═══════════════════════════════════════════════════════════
export function renderKPHouseCuspsPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.kpHouseCusps);

  const cusps = apiData.kp_house_cusps;
  let y = 35;

  if (cusps && Array.isArray(cusps)) {
    const headRow = [
      L.house,
      L.sign,
      L.degrees,
      L.signLord,
      L.nakshatraLord,
      L.subLord,
      L.subSubLord,
    ];
    const bodyRows = cusps.map((c: any, i: number) => [
      `${i + 1}`,
      ZODIAC_SIGNS[(c.sign || 1) - 1] || safeVal(c, "sign"),
      safeVal(c, "degree", "house_start_degree"),
      safeVal(c, "sign_lord"),
      safeVal(c, "nakshatra_lord"),
      safeVal(c, "sub_lord"),
      safeVal(c, "sub_sub_lord"),
    ]);
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 100 },
      head: [headRow],
      body: bodyRows,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontSize: 7,
      },
      styles: { fontSize: 6.5, cellPadding: 1.5, textColor: COLORS.text },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
  }

  // KP Birth Chart on the right side
  const kpChart = apiData.kp_birth_chart;
  const kpPositions = buildPlanetPositions(kpChart);
  const chartSize = 80;
  const w = doc.internal.pageSize.getWidth();
  drawNorthIndianChart(
    doc,
    w - chartSize - 14,
    45,
    chartSize,
    kpPositions,
    "KP Chart",
  );
}
