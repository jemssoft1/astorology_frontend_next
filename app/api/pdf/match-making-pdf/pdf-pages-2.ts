// pdf-pages-2.ts — Pages 7–12: Vimshottari Dasha (M/F), Manglik (Info/M/F/Match)
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  COLORS,
  Labels,
  MANGLIK_HOUSE_EFFECTS_EN,
  MANGLIK_HOUSE_EFFECTS_HI,
  DASHA_PLANETS,
} from "./constants";
import { addPageBackground, addPageHeader, addSectionTitle } from "./helpers";

// ═══════════════════════════════════════════════
//  HELPER — render Vimshottari dasha page for one person
// ═══════════════════════════════════════════════
function renderVimshottariDashaForPerson(
  doc: jsPDF,
  labels: Labels,
  personName: string,
  personData: Record<string, any>,
  subDashaData: Record<string, any>,
  headerColor: [number, number, number],
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, `${personName} - ${labels.vimshottariDasha}`);

  const w = doc.internal.pageSize.getWidth();

  // Current Dasha info
  const currentAll =
    personData.current_vdasha_all || personData.current_vdasha || {};
  let y = 34;

  doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
  doc.roundedRect(14, y, w - 28, 12, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`${labels.currentDasha}`, w / 2, y + 8, { align: "center" });
  y += 16;

  // Show current dasha summary
  const major = currentAll.major || currentAll.mahadasha;
  const sub = currentAll.sub || currentAll.antardasha;
  if (major || sub) {
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    if (major) {
      doc.text(
        `${labels.mahadasha}: ${String(major.name || major.planet || major)} (${String(major.start || "")} - ${String(major.end || "")})`,
        20,
        y,
      );
      y += 5;
    }
    if (sub) {
      doc.text(
        `${labels.antardasha}: ${String(sub.name || sub.planet || sub)} (${String(sub.start || "")} - ${String(sub.end || "")})`,
        20,
        y,
      );
      y += 5;
    }
    y += 3;
  }

  // Mahadasha table
  const majorDasha = personData.major_vdasha;
  if (Array.isArray(majorDasha) && majorDasha.length > 0) {
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(labels.mahadasha, 14, y);
    y += 3;

    const dashaRows = majorDasha.map((d: any) => [
      String(d.planet || d.dasha || d.name || "N/A"),
      String(d.start || d.start_date || "N/A"),
      String(d.end || d.end_date || "N/A"),
    ]);

    autoTable(doc, {
      startY: y,
      head: [[labels.dashaName, labels.startDate, labels.endDate]],
      body: dashaRows,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 1.5, halign: "center" },
      headStyles: {
        fillColor: [headerColor[0], headerColor[1], headerColor[2]],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7.5,
      },
      margin: { left: 14, right: 14 },
      alternateRowStyles: { fillColor: [245, 245, 255] },
    });

    y = (doc as any).lastAutoTable?.finalY || y + 60;
    y += 6;
  }

  // Sub-dasha tables — 3x2 grid for available planets
  const subDashaKeys = Object.keys(subDashaData || {}).filter(
    (k) => subDashaData[k] && Array.isArray(subDashaData[k]),
  );

  if (subDashaKeys.length > 0) {
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(labels.antardasha, 14, y);
    y += 3;

    const colW = (w - 38) / 3;
    let col = 0;
    let rowY = y;

    // Limit to first 5 dasha planets that have sub-dasha data
    const displayKeys = subDashaKeys.slice(0, 6);
    for (const planet of displayKeys) {
      const entries = subDashaData[planet] || [];
      if (!Array.isArray(entries) || entries.length === 0) continue;

      const xPos = 14 + col * (colW + 5);
      const rows = entries
        .slice(0, 9)
        .map((e: any) => [
          String(e.planet || e.name || e.dasha || "N/A").substring(0, 8),
          String(e.start || e.start_date || "").substring(0, 10),
          String(e.end || e.end_date || "").substring(0, 10),
        ]);

      autoTable(doc, {
        startY: rowY,
        head: [[planet.substring(0, 8), labels.startDate, labels.endDate]],
        body: rows,
        theme: "grid",
        styles: { fontSize: 5.5, cellPadding: 1, halign: "center" },
        headStyles: {
          fillColor: [headerColor[0], headerColor[1], headerColor[2]],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 6,
        },
        tableWidth: colW,
        margin: { left: xPos, right: w - xPos - colW },
      });

      col++;
      if (col >= 3) {
        col = 0;
        rowY = (doc as any).lastAutoTable?.finalY + 4 || rowY + 60;
      }
    }
  }
}

// ═══════════════════════════════════════════════
//  PAGE 7 — MALE VIMSHOTTARI DASHA
// ═══════════════════════════════════════════════
export function renderMaleVimshottariPage(
  doc: jsPDF,
  labels: Labels,
  maleName: string,
  maleData: Record<string, any>,
  maleSubDasha: Record<string, any>,
) {
  renderVimshottariDashaForPerson(
    doc,
    labels,
    maleName,
    maleData,
    maleSubDasha,
    [60, 80, 140], // blue header
  );
}

// ═══════════════════════════════════════════════
//  PAGE 8 — FEMALE VIMSHOTTARI DASHA
// ═══════════════════════════════════════════════
export function renderFemaleVimshottariPage(
  doc: jsPDF,
  labels: Labels,
  femaleName: string,
  femaleData: Record<string, any>,
  femaleSubDasha: Record<string, any>,
) {
  renderVimshottariDashaForPerson(
    doc,
    labels,
    femaleName,
    femaleData,
    femaleSubDasha,
    [140, 50, 80], // pink header
  );
}

// ═══════════════════════════════════════════════
//  PAGE 9 — MANGLIK INFO (What & House Effects)
// ═══════════════════════════════════════════════
export function renderManglikInfoPage(
  doc: jsPDF,
  labels: Labels,
  lang: string,
  matchManglik: any,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, labels.whatIsManglik);

  const w = doc.internal.pageSize.getWidth();
  let y = 38;

  // Description
  const desc =
    matchManglik?.what_is_manglik_dosha ||
    (lang === "hi"
      ? "मंगल दोष तब होता है जब मंगल ग्रह कुंडली में 1, 2, 4, 7, 8 या 12वें भाव में स्थित होता है। इसे कुजा दोष या अंगारक दोष भी कहा जाता है। यह वैवाहिक जीवन पर प्रतिकूल प्रभाव डाल सकता है।"
      : "Manglik Dosha occurs when Mars is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house of the birth chart. Also known as Kuja Dosha or Angaraka Dosha, it is believed to have adverse effects on married life.");

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(String(desc), w - 36);
  doc.text(descLines, 20, y);
  y += descLines.length * 4.5 + 10;

  // House effects title
  addSectionTitle(doc, labels.manglikEffect, y);
  y += 10;

  // Draw house effect cards
  const houseEffects =
    lang === "hi" ? MANGLIK_HOUSE_EFFECTS_HI : MANGLIK_HOUSE_EFFECTS_EN;
  const houses = Object.keys(houseEffects);
  const cardW = (w - 38) / 2;

  houses.forEach((house, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const xPos = 14 + col * (cardW + 10);
    const yPos = y + row * 38;

    if (yPos > 260) return; // page overflow protection

    // Card background
    doc.setFillColor(250, 245, 240);
    doc.roundedRect(xPos, yPos, cardW, 34, 3, 3, "F");
    doc.setDrawColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.setLineWidth(0.3);
    doc.roundedRect(xPos, yPos, cardW, 34, 3, 3, "S");

    // House label
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(house, xPos + 4, yPos + 7);

    // Effect text
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const effectLines = doc.splitTextToSize(houseEffects[house], cardW - 8);
    doc.text(effectLines.slice(0, 4), xPos + 4, yPos + 13);
  });
}

// ═══════════════════════════════════════════════
//  HELPER — render Manglik analysis for one person
// ═══════════════════════════════════════════════
function renderManglikAnalysis(
  doc: jsPDF,
  labels: Labels,
  personName: string,
  manglikData: any,
  headerColor: [number, number, number],
  bgColor: [number, number, number],
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, `${personName} - ${labels.manglikAnalysis}`);

  const w = doc.internal.pageSize.getWidth();
  let y = 38;

  if (!manglikData) {
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(11);
    doc.text("Manglik data not available", w / 2, y + 20, { align: "center" });
    return;
  }

  const isManglik =
    manglikData.is_piyadhipati || manglikData.is_manglik_piyadhipati;
  const percentage =
    manglikData.manglik_piyadhipati || manglikData.percentage_piyadhipati || 0;

  // Status card
  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  doc.roundedRect(20, y, w - 40, 50, 5, 5, "F");
  doc.setDrawColor(headerColor[0], headerColor[1], headerColor[2]);
  doc.setLineWidth(1);
  doc.roundedRect(20, y, w - 40, 50, 5, 5, "S");

  // Emoji indicator
  const emoji = isManglik ? "\u26A0" : "\u2705"; // ⚠ or ✅
  doc.setFontSize(22);
  doc.text(emoji, w / 2, y + 18, { align: "center" });

  // Status text
  doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(
    isManglik ? labels.manglikPresent : labels.manglikNotPresent,
    w / 2,
    y + 32,
    { align: "center" },
  );

  // Percentage
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${labels.totalManglikPercentage}: ${typeof percentage === "number" ? percentage.toFixed(1) : percentage}%`,
    w / 2,
    y + 42,
    { align: "center" },
  );

  y += 58;

  // Detailed manglik report table
  const reportItems = manglikData.report || manglikData.manglik_report || [];
  if (Array.isArray(reportItems) && reportItems.length > 0) {
    const rows = reportItems.map((item: any) => [
      String(item.house || item.planet || ""),
      String(
        item.is__piyadhipati_from_lagna !== undefined
          ? item.is_piyadhipati_from_lagna
            ? "Yes"
            : "No"
          : "N/A",
      ),
      String(
        item.is_piyadhipati_from_moon !== undefined
          ? item.is_piyadhipati_from_moon
            ? "Yes"
            : "No"
          : "N/A",
      ),
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Factor", "From Lagna", "From Moon"]],
      body: rows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3, halign: "center" },
      headStyles: {
        fillColor: [headerColor[0], headerColor[1], headerColor[2]],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      margin: { left: 20, right: 20 },
    });

    y = (doc as any).lastAutoTable?.finalY || y + 60;
    y += 8;
  }

  // Manglik description text
  const manglikReport =
    manglikData.manglik_report_text ||
    manglikData.report_text ||
    manglikData.manglik_present_rule ||
    manglikData.manglik_cancel_rule;
  if (manglikReport) {
    const parts = Array.isArray(manglikReport)
      ? manglikReport
      : [manglikReport];
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    for (const part of parts) {
      if (y > 265) break;
      const lines = doc.splitTextToSize(String(part), w - 40);
      doc.text(lines, 20, y);
      y += lines.length * 4 + 4;
    }
  }
}

// ═══════════════════════════════════════════════
//  PAGE 10 — MALE MANGLIK ANALYSIS
// ═══════════════════════════════════════════════
export function renderMaleManglikPage(
  doc: jsPDF,
  labels: Labels,
  maleName: string,
  maleData: Record<string, any>,
) {
  renderManglikAnalysis(
    doc,
    labels,
    maleName,
    maleData.manglik,
    [60, 80, 140],
    [240, 248, 255],
  );
}

// ═══════════════════════════════════════════════
//  PAGE 11 — FEMALE MANGLIK ANALYSIS
// ═══════════════════════════════════════════════
export function renderFemaleManglikPage(
  doc: jsPDF,
  labels: Labels,
  femaleName: string,
  femaleData: Record<string, any>,
) {
  renderManglikAnalysis(
    doc,
    labels,
    femaleName,
    femaleData.manglik,
    [140, 50, 80],
    [255, 240, 245],
  );
}

// ═══════════════════════════════════════════════
//  PAGE 12 — MANGLIK MATCH ANALYSIS
// ═══════════════════════════════════════════════
export function renderManglikMatchPage(
  doc: jsPDF,
  labels: Labels,
  maleName: string,
  femaleName: string,
  maleData: Record<string, any>,
  femaleData: Record<string, any>,
  matchManglik: any,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, `${maleName} & ${femaleName} - ${labels.manglikMatch}`);

  const w = doc.internal.pageSize.getWidth();
  let y = 38;

  const maleManglik = maleData.manglik || {};
  const femaleManglik = femaleData.manglik || {};
  const cardW = (w - 50) / 2;

  // Two-column comparison
  // Male card (left)
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(14, y, cardW, 80, 4, 4, "F");
  doc.setDrawColor(60, 80, 140);
  doc.setLineWidth(0.8);
  doc.roundedRect(14, y, cardW, 80, 4, 4, "S");

  doc.setFillColor(60, 80, 140);
  doc.roundedRect(14, y, cardW, 16, 4, 4, "F");
  doc.rect(14, y + 8, cardW, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(maleName, 14 + cardW / 2, y + 11, { align: "center" });

  const mIsManglik =
    maleManglik.is_piyadhipati || maleManglik.is_manglik_piyadhipati;
  const mPercentage =
    maleManglik.manglik_piyadhipati || maleManglik.percentage_piyadhipati || 0;

  doc.setFontSize(18);
  doc.text(mIsManglik ? "\u26A0" : "\u2705", 14 + cardW / 2, y + 36, {
    align: "center",
  });
  doc.setTextColor(60, 80, 140);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(
    mIsManglik ? labels.manglikPresent : labels.manglikNotPresent,
    14 + cardW / 2,
    y + 50,
    { align: "center" },
  );
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.text(
    `${typeof mPercentage === "number" ? mPercentage.toFixed(1) : mPercentage}%`,
    14 + cardW / 2,
    y + 65,
    { align: "center" },
  );

  // Female card (right)
  const fX = w - 14 - cardW;
  doc.setFillColor(255, 240, 245);
  doc.roundedRect(fX, y, cardW, 80, 4, 4, "F");
  doc.setDrawColor(140, 50, 80);
  doc.setLineWidth(0.8);
  doc.roundedRect(fX, y, cardW, 80, 4, 4, "S");

  doc.setFillColor(140, 50, 80);
  doc.roundedRect(fX, y, cardW, 16, 4, 4, "F");
  doc.rect(fX, y + 8, cardW, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(femaleName, fX + cardW / 2, y + 11, { align: "center" });

  const fIsManglik =
    femaleManglik.is_piyadhipati || femaleManglik.is_manglik_piyadhipati;
  const fPercentage =
    femaleManglik.manglik_piyadhipati ||
    femaleManglik.percentage_piyadhipati ||
    0;

  doc.setFontSize(18);
  doc.text(fIsManglik ? "\u26A0" : "\u2705", fX + cardW / 2, y + 36, {
    align: "center",
  });
  doc.setTextColor(140, 50, 80);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(
    fIsManglik ? labels.manglikPresent : labels.manglikNotPresent,
    fX + cardW / 2,
    y + 50,
    { align: "center" },
  );
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.text(
    `${typeof fPercentage === "number" ? fPercentage.toFixed(1) : fPercentage}%`,
    fX + cardW / 2,
    y + 65,
    { align: "center" },
  );

  y += 90;

  // Match result section
  addSectionTitle(doc, labels.manglikMatchResult, y);
  y += 10;

  const conclusion =
    matchManglik?.conclusion ||
    matchManglik?.manglik_report ||
    matchManglik?.report ||
    (mIsManglik && fIsManglik
      ? "Both partners have Manglik Dosha. When both partners are Manglik, the effects are neutralized and the match is considered compatible."
      : !mIsManglik && !fIsManglik
        ? "Neither partner has Manglik Dosha. The match is considered favorable from a Manglik perspective."
        : "One partner has Manglik Dosha while the other does not. Appropriate remedies may be suggested to mitigate any negative effects.");

  doc.setFillColor(250, 248, 240);
  doc.roundedRect(18, y, w - 36, 40, 3, 3, "F");
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(0.5);
  doc.roundedRect(18, y, w - 36, 40, 3, 3, "S");

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const conclusionText = Array.isArray(conclusion)
    ? conclusion.join(". ")
    : String(conclusion);
  const concLines = doc.splitTextToSize(conclusionText, w - 48);
  doc.text(concLines.slice(0, 8), 24, y + 8);
}
