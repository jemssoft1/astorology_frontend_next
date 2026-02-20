/* eslint-disable @typescript-eslint/no-explicit-any */
// route.ts — Main API Endpoint for Western Natal Horoscope PDF

import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
  try {
    const body = await req.json();

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

    const data = await fetchWesternData(requestPayload);

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

    const ascendantReport = data.basic.ascendant_report;
    // House reports come from chart_data.houses or a dedicated endpoint
    const houseReports = chartData.houses || []; // List of house data with planets

    // ═══════════════════════════════════════════════
    //  PDF GENERATION
    // ═══════════════════════════════════════════════

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // 1. Cover
    renderCoverPage(
      doc,
      name,
      body.date_of_birth,
      body.time_of_birth,
      place,
      requestPayload.house_type,
    );

    // 2. Intro
    // Page 2: Intro / Basic Details

    renderIntroPage(doc, name);

    // 3. Natal Chart
    renderNatalWheelPage(doc, imageBuffer);

    // 4. Planets Table
    renderPlanetaryPositionsTable(doc, planets);

    // 5. House Cusps Table
    renderHouseCuspsTable(doc, cusps);

    // 6. Aspect Grid
    renderAspectGridPage(doc, aspects);

    // 7. Ascendant Profile
    if (ascendantReport) {
      renderAscendantProfile(doc, ascendantReport);
    }

    // 8. Planet Profiles
    renderPlanetProfiles(doc, data.planets);

    // 9. House Profiles
    renderHouseProfiles(doc, houseReports);

    // 10. Aspect Profiles
    // We assume 'aspects' list has basic info, but interpretation might be elsewhere.
    // If 'natal_chart_interpretation' has aspects, use that.
    const aspectInterpretations = data.basic.interpretation?.aspects || aspects;
    renderAspectProfiles(doc, aspectInterpretations);

    // 11. Back Cover

    renderBackCover(doc);

    // Add Footers
    addFooters(doc, `Natal Report for ${name}`);

    // Output
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
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
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 },
    );
  }
}
