/* eslint-disable @typescript-eslint/no-explicit-any */
// pdf-pages-1.ts — Cover, Intro, Charts, Tables

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ZODIAC_ICONS, PLANET_ICONS, ASPECT_ICONS } from "./constants";
import { addPageBackground, safeFixed } from "./helpers";

// ═══════════════════════════════════════════════
//  PAGE 1 — COVER
// ═══════════════════════════════════════════════
export function renderCoverPage(
  doc: jsPDF,
  name: string,
  dob: string,
  tob: string,
  place: string,
  houseSystem: string, // Kept to avoid breaking the signature
) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // 1. Draw Gradient Background
  // We approximate the purple gradient from top (lighter pink-purple) to bottom (dark navy-purple).
  // This uses thin rectangles since native jsPDF gradients can be tricky across versions.
  const step = 2; // mm
  for (let y = 0; y <= h; y += step) {
    const ratio = y / h;
    const r = Math.round(180 - ratio * (180 - 25)); // 180 -> 25
    const g = Math.round(70 - ratio * (70 - 10)); // 70 -> 10
    const b = Math.round(140 - ratio * (140 - 50)); // 140 -> 50
    doc.setFillColor(r, g, b);
    doc.rect(0, y, w, step + 0.5, "F");
  }

  // 2. Add Top Texts
  const titleY = h * 0.15;
  doc.setTextColor(243, 222, 59); // Bright Yellow
  doc.setFont("helvetica", "bold");
  doc.setFontSize(44);
  doc.text("BIRTH CHART", w / 2, titleY, { align: "center" });
  doc.text("REPORT", w / 2, titleY + 18, { align: "center" });

  doc.setTextColor(255, 255, 255); // White
  doc.setFont("helvetica", "normal");
  doc.setFontSize(20);
  doc.text("Your Astrological Portrait", w / 2, titleY + 35, {
    align: "center",
  });

  // 3. User Details Band
  const bandY = h * 0.61;
  const bandHeight = 40;
  // Draw a darker band
  doc.setFillColor(45, 15, 55); // Dark rich purple
  doc.rect(0, bandY, w, bandHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");

  // Name
  doc.setFontSize(16);
  doc.text(name, w / 2, bandY + 14, { align: "center" });

  // DOB & TOB
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${dob}   ${tob}`, w / 2, bandY + 23, { align: "center" });

  // Place
  doc.text(place, w / 2, bandY + 29, { align: "center" });

  // 4. Footer Branding
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text("ASTROLOGY API", w / 2, h - 15, { align: "center" });

  // Use houseSystem to avoid unused var lint warning
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text(`${houseSystem} houses`, w - 10, h - 10, { align: "right" });
}

// ═══════════════════════════════════════════════
//  PAGE 2 — INTRODUCTION
// ═══════════════════════════════════════════════
export function renderIntroPage(doc: jsPDF, name: string) {
  doc.addPage();
  addPageBackground(doc);
  const w = doc.internal.pageSize.getWidth();

  let y = 35; // Start lower to avoid overlap with header strip

  // Title "Dear, [Name]"
  doc.setFontSize(22);
  doc.setTextColor(45, 60, 110); // Dark Blue
  doc.setFont("helvetica", "bold");
  doc.text(`Dear, ${name}`, 20, y);
  y += 15;

  // Helper to render paragraph with exact spacing seen in Image 1
  const renderParagraph = (text: string, currentY: number) => {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100); // Muted blueish gray matching Image 1 exactly
    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(text, w - 40);
    let tempY = currentY;
    lines.forEach((line: string) => {
      doc.text(line, 20, tempY);
      tempY += 8; // Tall custom line spacing
    });
    return tempY + 5; // Cushion before next element
  };

  // Intro Paragraph 1
  const p1Text =
    "Welcome to your personalized Birth Chart Report! We're excited to guide you into the world of astrology, where the positions of celestial bodies reveal profound insights about your personality, relationships, and life's purpose.";
  y = renderParagraph(p1Text, y);

  // Subtitle 1 "What is Astrology"
  doc.setFontSize(18);
  doc.setTextColor(45, 60, 110);
  doc.setFont("helvetica", "bold");
  doc.text("What is Astrology", 20, y);
  y += 10;

  // Paragraph 2
  const p2Text =
    "Astrology is an ancient practice that interprets the influence of stars and planets on human life. By examining the positions of these celestial bodies at your birth, we uncover valuable information about your character, potential challenges, and unique strengths. Astrology is a powerful tool for self-awareness and growth, helping you navigate life with greater clarity.";
  y = renderParagraph(p2Text, y);

  // Subtitle 2 "How This Report is Prepared"
  doc.setFontSize(18);
  doc.setTextColor(45, 60, 110);
  doc.setFont("helvetica", "bold");
  doc.text("How This Report is Prepared", 20, y);
  y += 10;

  // Paragraph 3
  const p3Text =
    "Our report is crafted using the exact date, time, and location of your birth. We use advanced techniques to calculate the precise positions of the Sun, Moon, planets, and other significant points in your natal chart. Our experienced astrologers then interpret these aspects to provide comprehensive and personalized insights.";
  y = renderParagraph(p3Text, y);

  // Paragraph 4
  const p4Text =
    "We hope this report will be a valuable resource on your journey toward self-awareness and personal development. Embrace the wisdom of the stars and let it guide you to a brighter future.";
  renderParagraph(p4Text, y);
}

// ═══════════════════════════════════════════════
//  PAGE 3 — NATAL CHART WHEEL
// ═══════════════════════════════════════════════
export function renderNatalWheelPage(
  doc: jsPDF,
  wheelImage: Uint8Array | string | null,
  dob: string,
  tob: string,
  lat: number,
  lon: number,
  tzone: number,
  houseSystem: string,
) {
  doc.addPage();
  addPageBackground(doc);
  const w = doc.internal.pageSize.getWidth();

  // 1. Header
  doc.setFontSize(22);
  doc.setTextColor(45, 60, 110); // Dark Blue
  doc.setFont("helvetica", "bold");
  doc.text("Natal Chart", w / 2, 28, { align: "center" });

  // Thin line below header
  doc.setDrawColor(210, 200, 190);
  doc.setLineWidth(0.5);
  doc.line(20, 36, w - 20, 36);

  // 2. Info Boxes
  doc.setFontSize(9);
  doc.setTextColor(45, 60, 110);
  doc.setFont("helvetica", "bold");

  // Left side
  const latStr = lat >= 0 ? `${lat}N` : `${Math.abs(lat)}S`;
  const lonStr = lon >= 0 ? `${lon}E` : `${Math.abs(lon)}W`;
  const tzSign = tzone >= 0 ? "+" : "-";

  // Format DOB from DD-MM-YYYY to DD/MM/YYYY
  const formattedDob = dob.replace(/-/g, "/");

  doc.text(`${formattedDob} ${tob}`, 20, 48);
  doc.text(`${latStr}, ${lonStr}`, 20, 53);
  doc.text(`${tzSign}${Math.abs(tzone)}:00`, 20, 58);

  // Right side
  doc.text("Tropical", w - 20, 48, { align: "right" });
  doc.text(`${houseSystem} House`, w - 20, 53, { align: "right" });
  doc.text("Mean Node", w - 20, 58, { align: "right" });

  // 3. Chart Wheel Image
  if (wheelImage) {
    try {
      doc.addImage(wheelImage, "PNG", 15, 65, 180, 180);
    } catch (e) {
      console.error("Failed to add wheel image:", e);
    }
  }

  // 4. Legends Header
  const legendY = 250;
  doc.setFontSize(11);
  doc.setTextColor(45, 60, 110);
  doc.setFont("helvetica", "bold");
  doc.text("LEGENDS FOR NATAL CHART", w / 2, legendY, { align: "center" });

  // Decorative squiggly line (approximated with 3 bezier curves)
  doc.setDrawColor(156, 39, 176); // Purple from image
  doc.setLineWidth(0.5);
  const cx = w / 2;
  const cy = legendY + 4;
  doc.line(cx - 15, cy, cx - 5, cy);
  // doc.bezierCurveTo... we skip precise squiggly to avoid artifacts, using a simple line is safer
  doc.line(cx - 3, cy - 1, cx + 3, cy + 1);
  doc.line(cx + 5, cy, cx + 15, cy);

  // 5. Legends Grid
  doc.setFontSize(9);

  const drawLegend = (
    x: number,
    y: number,
    iconChar: string,
    label: string,
    color: number[],
  ) => {
    // Draw icon in color
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(iconChar, x, y);
    // Draw text in gray
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`= ${label}`, x + 4, y);
  };

  // Define Columns Data
  const col1 = [
    { icon: PLANET_ICONS.Sun || "Q", label: "Sun", color: [230, 81, 0] },
    { icon: PLANET_ICONS.Moon || "W", label: "Moon", color: [112, 112, 112] },
    {
      icon: PLANET_ICONS.Mercury || "E",
      label: "Mercury",
      color: [139, 195, 74],
    },
    { icon: PLANET_ICONS.Mars || "T", label: "Mars", color: [211, 47, 47] },
    { icon: PLANET_ICONS.Venus || "R", label: "Venus", color: [76, 175, 80] },
    {
      icon: PLANET_ICONS.Jupiter || "Y",
      label: "Jupiter",
      color: [156, 39, 176],
    },
    {
      icon: PLANET_ICONS.Chiron || "q",
      label: "Chiron",
      color: [156, 39, 176],
    },
  ];

  const col2 = [
    {
      icon: PLANET_ICONS.Saturn || "U",
      label: "Saturn",
      color: [112, 112, 112],
    },
    { icon: PLANET_ICONS.Uranus || "I", label: "Uranus", color: [3, 169, 244] },
    {
      icon: PLANET_ICONS.Neptune || "O",
      label: "Neptune",
      color: [0, 188, 212],
    },
    { icon: PLANET_ICONS.Pluto || "P", label: "Pluto", color: [211, 47, 47] },
    { icon: PLANET_ICONS.Node || "{", label: "Node", color: [51, 51, 51] },
    { icon: PLANET_ICONS.Lilith || "`", label: "Lilith", color: [76, 175, 80] },
    { icon: "X", label: "Parte Of Fortune", color: [51, 51, 51] }, // generic placeholder
  ];

  const col3 = [
    { icon: ZODIAC_ICONS.Aries || "a", label: "Aries", color: [211, 47, 47] },
    {
      icon: ZODIAC_ICONS.Taurus || "s",
      label: "Taurus",
      color: [25, 118, 210],
    },
    { icon: ZODIAC_ICONS.Gemini || "d", label: "Gemini", color: [245, 124, 0] },
    { icon: ZODIAC_ICONS.Cancer || "f", label: "Cancer", color: [2, 136, 209] },
    { icon: ZODIAC_ICONS.Leo || "g", label: "Leo", color: [211, 47, 47] },
    { icon: ZODIAC_ICONS.Virgo || "h", label: "Virgo", color: [25, 118, 210] },
  ];

  const col4 = [
    { icon: ZODIAC_ICONS.Libra || "j", label: "Libra", color: [245, 124, 0] },
    {
      icon: ZODIAC_ICONS.Scorpio || "k",
      label: "Scorpio",
      color: [25, 118, 210],
    },
    {
      icon: ZODIAC_ICONS.Sagittarius || "l",
      label: "Sagittarius",
      color: [211, 47, 47],
    },
    {
      icon: ZODIAC_ICONS.Capricorn || "z",
      label: "Capricorn",
      color: [56, 142, 60],
    },
    {
      icon: ZODIAC_ICONS.Aquarius || "x",
      label: "Aquarius",
      color: [245, 124, 0],
    },
    {
      icon: ZODIAC_ICONS.Pisces || "c",
      label: "Pisces",
      color: [25, 118, 210],
    },
  ];

  // Draw Grid
  const startY = legendY + 12;
  const lineH = 5.5;

  col1.forEach((item, i) =>
    drawLegend(25, startY + i * lineH, item.icon, item.label, item.color),
  );
  col2.forEach((item, i) =>
    drawLegend(65, startY + i * lineH, item.icon, item.label, item.color),
  );
  col3.forEach((item, i) =>
    drawLegend(110, startY + i * lineH, item.icon, item.label, item.color),
  );
  col4.forEach((item, i) =>
    drawLegend(145, startY + i * lineH, item.icon, item.label, item.color),
  );
}

// ═══════════════════════════════════════════════
//  PAGE 4 — PLANETARY POSITIONS TABLE
// ═══════════════════════════════════════════════
export function renderPlanetaryPositionsTable(doc: jsPDF, planets: any[]) {
  doc.addPage();
  addPageBackground(doc);

  const w = doc.internal.pageSize.getWidth();

  // 1. Header
  doc.setFontSize(22);
  doc.setTextColor(110, 120, 140); // Greyish blue matching Image 1
  doc.setFont("helvetica", "bold");
  doc.text("Planetary Positions", w / 2, 25, { align: "center" });

  // Thin line below header
  doc.setDrawColor(210, 200, 190);
  doc.setLineWidth(0.5);
  doc.line(15, 32, w - 15, 32);

  // Helper for DD° MM' SS"
  const formatDegree = (deg: number) => {
    let abs = Math.abs(deg || 0);
    if (abs >= 30) abs = abs % 30; // Keep it within 0-29 for sign
    const d = Math.floor(abs);
    const minFloat = (abs - d) * 60;
    const m = Math.floor(minFloat);
    const secFloat = (minFloat - m) * 60;
    const s = Math.round(secFloat);
    return {
      d: d.toString().padStart(2, "0"),
      m: m.toString().padStart(2, "0"),
      s: s.toString().padStart(2, "0"),
    };
  };

  const tableBody = planets.map((p: any) => {
    const isRetro = p.isRetro === "true" || p.isRetro === true;
    return [
      { content: "", raw: p }, // Planet: icon + name
      { content: "", raw: p }, // Degree: deg icon (sign) min sec
      {
        content: String(p.house || "-"),
        styles: {
          halign: "center" as const,
          textColor: [110, 110, 110] as [number, number, number],
        } as any,
      },
      {
        content: isRetro ? "R" : "-",
        styles: {
          halign: "center" as const,
          textColor: (isRetro ? [211, 100, 120] : [160, 160, 160]) as [
            number,
            number,
            number,
          ],
        } as any,
      },
    ];
  });

  autoTable(doc, {
    startY: 40,
    head: [["Planet", "Degree", "House", "Retro"]],
    body: tableBody,
    theme: "plain",
    headStyles: {
      fillColor: [228, 205, 235], // Light purple
      textColor: [115, 80, 140], // Darker purple text
      fontStyle: "bold",
      halign: "center",
      fontSize: 10,
    },
    styles: {
      fontSize: 10,
      font: "helvetica",
      cellPadding: 5,
      valign: "middle",
    },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
    },
    margin: { left: 15, right: 15 },
    didParseCell: (hookData) => {
      // Create alternating row background
      if (hookData.section === "body") {
        if (hookData.row.index % 2 === 0) {
          hookData.cell.styles.fillColor = [246, 238, 250]; // Extremely light purple
        } else {
          hookData.cell.styles.fillColor = [255, 255, 255];
        }
      }

      // Left align the first column header
      if (hookData.section === "head" && hookData.column.index === 0) {
        hookData.cell.styles.halign = "left";
      }
    },
    didDrawCell: (hookData) => {
      if (hookData.section === "body") {
        const p = hookData.cell.raw && (hookData.cell.raw as any).raw;
        if (!p) return;

        const x = hookData.cell.x;
        const y = hookData.cell.y + hookData.cell.height / 2 + 3;

        // Custom Colors for icons
        const planetColors: Record<string, number[]> = {
          Sun: [230, 100, 0],
          Moon: [140, 140, 150],
          Mercury: [139, 195, 74],
          Mars: [211, 47, 47],
          Venus: [76, 175, 80],
          Jupiter: [156, 39, 176],
          Saturn: [90, 90, 110],
          Uranus: [3, 169, 244],
          Neptune: [0, 188, 212],
          Pluto: [211, 47, 47],
          Node: [51, 51, 51],
          Lilith: [76, 175, 80],
          Chiron: [156, 39, 176],
          "Part of Fortune": [51, 51, 51],
        };

        const zodiacColors: Record<string, number[]> = {
          Aries: [211, 47, 47],
          Taurus: [25, 118, 210],
          Gemini: [245, 124, 0],
          Cancer: [2, 136, 209],
          Leo: [211, 47, 47],
          Virgo: [25, 118, 210],
          Libra: [245, 124, 0],
          Scorpio: [25, 118, 210],
          Sagittarius: [211, 47, 47],
          Capricorn: [56, 142, 60],
          Aquarius: [245, 124, 0],
          Pisces: [25, 118, 210],
        };

        if (hookData.column.index === 0) {
          // Planet Column: "[Icon] [Name]"
          let pIcon = PLANET_ICONS[p.name] || "Q";
          let pColor = planetColors[p.name] || [100, 100, 100];
          let iconWidth = 6;

          if (p.name === "Ascendant" || p.name === "ascendant") {
            pIcon = "AC";
            pColor = [245, 124, 0];
            iconWidth = 8;
          } else if (p.name === "Descendant" || p.name === "descendant") {
            pIcon = "DC";
            pColor = [245, 124, 0];
            iconWidth = 8;
          } else if (p.name === "MidHeaven" || p.name === "midheaven") {
            pIcon = "MC";
            pColor = [3, 169, 244];
            iconWidth = 8;
          } else if (p.name === "Imum Coeli" || p.name === "imum_coeli") {
            pIcon = "IC";
            pColor = [3, 169, 244];
            iconWidth = 8;
          } else if (
            p.name === "Part of Fortune" ||
            p.name === "part_of_fortune"
          ) {
            pIcon = "X";
            pColor = [51, 51, 51];
          }

          doc.setFont("helvetica", "bold");
          doc.setTextColor(pColor[0], pColor[1], pColor[2]);
          doc.text(pIcon, x + 4, y);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(90, 80, 110); // Dark grey/purple text for planet name

          // Capitalize first letter of planet name for displaying
          const dispName = p.name
            ? p.name.charAt(0).toUpperCase() + p.name.slice(1)
            : "";
          doc.text(dispName, x + 4 + iconWidth, y);
        } else if (hookData.column.index === 1) {
          // Degree Column: "00° [Icon] (Sign) 00'00\""
          const rawDeg =
            p.normDegree !== undefined
              ? p.normDegree
              : p.fullDegree !== undefined
                ? p.fullDegree
                : p.degree;
          const { d, m, s } = formatDegree(rawDeg);
          const zIcon = ZODIAC_ICONS[p.sign] || "";
          const zColor = zodiacColors[p.sign] || [100, 100, 100];
          const signAbbr = p.sign ? p.sign.substring(0, 3) : "";

          // x position for center alignment in column
          const startX = x + hookData.cell.width / 2 - 18;

          // 1. Degree
          doc.setFont("helvetica", "normal");
          doc.setTextColor(110, 110, 110);
          doc.text(`${d}°`, startX, y);

          // 2. Zodiac Icon
          doc.setFont("helvetica", "bold");
          doc.setTextColor(zColor[0], zColor[1], zColor[2]);
          doc.text(zIcon, startX + 7, y);

          // 3. (SignAbbr)
          doc.setFont("helvetica", "normal");
          doc.setTextColor(110, 110, 110);
          doc.text(`(${signAbbr})`, startX + 11, y);

          // 4. Minutes & Seconds
          doc.text(`${m}'${s}"`, startX + 22, y);
        }
      }
    },
  });
}

// ═══════════════════════════════════════════════
//  PAGE 5 — HOUSE CUSPS TABLE
// ═══════════════════════════════════════════════
export function renderHouseCuspsTable(doc: jsPDF, cusps: any[]) {
  doc.addPage();
  addPageBackground(doc);

  const w = doc.internal.pageSize.getWidth();

  // 1. Header
  doc.setFontSize(22);
  doc.setTextColor(110, 120, 140); // Greyish blue matching Image 1
  doc.setFont("helvetica", "bold");
  doc.text("Natal House Cusp", w / 2, 25, { align: "center" });

  // Thin line below header
  doc.setDrawColor(210, 200, 190);
  doc.setLineWidth(0.5);
  doc.line(15, 32, w - 15, 32);

  // Helper for DD° MM' SS"
  const formatDegree = (deg: number) => {
    let abs = Math.abs(deg || 0);
    if (abs >= 30) abs = abs % 30; // Keep it within 0-29 for sign
    const d = Math.floor(abs);
    const minFloat = (abs - d) * 60;
    const m = Math.floor(minFloat);
    const secFloat = (minFloat - m) * 60;
    const s = Math.round(secFloat);
    return {
      d: d.toString().padStart(2, "0"),
      m: m.toString().padStart(2, "0"),
      s: s.toString().padStart(2, "0"),
    };
  };

  const tableBody = cusps.map((c: any) => {
    return [
      { content: "", raw: c },
      { content: "", raw: c },
    ];
  });

  autoTable(doc, {
    startY: 40,
    head: [["House", "Degree"]],
    body: tableBody,
    theme: "plain",
    headStyles: {
      fillColor: [228, 205, 235], // Light purple
      textColor: [115, 80, 140], // Darker purple text
      fontStyle: "bold",
      halign: "center",
      fontSize: 10,
    },
    styles: {
      fontSize: 10,
      font: "helvetica",
      cellPadding: 5,
      valign: "middle",
    },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center" },
    },
    margin: { left: 15, right: 15 },
    didParseCell: (hookData) => {
      // Create alternating row background
      if (hookData.section === "body") {
        if (hookData.row.index % 2 === 0) {
          hookData.cell.styles.fillColor = [255, 255, 255];
        } else {
          hookData.cell.styles.fillColor = [246, 238, 250]; // Extremely light purple
        }
      }

      // Left align the first column header
      if (hookData.section === "head" && hookData.column.index === 0) {
        hookData.cell.styles.halign = "left";
      }
    },
    didDrawCell: (hookData) => {
      if (hookData.section === "body") {
        const c = hookData.cell.raw && (hookData.cell.raw as any).raw;
        if (!c) return;

        const x = hookData.cell.x;
        const y = hookData.cell.y + hookData.cell.height / 2 + 3;

        const zodiacColors: Record<string, number[]> = {
          Aries: [211, 47, 47],
          Taurus: [25, 118, 210],
          Gemini: [245, 124, 0],
          Cancer: [2, 136, 209],
          Leo: [211, 47, 47],
          Virgo: [25, 118, 210],
          Libra: [245, 124, 0],
          Scorpio: [25, 118, 210],
          Sagittarius: [211, 47, 47],
          Capricorn: [56, 142, 60],
          Aquarius: [245, 124, 0],
          Pisces: [25, 118, 210],
        };

        if (hookData.column.index === 0) {
          doc.setFont("helvetica", "bold");
          doc.setTextColor(90, 80, 110); // Dark grey/purple text

          let houseLabel = `house ${c.house}`;
          if (c.house === 1) houseLabel = "AC (Ascendant)";
          if (c.house === 10) houseLabel = "MC (MidHeaven)";

          doc.text(houseLabel, x + 4, y);
        } else if (hookData.column.index === 1) {
          const rawDeg =
            c.normDegree !== undefined
              ? c.normDegree
              : c.fullDegree !== undefined
                ? c.fullDegree
                : c.degree;
          const { d, m, s } = formatDegree(rawDeg);
          const zIcon = ZODIAC_ICONS[c.sign] || "";
          const zColor = zodiacColors[c.sign] || [100, 100, 100];
          const signStr = c.sign ? c.sign : "";

          // 1. Degree
          doc.setFont("helvetica", "normal");
          doc.setTextColor(110, 110, 110);
          const degW = doc.getTextWidth(`${d}° `);

          doc.setFont("helvetica", "bold");
          const iconW = doc.getTextWidth(zIcon + " ");

          doc.setFont("helvetica", "normal");
          const signW = doc.getTextWidth(`(${signStr}) `);
          const msW = doc.getTextWidth(`${m}'${s}"`);

          const totalW = degW + iconW + signW + msW;
          let currX = x + hookData.cell.width / 2 - totalW / 2;

          doc.setFont("helvetica", "normal");
          doc.setTextColor(110, 110, 110);
          doc.text(`${d}°`, currX, y);
          currX += degW;

          // 2. Zodiac Icon
          doc.setFont("helvetica", "bold");
          doc.setTextColor(zColor[0], zColor[1], zColor[2]);
          doc.text(zIcon, currX, y);
          currX += iconW;

          // 3. (Sign)
          doc.setFont("helvetica", "normal");
          doc.setTextColor(110, 110, 110);
          doc.text(`(${signStr})`, currX, y);
          currX += signW;

          // 4. Minutes & Seconds
          doc.text(`${m}'${s}"`, currX, y);
        }
      }
    },
  });

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "bold");
  doc.text(
    "NOTE - PLACIDUS SYSTEM OF HOUSE DIVISION IS USED.",
    30,
    (doc as any).lastAutoTable.finalY + 15,
  );
}

// ═══════════════════════════════════════════════
//  PAGE 6 — ASPECTS GRID
// ═══════════════════════════════════════════════

export function renderAspectGridPage(doc: jsPDF, aspects: any[]) {
  doc.addPage();
  addPageBackground(doc);

  const w = doc.internal.pageSize.getWidth();

  // 1. Header
  doc.setFontSize(22);
  doc.setTextColor(110, 120, 140);
  doc.setFont("helvetica", "bold");
  doc.text("Aspect Chart", w / 2, 25, { align: "center" });

  doc.setDrawColor(210, 200, 190);
  doc.setLineWidth(0.5);
  doc.line(15, 32, w - 15, 32);

  const gridPlanets = [
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
    "Ascendant",
    "MC",
  ];

  // Build aspect lookup
  const aspectMap: Record<string, any> = {};
  aspects?.forEach((a) => {
    const p1 = a.aspecting_planet || a.planet1;
    const p2 = a.aspected_planet || a.planet2;
    const aspectType = a.type || a.aspect;

    if (!p1 || !p2) {
      return;
    }

    const aspectData = { ...a, aspect: aspectType };
    aspectMap[`${p1}-${p2}`] = aspectData;
    aspectMap[`${p2}-${p1}`] = aspectData;
  });

  const aspectColors: Record<string, number[]> = {
    Conjunction: [186, 199, 235], // Soft blue
    Sextile: [255, 212, 185], // Soft orange
    Square: [230, 189, 235], // Soft purple
    Trine: [197, 235, 197], // Soft green
    Opposition: [255, 212, 212], // Soft red
  };

  const aspectTextColors: Record<string, number[]> = {
    Conjunction: [50, 80, 180],
    Sextile: [255, 110, 50],
    Square: [200, 60, 220],
    Trine: [40, 180, 80],
    Opposition: [240, 60, 60],
  };

  const planetColors: Record<string, number[]> = {
    Sun: [230, 100, 0],
    Moon: [140, 140, 150],
    Mercury: [139, 195, 74],
    Mars: [211, 47, 47],
    Venus: [76, 175, 80],
    Jupiter: [156, 39, 176],
    Saturn: [51, 51, 51],
    Uranus: [3, 169, 244],
    Neptune: [0, 188, 212],
    Pluto: [211, 47, 47],
    Ascendant: [245, 124, 0],
    MC: [3, 169, 244],
  };

  const cellSize = 12.5;
  // Center grid horizontally based on number of columns (12)
  const gridWidth = gridPlanets.length * cellSize;
  const startX = (w - gridWidth) / 2 + 10;
  const startY = 40;

  doc.setLineWidth(0.2);
  doc.setDrawColor(220, 220, 220);

  for (let i = 0; i < gridPlanets.length; i++) {
    const p1 = gridPlanets[i];

    for (let j = 0; j <= i; j++) {
      const p2 = gridPlanets[j];
      const x = startX + j * cellSize;
      const y = startY + i * cellSize;

      const isDiagonal = i === j;

      let bgColor = [255, 255, 255]; // Default white
      let aspectData = null;
      let textIcon = "";
      let textColor = [0, 0, 0];

      if (!isDiagonal) {
        aspectData = aspectMap[`${p1}-${p2}`];

        if (aspectData) {
          bgColor = aspectColors[aspectData.aspect] || [255, 255, 255];
          textIcon = ASPECT_ICONS[aspectData.aspect] || "";
          textColor = aspectTextColors[aspectData.aspect] || [100, 100, 100];
        }
      }

      // Draw cell background
      if (bgColor[0] !== 255 || bgColor[1] !== 255 || bgColor[2] !== 255) {
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        doc.rect(x, y, cellSize, cellSize, "F");
      }

      doc.rect(x, y, cellSize, cellSize, "S");

      // Draw cell content
      doc.setFont("helvetica", "bold");
      if (isDiagonal) {
        let icon = PLANET_ICONS[p1] || "";
        if (p1 === "Ascendant") icon = "AC";
        if (p1 === "MC") icon = "MC";

        const pColor = planetColors[p1] || [100, 100, 100];
        doc.setTextColor(pColor[0], pColor[1], pColor[2]);
        doc.setFontSize(10);

        const textWidth = doc.getTextWidth(icon);
        doc.text(icon, x + (cellSize - textWidth) / 2, y + cellSize / 2 + 3.2);
      } else if (textIcon) {
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(11);

        const textWidth = doc.getTextWidth(textIcon);
        doc.text(
          textIcon,
          x + (cellSize - textWidth) / 2,
          y + cellSize / 2 + 3.5,
        );
      }
    }
  }

  // 3. New Legends matching Image 1 exactly
  const legendY = startY + gridPlanets.length * cellSize + 20;

  doc.setFontSize(11);
  doc.setTextColor(59, 56, 101); // Dark blue/purple matching title
  doc.setFont("helvetica", "bold");
  doc.text("LEGENDS FOR ASPECTS TABLE", w / 2, legendY, { align: "center" });

  // Decorative squiggly line
  doc.setDrawColor(156, 39, 176);
  doc.setLineWidth(0.5);
  const cx = w / 2;
  const cy = legendY + 4;
  doc.line(cx - 15, cy, cx - 5, cy);
  doc.line(cx - 3, cy - 1, cx + 3, cy + 1);
  doc.line(cx + 5, cy, cx + 15, cy);

  const drawLegendItem = (
    lx: number,
    ly: number,
    aspectName: string,
    labelString: string,
  ) => {
    const icon = ASPECT_ICONS[aspectName] || "";
    const color = aspectTextColors[aspectName] || [100, 100, 100];

    // Icon
    doc.setFont("helvetica", "bold");
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFontSize(12);
    doc.text(icon, lx, ly);

    // Text Label
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40); // Darker grey text for legend
    doc.setFontSize(10);
    // Draw string to exact match
    doc.text(labelString, lx + 4, ly - 0.5);
  };

  let ly = legendY + 16;
  const col1X = 20;
  const col2X = 80;
  const col3X = 145;

  // Row 1
  drawLegendItem(col1X, ly, "Square", "Square (90°) - Challenging");
  drawLegendItem(col2X, ly, "Conjunction", "Conjunction (0°) - Dynamic");
  drawLegendItem(col3X, ly, "Trine", "Trine (120°) - Harmony");

  // Row 2 Band
  ly += 11;
  doc.setFillColor(242, 234, 246); // Very light purple band
  doc.rect(15, ly - 6, w - 30, 9, "F");

  drawLegendItem(col1X, ly, "Opposition", "Opposition (180°) - Tension");
  drawLegendItem(col2X, ly, "Sextile", "Sextile(60°) - Opportunities");
}

// ═══════════════════════════════════════════════
//  PAGE 7 & 8 — ASPECTS TABLE
// ═══════════════════════════════════════════════
export function renderAspectsTablePage(doc: jsPDF, aspects: any[]) {
  if (!aspects || aspects.length === 0) {
    return;
  }

  doc.addPage();
  addPageBackground(doc);

  const w = doc.internal.pageSize.getWidth();

  // 1. Header
  const printHeader = () => {
    doc.setFontSize(22);
    doc.setTextColor(110, 120, 140);
    doc.setFont("helvetica", "bold");
    doc.text("Aspects Table", w / 2, 25, { align: "center" });

    doc.setDrawColor(210, 200, 190);
    doc.setLineWidth(0.5);
    doc.line(15, 32, w - 15, 32);
  };

  printHeader();

  // Same aspect lookup logic to handle aspecting_planet, aspected_planet, type
  const processedAspects = aspects
    .map((a: any) => {
      return {
        planet1: a.aspecting_planet || a.planet1 || "",
        planet2: a.aspected_planet || a.planet2 || "",
        aspect: a.type || a.aspect || "",
        orb: a.orb || 0,
        ...a,
      };
    })
    .filter((a: any) => a.planet1 && a.planet2 && a.aspect);

  const tableBody = processedAspects.map((a: any) => {
    return [
      { content: "", raw: { planet: a.planet1 } },
      { content: "", raw: { aspect: a.aspect } },
      { content: "", raw: { planet: a.planet2 } },
      safeFixed(a.orb),
    ];
  });

  const aspectTextColors: Record<string, number[]> = {
    Conjunction: [50, 80, 180],
    Sextile: [255, 110, 50],
    Square: [200, 60, 220],
    Trine: [40, 180, 80],
    Opposition: [240, 60, 60],
  };

  const planetColors: Record<string, number[]> = {
    Sun: [230, 100, 0],
    Moon: [140, 140, 150],
    Mercury: [139, 195, 74],
    Mars: [211, 47, 47],
    Venus: [76, 175, 80],
    Jupiter: [156, 39, 176],
    Saturn: [51, 51, 51],
    Uranus: [3, 169, 244],
    Neptune: [0, 188, 212],
    Pluto: [211, 47, 47],
    Ascendant: [245, 124, 0],
    Midheaven: [3, 169, 244],
    MC: [3, 169, 244],
  };

  autoTable(doc, {
    startY: 40,
    head: [["Planet", "Aspect", "Planet", "Orb"]],
    body: tableBody,
    theme: "plain",
    headStyles: {
      fillColor: [228, 205, 235], // Light purple
      textColor: [115, 80, 140], // Darker purple text
      fontStyle: "bold",
      halign: "left",
      fontSize: 10,
    },
    styles: {
      fontSize: 10,
      font: "helvetica",
      cellPadding: 6,
      valign: "middle",
    },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "left" },
      2: { halign: "left" },
      3: { halign: "left", textColor: [80, 80, 80] },
    },
    // Add page background rendering for auto-pagination extending to page 8+
    willDrawPage: (hookData) => {
      // Background must only be redrawn if autoTable forces a new page break internally.
      // Hook data gives us page count vs start page to detect forced jumps.
      if (hookData.pageNumber > 1) {
        // Render identical PDF doc background logic here on the new auto-page
        addPageBackground(doc);
        printHeader();
      }
    },
    // We must reset the Start Y for next pages since we print a header again
    margin: { top: 40, left: 15, right: 15, bottom: 20 },

    didParseCell: (hookData) => {
      // Create alternating row background
      if (hookData.section === "body") {
        if (hookData.row.index % 2 === 0) {
          hookData.cell.styles.fillColor = [255, 255, 255];
        } else {
          hookData.cell.styles.fillColor = [246, 238, 250]; // Extremely light purple
        }
      }
    },
    didDrawCell: (hookData) => {
      if (hookData.section === "body") {
        const raw = hookData.cell.raw && (hookData.cell.raw as any).raw;
        if (!raw) return;

        const startX = hookData.cell.x + 5; // Left padding
        const y = hookData.cell.y + hookData.cell.height / 2 + 3;

        doc.setFontSize(11);

        if (raw.planet) {
          const pName = raw.planet;
          let icon = PLANET_ICONS[pName] || "";
          if (pName === "Ascendant") icon = "AC";
          if (pName === "Midheaven" || pName === "MC") icon = "MC";

          const pColor = planetColors[pName] || [100, 100, 100];

          doc.setFont("helvetica", "bold");
          doc.setTextColor(pColor[0], pColor[1], pColor[2]);
          doc.text(icon, startX, y);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60); // Dark grey text
          const iconWidth = doc.getTextWidth(icon) + 2;

          // Print Planet name exactly
          let displayName = pName;
          if (pName === "Ascendant") displayName = "Ascendant";
          if (pName === "MC") displayName = "Midheaven";

          doc.text(displayName, startX + iconWidth - 1, y);
        } else if (raw.aspect) {
          const aName = raw.aspect;
          const icon = ASPECT_ICONS[aName] || "";
          const color = aspectTextColors[aName] || [100, 100, 100];

          doc.setFont("helvetica", "bold");
          doc.setTextColor(color[0], color[1], color[2]);
          doc.text(icon, startX, y);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60); // Dark grey
          const iconWidth = doc.getTextWidth(icon) + 2;
          doc.text(aName, startX + iconWidth, y);
        }
      }
    },
  });
}
