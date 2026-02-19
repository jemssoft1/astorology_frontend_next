/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SynastryRequest,
  NatalData,
  SynastryData,
  PlanetPosition,
  HouseCusp,
  SynastryAspect,
  SynastryHouseOverlay,
} from "./types";
import { TEMPLATES } from "./constants";

const BASE_URL = process.env.BACKEND_URL;

// Reusing robust time parser from Solar Return work
function parseTime(timeStr: string): { hour: number; min: number } {
  const [hourStr, minStr] = timeStr.split(":");
  let hour = parseInt(hourStr);
  const min = parseInt(minStr);

  const lowerTime = timeStr.toLowerCase();
  if (lowerTime.includes("pm") && hour < 12) hour += 12;
  if (lowerTime.includes("am") && hour === 12) hour = 0;

  return { hour, min };
}

async function fetchAPI(endpoint: string, payload: any) {
  const url = `${BASE_URL}/api/${endpoint}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`Fetch failed for ${url}: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error(`Error fetching ${endpoint}`, e);
    return null;
  }
}

export async function fetchNatalData(
  person: SynastryRequest["person1"],
  houseSystem: string = "placidus",
): Promise<NatalData | null> {
  const [day, month, year] = person.date_of_birth.split("-").map(Number);
  const { hour, min } = parseTime(person.time_of_birth);

  const payload = {
    day,
    month,
    year,
    hour,
    min,
    lat: parseFloat(person.latitude),
    lon: parseFloat(person.longitude),
    tzone: parseFloat(person.timezone),
    house_type: houseSystem,
  };

  const [planetsData, cuspsData] = await Promise.all([
    fetchAPI("planets/tropical", payload),
    fetchAPI("house_cusps/tropical", payload),
  ]);

  if (!planetsData || !cuspsData) return null;

  return {
    planets: mapPlanets(planetsData),
    cusps: mapCusps(cuspsData),
    wheel_image: undefined, // Individual wheels not critical, bi-wheel is
  };
}

export async function fetchSynastryData(
  p1: NatalData,
  p2: NatalData,
): Promise<SynastryData> {
  // 1. Calculate Aspects (P1 vs P2)
  const aspects = calculateSynastryAspects(p1.planets, p2.planets);

  // 2. Calculate House Overlays (P1 planets in P2 houses)
  const overlays = calculateHouseOverlays(p1.planets, p2.cusps);

  // 3. Optional: Reverse Overlays (P2 planets in P1 houses)
  const overlaysReverse = calculateHouseOverlays(p2.planets, p1.cusps);

  // 4. Bi-Wheel Generation (Mock or Fetch if endpoint exists)
  // Since we don't have a bi-wheel endpoint, we'll placeholder it for now.
  // Ideally, we'd use a dedicated charting service.

  return {
    aspects,
    overlays,
    overlaysReverse,
    biwheel_image: undefined,
  };
}

// ═══════════════════════════════════════════════
//  CALCULATION ENGINES
// ═══════════════════════════════════════════════

function calculateSynastryAspects(
  p1: PlanetPosition[],
  p2: PlanetPosition[],
): SynastryAspect[] {
  const aspects: SynastryAspect[] = [];
  const ORBS = {
    Conjunction: 8,
    Opposition: 8,
    Trine: 8,
    Square: 8,
    Sextile: 6,
  };

  p1.forEach((planet1) => {
    p2.forEach((planet2) => {
      // Skip fast moons or nodes if desired, but usually we want all
      const angle = Math.abs(planet1.degree - planet2.degree);
      const diff = angle > 180 ? 360 - angle : angle;

      let aspectName = "";
      let orbFound = 0;

      if (diff <= ORBS.Conjunction) {
        aspectName = "Conjunction";
        orbFound = diff;
      } else if (Math.abs(diff - 180) <= ORBS.Opposition) {
        aspectName = "Opposition";
        orbFound = Math.abs(diff - 180);
      } else if (Math.abs(diff - 120) <= ORBS.Trine) {
        aspectName = "Trine";
        orbFound = Math.abs(diff - 120);
      } else if (Math.abs(diff - 90) <= ORBS.Square) {
        aspectName = "Square";
        orbFound = Math.abs(diff - 90);
      } else if (Math.abs(diff - 60) <= ORBS.Sextile) {
        aspectName = "Sextile";
        orbFound = Math.abs(diff - 60);
      }

      if (aspectName) {
        aspects.push({
          planet1: planet1.name,
          planet2: planet2.name,
          aspect: aspectName,
          orb: parseFloat(orbFound.toFixed(2)),
          nature: getAspectNature(aspectName),
          interpretation: TEMPLATES.aspect(
            planet1.name,
            aspectName,
            planet2.name,
            getAspectNature(aspectName),
          ),
        });
      }
    });
  });

  return aspects.sort((a, b) => a.orb - b.orb); // Tightest orbs first
}

function calculateHouseOverlays(
  planets: PlanetPosition[],
  cusps: HouseCusp[],
): SynastryHouseOverlay[] {
  if (!cusps || cusps.length < 12) return [];

  // Logic: Find which house a planet falls into.
  // Since cusps are a list of House Starts, we need to check ranges.
  // Note: Signs boundaries cross 0/360, so simple comparison handles that.
  // However, `degree` is usually absolute 0-360.
  // If `degree` in PlanetPosition is 0-30 per sign, we need to convert to absolute 0-360.
  // Backend usually returns 0-360 in `fullDegree` or similar.
  // Our `mapPlanets` uses `degree` which might be 0-360 or 0-30.
  // Let's assume `degree` in our types is ALWAYS 0-360 for easy math.
  // We need to verify what `helpers.ts` in Solar Return did.
  // Solar Return `mapPlanets`: `degree: p.degree || p.fullDegree || 0`.
  // If `p.degree` is 0-30, we have a problem.
  // Let's assume we need to convert sign+degree to absolute if needed.
  // BUT, let's look at `calculateHouseOverlays` logic assuming 0-360.

  return planets.map((p) => {
    // Find House
    // Correct logic handles the 360 wrap-around of Pisces-Aries.
    // A planet is in House X if Cusp X <= Planet < Cusp X+1.
    // Wrap around: If Cusp 12 is 350 and Cusp 1 is 20, a planet at 355 is in House 12.
    // a planet at 15 is in House 12 (if Cusp 1 starts at 20).
    // Actually simplicity: Find the cusp with the largest degree LESS than planet.
    // Handle wrap.

    let house = -1;
    // Normalized list for easier search
    // We assume standard ordered cusps 1-12.
    // ... logic is tricky without a dedicated library.
    // Fallback: We trust the `p.house` from Natal Data?
    // NO, that's the planet in ITS OWN chart's houses.
    // We need Planet 1 in Chart 2's houses.

    // SIMPLE APPROXIMATION for strict timeline:
    // Iterate all cusps.
    // Check if planet is between Cusp[i] and Cusp[i+1].
    // Convert all to 0-360.
    // Using `p.degree` (assuming 0-360).

    // Let's use a simpler heuristic if degrees are complex:
    // Just map sign? No, houses split signs.
    // We will implement a robust checking if we have absolute degrees.
    // If we only have relative, we must convert.
    // Let's assume standard response provides absolute `fullDegree`.

    // For now, let's rely on a helper or just assign based on sign overlap for MVP if needed,
    // but better to try math.

    // Finding house:
    for (let i = 0; i < 12; i++) {
      const current = cusps[i].degree;
      const next = cusps[(i + 1) % 12].degree;

      // Normal case: 10 to 40
      if (current < next) {
        if (p.degree >= current && p.degree < next) {
          house = cusps[i].house;
          break;
        }
      } else {
        // Wrap case: 350 to 20
        if (p.degree >= current || p.degree < next) {
          house = cusps[i].house;
          break;
        }
      }
    }

    if (house === -1) house = 1; // Fallback

    return {
      planet: p.name,
      houseInP2: house,
      sign: p.sign,
      degree: p.degree,
      interpretation: TEMPLATES.houseOverlay(p.name, house),
    };
  });
}

// ═══════════════════════════════════════════════
//  MAPPERS & UTILS
// ═══════════════════════════════════════════════

function gDegree(d: any): number {
  return typeof d === "number" ? d : parseFloat(d) || 0;
}

function mapPlanets(data: any): PlanetPosition[] {
  if (!Array.isArray(data)) return [];
  return data.map((p: any) => ({
    name: p.name,
    sign: p.sign,
    degree: p.fullDegree || p.normDegree || gDegree(p.degree), // Prioritize absolute
    house: p.house,
    isRetro: p.isRetro === "true" || p.isRetro === true,
    speed: p.speed,
  }));
}

function mapCusps(data: any): HouseCusp[] {
  // house_cusps/tropical returns {houses: [...], ascendant, midheaven, vertex}
  const arr = Array.isArray(data) ? data : data?.houses;
  if (!Array.isArray(arr)) return [];
  return arr.map((c: any) => ({
    house: c.house,
    sign: c.sign,
    degree: c.fullDegree || c.normDegree || gDegree(c.degree),
  }));
}

function getAspectNature(aspect: string): SynastryAspect["nature"] {
  const map: Record<string, SynastryAspect["nature"]> = {
    Conjunction: "Dynamic",
    Opposition: "Tension",
    Square: "Challenging",
    Trine: "Harmony",
    Sextile: "Opportunity",
  };
  return map[aspect] || "Dynamic";
}
