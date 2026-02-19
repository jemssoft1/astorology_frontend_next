/* eslint-disable @typescript-eslint/no-explicit-any */
// pdf-pages-2.ts — Profiles (Ascendant, Planets, Houses, Aspects) & Back Cover

import { jsPDF } from "jspdf";
import { COLORS, TEXT } from "./constants";
import { addPageBackground, safeFixed } from "./helpers";

// Helper to check for content and return fallback if empty
function getContent(text: any, fallback: string): string {
  if (!text || (typeof text === "string" && text.trim() === "")) {
    return fallback;
  }
  return String(text);
}

// ═══════════════════════════════════════════════
//  ASCENDANT PROFILE
// ═══════════════════════════════════════════════
export function renderAscendantProfile(doc: jsPDF, ascendantData: any) {
  doc.addPage();
  addPageBackground(doc);
  const w = doc.internal.pageSize.getWidth();
  let y = 30;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(`${ascendantData.sign} Ascendant`, 20, y);
  y += 10;

  doc.setFontSize(14);
  doc.setTextColor(
    COLORS.secondary[0],
    COLORS.secondary[1],
    COLORS.secondary[2],
  );
  doc.text("Your Rising Sign & Personality Mask", 20, y);
  y += 20;

  // Report Body
  doc.setFontSize(11);
  doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
  doc.setFont("helvetica", "normal");

  const report = getContent(
    ascendantData.report,
    "Your Ascendant sign represents the mask you wear and your first impression on others.",
  );
  const lines = doc.splitTextToSize(report, w - 40);
  doc.text(lines, 20, y);
}

// ═══════════════════════════════════════════════
//  PLANET PROFILES
// ═══════════════════════════════════════════════
export function renderPlanetProfiles(doc: jsPDF, planets: any) {
  // We iterate through available planets in the 'planets' object
  const planetList = [
    "Sun",
    "Moon",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
    "Chiron",
    "Node",
    "Lilith",
  ];

  planetList.forEach((pName) => {
    // Check if we have data for this planet
    const pData = planets[pName]; // e.g. { sign_report: ..., house_report: ... }
    if (!pData) return;

    doc.addPage();
    addPageBackground(doc);
    const w = doc.internal.pageSize.getWidth();
    let y = 30;

    // Title
    doc.setFontSize(24);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setFont("helvetica", "bold");
    doc.text(`${pName} Profile`, 20, y);
    y += 15;

    // Sign Section
    doc.setFontSize(16);
    doc.setTextColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.text("Sign Placement", 20, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    const signReport = getContent(pData.sign_report, TEXT.fallback.planet);
    const sLines = doc.splitTextToSize(signReport, w - 40);
    doc.text(sLines, 20, y);
    y += sLines.length * 6 + 15;

    // House Section
    if (y > 250) {
      doc.addPage();
      addPageBackground(doc);
      y = 30;
    }

    doc.setFontSize(16);
    doc.setTextColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.text("House Placement", 20, y);
    y += 10;

    doc.setFontSize(11);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    const houseReport = getContent(pData.house_report, TEXT.fallback.planet);
    const hLines = doc.splitTextToSize(houseReport, w - 40);
    doc.text(hLines, 20, y);
  });
}

// ═══════════════════════════════════════════════
//  HOUSE PROFILES
// ═══════════════════════════════════════════════
export function renderHouseProfiles(doc: jsPDF, houseData: any[]) {
  // Expecting array of 12 house objects with 'report' or similar
  // The 'house_cusps_report' endpoint likely returns a list or object keyed by house number

  // If houseData is array, iterate
  if (Array.isArray(houseData)) {
    houseData.forEach((h, i) => {
      doc.addPage();
      addPageBackground(doc);
      const w = doc.internal.pageSize.getWidth();
      let y = 30;

      // Title
      doc.setFontSize(24);
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.setFont("helvetica", "bold");
      doc.text(`House ${i + 1}`, 20, y);
      y += 15;

      // Static Description of House Meaning
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "italic");
      const desc = TEXT.houseDescriptions[i] || "";
      const dLines = doc.splitTextToSize(desc, w - 40);
      doc.text(dLines, 20, y);
      y += dLines.length * 6 + 20;

      // Report
      doc.setFontSize(14);
      doc.setTextColor(
        COLORS.secondary[0],
        COLORS.secondary[1],
        COLORS.secondary[2],
      );
      doc.setFont("helvetica", "bold");
      doc.text("Interpretation", 20, y);
      y += 10;

      doc.setFontSize(11);
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.setFont("helvetica", "normal");

      const report = getContent(
        h?.report || h?.description,
        TEXT.fallback.emptyHouse,
      );
      const rLines = doc.splitTextToSize(report, w - 40);
      doc.text(rLines, 20, y);
    });
  }
}

// ═══════════════════════════════════════════════
//  ASPECT PROFILES
// ═══════════════════════════════════════════════
export function renderAspectProfiles(doc: jsPDF, aspects: any[]) {
  // Group aspects? Or just list them. One page per major aspect might be too much if there are 20+ aspects.
  // Let's put 2-3 per page to be efficient but still "premium".

  if (!aspects || !aspects.length) return;

  doc.addPage();
  addPageBackground(doc);
  let y = 30;
  const w = doc.internal.pageSize.getWidth();

  doc.setFontSize(24);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Aspect Interpretations", 20, y);
  y += 20;

  aspects.forEach((aspect: any) => {
    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      addPageBackground(doc);
      y = 30;
    }

    // Aspect Title
    doc.setFontSize(14);
    doc.setTextColor(
      COLORS.secondary[0],
      COLORS.secondary[1],
      COLORS.secondary[2],
    );
    doc.setFont("helvetica", "bold");
    doc.text(`${aspect.planet1} ${aspect.aspect} ${aspect.planet2}`, 20, y);
    y += 8;

    // Subtitle (Orb)
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "italic");
    doc.setFont("helvetica", "italic");
    doc.text(`Orb: ${safeFixed(aspect.orb)}°`, 20, y);
    y += 10;
    y += 10;

    // Description
    doc.setFontSize(11);
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFont("helvetica", "normal");

    // API might not return text for aspects, so we use a generic generated text or fallback
    // If aspect.report exists, use it. Else fallback.
    const text = getContent(aspect.report, TEXT.fallback.aspect);
    const lines = doc.splitTextToSize(text, w - 40);
    doc.text(lines, 20, y);

    y += lines.length * 6 + 15;

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.line(20, y - 5, w - 20, y - 5);
    y += 10;
  });
}

// ═══════════════════════════════════════════════
//  BACK COVER
// ═══════════════════════════════════════════════
export function renderBackCover(doc: jsPDF) {
  doc.addPage();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Dark background
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.rect(0, 0, w, h, "F");

  // Center Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text("Thank You", w / 2, h / 2 - 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("May the stars guide your path.", w / 2, h / 2, { align: "center" });

  // Footer branding
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Generated by JemsOfTech Astro Engine", w / 2, h - 30, {
    align: "center",
  });
}
