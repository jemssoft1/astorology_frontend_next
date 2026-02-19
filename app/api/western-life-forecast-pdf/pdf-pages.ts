/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { COLORS, TEXT, ZODIAC_SIGNS, PLANETS } from "./constants";
import { PlanetPosition, HouseCusp, TransitAspect } from "./types";

// ═══════════════════════════════════════════════
//  UI HELPERS
// ═══════════════════════════════════════════════
export function addPageBackground(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  // Simple clean white background, maybe a border
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, "F");

  // Optional: Subtle border
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(0.5);
  doc.rect(5, 5, w - 10, h - 10, "S");
}

export function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  if (pageNum === 1) return; // No footer on cover

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(TEXT.footer, 20, h - 10);
  doc.text(`Page ${pageNum} of ${totalPages}`, w - 20, h - 10, {
    align: "right",
  });
}

// ═══════════════════════════════════════════════
//  PAGE 1: COVER
// ═══════════════════════════════════════════════
export function renderCoverPage(doc: jsPDF, name: string, range: string) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, 0, w, h, "F");

  // Border
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(2);
  doc.rect(10, 10, w - 20, h - 20, "S");

  // Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("LIFE FORECAST", w / 2, h / 3, { align: "center" });
  doc.text("& TRANSITS", w / 2, h / 3 + 15, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(range, w / 2, h / 3 + 30, { align: "center" });

  // Name
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(name, w / 2, h - 60, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.text("Premium Astrology Report", w / 2, h - 40, { align: "center" });
}

// ═══════════════════════════════════════════════
//  PAGE 2: INTRO
// ═══════════════════════════════════════════════
export function renderIntroPage(doc: jsPDF) {
  doc.addPage();
  addPageBackground(doc);
  const w = doc.internal.pageSize.getWidth();

  let y = 30;
  doc.setFontSize(20);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(TEXT.intro.title, 20, y);
  y += 15;

  doc.setFontSize(11);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.setFont("helvetica", "normal");

  TEXT.intro.content.forEach((para) => {
    const lines = doc.splitTextToSize(para, w - 40);
    doc.text(lines, 20, y);
    y += lines.length * 6 + 5;
  });

  y += 10;
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.text(TEXT.intro.quote, w / 2, y, { align: "center" });

  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const transitIntro = doc.splitTextToSize(TEXT.intro.transits, w - 40);
  doc.text(transitIntro, 20, y);
}

// ═══════════════════════════════════════════════
//  PAGE 3: NATAL CHART
// ═══════════════════════════════════════════════
export function renderNatalWheelPage(
  doc: jsPDF,
  wheelImage?: string | Uint8Array,
) {
  doc.addPage();
  addPageBackground(doc);
  const w = doc.internal.pageSize.getWidth();

  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Your Natal Chart", w / 2, 20, { align: "center" });

  if (wheelImage) {
    try {
      doc.addImage(wheelImage, "PNG", 15, 30, 180, 180);
    } catch (e) {
      doc.text("(Chart image could not be rendered)", w / 2, 120, {
        align: "center",
      });
    }
  } else {
    doc.text("(Chart image not available)", w / 2, 120, { align: "center" });
  }

  // Legend
  let y = 220;
  doc.setFontSize(12);
  doc.text("Planetary Symbols", 20, y);
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);

  const symbols = Object.entries(PLANETS)
    .map(([k, v]) => `${k}`)
    .join(", ");
  const lines = doc.splitTextToSize(symbols, w - 40);
  doc.text(lines, 20, y);
}

// ═══════════════════════════════════════════════
//  PAGE 4: POSITIONS
// ═══════════════════════════════════════════════
export function renderPositionsPage(doc: jsPDF, planets: PlanetPosition[]) {
  doc.addPage();
  addPageBackground(doc);

  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Planetary Positions", 20, 20);

  const body = planets.map((p) => [
    p.name,
    p.sign,
    p.degree.toFixed(2) + "°",
    p.house,
    p.isRetro ? "Yes" : "No",
  ]);

  autoTable(doc, {
    startY: 30,
    head: [["Planet", "Sign", "Degree", "House", "Retrograde"]],
    body: body,
    theme: "striped",
    headStyles: { fillColor: COLORS.primary },
    styles: { fontSize: 10 },
  });
}

// ═══════════════════════════════════════════════
//  PAGE 5: CUSPS
// ═══════════════════════════════════════════════
export function renderCuspsPage(doc: jsPDF, cusps: HouseCusp[]) {
  doc.addPage();
  addPageBackground(doc);

  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("House Cusps (Placidus)", 20, 20);

  const body = cusps.map((c) => [
    `House ${c.house}`,
    c.sign,
    c.degree.toFixed(2) + "°",
  ]);

  autoTable(doc, {
    startY: 30,
    head: [["House", "Sign", "Degree"]],
    body: body,
    theme: "grid",
    headStyles: { fillColor: COLORS.secondary },
    styles: { fontSize: 10 },
  });
}

// ═══════════════════════════════════════════════
//  TRANSIT TABLES
// ═══════════════════════════════════════════════
export function renderTransitTables(doc: jsPDF, aspects: TransitAspect[]) {
  // Group by Month? Or just one big table per page?
  // Let's do pages of 20 items.
  const ITEMS_PER_PAGE = 25;

  for (let i = 0; i < aspects.length; i += ITEMS_PER_PAGE) {
    doc.addPage();
    addPageBackground(doc);

    doc.setFontSize(18);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text("Transit Aspects Overview", 20, 20);

    const chunk = aspects.slice(i, i + ITEMS_PER_PAGE);
    const body = chunk.map((a) => [
      a.date,
      `${a.planet} ${a.aspect} ${a.natal_planet}`,
      a.orb + "°",
      a.nature,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Aspect", "Orb", "Nature"]],
      body: body,
      theme: "plain",
      headStyles: { fillColor: COLORS.primary, textColor: 255 },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 80 },
        2: { cellWidth: 20 },
        3: { cellWidth: 30 },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 3) {
          const val = data.cell.raw;
          if (val === "Dynamic" || val === "Opportunity")
            data.cell.styles.textColor = [39, 174, 96]; // Green
          if (val === "Challenging" || val === "Tension")
            data.cell.styles.textColor = [192, 57, 43]; // Red
        }
      },
    });
  }
}

// ═══════════════════════════════════════════════
//  DETAILED INTERPRETATIONS
// ═══════════════════════════════════════════════
export function renderInterpretations(doc: jsPDF, aspects: TransitAspect[]) {
  // Sort by Date
  // aspects.sort((a,b) => ... ) // assuming sorted or already sorted in logic

  let y = 30;

  // Start on new page?
  doc.addPage();
  addPageBackground(doc);

  doc.setFontSize(22);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Detailed Transit Analysis", 20, 30);

  y = 45;

  aspects.forEach((aspect, index) => {
    // Check if we need new page
    if (y > 230) {
      doc.addPage();
      addPageBackground(doc);
      y = 30;
    }

    // Header Color based on nature
    const isHard =
      ["Square", "Opposition", "Challenging", "Tension"].includes(
        aspect.nature,
      ) ||
      aspect.aspect === "Square" ||
      aspect.aspect === "Opposition";
    const headerColor = isHard ? [192, 57, 43] : [39, 174, 96];

    // Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.rect(15, y, 180, 80, "FD"); // Approx height, will adjust if dynamic text handling logic improves

    // Title
    doc.setFontSize(14);
    // @ts-ignore
    doc.setTextColor(...headerColor);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Transiting ${aspect.planet} ${aspect.aspect} Natal ${aspect.natal_planet}`,
      20,
      y + 10,
    );

    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Date: ${aspect.date}  |  Orb: ${aspect.orb}°  |  Nature: ${aspect.nature}`,
      20,
      y + 16,
    );

    // Content
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    let textY = y + 25;
    const interp = aspect.interpretation || {
      psychological: "Significant internal shifts are likely.",
      external:
        "Watch for external triggers relating to these planetary energies.",
      practical: "Stay grounded and observe.",
      growth: "Growth comes from awareness.",
    };

    const sections = [
      { t: "Psychological Impact:", c: interp.psychological },
      { t: "External Impact:", c: interp.external },
      { t: "Practical Advice:", c: interp.practical },
      { t: "Growth Opportunity:", c: interp.growth },
    ];

    sections.forEach((sec) => {
      doc.setFont("helvetica", "bold");
      doc.text(sec.t, 20, textY);
      const wTitle = doc.getTextWidth(sec.t);

      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(sec.c || "", 170 - wTitle - 5);
      doc.text(lines, 25 + wTitle, textY);

      textY += lines.length * 5 + 4;
    });

    // Update Y for next block
    y = y + 80 + 10; // Box height + margin
  });
}

// ═══════════════════════════════════════════════
//  BACK COVER
// ═══════════════════════════════════════════════
export function renderBackCover(doc: jsPDF) {
  doc.addPage();
  addPageBackground(doc);
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, 0, w, h, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(TEXT.closing.title, w / 2, h / 2 - 20, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  const msg = doc.splitTextToSize(TEXT.closing.message, w - 60);
  doc.text(msg, w / 2, h / 2, { align: "center" });

  doc.setFontSize(10);
  doc.text("www.astrologyapi.com", w / 2, h - 20, { align: "center" });
}
