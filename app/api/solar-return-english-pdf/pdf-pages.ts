/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { COLORS, TEXT, PLANETS } from "./constants";
import { PlanetPosition, HouseCusp, Aspect } from "./types";
import { getPlanetHouseInterpretation } from "./helpers";

// ═══════════════════════════════════════════════
//  UI HELPERS
// ═══════════════════════════════════════════════
export function addPageBackground(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setFillColor(
    COLORS.background[0],
    COLORS.background[1],
    COLORS.background[2],
  );
  doc.rect(0, 0, w, h, "F");

  // Border
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.5);
  doc.rect(5, 5, w - 10, h - 10, "S");
}

export function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  if (pageNum === 1) return;
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
export function renderCoverPage(doc: jsPDF, user: any, yearRange: string) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, 0, w, h, "F");

  // Inner Border
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, w - 20, h - 20, "S");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("SOLAR RETURN", w / 2, h / 3, { align: "center" });
  doc.setFontSize(16);
  doc.text(yearRange, w / 2, h / 3 + 15, { align: "center" });

  // User Info
  doc.setFontSize(24);
  doc.text(user.name, w / 2, h - 80, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Born: ${user.date_of_birth} at ${user.time_of_birth}`,
    w / 2,
    h - 65,
    { align: "center" },
  );
  doc.text(user.place_of_birth, w / 2, h - 58, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.text("ASTROLOGY API", w / 2, h - 40, { align: "center" });
}

// ═══════════════════════════════════════════════
//  PAGE 2: INTRO
// ═══════════════════════════════════════════════
export function renderIntroPage(doc: jsPDF) {
  doc.addPage();
  addPageBackground(doc);
  const w = doc.internal.pageSize.getWidth();

  doc.setFontSize(22);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(TEXT.intro.title, 20, 40);

  let y = 60;
  doc.setFontSize(12);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.setFont("helvetica", "normal");

  TEXT.intro.content.forEach((para) => {
    const lines = doc.splitTextToSize(para, w - 40);
    doc.text(lines, 20, y);
    y += lines.length * 7 + 10;
  });

  y += 20;
  doc.setFont("helvetica", "italic");
  doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
  doc.text(TEXT.intro.quote, w / 2, y, { align: "center" });
}

// ═══════════════════════════════════════════════
//  CHART WHEEL PAGES (Natal or SR)
// ═══════════════════════════════════════════════
export function renderWheelPage(
  doc: jsPDF,
  title: string,
  sub: string,
  wheelImage?: Uint8Array,
) {
  doc.addPage();
  addPageBackground(doc);
  const w = doc.internal.pageSize.getWidth();

  doc.setFontSize(24);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(title, w / 2, 30, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(sub, w / 2, 40, { align: "center" });

  if (wheelImage) {
    try {
      doc.addImage(wheelImage, "PNG", 15, 50, 180, 180);
    } catch {
      doc.text("(Chart Image Unavailable)", w / 2, 140, { align: "center" });
    }
  } else {
    // Placeholder Circle
    doc.setDrawColor(200, 200, 200);
    doc.circle(w / 2, 140, 60, "S");
    doc.text("(Chart Visualization)", w / 2, 140, { align: "center" });
  }

  // Legend
  doc.setFontSize(10);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.text("Planets: " + PLANETS.slice(0, 7).join(", "), 20, 250);
  doc.text("         " + PLANETS.slice(7).join(", "), 20, 256);
}

// ═══════════════════════════════════════════════
//  TABLE PAGES (Positions & Cusps)
// ═══════════════════════════════════════════════
export function renderPositionsPage(
  doc: jsPDF,
  title: string,
  planets: PlanetPosition[],
) {
  doc.addPage();
  addPageBackground(doc);

  doc.setFontSize(22);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(title, 20, 30);

  const body = planets.map((p) => [
    p.name,
    p.sign,
    p.degree.toFixed(2) + "°",
    p.house,
    p.isRetro ? "R" : "",
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Planet", "Sign", "Degree", "House", "Retro"]],
    body: body,
    theme: "striped",
    headStyles: { fillColor: COLORS.tables.header },
    alternateRowStyles: { fillColor: COLORS.tables.alternateRow },
  });
}

export function renderCuspsPage(doc: jsPDF, title: string, cusps: HouseCusp[]) {
  doc.addPage();
  addPageBackground(doc);

  doc.setFontSize(22);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(title, 20, 30);

  const body = cusps.map((c) => [
    `House ${c.house}`,
    c.sign,
    c.degree.toFixed(2) + "°",
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["House", "Sign", "Degree"]],
    body: body,
    theme: "grid",
    headStyles: { fillColor: COLORS.secondary },
  });
}

// ═══════════════════════════════════════════════
//  ASPECTS PAGE
// ═══════════════════════════════════════════════
export function renderAspectsTable(doc: jsPDF, aspects: Aspect[]) {
  doc.addPage();
  addPageBackground(doc);

  doc.setFontSize(22);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Solar Return vs Natal Aspects", 20, 30);

  const body = aspects.map((a) => [
    a.planet1,
    a.aspect,
    a.planet2,
    a.orb.toFixed(2) + "°",
    a.nature,
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["SR Planet", "Aspect", "Natal Planet", "Orb", "Nature"]],
    body: body,
    theme: "striped",
    headStyles: { fillColor: COLORS.primary },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 4) {
        const val = data.cell.raw;
        if (val === "Dynamic" || val === "Harmony" || val === "Opportunity")
          data.cell.styles.textColor = [39, 174, 96];
        if (val === "Challenging" || val === "Tension")
          data.cell.styles.textColor = [192, 57, 43];
      }
    },
  });
}

// ═══════════════════════════════════════════════
//  INTERPRETATIONS (Pages 10-28)
// ═══════════════════════════════════════════════
export function renderInterpretations(doc: jsPDF, planets: PlanetPosition[]) {
  let y = 40;

  // Start new page for interpretations
  doc.addPage();
  addPageBackground(doc);
  doc.setFontSize(24);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Solar Return Interpretations", 20, 30);

  planets.forEach((p, i) => {
    // Check space
    if (y > 230) {
      doc.addPage();
      addPageBackground(doc);
      y = 40;
    }

    doc.setFontSize(16);
    doc.setTextColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.setFont("helvetica", "bold");
    doc.text(`${p.name} in House ${p.house} (${p.sign})`, 20, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFont("helvetica", "normal");

    const text = getPlanetHouseInterpretation(p.name, p.house, p.sign);
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, 20, y);

    y += lines.length * 6 + 15;
  });
}

export function renderAspectInterpretations(doc: jsPDF, aspects: Aspect[]) {
  // Filter only major ones to keep page count reasonable if many
  const major = aspects.filter((a) =>
    ["Conjunction", "Square", "Trine", "Opposition"].includes(a.aspect),
  );
  // If too few, take all
  const list = major.length < 5 ? aspects : major;

  let y = 40;
  doc.addPage();
  addPageBackground(doc);
  doc.setFontSize(24);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Major Aspect Interpretations", 20, 30);

  list.forEach((a) => {
    if (!a.interpretation) return;

    if (y > 220) {
      doc.addPage();
      addPageBackground(doc);
      y = 40;
    }

    // Header
    const color =
      a.nature === "Challenging" || a.nature === "Tension"
        ? [192, 57, 43]
        : [39, 174, 96];
    doc.setFontSize(14);
    // @ts-ignore
    doc.setTextColor(...color);
    doc.setFont("helvetica", "bold");
    doc.text(`${a.planet1} ${a.aspect} ${a.planet2}`, 20, y);

    y += 7;
    doc.setFontSize(11);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(a.interpretation, 170);
    doc.text(lines, 20, y);

    y += lines.length * 6 + 15;
  });
}

// ═══════════════════════════════════════════════
//  BACK COVER
// ═══════════════════════════════════════════════
export function renderBackCover(doc: jsPDF) {
  doc.addPage();
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
