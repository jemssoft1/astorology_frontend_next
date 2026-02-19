// route.ts — Basic Horoscope Report PDF API endpoint
// POST /api/basic-horoscope-pdf
// Generates a structured 13-page Basic Horoscope PDF report
import { NextRequest, NextResponse } from "next/server";
import { logPDF, logPDFError } from "@/utils/pdfLogger";
import { jsPDF } from "jspdf";
import {
  DASHA_ORDER_PAGE7,
  DASHA_ORDER_PAGE8,
  getBasicLabels,
} from "./constants";
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
  renderYoginiDasha3Page,
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
    logPDF("basic-horoscope-pdf", 0, "Input Parameters", body);

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

    if (day < 1 || day > 32 || month < 1 || month > 13 || year < 1900) {
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
    logPDF("basic-horoscope-pdf", 0, "API Params", params);
    const Kalsarpabody = {
      day,
      month,
      year,
      hour,
      min,
      lat: body.latitude,
      lon: body.longitude,
      tzone: body.timezone,
      location: {
        latitude: body.latitude,
        longitude: body.longitude,
        timezone: body.timezone,
      },
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
      fetchKalsarpaData(Kalsarpabody),
      fetchManglikSadhesatiData(params),
      fetchGemstoneData(params),
    ]);

    // Use apiData for all sections as they are now included in fetchAllBasicHoroscopeData
    logPDF("basic-horoscope-pdf", 0, "All API Data Keys", Object.keys(apiData));
    logPDF("basic-horoscope-pdf", 0, "astro_details", apiData.astro_details);
    logPDF("basic-horoscope-pdf", 0, "birth_details", apiData.birth_details);
    logPDF("basic-horoscope-pdf", 0, "planets", apiData.planets);
    logPDF("basic-horoscope-pdf", 0, "panchang", apiData.panchang);
    logPDF("basic-horoscope-pdf", 0, "major_vdasha", apiData.major_vdasha);
    logPDF("basic-horoscope-pdf", 0, "current_vdasha", apiData.current_vdasha);
    logPDF("basic-horoscope-pdf", 0, "house_cusps", apiData.kp_house_cusps);
    logPDF(
      "basic-horoscope-pdf",
      0,
      "general_ascendant_report",
      apiData.general_ascendant_report,
    );
    logPDF("basic-horoscope-pdf", 0, "simple_manglik", apiData.simple_manglik);
    logPDF("basic-horoscope-pdf", 0, "yoginiData", yoginiData);
    logPDF("basic-horoscope-pdf", 0, "numerologyData", numerologyData);
    logPDF("basic-horoscope-pdf", 0, "kalsarpaData", kalsarpaData);
    logPDF("basic-horoscope-pdf", 0, "gemstoneData", gemstoneData);

    // Merge manglik from apiData with sadhesati from manglikSadhesatiData
    const manglikData = { ...apiData, ...manglikSadhesatiData };
    const gemData = gemstoneData;

    // Fetch sub-dasha (antardasha) for all 9 mahadasha planets
    const allDashaPlanets = [...DASHA_ORDER_PAGE7, ...DASHA_ORDER_PAGE8];
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

    // Page 1: Cover Page
    logPDF("basic-horoscope-pdf", 1, "Cover Page", {
      name: body.name,
      dob: body.date_of_birth,
      tob: body.time_of_birth,
      pob: body.place_of_birth,
    });
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
    logPDF("basic-horoscope-pdf", 2, "Basic Astrological Details", {
      astro_details: apiData.astro_details,
      birth_details: apiData.birth_details,
      panchang: apiData.panchang,
    });
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
    logPDF("basic-horoscope-pdf", 3, "Planetary Positions", apiData.planets);
    renderPlanetaryPositionsPage(doc, apiData, L);

    // Page 4: Horoscope Charts (Lagna, Moon, Navamsha)
    logPDF(
      "basic-horoscope-pdf",
      4,
      "Horoscope Charts",
      "Rendering Lagna, Moon, Navamsha",
    );
    renderChartsPage(doc, apiData, L);

    // Page 5: Divisional Charts (3×3 grid)
    logPDF("basic-horoscope-pdf", 5, "Divisional Charts", "Rendering 3x3 grid");
    renderDivisionalChartsPage(doc, apiData, lang, L);

    // Page 6: House Cusps and Sandhi
    logPDF(
      "basic-horoscope-pdf",
      6,
      "House Cusps and Sandhi",
      apiData.kp_house_cusps,
    );
    renderHouseCuspsPage(doc, apiData, lang, L);

    // Page 7: Vimshottari Dasha I
    logPDF("basic-horoscope-pdf", 7, "Vimshottari Dasha I", {
      major_vdasha: apiData.major_vdasha,
      subDashaData,
    });
    renderVimshottariDasha1Page(doc, apiData, subDashaData, L);

    // Page 8: Vimshottari Dasha II + Current Dasha
    logPDF("basic-horoscope-pdf", 8, "Vimshottari Dasha II + Current Dasha", {
      current_vdasha: apiData.current_vdasha,
    });
    renderVimshottariDasha2Page(doc, apiData, subDashaData, L);

    // Page 9: Yogini Dasha I
    logPDF("basic-horoscope-pdf", 9, "Yogini Dasha I", yoginiData);
    renderYoginiDasha1Page(doc, yoginiData, L);

    // Page 10: Yogini Dasha II
    logPDF("basic-horoscope-pdf", 10, "Yogini Dasha II", "Rendering");
    renderYoginiDasha2Page(doc, yoginiData, L);

    // Page 11: Yogini Dasha III
    logPDF("basic-horoscope-pdf", 11, "Yogini Dasha III", "Rendering");
    renderYoginiDasha3Page(doc, yoginiData, L);

    // Page 12: Favourable Points
    logPDF("basic-horoscope-pdf", 12, "Favourable Points", numerologyData);
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
    logPDF("basic-horoscope-pdf", 13, "Numerology Report", numerologyData);
    renderNumerologyReportPage(doc, numerologyData, lang, L);

    // Page 14: Kalsarpa Dosha
    logPDF("basic-horoscope-pdf", 14, "Kalsarpa Dosha", kalsarpaData);
    renderKalsarpaDoshaPage(doc, kalsarpaData, L);

    // Page 15: Kalsarpa Report
    logPDF("basic-horoscope-pdf", 15, "Kalsarpa Effect Report", kalsarpaData);
    renderKalsarpaEffectPage(doc, kalsarpaData, L);

    // Page 16: Manglik Analysis I
    logPDF("basic-horoscope-pdf", 16, "Manglik Analysis I", {
      manglik: manglikData?.manglik,
      simple_manglik: apiData.simple_manglik,
    });
    renderManglik1Page(doc, manglikData, apiData.simple_manglik || null, L);

    // Page 17: Manglik Analysis II
    logPDF("basic-horoscope-pdf", 17, "Manglik Analysis II", "Rendering");
    renderManglik2Page(doc, manglikData, apiData.simple_manglik || null, L);

    // Page 18: Sadhesati Analysis
    logPDF(
      "basic-horoscope-pdf",
      18,
      "Sadhesati Analysis",
      manglikData?.sadhesati_current_status,
    );
    renderSadhesatiPage(doc, manglikData, L);

    // Page 19: Gemstone Suggestions
    logPDF("basic-horoscope-pdf", 19, "Gemstone Suggestions", gemData);
    renderGemstoneSuggestionsPage(doc, gemData, L);

    // Page 20: Life Stone
    logPDF("basic-horoscope-pdf", 20, "Life Stone Detail", "Rendering");
    renderGemstoneDetailPage(doc, gemData, "life", L);

    // Page 21: Benefic Stone
    logPDF("basic-horoscope-pdf", 21, "Benefic Stone Detail", "Rendering");
    renderGemstoneDetailPage(doc, gemData, "benefic", L);

    // Page 22: Lucky Stone
    logPDF("basic-horoscope-pdf", 22, "Lucky Stone Detail", "Rendering");
    renderGemstoneDetailPage(doc, gemData, "lucky", L);

    const ascendant = apiData.astro_details?.ascendant || "Aries";
    logPDF("basic-horoscope-pdf", 0, "Ascendant Resolved", ascendant);

    // Page 23: Ascendant Report I
    logPDF("basic-horoscope-pdf", 23, "Ascendant Report I", { ascendant });
    renderAscendantReport1Page(doc, ascendant, L);

    // Page 24: Ascendant Report II
    logPDF(
      "basic-horoscope-pdf",
      24,
      "Ascendant Report II",
      apiData.general_ascendant_report,
    );
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
    logPDF("basic-horoscope-pdf", "FINAL", "PDF Generation Complete", {
      sizeKB: (pdfBuffer.byteLength / 1024).toFixed(1),
      pages: doc.getNumberOfPages(),
    });
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
    logPDFError("basic-horoscope-pdf", "FATAL", error);
    console.error("Basic Horoscope PDF Generation Error:", error);
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
