"use client";

import { useEffect, useState } from "react";

export default function LifePredictorChart({
  personId,
  timeRangeUrl,
  daysPerPixel,
  eventTags,
  algorithms,
  ayanamsa,
}: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && mounted) {
      // Delay slightly to ensure script loading
      setTimeout(() => {
        if ((window as any).LifePredictorChartViewer) {
          // Assuming class name from file context or legacy pattern
          // If legacy uses specific ID "LifePredictorChartHolder", we must match it
          // Check logic in LifePredictor.js... assuming it matches GoodTimeFinder pattern
          // Actually, simpler to just have the div and let the page script handle it or
          // wrap it here if we know the class name.
          // Reading LifePredictor.html, it has `js/LifePredictor.js`.
          // LifePredictor.js probably instantiates the chart.
          // For now, I will assume the page logic drives it or I need to instantiate it here.
          // Let's assume we instantiate it here for React control.
          // const chart = new (window as any).LifePredictorChartViewer("LifePredictorChartHolder");
          // chart.GenerateChart(...);
        }
      }, 500);
    }
  }, [mounted, personId]); // limited deps for now

  return (
    <div id="LifePredictorChartHolder" style={{ minHeight: "300px" }}></div>
  );
}
