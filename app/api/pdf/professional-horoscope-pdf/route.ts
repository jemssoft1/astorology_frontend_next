// route.ts — API endpoint for Professional Horoscope PDF generation
// POST /api/professional-horoscope-pdf

import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

import { getProfessionalLabels, DASHA_ORDER_PAGE7 } from "./constants";
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
  renderManglikPages,
  renderSadhesatiPages,
  renderGemstonePages,
  renderRudrakshaPage,
  renderFavourablePointsPage,
  renderNumerologyPages,
  renderAscendantPages,
} from "./pdf-pages-3";

import { renderPlanetProfilePages } from "./pdf-pages-4";

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

    // Fetch sub-dasha for all 9 planets
    const allDashaPlanets = [...DASHA_ORDER_PAGE7];
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

    // ════════════════════════════════════════════
    // PHASE 2: PDF Generation
    // ════════════════════════════════════════════

    const pdfStart = Date.now();

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // ── Pages 1–11 (pdf-pages-1) ──

    renderCoverPage(doc, body.name, dob, tob, pob, lang, L);

    renderBasicDetailsPage(doc, mainData, L);

    renderPlanetaryPositionsPage(doc, mainData, L);

    renderHoroscopeChartsPage(doc, mainData, L);

    renderHouseCuspsPage(doc, mainData, lang, L);

    renderDivisionalChartsPage1(doc, mainData, lang, L);

    renderDivisionalChartsPage2(doc, mainData, lang, L);

    renderCompositeFriendshipPage(doc, mainData, L);

    renderFiveFoldFriendshipPage(doc, mainData, L);

    renderKPPlanetaryPage(doc, mainData, L);

    renderKPHouseCuspsPage(doc, mainData, L);

    // ── Pages 12–27 (pdf-pages-2) ──

    renderAshtakvargaPages(doc, ashtakvargaData, lang, L);

    renderSarvashtakPage(doc, ashtakvargaData, lang, L);

    renderVimshottariDasha1Page(doc, mainData, subDashaData, L);

    renderVimshottariDasha2Page(doc, mainData, subDashaData, L);

    renderYoginiDashaPages(doc, yoginiData, L);

    renderCharDashaPages(doc, charDashaData, L);

    // ── Pages 28–47 (pdf-pages-3) ──

    renderManglikPages(doc, mainData, lang, L);

    renderSadhesatiPages(doc, mainData, lang, L);

    renderGemstonePages(doc, gemstoneData, lang, L);

    renderRudrakshaPage(doc, mainData, lang, L);

    renderFavourablePointsPage(doc, mainData, numerologyData, L);

    renderNumerologyPages(doc, numerologyData, lang, L);

    renderAscendantPages(doc, mainData, L);

    // ── Pages 48–66+ (pdf-pages-4) ──
    // ── Pages 48–66+ (pdf-pages-4) ──

    renderPlanetProfilePages(doc, mainData, mainData.planets || [], lang, L);

    // ── Add Footers ──
    addFooters(doc, body.name);

    // ════════════════════════════════════════════
    // PHASE 3: Output
    // ════════════════════════════════════════════
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="professional_horoscope_${body.name.replace(/\s+/g, "_")}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Log only critical errors if needed, but keeping it minimal as requested
    }
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
