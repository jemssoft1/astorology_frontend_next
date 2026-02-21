/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { logPDF, logPDFError } from "@/utils/pdfLogger";
import { fetchNatalData, fetchSynastryData } from "./helpers";
import {
  renderCoverPage,
  renderIntroPage,
  renderNatalPages,
  renderBiWheelPage,
  renderHouseOverlaysPage,
  renderAspectsTablePage,
  renderHouseReport,
  renderAspectReport,
  renderBackCover,
  addFooter,
} from "./pdf-pages";
import { SynastryRequest } from "./types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body: SynastryRequest = await req.json();
    logPDF("synastry-english-pdf", 0, "Input Parameters", body);

    // 1. Validation
    if (
      !body.person1 ||
      !body.person1.date_of_birth ||
      !body.person2 ||
      !body.person2.date_of_birth
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields for Person 1 or Person 2",
        },
        { status: 400 },
      );
    }

    // 2. Data Fetching
    const [p1Data, p2Data] = await Promise.all([
      fetchNatalData(body.person1, body.house_system || "placidus"),
      fetchNatalData(body.person2, body.house_system || "placidus"),
    ]);

    if (!p1Data || !p2Data) {
      throw new Error("Failed to fetch natal data for one or both persons.");
    }
    logPDF("synastry-english-pdf", 0, "Person 1 Data", p1Data);
    logPDF("synastry-english-pdf", 0, "Person 2 Data", p2Data);

    // 3. Synastry Calculations
    const synastryData = await fetchSynastryData(p1Data, p2Data);
    logPDF("synastry-english-pdf", 0, "Synastry Data", synastryData);

    // 4. PDF Generation
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Page 1: Cover
    logPDF("synastry-english-pdf", 1, "Cover Page", {
      p1: body.person1.name,
      p2: body.person2.name,
    });
    renderCoverPage(doc, body.person1, body.person2);

    // Page 2: Intro
    logPDF("synastry-english-pdf", 2, "Intro Page", "Rendering");
    renderIntroPage(doc);

    // Page 3-4: Person 1 Natal
    logPDF("synastry-english-pdf", 3, "Person 1 Natal Pages", {
      name: body.person1.name,
      planets: p1Data.planets,
      cusps: p1Data.cusps,
    });
    renderNatalPages(doc, body.person1.name, p1Data.planets, p1Data.cusps);

    // Page 5-6: Person 2 Natal
    logPDF("synastry-english-pdf", 5, "Person 2 Natal Pages", {
      name: body.person2.name,
      planets: p2Data.planets,
      cusps: p2Data.cusps,
    });
    renderNatalPages(doc, body.person2.name, p2Data.planets, p2Data.cusps);

    // Page 7: Bi-Wheel
    logPDF("synastry-english-pdf", 7, "Bi-Wheel", "Rendering");
    renderBiWheelPage(doc);

    // Page 8: House Overlays P1 -> P2
    logPDF("synastry-english-pdf", 8, "House Overlays", synastryData.overlays);
    renderHouseOverlaysPage(
      doc,
      synastryData.overlays,
      body.person1.name,
      body.person2.name,
    );

    // Pages 9-11: Aspects Table
    logPDF("synastry-english-pdf", 9, "Aspects Table", synastryData.aspects);
    renderAspectsTablePage(doc, synastryData.aspects);

    // Pages 12-21: House Report
    logPDF("synastry-english-pdf", 12, "House Report", synastryData.overlays);
    renderHouseReport(
      doc,
      synastryData.overlays,
      body.person1.name,
      body.person2.name,
    );

    // Pages 22-37: Aspect Report
    logPDF("synastry-english-pdf", 22, "Aspect Report", synastryData.aspects);
    renderAspectReport(doc, synastryData.aspects);

    // Page 38: Back Cover
    logPDF("synastry-english-pdf", "LAST", "Back Cover", "Rendering");
    renderBackCover(doc);

    // Footers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(doc, i, totalPages);
    }

    // 5. Output
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    logPDF("synastry-english-pdf", "FINAL", "PDF Generation Complete", {
      sizeKB: (pdfBuffer.length / 1024).toFixed(1),
      pages: doc.getNumberOfPages(),
    });
    const filename = `Synastry_${body.person1.name}_${body.person2.name}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error: any) {
    logPDFError("synastry-english-pdf", "FATAL", error);
    console.error("Error generating Synastry PDF:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 },
    );
  }
}
