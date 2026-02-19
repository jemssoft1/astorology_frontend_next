// route.ts — API endpoint for Professional Horoscope PDF generation
// POST /api/professional-horoscope-pdf

import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { logPDF, logPDFError } from "@/utils/pdfLogger";

import {
  getProfessionalLabels,
  DASHA_ORDER_PAGE7,
  DASHA_ORDER_PAGE8,
} from "./constants";
import {
  fetchAllProfessionalData,
  fetchAshtakvargaData,
  fetchCharDashaData,
  fetchYoginiDashaData,
  fetchNumerologyData,
  fetchKalsarpaData,
  fetchGemstoneData,
  fetchSubDasha,
  addFooters,
} from "./helpers";
import type { BirthParams } from "./helpers";

// PDF Pages
import {
  renderCoverPage,
  renderBasicDetailsPage,
  renderPlanetaryPositionsPage,
  renderHoroscopeChartsPage,
  renderHouseCuspsPage,
  renderDivisionalChartsPage1,
  renderDivisionalChartsPage2,
  renderCompositeFriendshipPage,
  renderFiveFoldFriendshipPage,
  renderKPPlanetaryPage,
  renderKPHouseCuspsPage,
} from "./pdf-pages-1";

import {
  renderAshtakvargaPages,
  renderSarvashtakPage,
  renderVimshottariDasha1Page,
  renderVimshottariDasha2Page,
  renderYoginiDashaPages,
  renderCharDashaPages,
} from "./pdf-pages-2";

import {
  renderKalsarpaPages,
  renderManglikPages,
  renderSadhesatiPages,
  renderGemstonePages,
  renderRudrakshaPage,
  renderFavourablePointsPage,
  renderNumerologyPages,
  renderAscendantPages,
} from "./pdf-pages-3";

import {
  renderPlanetProfileCover,
  renderPlanetProfilePages,
} from "./pdf-pages-4";

// ──────────────────────────────────────────────
// Request Interface
// ──────────────────────────────────────────────
interface ProfessionalHoroscopeRequest {
  name: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
  lang?: string;
  place?: string;
}

// ──────────────────────────────────────────────
// POST Handler
// ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: ProfessionalHoroscopeRequest = await request.json();
    logPDF("professional-horoscope-pdf", 0, "Input Parameters", body);

    // Validate required fields
    const requiredFields = [
      "name",
      "day",
      "month",
      "year",
      "hour",
      "min",
      "lat",
      "lon",
      "tzone",
    ];
    for (const field of requiredFields) {
      if (
        body[field as keyof ProfessionalHoroscopeRequest] === undefined ||
        body[field as keyof ProfessionalHoroscopeRequest] === null
      ) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const lang = body.lang || "en";
    const L = getProfessionalLabels(lang);

    const birthParams: BirthParams = {
      day: body.day,
      month: body.month,
      year: body.year,
      hour: body.hour,
      min: body.min,
      lat: body.lat,
      lon: body.lon,
      tzone: body.tzone,
    };

    const dob = `${body.day}/${body.month}/${body.year}`;
    const tob = `${body.hour}:${String(body.min).padStart(2, "0")}`;
    const pob = body.place || "N/A";

    // ════════════════════════════════════════════
    // PHASE 1: Parallel Data Fetching
    // ════════════════════════════════════════════
    console.log("[Professional PDF] Starting data fetch...");
    const startTime = Date.now();

    const [
      mainData,
      ashtakvargaData,
      charDashaData,
      yoginiData,
      numerologyData,
      kalsarpaData,
      gemstoneData,
    ] = await Promise.all([
      fetchAllProfessionalData(birthParams),
      fetchAshtakvargaData(birthParams),
      fetchCharDashaData(birthParams),
      fetchYoginiDashaData(birthParams),
      fetchNumerologyData(birthParams, body.name),
      fetchKalsarpaData(birthParams),
      fetchGemstoneData(birthParams),
    ]);

    console.log(
      `[Professional PDF] Data fetched in ${Date.now() - startTime}ms`,
    );
    logPDF(
      "professional-horoscope-pdf",
      0,
      "mainData keys",
      Object.keys(mainData),
    );
    logPDF("professional-horoscope-pdf", 0, "ashtakvargaData", ashtakvargaData);
    logPDF("professional-horoscope-pdf", 0, "charDashaData", charDashaData);
    logPDF("professional-horoscope-pdf", 0, "yoginiData", yoginiData);
    logPDF("professional-horoscope-pdf", 0, "numerologyData", numerologyData);
    logPDF("professional-horoscope-pdf", 0, "kalsarpaData", kalsarpaData);
    logPDF("professional-horoscope-pdf", 0, "gemstoneData", gemstoneData);

    // Fetch sub-dasha for all 9 planets
    const allDashaPlanets = [...DASHA_ORDER_PAGE7, ...DASHA_ORDER_PAGE8];
    const subDashaPromises = allDashaPlanets.map((planet) =>
      fetchSubDasha(planet, birthParams).then((data) => ({ planet, data })),
    );
    const subDashaResults = await Promise.allSettled(subDashaPromises);
    const subDashaData: Record<string, any> = {};
    subDashaResults.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        subDashaData[result.value.planet] = result.value.data;
      }
    });
    logPDF("professional-horoscope-pdf", 0, "Sub-Dasha Data", subDashaData);

    // ════════════════════════════════════════════
    // PHASE 2: PDF Generation
    // ════════════════════════════════════════════
    console.log("[Professional PDF] Starting PDF generation...");
    const pdfStart = Date.now();

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // ── Pages 1–11 (pdf-pages-1) ──
    logPDF("professional-horoscope-pdf", 1, "Cover Page", {
      name: body.name,
      dob,
      tob,
      pob,
    });
    renderCoverPage(doc, body.name, dob, tob, pob, lang, L);
    logPDF(
      "professional-horoscope-pdf",
      2,
      "Basic Details Page",
      mainData.astro_details,
    );
    renderBasicDetailsPage(doc, mainData, L);
    logPDF(
      "professional-horoscope-pdf",
      3,
      "Planetary Positions",
      mainData.planets,
    );
    renderPlanetaryPositionsPage(doc, mainData, L);
    logPDF("professional-horoscope-pdf", 4, "Horoscope Charts", "Rendering");
    renderHoroscopeChartsPage(doc, mainData, L);
    logPDF(
      "professional-horoscope-pdf",
      5,
      "House Cusps",
      mainData.kp_house_cusps,
    );
    renderHouseCuspsPage(doc, mainData, lang, L);
    logPDF("professional-horoscope-pdf", 6, "Divisional Charts 1", "Rendering");
    renderDivisionalChartsPage1(doc, mainData, lang, L);
    logPDF("professional-horoscope-pdf", 7, "Divisional Charts 2", "Rendering");
    renderDivisionalChartsPage2(doc, mainData, lang, L);
    logPDF(
      "professional-horoscope-pdf",
      8,
      "Composite Friendship",
      "Rendering",
    );
    renderCompositeFriendshipPage(doc, mainData, L);
    logPDF(
      "professional-horoscope-pdf",
      9,
      "Five-Fold Friendship",
      "Rendering",
    );
    renderFiveFoldFriendshipPage(doc, mainData, L);
    logPDF("professional-horoscope-pdf", 10, "KP Planetary", "Rendering");
    renderKPPlanetaryPage(doc, mainData, L);
    logPDF("professional-horoscope-pdf", 11, "KP House Cusps", "Rendering");
    renderKPHouseCuspsPage(doc, mainData, L);

    // ── Pages 12–27 (pdf-pages-2) ──
    logPDF(
      "professional-horoscope-pdf",
      12,
      "Ashtakvarga Pages",
      ashtakvargaData,
    );
    renderAshtakvargaPages(doc, ashtakvargaData, lang, L);
    logPDF("professional-horoscope-pdf", 13, "Sarvashtakvarga", "Rendering");
    renderSarvashtakPage(doc, ashtakvargaData, lang, L);
    logPDF("professional-horoscope-pdf", 14, "Vimshottari Dasha I", {
      major_vdasha: mainData.major_vdasha,
      subDashaData,
    });
    renderVimshottariDasha1Page(doc, mainData, subDashaData, L);
    logPDF(
      "professional-horoscope-pdf",
      15,
      "Vimshottari Dasha II",
      mainData.current_vdasha,
    );
    renderVimshottariDasha2Page(doc, mainData, subDashaData, L);
    logPDF("professional-horoscope-pdf", 16, "Yogini Dasha Pages", yoginiData);
    renderYoginiDashaPages(doc, yoginiData, L);
    logPDF("professional-horoscope-pdf", 17, "Char Dasha Pages", charDashaData);
    renderCharDashaPages(doc, charDashaData, L);

    // ── Pages 28–47 (pdf-pages-3) ──
    logPDF("professional-horoscope-pdf", 28, "Kalsarpa Pages", kalsarpaData);
    renderKalsarpaPages(doc, kalsarpaData, lang, L);
    logPDF("professional-horoscope-pdf", 30, "Manglik Pages", mainData.manglik);
    renderManglikPages(doc, mainData, lang, L);
    logPDF(
      "professional-horoscope-pdf",
      32,
      "Sadhesati Pages",
      mainData.sadhesati_current_status,
    );
    renderSadhesatiPages(doc, mainData, lang, L);
    logPDF("professional-horoscope-pdf", 34, "Gemstone Pages", gemstoneData);
    renderGemstonePages(doc, gemstoneData, lang, L);
    logPDF("professional-horoscope-pdf", 36, "Rudraksha Page", "Rendering");
    renderRudrakshaPage(doc, mainData, lang, L);
    logPDF(
      "professional-horoscope-pdf",
      37,
      "Favourable Points",
      numerologyData,
    );
    renderFavourablePointsPage(doc, mainData, numerologyData, L);
    logPDF(
      "professional-horoscope-pdf",
      38,
      "Numerology Pages",
      numerologyData,
    );
    renderNumerologyPages(doc, numerologyData, lang, L);
    logPDF(
      "professional-horoscope-pdf",
      40,
      "Ascendant Pages",
      mainData.general_ascendant_report,
    );
    renderAscendantPages(doc, mainData, L);

    // ── Pages 48–66+ (pdf-pages-4) ──
    logPDF(
      "professional-horoscope-pdf",
      48,
      "Planet Profile Cover",
      "Rendering",
    );
    renderPlanetProfileCover(doc, lang, L);
    logPDF(
      "professional-horoscope-pdf",
      49,
      "Planet Profile Pages",
      mainData.planets,
    );
    renderPlanetProfilePages(doc, mainData, mainData.planets || [], lang, L);

    // ── Add Footers ──
    addFooters(doc, body.name);

    console.log(
      `[Professional PDF] PDF generated in ${Date.now() - pdfStart}ms (${doc.getNumberOfPages()} pages)`,
    );

    // ════════════════════════════════════════════
    // PHASE 3: Output
    // ════════════════════════════════════════════
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    logPDF("professional-horoscope-pdf", "FINAL", "PDF Generation Complete", {
      sizeKB: (pdfBuffer.length / 1024).toFixed(1),
      pages: doc.getNumberOfPages(),
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="professional_horoscope_${body.name.replace(/\s+/g, "_")}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error: unknown) {
    logPDFError("professional-horoscope-pdf", "FATAL", error);
    console.error("[Professional PDF] Error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        error: "Failed to generate professional horoscope PDF",
        details: message,
      },
      { status: 500 },
    );
  }
}
