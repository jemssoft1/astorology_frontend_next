import { NextRequest, NextResponse } from "next/server";
import { fetchAllHoroscopeData } from "@/lib/horoscopeApi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { logPDF, logPDFError } from "@/utils/pdfLogger";

// Define Request Body Interface
interface PdfRequest {
  person: {
    Name: string;
    BirthTime: string;
    BirthLocation: string;
    Latitude: number;
    Longitude: number;
    TimezoneOffset: string;
  };
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

// Sign Lords (Ruler)
const SIGN_LORDS = [
  "Mars", // Aries
  "Venus", // Taurus
  "Mercury", // Gemini
  "Moon", // Cancer
  "Sun", // Leo
  "Mercury", // Virgo
  "Venus", // Libra
  "Mars", // Scorpio
  "Jupiter", // Sagittarius
  "Saturn", // Capricorn
  "Saturn", // Aquarius
  "Jupiter", // Pisces
];

// Nakshatra Names
const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

// Nakshatra Lords (Vimshottari Sequence)
const NAKSHATRA_LORDS = [
  "Ketu", // Ashwini
  "Venus", // Bharani
  "Sun", // Krittika
  "Moon", // Rohini
  "Mars", // Mrigashira
  "Rahu", // Ardra
  "Jupiter", // Punarvasu
  "Saturn", // Pushya
  "Mercury", // Ashlesha
  "Ketu", // Magha
  "Venus", // Purva Phalguni
  "Sun", // Uttara Phalguni
  "Moon", // Hasta
  "Mars", // Chitra
  "Rahu", // Swati
  "Jupiter", // Vishakha
  "Saturn", // Anuradha
  "Mercury", // Jyeshtha
  "Ketu", // Mula
  "Venus", // Purva Ashadha
  "Sun", // Uttara Ashadha
  "Moon", // Shravana
  "Mars", // Dhanishta
  "Rahu", // Shatabhisha
  "Jupiter", // Purva Bhadrapada
  "Saturn", // Uttara Bhadrapada
  "Mercury", // Revati
];

// Planet symbols
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
};

export async function POST(request: NextRequest) {
  try {
    const { person }: PdfRequest = await request.json();
    logPDF("horoscope-pdf", 0, "Input Parameters", person);

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

    // Fetch Horoscope Data
    const horoscopeData = await fetchAllHoroscopeData(
      person.BirthLocation,
      timeStr,
      dateStr,
      person.TimezoneOffset,
    );
    logPDF(
      "horoscope-pdf",
      0,
      "Horoscope Data Keys",
      horoscopeData ? Object.keys(horoscopeData) : null,
    );
    logPDF("horoscope-pdf", 0, "Horoscope Data", horoscopeData);

    // ============================================
    // Initialize PDF Document
    // ============================================
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 0;

    // Define Astrology Color Scheme
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

    // ============================================
    // Page 1: Cover Page with Decorative Border
    // ============================================
    logPDF("horoscope-pdf", 1, "Cover Page", {
      name: person.Name,
      birthTime: person.BirthTime,
      location: person.BirthLocation,
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

    // Corner Decorations (simple geometric)
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

    // Om Symbol (text representation)
    yPos = 50;
    doc.setFontSize(40);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont("helvetica", "bold");
    // doc.text("ॐ", pageWidth / 2, yPos, { align: "center" });

    // Title
    yPos += 25;
    doc.setFontSize(28);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text("Janma Kundali", pageWidth / 2, yPos, { align: "center" });

    yPos += 12;
    doc.setFontSize(22);
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.text("Birth Chart", pageWidth / 2, yPos, { align: "center" });

    // Decorative line
    yPos += 10;
    doc.setDrawColor(
      colors.secondary[0],
      colors.secondary[1],
      colors.secondary[2],
    );
    doc.setLineWidth(2);
    doc.line(50, yPos, pageWidth - 50, yPos);

    // Person Details Box
    yPos += 20;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setLineWidth(1);
    doc.roundedRect(30, yPos, pageWidth - 60, 70, 5, 5, "FD");

    yPos += 15;
    doc.setFontSize(18);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont("helvetica", "bold");
    doc.text(person.Name, pageWidth / 2, yPos, { align: "center" });

    yPos += 15;
    doc.setFontSize(11);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont("helvetica", "normal");

    const birthDateTime = birthDate.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Date of Birth: ${birthDateTime}`, pageWidth / 2, yPos, {
      align: "center",
    });

    yPos += 10;
    doc.text(`Time of Birth: ${timeStr}`, pageWidth / 2, yPos, {
      align: "center",
    });

    yPos += 10;
    doc.text(`Place of Birth: ${person.BirthLocation}`, pageWidth / 2, yPos, {
      align: "center",
    });

    yPos += 10;
    doc.text(
      `Coordinates: ${person.Latitude.toFixed(4)}°N, ${person.Longitude.toFixed(4)}°E`,
      pageWidth / 2,
      yPos,
      { align: "center" },
    );

    // Quick Summary Box
    yPos += 30;

    // Helper to get nested payload value
    const getPayloadValue = (data: any, key: string) => {
      if (data?.Payload?.[key]) return data.Payload[key];
      // Fallback for case sensitivity or nested naming
      if (data?.Payload?.[key.toLowerCase()])
        return data.Payload[key.toLowerCase()];
      // Check if Payload has a child with same name
      if (data?.Payload && typeof data.Payload === "object") {
        const keys = Object.keys(data.Payload);
        // If only one key and it looks like a value, return it
        if (
          keys.length === 1 &&
          (typeof data.Payload[keys[0]] === "string" ||
            typeof data.Payload[keys[0]] === "number")
        ) {
          return data.Payload[keys[0]];
        }
      }
      return "N/A";
    };

    // Extract key data
    const lagnaSignId = getPayloadValue(
      horoscopeData?.lagnaSignName,
      "LagnaSignName",
    );
    const lagnaSign = !isNaN(Number(lagnaSignId))
      ? ZODIAC_SIGNS[Number(lagnaSignId) - 1]
      : String(lagnaSignId);

    const moonSignId = getPayloadValue(
      horoscopeData?.moonSignName,
      "MoonSignName",
    );
    const moonSignName = !isNaN(Number(moonSignId))
      ? ZODIAC_SIGNS[Number(moonSignId) - 1]
      : String(moonSignId);

    const moonConst =
      horoscopeData?.moonConstellation?.Payload?.MoonConstellation;
    const nakshatraIndex = moonConst?.name
      ? parseInt(String(moonConst.name)) - 1
      : -1;
    const nakshatraName =
      nakshatraIndex >= 0 && nakshatraIndex < NAKSHATRAS.length
        ? NAKSHATRAS[nakshatraIndex]
        : "N/A";
    const pada = moonConst?.pada || "N/A";

    // Summary Grid
    const summaryData = [
      ["Ascendant", lagnaSign],
      ["Moon Sign", moonSignName],
      ["Nakshatra", `${nakshatraName} - Pada ${pada}`],
    ];

    doc.setFillColor(colors.chartBg[0], colors.chartBg[1], colors.chartBg[2]);
    doc.roundedRect(30, yPos, pageWidth - 60, 50, 5, 5, "F");

    let summaryY = yPos + 15;
    doc.setFontSize(11);

    summaryData.forEach((item) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text(item[0] + ":", 40, summaryY);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.text(item[1], 110, summaryY);

      summaryY += 14;
    });

    // Footer on cover
    doc.setFontSize(10);
    doc.setTextColor(
      colors.lightText[0],
      colors.lightText[1],
      colors.lightText[2],
    );
    doc.text("Generated by Western Astro", pageWidth / 2, pageHeight - 25, {
      align: "center",
    });
    doc.text(new Date().toLocaleDateString(), pageWidth / 2, pageHeight - 18, {
      align: "center",
    });

    // ============================================
    // Page 2: Lagna Chart (North Indian Style)
    // ============================================
    doc.addPage();

    // Background
    doc.setFillColor(colors.cream[0], colors.cream[1], colors.cream[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 25, "F");

    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Lagna Chart (D1)", pageWidth / 2, 16, {
      align: "center",
    });

    yPos = 35;

    // Parse planetary positions for chart
    const rawPlanetData =
      horoscopeData?.allPlanetData?.Payload?.AllPlanetData?.AllPlanetData;
    const planetPositions: Record<number, string[]> = {};

    // Initialize all houses
    for (let i = 1; i <= 12; i++) {
      planetPositions[i] = [];
    }

    // Get Lagna (Ascendant) house number
    // Fix: Handle string vs number for Sign ID
    const lagnaSignIndex = !isNaN(Number(lagnaSignId))
      ? Number(lagnaSignId) - 1
      : ZODIAC_SIGNS.findIndex(
          (s) => s.toLowerCase() === String(lagnaSign).toLowerCase(),
        );
    const lagnaHouse = lagnaSignIndex >= 0 ? lagnaSignIndex + 1 : 1;

    // Add Ascendant marker
    planetPositions[lagnaHouse].push("As");

    if (Array.isArray(rawPlanetData)) {
      rawPlanetData.forEach((planetObj: Record<string, any>) => {
        const planetName = Object.keys(planetObj)[0];
        const data = planetObj[planetName];

        // Get house number from sign
        const signVal = data.PlanetRasiD1Sign?.Name;
        let houseNum = 1;

        if (typeof signVal === "number" || !isNaN(Number(signVal))) {
          houseNum = Number(signVal);
        } else if (typeof signVal === "string") {
          const signIndex = ZODIAC_SIGNS.findIndex(
            (s) => s.toLowerCase() === signVal.toLowerCase(),
          );
          houseNum = signIndex >= 0 ? signIndex + 1 : 1;
        }

        const symbol = PLANET_SYMBOLS[planetName] || planetName.substring(0, 2);

        // Add retrograde marker
        const retrograde = data.IsPlanetRetrograde === "true" ? "(R)" : "";
        planetPositions[houseNum].push(symbol + retrograde);
      });
    }

    // Draw North Indian Style Chart
    drawNorthIndianChart(
      doc,
      35,
      yPos,
      140,
      planetPositions,
      lagnaHouse,
      colors,
    );

    // Chart Legend
    yPos += 155;
    doc.setFontSize(10);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Planet Abbreviations:", 14, yPos);

    doc.setFont("helvetica", "normal");
    yPos += 8;
    const legendText =
      "Su=Sun, Mo=Moon, Ma=Mars, Me=Mercury, Ju=Jupiter, Ve=Venus, Sa=Saturn, Ra=Rahu, Ke=Ketu, As=Ascendant, (R)=Retrograde";
    const splitLegend = doc.splitTextToSize(legendText, pageWidth - 28);
    doc.text(splitLegend, 14, yPos);

    // ============================================
    // Page 3: Planetary Positions Table
    // ============================================
    doc.addPage();

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

    // Build planet table data
    let planetTableBody: string[][] = [];

    if (Array.isArray(rawPlanetData)) {
      planetTableBody = rawPlanetData.map((planetObj: Record<string, any>) => {
        const planetName = Object.keys(planetObj)[0];
        const data = planetObj[planetName];

        const signId = data.PlanetRasiD1Sign?.Name;
        // Fix string/number handling
        const numSignId = Number(signId);
        const signName =
          !isNaN(numSignId) && numSignId >= 1 && numSignId <= 12
            ? ZODIAC_SIGNS[numSignId - 1]
            : String(signId || "-");

        const constId =
          data.PlanetConstellation?.Name || data.PlanetConstellation;

        // Fix Nakshatra mapping
        const nakshatraIdx = parseInt(String(constId)) - 1;
        const nakshatra =
          nakshatraIdx >= 0 && nakshatraIdx < NAKSHATRAS.length
            ? NAKSHATRAS[nakshatraIdx]
            : String(constId || "-");

        const degree = data.PlanetRasiD1Sign?.DegreesInSign
          ? `${parseFloat(data.PlanetRasiD1Sign.DegreesInSign).toFixed(2)}°`
          : "-";

        const retrograde = data.IsPlanetRetrograde === "true" ? "Yes ↺" : "No";
        const dignity = data.PlanetDignity || "-";

        return [planetName, signName, nakshatra, degree, retrograde, dignity];
      });
    }

    if (planetTableBody.length > 0) {
      autoTable(doc, {
        startY: yPos,
        head: [["Planet", "Sign", "Nakshatra", "Degree", "Retro", "Dignity"]],
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
          0: { halign: "left", fontStyle: "bold", cellWidth: 28 },
          1: { cellWidth: 30 },
          2: { cellWidth: 35 },
          3: { cellWidth: 25 },
          4: { cellWidth: 20 },
          5: { cellWidth: "auto" },
        },
      });

      // @ts-ignore
      yPos = doc.lastAutoTable.finalY + 20;
    }

    // ============================================
    // Bhava (House) Details
    // ============================================
    if (yPos < pageHeight - 80) {
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("House Details", 14, yPos);

      doc.setDrawColor(
        colors.secondary[0],
        colors.secondary[1],
        colors.secondary[2],
      );
      doc.line(14, yPos + 3, 100, yPos + 3);
      yPos += 12;

      const houseSignifications = [
        "1st - Self, Personality, Physical Body",
        "2nd - Wealth, Family, Speech",
        "3rd - Siblings, Courage, Communication",
        "4th - Mother, Home, Happiness",
        "5th - Children, Education, Intelligence",
        "6th - Enemies, Disease, Debts",
        "7th - Marriage, Partnership, Business",
        "8th - Longevity, Obstacles, Inheritance",
        "9th - Fortune, Father, Religion",
        "10th - Career, Fame, Authority",
        "11th - Gains, Income, Elder Siblings",
        "12th - Loss, Foreign, Spirituality",
      ];

      const houseData = houseSignifications.map((sig, index) => {
        const houseNum = index + 1;
        const signIndex = (lagnaHouse - 1 + index) % 12;
        const signName = ZODIAC_SIGNS[signIndex];
        const planets =
          planetPositions[houseNum]?.filter((p) => p !== "As").join(", ") ||
          "-";

        return [`${houseNum}`, signName, planets, sig.split(" - ")[1]];
      });

      autoTable(doc, {
        startY: yPos,
        head: [["House", "Sign", "Planets", "Signification"]],
        body: houseData,
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
          cellPadding: 3,
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [255, 250, 240],
        },
        columnStyles: {
          0: { cellWidth: 15, halign: "center" },
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 35, halign: "center" },
          3: { cellWidth: "auto", halign: "left", fontSize: 8 },
        },
      });
    }

    // ============================================
    // Page 4: Predictions
    // ============================================
    doc.addPage();

    // Background
    doc.setFillColor(colors.cream[0], colors.cream[1], colors.cream[2]);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 25, "F");

    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Predictions & Analysis", pageWidth / 2, 16, {
      align: "center",
    });

    yPos = 35;

    // Predictions Section
    const rawPredictions =
      horoscopeData?.horoscopePredictions?.Payload?.HoroscopePredictions;

    if (Array.isArray(rawPredictions) && rawPredictions.length > 0) {
      rawPredictions.forEach((pred: any, index: number) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          doc.setFillColor(colors.cream[0], colors.cream[1], colors.cream[2]);
          doc.rect(0, 0, pageWidth, pageHeight, "F");
          yPos = 30;
        }

        const description = pred.description || pred.Description || "";

        if (description) {
          // Prediction box
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(
            colors.secondary[0],
            colors.secondary[1],
            colors.secondary[2],
          );

          const splitText = doc.splitTextToSize(description, pageWidth - 50);
          const boxHeight = splitText.length * 5 + 15;

          doc.roundedRect(14, yPos - 5, pageWidth - 28, boxHeight, 3, 3, "FD");

          // Bullet point
          doc.setFillColor(
            colors.secondary[0],
            colors.secondary[1],
            colors.secondary[2],
          );
          doc.circle(22, yPos + 3, 2, "F");

          doc.setFontSize(10);
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          doc.setFont("helvetica", "normal");
          doc.text(splitText, 28, yPos + 5);

          yPos += boxHeight + 8;
        }
      });
    } else {
      // Default predictions based on Lagna
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(14, yPos, pageWidth - 28, 60, 5, 5, "FD");

      yPos += 15;
      doc.setFontSize(11);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFont("helvetica", "normal");

      const defaultPrediction = `Based on your ${lagnaSign} Ascendant and ${moonSignName} Moon Sign, you possess unique qualities that shape your destiny. Your birth star ${nakshatraName} brings specific characteristics and life patterns. Consult a qualified astrologer for detailed predictions.`;

      const splitDefault = doc.splitTextToSize(
        defaultPrediction,
        pageWidth - 50,
      );
      doc.text(splitDefault, 20, yPos);
    }

    // ============================================
    // Add Footer to All Pages
    // ============================================
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer bar
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(0, pageHeight - 12, pageWidth, 12, "F");

      // Footer text
      doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Western Astro | ${person.Name} | Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 4,
        { align: "center" },
      );
    }

    // ============================================
    // Output PDF
    // ============================================
    const pdfBuffer = doc.output("arraybuffer");
    logPDF("horoscope-pdf", "FINAL", "PDF Generation Complete", {
      sizeKB: (pdfBuffer.byteLength / 1024).toFixed(1),
      pages: doc.getNumberOfPages(),
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Kundli_${person.Name.replace(/\s+/g, "_")}_${dateStr.replace(/\//g, "-")}.pdf"`,
      },
    });
  } catch (error) {
    logPDFError("horoscope-pdf", "FATAL", error);
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF", error: String(error) },
      { status: 500 },
    );
  }
}

// ============================================
// Helper Function: Draw North Indian Style Chart
// ============================================
function drawNorthIndianChart(
  doc: jsPDF,
  x: number,
  y: number,
  size: number,
  planetPositions: Record<number, string[]>,
  lagnaHouse: number,
  colors: any,
) {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const halfSize = size / 2;

  // Chart background
  doc.setFillColor(colors.chartBg[0], colors.chartBg[1], colors.chartBg[2]);
  doc.rect(x, y, size, size, "F");

  // Chart border
  doc.setDrawColor(
    colors.chartLine[0],
    colors.chartLine[1],
    colors.chartLine[2],
  );
  doc.setLineWidth(2);
  doc.rect(x, y, size, size);

  // Inner diamond
  doc.setLineWidth(1.5);
  doc.line(centerX, y, x + size, centerY); // Top to Right
  doc.line(x + size, centerY, centerX, y + size); // Right to Bottom
  doc.line(centerX, y + size, x, centerY); // Bottom to Left
  doc.line(x, centerY, centerX, y); // Left to Top

  // Dividing lines for houses
  doc.setLineWidth(1);

  // Top triangles division
  doc.line(centerX, y, centerX, centerY);
  doc.line(x, y, centerX, centerY);
  doc.line(x + size, y, centerX, centerY);

  // Bottom triangles division
  doc.line(centerX, y + size, centerX, centerY);
  doc.line(x, y + size, centerX, centerY);
  doc.line(x + size, y + size, centerX, centerY);

  // Recalculate house positions based on actual North Indian layout
  const northIndianHousePositions: Record<number, { x: number; y: number }> = {
    12: { x: centerX - 20, y: y + 18 },
    1: { x: centerX + 15, y: y + 18 },
    2: { x: x + size - 25, y: y + halfSize * 0.45 },
    3: { x: x + size - 25, y: centerY + 5 },
    4: { x: x + size - 25, y: y + halfSize * 1.55 },
    5: { x: centerX + 15, y: y + size - 18 },
    6: { x: centerX - 20, y: y + size - 18 },
    7: { x: x + 8, y: y + halfSize * 1.55 },
    8: { x: x + 8, y: centerY + 5 },
    9: { x: x + 8, y: y + halfSize * 0.45 },
    10: { x: centerX - 15, y: centerY - 10 },
    11: { x: centerX + 10, y: centerY + 15 },
  };

  // Draw house numbers and planets
  doc.setFontSize(7);

  for (let house = 1; house <= 12; house++) {
    const pos = northIndianHousePositions[house];
    if (!pos) continue;

    // House number (small, in corner)
    doc.setTextColor(
      colors.lightText[0],
      colors.lightText[1],
      colors.lightText[2],
    );
    doc.setFont("helvetica", "normal");
    doc.text(String(house), pos.x, pos.y - 2);

    // Planets in this house
    const planets = planetPositions[house] || [];
    if (planets.length > 0) {
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);

      const planetText = planets.join(" ");
      doc.text(planetText, pos.x, pos.y + 8);
    }
  }

  // Draw "Lagna" marker in center
  doc.setFontSize(10);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text("D1", centerX, centerY, { align: "center" });

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Lagna Chart", centerX, centerY + 8, { align: "center" });
}

// ============================================
// Helper Function: Draw Corner Decoration
// ============================================
function drawCornerDecoration(
  doc: jsPDF,
  x: number,
  y: number,
  color: [number, number, number],
  flipX: boolean = false,
  flipY: boolean = false,
) {
  const size = 15;
  const dirX = flipX ? -1 : 1;
  const dirY = flipY ? -1 : 1;

  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(1);

  // Simple corner lines
  doc.line(x, y, x + size * dirX, y);
  doc.line(x, y, x, y + size * dirY);

  // Small decorative diamond
  const cx = x + 8 * dirX;
  const cy = y + 8 * dirY;
  doc.setFillColor(color[0], color[1], color[2]);
  doc.circle(cx, cy, 1.5, "F");
}
