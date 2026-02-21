/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { logPDF, logPDFError } from "@/utils/pdfLogger";
import { fetchNatalData, fetchSolarReturnData } from "./helpers";
import {
  renderCoverPage,
  renderIntroPage,
  renderWheelPage,
  renderPositionsPage,
  renderCuspsPage,
  renderAspectsTable,
  renderInterpretations,
  renderAspectInterpretations,
  renderBackCover,
  addFooter,
} from "./pdf-pages";
import { SolarReturnRequest } from "./types";

export const maxDuration = 60; // 60s timeout

export async function POST(req: NextRequest) {
  try {
    const body: SolarReturnRequest = await req.json();
    logPDF("solar-return-english-pdf", 0, "Input Parameters", body);

    // 1. Validation
    if (
      !body.name ||
      !body.date_of_birth ||
      !body.time_of_birth ||
      !body.place_of_birth
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, date_of_birth, time_of_birth, place_of_birth",
        },
        { status: 400 },
      );
    }

   

    // Default to current year if not provided, or next birthday logic can be handled by caller
    // The previous prompt said "Dynamic based on Solar Return time", so we trust the inputs.

    const [natalData, solarData] = await Promise.all([
      fetchNatalData(body),
      fetchSolarReturnData(body),
    ]);

    if (!natalData || !solarData) {
      throw new Error("Failed to fetch astrological data.");
    }
    logPDF("solar-return-english-pdf", 0, "Natal Data", natalData);
    logPDF("solar-return-english-pdf", 0, "Solar Return Data", solarData);

    // 3. PDF Generation
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const yearRange = `${solarData.return_date.split("-")[2] || body.solar_return_year || new Date().getFullYear()}-${(body.solar_return_year || new Date().getFullYear()) + 1}`;

    // Page 1: Cover
    logPDF("solar-return-english-pdf", 1, "Cover Page", {
      name: body.name,
      yearRange,
    });
    renderCoverPage(doc, body, yearRange);

    // Page 2: Intro
    logPDF("solar-return-english-pdf", 2, "Intro Page", "Rendering");
    renderIntroPage(doc);

    // Page 3: Natal Chart Visualization
    logPDF(
      "solar-return-english-pdf",
      3,
      "Natal Chart Wheel",
      natalData.wheel_image ? "Image present" : "No image",
    );
    renderWheelPage(
      doc,
      "Natal Chart",
      `Born: ${body.date_of_birth}`,
      natalData.wheel_image,
    );

    // Page 4: Natal Planetary Positions
    logPDF(
      "solar-return-english-pdf",
      4,
      "Natal Planetary Positions",
      natalData.planets,
    );
    renderPositionsPage(doc, "Natal Planetary Positions", natalData.planets);

    // Page 5: Natal House Cusps
    logPDF("solar-return-english-pdf", 5, "Natal House Cusps", natalData.cusps);
    renderCuspsPage(doc, "Natal House Cusps (Placidus)", natalData.cusps);

    // Page 6: Solar Return Chart Visualization
    const srDateStr = solarData.return_date || `For ${body.solar_return_year}`;
    logPDF("solar-return-english-pdf", 6, "Solar Return Chart Wheel", {
      returnDate: srDateStr,
    });
    renderWheelPage(
      doc,
      "Solar Return Chart",
      `Return Date: ${srDateStr}`,
      solarData.wheel_image,
    );

    // Page 7: Solar Return Positions
    logPDF(
      "solar-return-english-pdf",
      7,
      "Solar Return Planets",
      solarData.planets,
    );
    renderPositionsPage(doc, "Solar Return Planets", solarData.planets);

    // Page 8: Solar Return House Cusps
    logPDF(
      "solar-return-english-pdf",
      8,
      "Solar Return House Cusps",
      solarData.cusps,
    );
    renderCuspsPage(doc, "Solar Return House Cusps", solarData.cusps);

    // Page 9: Aspects Table
    logPDF("solar-return-english-pdf", 9, "Aspects Table", solarData.aspects);
    renderAspectsTable(doc, solarData.aspects);

    // Pages 10-20: Interpretations (Planets in Houses)
    logPDF(
      "solar-return-english-pdf",
      10,
      "Planet in House Interpretations",
      solarData.planets,
    );
    renderInterpretations(doc, solarData.planets);

    // Pages 21-28: Aspect Interpretations
    logPDF(
      "solar-return-english-pdf",
      21,
      "Aspect Interpretations",
      solarData.aspects,
    );
    renderAspectInterpretations(doc, solarData.aspects);

    // Back Cover
    logPDF("solar-return-english-pdf", "LAST", "Back Cover", "Rendering");
    renderBackCover(doc);

    // Footers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(doc, i, totalPages);
    }

    // 4. Output
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    logPDF("solar-return-english-pdf", "FINAL", "PDF Generation Complete", {
      sizeKB: (pdfBuffer.length / 1024).toFixed(1),
      pages: doc.getNumberOfPages(),
    });
    const filename = `Solar_Return_${body.name.replace(/\s+/g, "_")}_${yearRange}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error: any) {
    logPDFError("solar-return-english-pdf", "FATAL", error);
    console.error("Error generating Solar Return PDF:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 },
    );
  }
}
