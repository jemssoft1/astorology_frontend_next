// pdf-pages-3.ts — Pages 28–47: Kalsarpa, Manglik, Sadhesati, Gemstones,
// Rudraksha, Favourables, Numerology, Ascendant

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  COLORS,
  KALSARPA_TYPES,
  RUDRAKSHA_DATA,
  SADHESATI_REMEDIES_EN,
  SADHESATI_REMEDIES_HI,
  NUMEROLOGY_FIELDS_EN,
  NUMEROLOGY_FIELDS_HI,
  ASCENDANT_DATA,
  ZODIAC_SIGNS,
} from "./constants";
import type { Labels } from "./constants";
import {
  addPageBackground,
  addPageHeader,
  addSectionTitle,
  drawCornerDecoration,
} from "./helpers";

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
//  PAGES 28–29: KALSARPA DOSHA
// ═══════════════════════════════════════════════════════════
export function renderKalsarpaPages(
  doc: jsPDF,
  kalsarpaData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  const kalsarpa = kalsarpaData?.kalsarpa_details;

  // Page 28: Kalsarpa analysis
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.kalsarpaDosha);

  let y = 35;

  // Description
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const descLines = doc.splitTextToSize(L.kalsarpaDescription, 170);
  doc.text(descLines, 14, y);
  y += descLines.length * 5 + 8;

  // Status
  y = addSectionTitle(doc, L.kalsarpaReport, y);
  if (kalsarpa) {
    const isPresent = kalsarpa.present || kalsarpa.is_present;
    const statusRows = [
      [L.kalsarpaPresent.replace("present", ""), isPresent ? "Yes" : "No"],
    ];
    if (kalsarpa.type || kalsarpa.kalsarpa_type) {
      statusRows.push([
        L.kalsarpaName,
        safeVal(kalsarpa, "type", "kalsarpa_type"),
      ]);
    }
    if (kalsarpa.direction) {
      statusRows.push([L.kalsarpaDirection, kalsarpa.direction]);
    }
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 80 },
      head: [],
      body: statusRows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: 45,
          textColor: COLORS.primary,
        },
      },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y + 30;

    // Kalsarpa effect report if available
    if (kalsarpa.report || kalsarpa.description) {
      y += 5;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      const reportText = kalsarpa.report || kalsarpa.description || "";
      const reportLines = doc.splitTextToSize(reportText, 170);
      doc.text(reportLines, 14, y);
      y += reportLines.length * 4;
    }
  }

  // Page 29: Kalsarpa Effect & Remedies
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.remediesOfKalsarpa);

  y = 35;

  // Kalsarpa types table
  y = addSectionTitle(doc, L.kalsarpaDosha, y);
  if (KALSARPA_TYPES && KALSARPA_TYPES.length > 0) {
    const headRow = ["#", "Name", "Rahu House", "Ketu House"];
    const bodyRows = KALSARPA_TYPES.map((kt: any, idx: number) => [
      `${idx + 1}`,
      kt.name || kt.type || "N/A",
      safeVal(kt, "rahu_house", "rahuHouse"),
      safeVal(kt, "ketu_house", "ketuHouse"),
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
    y = (doc as any).lastAutoTable?.finalY ?? y + 100;
  }

  // Remedies
  if (kalsarpa) {
    y += 8;
    y = addSectionTitle(doc, L.remedies, y);
    const remedies = kalsarpa.remedies || kalsarpa.remedy || [];
    if (Array.isArray(remedies) && remedies.length > 0) {
      remedies.forEach((r: any, idx: number) => {
        const text = typeof r === "string" ? r : r.remedy || r.text || "";
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
        const lines = doc.splitTextToSize(`${idx + 1}. ${text}`, 170);
        doc.text(lines, 14, y);
        y += lines.length * 4 + 2;
      });
    }
  }
}

// ═══════════════════════════════════════════════════════════
//  PAGES 30–31: MANGLIK DOSHA
// ═══════════════════════════════════════════════════════════
export function renderManglikPages(
  doc: jsPDF,
  apiData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  const manglik = apiData.manglik;
  const simpleManglik = apiData.simple_manglik;

  // Page 30: Manglik Analysis
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.manglikAnalysis);

  let y = 35;

  // What is Manglik
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.whatIsManglik, 14, y);
  y += 8;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const mangDescLines = doc.splitTextToSize(L.manglikDescription, 170);
  doc.text(mangDescLines, 14, y);
  y += mangDescLines.length * 4 + 8;

  // Manglik percentage
  if (manglik) {
    y = addSectionTitle(doc, L.manglikReport, y);
    const percentage =
      manglik.manglik_percentage ??
      manglik.percentage ??
      manglik.manglik_status?.percentage ??
      "N/A";

    // Big percentage display
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    const pctColor = Number(percentage) > 50 ? COLORS.darkRed : COLORS.primary;
    doc.setTextColor(pctColor[0], pctColor[1], pctColor[2]);
    doc.text(`${percentage}%`, 14, y + 15);
    doc.setFontSize(10);
    doc.text(L.totalManglikPercentage, 60, y + 10);
    y += 30;

    // Based on house and aspects tables
    if (manglik.manglik_report || manglik.report) {
      const report = manglik.manglik_report || manglik.report || [];
      if (Array.isArray(report)) {
        const headRow = [L.basedOnHouse, L.manglikReport];
        const bodyRows = report.map((r: any) => [
          safeVal(r, "house", "factor"),
          safeVal(r, "report", "description", "result"),
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
        y = (doc as any).lastAutoTable?.finalY ?? y + 80;
      }
    }
  }

  // Page 31: Manglik Remedies
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.remediesOfManglik);

  y = 35;
  if (manglik) {
    // Aspect-based analysis
    if (manglik.manglik_aspect || manglik.based_on_aspect) {
      y = addSectionTitle(doc, L.basedOnAspects, y);
      const aspects = manglik.manglik_aspect || manglik.based_on_aspect || [];
      if (Array.isArray(aspects)) {
        const headRow = [L.basedOnAspects, L.manglikReport];
        const bodyRows = aspects.map((a: any) => [
          safeVal(a, "aspect", "factor"),
          safeVal(a, "report", "description", "result"),
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
        y = (doc as any).lastAutoTable?.finalY ?? y + 60;
      }
    }

    // Remedies
    y += 8;
    y = addSectionTitle(doc, L.remedies, y);
    const remedies = manglik.remedies || [];
    if (Array.isArray(remedies)) {
      remedies.forEach((r: any, idx: number) => {
        const text = typeof r === "string" ? r : r.remedy || r.text || "";
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
        const lines = doc.splitTextToSize(`${idx + 1}. ${text}`, 170);
        doc.text(lines, 14, y);
        y += lines.length * 4 + 2;
      });
    }
  }
}

// ═══════════════════════════════════════════════════════════
//  PAGES 32–34: SADHESATI
// ═══════════════════════════════════════════════════════════
export function renderSadhesatiPages(
  doc: jsPDF,
  apiData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  const sadhesati = apiData.sadhesati_current_status;
  const sadhesatiLife = apiData.sadhesati_life_details;

  // Page 32: Sadhesati Analysis
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.sadhesatiAnalysis);

  let y = 35;

  // What is Sadhesati
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.whatIsSadhesati, 14, y);
  y += 8;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const sadDescLines = doc.splitTextToSize(L.sadhesatiDescription, 170);
  doc.text(sadDescLines, 14, y);
  y += sadDescLines.length * 4 + 8;

  // Status table
  if (sadhesati) {
    y = addSectionTitle(doc, L.sadhesatiStatus, y);
    const statusRows = [
      [L.isSadhesatiPresent, sadhesati.is_undergoing ? "Yes" : "No"],
      [L.considerationDate, safeVal(sadhesati, "consideration_date")],
      [L.moonSign, safeVal(sadhesati, "moon_sign")],
      [L.saturnRetrograde, sadhesati.is_saturn_retrograde ? "Yes" : "No"],
    ];
    if (sadhesati.phase) {
      statusRows.push([L.phase, sadhesati.phase]);
    }
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 80 },
      head: [],
      body: statusRows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: 50,
          textColor: COLORS.primary,
        },
      },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y + 50;
  }

  // Page 33: Sadhesati Life Analysis
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.sadhesatiLifeAnalysis);

  y = 35;
  if (sadhesatiLife && Array.isArray(sadhesatiLife)) {
    const headRow = [L.moon, L.saturn, L.isRetro, L.phase, L.date, L.summary];
    const bodyRows = sadhesatiLife.map((s: any) => [
      safeVal(s, "moon_sign"),
      safeVal(s, "saturn_sign"),
      s.is_retro ? "Yes" : "No",
      safeVal(s, "phase", "type"),
      safeVal(s, "start_date", "date"),
      safeVal(s, "summary", "description"),
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
        fontSize: 7,
      },
      styles: { fontSize: 6.5, cellPadding: 1.5, textColor: COLORS.text },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
  } else {
    doc.setFontSize(9);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text("Sadhesati life analysis data not available.", 14, y);
  }

  // Page 34: Sadhesati Remedies
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.sadhesatiRemedies);

  y = 35;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const remedyDescLines = doc.splitTextToSize(
    L.sadhesatiRemediesDescription,
    170,
  );
  doc.text(remedyDescLines, 14, y);
  y += remedyDescLines.length * 5 + 10;

  y = addSectionTitle(doc, L.remedies, y);
  const remedies =
    lang === "hi" ? SADHESATI_REMEDIES_HI : SADHESATI_REMEDIES_EN;
  remedies.forEach((r, idx) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    const lines = doc.splitTextToSize(`${idx + 1}. ${r}`, 170);
    doc.text(lines, 14, y);
    y += lines.length * 4 + 3;
  });
}

// ═══════════════════════════════════════════════════════════
//  PAGES 35–39: GEMSTONES
// ═══════════════════════════════════════════════════════════
export function renderGemstonePages(
  doc: jsPDF,
  gemstoneData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  const gems = gemstoneData?.basic_gem_suggestion;

  // Page 35: Gemstone Suggestions overview
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.gemstoneSuggestions);

  let y = 35;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const gemDescLines = doc.splitTextToSize(L.gemstoneDescription, 170);
  doc.text(gemDescLines, 14, y);
  y += gemDescLines.length * 5 + 10;

  if (gems) {
    // Summary table of 3 stones
    const stoneCategories = [
      { key: "life", label: L.lifeStone },
      { key: "benefic", label: L.beneficStone },
      { key: "lucky", label: L.luckyStone },
    ];

    stoneCategories.forEach((cat) => {
      const stone = gems[cat.key] || gems[`${cat.key}_stone`] || {};
      y = addSectionTitle(doc, cat.label, y);

      const stoneRows = [
        ["Name", safeVal(stone, "name", "stone_name", "gemstone")],
        [L.finger, safeVal(stone, "wear_finger", "finger")],
        [L.weight, safeVal(stone, "weight", "carat")],
        [L.dayToWear, safeVal(stone, "wear_day", "day")],
        [L.deity, safeVal(stone, "deity", "god")],
        [L.metal, safeVal(stone, "wear_metal", "metal")],
      ];
      autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 100 },
        head: [],
        body: stoneRows,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
        columnStyles: {
          0: {
            fontStyle: "bold",
            cellWidth: 30,
            textColor: COLORS.primary,
          },
        },
        alternateRowStyles: { fillColor: [255, 248, 240] },
      });
      y = (doc as any).lastAutoTable?.finalY ?? y + 40;
      y += 5;
    });
  }

  // Pages 36–38: Life, Benefic, Lucky Stone Details
  const stoneKeys = [
    { key: "life", label: L.lifeStone },
    { key: "benefic", label: L.beneficStone },
    { key: "lucky", label: L.luckyStone },
  ];

  stoneKeys.forEach((sk) => {
    if (!gems) return;
    const stone = gems[sk.key] || gems[`${sk.key}_stone`] || {};

    doc.addPage();
    addPageBackground(doc);
    addPageHeader(doc, sk.label);

    let sy = 35;
    const stoneName = safeVal(stone, "name", "stone_name", "gemstone");

    // Stone info table
    const rows = [
      ["Name", stoneName],
      [L.finger, safeVal(stone, "wear_finger", "finger")],
      [L.weight, safeVal(stone, "weight", "carat")],
      [L.dayToWear, safeVal(stone, "wear_day", "day")],
      [L.metal, safeVal(stone, "wear_metal", "metal")],
      [L.deity, safeVal(stone, "deity", "god")],
      [L.timeToWear, safeVal(stone, "wear_time", "time")],
      [L.mantra, safeVal(stone, "mantra")],
      [L.substitutes, safeVal(stone, "semi_gem", "substitute")],
    ];
    autoTable(doc, {
      startY: sy,
      margin: { left: 14, right: 14 },
      head: [],
      body: rows,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3, textColor: COLORS.text },
      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: 40,
          textColor: COLORS.primary,
        },
      },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
    sy = (doc as any).lastAutoTable?.finalY ?? sy + 80;

    // Energizing rituals
    if (stone.energize_method || stone.how_to_wear) {
      sy += 8;
      sy = addSectionTitle(doc, L.energizingRituals, sy);
      const ritual = stone.energize_method || stone.how_to_wear || "";
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      const ritualLines = doc.splitTextToSize(ritual, 170);
      doc.text(ritualLines, 14, sy);
    }
  });

  // Page 39: Gemstone 4 (caution/ general advice)
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.caution);

  let cy = 35;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.caution, 14, cy);
  cy += 10;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);

  const cautionItems = [
    "Always consult a qualified astrologer before wearing any gemstone.",
    "Ensure the gemstone is natural and certified from a reputed gemological laboratory.",
    "Follow the recommended weight, metal, and finger as suggested in this report.",
    "The gemstone should be energized with proper Vedic mantras before wearing.",
    "Remove the gemstone if you experience any adverse effects.",
    "Gemstones should be cleaned and re-energized periodically.",
    "Do not wear damaged or cracked gemstones.",
    "The effects of gemstones vary from person to person based on individual horoscope.",
  ];

  cautionItems.forEach((item, idx) => {
    const lines = doc.splitTextToSize(`${idx + 1}. ${item}`, 170);
    doc.text(lines, 14, cy);
    cy += lines.length * 4 + 3;
  });
}

// ═══════════════════════════════════════════════════════════
//  PAGE 40: RUDRAKSHA REPORT
// ═══════════════════════════════════════════════════════════
export function renderRudrakshaPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.rudrakshaReport);

  const rudraksha = apiData.rudraksha_suggestion;
  let y = 35;

  const rData = RUDRAKSHA_DATA;
  const name = lang === "hi" ? rData.nameHi : rData.name;
  const desc = lang === "hi" ? rData.descriptionHi : rData.description;
  const mantra = lang === "hi" ? rData.mantraHi : rData.mantra;
  const benefits = lang === "hi" ? rData.benefitsHi : rData.benefits;

  // Premium box
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(1.5);
  doc.roundedRect(14, y, w - 28, 40, 3, 3, "FD");

  // Rudraksha name
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(name, w / 2, y + 15, { align: "center" });

  // Mantra
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.text(mantra, w / 2, y + 30, { align: "center" });

  y += 55;

  // Description
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  const descLines = doc.splitTextToSize(desc, 170);
  doc.text(descLines, 14, y);
  y += descLines.length * 5 + 10;

  // API-specific recommendation
  if (rudraksha) {
    y = addSectionTitle(
      doc,
      lang === "hi" ? "Vyaktigat Sujhav" : "Personalized Recommendation",
      y,
    );
    const recText =
      rudraksha.report ||
      rudraksha.recommendation ||
      rudraksha.description ||
      "";
    if (recText) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      const recLines = doc.splitTextToSize(recText, 170);
      doc.text(recLines, 14, y);
      y += recLines.length * 4 + 8;
    }
  }

  // Benefits
  y = addSectionTitle(doc, lang === "hi" ? "Rudraksha Ke Labh" : "Benefits", y);
  benefits.forEach((b, idx) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(`${idx + 1}. ${b}`, 14, y);
    y += 6;
  });
}

// ═══════════════════════════════════════════════════════════
//  PAGE 41: FAVOURABLE POINTS
// ═══════════════════════════════════════════════════════════
export function renderFavourablePointsPage(
  doc: jsPDF,
  apiData: Record<string, any>,
  numerologyData: Record<string, any>,
  L: Labels,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.favourablePoints);

  const numTable = numerologyData?.numero_table;
  let y = 35;

  if (numTable) {
    const rows = [
      [L.destinyNumber, safeVal(numTable, "destiny_number")],
      [L.radicalNumber, safeVal(numTable, "radical_number")],
      [L.nameNumber, safeVal(numTable, "name_number")],
    ];

    // Additional favourables from numero_table
    const favKeys = [
      "lucky_number",
      "evil_number",
      "fav_color",
      "fav_day",
      "fav_god",
      "fav_mantra",
      "fav_metal",
      "fav_stone",
      "fav_substone",
      "neutral_stone",
    ];
    favKeys.forEach((key) => {
      const val = numTable[key];
      if (val) {
        const label = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase());
        rows.push([label, String(val)]);
      }
    });

    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [],
      body: rows,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3, textColor: COLORS.text },
      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: 50,
          textColor: COLORS.primary,
        },
      },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
  }
}

// ═══════════════════════════════════════════════════════════
//  PAGES 42–45: NUMEROLOGY I–IV
// ═══════════════════════════════════════════════════════════
export function renderNumerologyPages(
  doc: jsPDF,
  numerologyData: Record<string, any>,
  lang: string,
  L: Labels,
) {
  const numReport = numerologyData?.numero_report;
  const numFavTime = numerologyData?.numero_fav_time;
  const numFavLord = numerologyData?.numero_fav_lord;
  const numFavMantra = numerologyData?.numero_fav_mantra;
  const fields = lang === "hi" ? NUMEROLOGY_FIELDS_HI : NUMEROLOGY_FIELDS_EN;

  // Page 42: About You
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.numerologyReport);

  let y = addSectionTitle(doc, L.aboutYou, 35);
  if (numReport) {
    const aboutRows = fields
      .filter((f: any) => numReport[f.key] !== undefined)
      .slice(0, 10)
      .map((f: any) => [f.label, String(numReport[f.key])]);
    if (aboutRows.length > 0) {
      autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        head: [],
        body: aboutRows,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
        columnStyles: {
          0: {
            fontStyle: "bold",
            cellWidth: 55,
            textColor: COLORS.primary,
          },
        },
        alternateRowStyles: { fillColor: [255, 248, 240] },
      });
    }
  }

  // Page 43: Favourables & Mantra
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.numerologyReport2);

  y = addSectionTitle(doc, L.favourableFast, 35);
  if (numFavLord) {
    const favRows = Object.entries(numFavLord)
      .filter(([k]) => !k.startsWith("_") && k !== "status_code")
      .map(([k, v]) => [
        k.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        String(v),
      ]);
    if (favRows.length > 0) {
      autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        head: [],
        body: favRows,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
        columnStyles: {
          0: {
            fontStyle: "bold",
            cellWidth: 55,
            textColor: COLORS.primary,
          },
        },
        alternateRowStyles: { fillColor: [255, 248, 240] },
      });
      y = (doc as any).lastAutoTable?.finalY ?? y + 60;
    }
  }

  // Mantra section
  if (numFavMantra) {
    y += 8;
    y = addSectionTitle(doc, L.gayatriMantra, y);
    const mantraText = numFavMantra.mantra || numFavMantra.gayatri_mantra || "";
    if (mantraText) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(
        COLORS.secondary[0],
        COLORS.secondary[1],
        COLORS.secondary[2],
      );
      const mantraLines = doc.splitTextToSize(mantraText, 160);
      doc.text(mantraLines, 20, y);
    }
  }

  // Page 44: Vastu & Quality
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.numerologyReport3);

  y = 35;
  if (numReport) {
    const remainingFields = fields
      .filter((f: any) => numReport[f.key] !== undefined)
      .slice(10, 20);
    if (remainingFields.length > 0) {
      y = addSectionTitle(doc, L.aboutQuality, y);
      const qualityRows = remainingFields.map((f: any) => [
        f.label,
        String(numReport[f.key]),
      ]);
      autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        head: [],
        body: qualityRows,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
        columnStyles: {
          0: {
            fontStyle: "bold",
            cellWidth: 55,
            textColor: COLORS.primary,
          },
        },
        alternateRowStyles: { fillColor: [255, 248, 240] },
      });
    }
  }

  // Page 45: Timings
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.numerologyReport4);

  y = addSectionTitle(doc, L.favourableTimings, 35);
  if (numFavTime) {
    const timeRows = Object.entries(numFavTime)
      .filter(([k]) => !k.startsWith("_") && k !== "status_code")
      .map(([k, v]) => [
        k.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        String(v),
      ]);
    if (timeRows.length > 0) {
      autoTable(doc, {
        startY: y,
        margin: { left: 14, right: 14 },
        head: [],
        body: timeRows,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2, textColor: COLORS.text },
        columnStyles: {
          0: {
            fontStyle: "bold",
            cellWidth: 55,
            textColor: COLORS.primary,
          },
        },
        alternateRowStyles: { fillColor: [255, 248, 240] },
      });
    }
  }
}

// ═══════════════════════════════════════════════════════════
//  PAGES 46–47: ASCENDANT REPORT
// ═══════════════════════════════════════════════════════════
export function renderAscendantPages(
  doc: jsPDF,
  apiData: Record<string, any>,
  L: Labels,
) {
  const ascReport = apiData.general_ascendant_report;
  const ascSign = ascReport?.ascendant || ascReport?.sign || "";
  const ascData = ASCENDANT_DATA[ascSign] || null;

  // Page 46: Ascendant overview
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.ascendantReport);

  let y = 35;

  // Ascendant info box
  const w = doc.internal.pageSize.getWidth();
  if (ascData) {
    // Info table
    const infoRows = [
      [L.ascendant, ascSign],
      [L.lord, ascReport?.ascendant_lord || ""],
      [L.symbol, ascData.symbol],
      [L.element, ascData.element],
      [L.nature, ascData.nature],
      [L.direction, ascData.direction],
      [L.luckyGem, ascData.luckyGem],
      [L.dayOfFast, ascData.dayOfFast],
    ];
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 100 },
      head: [],
      body: infoRows,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2.5, textColor: COLORS.text },
      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: 35,
          textColor: COLORS.primary,
        },
      },
      alternateRowStyles: { fillColor: [255, 248, 240] },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y + 70;

    // Shloka
    y += 8;
    y = addSectionTitle(doc, L.shloka, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.text(ascData.shloka, 14, y);
    y += 10;

    // Personality
    y = addSectionTitle(doc, L.personality, y);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    ascData.personality.forEach((para) => {
      const lines = doc.splitTextToSize(para, 170);
      doc.text(lines, 14, y);
      y += lines.length * 4 + 3;
    });
  }

  // Page 47: Ascendant Analysis
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, L.ascendantAnalysis);

  y = 35;

  if (ascData) {
    // Spiritual lesson
    y = addSectionTitle(doc, L.spiritualLesson, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.text(ascData.spiritualLesson, 14, y);
    y += 12;

    // Positive traits
    y = addSectionTitle(doc, L.positiveTraits, y);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 100, 0);
    ascData.positiveTraits.forEach((trait, idx) => {
      doc.text(`${idx + 1}. ${trait}`, 20, y);
      y += 6;
    });
    y += 5;

    // Negative traits
    y = addSectionTitle(doc, L.negativeTraits, y);
    doc.setTextColor(180, 0, 0);
    ascData.negativeTraits.forEach((trait, idx) => {
      doc.text(`${idx + 1}. ${trait}`, 20, y);
      y += 6;
    });
    y += 8;

    // API-based analysis
    if (ascReport?.report || ascReport?.analysis) {
      y = addSectionTitle(doc, L.ascendantAnalysis, y);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      const analysis = ascReport.report || ascReport.analysis || "";
      const analysisLines = doc.splitTextToSize(analysis, 170);
      doc.text(analysisLines, 14, y);
    }
  }
}
