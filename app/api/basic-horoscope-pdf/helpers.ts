// helpers.ts — API fetch utilities and PDF helpers for Basic Horoscope PDF
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

// ============================================
// Fetch all data needed for Basic Horoscope PDF
// ============================================
export async function fetchAllBasicHoroscopeData(params: BirthParams) {
  const endpoints: Record<string, string> = {
    birth_details: "birth_details",
    astro_details: "astro_details",
    planets: "planets",
    planets_extended: "planets/extended",
    ghat_chakra: "ghat_chakra",
    panchang: "panchang",
    major_vdasha: "major_vdasha",
    current_vdasha: "current_vdasha",
    current_vdasha_all: "current_vdasha_all",
    general_ascendant_report: "general_ascendant_report",
    // Divisional charts
    horo_chart_D1: "horo_chart/D1",
    horo_chart_D2: "horo_chart/D2",
    horo_chart_D3: "horo_chart/D3",
    horo_chart_D4: "horo_chart/D4",
    horo_chart_D5: "horo_chart/D5",
    horo_chart_D7: "horo_chart/D7",
    horo_chart_D8: "horo_chart/D8",
    horo_chart_D9: "horo_chart/D9",
    horo_chart_D10: "horo_chart/D10",
    horo_chart_D12: "horo_chart/D12",
    horo_chart_SUN: "horo_chart/SUN",
    horo_chart_MOON: "horo_chart/MOON",
    horo_chart_chalit: "horo_chart/chalit",
    // KP system for house cusps
    kp_house_cusps: "kp_house_cusps",
    manglik: "manglik",
    simple_manglik: "simple_manglik",
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

// ============================================
// Fetch Yogini Dasha data
// ============================================
export async function fetchYoginiDashaData(params: BirthParams) {
  const endpoints: Record<string, string> = {
    major_yogini_dasha: "major_yogini_dasha",
    sub_yogini_dasha: "sub_yogini_dasha",
    current_yogini_dasha: "current_yogini_dasha",
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

// ============================================
// Fetch Numerology data
// ============================================
export async function fetchNumerologyData(params: BirthParams, name: string) {
  const body = { ...params, name };
  const endpoints: Record<string, string> = {
    numero_table: "numero_table",
    numero_report: "numero_report",
    numero_fav_time: "numero_fav_time",
    numero_fav_lord: "numero_fav_lord",
    numero_fav_mantra: "numero_fav_mantra",
  };

  const keys = Object.keys(endpoints);
  const promises = keys.map((key) => fetchAPI(endpoints[key], body));
  const results = await Promise.allSettled(promises);

  const data: Record<string, any> = {};
  results.forEach((result, index) => {
    data[keys[index]] = result.status === "fulfilled" ? result.value : null;
  });
  return data;
}

// ============================================
// Fetch Kalsarpa Data (for Pages 14-15)
// ============================================
export async function fetchKalsarpaData(params: BirthParams) {
  const endpoints: Record<string, string> = {
    kalsarpa_details: "kalsarpa_details",
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

// ============================================
// Fetch Manglik & Sadhesati Data (for Pages 16-18)
// ============================================
export async function fetchManglikSadhesatiData(params: BirthParams) {
  const endpoints: Record<string, string> = {
    manglik: "manglik",
    sadhesati_current_status: "sadhesati_current_status",
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

// ============================================
// Fetch Gemstone Data (for Pages 19-22)
// ============================================
export async function fetchGemstoneData(params: BirthParams) {
  const endpoints: Record<string, string> = {
    basic_gem_suggestion: "basic_gem_suggestion",
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
