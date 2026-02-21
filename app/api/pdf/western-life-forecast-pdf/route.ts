/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

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

    // Parallel Fetching
    const [natalData, transitAspects] = await Promise.all([
      fetchNatalData(body),
      fetchTransitForecast(body),
    ]);

    if (!natalData) {
      throw new Error("Failed to fetch natal data.");
    }

    // 3. PDF Generation
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Page 1: Cover
    renderCoverPage(
      doc,
      body.name,
      `${body.forecast_start} to ${body.forecast_end}`,
    );

    // Page 2: Intro

    renderIntroPage(doc);

    // Page 3: Natal Wheel
    renderNatalWheelPage(doc, natalData.wheel_image);

    // Page 4: Positions
    renderPositionsPage(doc, natalData.planets);

    // Page 5: Cusps
    renderCuspsPage(doc, natalData.cusps);

    // Pages 6+: Transit Tables
    renderTransitTables(doc, transitAspects);

    // Pages 15+: Interpretations
    renderInterpretations(doc, transitAspects);

    // Back Cover

    renderBackCover(doc);

    // Footers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(doc, i, totalPages);
    }

    // 4. Output
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
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
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 },
    );
  }
}
