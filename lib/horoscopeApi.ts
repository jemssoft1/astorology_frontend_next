// lib/horoscopeApi.ts
import "server-only";

const BASE_URL = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api/Calculate`
  : "http://localhost:3000/api/Calculate"; // Fallback for dev

export interface PlanetData {
  PlanetName: string;
  SignName: string;
  NakshatraName: string;
  isRetrograde: boolean;
}

export interface Prediction {
  Description: string;
}

export interface HoroscopeData {
  localMeanTime: any;
  ayanamsaDegree: any;
  yoniKutaAnimal: any;
  marakaPlanetList: any;
  lagnaSignName: any;
  moonSignName: any;
  moonConstellation: any;
  sunsetTime: any;
  nithyaYoga: any;
  karana: any;
  dayDurationHours: any;
  isDayBirth: any;
  lunarDay: any;
  birthVarna: any;
  horaAtBirth: any;
  dayOfWeek: any;
  lordOfWeekday: any;
  shubKartariPlanets: any;
  paapaKartariPlanets: any;
  shubKartariHouses: any;
  paapaKartariHouses: any;
  kujaDosaScore: any;
  panchaPakshiBirthBird: any;
  allPlanetData: any;
  allHouseData: any;
  sarvashtakavargaChart: any;
  bhinnashtakavargaChart: any;
  planetShadbalaPinda: any;
  houseStrength: any;
  horoscopePredictions: any;
  ghatChakra: any;
  navamsaChart: any;
  majorVimshottariDasha: any;
  ascendantReport: any;
  // ❌ REMOVED: SouthIndianChart and NorthIndianChart (handled separately)
}

export interface BirthData {
  location: string;
  time: string;
  date: string;
  offset: string;
}

// Build time URL from location and date/time
export function buildTimeUrl(
  location: string,
  time: string,
  date: string,
  offset: string = "+05:30",
): string {
  // Add encoding to handle spaces in location (e.g. "New York, USA")
  return `Location/${encodeURIComponent(location)}/Time/${time}/${date}/${offset}`;
}

// Fetch single API endpoint
async function fetchApi(endpoint: string): Promise<any> {
  try {
    const url = `${BASE_URL}/${endpoint}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

// ✅ Fetch all horoscope data (WITHOUT charts - they are separate)
export async function fetchAllHoroscopeData(
  location: string,
  time: string,
  date: string,
  offset: string = "+05:30",
): Promise<HoroscopeData> {
  const timeUrl = buildTimeUrl(location, time, date, offset);

  // ❌ NO SouthIndianChart/NorthIndianChart here!
  const endpoints = {
    localMeanTime: `LocalMeanTime/${timeUrl}`,
    ayanamsaDegree: `AyanamsaDegree/${timeUrl}`,
    yoniKutaAnimal: `YoniKutaAnimal/${timeUrl}`,
    marakaPlanetList: `MarakaPlanetList/${timeUrl}`,
    lagnaSignName: `LagnaSignName/${timeUrl}`,
    moonSignName: `MoonSignName/${timeUrl}`,
    moonConstellation: `MoonConstellation/${timeUrl}`,
    sunsetTime: `SunsetTime/${timeUrl}`,
    nithyaYoga: `NithyaYoga/${timeUrl}`,
    karana: `Karana/${timeUrl}`,
    dayDurationHours: `DayDurationHours/${timeUrl}`,
    isDayBirth: `IsDayBirth/${timeUrl}`,
    lunarDay: `LunarDay/${timeUrl}`,
    birthVarna: `BirthVarna/${timeUrl}`,
    horaAtBirth: `HoraAtBirth/${timeUrl}`,
    dayOfWeek: `DayOfWeek/${timeUrl}`,
    lordOfWeekday: `LordOfWeekday/${timeUrl}`,
    shubKartariPlanets: `ShubKartariPlanets/${timeUrl}`,
    paapaKartariPlanets: `PaapaKartariPlanets/${timeUrl}`,
    shubKartariHouses: `ShubKartariHouses/${timeUrl}`,
    paapaKartariHouses: `PaapaKartariHouses/${timeUrl}`,
    kujaDosaScore: `KujaDosaScore/${timeUrl}`,
    panchaPakshiBirthBird: `PanchaPakshiBirthBird/${timeUrl}`,
    allPlanetData: `AllPlanetData/PlanetName/All/${timeUrl}`,
    allHouseData: `AllHouseData/HouseName/All/${timeUrl}`,
    sarvashtakavargaChart: `SarvashtakavargaChart/${timeUrl}`,
    bhinnashtakavargaChart: `BhinnashtakavargaChart/${timeUrl}`,
    planetShadbalaPinda: `PlanetShadbalaPinda/PlanetName/All/${timeUrl}`,
    houseStrength: `HouseStrength/HouseName/All/${timeUrl}`,
    horoscopePredictions: `HoroscopePredictions/${timeUrl}`,
    ghatChakra: `AvakhadaChakra/${timeUrl}`,
    navamsaChart: `NavamsaChart/${timeUrl}`, // D9
    majorVimshottariDasha: `MajorVimshottariDasha/${timeUrl}`,
    ascendantReport: `GeneralAscendantReport/${timeUrl}`,
  };

  const keys = Object.keys(endpoints) as (keyof typeof endpoints)[];
  const promises = keys.map((key) => fetchApi(endpoints[key]));
  const results = await Promise.allSettled(promises);

  const data: Partial<HoroscopeData> = {};
  results.forEach((result, index) => {
    const key = keys[index];
    if (result.status === "fulfilled") {
      data[key] = result.value;
    } else {
      data[key] = null;
      console.error(`Failed to fetch ${key}:`, result.reason);
    }
  });

  return data as HoroscopeData;
}
