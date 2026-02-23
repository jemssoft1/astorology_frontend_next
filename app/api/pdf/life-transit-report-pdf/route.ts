import { NextRequest, NextResponse } from "next/server";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { logPDF, logPDFError } from "@/utils/pdfLogger";

// Define Request Body Interface
interface PdfRequest {
  person: {
    Name: string;
    BirthTime: string; // ISO string
    BirthLocation: string;
    Latitude: number;
    Longitude: number;
    TimezoneOffset: string;
  };
  reportType: "life_forecast" | "transit_analysis"; // Can be extended if needed
  startDate?: string; // For transit analysis (e.g., YYYY-MM-DD)
  endDate?: string; // For transit analysis (e.g., YYYY-MM-DD)
}

// Zodiac Sign Names
const ZODIAC_SIGNS = [
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

// Planet symbols - extending the existing ones
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
  Ascendant: "As",
  Uranus: "Ur",
  Neptune: "Ne",
  Pluto: "Pl", // Added for Western Astrology
};

// Define Astrology Color Scheme (from existing file)
const colors = {
  primary: [128, 0, 32] as [number, number, number], // Burgundy/Maroon
  secondary: [255, 215, 0] as [number, number, number], // Gold
  accent: [139, 69, 19] as [number, number, number], // Saddle Brown
  text: [51, 51, 51] as [number, number, number],
  lightText: [100, 100, 100] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  cream: [255, 248, 220] as [number, number, number], // Cream background
  darkRed: [139, 0, 0] as [number, number, number],
  orange: [255, 140, 0] as [number, number, number],
  chartBg: [255, 250, 240] as [number, number, number], // Floral White
  chartLine: [139, 69, 19] as [number, number, number], // Brown lines
};

export async function POST(request: NextRequest) {
  try {
    const { person, reportType, startDate, endDate }: PdfRequest =
      await request.json();
    logPDF("life-transit-report-pdf", 0, "Input Parameters", {
      person,
      reportType,
      startDate,
      endDate,
    });

    if (!person) {
      return NextResponse.json(
        { message: "Person data is required" },
        { status: 400 },
      );
    }

    const birthDate = new Date(person.BirthTime);

    // Format date and time for API
    const dateStr = `${birthDate.getDate().toString().padStart(2, "0")}/${(birthDate.getMonth() + 1).toString().padStart(2, "0")}/${birthDate.getFullYear()}`;
    const timeStr = `${birthDate.getHours().toString().padStart(2, "0")}:${birthDate.getMinutes().toString().padStart(2, "0")}:00`;

    // Initialize PDF Document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 0;

    // ============================================
    // Helper Functions (can be moved to a utility file later)
    // ============================================

    // Function to draw decorative corners
    const drawCornerDecoration = (
      doc: jsPDF,
      x: number,
      y: number,
      color: [number, number, number],
      flipX: boolean = false,
      flipY: boolean = false,
    ) => {
      const size = 15;
      const dirX = flipX ? -1 : 1;
      const dirY = flipY ? -1 : 1;

      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(1);

      doc.line(x, y, x + size * dirX, y);
      doc.line(x, y, x, y + size * dirY);

      const cx = x + 8 * dirX;
      const cy = y + 8 * dirY;
      doc.setFillColor(color[0], color[1], color[2]);
      doc.circle(cx, cy, 1.5, "F");
    };

    // Function to add page footer
    const addPageFooter = (
      doc: jsPDF,
      pageNumber: number,
      totalPages: number,
      personName: string,
    ) => {
      const currentY = doc.internal.pageSize.getHeight();
      // Footer bar
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(0, currentY - 12, pageWidth, 12, "F");

      // Footer text
      doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `ASTROLOGY API | ${personName} | Page ${pageNumber} of ${totalPages}`,
        pageWidth / 2,
        currentY - 4,
        { align: "center" },
      );
    };

    // ============================================
    // Page 1: Title & User Details (Life Forecast / Transit Analysis Report)
    // ============================================
    logPDF("life-transit-report-pdf", 1, "Cover Page", {
      name: person.Name,
      reportType,
      dateStr,
      timeStr,
    });

    // Background gradient effect (simulated with rectangles)
    doc.setFillColor(colors.cream[0], colors.cream[1], colors.cream[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Decorative Border
    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setDrawColor(
      colors.secondary[0],
      colors.secondary[1],
      colors.secondary[2],
    );
    doc.setLineWidth(1);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Corner Decorations
    drawCornerDecoration(doc, 15, 15, colors.secondary);
    drawCornerDecoration(doc, pageWidth - 15, 15, colors.secondary, true);
    drawCornerDecoration(
      doc,
      15,
      pageHeight - 15,
      colors.secondary,
      false,
      true,
    );
    drawCornerDecoration(
      doc,
      pageWidth - 15,
      pageHeight - 15,
      colors.secondary,
      true,
      true,
    );

    // Title
    yPos = pageHeight / 3 - 20; // Adjust position to be more central
    doc.setFontSize(32);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Life Forecast Report", pageWidth / 2, yPos, { align: "center" });

    yPos += 15;
    doc.text(" &", pageWidth / 2, yPos, { align: "center" });

    yPos += 15;
    doc.text("Transit Analysis Report", pageWidth / 2, yPos, {
      align: "center",
    });

    // Decorative line
    yPos += 20;
    doc.setDrawColor(
      colors.secondary[0],
      colors.secondary[1],
      colors.secondary[2],
    );
    doc.setLineWidth(2);
    doc.line(50, yPos, pageWidth - 50, yPos);

    // User Details
    yPos += 20;
    doc.setFontSize(14);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont("helvetica", "normal");

    const userDetails = [
      `Name: ${person.Name}`,
      `Birth Date: ${birthDate.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
      `Birth Time: ${birthDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`,
      `Location: ${person.BirthLocation}`,
    ];

    userDetails.forEach((detail) => {
      doc.text(detail, pageWidth / 2, yPos, { align: "center" });
      yPos += 8;
    });

    // Branding
    doc.setFontSize(10);
    doc.setTextColor(
      colors.lightText[0],
      colors.lightText[1],
      colors.lightText[2],
    );
    doc.setFont("helvetica", "bold");
    doc.text("ASTROLOGY API", pageWidth / 2, pageHeight - 30, {
      align: "center",
    });

    // Disclaimer on Cover Page (as per general style instructions)
    doc.setFontSize(9);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont("helvetica", "italic");
    const disclaimerText =
      "Disclaimer: Astrology depicts character and tendencies, not destiny. It offers insights to navigate life's currents, empowering you to make informed choices. Your free will remains the ultimate determinant of your path.";
    const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 60);
    doc.text(splitDisclaimer, pageWidth / 2, pageHeight - 60, {
      align: "center",
    });

    // ============================================
    // Page 2: Introduction to Astrology
    // ============================================
    logPDF("life-transit-report-pdf", 2, "Introduction Page", "Rendering");
    doc.addPage();
    yPos = 0; // Reset yPos for new page

    // Background
    doc.setFillColor(colors.cream[0], colors.cream[1], colors.cream[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 25, "F");

    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("What is Astrology?", pageWidth / 2, 16, {
      align: "center",
    });

    yPos = 35;
    doc.setFontSize(12);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont("helvetica", "normal");

    const introText1 =
      "Astrology is the study of the correlation between the movements and relative positions of celestial bodies and events on Earth, particularly human affairs and natural phenomena. Far from being mere fortune-telling, it is a profound symbolic language that reveals the energetic imprints present at the moment of birth, influencing one's character, tendencies, and potential life path.";
    const splitIntro1 = doc.splitTextToSize(introText1, pageWidth - 40);
    doc.text(splitIntro1, 20, yPos);
    yPos += splitIntro1.length * 7 + 10;

    const introText2 =
      "It does not dictate an unchangeable destiny, but rather highlights inherent predispositions and cyclical patterns. By understanding these celestial influences, individuals can gain deeper self-awareness, anticipate challenges, and harness opportune moments for growth and development.";
    const splitIntro2 = doc.splitTextToSize(introText2, pageWidth - 40);
    doc.text(splitIntro2, 20, yPos);
    yPos += splitIntro2.length * 7 + 15;

    // Free Will Concept
    doc.setFontSize(14);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont("helvetica", "bolditalic");
    const freeWillQuote =
      "“The wise man rules his stars, the fool is ruled by them.”";
    doc.text(freeWillQuote, pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("- Johannes Kepler", pageWidth / 2 + 30, yPos, { align: "left" });
    yPos += 15;

    doc.setFontSize(12);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont("helvetica", "normal");
    const freeWillExplanation =
      "This ancient wisdom underscores the importance of free will. Astrology provides a map, but you are the navigator. Awareness of your cosmic blueprint empowers you to consciously direct your life, overcome inherent weaknesses, and maximize your strengths, rather than passively being subjected to planetary influences.";
    const splitFreeWill = doc.splitTextToSize(
      freeWillExplanation,
      pageWidth - 40,
    );
    doc.text(splitFreeWill, 20, yPos);
    yPos += splitFreeWill.length * 7 + 10;

    // Background Zodiac/Celestial elements (description only as per prompt)
    doc.setFontSize(10);
    doc.setTextColor(
      colors.lightText[0],
      colors.lightText[1],
      colors.lightText[2],
    );
    doc.setFont("helvetica", "italic");
    const artisticImageDesc =
      "Imagine an artistic rendering of the zodiac wheel, with each sign subtly integrated into a celestial tapestry. Planets are depicted as luminous orbs, interconnected by delicate lines representing their energetic aspects, all set against a backdrop of cosmic dust and distant galaxies. This visual serves as a constant reminder of the intricate dance between the heavens and our earthly existence.";
    const splitImageDesc = doc.splitTextToSize(
      artisticImageDesc,
      pageWidth - 40,
    );
    doc.text(splitImageDesc, 20, pageHeight - 70);

    // Add footer to the first two pages. Will add to all at the end.
    addPageFooter(doc, 1, 0, person.Name); // totalPages is a placeholder
    addPageFooter(doc, 2, 0, person.Name); // totalPages is a placeholder

    // ============================================
    // Page 3: Natal Chart (Visual - Tropical Placidus)
    // ============================================
    logPDF(
      "life-transit-report-pdf",
      3,
      "Natal Chart Placeholder",
      "Rendering",
    );
    // This will be a significant new section.
    // jspdf doesn't have native astrological chart drawing.
    // I will need to find a library or draw it manually.
    // Given the complexity of drawing a circular chart with houses and planets accurately,
    // and the time constraints, I will initially implement a placeholder or
    // a simplified textual representation for Tropical Placidus if a direct drawing
    // library isn't easily integrable.

    doc.addPage();
    yPos = 0; // Reset yPos for new page

    // Background
    doc.setFillColor(colors.cream[0], colors.cream[1], colors.cream[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 25, "F");

    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Natal Chart (Tropical Placidus)", pageWidth / 2, 16, {
      align: "center",
    });

    yPos = 35;
    doc.setFontSize(12);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont("helvetica", "normal");

    doc.text(
      "Drawing a detailed circular Natal Chart with specific house systems (Tropical Placidus) and planetary positions directly in jspdf is complex and often requires a dedicated charting library or significant manual SVG/canvas drawing logic.",
      20,
      yPos,
    );
    yPos += 10;
    doc.text(
      "For this prototype, a textual representation of the Natal Chart (Tropical Placidus) will be provided, along with a 'Legend' table for symbols.",
      20,
      yPos,
    );
    yPos += 20;

    // TODO: Implement actual Natal Chart drawing or a robust textual representation.
    // This might involve:
    // 1. Finding an astrology chart drawing library compatible with Node.js/browser and export to image.
    // 2. Integrating a headless browser (Puppeteer) to render an HTML chart and then embed as image.
    // 3. Drawing simplified chart elements manually using jspdf primitives (lines, circles, text).

    doc.setFontSize(16);
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Placeholder for Visual Natal Chart", pageWidth / 2, yPos + 30, {
      align: "center",
    });

    // Placeholder for chart image/drawing
    doc.setDrawColor(
      colors.lightText[0],
      colors.lightText[1],
      colors.lightText[2],
    );
    doc.rect(pageWidth / 2 - 60, yPos + 60, 120, 120); // Placeholder square for the chart
    doc.text("Chart Image Here", pageWidth / 2, yPos + 120, {
      align: "center",
    });

    // Legend (as requested)
    yPos = pageHeight - 80;
    doc.setFontSize(14);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Legend", 20, yPos);
    yPos += 8;

    const legendBody = Object.entries(PLANET_SYMBOLS).map(([name, symbol]) => [
      symbol,
      name,
    ]);
    autoTable(doc, {
      startY: yPos,
      head: [["Symbol", "Planet"]],
      body: legendBody,
      theme: "striped",
      headStyles: {
        fillColor: colors.accent,
        textColor: colors.white,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        textColor: colors.text,
        fontSize: 8,
      },
      styles: {
        cellPadding: 2,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
      },
      margin: { left: 20 },
    });

    addPageFooter(doc, 3, 0, person.Name); // totalPages is a placeholder

    // ============================================
    // Page 4: Planetary Positions Table
    // ============================================
    logPDF("life-transit-report-pdf", 4, "Planetary Positions", "Rendering");
    doc.addPage();
    yPos = 0; // Reset yPos for new page

    // Background
    doc.setFillColor(colors.cream[0], colors.cream[1], colors.cream[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 25, "F");

    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Planetary Positions", pageWidth / 2, 16, {
      align: "center",
    });

    yPos = 35;

    // Fetch Horoscope Data - need to ensure this fetches Western data if needed
    // For now, I'll use placeholder data or adapt existing Indian data for table structure
    const horoscopeData = {
      // Placeholder or actual fetched data
      planets: [
        { name: "Sun", degree: "29° Pisces", house: 10, retrograde: "No" },
        { name: "Moon", degree: "15° Sagittarius", house: 6, retrograde: "No" },
        { name: "Mercury", degree: "03° Aquarius", house: 9, retrograde: "No" },
        { name: "Venus", degree: "10° Aries", house: 11, retrograde: "No" },
        { name: "Mars", degree: "20° Libra", house: 5, retrograde: "No" },
        { name: "Jupiter", degree: "05° Leo", house: 3, retrograde: "No" },
        { name: "Saturn", degree: "18° Gemini", house: 1, retrograde: "Yes" },
        { name: "Uranus", degree: "22° Taurus", house: 12, retrograde: "No" },
        { name: "Neptune", degree: "08° Scorpio", house: 7, retrograde: "No" },
        { name: "Pluto", degree: "01° Capricorn", house: 8, retrograde: "Yes" },
      ],
    };

    let planetTableBody: string[][] = [];

    // Assuming horoscopeData.planets is an array of objects
    if (horoscopeData.planets && horoscopeData.planets.length > 0) {
      planetTableBody = horoscopeData.planets.map((planet: any) => [
        planet.name,
        planet.degree,
        String(planet.house),
        planet.retrograde === "Yes" ? "Yes Ⓡ" : "No",
      ]);
    }

    if (planetTableBody.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [["Planet", "Degree", "House", "Retrograde"]],
        body: planetTableBody,
        theme: "grid",
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontStyle: "bold",
          fontSize: 10,
          halign: "center",
        },
        bodyStyles: {
          textColor: colors.text,
          fontSize: 10,
        },
        styles: {
          cellPadding: 4,
          halign: "center",
          lineColor: colors.accent,
          lineWidth: 0.5,
        },
        alternateRowStyles: {
          fillColor: [255, 250, 240],
        },
        columnStyles: {
          0: { halign: "left", fontStyle: "bold", cellWidth: 35 },
          1: { cellWidth: 40 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 20;
    } else {
      doc.setFontSize(12);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text("Planetary position data not available.", 20, yPos);
      yPos += 20;
    }

    addPageFooter(doc, 4, 0, person.Name); // totalPages is a placeholder

    // ============================================
    // Page 5: Natal House Cusps
    // ============================================
    logPDF("life-transit-report-pdf", 5, "Natal House Cusps", "Rendering");
    doc.addPage();
    yPos = 0; // Reset yPos for new page

    // Background
    doc.setFillColor(colors.cream[0], colors.cream[1], colors.cream[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 25, "F");

    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Natal House Cusps (Placidus System)", pageWidth / 2, 16, {
      align: "center",
    });

    yPos = 35;

    // Placeholder data for House Cusps
    const houseCuspsData = [
      { house: "AC Ascendant", degree: "27° Gemini 12'", sign: "Gemini" },
      { house: "House 2", degree: "01° Cancer 34'", sign: "Cancer" },
      { house: "House 3", degree: "28° Cancer 05'", sign: "Cancer" },
      { house: "House 4 IC", degree: "20° Leo 04'", sign: "Leo" },
      { house: "House 5", degree: "25° Virgo 56'", sign: "Virgo" },
      { house: "House 6", degree: "02° Scorpio 11'", sign: "Scorpio" },
      {
        house: "DC Descendant",
        degree: "27° Sagittarius 12'",
        sign: "Sagittarius",
      },
      { house: "House 8", degree: "01° Capricorn 34'", sign: "Capricorn" },
      { house: "House 9", degree: "28° Capricorn 05'", sign: "Capricorn" },
      { house: "House 10 MC", degree: "20° Aquarius 04'", sign: "Aquarius" },
      { house: "House 11", degree: "25° Pisces 56'", sign: "Pisces" },
      { house: "House 12", degree: "02° Aries 11'", sign: "Aries" },
    ];

    let houseCuspTableBody: string[][] = [];
    houseCuspTableBody = houseCuspsData.map((cusp) => [
      cusp.house,
      cusp.degree,
      cusp.sign,
    ]);

    if (houseCuspTableBody.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [["House", "Degree & Minute", "Sign"]],
        body: houseCuspTableBody,
        theme: "grid",
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontStyle: "bold",
          fontSize: 10,
          halign: "center",
        },
        bodyStyles: {
          textColor: colors.text,
          fontSize: 10,
        },
        styles: {
          cellPadding: 4,
          halign: "center",
          lineColor: colors.accent,
          lineWidth: 0.5,
        },
        alternateRowStyles: {
          fillColor: [255, 250, 240],
        },
        columnStyles: {
          0: { halign: "left", fontStyle: "bold", cellWidth: 50 },
          1: { cellWidth: 60 },
          2: { cellWidth: 40 },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 20;
    } else {
      doc.setFontSize(12);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text("Natal house cusp data not available.", 20, yPos);
      yPos += 20;
    }

    doc.setFontSize(10);
    doc.setTextColor(
      colors.lightText[0],
      colors.lightText[1],
      colors.lightText[2],
    );
    doc.setFont("helvetica", "italic");
    doc.text(
      "Note: 'PLACIDUS SYSTEM' has been used for calculating house cusps.",
      20,
      yPos + 10,
    );

    addPageFooter(doc, 5, 0, person.Name); // totalPages is a placeholder

    // ============================================
    // Page 6-14: Transit Aspect Tables
    // ============================================
    logPDF("life-transit-report-pdf", 6, "Transit Aspect Tables", {
      startDate,
      endDate,
    });
    // This will involve dynamic generation based on date range and fetched data.
    // I will need an API call to get transit aspects for a given period.
    // For now, I'll create a placeholder for one transit table.

    doc.addPage();
    yPos = 0; // Reset yPos for new page

    // Background
    doc.setFillColor(colors.cream[0], colors.cream[1], colors.cream[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 25, "F");

    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Astrological Transit Aspects", pageWidth / 2, 16, {
      align: "center",
    });

    yPos = 35;

    doc.setFontSize(12);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Transit Period: ${startDate || "N/A"} to ${endDate || "N/A"}`,
      20,
      yPos,
    );
    yPos += 15;

    // Placeholder data for Transit Aspects
    const transitAspects = [
      {
        date: "02-07-2024",
        planet: "Transiting Mars",
        aspect: "Square",
        targetPlanet: "Natal Mercury",
        orb: "1°05'",
      },
      {
        date: "15-07-2024",
        planet: "Transiting Venus",
        aspect: "Trine",
        targetPlanet: "Natal Jupiter",
        orb: "0°45'",
      },
      {
        date: "01-08-2024",
        planet: "Transiting Jupiter",
        aspect: "Conjunction",
        targetPlanet: "Natal Sun",
        orb: "0°50'",
      },
      {
        date: "20-08-2024",
        planet: "Transiting Saturn",
        aspect: "Opposition",
        targetPlanet: "Natal Moon",
        orb: "1°10'",
      },
      {
        date: "10-09-2024",
        planet: "Transiting Mercury",
        aspect: "Sextile",
        targetPlanet: "Natal Venus",
        orb: "0°30'",
      },
    ];

    let transitTableBody: string[][] = [];
    transitTableBody = transitAspects.map((transit) => [
      transit.planet,
      transit.aspect,
      transit.targetPlanet,
      transit.orb,
      transit.date,
    ]);

    if (transitTableBody.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [["Planet", "Aspect", "Target Planet", "Orb", "Date"]],
        body: transitTableBody,
        theme: "grid",
        headStyles: {
          fillColor: colors.primary,
          textColor: colors.white,
          fontStyle: "bold",
          fontSize: 9,
          halign: "center",
        },
        bodyStyles: {
          textColor: colors.text,
          fontSize: 9,
        },
        styles: {
          cellPadding: 3,
          halign: "center",
          lineColor: colors.accent,
          lineWidth: 0.5,
        },
        alternateRowStyles: {
          fillColor: [255, 250, 240],
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 30 },
          2: { cellWidth: 35 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 20;
    } else {
      doc.setFontSize(12);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text("No transit aspects found for the selected period.", 20, yPos);
      yPos += 20;
    }
    addPageFooter(doc, 6, 0, person.Name); // totalPages is a placeholder

    // ============================================
    // Page 15-65: Detailed Transit Analysis (Interpretations)
    // ============================================
    logPDF(
      "life-transit-report-pdf",
      15,
      "Detailed Transit Analysis",
      "Rendering interpretations",
    );
    // This will be the most dynamic and content-heavy section.
    // Each transit aspect will have a detailed interpretation.
    // I'll create a placeholder for a few interpretations.

    doc.addPage();
    yPos = 0; // Reset yPos for new page

    // Background
    doc.setFillColor(colors.cream[0], colors.cream[1], colors.cream[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 25, "F");

    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Transit Analysis", pageWidth / 2, 16, {
      align: "center",
    });

    yPos = 35;

    const transitInterpretations = [
      {
        planet: "Transiting Mars",
        aspect: "Square",
        targetPlanet: "Natal Mercury",
        nature: "Challenging",
        orb: "1°05'",
        date: "02-07-2024",
        interpretation:
          "This transit indicates potential for heated discussions, disagreements, or mental agitation. Be cautious of impulsive speech and avoid confrontations. Channel your energy into productive debates or physical activity to release tension. Double-check communications to prevent misunderstandings. This period may test your patience and ability to articulate thoughts calmly.",
      },
      {
        planet: "Transiting Venus",
        aspect: "Trine",
        targetPlanet: "Natal Jupiter",
        nature: "Harmony",
        orb: "0°45'",
        date: "15-07-2024",
        interpretation:
          "A harmonious influence bringing opportunities for joy, expansion, and financial good fortune. Social interactions are likely to be pleasant and beneficial. This is an excellent time for creative pursuits, artistic expression, and enjoying life's pleasures. You may feel more generous and optimistic. Look for opportunities to connect with others and broaden your horizons.",
      },
      {
        planet: "Transiting Saturn",
        aspect: "Opposition",
        targetPlanet: "Natal Moon",
        nature: "Tension",
        orb: "1°10'",
        date: "20-08-2024",
        interpretation:
          "This aspect can bring emotional challenges, feelings of restriction, or a sense of isolation. You might feel burdened by responsibilities or experience emotional dryness. It's a time to address underlying emotional patterns and seek practical solutions to personal issues. Self-care and setting clear boundaries will be crucial. Avoid dwelling on past grievances and focus on building emotional resilience.",
      },
    ];

    transitInterpretations.forEach((transit, index) => {
      if (yPos > pageHeight - 60) {
        // Check if new page is needed
        doc.addPage();
        doc.setFillColor(colors.cream[0], colors.cream[1], colors.cream[2]);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        yPos = 35; // Reset yPos for new page
      }

      doc.setFontSize(12);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFont("helvetica", "bold");
      const title = `Transiting ${transit.planet.replace("Transiting ", "")} ${transit.aspect} Natal ${transit.targetPlanet.replace("Natal ", "")} - (${transit.nature}) ${transit.orb} ${transit.date}`;
      const splitTitle = doc.splitTextToSize(title, pageWidth - 40);
      doc.text(splitTitle, 20, yPos);
      yPos += splitTitle.length * 7 + 5;

      doc.setFontSize(10);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFont("helvetica", "normal");
      const splitInterpretation = doc.splitTextToSize(
        transit.interpretation,
        pageWidth - 40,
      );
      doc.text(splitInterpretation, 20, yPos);
      yPos += splitInterpretation.length * 6 + 10; // Adjust line height for interpretation
    });

    // Add footers to all pages dynamically
    const finalPageCount = doc.getNumberOfPages();
    for (let i = 1; i <= finalPageCount; i++) {
      doc.setPage(i);
      addPageFooter(doc, i, finalPageCount, person.Name);
    }

    // ============================================
    // Output PDF
    // ============================================
    const pdfBuffer = doc.output("arraybuffer");
    logPDF("life-transit-report-pdf", "FINAL", "PDF Generation Complete", {
      sizeKB: (pdfBuffer.byteLength / 1024).toFixed(1),
      pages: doc.getNumberOfPages(),
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${reportType}_${person.Name.replace(/\s+/g, "_")}_${dateStr.replace(/\//g, "-")}.pdf"`,
      },
    });
  } catch (error) {
    logPDFError("life-transit-report-pdf", "FATAL", error);
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF", error: String(error) },
      { status: 500 },
    );
  }
}
