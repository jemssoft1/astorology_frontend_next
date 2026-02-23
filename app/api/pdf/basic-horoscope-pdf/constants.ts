// constants.ts — Constants and i18n labels for Basic Horoscope PDF
// Re-exports shared constants from mini-horoscope-pdf

export {
  ZODIAC_SIGNS,
  SIGN_LORDS,
  NAKSHATRAS,
  NAKSHATRA_LORDS,
  PLANET_SYMBOLS,
  COLORS,
  ASCENDANT_DATA,
} from "../mini-horoscope-pdf/constants";
export type { Labels, AscendantMeta } from "../mini-horoscope-pdf/constants";

import { COLORS } from "../mini-horoscope-pdf/constants";
import type { Labels } from "../mini-horoscope-pdf/constants";

// ============================================
// Vimshottari Dasha page planet order
// ============================================
export const DASHA_ORDER_PAGE7 = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
];
export const DASHA_ORDER_PAGE8 = ["Saturn", "Rahu", "Ketu"];
// Planet ID to Name mapping (Vedic Astrology API format)
export const PLANET_ID_MAP: Record<number, string> = {
  0: "Sun",
  1: "Moon",
  2: "Mars",
  3: "Mercury",
  4: "Jupiter",
  5: "Venus",
  6: "Saturn",
  7: "Rahu",
  8: "Ketu",
  9: "Uranus",
  10: "Neptune",
  11: "Pluto",
};

// ============================================
// Divisional Charts Config (Page 5)
// ============================================
export interface DivisionalChartConfig {
  id: string;
  apiChart: string; // backend chart id
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
}

export const DIVISIONAL_CHARTS: DivisionalChartConfig[] = [
  {
    id: "sun",
    apiChart: "SUN",
    title: "Sun Chart",
    titleHi: "Surya Kundali",
    subtitle: "Health, Constitution, Body",
    subtitleHi: "Swasthya, Shareer Rachna",
  },
  {
    id: "D2",
    apiChart: "D2",
    title: "Hora Chart (D2)",
    titleHi: "Hora Kundali (D2)",
    subtitle: "Finance, Wealth, Prosperity",
    subtitleHi: "Vittiya, Dhan, Samridhi",
  },
  {
    id: "D3",
    apiChart: "D3",
    title: "Dreshkan Chart (D3)",
    titleHi: "Dreshkan Kundali (D3)",
    subtitle: "Brothers, Sisters",
    subtitleHi: "Bhai, Behen",
  },
  {
    id: "D4",
    apiChart: "D4",
    title: "Chaturthamsha Chart (D4)",
    titleHi: "Chaturthamsha Kundali (D4)",
    subtitle: "Fortunes, Luck of native",
    subtitleHi: "Bhagya, Kismat",
  },
  {
    id: "D5",
    apiChart: "D5",
    title: "Panchmansha Chart (D5)",
    titleHi: "Panchmansha Kundali (D5)",
    subtitle: "Shows Spiritualism",
    subtitleHi: "Adhyatmikta",
  },
  {
    id: "D7",
    apiChart: "D7",
    title: "Saptamansha Chart (D7)",
    titleHi: "Saptamansha Kundali (D7)",
    subtitle: "Impregnation, Birth of the child",
    subtitleHi: "Santan Prapti",
  },
  {
    id: "D8",
    apiChart: "D8",
    title: "Ashtamansha Chart (D8)",
    titleHi: "Ashtamansha Kundali (D8)",
    subtitle: "Shows Longevity",
    subtitleHi: "Aayu Darshak",
  },
  {
    id: "D10",
    apiChart: "D10",
    title: "Dashamansha Chart (D10)",
    titleHi: "Dashamansha Kundali (D10)",
    subtitle: "Livelihood, Profession",
    subtitleHi: "Jeevikoparjan, Vyavsaya",
  },
  {
    id: "D12",
    apiChart: "D12",
    title: "Dwadasha Chart (D12)",
    titleHi: "Dwadasha Kundali (D12)",
    subtitle: "Parents, Paternal happiness",
    subtitleHi: "Mata-Pita, Paitrik Sukh",
  },
];

// ============================================
// Yogini Dasha names
// ============================================
export const YOGINI_DASHAS = [
  { name: "Mangala", years: 1 },
  { name: "Pingala", years: 2 },
  { name: "Dhanya", years: 3 },
  { name: "Bhramari", years: 4 },
  { name: "Bhadrika", years: 5 },
  { name: "Ulka", years: 6 },
  { name: "Siddha", years: 7 },
  { name: "Sankata", years: 8 },
];

// ============================================
// Numerology favourable fields
// ============================================
export const NUMEROLOGY_FIELDS_EN = [
  "Your Name",
  "Date of birth",
  "Radical Number",
  "Radical Ruler",
  "Friendly Numbers",
  "Neutral Numbers",
  "Evil Numbers",
  "Favourable Days",
  "Favourable Stone",
  "Favourable Sub Stone",
  "Favourable God",
  "Favourable Metal",
  "Favourable Color",
  "Favourable Mantra",
];

export const NUMEROLOGY_FIELDS_HI = [
  "Aapka Naam",
  "Janam Tithi",
  "Moolank",
  "Moolank Swami",
  "Mitra Ank",
  "Saamanya Ank",
  "Shatru Ank",
  "Shubh Din",
  "Shubh Ratna",
  "Shubh Up-Ratna",
  "Shubh Devta",
  "Shubh Dhatu",
  "Shubh Rang",
  "Shubh Mantra",
];

// ============================================
// Extended i18n Labels for Basic Horoscope PDF
// ============================================
const EN_BASIC: Labels = {
  // Cover & basics (reused keys)
  title: "Basic Horoscope Report",
  coverSubtitle: "Vedic Astrology Report",
  name: "Name",
  dob: "Date of Birth",
  tob: "Time of Birth",
  pob: "Place of Birth",
  generatedOn: "Generated On",
  language: "Language",
  basicDetails: "Basic Details",
  panchangDetails: "Panchang Details",
  astroDetails: "Astrological Details",
  ghatChakra: "Ghat Chakra",
  latitude: "Latitude",
  longitude: "Longitude",
  timezone: "Timezone",
  ayanamsa: "Ayanamsa",
  tithi: "Tithi",
  day: "Day",
  nakshatra: "Nakshatra",
  yoga: "Yoga",
  karana: "Karana",
  paksha: "Paksha",
  sunSign: "Sun Sign",
  moonSign: "Moon Sign",
  ascendant: "Ascendant",
  rashiLord: "Rashi Lord",
  nakshatraLord: "Nakshatra Lord",
  planetaryPositions: "Planetary Positions",
  planet: "Planet",
  retrograde: "R",
  sign: "Sign",
  degrees: "Degrees",
  signLord: "Sign Lord",
  house: "House",
  planetGrid: "Planet Overview",
  horoscopeCharts: "Horoscope Charts",
  lagnaChart: "Lagna Chart (D1)",
  moonChart: "Moon Chart",
  navamshaChart: "Navamsha Chart (D9)",
  vimshottariDasha1: "Vimshottari Dasha - I",
  vimshottariDasha2: "Vimshottari Dasha - II",
  mahadasha: "Mahadasha",
  antardasha: "Antardasha",
  startDate: "Start Date",
  endDate: "End Date",
  currentDasha: "Current Undergoing Dasha",
  dashaName: "Dasha Name",
  lord: "Lord",
  symbol: "Symbol",
  element: "Element",
  nature: "Nature",
  direction: "Direction",
  luckyGem: "Lucky Gem",
  dayOfFast: "Day of Fast",
  shloka: "Sanskrit Shloka",
  personality: "Personality",
  ascendantReport: "Ascendant Report",
  ascendantAnalysis: "Ascendant Analysis",
  spiritualLesson: "Spiritual Lesson to Learn",
  positiveTraits: "Positive Traits",
  negativeTraits: "Negative Traits",
  disclaimer: "Disclaimer",
  disclaimerText:
    "This report is generated based on Vedic Astrology principles for informational and educational purposes only. The predictions and analysis are based on planetary positions at the time of birth and should not be considered as definitive life guidance. Astrology is a traditional knowledge system and results may vary. Please consult a qualified astrologer for personalized guidance. The creators of this report are not responsible for any decisions made based on this report.",
  generatedBy: "Generated by Astroweb",
  contactInfo: "For queries, visit: www.astroweb.in",
  langName: "English",

  // New keys for Basic Horoscope
  divisionalCharts: "Divisional Charts",
  houseCusps: "House Cusps and Sandhi",
  ascendantLabel: "Ascendant",
  midheavenLabel: "Midheaven",
  bhavMadhya: "Bhav Madhya",
  bhavSandhi: "Bhav Sandhi",
  chalitChart: "Chalit Chart",
  yoginiDasha1: "Yogini Dasha - I",
  yoginiDasha2: "Yogini Dasha - II",
  yoginiDasha3: "Yogini Dasha - III",
  favourablePoints: "Favourable Points",
  destinyNumber: "Destiny Number",
  radicalNumber: "Radical Number",
  nameNumber: "Name Number",
  numerologyReport: "Numerology Report",
  favTimeForYou: "Favourable Time For You",
  favGayatriMantra: "Favourable Gayatri Mantra For You",
  pratyantarDasha: "Prtyantar Dasha",
  sookshmDasha: "Sookshm Dasha",
};

const HI_BASIC: Labels = {
  title: "Mool Kundali Report",
  coverSubtitle: "Vedic Jyotish Report",
  name: "Naam",
  dob: "Janam Tithi",
  tob: "Janam Samay",
  pob: "Janam Sthan",
  generatedOn: "Nirmit Tithi",
  language: "Bhasha",
  basicDetails: "Mool Vivaran",
  panchangDetails: "Panchang Vivaran",
  astroDetails: "Jyotish Vivaran",
  ghatChakra: "Ghat Chakra",
  latitude: "Akshansh",
  longitude: "Deshantar",
  timezone: "Samay Kshetra",
  ayanamsa: "Ayanamsha",
  tithi: "Tithi",
  day: "Din",
  nakshatra: "Nakshatra",
  yoga: "Yoga",
  karana: "Karan",
  paksha: "Paksha",
  sunSign: "Surya Rashi",
  moonSign: "Chandra Rashi",
  ascendant: "Lagna",
  rashiLord: "Rashi Swami",
  nakshatraLord: "Nakshatra Swami",
  planetaryPositions: "Graha Sthiti",
  planet: "Graha",
  retrograde: "V",
  sign: "Rashi",
  degrees: "Ansh",
  signLord: "Rashi Swami",
  house: "Bhava",
  planetGrid: "Graha Avlokan",
  horoscopeCharts: "Kundali Chakra",
  lagnaChart: "Lagna Kundali (D1)",
  moonChart: "Chandra Kundali",
  navamshaChart: "Navamsha Kundali (D9)",
  vimshottariDasha1: "Vimshottari Dasha - I",
  vimshottariDasha2: "Vimshottari Dasha - II",
  mahadasha: "Mahadasha",
  antardasha: "Antardasha",
  startDate: "Aarambh Tithi",
  endDate: "Samaapti Tithi",
  currentDasha: "Vartamaan Dasha",
  dashaName: "Dasha Naam",
  lord: "Swami",
  symbol: "Chinh",
  element: "Tatva",
  nature: "Svabhav",
  direction: "Disha",
  luckyGem: "Shubh Ratna",
  dayOfFast: "Vrat ka Din",
  shloka: "Sanskrit Shloka",
  personality: "Vyaktitva",
  ascendantReport: "Lagna Vivaran",
  ascendantAnalysis: "Lagna Vishleshan",
  spiritualLesson: "Adhyatmik Siksha",
  positiveTraits: "Sakaratmak Gun",
  negativeTraits: "Nakaratmak Gun",
  disclaimer: "Uchit Soochna",
  disclaimerText:
    "Yah report Vedic Jyotish siddhanton par aadharit hai aur kewal jaankaari ke liye hai. Graha sthiti par aadharit yah vishleshan jeewan ka nishchit maargdarshan nahin hai. Kripya vyaktigat margdarshan ke liye kisi yogya jyotishi se sampark karein. Is report ke aadhar par liye gaye kisee bhi nirnay ke liye nirmata zimmedar nahin hain.",
  generatedBy: "Astroweb dwara nirmit",
  contactInfo: "Sampark: www.astroweb.in",
  langName: "Hindi",

  // New keys
  divisionalCharts: "Vibhajan Kundali",
  houseCusps: "Bhav Sandhi Vivaran",
  ascendantLabel: "Lagna",
  midheavenLabel: "Madhya Aakash",
  bhavMadhya: "Bhav Madhya",
  bhavSandhi: "Bhav Sandhi",
  chalitChart: "Chalit Kundali",
  yoginiDasha1: "Yogini Dasha - I",
  yoginiDasha2: "Yogini Dasha - II",
  yoginiDasha3: "Yogini Dasha - III",
  favourablePoints: "Shubh Bindu",
  destinyNumber: "Bhagya Ank",
  radicalNumber: "Moolank",
  nameNumber: "Naam Ank",
  numerologyReport: "Ank Jyotish Report",
  favTimeForYou: "Shubh Samay",
  favGayatriMantra: "Shubh Gayatri Mantra",
  pratyantarDasha: "Pratyantardasha",
  sookshmDasha: "Sookshm Dasha",
};

export function getBasicLabels(lang: string): Labels {
  return lang === "hi" ? HI_BASIC : EN_BASIC;
}

// House cusps description text
export const HOUSE_CUSPS_DESCRIPTION_EN =
  "House cusps are imaginary boundary lines for the Houses, similar to the way Sign cusps are boundary lines for the Signs. Cusp is the most important and powerful point of house. Planets located at the cusp have the strongest effect and most typical meaning of the house.";

export const HOUSE_CUSPS_DESCRIPTION_HI =
  "Bhav Sandhi Bhavon ki kalpnik seema rekhayen hain, jaise Rashi Sandhi Rashiyon ki seema rekhayen hain. Sandhi bhav ka sabse mahatvapurna aur shaktishali bindu hai. Sandhi par sthit grah bhav ka sabse prabhavshali aur vishisht arth rakhte hain.";

// ============================================
// Kalsarpa Types (Page 14)
// ============================================
export const KALSARPA_TYPES = [
  "Anant",
  "Kulik",
  "Vasuki",
  "Shankhpal",
  "Padma",
  "Mahapadma",
  "Takshak",
  "Karkotak",
  "Shankhchoor",
  "Ghatak",
  "Vishdhar",
  "Sheshnaag",
];

// ============================================
// Extended Labels (Pages 14-24)
// ============================================

// English Extension
Object.assign(EN_BASIC, {
  // Page 14-15: Kalsarpa
  kalsarpaDosha: "Kalsarpa Dosha",
  kalsarpaDescription:
    "Rahu and Ketu are two nodes of Moon and they are regarded as fullfledged planets in Vedic Astrology. They are considered as most dreaded planets due to their heavy karmic effects. If all the 7 planets are situated between Rahu and Ketu then Kaal Sarp Yog is formed. Most of the Kalasarpa dosha effects are negative, while few can be positive too. Rahu or Ketu gives sudden positive changes which are huge and can happen overnight or within a span of few days.",
  kalsarpaPresent: "Kalsarpa is present",
  kalsarpaNotPresent: "Kalsarpa is not present",
  kalsarpaName: "Kalsarpa Name",
  kalsarpaDirection: "Direction",
  kalsarpaReport: "Kaal Sarp Dosh Report",
  remedies: "Remedies",
  remediesOfKalsarpa: "Remedies Of Kaal Sarp Dosh",

  // Page 16-17: Manglik
  manglikAnalysis: "Manglik Analysis",
  whatIsManglik: "What is Manglik Dosha?",
  manglikDescription:
    "Manglik Dosha is formed when Mars is placed in the 1st, 2nd, 4th, 7th, 8th or 12th house of the lunar chart. It is believed to cause delays in marriage and disharmony in marital life.",
  totalManglikPercentage: "TOTAL MANGLIK PERCENTAGE",
  manglikReport: "Manglik Report",
  basedOnHouse: "Based On House",
  basedOnAspects: "Based On Aspects",
  remediesOfManglik: "Remedies Of Manglik Dosha",

  // Page 18: Sadhesati
  sadhesatiAnalysis: "Sadhesati Analysis",
  whatIsSadhesati: "What is Sadhesati Dosha?",
  sadhesatiDescription:
    "Sadhesati is the 7.5 years period of Saturn (Shani). It starts when Saturn enters the sign immediately before the Moon sign, continues while Saturn is in the Moon sign, and ends when Saturn leaves the sign immediately following the Moon sign.",
  sadhesatiStatus: "Sadhesati Status",
  considerationDate: "Consideration Date",
  saturnRetrograde: "Saturn Retrograde",
  isSadhesatiPresent: "Is Sadhesati present?",

  // Page 19-22: Gemstones
  gemstoneSuggestions: "Gemstone Suggestions",
  gemstoneDescription:
    "Each planet has its unique corresponding astrological gemstone which radiates the same cosmic color energies as the planet itself. The gemstones work by reflection of positive rays or absorption of negative rays. Wearing the appropriate gemstone can increase the corresponding planet's positive effect on its wearer.",
  lifeStone: "LIFE STONE",
  beneficStone: "BENEFIC STONE",
  luckyStone: "LUCKY STONE",
  substitutes: "Substitutes",
  finger: "Finger",
  weight: "Weight",
  dayToWear: "Day",
  deity: "Deity",
  metal: "Metal",
  timeToWear: "Time to Wear",
  mantra: "Mantra",
  energizingRituals: "Energizing Rituals",
  caution: "Caution",

  // Page 23-24: Ascendant
  ascendantReportTitle: "Ascendant Report",
  lord: "Lord",
  symbol: "Symbol",
  characteristics: "Characteristics",
  luckyGems: "Lucky gems",
  dayOfFast: "Day of fast",
  spiritualLesson: "Spiritual Lesson to Learn",
  positiveTraits: "Positive Traits",
  negativeTraits: "Negative Traits",
});

// Hindi Extension
Object.assign(HI_BASIC, {
  // Page 14-15: Kalsarpa
  kalsarpaDosha: "Kaalsarp Dosh",
  kalsarpaDescription:
    "Rahu aur Ketu Chandra ke do node hain aur Vedic Jyotish mein inhe purn grah mana jata hai. Inhe inke bhari karmik prabhavon ke karan sabse bhayanak grah mana jata hai. Jab sabhi 7 grah Rahu aur Ketu ke beech sthit hote hain, tab Kaal Sarp Yog banta hai.",
  kalsarpaPresent: "Kaalsarp Upasthit Hai",
  kalsarpaNotPresent: "Kaalsarp Upasthit Nahi Hai",
  kalsarpaName: "Kaalsarp Naam",
  kalsarpaDirection: "Disha",
  kalsarpaReport: "Kaal Sarp Dosh Report",
  remedies: "Upay",
  remediesOfKalsarpa: "Kaal Sarp Dosh Ke Upay",

  // Page 16-17: Manglik
  manglikAnalysis: "Manglik Vishleshan",
  whatIsManglik: "Manglik Dosh Kya Hai?",
  manglikDescription:
    "Manglik Dosh tab banta hai jab Mangal Chandra kundali ke 1, 2, 4, 7, 8 ya 12 bhav mein sthit hota hai. Yah vivah mein deri aur vaivahik jeevan mein ashanti ka karan mana jata hai.",
  totalManglikPercentage: "KUL MANGLIK PRATISHAT",
  manglikReport: "Manglik Report",
  basedOnHouse: "Bhav Aadharit",
  basedOnAspects: "Drishti Aadharit",
  remediesOfManglik: "Manglik Dosh Ke Upay",

  // Page 18: Sadhesati
  sadhesatiAnalysis: "Sadhesati Vishleshan",
  whatIsSadhesati: "Sadhesati Dosh Kya Hai?",
  sadhesatiDescription:
    "Sadhesati Shani ki 7.5 varsh ki avadhi hai. Yah tab shuru hoti hai jab Shani Chandra rashi se theek pehle wali rashi mein pravesh karta hai.",
  sadhesatiStatus: "Sadhesati Sthiti",
  considerationDate: "Vichar Tithi",
  saturnRetrograde: "Shani Vakri",
  isSadhesatiPresent: "Kya Sadhesati Upasthit Hai?",

  // Page 19-22: Gemstones
  gemstoneSuggestions: "Ratna Sujhav",
  gemstoneDescription:
    "Pratyek grah ka apna vishisht ratna hota hai jo grah ki tarah hi same cosmic urja failata hai. Uchit ratna dharan karne se dharak par sambandhit grah ka sakaratmak prabhav badh sakta hai.",
  lifeStone: "JEEVAN RATNA",
  beneficStone: "KABHKARI RATNA",
  luckyStone: "BHAGYA RATNA",
  substitutes: "Vikalp",
  finger: "Ungli",
  weight: "Vajan",
  dayToWear: "Din",
  deity: "Devta",
  metal: "Dhatu",
  timeToWear: "Dharan Karne Ka Samay",
  mantra: "Mantra",
  energizingRituals: "Pran Pratishtha Vidhi",
  caution: "Savdhani",

  // Page 23-24: Ascendant
  ascendantReportTitle: "Lagna Vivaran",
  lord: "Swami",
  symbol: "Chinh",
  characteristics: "Visheshta",
  luckyGems: "Shubh Ratna",
  dayOfFast: "Vrat Ka Din",
  spiritualLesson: "Adhyatmik Siksha",
  positiveTraits: "Sakaratmak Gun",
  negativeTraits: "Nakaratmak Gun",
});

// Helper map for rich, deep base colors (so the 3D gradient looks realistic)
export const GEM_COLORS: Record<string, number[]> = {
  "blue sapphire": [15, 35, 130], // Deep Royal Blue
  emerald: [15, 130, 60], // Deep Green
  diamond: [180, 200, 220], // Silver/Ice Blueish White
  "red coral": [180, 20, 20], // Deep Red
  "yellow sapphire": [230, 160, 0], // Deep Golden Yellow
  pearl: [240, 235, 225], // Warm Off-White
  ruby: [160, 10, 40], // Deep Crimson
  hessonite: [150, 70, 15], // Deep Orange-Brown
  "cat's eye": [120, 130, 100], // Deep Olive/Grey
};
export function getDevanagariImage(text: string, colorHex: string) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const fontSize = 45;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  const width = ctx.measureText(text).width + 40;
  const height = fontSize * 1.5;

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = colorHex;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(text, width / 2, height / 2);

  return { data: canvas.toDataURL("image/jpeg", 1.0), w: width, h: height };
}

// Zodiac data mapping
export const ZODIAC_GLYPHS: Record<string, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};

export const ZODIAC_LORDS: Record<string, string> = {
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
