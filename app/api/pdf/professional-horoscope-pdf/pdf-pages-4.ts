// pdf-pages-4.ts — Pages 48–66+: Planet Profiles (Cover + 9 planets × 2 pages)

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { COLORS, PLANET_PROFILES, ZODIAC_SIGNS } from "./constants";
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
//  PAGE 48: PLANET PROFILES COVER
// ═══════════════════════════════════════════════════════════
export function renderPlanetProfileCover(doc: jsPDF, lang: string, L: Labels) {
  doc.addPage();
  addPageBackground(doc);

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Decorative border
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(2);
  doc.rect(15, 15, w - 30, h - 30);
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(0.5);
  doc.rect(18, 18, w - 36, h - 36);

  // Corner decorations
  drawCornerDecoration(doc, 20, 20, COLORS.secondary);
  drawCornerDecoration(doc, w - 20, 20, COLORS.secondary, true);
  drawCornerDecoration(doc, 20, h - 20, COLORS.secondary, false, true);
  drawCornerDecoration(doc, w - 20, h - 20, COLORS.secondary, true, true);

  // Decorative line at top
  const midY = h / 2 - 30;
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(1.5);
  doc.line(w / 2 - 50, midY, w / 2 + 50, midY);

  // Title
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text(L.yourPlanetProfiles, w / 2, midY + 25, { align: "center" });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.text(L.planetProfileCoverSubtitle, w / 2, midY + 40, {
    align: "center",
  });

  // Decorative line at bottom
  doc.setDrawColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.setLineWidth(1.5);
  doc.line(w / 2 - 50, midY + 55, w / 2 + 50, midY + 55);

  // Planet list
  const planetsY = midY + 75;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  PLANET_PROFILES.forEach((pp, idx) => {
    const name = lang === "hi" ? pp.nameHi : pp.name;
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const px = w / 2 - 60 + col * 55;
    const py = planetsY + row * 15;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(`${idx + 1}. ${name}`, px, py);
  });
}

// ═══════════════════════════════════════════════════════════
//  PAGES 49–66: INDIVIDUAL PLANET PROFILES (9 × 2 pages)
// ═══════════════════════════════════════════════════════════
export function renderPlanetProfilePages(
  doc: jsPDF,
  apiData: Record<string, any>,
  planetsData: any[],
  lang: string,
  L: Labels,
) {
  PLANET_PROFILES.forEach((pp) => {
    const planetReport = apiData[`planet_report_${pp.apiKey}`];
    const planetInfo = Array.isArray(planetsData)
      ? planetsData.find(
          (p: any) => (p.name || p.planet || "").toLowerCase() === pp.apiKey,
        )
      : null;

    // ── Page A: Planet Overview ──
    doc.addPage();
    addPageBackground(doc);

    const planetName = lang === "hi" ? pp.nameHi : pp.name;
    addPageHeader(doc, `${planetName} ${L.inYourHoroscope}`);

    const w = doc.internal.pageSize.getWidth();
    let y = 35;

    // Introduction paragraph
    const intro = lang === "hi" ? pp.introHi : pp.intro;
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    const introLines = doc.splitTextToSize(intro, 170);
    doc.text(introLines, 14, y);
    y += introLines.length * 4.5 + 8;

    // 3×2 info grid
    const gridInfo = [
      {
        label: L.zodiacSign,
        value: planetInfo
          ? ZODIAC_SIGNS[(planetInfo.sign || 1) - 1] ||
            safeVal(planetInfo, "sign")
          : "N/A",
      },
      {
        label: L.degree,
        value: planetInfo?.fullDegree
          ? `${Math.floor(planetInfo.fullDegree)}° ${Math.floor((planetInfo.fullDegree % 1) * 60)}'`
          : safeVal(planetInfo, "normDegree", "local_degree"),
      },
      {
        label: L.nakshatra,
        value: safeVal(planetInfo, "nakshatra"),
      },
      {
        label: L.houseLord,
        value: safeVal(planetInfo, "sign_lord"),
      },
      {
        label: L.currentHouse,
        value: safeVal(planetInfo, "house"),
      },
      {
        label: L.combustAwastha,
        value:
          planetInfo?.isRetro === "true" || planetInfo?.isRetro === true
            ? lang === "hi"
              ? "Vakri"
              : "Retrograde"
            : lang === "hi"
              ? "Margi"
              : "Direct",
      },
    ];

    const gridColW = 55;
    const gridRowH = 28;
    const gridStartX = 14;

    gridInfo.forEach((item, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const gx = gridStartX + col * (gridColW + 6);
      const gy = y + row * (gridRowH + 4);

      // Card
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(
        COLORS.chartLine[0],
        COLORS.chartLine[1],
        COLORS.chartLine[2],
      );
      doc.setLineWidth(0.5);
      doc.roundedRect(gx, gy, gridColW, gridRowH, 2, 2, "FD");

      // Label
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(
        COLORS.lightText[0],
        COLORS.lightText[1],
        COLORS.lightText[2],
      );
      doc.text(item.label, gx + 4, gy + 9);

      // Value
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      const valText =
        item.value.length > 12
          ? item.value.substring(0, 12) + "..."
          : item.value;
      doc.text(valText, gx + 4, gy + 20);
    });

    y += 2 * (gridRowH + 4) + 10;

    // Status indicator
    if (planetReport) {
      const status = planetReport.planet_status || planetReport.status || "";
      if (status) {
        const statusColor =
          status.toLowerCase().includes("friend") ||
          status.toLowerCase().includes("exalt")
            ? [0, 128, 0]
            : status.toLowerCase().includes("enemy") ||
                status.toLowerCase().includes("debil")
              ? [200, 0, 0]
              : COLORS.primary;

        doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.roundedRect(14, y, 170, 14, 2, 2, "F");
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(`${planetName}: ${status}`, w / 2, y + 9, { align: "center" });
        y += 22;
      }
    }

    // House description from planet report
    if (planetReport) {
      const houseReport =
        planetReport.report ||
        planetReport.house_report ||
        planetReport.description ||
        "";
      if (houseReport) {
        y = addSectionTitle(
          doc,
          `${planetName} ${L.isInHouse} ${safeVal(planetInfo, "house")}`,
          y,
        );
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
        const houseLines = doc.splitTextToSize(houseReport, 170);
        // Limit to fit on page
        const maxLines = Math.min(houseLines.length, 20);
        doc.text(houseLines.slice(0, maxLines), 14, y);
        y += maxLines * 4;
      }
    }

    // ── Page B: Planet Report Continuation + Mantra ──
    doc.addPage();
    addPageBackground(doc);
    addPageHeader(
      doc,
      `${planetName} — ${lang === "hi" ? "Vistrit Report" : "Detailed Report"}`,
    );

    y = 35;

    // Continued report text
    if (planetReport) {
      const fullReport =
        planetReport.report ||
        planetReport.house_report ||
        planetReport.description ||
        "";
      if (fullReport) {
        const allLines = doc.splitTextToSize(fullReport, 170);
        if (allLines.length > 20) {
          const continuedLines = allLines.slice(20);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
          const displayLines = continuedLines.slice(
            0,
            Math.min(continuedLines.length, 35),
          );
          doc.text(displayLines, 14, y);
          y += displayLines.length * 4 + 8;
        }
      }

      // Sign report
      const signReport = planetReport.sign_report || "";
      if (signReport) {
        y = addSectionTitle(
          doc,
          `${planetName} in ${safeVal(planetInfo, "sign") || ""}`,
          y,
        );
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
        const signLines = doc.splitTextToSize(signReport, 170);
        const maxSignLines = Math.min(signLines.length, 20);
        doc.text(signLines.slice(0, maxSignLines), 14, y);
        y += maxSignLines * 4 + 8;
      }
    }

    // Mantra section
    const mantraText = lang === "hi" ? pp.mantraHi : pp.mantra;
    if (y < 230) {
      y = Math.max(y, 200);
    }

    // Mantra box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.setLineWidth(1.5);
    doc.roundedRect(30, y, w - 60, 30, 3, 3, "FD");

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(L.mantra, w / 2, y + 10, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.text(mantraText, w / 2, y + 22, { align: "center" });
  });
}
