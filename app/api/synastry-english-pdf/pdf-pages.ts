/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { COLORS, TEXT } from "./constants";
import {
  PlanetPosition,
  HouseCusp,
  SynastryAspect,
  SynastryHouseOverlay,
} from "./types";

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

  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
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
export function renderCoverPage(doc: jsPDF, p1: any, p2: any) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, 0, w, h, "F");

  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, w - 20, h - 20, "S");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("SYNASTRY REPORT", w / 2, h / 3, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Your Astrological Compatibility", w / 2, h / 3 + 12, {
    align: "center",
  });

  // People
  const yStart = h / 2;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(p1.name, w / 2, yStart, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`${p1.date_of_birth} • ${p1.place_of_birth}`, w / 2, yStart + 7, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.text("&", w / 2, yStart + 20, { align: "center" });

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(p2.name, w / 2, yStart + 35, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`${p2.date_of_birth} • ${p2.place_of_birth}`, w / 2, yStart + 42, {
    align: "center",
  });
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
}

// ═══════════════════════════════════════════════
//  NATAL DATA PAGES (3-6)
// ═══════════════════════════════════════════════
export function renderNatalPages(
  doc: jsPDF,
  name: string,
  planets: PlanetPosition[],
  cusps: HouseCusp[],
) {
  // Page: Positions
  doc.addPage();
  addPageBackground(doc);
  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(`${name} - Planetary Positions`, 20, 30);

  const bodyP = planets.map((p) => [
    p.name,
    formatDegree(p.degree), // Logic to convert degree to DMS? Or simple degree?
    p.house,
    p.isRetro ? "R" : "",
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Planet", "Position", "House", "Retro"]],
    body: bodyP,
    theme: "striped",
    headStyles: { fillColor: COLORS.tables.header },
  });

  // Page: Cusps
  doc.addPage();
  addPageBackground(doc);
  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(`${name} - House Cusps`, 20, 30);

  const bodyC = cusps.map((c) => [`House ${c.house}`, formatDegree(c.degree)]);

  autoTable(doc, {
    startY: 40,
    head: [["House", "Cusp Position"]],
    body: bodyC,
    theme: "grid",
    headStyles: { fillColor: COLORS.secondary },
  });

  // Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(TEXT.houseSystemDisclaimer, 20, 200); // Approximate Y
}

function formatDegree(d: number): string {
  // 03° Aries 23'52"
  const signIndex = Math.floor(d / 30);
  const signs = [
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
  const signName = signs[signIndex] || "";
  const relativeDeg = d % 30;

  const deg = Math.floor(relativeDeg);
  const minFull = (relativeDeg - deg) * 60;
  const min = Math.floor(minFull);
  const sec = Math.floor((minFull - min) * 60);

  return `${deg.toString().padStart(2, "0")}° ${signName} ${min.toString().padStart(2, "0")}'${sec.toString().padStart(2, "0")}"`;
}

// ═══════════════════════════════════════════════
//  PAGE 7: BI-WHEEL
// ═══════════════════════════════════════════════
export function renderBiWheelPage(doc: jsPDF) {
  doc.addPage();
  addPageBackground(doc);
  const w = doc.internal.pageSize.getWidth();

  doc.setFontSize(22);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Synastry Bi-Wheel Chart", w / 2, 30, { align: "center" });

  // Placeholder Circle
  doc.setDrawColor(200, 200, 200);
  doc.circle(w / 2, 120, 70, "S");
  doc.circle(w / 2, 120, 50, "S");
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Inner: Person 1 / Outer: Person 2", w / 2, 120, {
    align: "center",
  });

  // Legend
  doc.text("Legends: Sun, Moon, Aries, Taurus...", 20, 250);
}

// ═══════════════════════════════════════════════
//  PAGE 8: HOUSE OVERLAYS
// ═══════════════════════════════════════════════
export function renderHouseOverlaysPage(
  doc: jsPDF,
  overlays: SynastryHouseOverlay[],
  p1Name: string,
  p2Name: string,
) {
  doc.addPage();
  addPageBackground(doc);
  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(`${p1Name}'s Planets in ${p2Name}'s Houses`, 20, 30);

  const body = overlays.map((o) => [o.planet, `House ${o.houseInP2}`]);

  autoTable(doc, {
    startY: 40,
    head: [["Planet", "Synastry House"]],
    body: body,
    theme: "striped",
    headStyles: { fillColor: COLORS.tables.header },
  });
}

// ═══════════════════════════════════════════════
//  PAGES 9-11: ASPECTS TABLE
// ═══════════════════════════════════════════════
export function renderAspectsTablePage(doc: jsPDF, aspects: SynastryAspect[]) {
  doc.addPage();
  addPageBackground(doc);
  doc.setFontSize(18);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Synastry Aspects Log", 20, 30);

  const body = aspects.map((a) => [
    a.planet1,
    a.aspect,
    a.planet2,
    a.orb.toFixed(2) + "°",
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Planet (P1)", "Aspect", "Planet (P2)", "Orb"]],
    body: body,
    theme: "grid",
    headStyles: { fillColor: COLORS.secondary },
  });
}

// ═══════════════════════════════════════════════
//  PAGES 12-21: HOUSE REPORT
// ═══════════════════════════════════════════════
export function renderHouseReport(
  doc: jsPDF,
  overlays: SynastryHouseOverlay[],
  p1Name: string,
  p2Name: string,
) {
  let y = 40;
  doc.addPage();
  addPageBackground(doc);
  doc.setFontSize(24);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Synastry House Comparison", 20, 30);

  overlays.forEach((o) => {
    if (y > 220) {
      doc.addPage();
      addPageBackground(doc);
      y = 40;
    }

    doc.setFontSize(14);
    doc.setTextColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.setFont("helvetica", "bold");
    doc.text(
      `${p1Name}'s ${o.planet} in ${p2Name}'s ${o.houseInP2} House`,
      20,
      y,
    );

    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(o.interpretation, 170);
    doc.text(lines, 20, y);

    y += lines.length * 6 + 15;
  });
}

// ═══════════════════════════════════════════════
//  PAGES 22-37: ASPECT REPORT
// ═══════════════════════════════════════════════
export function renderAspectReport(doc: jsPDF, aspects: SynastryAspect[]) {
  let y = 40;
  doc.addPage();
  addPageBackground(doc);
  doc.setFontSize(24);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text("Detailed Aspect Analysis", 20, 30);

  aspects.forEach((a) => {
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

    // Metadata: Nature, Orb
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Nature: ${a.nature}  |  Orb: ${a.orb.toFixed(2)}`, 20, y + 6);

    y += 15;
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
}
