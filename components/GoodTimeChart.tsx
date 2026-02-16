"use client";

import { useEffect } from "react";

// Wrapper for the legacy EvensChartViewer
export default function GoodTimeChart({
  personId,
  timeRangeUrl,
  daysPerPixel,
  eventTags,
  algorithms,
  ayanamsa,
}: any) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).EvensChartViewer) {
      const chart = new (window as any).EvensChartViewer(
        "GoodTimeFinderChartHolder",
      );
      chart.GenerateChart(
        personId,
        timeRangeUrl,
        daysPerPixel,
        eventTags,
        algorithms,
        ayanamsa,
      );
    }
  }, [personId, timeRangeUrl, daysPerPixel, eventTags, algorithms, ayanamsa]);

  return <div id="GoodTimeFinderChartHolder"></div>;
}
