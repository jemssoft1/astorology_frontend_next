// helpers.ts — Data fetching & PDF utilities for Match Making PDF
// Re-exports shared helpers from mini-horoscope-pdf

export {
  fetchAPI,
  fetchSubDasha,
  addPageBackground,
  addPageHeader,
  addSectionTitle,
  addFooters,
  drawCornerDecoration,
  drawNorthIndianChart,
} from "../mini-horoscope-pdf/helpers";
export type { BirthParams } from "../mini-horoscope-pdf/helpers";

import { fetchAPI } from "../mini-horoscope-pdf/helpers";
import type { BirthParams } from "../mini-horoscope-pdf/helpers";
import { computeAllMatchData } from "./compute-match";

// ═══════════════════════════════════════════════
//  Fetch individual person data (planets, charts, dasha, etc.)
// ═══════════════════════════════════════════════
export async function fetchPersonData(params: BirthParams) {
  const endpoints: Record<string, string> = {
    birth_details: "birth_details",
    astro_details: "astro_details",
    planets: "planets",
    planets_extended: "planets/extended",
    major_vdasha: "major_vdasha",
    current_vdasha: "current_vdasha",
    current_vdasha_all: "current_vdasha_all",
    manglik: "manglik",
    general_ascendant_report: "general_ascendant_report",
    // Charts
    horo_chart_D1: "horo_chart/D1",
    horo_chart_MOON: "horo_chart/MOON",
    horo_chart_D9: "horo_chart/D9",
    horo_chart_chalit: "horo_chart/chalit",
  };

  const keys = Object.keys(endpoints);
  const promises = keys.map((key) => fetchAPI(endpoints[key], params));
  const results = await Promise.allSettled(promises);

  const data: Record<string, any> = {};
  results.forEach((result, index) => {
    data[keys[index]] = result.status === "fulfilled" ? result.value : null;
  });
  return data;
}

// ═══════════════════════════════════════════════
//  Compute matchmaking data locally
//  (replaces external match API calls that were
//   returning 404/405 errors)
// ═══════════════════════════════════════════════
export function computeMatchData(
  maleData: Record<string, any>,
  femaleData: Record<string, any>,
  lang: string = "en",
) {
  return computeAllMatchData(maleData, femaleData, lang);
}
