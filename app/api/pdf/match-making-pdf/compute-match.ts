// compute-match.ts — Local Vedic matchmaking computation
// Computes Ashtakoot/Dashakoot points, Rajju Dosha, Papasamyam,
// and other match data from individual astro_details & planets.

/* eslint-disable @typescript-eslint/no-explicit-any */

// ═══════════════════════════════════════════════════
//  CONSTANTS & LOOKUP TABLES
// ═══════════════════════════════════════════════════

const VARNA_ORDER: Record<string, number> = {
  Brahmin: 4,
  Kshatriya: 3,
  Vaishya: 2,
  Shudra: 1,
};

const VASHYA_MAP: Record<string, string> = {
  Aries: "Chatushpad",
  Taurus: "Chatushpad",
  Leo: "Vanchar",
  Gemini: "Manav",
  Virgo: "Manav",
  Libra: "Manav",
  Sagittarius: "Manav",
  Aquarius: "Manav",
  Cancer: "Jalchar",
  Pisces: "Jalchar",
  Capricorn: "Chatushpad",
  Scorpio: "Keeta",
};

// Vashya compatibility matrix → score out of 2
const VASHYA_SCORE: Record<string, Record<string, number>> = {
  Manav: { Manav: 2, Chatushpad: 2, Jalchar: 1, Vanchar: 1, Keeta: 0 },
  Chatushpad: { Manav: 1, Chatushpad: 2, Jalchar: 1, Vanchar: 0, Keeta: 0 },
  Jalchar: { Manav: 1, Chatushpad: 1, Jalchar: 2, Vanchar: 1, Keeta: 1 },
  Vanchar: { Manav: 0, Chatushpad: 1, Jalchar: 1, Vanchar: 2, Keeta: 1 },
  Keeta: { Manav: 0, Chatushpad: 0, Jalchar: 1, Vanchar: 0, Keeta: 2 },
};

const NAKSHATRA_LIST = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

// Each Nakshatra → Yoni animal
const NAKSHATRA_YONI: Record<string, string> = {
  Ashwini: "Horse",
  Bharani: "Elephant",
  Krittika: "Goat",
  Rohini: "Serpent",
  Mrigashira: "Serpent",
  Ardra: "Dog",
  Punarvasu: "Cat",
  Pushya: "Goat",
  Ashlesha: "Cat",
  Magha: "Rat",
  "Purva Phalguni": "Rat",
  "Uttara Phalguni": "Cow",
  Hasta: "Buffalo",
  Chitra: "Tiger",
  Swati: "Buffalo",
  Vishakha: "Tiger",
  Anuradha: "Deer",
  Jyeshtha: "Deer",
  Mula: "Dog",
  "Purva Ashadha": "Monkey",
  "Uttara Ashadha": "Mongoose",
  Shravana: "Monkey",
  Dhanishta: "Lion",
  Shatabhisha: "Horse",
  "Purva Bhadrapada": "Lion",
  "Uttara Bhadrapada": "Cow",
  Revati: "Elephant",
};

// Yoni compatibility: 0=Enemy, 1=Neutral-bad, 2=Neutral, 3=Friendly, 4=Same
const YONI_MATRIX: Record<string, Record<string, number>> = {
  Horse: {
    Horse: 4,
    Elephant: 2,
    Goat: 2,
    Serpent: 1,
    Dog: 2,
    Cat: 2,
    Rat: 2,
    Cow: 1,
    Buffalo: 0,
    Tiger: 1,
    Deer: 1,
    Monkey: 3,
    Mongoose: 2,
    Lion: 1,
  },
  Elephant: {
    Horse: 2,
    Elephant: 4,
    Goat: 3,
    Serpent: 3,
    Dog: 2,
    Cat: 2,
    Rat: 2,
    Cow: 2,
    Buffalo: 3,
    Tiger: 1,
    Deer: 3,
    Monkey: 2,
    Mongoose: 2,
    Lion: 0,
  },
  Goat: {
    Horse: 2,
    Elephant: 3,
    Goat: 4,
    Serpent: 2,
    Dog: 1,
    Cat: 2,
    Rat: 1,
    Cow: 3,
    Buffalo: 2,
    Tiger: 0,
    Deer: 2,
    Monkey: 3,
    Mongoose: 2,
    Lion: 1,
  },
  Serpent: {
    Horse: 1,
    Elephant: 3,
    Goat: 2,
    Serpent: 4,
    Dog: 2,
    Cat: 1,
    Rat: 1,
    Cow: 1,
    Buffalo: 2,
    Tiger: 2,
    Deer: 1,
    Monkey: 0,
    Mongoose: 0,
    Lion: 2,
  },
  Dog: {
    Horse: 2,
    Elephant: 2,
    Goat: 1,
    Serpent: 2,
    Dog: 4,
    Cat: 1,
    Rat: 1,
    Cow: 2,
    Buffalo: 2,
    Tiger: 2,
    Deer: 0,
    Monkey: 1,
    Mongoose: 2,
    Lion: 2,
  },
  Cat: {
    Horse: 2,
    Elephant: 2,
    Goat: 2,
    Serpent: 1,
    Dog: 1,
    Cat: 4,
    Cat_Rat: 0,
    Rat: 0,
    Cow: 2,
    Buffalo: 2,
    Tiger: 1,
    Deer: 2,
    Monkey: 3,
    Mongoose: 2,
    Lion: 1,
  },
  Rat: {
    Horse: 2,
    Elephant: 2,
    Goat: 1,
    Serpent: 1,
    Dog: 1,
    Cat: 0,
    Rat: 4,
    Cow: 2,
    Buffalo: 1,
    Tiger: 2,
    Deer: 2,
    Monkey: 2,
    Mongoose: 1,
    Lion: 2,
  },
  Cow: {
    Horse: 1,
    Elephant: 2,
    Goat: 3,
    Serpent: 1,
    Dog: 2,
    Cat: 2,
    Rat: 2,
    Cow: 4,
    Buffalo: 3,
    Tiger: 0,
    Deer: 2,
    Monkey: 2,
    Mongoose: 2,
    Lion: 1,
  },
  Buffalo: {
    Horse: 0,
    Elephant: 3,
    Goat: 2,
    Serpent: 2,
    Dog: 2,
    Cat: 2,
    Rat: 1,
    Cow: 3,
    Buffalo: 4,
    Tiger: 1,
    Deer: 2,
    Monkey: 1,
    Mongoose: 1,
    Lion: 1,
  },
  Tiger: {
    Horse: 1,
    Elephant: 1,
    Goat: 0,
    Serpent: 2,
    Dog: 2,
    Cat: 1,
    Rat: 2,
    Cow: 0,
    Buffalo: 1,
    Tiger: 4,
    Deer: 1,
    Monkey: 1,
    Mongoose: 2,
    Lion: 3,
  },
  Deer: {
    Horse: 1,
    Elephant: 3,
    Goat: 2,
    Serpent: 1,
    Dog: 0,
    Cat: 2,
    Rat: 2,
    Cow: 2,
    Buffalo: 2,
    Tiger: 1,
    Deer: 4,
    Monkey: 2,
    Mongoose: 2,
    Lion: 2,
  },
  Monkey: {
    Horse: 3,
    Elephant: 2,
    Goat: 3,
    Serpent: 0,
    Dog: 1,
    Cat: 3,
    Rat: 2,
    Cow: 2,
    Buffalo: 1,
    Tiger: 1,
    Deer: 2,
    Monkey: 4,
    Mongoose: 2,
    Lion: 2,
  },
  Mongoose: {
    Horse: 2,
    Elephant: 2,
    Goat: 2,
    Serpent: 0,
    Dog: 2,
    Cat: 2,
    Rat: 1,
    Cow: 2,
    Buffalo: 1,
    Tiger: 2,
    Deer: 2,
    Monkey: 2,
    Mongoose: 4,
    Lion: 2,
  },
  Lion: {
    Horse: 1,
    Elephant: 0,
    Goat: 1,
    Serpent: 2,
    Dog: 2,
    Cat: 1,
    Rat: 2,
    Cow: 1,
    Buffalo: 1,
    Tiger: 3,
    Deer: 2,
    Monkey: 2,
    Mongoose: 2,
    Lion: 4,
  },
};

// Planet lord friendship table for Graha Maitri
// 0=Enemy, 1=Neutral, 2=Friend
const GRAHA_MAITRI: Record<string, Record<string, number>> = {
  Sun: {
    Sun: 2,
    Moon: 2,
    Mars: 2,
    Mercury: 0,
    Jupiter: 2,
    Venus: 0,
    Saturn: 0,
  },
  Moon: {
    Sun: 2,
    Moon: 2,
    Mars: 1,
    Mercury: 2,
    Jupiter: 1,
    Venus: 1,
    Saturn: 1,
  },
  Mars: {
    Sun: 2,
    Moon: 2,
    Mars: 2,
    Mercury: 0,
    Jupiter: 2,
    Venus: 1,
    Saturn: 1,
  },
  Mercury: {
    Sun: 2,
    Moon: 0,
    Mars: 1,
    Mercury: 2,
    Jupiter: 1,
    Venus: 2,
    Saturn: 2,
  },
  Jupiter: {
    Sun: 2,
    Moon: 2,
    Mars: 2,
    Mercury: 0,
    Jupiter: 2,
    Venus: 0,
    Saturn: 1,
  },
  Venus: {
    Sun: 0,
    Moon: 1,
    Mars: 1,
    Mercury: 2,
    Jupiter: 1,
    Venus: 2,
    Saturn: 2,
  },
  Saturn: {
    Sun: 0,
    Moon: 0,
    Mars: 1,
    Mercury: 2,
    Jupiter: 1,
    Venus: 2,
    Saturn: 2,
  },
};

// Gana compatibility matrix → score out of 6
const GANA_SCORE: Record<string, Record<string, number>> = {
  Dev: { Dev: 6, Manushya: 6, Rakshas: 1 },
  Manushya: { Dev: 5, Manushya: 6, Rakshas: 0 },
  Rakshas: { Dev: 1, Manushya: 0, Rakshas: 6 },
};

// Rashi (sign) order for Bhakoot
const RASHI_LIST = [
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

// Sign lord mapping
const SIGN_LORD: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

// Nadi mapping for each nakshatra (cyclic: Aadi, Madhya, Antya)
const NAKSHATRA_NADI: Record<string, string> = {};
NAKSHATRA_LIST.forEach((nak, i) => {
  const cycle = i % 3;
  NAKSHATRA_NADI[nak] = cycle === 0 ? "Aadi" : cycle === 1 ? "Madhya" : "Antya";
});

// Rajju groups
const RAJJU_GROUPS: Record<string, string[]> = {
  Paada: ["Ashwini", "Ashlesha", "Magha", "Jyeshtha", "Mula", "Revati"],
  Kati: [
    "Bharani",
    "Pushya",
    "Purva Phalguni",
    "Anuradha",
    "Purva Ashadha",
    "Uttara Bhadrapada",
  ],
  Nabhi: [
    "Krittika",
    "Punarvasu",
    "Uttara Phalguni",
    "Vishakha",
    "Uttara Ashadha",
    "Purva Bhadrapada",
  ],
  Kantha: ["Rohini", "Ardra", "Hasta", "Swati", "Shravana", "Shatabhisha"],
  Shira: ["Mrigashira", "Chitra", "Dhanishta"],
};

// ═══════════════════════════════════════════════════
//  HELPER UTILITIES
// ═══════════════════════════════════════════════════

function getNakshatraIndex(name: string): number {
  const idx = NAKSHATRA_LIST.findIndex(
    (n) => n.toLowerCase() === name?.toLowerCase(),
  );
  return idx >= 0 ? idx : 0;
}

function getRashiIndex(sign: string): number {
  const idx = RASHI_LIST.findIndex(
    (r) => r.toLowerCase() === sign?.toLowerCase(),
  );
  return idx >= 0 ? idx : 0;
}

function getRajjuGroup(nakshatra: string): string {
  for (const [group, naks] of Object.entries(RAJJU_GROUPS)) {
    if (naks.some((n) => n.toLowerCase() === nakshatra?.toLowerCase())) {
      return group;
    }
  }
  return "Unknown";
}

// Extract useful fields from astro_details API response
function extractAstroInfo(astroDetails: any) {
  return {
    varna: String(astroDetails?.Varna || astroDetails?.varna || "Shudra"),
    vashya: String(astroDetails?.Vashya || astroDetails?.vashya || "Manav"),
    yoni: String(astroDetails?.Yoni || astroDetails?.yoni || "Horse"),
    gana: String(
      astroDetails?.Gan ||
        astroDetails?.gan ||
        astroDetails?.Gana ||
        astroDetails?.gana ||
        "Dev",
    ),
    nadi: String(astroDetails?.Nadi || astroDetails?.nadi || "Aadi"),
    nakshatra: String(
      astroDetails?.Nakshatra || astroDetails?.nakshatra || "Ashwini",
    ),
    sign: String(
      astroDetails?.SignName ||
        astroDetails?.sign ||
        astroDetails?.Sign ||
        "Aries",
    ),
    signLord: String(
      astroDetails?.SignLord || astroDetails?.sign_lord || "Mars",
    ),
    nakshatraLord: String(
      astroDetails?.NakshatraLord || astroDetails?.nakshatra_lord || "Ketu",
    ),
  };
}

// ═══════════════════════════════════════════════════
//  ASHTAKOOT COMPUTATION (8 Kootas, 36 Points)
// ═══════════════════════════════════════════════════

function computeVarna(maleVarna: string, femaleVarna: string) {
  const mScore = VARNA_ORDER[maleVarna] || 1;
  const fScore = VARNA_ORDER[femaleVarna] || 1;
  return {
    male_koota: maleVarna,
    female_koota: femaleVarna,
    total_points: 1,
    received_points: mScore >= fScore ? 1 : 0,
  };
}

function computeVashya(maleSign: string, femaleSign: string) {
  const mVashya = VASHYA_MAP[maleSign] || "Manav";
  const fVashya = VASHYA_MAP[femaleSign] || "Manav";
  const score = VASHYA_SCORE[mVashya]?.[fVashya] ?? 1;
  return {
    male_koota: mVashya,
    female_koota: fVashya,
    total_points: 2,
    received_points: score,
  };
}

function computeTara(maleNak: string, femaleNak: string) {
  const mIdx = getNakshatraIndex(maleNak);
  const fIdx = getNakshatraIndex(femaleNak);
  const remainder = (fIdx - mIdx + 27) % 9;
  // Tara positions 0(Janma), 2(Vipat), 4(Pratyari), 6(Vadha), 8(Naidhana) are bad
  const isBad =
    remainder === 0 ||
    remainder === 2 ||
    remainder === 4 ||
    remainder === 6 ||
    remainder === 8;
  // Also check reverse
  const reverseRem = (mIdx - fIdx + 27) % 9;
  const isReverseBad =
    reverseRem === 0 ||
    reverseRem === 2 ||
    reverseRem === 4 ||
    reverseRem === 6 ||
    reverseRem === 8;

  let score = 3;
  if (isBad && isReverseBad) score = 0;
  else if (isBad || isReverseBad) score = 1.5;

  return {
    male_koota: maleNak,
    female_koota: femaleNak,
    total_points: 3,
    received_points: score,
  };
}

function computeYoni(maleNak: string, femaleNak: string) {
  const mYoni = NAKSHATRA_YONI[maleNak] || "Horse";
  const fYoni = NAKSHATRA_YONI[femaleNak] || "Horse";
  const score = YONI_MATRIX[mYoni]?.[fYoni] ?? 2;
  return {
    male_koota: `${mYoni}`,
    female_koota: `${fYoni}`,
    total_points: 4,
    received_points: score,
  };
}

function computeGrahaMaitri(maleLord: string, femaleLord: string) {
  const friendship = GRAHA_MAITRI[maleLord]?.[femaleLord] ?? 1;
  const reverseFriendship = GRAHA_MAITRI[femaleLord]?.[maleLord] ?? 1;

  let score = 0;
  const sum = friendship + reverseFriendship;
  if (sum >= 4) score = 5;
  else if (sum === 3) score = 4;
  else if (sum === 2) score = 3;
  else if (sum === 1) score = 1;
  else score = 0;

  return {
    male_koota: maleLord,
    female_koota: femaleLord,
    total_points: 5,
    received_points: score,
  };
}

function computeGana(maleGana: string, femaleGana: string) {
  // Normalize gana names
  const normalize = (g: string) => {
    const lower = g.toLowerCase();
    if (lower.includes("dev") || lower.includes("deva")) return "Dev";
    if (
      lower.includes("rakshas") ||
      lower.includes("rakshasa") ||
      lower.includes("asura")
    )
      return "Rakshas";
    return "Manushya";
  };
  const mG = normalize(maleGana);
  const fG = normalize(femaleGana);
  const score = GANA_SCORE[mG]?.[fG] ?? 0;
  return {
    male_koota: mG,
    female_koota: fG,
    total_points: 6,
    received_points: score,
  };
}

function computeBhakoot(maleSign: string, femaleSign: string) {
  const mIdx = getRashiIndex(maleSign);
  const fIdx = getRashiIndex(femaleSign);
  const diff = ((fIdx - mIdx + 12) % 12) + 1; // 1-12

  // 2-12, 6-8, 5-9 are inauspicious combinations
  const isBad =
    diff === 2 ||
    diff === 12 ||
    diff === 6 ||
    diff === 8 ||
    diff === 5 ||
    diff === 9;

  return {
    male_koota: maleSign,
    female_koota: femaleSign,
    total_points: 7,
    received_points: isBad ? 0 : 7,
  };
}

function computeNadi(maleNadi: string, femaleNadi: string) {
  const normalize = (n: string) => {
    const lower = n.toLowerCase();
    if (
      lower.includes("aadi") ||
      lower.includes("adi") ||
      lower.includes("vaat")
    )
      return "Aadi";
    if (lower.includes("madhya") || lower.includes("pitta")) return "Madhya";
    return "Antya";
  };
  const mN = normalize(maleNadi);
  const fN = normalize(femaleNadi);
  return {
    male_koota: mN,
    female_koota: fN,
    total_points: 8,
    received_points: mN === fN ? 0 : 8,
  };
}

// ═══════════════════════════════════════════════════
//  FULL ASHTAKOOT
// ═══════════════════════════════════════════════════

export function computeAshtakoot(maleAstro: any, femaleAstro: any) {
  const m = extractAstroInfo(maleAstro);
  const f = extractAstroInfo(femaleAstro);

  const varna = computeVarna(m.varna, f.varna);
  const vashya = computeVashya(m.sign, f.sign);
  const tara = computeTara(m.nakshatra, f.nakshatra);
  const yoni = computeYoni(m.nakshatra, f.nakshatra);
  const grahaMaitri = computeGrahaMaitri(m.signLord, f.signLord);
  const gana = computeGana(m.gana, f.gana);
  const bhakoot = computeBhakoot(m.sign, f.sign);
  const nadi = computeNadi(m.nadi, f.nadi);

  const totalReceived =
    varna.received_points +
    vashya.received_points +
    tara.received_points +
    yoni.received_points +
    grahaMaitri.received_points +
    gana.received_points +
    bhakoot.received_points +
    nadi.received_points;

  return {
    varna,
    vashya,
    tara,
    yoni,
    graha_maitri: grahaMaitri,
    gana,
    bhakoot,
    nadi,
    total: totalReceived,
    maximum: 36,
    score: totalReceived,
    max_points: 36,
    report:
      totalReceived >= 25
        ? "Excellent match! The compatibility score is very high indicating a highly harmonious union."
        : totalReceived >= 18
          ? "Good match. The compatibility is favorable for marriage with some minor considerations."
          : totalReceived >= 12
            ? "Average match. The compatibility has some challenges that can be managed with understanding."
            : "Below average match. Careful consideration and remedies are recommended.",
  };
}

// ═══════════════════════════════════════════════════
//  DASHAKOOT (extends Ashtakoot with Rajju + Vedha)
// ═══════════════════════════════════════════════════

export function computeDashakoot(maleAstro: any, femaleAstro: any) {
  const ashtakoot = computeAshtakoot(maleAstro, femaleAstro);
  const m = extractAstroInfo(maleAstro);
  const f = extractAstroInfo(femaleAstro);

  // Rajju (no additional points, just check)
  const mRajju = getRajjuGroup(m.nakshatra);
  const fRajju = getRajjuGroup(f.nakshatra);
  const rajjuMatch = mRajju !== fRajju;

  // Vedha — simplified: certain nakshatra pairs cause Vedha dosha
  // For simplicity, no Vedha penalty (full computation is very complex)
  const vedha = {
    male_koota: m.nakshatra,
    female_koota: f.nakshatra,
    total_points: 0,
    received_points: 0,
  };

  return {
    ...ashtakoot,
    rajju: {
      male_koota: mRajju,
      female_koota: fRajju,
      total_points: 0,
      received_points: rajjuMatch ? 0 : 0,
      has_dosha: !rajjuMatch,
    },
    vedha,
    total: ashtakoot.total,
    maximum: 36,
  };
}

// ═══════════════════════════════════════════════════
//  RAJJU DOSHA
// ═══════════════════════════════════════════════════

export function computeRajjuDosha(maleAstro: any, femaleAstro: any) {
  const m = extractAstroInfo(maleAstro);
  const f = extractAstroInfo(femaleAstro);
  const mGroup = getRajjuGroup(m.nakshatra);
  const fGroup = getRajjuGroup(f.nakshatra);
  const hasDosha = mGroup === fGroup;

  let report = "";
  if (hasDosha) {
    report =
      `Both ${m.nakshatra} and ${f.nakshatra} belong to the ${mGroup} Rajju group. ` +
      "When both Nakshatras fall in the same Rajju, it is considered inauspicious. " +
      "Remedies like specific pujas and charitable acts are recommended to mitigate the effects.";
  } else {
    report =
      `${m.nakshatra} belongs to ${mGroup} Rajju and ${f.nakshatra} belongs to ${fGroup} Rajju. ` +
      "Since both Nakshatras fall in different Rajju groups, there is no Rajju Dosha. " +
      "This is a favorable indication for the match.";
  }

  return {
    has_rajju_dosha: hasDosha,
    rajju_dosha: hasDosha,
    male_nakshatra: m.nakshatra,
    female_nakshatra: f.nakshatra,
    male_rajju: mGroup,
    female_rajju: fGroup,
    report,
    description: report,
  };
}

// ═══════════════════════════════════════════════════
//  PAPASAMYAM (Malefic Balance)
// ═══════════════════════════════════════════════════

function computePapaForPerson(planets: any) {
  // Calculate papa (malefic) points from Sun, Mars, Saturn, Rahu
  // For each planet, check position relative to Ascendant, Moon, Venus
  const planetList = Array.isArray(planets) ? planets : [];

  const findPlanet = (name: string) => {
    return planetList.find(
      (p: any) =>
        (p.name || p.planet || "").toLowerCase() === name.toLowerCase(),
    );
  };

  const sunData = findPlanet("Sun");
  const marsData = findPlanet("Mars");
  const saturnData = findPlanet("Saturn");
  const rahuData = findPlanet("Rahu");
  const moonData = findPlanet("Moon");
  const venusData = findPlanet("Venus");
  const ascSign = planetList.find(
    (p: any) => (p.name || "").toLowerCase() === "ascendant",
  );

  // Compute simplified papa points
  const getPapaScore = (maleficHouse: number) => {
    // Houses 1, 2, 4, 7, 8, 12 for papa
    const papaHouses = [1, 2, 4, 7, 8, 12];
    return papaHouses.includes(maleficHouse) ? 1 : 0;
  };

  const getHouseFromSign = (planetSign: number, referenceSign: number) => {
    if (!planetSign || !referenceSign) return 0;
    return ((planetSign - referenceSign + 12) % 12) + 1;
  };

  const ascSignNum = ascSign?.sign_id || ascSign?.Sign?.id || 1;
  const moonSignNum = moonData?.sign_id || moonData?.Sign?.id || 1;
  const venusSignNum = venusData?.sign_id || venusData?.Sign?.id || 1;

  const calcPoints = (planet: any) => {
    const pSign = planet?.sign_id || planet?.Sign?.id || 0;
    if (!pSign) return { ascendant: 0, moon: 0, venus: 0 };
    return {
      ascendant: getPapaScore(getHouseFromSign(pSign, ascSignNum)),
      moon: getPapaScore(getHouseFromSign(pSign, moonSignNum)),
      venus: getPapaScore(getHouseFromSign(pSign, venusSignNum)),
    };
  };

  const sunPapa = calcPoints(sunData);
  const marsPapa = calcPoints(marsData);
  const saturnPapa = calcPoints(saturnData);
  const rahuPapa = calcPoints(rahuData);

  const total = {
    ascendant:
      sunPapa.ascendant +
      marsPapa.ascendant +
      saturnPapa.ascendant +
      rahuPapa.ascendant,
    moon: sunPapa.moon + marsPapa.moon + saturnPapa.moon + rahuPapa.moon,
    venus: sunPapa.venus + marsPapa.venus + saturnPapa.venus + rahuPapa.venus,
  };

  return {
    sun: {
      from_ascendant: String(sunPapa.ascendant),
      from_moon: String(sunPapa.moon),
      from_venus: String(sunPapa.venus),
    },
    mars: {
      from_ascendant: String(marsPapa.ascendant),
      from_moon: String(marsPapa.moon),
      from_venus: String(marsPapa.venus),
    },
    saturn: {
      from_ascendant: String(saturnPapa.ascendant),
      from_moon: String(saturnPapa.moon),
      from_venus: String(saturnPapa.venus),
    },
    rahu: {
      from_ascendant: String(rahuPapa.ascendant),
      from_moon: String(rahuPapa.moon),
      from_venus: String(rahuPapa.venus),
    },
    total: {
      from_ascendant: String(total.ascendant),
      from_moon: String(total.moon),
      from_venus: String(total.venus),
    },
  };
}

export function computePapasamyam(malePlanets: any, femalePlanets: any) {
  const male = computePapaForPerson(malePlanets);
  const female = computePapaForPerson(femalePlanets);

  const mTotal =
    parseInt(male.total.from_ascendant) +
    parseInt(male.total.from_moon) +
    parseInt(male.total.from_venus);
  const fTotal =
    parseInt(female.total.from_ascendant) +
    parseInt(female.total.from_moon) +
    parseInt(female.total.from_venus);
  const diff = Math.abs(mTotal - fTotal);

  return {
    male_piyadhipati: male,
    female_piyadhipati: female,
    conclusion:
      diff <= 2
        ? "The papa (malefic) balance between both horoscopes is within acceptable limits. This indicates a harmonious match."
        : "There is a significant difference in papa (malefic) influence between both horoscopes. Remedial measures may be recommended.",
    papa_status: diff <= 2 ? "Balanced" : "Imbalanced",
  };
}

// ═══════════════════════════════════════════════════
//  MANGLIK MATCH REPORT
// ═══════════════════════════════════════════════════

export function computeManglikMatch(maleManglik: any, femaleManglik: any) {
  const mIs =
    maleManglik?.is_piyadhipati || maleManglik?.is_manglik_piyadhipati || false;
  const fIs =
    femaleManglik?.is_piyadhipati ||
    femaleManglik?.is_manglik_piyadhipati ||
    false;

  let conclusion = "";
  if (mIs && fIs) {
    conclusion =
      "Both partners have Manglik Dosha. When both partners are Manglik, the effects are mutually neutralized and the match is considered compatible from a Manglik perspective.";
  } else if (!mIs && !fIs) {
    conclusion =
      "Neither partner has Manglik Dosha. The match is considered favorable from a Manglik perspective with no adverse effects.";
  } else {
    conclusion = `${mIs ? "The male" : "The female"} partner has Manglik Dosha while the other does not. Appropriate remedies such as Mangal Shanti Puja or matching with specific conditions may be suggested to mitigate negative effects.`;
  }

  return {
    male_is_manglik: mIs,
    female_is_manglik: fIs,
    conclusion,
    report: conclusion,
    manglik_report: conclusion,
  };
}

// ═══════════════════════════════════════════════════
//  MATCH BIRTH DETAILS
// ═══════════════════════════════════════════════════

export function computeMatchBirthDetails(maleBirth: any, femaleBirth: any) {
  return {
    male: maleBirth || {},
    female: femaleBirth || {},
  };
}

// ═══════════════════════════════════════════════════
//  MATCH PLANET DETAILS
// ═══════════════════════════════════════════════════

export function computeMatchPlanetDetails(
  malePlanets: any,
  femalePlanets: any,
) {
  return {
    male: malePlanets || [],
    female: femalePlanets || [],
  };
}

// ═══════════════════════════════════════════════════
//  OVERALL MATCH MAKING REPORT
// ═══════════════════════════════════════════════════

export function computeMatchMakingReport(
  ashtakootScore: number,
  hasRajjuDosha: boolean,
  maleManglik: boolean,
  femaleManglik: boolean,
  lang: string,
) {
  const percentage = ((ashtakootScore / 36) * 100).toFixed(1);
  const isGoodMatch = ashtakootScore >= 18 && !hasRajjuDosha;

  if (lang === "hi") {
    return {
      score: ashtakootScore,
      max_score: 36,
      percentage,
      conclusion: isGoodMatch
        ? `कुंडली मिलान के अनुसार, कुल ${ashtakootScore}/36 गुण मिले हैं (${percentage}%)। ${
            hasRajjuDosha
              ? "राज्जु दोष पाया गया है जिसके लिए उपाय सुझाए गए हैं।"
              : "कोई प्रमुख दोष नहीं पाया गया।"
          } ${
            maleManglik || femaleManglik
              ? "मंगल दोष की स्थिति का विश्लेषण किया गया है।"
              : "दोनों कुंडलियों में मंगल दोष नहीं है।"
          } कुल मिलाकर, यह जोड़ा विवाह के लिए ${ashtakootScore >= 25 ? "अत्यंत अनुकूल" : ashtakootScore >= 18 ? "अनुकूल" : "औसत"} माना जा सकता है।`
        : `कुंडली मिलान में कुल ${ashtakootScore}/36 गुण मिले हैं (${percentage}%)। गुण मिलान का स्कोर औसत से कम है। ${
            hasRajjuDosha ? "राज्जु दोष भी पाया गया है।" : ""
          } विवाह से पूर्व उचित उपाय और ज्योतिषीय परामर्श लेना उचित होगा।`,
      report: `गुण मिलान: ${ashtakootScore}/36 (${percentage}%)`,
      compatibility_report: `विस्तृत कुंडली विश्लेषण`,
    };
  }

  return {
    score: ashtakootScore,
    max_score: 36,
    percentage,
    conclusion: isGoodMatch
      ? `Based on Kundli matching analysis, the total compatibility score is ${ashtakootScore}/36 (${percentage}%). ${
          hasRajjuDosha
            ? "Rajju Dosha has been identified and remedies are suggested."
            : "No major doshas were found."
        } ${
          maleManglik || femaleManglik
            ? "Manglik Dosha status has been analyzed for both partners."
            : "Neither partner has Manglik Dosha."
        } Overall, this match is considered ${ashtakootScore >= 25 ? "highly favorable" : "favorable"} for marriage.`
      : `Based on Kundli matching analysis, the total compatibility score is ${ashtakootScore}/36 (${percentage}%). The score is below the recommended threshold. ${
          hasRajjuDosha ? "Rajju Dosha has also been identified." : ""
        } Appropriate astrological consultation and remedies are recommended before proceeding with the marriage.`,
    report: `Compatibility Score: ${ashtakootScore}/36 (${percentage}%)`,
    compatibility_report: `Detailed horoscope compatibility analysis`,
  };
}

// ═══════════════════════════════════════════════════
//  MAIN: Compute all match data
// ═══════════════════════════════════════════════════

export function computeAllMatchData(
  maleData: Record<string, any>,
  femaleData: Record<string, any>,
  lang: string = "en",
) {
  const maleAstro = maleData.astro_details;
  const femaleAstro = femaleData.astro_details;

  // Ashtakoot & Dashakoot
  const ashtakoot = computeAshtakoot(maleAstro, femaleAstro);
  const dashakoot = computeDashakoot(maleAstro, femaleAstro);

  // Rajju Dosha
  const rajju = computeRajjuDosha(maleAstro, femaleAstro);

  // Papasamyam
  const papa = computePapasamyam(maleData.planets, femaleData.planets);

  // Manglik Match
  const manglik = computeManglikMatch(maleData.manglik, femaleData.manglik);

  // Birth & Planet details
  const birthDetails = computeMatchBirthDetails(
    maleData.birth_details,
    femaleData.birth_details,
  );
  const planetDetails = computeMatchPlanetDetails(
    maleData.planets,
    femaleData.planets,
  );

  // Overall report
  const report = computeMatchMakingReport(
    ashtakoot.total,
    rajju.has_rajju_dosha,
    manglik.male_is_manglik,
    manglik.female_is_manglik,
    lang,
  );

  return {
    match_birth_details: birthDetails,
    match_ashtakoot_points: ashtakoot,
    match_manglik_report: manglik,
    match_dashakoot_points: dashakoot,
    match_planet_details: planetDetails,
    match_making_report: report,
    papasamyam: papa,
    rajju_dosha: rajju,
  };
}
