/* eslint-disable @typescript-eslint/no-explicit-any */
// pdf-pages-2.ts — Profiles (Ascendant, Planets, Houses, Aspects) & Back Cover

import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";
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

  const sign = ascendantData.ascendant || ascendantData.sign || "Unknown";

  // Title
  doc.setFontSize(22);
  doc.setTextColor(110, 120, 140); // Soft greyish blue
  doc.setFont("helvetica", "bold");
  doc.text(`${sign} Ascendant`, w / 2, 25, { align: "center" });

  doc.setDrawColor(210, 200, 190);
  doc.setLineWidth(0.5);
  doc.line(15, 32, w - 15, 32);

  y = 45;

  // Render Zodiac Image
  try {
    const imagePath = path.join(
      process.cwd(),
      "public",
      "basic_pdf_images",
      `${sign}.jpg`,
    );
    if (fs.existsSync(imagePath)) {
      const imgData = fs.readFileSync(imagePath).toString("base64");
      const imgW = 70;
      const imgH = 70;
      doc.addImage(imgData, "JPEG", (w - imgW) / 2, y, imgW, imgH);
      y += imgH + 15;
    } else {
      y += 10;
    }
  } catch {
    y += 10;
  }

  // Report Body (Split into paragraphs and styled blockquotes)
  const rawReport = getContent(
    ascendantData.report,
    "Your Ascendant sign represents the mask you wear and your first impression on others.",
  );

  const marginX = 25;
  const contentWidth = w - marginX * 2;

  const sentences = rawReport
    .split(". ")
    .filter((s) => s.trim().length > 0)
    .map((s) => (s.endsWith(".") ? s : s + "."));

  const paragraphs: string[] = [];
  let currentPara = "";

  // Group sentences into chunks
  for (let i = 0; i < sentences.length; i++) {
    currentPara += sentences[i] + " ";
    if (
      i === 1 ||
      i === 3 ||
      i === 6 ||
      i === 9 ||
      i === sentences.length - 1
    ) {
      paragraphs.push(currentPara.trim());
      currentPara = "";
    }
  }
  if (currentPara.trim()) paragraphs.push(currentPara.trim());

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  for (let i = 0; i < paragraphs.length; i++) {
    const isBlockquote = i === 2; // Make the 3rd paragraph a stylized blockquote

    if (isBlockquote && paragraphs[i].length > 20) {
      // --- Blockquote Styling matching Image 2 exactly ---
      const bqText = "  " + paragraphs[i]; // Add indent for quote icon
      const bqLines = doc.splitTextToSize(bqText, contentWidth - 15);
      const bqHeight = Math.max(25, bqLines.length * 6 + 15);

      if (y + bqHeight > 270) {
        doc.addPage();
        addPageBackground(doc);
        y = 30;
      }

      // Background
      doc.setFillColor(248, 248, 248); // Very light grey
      doc.rect(marginX, y, contentWidth, bqHeight, "F");

      // Left teal border
      doc.setFillColor(0, 140, 150); // Teal
      doc.rect(marginX, y, 2.5, bqHeight, "F");

      // Right teal border
      doc.rect(marginX + contentWidth - 2.5, y, 2.5, bqHeight, "F");

      // Quote icon
      doc.setFontSize(26);
      doc.setTextColor(110, 120, 130);
      doc.setFont("helvetica", "bold");
      doc.text('"', marginX + 8, y + 15);

      // Quote Text
      doc.setFontSize(12);
      doc.setTextColor(50, 70, 90);
      doc.setFont("helvetica", "normal");
      doc.text(bqLines, marginX + 16, y + 13);

      y += bqHeight + 12;
    } else {
      // --- Normal Paragraph Styling ---
      doc.setFontSize(10.5);
      doc.setTextColor(65, 65, 65); // Dark grey text
      doc.setFont("helvetica", "normal");

      const lines = doc.splitTextToSize(paragraphs[i], contentWidth);

      if (y + lines.length * 5 > 270) {
        doc.addPage();
        addPageBackground(doc);
        y = 30;
      }

      doc.text(lines, marginX, y);
      y += lines.length * 5.5 + 8;
    }
  }

  // Draw Lotus Image on the bottom
  try {
    const lotusPath = path.join(
      process.cwd(),
      "public",
      "basic_pdf_images",
      "ganesh.png",
    );
    if (fs.existsSync(lotusPath) && y < 240) {
      const imgData = fs.readFileSync(lotusPath).toString("base64");
      const imgW = 40;
      const imgH = 40;

      doc.setFillColor(242, 248, 238);
      doc.rect(marginX, y + 5, contentWidth, 30, "F");

      doc.addImage(imgData, "PNG", (w - imgW) / 2, y + 10, imgW, imgH);
    }
  } catch {
    // Ignore lotus error
  }
}
// ═══════════════════════════════════════════════
//  PLANET PROFILES
// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
//  PLANET PROFILES
// ═══════════════════════════════════════════════
export function renderPlanetProfiles(
  doc: jsPDF,
  planets: any,
  rawPlanets: any[],
) {
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
  ];

  // Static descriptions matching Image 1 & 2 layout features
  const PLANET_DESC: Record<string, string> = {
    Sun: "The SUN symbolises the ESSENTIAL SELF; the WILL; CONSCIOUSNESS; GROWTH; the EIGO; LIBIDO; OBJECTIVITY; INDIVIDUALITY; WHOLENESS; and the SPIRIT. It is the MASCULINE PRINCIPLE in contrast to that symbolised by the MOON. It is personified by RULERS; LEADERS; PUBLIC FIGURES; the FAMOUS; and PERSONALITIES.",
    Moon: "The MOON symbolises the EMOTIONS; the UNCONSCIOUS; HABITS; MEMORY; MOODS; RECEPTIVITY; INSTINCT; and the SOUL. It represents the FEMININE PRINCIPLE.",
  };

  const SIGN_DESC: Record<string, string> = {
    Pisces:
      "Pisces is a Water element, ruled by mystical Neptune! This sign is extremely receptive, nurturing, compassionate, and other-directed. Pisces feelings run very, very deep. A mutable nature endows Pisces with adaptable and unifying energy.",
  };

  const HOUSE_DESC: Record<string, string> = {
    "10": "The Tenth House is commonly referred to as the House of Social Status. It is about the place we have attained in our social (or work/career) grouping and in society as a whole. Think status, the authority it conveys, and consequently, the role we take in our community.",
    "1": "The First House represents the Self, physical appearance, and the personality mask you wear.",
  };

  const ROMAN_NUMERALS = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];

  planetList.forEach((pName) => {
    const pData = planets[pName];
    if (!pData) return;

    // Find planet in raw array to get its sign and house
    const rawP = rawPlanets?.find(
      (p) => p.name?.toLowerCase() === pName.toLowerCase(),
    );
    const signName = rawP?.sign || "Unknown";
    const houseNum = rawP?.house || "1";
    const houseText = `Tenth`; // Default or dynamically resolve
    const roman = ROMAN_NUMERALS[parseInt(houseNum) - 1] || "X";

    const w = doc.internal.pageSize.getWidth();

    // --------------------------------------------------------------------------------
    // PAGE A: Planet in Sign (Image 1 replica)
    // --------------------------------------------------------------------------------
    doc.addPage();
    addPageBackground(doc);
    let y = 30;

    // Title ("Sun in Pisces")
    doc.setFontSize(22);
    doc.setTextColor(50, 60, 110); // Dark Blueish Purple
    doc.setFont("helvetica", "bold");
    doc.text(`${pName} in ${signName}`, 20, y);
    y += 15;

    // Layout margins
    const marginX = 20;
    const contentW = w - marginX * 2;
    const boxW = 85;
    const textW = contentW - boxW - 10; // Left text width
    const rightBoxX = w - marginX - boxW;

    // Right Side: Sign Box (Image 1)
    const signBoxY = y;
    doc.setFillColor(242, 234, 246); // Light purple

    // Calculate box height dynamically based on text
    const signDesc =
      SIGN_DESC[signName] ||
      `${signName} brings its unique elemental energy to this placement.`;
    doc.setFontSize(11);
    const signDescLines = doc.splitTextToSize(signDesc, boxW - 10);
    const boxH = Math.max(45, signDescLines.length * 5 + 18);

    doc.rect(rightBoxX, signBoxY, boxW, boxH, "F");

    // Box Title
    doc.setFontSize(14);
    doc.setTextColor(50, 60, 110);
    doc.setFont("helvetica", "bold");
    doc.text(signName.toUpperCase(), rightBoxX + 5, signBoxY + 8);

    // Box Icon
    const iconMap: Record<string, string> = {
      Pisces: "c",
      Gemini: "d",
      Aries: "a",
      Taurus: "s",
    };
    const icon = iconMap[signName] || "";
    doc.setFontSize(18);
    doc.setTextColor(0, 140, 220); // Blue
    doc.text(icon, rightBoxX + boxW - 10, signBoxY + 9);

    // Box Text
    doc.setFontSize(11);
    doc.setTextColor(110, 80, 120);
    doc.setFont("helvetica", "italic");
    doc.text(signDescLines, rightBoxX + 5, signBoxY + 16);

    // Left Side: Report Text
    doc.setFontSize(10.5);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");

    const signReport = getContent(pData.sign_report, TEXT.fallback.planet);
    const sLines = doc.splitTextToSize(signReport, contentW);

    // We render the first few lines wrapped around the box, then full width.
    // For simplicity with jsPDF, we can just split the text into two chunks.
    const chunk1Lines = doc.splitTextToSize(signReport, textW);
    let currentY = y;

    // Just print as much as fits beside the box, then move below
    let chunk1Idx = 0;
    while (chunk1Idx < chunk1Lines.length && currentY < signBoxY + boxH + 5) {
      doc.text(chunk1Lines[chunk1Idx], marginX, currentY);
      currentY += 5.5;
      chunk1Idx++;
    }

    // Print remaining text full width
    const remainingText = signReport
      .replace(chunk1Lines.slice(0, chunk1Idx).join(" "), "")
      .trim();
    if (remainingText.length > 0) {
      const remainingLines = doc.splitTextToSize(remainingText, contentW);
      currentY = Math.max(currentY, signBoxY + boxH + 5);

      for (let i = 0; i < remainingLines.length; i++) {
        if (currentY > 270) {
          doc.addPage();
          addPageBackground(doc);
          currentY = 30;
        }
        doc.text(remainingLines[i], marginX, currentY);
        currentY += 5.5;
      }
    }

    // --------------------------------------------------------------------------------
    // PAGE B: Planet Profile & House (Image 2 replica)
    // --------------------------------------------------------------------------------
    doc.addPage();
    addPageBackground(doc);
    y = 30;

    // Title ("Sun Profile")
    doc.setFontSize(22);
    doc.setTextColor(100, 110, 130);
    doc.setFont("helvetica", "bold");
    doc.text(`${pName} Profile`, w / 2, y, { align: "center" });

    doc.setDrawColor(210, 200, 190);
    doc.setLineWidth(0.5);
    doc.line(15, y + 8, w - 15, y + 8);
    y += 25;

    // Yellow Planet Box
    const pDesc =
      PLANET_DESC[pName] ||
      `The ${pName.toUpperCase()} represents a core facet of your psyche.`;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    const pLines = doc.splitTextToSize(pDesc, contentW - 25);
    const pBoxH = Math.max(25, pLines.length * 5 + 15);

    doc.setFillColor(252, 252, 240); // Pale yellow
    doc.rect(marginX, y, contentW, pBoxH, "F");

    // Planet Symbol (Orange circle)
    doc.setDrawColor(220, 100, 40);
    doc.setLineWidth(1.5);
    doc.circle(marginX + 15, y + pBoxH / 2 - 2, 7, "S");
    doc.setFillColor(220, 100, 40);
    doc.circle(marginX + 15, y + pBoxH / 2 - 2, 2, "F");

    // Text in Box
    doc.setTextColor(80, 90, 100);
    doc.text(pLines, marginX + 30, y + 10);

    y += pBoxH + 20;

    // Title ("Sun in Tenth house")
    doc.setFontSize(18);
    doc.setTextColor(50, 60, 110);
    doc.setFont("helvetica", "bold");
    // Get ordinal name (e.g., First, Second)
    const ordinals = [
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
      "Tenth",
      "Eleventh",
      "Twelfth",
    ];
    const houseName = ordinals[parseInt(houseNum) - 1] || "First";
    doc.text(`${pName} in ${houseName} house`, marginX, y);
    y += 12;

    // Right Side: House Box (Image 2)
    const houseBoxY = y;
    doc.setFillColor(255, 235, 235); // Very light pink

    const hDesc =
      HOUSE_DESC[houseNum] ||
      `The ${houseName} House flavors the expression of ${pName} in your life.`;
    doc.setFontSize(10.5);
    const hDescLines = doc.splitTextToSize(hDesc, boxW - 10);
    const hBoxH = Math.max(45, hDescLines.length * 5 + 18);

    doc.rect(rightBoxX, houseBoxY, boxW, hBoxH, "F");

    // Box Title
    doc.setFontSize(14);
    doc.setTextColor(110, 50, 80);
    doc.setFont("helvetica", "bold");
    doc.text(`${houseName.toUpperCase()} HOUSE`, rightBoxX + 5, houseBoxY + 8);

    // Box Icon (Roman Numeral)
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 80);
    doc.text(roman, rightBoxX + boxW - 10, houseBoxY + 9);

    // Box Text
    doc.setFontSize(10.5);
    doc.setTextColor(110, 80, 90);
    doc.setFont("helvetica", "italic");
    doc.text(hDescLines, rightBoxX + 5, houseBoxY + 16);

    // Left Side: House Report Text
    doc.setFontSize(10.5);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");

    const houseReport = getContent(pData.house_report, TEXT.fallback.planet);
    const hChunk1Lines = doc.splitTextToSize(houseReport, textW);
    currentY = y;

    let hChunk1Idx = 0;
    while (
      hChunk1Idx < hChunk1Lines.length &&
      currentY < houseBoxY + hBoxH + 5
    ) {
      doc.text(hChunk1Lines[hChunk1Idx], marginX, currentY);
      currentY += 5.5;
      hChunk1Idx++;
    }

    const hRemainingText = houseReport
      .replace(hChunk1Lines.slice(0, hChunk1Idx).join(" "), "")
      .trim();
    if (hRemainingText.length > 0) {
      const hRemainingLines = doc.splitTextToSize(hRemainingText, contentW);
      currentY = Math.max(currentY, houseBoxY + hBoxH + 5);

      for (let i = 0; i < hRemainingLines.length; i++) {
        if (currentY > 270) {
          doc.addPage();
          addPageBackground(doc);
          currentY = 30;
        }
        doc.text(hRemainingLines[i], marginX, currentY);
        currentY += 5.5;
      }
    }
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
