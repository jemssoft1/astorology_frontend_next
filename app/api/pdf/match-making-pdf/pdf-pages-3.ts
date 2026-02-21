// pdf-pages-3.ts — Pages 13–20: Dashakoot, Rajju, Papasamyam, Personality, Traits, Report, Back Cover
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  COLORS,
  Labels,
  DASHAKOOT_ATTRIBUTES,
  DASHAKOOT_COLORS,
  DASHAKOOT_DESC_EN,
  DASHAKOOT_DESC_HI,
  DASHAKOOT_ASPECTS_EN,
  DASHAKOOT_ASPECTS_HI,
  RAJJU_DESC_EN,
  RAJJU_DESC_HI,
  PAPASAMYAM_DESC_EN,
  PAPASAMYAM_DESC_HI,
} from "./constants";
import { addPageBackground, addPageHeader, addSectionTitle } from "./helpers";

// ═══════════════════════════════════════════════
//  PAGE 13 — DASHAKOOT INFO
// ═══════════════════════════════════════════════
export function renderDashakootInfoPage(
  doc: jsPDF,
  labels: Labels,
  lang: string,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, labels.whatIsDashakoot);

  const w = doc.internal.pageSize.getWidth();
  let y = 36;

  // Description text
  const desc = lang === "hi" ? DASHAKOOT_DESC_HI : DASHAKOOT_DESC_EN;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(desc, w - 32);
  doc.text(descLines, 18, y);
  y += descLines.length * 4.2 + 8;

  // 4×3 grid of attribute blocks
  const attrs = DASHAKOOT_ATTRIBUTES;
  const cols = 4;
  const cardW = (w - 28 - (cols - 1) * 4) / cols;
  const cardH = 22;

  for (let i = 0; i < attrs.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const xPos = 14 + col * (cardW + 4);
    const yPos = y + row * (cardH + 4);

    if (yPos + cardH > 262) continue;

    const color = DASHAKOOT_COLORS[attrs[i].key] || [100, 100, 100];

    // Card with colored accent
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(xPos, yPos, cardW, cardH, 3, 3, "F");

    // White inner
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(xPos + 1, yPos + 6, cardW - 2, cardH - 7, 0, 0, "F");

    // Attribute name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    const attrName = lang === "hi" ? attrs[i].hi : attrs[i].en;
    doc.text(attrName, xPos + cardW / 2, yPos + 5, { align: "center" });

    // Short description
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    const aspects = lang === "hi" ? DASHAKOOT_ASPECTS_HI : DASHAKOOT_ASPECTS_EN;
    const aspText = aspects[attrs[i].key] || "";
    const aspLines = doc.splitTextToSize(aspText, cardW - 6);
    doc.text(aspLines.slice(0, 3), xPos + 3, yPos + 11);
  }

  // Subtitle after grid
  const gridEndY = y + Math.ceil(attrs.length / cols) * (cardH + 4) + 6;

  if (gridEndY < 230) {
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      lang === "hi"
        ? "दशकूट के दस कूट इस प्रकार हैं:"
        : "The ten kootas or Aspects of Dashakoota are as follows:",
      14,
      gridEndY,
    );

    let aspY = gridEndY + 6;
    const aspects = lang === "hi" ? DASHAKOOT_ASPECTS_HI : DASHAKOOT_ASPECTS_EN;
    doc.setFontSize(7.5);
    for (const attr of attrs) {
      if (aspY > 276) break;
      const name = lang === "hi" ? attr.hi : attr.en;
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.setFont("helvetica", "bold");
      doc.text(`${name}: `, 18, aspY);
      const nameWidth = doc.getTextWidth(`${name}: `);

      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      const remainingText = aspects[attr.key] || "";
      const lines = doc.splitTextToSize(remainingText, w - 38 - nameWidth);
      if (lines.length > 0) {
        doc.text(lines[0], 18 + nameWidth, aspY);
        if (lines.length > 1) {
          doc.text(lines.slice(1, 3), 18, aspY + 4);
          aspY += (lines.length - 1) * 3.8;
        }
      }
      aspY += 5.5;
    }
  }
}

// ═══════════════════════════════════════════════
//  PAGE 14 — DASHAKOOT MATCHING TABLE + BAR CHART
// ═══════════════════════════════════════════════
export function renderDashakootTablePage(
  doc: jsPDF,
  labels: Labels,
  lang: string,
  matchDashakoot: any,
  matchAshtakoot: any,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, labels.dashakootMatching);

  const w = doc.internal.pageSize.getWidth();
  let y = 34;

  // Build table data from API response
  const data = matchDashakoot || matchAshtakoot || {};
  const attrs = DASHAKOOT_ATTRIBUTES;

  // Build rows
  const rows: string[][] = [];
  let totalReceived = 0;
  let totalMax = 0;

  const scoreMap: Record<string, { received: number; total: number }> = {};

  for (const attr of attrs) {
    const key = attr.key;
    const attrData = data[key] || data[attr.en?.toLowerCase()] || {};
    const maleVal = String(
      attrData.male_koota || attrData.male || attrData.boy || "N/A",
    );
    const femaleVal = String(
      attrData.female_koota || attrData.female || attrData.girl || "N/A",
    );
    const total = parseFloat(
      String(
        attrData.total_points || attrData.total || attrData.max_points || 0,
      ),
    );
    const received = parseFloat(
      String(
        attrData.received_points || attrData.obtained || attrData.received || 0,
      ),
    );

    totalMax += total;
    totalReceived += received;
    scoreMap[key] = { received, total };

    rows.push([
      lang === "hi" ? attr.hi : attr.en,
      maleVal,
      femaleVal,
      String(total || "-"),
      String(received || "-"),
    ]);
  }

  // Use top-level total if available
  if (data.total || data.score || data.total_points) {
    totalReceived = parseFloat(
      String(data.total || data.score || data.total_points || totalReceived),
    );
  }
  if (data.maximum || data.max || data.max_points) {
    totalMax = parseFloat(
      String(data.maximum || data.max || data.max_points || totalMax || 36),
    );
  }
  if (totalMax === 0) totalMax = 36;

  // Total row
  rows.push([labels.total, "", "", String(totalMax), String(totalReceived)]);

  autoTable(doc, {
    startY: y,
    head: [
      [
        labels.attributes,
        labels.male,
        labels.female,
        labels.total,
        labels.received,
      ],
    ],
    body: rows,
    theme: "grid",
    styles: { fontSize: 7.5, cellPadding: 2.5, halign: "center" },
    headStyles: {
      fillColor: [COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    columnStyles: {
      0: { halign: "left", fontStyle: "bold", cellWidth: 45 },
    },
    margin: { left: 14, right: 14 },
    willDrawCell: (data: any) => {
      // Highlight total row
      if (data.row.index === rows.length - 1 && data.section === "body") {
        doc.setFillColor(
          COLORS.primary[0],
          COLORS.primary[1],
          COLORS.primary[2],
        );
        doc.setTextColor(255, 255, 255);
      }
    },
  });

  // Total score summary
  let afterTableY = (doc as any).lastAutoTable?.finalY || 180;
  afterTableY += 6;

  doc.setFillColor(255, 248, 230);
  doc.roundedRect(14, afterTableY, w - 28, 16, 3, 3, "F");
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(0.5);
  doc.roundedRect(14, afterTableY, w - 28, 16, 3, 3, "S");

  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${labels.totalScore}: ${totalReceived} ${labels.outOf36}`,
    w / 2,
    afterTableY + 10,
    { align: "center" },
  );

  // ── BAR CHART ──
  afterTableY += 24;
  if (afterTableY < 210) {
    const chartX = 25;
    const chartW = w - 50;
    const chartH = 55;
    const barCount = attrs.length;
    const barW = Math.min(12, (chartW - barCount * 2) / barCount);
    const barGap = (chartW - barW * barCount) / (barCount + 1);
    const maxVal = 100;

    // Y-axis
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(chartX, afterTableY, chartX, afterTableY + chartH);
    doc.line(
      chartX,
      afterTableY + chartH,
      chartX + chartW,
      afterTableY + chartH,
    );

    // Y-axis labels
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    for (let v = 0; v <= 100; v += 25) {
      const yPos = afterTableY + chartH - (v / maxVal) * chartH;
      doc.text(String(v), chartX - 3, yPos + 1.5, { align: "right" });
      if (v > 0) {
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.2);
        doc.line(chartX + 1, yPos, chartX + chartW, yPos);
      }
    }

    // Bars
    for (let i = 0; i < barCount; i++) {
      const attr = attrs[i];
      const score = scoreMap[attr.key];
      const percentage =
        score && score.total > 0 ? (score.received / score.total) * 100 : 0;
      const barH = (percentage / maxVal) * chartH;
      const bx = chartX + barGap + i * (barW + barGap);
      const by = afterTableY + chartH - barH;

      const color = DASHAKOOT_COLORS[attr.key] || [100, 100, 100];
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(bx, by, barW, barH, 1, 1, "F");

      // Value on top
      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFontSize(5);
      doc.setFont("helvetica", "bold");
      doc.text(`${Math.round(percentage)}%`, bx + barW / 2, by - 2, {
        align: "center",
      });

      // X-axis label
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(4.5);
      doc.setFont("helvetica", "normal");
      const shortName = (lang === "hi" ? attr.hi : attr.en).substring(0, 6);
      doc.text(shortName, bx + barW / 2, afterTableY + chartH + 5, {
        align: "center",
      });
    }
  }
}

// ═══════════════════════════════════════════════
//  PAGE 15 — RAJJU DOSHA
// ═══════════════════════════════════════════════
export function renderRajjuDoshaPage(
  doc: jsPDF,
  labels: Labels,
  lang: string,
  rajjuData: any,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, labels.whatIsRajju);

  const w = doc.internal.pageSize.getWidth();
  let y = 36;

  // Description
  const desc = lang === "hi" ? RAJJU_DESC_HI : RAJJU_DESC_EN;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(desc, w - 36);
  doc.text(descLines, 20, y);
  y += descLines.length * 4.2 + 14;

  // Analysis center card
  const hasRajju =
    rajjuData?.has_rajju_dosha ??
    rajjuData?.rajju_dosha ??
    rajjuData?.is_piyadhipati ??
    false;
  const isPresent =
    hasRajju === true || hasRajju === "true" || hasRajju === "Yes";

  doc.setFillColor(
    isPresent ? 255 : 240,
    isPresent ? 240 : 255,
    isPresent ? 240 : 240,
  );
  doc.roundedRect(w / 2 - 65, y, 130, 60, 5, 5, "F");
  doc.setDrawColor(
    isPresent ? 220 : 60,
    isPresent ? 50 : 150,
    isPresent ? 50 : 60,
  );
  doc.setLineWidth(1.2);
  doc.roundedRect(w / 2 - 65, y, 130, 60, 5, 5, "S");

  // Subtitle
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(labels.rajjuAnalysis, w / 2, y + 10, { align: "center" });

  // Indicator
  doc.setFontSize(24);
  doc.text(isPresent ? "\u2639" : "\u263A", w / 2, y + 30, {
    align: "center",
  });

  // Status
  doc.setTextColor(
    isPresent ? 200 : 40,
    isPresent ? 50 : 140,
    isPresent ? 50 : 40,
  );
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(isPresent ? labels.present : labels.notPresent, w / 2, y + 44, {
    align: "center",
  });

  y += 68;

  // Description paragraph
  const report =
    rajjuData?.report || rajjuData?.rajju_report || rajjuData?.description;
  if (report) {
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const reportText = Array.isArray(report)
      ? report.join("\n\n")
      : String(report);
    const rLines = doc.splitTextToSize(reportText, w - 40);
    doc.text(rLines.slice(0, 12), 22, y);
  }
}

// ═══════════════════════════════════════════════
//  PAGE 16 — PAPASAMYAM
// ═══════════════════════════════════════════════
export function renderPapasamyamPage(
  doc: jsPDF,
  labels: Labels,
  lang: string,
  maleName: string,
  femaleName: string,
  papasamyamData: any,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, labels.papasamyam);

  const w = doc.internal.pageSize.getWidth();
  let y = 34;

  // Description
  const desc = lang === "hi" ? PAPASAMYAM_DESC_HI : PAPASAMYAM_DESC_EN;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(desc, w - 32);
  doc.text(descLines, 18, y);
  y += descLines.length * 4.2 + 8;

  const mPapa =
    papasamyamData?.male_piyadhipati ||
    papasamyamData?.boy_piyadhipati ||
    papasamyamData?.male ||
    {};
  const fPapa =
    papasamyamData?.female_piyadhipati ||
    papasamyamData?.girl_piyadhipati ||
    papasamyamData?.female ||
    {};

  const papaRow = (data: any, planet: string) => {
    const p = data?.[planet.toLowerCase()] || data?.[planet] || {};
    return [
      planet,
      String(p.from_piyadhipati || p.from_ascendant || p.ascendant || "0"),
      String(p.from_moon || p.moon || "0"),
      String(p.from_venus || p.venus || "0"),
    ];
  };

  const planets = ["Sun", "Mars", "Saturn", "Rahu"];
  const makeTotal = (data: any) => {
    const t = data?.total || data?.Total || {};
    return [
      labels.total,
      String(t.from_piyadhipati || t.from_ascendant || t.ascendant || "0"),
      String(t.from_moon || t.moon || "0"),
      String(t.from_venus || t.venus || "0"),
    ];
  };

  // Male Papa Points Table
  doc.setTextColor(60, 80, 140);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${maleName} - ${labels.papaPoints}`, 14, y);
  y += 3;

  const maleRows = [...planets.map((p) => papaRow(mPapa, p)), makeTotal(mPapa)];
  autoTable(doc, {
    startY: y,
    head: [
      [
        labels.papaPoints,
        labels.fromAscendant,
        labels.fromMoon,
        labels.fromVenus,
      ],
    ],
    body: maleRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2.5, halign: "center" },
    headStyles: {
      fillColor: [60, 80, 140],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    margin: { left: 14, right: 14 },
    willDrawCell: (data: any) => {
      if (data.row.index === maleRows.length - 1 && data.section === "body") {
        doc.setFillColor(240, 248, 255);
        doc.setFont("helvetica", "bold");
      }
    },
  });

  y = ((doc as any).lastAutoTable?.finalY || y + 50) + 12;

  // Female Papa Points Table
  doc.setTextColor(140, 50, 80);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${femaleName} - ${labels.papaPoints}`, 14, y);
  y += 3;

  const femaleRows = [
    ...planets.map((p) => papaRow(fPapa, p)),
    makeTotal(fPapa),
  ];
  autoTable(doc, {
    startY: y,
    head: [
      [
        labels.papaPoints,
        labels.fromAscendant,
        labels.fromMoon,
        labels.fromVenus,
      ],
    ],
    body: femaleRows,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2.5, halign: "center" },
    headStyles: {
      fillColor: [140, 50, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    margin: { left: 14, right: 14 },
    willDrawCell: (data: any) => {
      if (data.row.index === femaleRows.length - 1 && data.section === "body") {
        doc.setFillColor(255, 240, 245);
        doc.setFont("helvetica", "bold");
      }
    },
  });

  // Summary
  y = ((doc as any).lastAutoTable?.finalY || y + 50) + 8;
  if (y < 260) {
    const summary =
      papasamyamData?.conclusion ||
      papasamyamData?.report ||
      papasamyamData?.papa_status;
    if (summary) {
      doc.setFillColor(250, 248, 240);
      doc.roundedRect(18, y, w - 36, 20, 3, 3, "F");
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const sLines = doc.splitTextToSize(String(summary), w - 48);
      doc.text(sLines.slice(0, 4), 24, y + 6);
    }
  }
}

// ═══════════════════════════════════════════════
//  PAGE 17 — PERSONALITY REPORT
// ═══════════════════════════════════════════════
export function renderPersonalityPage(
  doc: jsPDF,
  labels: Labels,
  maleName: string,
  femaleName: string,
  maleData: Record<string, any>,
  femaleData: Record<string, any>,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, labels.personalityReport);

  const w = doc.internal.pageSize.getWidth();
  const colW = (w - 38) / 2;
  let y = 36;

  // Male column (left)
  doc.setFillColor(240, 248, 255);
  doc.roundedRect(14, y, colW, 230, 4, 4, "F");
  doc.setDrawColor(60, 80, 140);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, colW, 230, 4, 4, "S");

  doc.setFillColor(60, 80, 140);
  doc.roundedRect(14, y, colW, 14, 4, 4, "F");
  doc.rect(14, y + 6, colW, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(maleName, 14 + colW / 2, y + 9, { align: "center" });

  const mReport = maleData.general_ascendant_report;
  const mText =
    mReport?.report ||
    mReport?.general_report ||
    mReport?.ascendant_report ||
    (Array.isArray(mReport)
      ? mReport.map((r: any) => String(r.report || r)).join("\n\n")
      : String(mReport || "N/A"));
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  const mLines = doc.splitTextToSize(String(mText), colW - 10);
  doc.text(mLines.slice(0, 55), 18, y + 22);

  // Female column (right)
  const fX = w / 2 + 5;
  doc.setFillColor(255, 240, 245);
  doc.roundedRect(fX, y, colW, 230, 4, 4, "F");
  doc.setDrawColor(140, 50, 80);
  doc.setLineWidth(0.5);
  doc.roundedRect(fX, y, colW, 230, 4, 4, "S");

  doc.setFillColor(140, 50, 80);
  doc.roundedRect(fX, y, colW, 14, 4, 4, "F");
  doc.rect(fX, y + 6, colW, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(femaleName, fX + colW / 2, y + 9, { align: "center" });

  const fReport = femaleData.general_ascendant_report;
  const fText =
    fReport?.report ||
    fReport?.general_report ||
    fReport?.ascendant_report ||
    (Array.isArray(fReport)
      ? fReport.map((r: any) => String(r.report || r)).join("\n\n")
      : String(fReport || "N/A"));
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  const fLines = doc.splitTextToSize(String(fText), colW - 10);
  doc.text(fLines.slice(0, 55), fX + 4, y + 22);
}

// ═══════════════════════════════════════════════
//  PAGE 18 — TRAITS & CHARACTERISTICS
// ═══════════════════════════════════════════════
export function renderTraitsPage(
  doc: jsPDF,
  labels: Labels,
  lang: string,
  maleName: string,
  femaleName: string,
  maleData: Record<string, any>,
  femaleData: Record<string, any>,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, labels.traitsTitle);

  const w = doc.internal.pageSize.getWidth();
  let y = 36;

  // Extract traits from ascendant reports
  const extractTraits = (
    data: Record<string, any>,
  ): { positive: string[]; negative: string[] } => {
    const report = data.general_ascendant_report || {};
    const pos =
      report.positive_traits || report.strengths || report.positive || [];
    const neg =
      report.negative_traits || report.weaknesses || report.negative || [];
    return {
      positive: Array.isArray(pos)
        ? pos.map((t: any) => String(t))
        : typeof pos === "string"
          ? pos.split(",").map((s: string) => s.trim())
          : [],
      negative: Array.isArray(neg)
        ? neg.map((t: any) => String(t))
        : typeof neg === "string"
          ? neg.split(",").map((s: string) => s.trim())
          : [],
    };
  };

  const mTraits = extractTraits(maleData);
  const fTraits = extractTraits(femaleData);

  const colW = (w - 38) / 2;

  // ── POSITIVE TRAITS ──
  addSectionTitle(doc, labels.positiveTraits, y);
  y += 10;

  // Male positive
  doc.setFillColor(240, 255, 240);
  doc.roundedRect(14, y, colW, 80, 3, 3, "F");
  doc.setDrawColor(60, 140, 80);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, colW, 80, 3, 3, "S");

  doc.setFillColor(60, 140, 80);
  doc.roundedRect(14, y, colW, 12, 3, 3, "F");
  doc.rect(14, y + 5, colW, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(maleName, 14 + colW / 2, y + 8, { align: "center" });

  doc.setTextColor(60, 80, 60);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  if (mTraits.positive.length > 0) {
    mTraits.positive.slice(0, 10).forEach((t, i) => {
      doc.text(`\u2022 ${t}`, 18, y + 18 + i * 6);
    });
  } else {
    doc.text("Data not available", 18, y + 24);
  }

  // Female positive
  const fPosX = w / 2 + 5;
  doc.setFillColor(255, 240, 245);
  doc.roundedRect(fPosX, y, colW, 80, 3, 3, "F");
  doc.setDrawColor(140, 50, 80);
  doc.setLineWidth(0.5);
  doc.roundedRect(fPosX, y, colW, 80, 3, 3, "S");

  doc.setFillColor(140, 50, 80);
  doc.roundedRect(fPosX, y, colW, 12, 3, 3, "F");
  doc.rect(fPosX, y + 5, colW, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(femaleName, fPosX + colW / 2, y + 8, { align: "center" });

  doc.setTextColor(80, 50, 60);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  if (fTraits.positive.length > 0) {
    fTraits.positive.slice(0, 10).forEach((t, i) => {
      doc.text(`\u2022 ${t}`, fPosX + 4, y + 18 + i * 6);
    });
  } else {
    doc.text("Data not available", fPosX + 4, y + 24);
  }

  y += 90;

  // ── NEGATIVE TRAITS ──
  addSectionTitle(doc, labels.negativeTraits, y);
  y += 10;

  // Male negative
  doc.setFillColor(255, 245, 240);
  doc.roundedRect(14, y, colW, 80, 3, 3, "F");
  doc.setDrawColor(180, 80, 60);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, colW, 80, 3, 3, "S");

  doc.setFillColor(180, 80, 60);
  doc.roundedRect(14, y, colW, 12, 3, 3, "F");
  doc.rect(14, y + 5, colW, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(maleName, 14 + colW / 2, y + 8, { align: "center" });

  doc.setTextColor(120, 60, 50);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  if (mTraits.negative.length > 0) {
    mTraits.negative.slice(0, 10).forEach((t, i) => {
      doc.text(`\u2022 ${t}`, 18, y + 18 + i * 6);
    });
  } else {
    doc.text("Data not available", 18, y + 24);
  }

  // Female negative
  doc.setFillColor(255, 240, 245);
  doc.roundedRect(fPosX, y, colW, 80, 3, 3, "F");
  doc.setDrawColor(180, 80, 60);
  doc.setLineWidth(0.5);
  doc.roundedRect(fPosX, y, colW, 80, 3, 3, "S");

  doc.setFillColor(180, 80, 60);
  doc.roundedRect(fPosX, y, colW, 12, 3, 3, "F");
  doc.rect(fPosX, y + 5, colW, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(femaleName, fPosX + colW / 2, y + 8, { align: "center" });

  doc.setTextColor(120, 60, 50);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  if (fTraits.negative.length > 0) {
    fTraits.negative.slice(0, 10).forEach((t, i) => {
      doc.text(`\u2022 ${t}`, fPosX + 4, y + 18 + i * 6);
    });
  } else {
    doc.text("Data not available", fPosX + 4, y + 24);
  }
}

// ═══════════════════════════════════════════════
//  PAGE 19 — MATCH MAKING REPORT (Final)
// ═══════════════════════════════════════════════
export function renderMatchReportPage(
  doc: jsPDF,
  labels: Labels,
  lang: string,
  matchData: Record<string, any>,
  matchDashakoot: any,
  matchManglik: any,
) {
  doc.addPage();
  addPageBackground(doc);
  addPageHeader(doc, labels.matchReport);

  const w = doc.internal.pageSize.getWidth();
  let y = 38;
  const colW = (w - 38) / 2;

  // 2-column grid
  // Dashakoot Card
  doc.setFillColor(245, 245, 255);
  doc.roundedRect(14, y, colW, 90, 4, 4, "F");
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(14, y, colW, 90, 4, 4, "S");

  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.roundedRect(14, y, colW, 14, 4, 4, "F");
  doc.rect(14, y + 6, colW, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(labels.dashakootSummary, 14 + colW / 2, y + 10, { align: "center" });

  const dashakootScore =
    matchDashakoot?.total ||
    matchDashakoot?.score ||
    matchDashakoot?.total_points ||
    "N/A";
  const dashakootMax =
    matchDashakoot?.maximum ||
    matchDashakoot?.max ||
    matchDashakoot?.max_points ||
    36;
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`${dashakootScore}/${dashakootMax}`, 14 + colW / 2, y + 38, {
    align: "center",
  });

  const dashDesc =
    matchDashakoot?.report ||
    matchDashakoot?.conclusion ||
    matchDashakoot?.description ||
    "";
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  const ddLines = doc.splitTextToSize(String(dashDesc), colW - 12);
  doc.text(ddLines.slice(0, 8), 20, y + 50);

  // Manglik Card
  const fX = w / 2 + 5;
  doc.setFillColor(255, 245, 245);
  doc.roundedRect(fX, y, colW, 90, 4, 4, "F");
  doc.setDrawColor(200, 50, 50);
  doc.setLineWidth(0.8);
  doc.roundedRect(fX, y, colW, 90, 4, 4, "S");

  doc.setFillColor(200, 50, 50);
  doc.roundedRect(fX, y, colW, 14, 4, 4, "F");
  doc.rect(fX, y + 6, colW, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(labels.manglikSummary, fX + colW / 2, y + 10, { align: "center" });

  const manglikResult =
    matchManglik?.conclusion ||
    matchManglik?.report ||
    matchManglik?.manglik_report ||
    "N/A";
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  const mrText = Array.isArray(manglikResult)
    ? manglikResult.join(". ")
    : String(manglikResult);
  const mrLines = doc.splitTextToSize(mrText, colW - 12);
  doc.text(mrLines.slice(0, 12), fX + 6, y + 24);

  y += 100;

  // Match Conclusion
  addSectionTitle(doc, labels.matchConclusion, y);
  y += 10;

  const conclusion =
    matchData?.match_making_report?.conclusion ||
    matchData?.match_making_report?.report ||
    matchData?.match_making_report?.compatibility_report ||
    matchData?.match_making_report ||
    (lang === "hi"
      ? "कुंडली मिलान के आधार पर, दोनों कुंडलियों का विश्लेषण किया गया है। अनुकूलता स्कोर और विभिन्न दोषों के विश्लेषण के आधार पर यह रिपोर्ट तैयार की गई है।"
      : "Based on the Kundli matching analysis, both horoscopes have been examined. This report has been prepared based on the compatibility score and analysis of various doshas.");

  doc.setFillColor(250, 248, 242);
  doc.roundedRect(14, y, w - 28, 70, 4, 4, "F");
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, w - 28, 70, 4, 4, "S");

  // Decorative left border
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.roundedRect(14, y, 4, 70, 2, 2, "F");

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const concText =
    typeof conclusion === "object"
      ? JSON.stringify(conclusion)
      : String(conclusion);
  const cLines = doc.splitTextToSize(concText, w - 52);
  doc.text(cLines.slice(0, 14), 24, y + 10);
}

// ═══════════════════════════════════════════════
//  PAGE 20 — BACK COVER (Thank You)
// ═══════════════════════════════════════════════
export function renderBackCover(doc: jsPDF, labels: Labels, lang: string) {
  doc.addPage();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Dark background
  doc.setFillColor(20, 15, 40);
  doc.rect(0, 0, w, h, "F");

  // Decorative top accent
  doc.setFillColor(180, 120, 60);
  doc.rect(0, 0, w, 4, "F");

  // Thank You
  doc.setTextColor(255, 215, 100);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(labels.thankYou, w / 2, h / 2 - 30, { align: "center" });

  // Decorative line
  doc.setDrawColor(180, 120, 60);
  doc.setLineWidth(0.8);
  doc.line(w / 2 - 40, h / 2 - 20, w / 2 + 40, h / 2 - 20);

  // Blessing quote
  doc.setTextColor(200, 190, 170);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const quoteLines = doc.splitTextToSize(labels.blessingQuote, w - 60);
  doc.text(quoteLines, w / 2, h / 2 - 8, { align: "center" });

  // Star symbol
  doc.setTextColor(180, 120, 60);
  doc.setFontSize(18);
  doc.text("\u2726 \u2605 \u2726", w / 2, h / 2 + 20, { align: "center" });

  // Brand
  doc.setTextColor(150, 140, 130);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Powered by Vedic Astrology", w / 2, h - 40, { align: "center" });

  // Bottom accent
  doc.setFillColor(180, 120, 60);
  doc.rect(0, h - 4, w, 4, "F");
}
