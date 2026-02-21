// route.ts — Basic Horoscope Report PDF API endpoint
// POST /api/basic-horoscope-pdf
// Generates a structured 13-page Basic Horoscope PDF report
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { registerDevanagariFont } from "./font-loader";
import { DASHA_ORDER_PAGE7, getBasicLabels } from "./constants";
import {
  BirthParams,
  fetchAllBasicHoroscopeData,
  fetchYoginiDashaData,
  fetchNumerologyData,
  fetchSubDasha,
  addFooters,
  fetchKalsarpaData,
  fetchManglikSadhesatiData,
  fetchGemstoneData,
} from "./helpers";
import {
  renderCoverPage,
  renderBasicDetailsPage,
  renderPlanetaryPositionsPage,
  renderChartsPage,
  renderDivisionalChartsPage,
  renderHouseCuspsPage,
  renderVimshottariDasha1Page,
  renderVimshottariDasha2Page,
  renderYoginiDasha1Page,
  renderYoginiDasha2Page,
  // renderYoginiDasha3Page,
  renderFavourablePointsPage,
  renderNumerologyReportPage,
  renderKalsarpaDoshaPage,
  renderKalsarpaEffectPage,
  renderManglik1Page,
  renderManglik2Page,
  renderSadhesatiPage,
  renderGemstoneSuggestionsPage,
  renderGemstoneDetailPage,
  renderAscendantReport1Page,
  renderAscendantReport2Page,
} from "./pdf-pages";

// Request body interface
interface BasicHoroscopeRequest {
  name: string;
  date_of_birth: string; // DD-MM-YYYY
  time_of_birth: string; // HH:MM
  place_of_birth: string;
  latitude: number;
  longitude: number;
  timezone: number;
  language?: "en" | "hi";
  day?: number;
  month?: number;
  year?: number;
  hour?: number;
  min?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: BasicHoroscopeRequest = await request.json();

    // Validate required fields
    const requiredFields: (keyof BasicHoroscopeRequest)[] = [
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

    // Parse date and time — prefer explicit fields, fallback to parsing strings
    let day = body.day;
    let month = body.month;
    let year = body.year;
    let hour = body.hour;
    let min = body.min;

    if (!day || !month || !year) {
      const parts = body.date_of_birth.split("-").map(Number);
      day = parts[0];
      month = parts[1];
      year = parts[2];
    }

    if (hour === undefined || min === undefined) {
      const parts = body.time_of_birth.split(":").map(Number);
      hour = parts[0];
      min = parts[1];
    }

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
    const L = getBasicLabels(lang);

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

    // Fetch all data in parallel
    const [
      apiData,
      yoginiData,
      numerologyData,
      kalsarpaData,
      manglikSadhesatiData,
      gemstoneData,
    ] = await Promise.all([
      fetchAllBasicHoroscopeData(params),
      fetchYoginiDashaData(params),
      fetchNumerologyData(params, body.name),
      fetchKalsarpaData(params),
      fetchManglikSadhesatiData(params),
      fetchGemstoneData(params),
    ]);
    // Merge manglik from apiData with sadhesati from manglikSadhesatiData
    const manglikData = { ...apiData, ...manglikSadhesatiData };
    const gemData = gemstoneData;

    // Fetch sub-dasha (antardasha) for all 9 mahadasha planets
    const allDashaPlanets = [...DASHA_ORDER_PAGE7];
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
    // Generate PDF — 13 Pages
    // ============================================
    const doc = new jsPDF();
    registerDevanagariFont(doc);

    // Page 1: Cover Page

    renderCoverPage(
      doc,
      body.name,
      body.date_of_birth,
      body.time_of_birth,
      body.place_of_birth,
      lang,
      L,
    );

    // Page 2: Basic Astrological Details

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

    // Page 4: Horoscope Charts (Lagna, Moon, Navamsha)

    renderChartsPage(doc, apiData, L);

    // Page 5: Divisional Charts (3×3 grid)

    renderDivisionalChartsPage(doc, apiData, lang, L);

    // Page 6: House Cusps and Sandhi

    renderHouseCuspsPage(doc, apiData, lang, L);

    // Page 7: Vimshottari Dasha I

    renderVimshottariDasha1Page(doc, apiData, subDashaData, L);

    // Page 8: Vimshottari Dasha II + Current Dasha

    renderVimshottariDasha2Page(doc, apiData, subDashaData, L);

    // Page 9: Yogini Dasha I

    renderYoginiDasha1Page(doc, yoginiData, L);

    // Page 10: Yogini Dasha II

    renderYoginiDasha2Page(doc, yoginiData, L);

    // Page 11: Yogini Dasha III

    //renderYoginiDasha3Page(doc, yoginiData, L);

    // Page 12: Favourable Points

    renderFavourablePointsPage(
      doc,
      apiData,
      numerologyData,
      body.name,
      body.date_of_birth,
      lang,
      L,
    );

    // Page 13: Numerology Report

    renderNumerologyReportPage(doc, numerologyData, lang, L);

    // Page 14: Kalsarpa Dosha
    if (kalsarpaData?.kalsarpa_details?.present) {
      renderKalsarpaDoshaPage(doc, kalsarpaData, L);
    }

    // Page 15: Kalsarpa Report

    if (kalsarpaData?.kalsarpa_details?.present) {
      renderKalsarpaEffectPage(doc, kalsarpaData, L);
    }

    // Page 16: Manglik Analysis I

    renderManglik1Page(doc, manglikData, apiData.simple_manglik || null, L);

    // Page 17: Manglik Analysis II

    renderManglik2Page(doc, manglikData, apiData.simple_manglik || null, L);

    // Page 18: Sadhesati Analysis

    renderSadhesatiPage(doc, manglikData, L);

    // Page 19: Gemstone Suggestions

    renderGemstoneSuggestionsPage(doc, gemData, L);

    // Page 20: Life Stone

    renderGemstoneDetailPage(doc, gemData, "life", L);

    // Page 21: Benefic Stone

    renderGemstoneDetailPage(doc, gemData, "benefic", L);

    // Page 22: Lucky Stone

    renderGemstoneDetailPage(doc, gemData, "lucky", L);

    const ascendant = apiData.astro_details?.ascendant || "Aries";

    // Page 23: Ascendant Report I

    renderAscendantReport1Page(doc, ascendant, L);

    // Page 24: Ascendant Report II

    renderAscendantReport2Page(
      doc,
      ascendant,
      apiData.general_ascendant_report,
      L,
    );

    // Add footers to all pages
    addFooters(doc, body.name);

    // Output PDF
    const pdfBuffer = doc.output("arraybuffer");

    const safeName = body.name.replace(/\s+/g, "_");
    const safeDate = body.date_of_birth.replace(/-/g, "_");

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Basic_Horoscope_${safeName}_${safeDate}.pdf"`,
      },
    });
  } catch (error) {
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
