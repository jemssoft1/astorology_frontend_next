/* eslint-disable @typescript-eslint/no-explicit-any */
// route.ts — Main API Endpoint for Western Natal Horoscope PDF

import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { logPDF, logPDFError } from "@/utils/pdfLogger";
import { fetchWesternData } from "./helpers";
import {
  renderCoverPage,
  renderIntroPage,
  renderNatalWheelPage,
  renderPlanetaryPositionsTable,
  renderHouseCuspsTable,
  renderAspectGridPage,
} from "./pdf-pages-1";
import {
  renderAscendantProfile,
  renderPlanetProfiles,
  renderHouseProfiles,
  renderAspectProfiles,
  renderBackCover,
} from "./pdf-pages-2";

export const maxDuration = 60; // Set timeout to 60s

// ═══════════════════════════════════════════════
//  HELPER: ADD FOOTERS & PAGE NUMBERS
// ═══════════════════════════════════════════════
function addFooters(doc: jsPDF, text: string) {
  const pageCount = doc.getNumberOfPages();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    // Skip Cover (1) and Back Cover (last)
    if (i === 1 || i === pageCount) continue;

    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);

    // Left: Text
    doc.text(text, 10, h - 10);

    // Right: Page Number
    doc.text(`Page ${i} of ${pageCount}`, w - 20, h - 10, { align: "right" });

    // Decor line
    doc.setDrawColor(230, 230, 230);
    doc.line(10, h - 15, w - 10, h - 15);
  }
}

// ═══════════════════════════════════════════════
//  POST HANDLER
// ═══════════════════════════════════════════════
export async function POST(req: NextRequest) {
  console.log("🛑 HIT /api/western-natal-horoscope-pdf");
  try {
    const body = await req.json();
    logPDF("western-natal-horoscope-pdf", 0, "Input Parameters", body);

    // Validate essential fields
    if (
      !body.date_of_birth ||
      !body.time_of_birth ||
      !body.latitude ||
      !body.longitude
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: date_of_birth, time_of_birth, latitude, longitude",
        },
        { status: 400 },
      );
    }

    // Parse Input
    const [day, month, year] = body.date_of_birth.split("-").map(Number);
    const [hour, min] = body.time_of_birth.split(":").map(Number);

    const requestPayload = {
      day,
      month,
      year,
      hour,
      min,
      lat: body.latitude,
      lon: body.longitude,
      tzone: body.timezone,
      house_type: body.house_system || "placidus",
    };

    const name = body.name || "User";
    const place = body.place_of_birth || "Unknown Location";

    // Fetch Data
    console.log("Fetching Western Astrology Data...");
    const data = await fetchWesternData(requestPayload);
    logPDF(
      "western-natal-horoscope-pdf",
      0,
      "Fetched Data Keys",
      data ? Object.keys(data) : null,
    );
    logPDF("western-natal-horoscope-pdf", 0, "Basic Data", data?.basic);

    if (!data || !data.basic) {
      throw new Error("Failed to fetch horoscope data from backend.");
    }

    // Extract Data Parts
    const chartData = data.basic.chart_data || {}; // houses[] with nested planets, aspects
    // Handle Natal Wheel Image (Fetch if URL)
    let wheelImage = data.basic.natal_wheel?.chart_url || null;
    if (typeof data.basic.natal_wheel === "string") {
      wheelImage = data.basic.natal_wheel;
    }

    let imageBuffer: Uint8Array | string | null = null;
    if (wheelImage && wheelImage.startsWith("http")) {
      try {
        const imgRes = await fetch(wheelImage);
        if (imgRes.ok) {
          const arrayBuffer = await imgRes.arrayBuffer();
          imageBuffer = new Uint8Array(arrayBuffer);
        }
      } catch (err) {
        console.warn("Failed to fetch natal wheel image:", err);
      }
    } else if (wheelImage) {
      // Assume base64
      imageBuffer = wheelImage;
    }

    // planets/tropical and house_cusps/tropical are fetched as separate endpoints
    // and stored directly at data.basic.planets and data.basic.house_cusps
    const planets = data.basic.planets || [];
    // house_cusps/tropical returns {houses: [...], ascendant, midheaven}
    const cuspsRaw = data.basic.house_cusps;
    const cusps = Array.isArray(cuspsRaw) ? cuspsRaw : cuspsRaw?.houses || [];
    // aspects come from chart_data
    const aspects = chartData.aspects || [];

    console.log("👉 Extracted Logic:");
    console.log(
      "   Planets:",
      Array.isArray(planets) ? planets.length : "object",
    );
    console.log("   Cusps:", Array.isArray(cusps) ? cusps.length : "object");
    console.log("   Aspects:", aspects.length);
    console.log("   Wheel Image:", wheelImage ? "Present" : "Missing");

    logPDF("western-natal-horoscope-pdf", 0, "Planets", planets);
    logPDF("western-natal-horoscope-pdf", 0, "Cusps", cusps);
    logPDF("western-natal-horoscope-pdf", 0, "Aspects", aspects);

    const ascendantReport = data.basic.ascendant_report;
    // House reports come from chart_data.houses or a dedicated endpoint
    const houseReports = chartData.houses || []; // List of house data with planets

    // ═══════════════════════════════════════════════
    //  PDF GENERATION
    // ═══════════════════════════════════════════════
    console.log("Generating Western PDF...");
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // 1. Cover
    logPDF("western-natal-horoscope-pdf", 1, "Cover Page", {
      name,
      dob: body.date_of_birth,
      tob: body.time_of_birth,
      place,
    });
    renderCoverPage(
      doc,
      name,
      body.date_of_birth,
      body.time_of_birth,
      place,
      requestPayload.house_type,
    );

    // 2. Intro
    logPDF("western-natal-horoscope-pdf", 2, "Intro Page", "Rendering");
    renderIntroPage(doc, name);

    // 3. Natal Chart
    logPDF(
      "western-natal-horoscope-pdf",
      3,
      "Natal Wheel",
      imageBuffer ? "Image present" : "No image",
    );
    renderNatalWheelPage(doc, imageBuffer);

    // 4. Planets Table
    logPDF(
      "western-natal-horoscope-pdf",
      4,
      "Planetary Positions Table",
      planets,
    );
    renderPlanetaryPositionsTable(doc, planets);

    // 5. House Cusps Table
    logPDF("western-natal-horoscope-pdf", 5, "House Cusps Table", cusps);
    renderHouseCuspsTable(doc, cusps);

    // 6. Aspect Grid
    logPDF("western-natal-horoscope-pdf", 6, "Aspect Grid", aspects);
    renderAspectGridPage(doc, aspects);

    // 7. Ascendant Profile
    if (ascendantReport) {
      logPDF(
        "western-natal-horoscope-pdf",
        7,
        "Ascendant Profile",
        ascendantReport,
      );
      renderAscendantProfile(doc, ascendantReport);
    }

    // 8. Planet Profiles
    logPDF("western-natal-horoscope-pdf", 8, "Planet Profiles", data.planets);
    renderPlanetProfiles(doc, data.planets);

    // 9. House Profiles
    logPDF("western-natal-horoscope-pdf", 9, "House Profiles", houseReports);
    renderHouseProfiles(doc, houseReports);

    // 10. Aspect Profiles
    // We assume 'aspects' list has basic info, but interpretation might be elsewhere.
    // If 'natal_chart_interpretation' has aspects, use that.
    const aspectInterpretations = data.basic.interpretation?.aspects || aspects;
    logPDF(
      "western-natal-horoscope-pdf",
      10,
      "Aspect Profiles",
      aspectInterpretations,
    );
    renderAspectProfiles(doc, aspectInterpretations);

    // 11. Back Cover
    logPDF("western-natal-horoscope-pdf", 11, "Back Cover", "Rendering");
    renderBackCover(doc);

    // Add Footers
    addFooters(doc, `Natal Report for ${name}`);

    // Output
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    logPDF("western-natal-horoscope-pdf", "FINAL", "PDF Generation Complete", {
      sizeKB: pdfBuffer ? (pdfBuffer.length / 1024).toFixed(1) : "0.0",
      pages: doc.getNumberOfPages(),
    });
    const filename = `Western_Natal_${name.replace(/\s+/g, "_")}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error: any) {
    logPDFError("western-natal-horoscope-pdf", "FATAL", error);
    console.error("Error generating Western PDF:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 },
    );
  }
}
