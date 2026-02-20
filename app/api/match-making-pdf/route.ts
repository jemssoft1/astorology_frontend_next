// route.ts — POST /api/match-making-pdf
// Generates a 19+ page premium Match Making PDF
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { logPDF, logPDFError } from "@/utils/pdfLogger";

import { getLabels, DASHA_PLANETS } from "./constants";
import {
  fetchPersonData,
  computeMatchData,
  fetchSubDasha,
  addFooters,
  BirthParams,
} from "./helpers";

import {
  renderCoverPage,
  renderImportancePage,
  renderBasicDetailsPage,
  renderPlanetaryPositionsPage,
  renderChartPages,
} from "./pdf-pages-1";

import {
  renderMaleVimshottariPage,
  renderFemaleVimshottariPage,
  renderManglikInfoPage,
  renderMaleManglikPage,
  renderFemaleManglikPage,
  renderManglikMatchPage,
} from "./pdf-pages-2";

import {
  renderDashakootInfoPage,
  renderDashakootTablePage,
  renderRajjuDoshaPage,
  renderPapasamyamPage,
  renderPersonalityPage,
  renderTraitsPage,
  renderMatchReportPage,
  renderBackCover,
} from "./pdf-pages-3";

// ═══════════════════════════════════════════════
//  REQUEST BODY INTERFACE
// ═══════════════════════════════════════════════
interface PersonInput {
  name: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
  place: string;
}

interface MatchMakingRequest {
  male: PersonInput;
  female: PersonInput;
  language?: string;
}

// ═══════════════════════════════════════════════
//  PARSE BIRTH PARAMS
// ═══════════════════════════════════════════════
function parseBirthParams(person: PersonInput): BirthParams {
  return {
    day: person.day,
    month: person.month,
    year: person.year,
    hour: person.hour,
    min: person.min,
    lat: person.lat,
    lon: person.lon,
    tzone: person.tzone,
  };
}

function formatDob(p: PersonInput): string {
  return `${String(p.day).padStart(2, "0")}-${String(p.month).padStart(2, "0")}-${p.year}`;
}

function formatTob(p: PersonInput): string {
  return `${String(p.hour).padStart(2, "0")}:${String(p.min).padStart(2, "0")}`;
}

// ═══════════════════════════════════════════════
//  POST HANDLER
// ═══════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body: MatchMakingRequest = await req.json();
    logPDF("match-making-pdf", 0, "Input Parameters", body);

    // Validate inputs
    if (!body.male || !body.female) {
      return NextResponse.json(
        { error: "Both male and female details are required" },
        { status: 400 },
      );
    }

    const requiredFields: (keyof PersonInput)[] = [
      "name",
      "day",
      "month",
      "year",
      "hour",
      "lat",
      "lon",
      "tzone",
      "place",
    ];

    for (const field of requiredFields) {
      if (
        body.male[field] === undefined ||
        body.male[field] === null ||
        body.male[field] === ""
      ) {
        return NextResponse.json(
          { error: `Male ${field} is required` },
          { status: 400 },
        );
      }
      if (
        body.female[field] === undefined ||
        body.female[field] === null ||
        body.female[field] === ""
      ) {
        return NextResponse.json(
          { error: `Female ${field} is required` },
          { status: 400 },
        );
      }
    }

    const lang = body.language === "hi" ? "hi" : "en";
    const labels = getLabels(lang);

    // Parse birth params
    const maleParams = parseBirthParams(body.male);
    const femaleParams = parseBirthParams(body.female);

    // ── DATA FETCHING ──
    const [maleData, femaleData] = await Promise.all([
      fetchPersonData(maleParams),
      fetchPersonData(femaleParams),
    ]);

    // Compute match data locally from individual astro data
    const matchData = computeMatchData(maleData, femaleData, lang);

    // Fetch sub-dasha for top 5 planets (parallel for both)
    const dashaSlice = DASHA_PLANETS.slice(0, 5);
    const [maleSubDashaResults, femaleSubDashaResults] = await Promise.all([
      Promise.allSettled(dashaSlice.map((p) => fetchSubDasha(p, maleParams))),
      Promise.allSettled(dashaSlice.map((p) => fetchSubDasha(p, femaleParams))),
    ]);

    const maleSubDasha: Record<string, any> = {};
    const femaleSubDasha: Record<string, any> = {};
    dashaSlice.forEach((planet, i) => {
      maleSubDasha[planet] =
        maleSubDashaResults[i].status === "fulfilled"
          ? maleSubDashaResults[i].value
          : null;
      femaleSubDasha[planet] =
        femaleSubDashaResults[i].status === "fulfilled"
          ? femaleSubDashaResults[i].value
          : null;
    });

    // ── INITIALIZE PDF ──
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Page 1 — Cover
    logPDF("match-making-pdf", 1, "Cover Page", {
      male: body.male.name,
      female: body.female.name,
    });
    renderCoverPage(
      doc,
      labels,
      lang,
      String(body.male.name),
      String(body.female.name),
      formatDob(body.male),
      formatDob(body.female),
      formatTob(body.male),
      formatTob(body.female),
      String(body.male.place),
      String(body.female.place),
    );

    // Page 2 — Importance
    logPDF("match-making-pdf", 2, "Importance Page", "Rendering");
    renderImportancePage(doc, labels, lang);

    // Page 3 — Basic Details
    logPDF("match-making-pdf", 3, "Basic Details", {
      maleData_astro: maleData.astro_details,
      femaleData_astro: femaleData.astro_details,
      match_birth_details: matchData.match_birth_details,
    });
    renderBasicDetailsPage(
      doc,
      labels,
      lang,
      maleData,
      femaleData,
      matchData.match_birth_details,
    );

    // Page 4 — Planetary Positions
    logPDF("match-making-pdf", 4, "Planetary Positions", {
      malePlanets: maleData.planets,
      femalePlanets: femaleData.planets,
    });
    renderPlanetaryPositionsPage(
      doc,
      labels,
      String(body.male.name),
      String(body.female.name),
      maleData,
      femaleData,
    );

    // Pages 5–6 — Charts
    logPDF(
      "match-making-pdf",
      5,
      "Chart Pages",
      "Rendering male + female charts",
    );
    renderChartPages(
      doc,
      labels,
      String(body.male.name),
      String(body.female.name),
      maleData,
      femaleData,
    );

    // Page 7 — Male Vimshottari
    logPDF("match-making-pdf", 7, "Male Vimshottari", {
      name: body.male.name,
      major_vdasha: maleData.major_vdasha,
      subDasha: maleSubDasha,
    });
    renderMaleVimshottariPage(
      doc,
      labels,
      String(body.male.name),
      maleData,
      maleSubDasha,
    );

    // Page 8 — Female Vimshottari
    logPDF("match-making-pdf", 8, "Female Vimshottari", {
      name: body.female.name,
      major_vdasha: femaleData.major_vdasha,
      subDasha: femaleSubDasha,
    });
    renderFemaleVimshottariPage(
      doc,
      labels,
      String(body.female.name),
      femaleData,
      femaleSubDasha,
    );

    // Page 9 — Manglik Info
    logPDF(
      "match-making-pdf",
      9,
      "Manglik Info",
      matchData.match_manglik_report,
    );
    renderManglikInfoPage(doc, labels, lang, matchData.match_manglik_report);

    // Page 10 — Male Manglik Analysis
    logPDF("match-making-pdf", 10, "Male Manglik Analysis", maleData.manglik);
    renderMaleManglikPage(doc, labels, String(body.male.name), maleData);

    // Page 11 — Female Manglik Analysis
    logPDF(
      "match-making-pdf",
      11,
      "Female Manglik Analysis",
      femaleData.manglik,
    );
    renderFemaleManglikPage(doc, labels, String(body.female.name), femaleData);

    // Page 12 — Manglik Match Analysis
    renderManglikMatchPage(
      doc,
      labels,
      String(body.male.name),
      String(body.female.name),
      maleData,
      femaleData,
      matchData.match_manglik_report,
    );

    // Page 13 — Dashakoot Info
    logPDF("match-making-pdf", 13, "Dashakoot Info", "Rendering");
    renderDashakootInfoPage(doc, labels, lang);

    // Page 14 — Dashakoot Table + Bar Chart
    logPDF("match-making-pdf", 14, "Dashakoot Table", {
      dashakoot: matchData.match_dashakoot_points,
      ashtakoot: matchData.match_ashtakoot_points,
    });
    renderDashakootTablePage(
      doc,
      labels,
      lang,
      matchData.match_dashakoot_points,
      matchData.match_ashtakoot_points,
    );

    // Page 15 — Rajju Dosha
    logPDF("match-making-pdf", 15, "Rajju Dosha", matchData.rajju_dosha);
    renderRajjuDoshaPage(doc, labels, lang, matchData.rajju_dosha);

    // Page 16 — Papasamyam
    logPDF("match-making-pdf", 16, "Papasamyam", matchData.papasamyam);
    renderPapasamyamPage(
      doc,
      labels,
      lang,
      String(body.male.name),
      String(body.female.name),
      matchData.papasamyam,
    );

    // Page 17 — Personality
    logPDF("match-making-pdf", 17, "Personality", "Rendering");
    renderPersonalityPage(
      doc,
      labels,
      String(body.male.name),
      String(body.female.name),
      maleData,
      femaleData,
    );

    // Page 18 — Traits
    logPDF("match-making-pdf", 18, "Traits", "Rendering");
    renderTraitsPage(
      doc,
      labels,
      lang,
      String(body.male.name),
      String(body.female.name),
      maleData,
      femaleData,
    );

    // Page 19 — Match Report
    logPDF("match-making-pdf", 19, "Match Report", matchData);
    renderMatchReportPage(
      doc,
      labels,
      lang,
      matchData,
      matchData.match_dashakoot_points || matchData.match_ashtakoot_points,
      matchData.match_manglik_report,
    );

    // Page 20 — Back Cover
    logPDF("match-making-pdf", 20, "Back Cover", "Rendering");
    renderBackCover(doc, labels, lang);

    // ── ADD FOOTERS ──
    addFooters(doc, `${body.male.name} & ${body.female.name}`);

    // ── GENERATE PDF BUFFER ──
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    logPDF("match-making-pdf", "FINAL", "PDF Generation Complete", {
      sizeKB: (pdfBuffer.length / 1024).toFixed(1),
      pages: doc.getNumberOfPages(),
    });
    const filename = `MatchMaking_${body.male.name.replace(/\s+/g, "_")}_${body.female.name.replace(/\s+/g, "_")}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error: unknown) {
    logPDFError("match-making-pdf", "FATAL", error);
    console.error("❌ Match Making PDF Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate match making PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
