// helpers.ts — API fetch utilities and PDF helpers for Professional Horoscope PDF
// Re-exports shared helpers from mini-horoscope-pdf and basic-horoscope-pdf

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

export {
  fetchYoginiDashaData,
  fetchNumerologyData,
  fetchKalsarpaData,
  fetchManglikSadhesatiData,
  fetchGemstoneData,
} from "../basic-horoscope-pdf/helpers";

import { fetchAPI } from "../mini-horoscope-pdf/helpers";
import type { BirthParams } from "../mini-horoscope-pdf/helpers";

// ============================================
// Fetch all data needed for Professional Horoscope PDF
// Extends basic data with additional endpoints
// ============================================
export async function fetchAllProfessionalData(params: BirthParams) {
  const endpoints: Record<string, string> = {
    // Basic data (same as basic-horoscope-pdf)
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

    // Standard divisional charts
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

    // Extended divisional charts (Professional only)
    horo_chart_D16: "horo_chart/D16",
    horo_chart_D20: "horo_chart/D20",
    horo_chart_D24: "horo_chart/D24",
    horo_chart_D27: "horo_chart/D27",
    horo_chart_D30: "horo_chart/D30",
    horo_chart_D40: "horo_chart/D40",
    horo_chart_D45: "horo_chart/D45",
    horo_chart_D60: "horo_chart/D60",

    // KP system
    kp_house_cusps: "kp_house_cusps",
    kp_planets: "kp_planets",
    kp_birth_chart: "kp_birth_chart",

    // Manglik and Sadhesati
    manglik: "manglik",
    simple_manglik: "simple_manglik",
    sadhesati_current_status: "sadhesati_current_status",
    sadhesati_life_details: "sadhesati_life_details",

    // Friendship
    planetary_friendship: "planetary_friendship",

    // Planet reports
    planet_report_sun: "general_house_report/sun",
    planet_report_moon: "general_house_report/moon",
    planet_report_mars: "general_house_report/mars",
    planet_report_mercury: "general_house_report/mercury",
    planet_report_jupiter: "general_house_report/jupiter",
    planet_report_venus: "general_house_report/venus",
    planet_report_saturn: "general_house_report/saturn",
    planet_report_rahu: "general_house_report/rahu",
    planet_report_ketu: "general_house_report/ketu",

    // Rudraksha
    rudraksha_suggestion: "rudraksha_suggestion",
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
// Fetch Ashtakvarga Data
// ============================================
export async function fetchAshtakvargaData(params: BirthParams) {
  const planets = [
    "sun",
    "moon",
    "mars",
    "mercury",
    "jupiter",
    "venus",
    "saturn",
  ];

  // Fetch sarvashtakvarga + individual planet ashtakvarga
  const sarvashtakPromise = fetchAPI("sarvashtak", params);
  const planetPromises = planets.map((planet) =>
    fetchAPI(`planet_ashtak/${planet}`, params).then((data) => ({
      planet,
      data,
    })),
  );

  const [sarvashtakData, ...planetResults] = await Promise.allSettled([
    sarvashtakPromise,
    ...planetPromises,
  ]);

  const data: Record<string, any> = {
    sarvashtak:
      sarvashtakData.status === "fulfilled" ? sarvashtakData.value : null,
    planet_ashtak: {} as Record<string, any>,
  };

  planetResults.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      data.planet_ashtak[result.value.planet] = result.value.data;
    }
  });

  return data;
}

// ============================================
// Fetch Char Dasha Data
// ============================================
export async function fetchCharDashaData(params: BirthParams) {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  // Fetch main char dasha endpoints
  const majorPromise = fetchAPI("major_chardasha", params);
  const currentPromise = fetchAPI("current_chardasha", params);

  // Fetch sub_chardasha for all 12 signs
  const subDashaPromises = signs.map((sign) =>
    fetchAPI(`sub_chardasha/${sign}`, params).then((data) => ({ sign, data })),
  );

  const [majorResult, currentResult, ...subResults] = await Promise.allSettled([
    majorPromise,
    currentPromise,
    ...subDashaPromises,
  ]);

  const data: Record<string, any> = {
    major_chardasha:
      majorResult.status === "fulfilled" ? majorResult.value : null,
    current_chardasha:
      currentResult.status === "fulfilled" ? currentResult.value : null,
    sub_chardasha: {} as Record<string, any>,
  };

  subResults.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      data.sub_chardasha[result.value.sign] = result.value.data;
    }
  });

  return data;
}
