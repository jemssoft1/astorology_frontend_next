// route.ts — Mini Horoscope Report PDF API endpoint
// POST /api/mini-horoscope-pdf
// Generates a structured 9-page Mini Horoscope PDF report
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { getLabels, DASHA_ORDER_PAGE5, DASHA_ORDER_PAGE6 } from "./constants";
import { logPDF, logPDFError } from "@/utils/pdfLogger";
import {
  BirthParams,
  fetchAllMiniHoroscopeData,
  fetchSubDasha,
  addFooters,
} from "./helpers";
import {
  renderCoverPage,
  renderBasicDetailsPage,
  renderPlanetaryPositionsPage,
  renderChartsPage,
  renderDashaPage1,
  renderAscendantPage,
  renderAscendantAnalysisPage,
  renderDisclaimerPage,
  renderDashaPage3,
} from "./pdf-pages";

// Request body interface
interface MiniHoroscopeRequest {
  name: string;
  date_of_birth: string; // DD-MM-YYYY
  time_of_birth: string; // HH:MM
  place_of_birth: string;
  latitude: number;
  longitude: number;
  timezone: number;
  language?: "en" | "hi";
}

export async function POST(request: NextRequest) {
  try {
    const body: MiniHoroscopeRequest = await request.json();
    logPDF("mini-horoscope-pdf", 0, "Input Parameters", body);

    // Validate required fields
    const requiredFields: (keyof MiniHoroscopeRequest)[] = [
      "name",
      "date_of_birth",
      "time_of_birth",
      "place_of_birth",
      "latitude",
      "longitude",
      "timezone",
    ];
    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        return NextResponse.json(
          { status: "Fail", message: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Parse date and time
    const [day, month, year] = body.date_of_birth.split("-").map(Number);
    const [hour, min] = body.time_of_birth.split(":").map(Number);

    if (!day || !month || !year || isNaN(hour) || isNaN(min)) {
      return NextResponse.json(
        {
          status: "Fail",
          message:
            "Invalid date_of_birth (DD-MM-YYYY) or time_of_birth (HH:MM)",
        },
        { status: 400 },
      );
    }

    // Validate ranges
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
      return NextResponse.json(
        { status: "Fail", message: "Invalid date values" },
        { status: 400 },
      );
    }
    if (
      body.latitude < -90 ||
      body.latitude > 90 ||
      body.longitude < -180 ||
      body.longitude > 180
    ) {
      return NextResponse.json(
        { status: "Fail", message: "Invalid latitude or longitude" },
        { status: 400 },
      );
    }

    const lang = body.language === "hi" ? "hi" : "en";
    const L = getLabels(lang);

    // Build API params
    const params: BirthParams = {
      day,
      month,
      year,
      hour,
      min,
      lat: body.latitude,
      lon: body.longitude,
      tzone: body.timezone,
    };

    // Fetch all horoscope data in parallel
    const apiData = await fetchAllMiniHoroscopeData(params);

    // Fetch sub-dasha (antardasha) for all 9 mahadasha planets
    const allDashaPlanets = [...DASHA_ORDER_PAGE5, ...DASHA_ORDER_PAGE6];
    const subDashaPromises = allDashaPlanets.map((planet) =>
      fetchSubDasha(planet, params).then((data) => ({ planet, data })),
    );
    const subDashaResults = await Promise.allSettled(subDashaPromises);
    const subDashaData: Record<string, any> = {};
    subDashaResults.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        subDashaData[result.value.planet] = result.value.data;
      }
    });

    // ============================================
    // Generate PDF — 9 Pages
    // ============================================
    const doc = new jsPDF();

    renderCoverPage(
      doc,
      body.name,
      body.date_of_birth,
      body.time_of_birth,
      body.place_of_birth,
      lang,
      L,
    );

    renderBasicDetailsPage(
      doc,
      body.name,
      body.date_of_birth,
      body.time_of_birth,
      body.place_of_birth,
      body.latitude,
      body.longitude,
      body.timezone,
      apiData,
      L,
    );

    // Page 3: Planetary Positions
    renderPlanetaryPositionsPage(doc, apiData, L);

    // Page 4: Horoscope Charts
    renderChartsPage(doc, apiData, L);

    // Page 5: Vimshottari Dasha I
    renderDashaPage1(doc, apiData, subDashaData, L);

    // Page 7: Vimshottari Dasha II + Current Dasha

    renderDashaPage3(doc, apiData, subDashaData, L);

    // Page 8: Ascendant Report

    const ascName = renderAscendantPage(doc, apiData, L);

    // Page 9: Ascendant Analysis Continued
    renderAscendantAnalysisPage(doc, ascName, L);

    // Page 10: Disclaimer
    renderDisclaimerPage(doc, L);

    // Add footers to all pages
    addFooters(doc, body.name);

    // Output PDF
    const pdfBuffer = doc.output("arraybuffer");
    logPDF("mini-horoscope-pdf", "FINAL", "PDF Generation Complete", {
      sizeKB: (pdfBuffer.byteLength / 1024).toFixed(1),
      pages: doc.getNumberOfPages(),
    });
    const safeName = body.name.replace(/\s+/g, "_");
    const safeDate = body.date_of_birth.replace(/-/g, "_");

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Mini_Horoscope_${safeName}_${safeDate}.pdf"`,
      },
    });
  } catch (error) {
    logPDFError("mini-horoscope-pdf", "FATAL", error);
    console.error("Mini Horoscope PDF Generation Error:", error);
    return NextResponse.json(
      {
        status: "Fail",
        message: "Failed to generate PDF",
        error: String(error),
      },
      { status: 500 },
    );
  }
}
