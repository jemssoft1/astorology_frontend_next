/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { logPDF, logPDFError } from "@/utils/pdfLogger";
import { fetchNatalData, fetchTransitForecast, formatDate } from "./helpers";
import {
  renderCoverPage,
  renderIntroPage,
  renderNatalWheelPage,
  renderPositionsPage,
  renderCuspsPage,
  renderTransitTables,
  renderInterpretations,
  renderBackCover,
  addFooter,
} from "./pdf-pages";
import { TransitRequest } from "./types";

export const maxDuration = 60; // 60s timeout

export async function POST(req: NextRequest) {
  try {
    const body: TransitRequest = await req.json();
    logPDF("western-life-forecast-pdf", 0, "Input Parameters", body);

    // 1. Validation
    if (
      !body.name ||
      !body.date_of_birth ||
      !body.forecast_start ||
      !body.forecast_end
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, date_of_birth, forecast_start, forecast_end",
        },
        { status: 400 },
      );
    }

    // 2. Data Fetching
    console.log(`Generating Western Life Forecast for ${body.name}...`);

    // Parallel Fetching
    const [natalData, transitAspects] = await Promise.all([
      fetchNatalData(body),
      fetchTransitForecast(body),
    ]);

    if (!natalData) {
      throw new Error("Failed to fetch natal data.");
    }
    logPDF("western-life-forecast-pdf", 0, "Natal Data", natalData);
    logPDF("western-life-forecast-pdf", 0, "Transit Aspects", transitAspects);

    // 3. PDF Generation
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Page 1: Cover
    logPDF("western-life-forecast-pdf", 1, "Cover Page", {
      name: body.name,
      range: `${body.forecast_start} to ${body.forecast_end}`,
    });
    renderCoverPage(
      doc,
      body.name,
      `${body.forecast_start} to ${body.forecast_end}`,
    );

    // Page 2: Intro
    logPDF("western-life-forecast-pdf", 2, "Intro Page", "Rendering");
    renderIntroPage(doc);

    // Page 3: Natal Wheel
    logPDF(
      "western-life-forecast-pdf",
      3,
      "Natal Wheel",
      natalData.wheel_image ? "Image present" : "No image",
    );
    renderNatalWheelPage(doc, natalData.wheel_image);

    // Page 4: Positions
    logPDF(
      "western-life-forecast-pdf",
      4,
      "Natal Positions",
      natalData.planets,
    );
    renderPositionsPage(doc, natalData.planets);

    // Page 5: Cusps
    logPDF("western-life-forecast-pdf", 5, "Natal Cusps", natalData.cusps);
    renderCuspsPage(doc, natalData.cusps);

    // Pages 6+: Transit Tables
    logPDF("western-life-forecast-pdf", 6, "Transit Tables", transitAspects);
    renderTransitTables(doc, transitAspects);

    // Pages 15+: Interpretations
    logPDF(
      "western-life-forecast-pdf",
      15,
      "Transit Interpretations",
      "Rendering",
    );
    renderInterpretations(doc, transitAspects);

    // Back Cover
    logPDF("western-life-forecast-pdf", "LAST", "Back Cover", "Rendering");
    renderBackCover(doc);

    // Footers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(doc, i, totalPages);
    }

    // 4. Output
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    logPDF("western-life-forecast-pdf", "FINAL", "PDF Generation Complete", {
      sizeKB: (pdfBuffer.length / 1024).toFixed(1),
      pages: doc.getNumberOfPages(),
    });
    const filename = `Life_Forecast_${body.name.replace(/\s+/g, "_")}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error: any) {
    logPDFError("western-life-forecast-pdf", "FATAL", error);
    console.error("Error generating Western Life Forecast PDF:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 },
    );
  }
}
