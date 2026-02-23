// pdf-pages-2.ts — Pages 12–27: Ashtakvarga, Vimshottari, Yogini, Char Dasha

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ZODIAC_SIGNS,
  COLORS,
  ASHTAKVARGA_SIGNIFICANCE,
  DASHA_ORDER_PAGE7,
  YOGINI_DASHAS,
  CHAR_DASHA_SIGNS,
} from "./constants";
import type { Labels } from "./constants";
import { addPageBackground, addPageHeader, addSectionTitle } from "./helpers";

// ──────────────────── Utilities ────────────────────

function safeVal(obj: any, ...keys: string[]): string {
  if (!obj) return "N/A";
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null) return String(v);
  }
  return "N/A";
}

// ═══════════════════════════════════════════════════════════
//  PAGES 12–19: BHINNASHTAK VARGA (8 planets)
// ═══════════════════════════════════════════════════════════
export function renderAshtakvargaPages(
  doc: jsPDF,
  ashtakvargaData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  const planetKeys = [
    "sun",
    "moon",
    "mars",
    "mercury",
    "jupiter",
    "venus",
    "saturn",
  ];
  const planetNames = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
    "Ascendant",
  ];

  // Render 7 planet pages + 1 Ascendant (from sarvashtak for Asc)
  planetKeys.forEach((pKey, idx) => {
    doc.addPage();
    addPageBackground(doc);
    const planetName = planetNames[idx];
    addPageHeader(doc, `${L.bhinnashtakVarga} — ${planetName}`);

    const planetData = ashtakvargaData?.planet_ashtak?.[pKey];
    let y = 35;

    // Ashtakvarga table (12 houses × 8 contributing planets)
    if (planetData) {
      const ashtakVargaTable =
        planetData.apiData || planetData.ashtak_varga || planetData;
      if (ashtakVargaTable && typeof ashtakVargaTable === "object") {
        // Build a summary table: House vs Benefic Points
        const headRow = [L.house, L.sign, L.total];
        const bodyRows: string[][] = [];
        const totals: number[] = [];

        for (let house = 1; house <= 12; house++) {
          const signName = ZODIAC_SIGNS[house - 1] || "";
          const points =
            ashtakVargaTable[house] ??
            ashtakVargaTable[`${house}`] ??
            ashtakVargaTable[signName] ??
            "N/A";
          const pointVal =
            typeof points === "number"
              ? points
              : parseInt(String(points), 10) || 0;
          totals.push(pointVal);
          bodyRows.push([`${house}`, signName, String(points)]);
        }

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
          didParseCell: (data) => {
            // Color code: Good (green), Bad (red), Mixed (orange)
            if (data.section === "body" && data.column.index === 2) {
              const val = parseInt(data.cell.raw as string, 10);
              if (!isNaN(val)) {
                if (val >= 5) data.cell.styles.textColor = [0, 128, 0];
                else if (val <= 2) data.cell.styles.textColor = [200, 0, 0];
                else data.cell.styles.textColor = [200, 140, 0];
              }
            }
          },
        });
      }
    }

    // Significance text on the right
    const sigText =
      lang === "hi"
        ? ASHTAKVARGA_SIGNIFICANCE[planetName]?.hi
        : ASHTAKVARGA_SIGNIFICANCE[planetName]?.en;
    if (sigText) {
      const sigX = 110;
      const sigW = doc.internal.pageSize.getWidth() - sigX - 14;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text(L.significance, sigX, 40);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      const sigLines = doc.splitTextToSize(sigText, sigW);
      doc.text(sigLines, sigX, 50);
    }

    // Legend
    const legendY = 220;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(L.legends, 14, legendY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setFillColor(0, 128, 0);
    doc.circle(18, legendY + 8, 2, "F");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(L.good, 24, legendY + 10);

    doc.setFillColor(200, 140, 0);
    doc.circle(80, legendY + 8, 2, "F");
    doc.text(L.mixed, 86, legendY + 10);

    doc.setFillColor(200, 0, 0);
    doc.circle(140, legendY + 8, 2, "F");
    doc.text(L.bad, 146, legendY + 10);
  });
}

// ═══════════════════════════════════════════════════════════
//  PAGE 20: SARVASHTAK VARGA
// ═══════════════════════════════════════════════════════════
export function renderSarvashtakPage(
  doc: jsPDF,
  ashtakvargaData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.sarvashtakVarga);

  const sarvashtakData = ashtakvargaData?.sarvashtak;
  let y = 35;

  if (sarvashtakData) {
    // Build summary table with all planets + total
    const planets = [
      "Sun",
      "Moon",
      "Mars",
      "Mercury",
      "Jupiter",
      "Venus",
      "Saturn",
    ];
    const headRow = [L.house, ...planets, L.total];
    const bodyRows: string[][] = [];

    for (let house = 1; house <= 12; house++) {
      const row = [`${house}`];
      let rowTotal = 0;
      planets.forEach((p) => {
        const key = p.toLowerCase();
        const val =
          sarvashtakData?.[key]?.[house] ??
          sarvashtakData?.[key]?.[`${house}`] ??
          sarvashtakData?.[p]?.[house] ??
          "–";
        const numVal =
          typeof val === "number" ? val : parseInt(String(val), 10) || 0;
        rowTotal += numVal;
        row.push(String(val));
      });
      row.push(String(rowTotal || "–"));
      bodyRows.push(row);
    }

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
      styles: { fontSize: 7, cellPadding: 1.5, textColor: COLORS.text },
      alternateRowStyles: { fillColor: [255, 248, 240] },
      didParseCell: (data) => {
        if (
          data.section === "body" &&
          data.column.index === headRow.length - 1
        ) {
          const val = parseInt(data.cell.raw as string, 10);
          if (!isNaN(val)) {
            if (val >= 28) data.cell.styles.textColor = [0, 128, 0];
            else if (val < 25) data.cell.styles.textColor = [200, 0, 0];
            else data.cell.styles.textColor = [200, 140, 0];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y + 100;
  }

  // Legend
  y += 10;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.legends, 14, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setFillColor(0, 128, 0);
  doc.circle(18, y + 8, 2, "F");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.text(L.good, 24, y + 10);
  doc.setFillColor(200, 140, 0);
  doc.circle(80, y + 8, 2, "F");
  doc.text(L.mixed, 86, y + 10);
  doc.setFillColor(200, 0, 0);
  doc.circle(140, y + 8, 2, "F");
  doc.text(L.bad, 146, y + 10);
}

// ═══════════════════════════════════════════════════════════
//  PAGES 21–22: VIMSHOTTARI DASHA I & II
// ═══════════════════════════════════════════════════════════
export function renderVimshottariDasha1Page(
  doc: jsPDF,
  apiData: Record<string, any>,
  subDashaData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.vimshottariDasha1);

  const majorDasha = apiData.major_vdasha;
  let y = 35;

  // Current Dasha info
  const currentDasha = apiData.current_vdasha;
  if (currentDasha) {
    y = addSectionTitle(doc, L.currentDasha, y);
    const currentRows = [
      [L.mahadasha, safeVal(currentDasha, "major", "mahadasha")],
      [L.antardasha, safeVal(currentDasha, "sub", "antardasha")],
      [L.pratyantarDasha, safeVal(currentDasha, "sub_sub", "pratyantarDasha")],
      [L.sookshmDasha, safeVal(currentDasha, "sub_sub_sub", "sookshmDasha")],
    ];
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 110 },
      head: [],
      body: currentRows,
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
    y = (doc as any).lastAutoTable?.finalY ?? y + 40;
    y += 8;
  }

  // Major dasha with sub-dasha for first 6 planets
  DASHA_ORDER_PAGE7.forEach((planet, idx) => {
    const dashaEntry = Array.isArray(majorDasha)
      ? majorDasha.find(
          (d: any) =>
            d.planet === planet || d.name === planet || d.dasha === planet,
        )
      : null;

    if (idx % 3 === 0 && idx > 0) {
      y += 5;
    }

    const col = idx % 3;
    const xStart = 14 + col * 62;

    // Planet header
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(
      `${planet}: ${dashaEntry ? safeVal(dashaEntry, "start") : ""}–${dashaEntry ? safeVal(dashaEntry, "end") : ""}`,
      xStart,
      y,
    );

    // Sub-dasha table
    const subData = subDashaData[planet];
    if (subData && Array.isArray(subData)) {
      const subRows = subData
        .slice(0, 9)
        .map((s: any) => [
          s.planet || s.name || "N/A",
          safeVal(s, "start"),
          safeVal(s, "end"),
        ]);
      autoTable(doc, {
        startY: y + 3,
        margin: {
          left: xStart,
          right: doc.internal.pageSize.getWidth() - xStart - 58,
        },
        head: [[L.dashaName, L.startDate, L.endDate]],
        body: subRows,
        theme: "grid",
        headStyles: {
          fillColor: COLORS.primary,
          textColor: COLORS.white,
          fontSize: 6,
        },
        styles: { fontSize: 5.5, cellPadding: 1, textColor: COLORS.text },
        alternateRowStyles: { fillColor: [255, 248, 240] },
      });
    }

    if (col === 2 || idx === DASHA_ORDER_PAGE7.length - 1) {
      y = (doc as any).lastAutoTable?.finalY ?? y + 60;
      y += 5;
    }
  });
}

export function renderVimshottariDasha2Page(
  doc: jsPDF,
  apiData: Record<string, any>,
  subDashaData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.vimshottariDasha2);

  let y = 35;
  const majorDasha = apiData.major_vdasha;

  DASHA_ORDER_PAGE7.forEach((planet, idx) => {
    const dashaEntry = Array.isArray(majorDasha)
      ? majorDasha.find(
          (d: any) =>
            d.planet === planet || d.name === planet || d.dasha === planet,
        )
      : null;

    const col = idx % 3;
    const xStart = 14 + col * 62;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(
      `${planet}: ${dashaEntry ? safeVal(dashaEntry, "start") : ""}–${dashaEntry ? safeVal(dashaEntry, "end") : ""}`,
      xStart,
      y,
    );

    const subData = subDashaData[planet];
    if (subData && Array.isArray(subData)) {
      const subRows = subData
        .slice(0, 9)
        .map((s: any) => [
          s.planet || s.name || "N/A",
          safeVal(s, "start"),
          safeVal(s, "end"),
        ]);
      autoTable(doc, {
        startY: y + 3,
        margin: {
          left: xStart,
          right: doc.internal.pageSize.getWidth() - xStart - 58,
        },
        head: [[L.dashaName, L.startDate, L.endDate]],
        body: subRows,
        theme: "grid",
        headStyles: {
          fillColor: COLORS.primary,
          textColor: COLORS.white,
          fontSize: 6,
        },
        styles: { fontSize: 5.5, cellPadding: 1, textColor: COLORS.text },
        alternateRowStyles: { fillColor: [255, 248, 240] },
      });
    }

    if (col === 2 || idx === DASHA_ORDER_PAGE7.length - 1) {
      y = (doc as any).lastAutoTable?.finalY ?? y + 60;
      y += 5;
    }
  });
}

// ═══════════════════════════════════════════════════════════
//  PAGES 23–25: YOGINI DASHA I, II, III
// ═══════════════════════════════════════════════════════════
export function renderYoginiDashaPages(
  doc: jsPDF,
  yoginiData: Record<string, any>,
  L: Labels,
) {
  const majorYogini = yoginiData?.major_yogini_dasha;
  const subYogini = yoginiData?.sub_yogini_dasha;

  // Split yogini dasha across 3 pages (3, 3, 2)
  const pages = [
    { title: L.yoginiDasha1, slice: [0, 3] },
    { title: L.yoginiDasha2, slice: [3, 6] },
    { title: L.yoginiDasha3, slice: [6, 8] },
  ];

  pages.forEach((pg) => {
    doc.addPage();
    addPageBackground(doc);
    addPageHeader(doc, pg.title);

    const dashaSlice = YOGINI_DASHAS.slice(pg.slice[0], pg.slice[1]);
    let y = 35;

    dashaSlice.forEach((yd, idx) => {
      // Find major dasha entry
      const major = Array.isArray(majorYogini)
        ? majorYogini.find((d: any) =>
            String(d.dasha_name || d.name || "")
              .toLowerCase()
              .includes(yd.name.toLowerCase()),
          )
        : null;

      y = addSectionTitle(
        doc,
        `${yd.name} (${yd.years} ${L.years})${major ? ` — ${safeVal(major, "start")} to ${safeVal(major, "end")}` : ""}`,
        y,
      );

      // Sub-dasha for this yogini
      const subEntries = Array.isArray(subYogini)
        ? subYogini.filter((s: any) =>
            String(s.major_dasha || s.dasha_name || "")
              .toLowerCase()
              .includes(yd.name.toLowerCase()),
          )
        : [];

      if (subEntries.length > 0) {
        const headRow = [L.dashaName, L.startDate, L.endDate];
        const bodyRows = subEntries.map((s: any) => [
          s.sub_dasha || s.name || "N/A",
          safeVal(s, "start"),
          safeVal(s, "end"),
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
          },
          styles: { fontSize: 7.5, cellPadding: 2, textColor: COLORS.text },
          alternateRowStyles: { fillColor: [255, 248, 240] },
        });
        y = (doc as any).lastAutoTable?.finalY ?? y + 50;
        y += 8;
      } else {
        doc.setFontSize(8);
        doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
        doc.text("Sub-dasha data not available.", 14, y);
        y += 15;
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════
//  PAGES 26–27: CHAR DASHA I & II
// ═══════════════════════════════════════════════════════════
export function renderCharDashaPages(
  doc: jsPDF,
  charDashaData: Record<string, any>,
  L: Labels,
) {
  const majorCharDasha = charDashaData?.major_chardasha;
  const subCharDasha = charDashaData?.sub_chardasha || {};

  // Page 26: First 6 signs
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.charDasha);
  renderCharDashaGrid(
    doc,
    majorCharDasha,
    subCharDasha,
    CHAR_DASHA_SIGNS.slice(0, 6),
    35,
    L,
  );

  // Page 27: Last 6 signs
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.charDasha2);
  renderCharDashaGrid(
    doc,
    majorCharDasha,
    subCharDasha,
    CHAR_DASHA_SIGNS.slice(6, 12),
    35,
    L,
  );
}

function renderCharDashaGrid(
  doc: jsPDF,
  majorCharDasha: any,
  subCharDasha: Record<string, any>,
  signs: string[],
  startY: number,
  L: Labels,
) {
  const colW = 60;
  const cols = 3;

  signs.forEach((sign, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const xStart = 14 + col * (colW + 4);
    let y = startY + row * 110;

    // Major Char Dasha entry for this sign
    const major = Array.isArray(majorCharDasha)
      ? majorCharDasha.find(
          (d: any) =>
            String(d.sign || d.name || "").toLowerCase() === sign.toLowerCase(),
        )
      : null;

    // Sign header
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(sign, xStart, y);

    if (major) {
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.text(
        `${safeVal(major, "start")} - ${safeVal(major, "end")} (${safeVal(major, "duration")} yrs)`,
        xStart,
        y + 6,
      );
    }

    // Sub-dasha for this sign
    const subData = subCharDasha[sign];
    if (subData && Array.isArray(subData)) {
      const subRows = subData
        .slice(0, 12)
        .map((s: any) => [
          s.sign || s.name || "N/A",
          safeVal(s, "start"),
          safeVal(s, "end"),
        ]);
      autoTable(doc, {
        startY: y + 10,
        margin: {
          left: xStart,
          right: doc.internal.pageSize.getWidth() - xStart - colW + 4,
        },
        head: [[L.sign, L.startDate, L.endDate]],
        body: subRows,
        theme: "grid",
        headStyles: {
          fillColor: COLORS.primary,
          textColor: COLORS.white,
          fontSize: 5.5,
        },
        styles: { fontSize: 5, cellPadding: 1, textColor: COLORS.text },
        alternateRowStyles: { fillColor: [255, 248, 240] },
      });
    }
  });
}
