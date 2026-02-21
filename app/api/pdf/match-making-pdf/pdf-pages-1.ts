// pdf-pages-1.ts — Pages 1–6: Cover, Importance, Basic Details, Planets, Charts
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  COLORS,
  Labels,
  IMPORTANCE_TEXT_EN,
  IMPORTANCE_TEXT_HI,
} from "./constants";
import {
  addPageBackground,
  addPageHeader,
  drawNorthIndianChart,
} from "./helpers";

// ═══════════════════════════════════════════════
//  PAGE 1 — COVER PAGE
// ═══════════════════════════════════════════════
export function renderCoverPage(
  doc: jsPDF,
  labels: Labels,
  lang: string,
  maleName: string,
  femaleName: string,
  maleDob: string,
  femaleDob: string,
  maleTob: string,
  femaleTob: string,
  malePlace: string,
  femalePlace: string,
) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background gradient
  doc.setFillColor(20, 15, 40);
  doc.rect(0, 0, w, h, "F");

  // Decorative top accent
  doc.setFillColor(180, 120, 60);
  doc.rect(0, 0, w, 5, "F");
  doc.setFillColor(140, 80, 30);
  doc.rect(0, 5, w, 2, "F");

  // Title area
  doc.setFillColor(30, 20, 50);
  doc.roundedRect(20, 20, w - 40, 50, 5, 5, "F");
  doc.setDrawColor(180, 120, 60);
  doc.setLineWidth(1);
  doc.roundedRect(20, 20, w - 40, 50, 5, 5, "S");

  // ✦ decorative symbol
  doc.setTextColor(180, 120, 60);
  doc.setFontSize(18);
  doc.text("\u2726", w / 2, 34, { align: "center" });

  // Title text
  doc.setTextColor(255, 215, 100);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(labels.coverTitle, w / 2, 48, { align: "center" });

  // Subtitle
  doc.setTextColor(200, 180, 150);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    lang === "hi"
      ? "वैदिक ज्योतिष अनुकूलता विश्लेषण"
      : "Vedic Astrology Compatibility Analysis",
    w / 2,
    60,
    { align: "center" },
  );

  // ── Divider line ──
  doc.setDrawColor(180, 120, 60);
  doc.setLineWidth(0.5);
  doc.line(30, 80, w - 30, 80);

  // Male & Female cards
  const cardW = (w - 60) / 2 - 5;
  const cardX1 = 25;
  const cardX2 = w / 2 + 5;
  const cardY = 90;
  const cardH = 130;

  // Male Card (Left)
  doc.setFillColor(35, 25, 60);
  doc.roundedRect(cardX1, cardY, cardW, cardH, 4, 4, "F");
  doc.setDrawColor(100, 140, 200);
  doc.setLineWidth(0.8);
  doc.roundedRect(cardX1, cardY, cardW, cardH, 4, 4, "S");

  // Male header stripe
  doc.setFillColor(60, 80, 140);
  doc.roundedRect(cardX1, cardY, cardW, 22, 4, 4, "F");
  doc.rect(cardX1, cardY + 10, cardW, 12, "F"); // square off bottom corners
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(labels.male, cardX1 + cardW / 2, cardY + 14, { align: "center" });

  // Male details
  const maleDetailY = cardY + 32;
  doc.setFontSize(9);
  const maleFields = [
    { label: labels.name, value: maleName },
    { label: labels.dob, value: maleDob },
    { label: labels.tob, value: maleTob },
    { label: labels.place, value: malePlace },
  ];

  maleFields.forEach((f, i) => {
    const yPos = maleDetailY + i * 22;
    doc.setTextColor(150, 160, 200);
    doc.setFont("helvetica", "normal");
    doc.text(f.label, cardX1 + 10, yPos);
    doc.setTextColor(220, 220, 240);
    doc.setFont("helvetica", "bold");
    const val = String(f.value || "N/A");
    doc.text(
      val.length > 22 ? val.substring(0, 22) + "..." : val,
      cardX1 + 10,
      yPos + 9,
    );
  });

  // Female Card (Right)
  doc.setFillColor(35, 25, 60);
  doc.roundedRect(cardX2, cardY, cardW, cardH, 4, 4, "F");
  doc.setDrawColor(200, 100, 130);
  doc.setLineWidth(0.8);
  doc.roundedRect(cardX2, cardY, cardW, cardH, 4, 4, "S");

  // Female header stripe
  doc.setFillColor(140, 50, 80);
  doc.roundedRect(cardX2, cardY, cardW, 22, 4, 4, "F");
  doc.rect(cardX2, cardY + 10, cardW, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(labels.female, cardX2 + cardW / 2, cardY + 14, { align: "center" });

  // Female details
  const femaleDetailY = cardY + 32;
  const femaleFields = [
    { label: labels.name, value: femaleName },
    { label: labels.dob, value: femaleDob },
    { label: labels.tob, value: femaleTob },
    { label: labels.place, value: femalePlace },
  ];

  femaleFields.forEach((f, i) => {
    const yPos = femaleDetailY + i * 22;
    doc.setTextColor(200, 140, 160);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(f.label, cardX2 + 10, yPos);
    doc.setTextColor(240, 220, 230);
    doc.setFont("helvetica", "bold");
    const val = String(f.value || "N/A");
    doc.text(
      val.length > 22 ? val.substring(0, 22) + "..." : val,
      cardX2 + 10,
      yPos + 9,
    );
  });

  // Center connector — decorative heart/link symbol
  doc.setFillColor(20, 15, 40);
  doc.circle(w / 2, cardY + cardH / 2, 12, "F");
  doc.setDrawColor(180, 120, 60);
  doc.setLineWidth(1.2);
  doc.circle(w / 2, cardY + cardH / 2, 12, "S");
  doc.setTextColor(255, 215, 100);
  doc.setFontSize(14);
  doc.text("\u2764", w / 2, cardY + cardH / 2 + 4, { align: "center" });

  // Generated date
  const dateStr = new Date().toLocaleDateString(
    lang === "hi" ? "hi-IN" : "en-IN",
    { year: "numeric", month: "long", day: "numeric" },
  );
  doc.setTextColor(150, 140, 130);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${labels.generatedOn}: ${dateStr}`, w / 2, h - 30, {
    align: "center",
  });

  // Bottom accent
  doc.setFillColor(140, 80, 30);
  doc.rect(0, h - 7, w, 2, "F");
  doc.setFillColor(180, 120, 60);
  doc.rect(0, h - 5, w, 5, "F");
}

// ═══════════════════════════════════════════════
//  PAGE 2 — IMPORTANCE OF MATCH MAKING
// ═══════════════════════════════════════════════
export function renderImportancePage(doc: jsPDF, labels: Labels, lang: string) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, labels.importanceTitle);

  const w = doc.internal.pageSize.getWidth();
  const text = lang === "hi" ? IMPORTANCE_TEXT_HI : IMPORTANCE_TEXT_EN;
  const paragraphs = text.split("\n\n").filter((p) => p.trim());

  let y = 40;

  // Opening decorative quote indicator
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.roundedRect(14, y - 4, 3, paragraphs.length > 0 ? 16 : 8, 1, 1, "F");

  // Highlighted first paragraph in bold
  if (paragraphs.length > 0) {
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const firstLines = doc.splitTextToSize(paragraphs[0], w - 44);
    doc.text(firstLines, 22, y);
    y += firstLines.length * 5 + 8;
  }

  // Remaining paragraphs
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  for (let i = 1; i < paragraphs.length; i++) {
    const lines = doc.splitTextToSize(paragraphs[i], w - 36);
    if (y + lines.length * 4.5 > 270) break;
    doc.text(lines, 20, y);
    y += lines.length * 4.5 + 6;
  }

  // Decorative bottom box
  doc.setFillColor(245, 240, 230);
  doc.roundedRect(20, y + 5, w - 40, 30, 3, 3, "F");
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(0.5);
  doc.roundedRect(20, y + 5, w - 40, 30, 3, 3, "S");

  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  const noteText =
    lang === "hi"
      ? "कुंडली मिलान दांपत्य जीवन की सफलता सुनिश्चित करने का एक प्राचीन और वैज्ञानिक तरीका है।"
      : "Kundli matching is an ancient and scientific method to ensure the success of married life.";
  const noteLines = doc.splitTextToSize(noteText, w - 56);
  doc.text(noteLines, w / 2, y + 18, { align: "center" });
}

// ═══════════════════════════════════════════════
//  PAGE 3 — BASIC DETAILS (3-column: Male | Attr | Female)
// ═══════════════════════════════════════════════
export function renderBasicDetailsPage(
  doc: jsPDF,
  labels: Labels,
  lang: string,
  maleData: Record<string, any>,
  femaleData: Record<string, any>,
  matchBirthDetails: any,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, labels.basicDetails);

  const w = doc.internal.pageSize.getWidth();

  // Extract data
  const mBirth = maleData.birth_details || {};
  const fBirth = femaleData.birth_details || {};
  const mAstro = maleData.astro_details || {};
  const fAstro = femaleData.astro_details || {};

  // Birth details table
  const birthRows = [
    [
      String(mBirth.dob || "N/A"),
      labels.dateOfBirth,
      String(fBirth.dob || "N/A"),
    ],
    [
      String(mBirth.tob || "N/A"),
      labels.timeOfBirth,
      String(fBirth.tob || "N/A"),
    ],
    [String(mBirth.lat || "N/A"), labels.latitude, String(fBirth.lat || "N/A")],
    [
      String(mBirth.lon || "N/A"),
      labels.longitude,
      String(fBirth.lon || "N/A"),
    ],
    [
      String(mBirth.tzone || "N/A"),
      labels.timezone,
      String(fBirth.tzone || "N/A"),
    ],
    [
      String(mBirth.sunrise || "N/A"),
      labels.sunrise,
      String(fBirth.sunrise || "N/A"),
    ],
    [
      String(mBirth.sunset || "N/A"),
      labels.sunset,
      String(fBirth.sunset || "N/A"),
    ],
    [
      String(mBirth.ayanamsha || "N/A"),
      labels.ayanamsha,
      String(fBirth.ayanamsha || "N/A"),
    ],
  ];

  autoTable(doc, {
    startY: 34,
    head: [[labels.male, labels.attributes, labels.female]],
    body: birthRows,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      halign: "center",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: (w - 28) * 0.35, fillColor: [240, 248, 255] },
      1: {
        cellWidth: (w - 28) * 0.3,
        fontStyle: "bold",
        fillColor: [255, 250, 240],
      },
      2: { cellWidth: (w - 28) * 0.35, fillColor: [255, 240, 245] },
    },
    margin: { left: 14, right: 14 },
  });

  // Section break title — Astrological Details
  let afterBirthY = (doc as any).lastAutoTable?.finalY || 110;
  afterBirthY += 6;

  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.roundedRect(14, afterBirthY, w - 28, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(labels.astrologicalDetails, w / 2, afterBirthY + 7, {
    align: "center",
  });

  // Astrological details table
  const safe = (obj: any, key: string) => String(obj?.[key] ?? "N/A");
  const astroRows = [
    [safe(mAstro, "Varna"), labels.varna, safe(fAstro, "Varna")],
    [safe(mAstro, "Vashya"), labels.vashya, safe(fAstro, "Vashya")],
    [safe(mAstro, "Yoni"), labels.yoni, safe(fAstro, "Yoni")],
    [safe(mAstro, "Gan"), labels.gan, safe(fAstro, "Gan")],
    [safe(mAstro, "Nadi"), labels.nadi, safe(fAstro, "Nadi")],
    [safe(mAstro, "SignLord"), labels.signLord, safe(fAstro, "SignLord")],
    [safe(mAstro, "Nakshatra"), labels.nakshatra, safe(fAstro, "Nakshatra")],
    [
      safe(mAstro, "NakshatraLord"),
      labels.nakshatraLord,
      safe(fAstro, "NakshatraLord"),
    ],
    [safe(mAstro, "Charan"), labels.charan, safe(fAstro, "Charan")],
    [safe(mAstro, "Yog"), labels.yog, safe(fAstro, "Yog")],
    [safe(mAstro, "Karan"), labels.karan, safe(fAstro, "Karan")],
    [safe(mAstro, "Tithi"), labels.tithi, safe(fAstro, "Tithi")],
    [safe(mAstro, "Yunja"), labels.yunja, safe(fAstro, "Yunja")],
    [
      safe(mAstro, "Tatpiyadhipati"),
      labels.tatva,
      safe(fAstro, "Tatpiyadhipati"),
    ],
    [
      safe(mAstro, "name_alphabet"),
      labels.pooNameAlphabet,
      safe(fAstro, "name_alphabet"),
    ],
    [safe(mAstro, "Paya"), labels.paya, safe(fAstro, "Paya")],
  ];

  autoTable(doc, {
    startY: afterBirthY + 14,
    head: [[labels.male, labels.attributes, labels.female]],
    body: astroRows,
    theme: "grid",
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      halign: "center",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: (w - 28) * 0.35, fillColor: [240, 248, 255] },
      1: {
        cellWidth: (w - 28) * 0.3,
        fontStyle: "bold",
        fillColor: [255, 250, 240],
      },
      2: { cellWidth: (w - 28) * 0.35, fillColor: [255, 240, 245] },
    },
    margin: { left: 14, right: 14 },
  });
}

// ═══════════════════════════════════════════════
//  PAGE 4 — PLANETARY POSITIONS
// ═══════════════════════════════════════════════
export function renderPlanetaryPositionsPage(
  doc: jsPDF,
  labels: Labels,
  maleName: string,
  femaleName: string,
  maleData: Record<string, any>,
  femaleData: Record<string, any>,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, labels.planetaryPositions);

  const w = doc.internal.pageSize.getWidth();
  const planets = maleData.planets || femaleData.planets;
  const planetKeys = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
    "Rahu",
    "Ketu",
    "Ascendant",
  ];

  // Helper to extract planet rows
  const extractRows = (data: Record<string, any>) => {
    const planetsData = data.planets || [];
    const extData = data.planets_extended || [];
    return planetKeys.map((p) => {
      const pd =
        (Array.isArray(planetsData) ? planetsData : []).find(
          (x: any) =>
            String(x.name || x.planet_name || "").toLowerCase() ===
            p.toLowerCase(),
        ) || {};
      const ext =
        (Array.isArray(extData) ? extData : []).find(
          (x: any) =>
            String(x.name || x.planet_name || "").toLowerCase() ===
            p.toLowerCase(),
        ) || {};
      return [
        p,
        pd.isRetro === "true" || pd.is_retro === "true" ? "R" : "",
        String(pd.sign || pd.zodiac || "N/A"),
        typeof pd.fullDegree === "number"
          ? pd.fullDegree.toFixed(2)
          : String(pd.full_degree || pd.normDegree || "N/A"),
        String(pd.signLord || ext.sign_lord || "N/A"),
        String(pd.nakshatra || ext.nakshatra || "N/A"),
        String(pd.nakshatraLord || ext.nakshatra_lord || "N/A"),
        String(pd.house || ext.house || "N/A"),
      ];
    });
  };

  // Male table
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`${maleName} - ${labels.planetaryPositions}`, 14, 36);

  const maleRows = extractRows(maleData);
  autoTable(doc, {
    startY: 40,
    head: [
      [
        labels.planet,
        labels.retrograde,
        labels.sign,
        labels.degrees,
        labels.signLord,
        labels.nakshatra,
        labels.nakshatraLord,
        labels.house,
      ],
    ],
    body: maleRows,
    theme: "grid",
    styles: { fontSize: 7, cellPadding: 2, halign: "center" },
    headStyles: {
      fillColor: [60, 80, 140],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
    },
    alternateRowStyles: { fillColor: [240, 248, 255] },
    margin: { left: 14, right: 14 },
  });

  // Female table
  let afterMaleY = (doc as any).lastAutoTable?.finalY || 140;
  afterMaleY += 10;

  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`${femaleName} - ${labels.planetaryPositions}`, 14, afterMaleY);

  const femaleRows = extractRows(femaleData);
  autoTable(doc, {
    startY: afterMaleY + 4,
    head: [
      [
        labels.planet,
        labels.retrograde,
        labels.sign,
        labels.degrees,
        labels.signLord,
        labels.nakshatra,
        labels.nakshatraLord,
        labels.house,
      ],
    ],
    body: femaleRows,
    theme: "grid",
    styles: { fontSize: 7, cellPadding: 2, halign: "center" },
    headStyles: {
      fillColor: [140, 50, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
    },
    alternateRowStyles: { fillColor: [255, 240, 245] },
    margin: { left: 14, right: 14 },
  });
}

// ═══════════════════════════════════════════════
//  PAGES 5–6 — HOROSCOPE CHARTS (2 pages)
// ═══════════════════════════════════════════════
export function renderChartPages(
  doc: jsPDF,
  labels: Labels,
  maleName: string,
  femaleName: string,
  maleData: Record<string, any>,
  femaleData: Record<string, any>,
) {
  const w = doc.internal.pageSize.getWidth();
  const chartSize = 75;
  const gap = 10;

  // Helper to build planet positions for chart
  const buildPositions = (chartData: any): Record<number, string[]> => {
    const positions: Record<number, string[]> = {};
    if (!chartData) return positions;
    const entries = Array.isArray(chartData)
      ? chartData
      : typeof chartData === "object"
        ? Object.values(chartData)
        : [];
    for (const entry of entries) {
      if (!entry || typeof entry !== "object") continue;
      const house = parseInt(String(entry.house || entry.sign || 0));
      const name = String(
        entry.planet || entry.name || entry.planet_name || "",
      );
      if (house > 0 && name) {
        if (!positions[house]) positions[house] = [];
        const sym = name.substring(0, 2);
        positions[house].push(sym);
      }
    }
    return positions;
  };

  const getLagna = (chartData: any): number => {
    if (!chartData) return 1;
    const entries = Array.isArray(chartData)
      ? chartData
      : typeof chartData === "object"
        ? Object.values(chartData)
        : [];
    for (const e of entries) {
      if (
        e &&
        (String(e.planet || e.name || "").toLowerCase() === "ascendant" ||
          String(e.planet || e.name || "").toLowerCase() === "asc")
      ) {
        return parseInt(String(e.house || e.sign || 1)) || 1;
      }
    }
    return 1;
  };

  // PAGE 5 — Lagna + Chalit
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, `${labels.lagnaChart} & ${labels.chalitChart}`);

  let y = 38;

  // Lagna charts
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${maleName} - ${labels.lagnaChart}`, 14 + chartSize / 2, y, {
    align: "center",
  });
  doc.text(
    `${femaleName} - ${labels.lagnaChart}`,
    14 + chartSize + gap + chartSize / 2,
    y,
    { align: "center" },
  );
  y += 4;

  const mLagna = maleData.horo_chart_D1;
  const fLagna = femaleData.horo_chart_D1;
  drawNorthIndianChart(doc, 14, y, chartSize, buildPositions(mLagna), "D1");
  drawNorthIndianChart(
    doc,
    14 + chartSize + gap,
    y,
    chartSize,
    buildPositions(fLagna),
    "D1",
  );

  y += chartSize + 18;

  // Chalit charts
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${maleName} - ${labels.chalitChart}`, 14 + chartSize / 2, y, {
    align: "center",
  });
  doc.text(
    `${femaleName} - ${labels.chalitChart}`,
    14 + chartSize + gap + chartSize / 2,
    y,
    { align: "center" },
  );
  y += 4;

  const mChalit = maleData.horo_chart_chalit;
  const fChalit = femaleData.horo_chart_chalit;
  drawNorthIndianChart(
    doc,
    14,
    y,
    chartSize,
    buildPositions(mChalit),
    "Chalit",
  );
  drawNorthIndianChart(
    doc,
    14 + chartSize + gap,
    y,
    chartSize,
    buildPositions(fChalit),
    "Chalit",
  );

  // PAGE 6 — Moon + Navamsha
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, `${labels.moonChart} & ${labels.navamshaChart}`);

  y = 38;

  // Moon charts
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${maleName} - ${labels.moonChart}`, 14 + chartSize / 2, y, {
    align: "center",
  });
  doc.text(
    `${femaleName} - ${labels.moonChart}`,
    14 + chartSize + gap + chartSize / 2,
    y,
    { align: "center" },
  );
  y += 4;

  const mMoon = maleData.horo_chart_MOON;
  const fMoon = femaleData.horo_chart_MOON;
  drawNorthIndianChart(doc, 14, y, chartSize, buildPositions(mMoon), "Moon");
  drawNorthIndianChart(
    doc,
    14 + chartSize + gap,
    y,
    chartSize,
    buildPositions(fMoon),
    "Moon",
  );

  y += chartSize + 18;

  // Navamsha charts
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${maleName} - ${labels.navamshaChart}`, 14 + chartSize / 2, y, {
    align: "center",
  });
  doc.text(
    `${femaleName} - ${labels.navamshaChart}`,
    14 + chartSize + gap + chartSize / 2,
    y,
    { align: "center" },
  );
  y += 4;

  const mNav = maleData.horo_chart_D9;
  const fNav = femaleData.horo_chart_D9;
  drawNorthIndianChart(doc, 14, y, chartSize, buildPositions(mNav), "D9");
  drawNorthIndianChart(
    doc,
    14 + chartSize + gap,
    y,
    chartSize,
    buildPositions(fNav),
    "D9",
  );
}
