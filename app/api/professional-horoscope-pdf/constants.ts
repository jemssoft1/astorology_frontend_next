// constants.ts — Constants and i18n labels for Professional Horoscope PDF
// Re-exports shared constants from mini-horoscope-pdf and basic-horoscope-pdf

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

export {
  DIVISIONAL_CHARTS,
  YOGINI_DASHAS,
  NUMEROLOGY_FIELDS_EN,
  NUMEROLOGY_FIELDS_HI,
  HOUSE_CUSPS_DESCRIPTION_EN,
  HOUSE_CUSPS_DESCRIPTION_HI,
  KALSARPA_TYPES,
  DASHA_ORDER_PAGE7,
  DASHA_ORDER_PAGE8,
} from "../basic-horoscope-pdf/constants";
export type { DivisionalChartConfig } from "../basic-horoscope-pdf/constants";

import { COLORS } from "../mini-horoscope-pdf/constants";
import type { Labels } from "../mini-horoscope-pdf/constants";

// ============================================
// Extended Divisional Charts (Page 7 — D16–D60)
// ============================================
export interface ExtDivisionalChartConfig {
  id: string;
  apiChart: string;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
}

export const EXTENDED_DIVISIONAL_CHARTS: ExtDivisionalChartConfig[] = [
  {
    id: "D16",
    apiChart: "D16",
    title: "Shodashamsha (D16)",
    titleHi: "Shodashamsha Kundali (D16)",
    subtitle: "Vehicles, Comforts, Happiness",
    subtitleHi: "Vahan, Sukh, Aanand",
  },
  {
    id: "D20",
    apiChart: "D20",
    title: "Vishamansha (D20)",
    titleHi: "Vishamansha Kundali (D20)",
    subtitle: "Spiritual Progress, Worship",
    subtitleHi: "Adhyatmik Unnati, Upasana",
  },
  {
    id: "D24",
    apiChart: "D24",
    title: "Chaturvimshamsha (D24)",
    titleHi: "Chaturvimshamsha Kundali (D24)",
    subtitle: "Education, Learning, Knowledge",
    subtitleHi: "Shiksha, Vidya, Gyan",
  },
  {
    id: "D27",
    apiChart: "D27",
    title: "Bhamsha (D27)",
    titleHi: "Bhamsha Kundali (D27)",
    subtitle: "Strength, Stamina, Courage",
    subtitleHi: "Shakti, Sahansheelta, Sahas",
  },
  {
    id: "D30",
    apiChart: "D30",
    title: "Trishamansha (D30)",
    titleHi: "Trishamansha Kundali (D30)",
    subtitle: "Evils, Misfortunes, Arista",
    subtitleHi: "Dosh, Durbhagya, Arista",
  },
  {
    id: "D40",
    apiChart: "D40",
    title: "Khavedamsha (D40)",
    titleHi: "Khavedamsha Kundali (D40)",
    subtitle: "Auspicious/Inauspicious Effects",
    subtitleHi: "Shubh/Ashubh Prabhav",
  },
  {
    id: "D45",
    apiChart: "D45",
    title: "Akshvedansha (D45)",
    titleHi: "Akshvedansha Kundali (D45)",
    subtitle: "General Well-being, Character",
    subtitleHi: "Samanya Kalyan, Charitra",
  },
  {
    id: "D60",
    apiChart: "D60",
    title: "Shashtyamsha (D60)",
    titleHi: "Shashtyamsha Kundali (D60)",
    subtitle: "Past Life, Karma",
    subtitleHi: "Poorv Janm, Karma",
  },
];

// ============================================
// Friendship Planets
// ============================================
export const FRIENDSHIP_PLANETS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

// ============================================
// Ashtakvarga Planets
// ============================================
export const ASHTAKVARGA_PLANETS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Ascendant",
];

export const ASHTAKVARGA_API_PLANETS = [
  "sun",
  "moon",
  "mars",
  "mercury",
  "jupiter",
  "venus",
  "saturn",
];

// ============================================
// Ashtakvarga Significance Text
// ============================================
export const ASHTAKVARGA_SIGNIFICANCE: Record<
  string,
  { en: string; hi: string }
> = {
  Sun: {
    en: "The Sun's Bhinnashtak Varga reflects soul power, authority, government favors, and vitality. Higher bindus in a house indicate strong Sun influence and positive outcomes related to that house.",
    hi: "Surya ka Bhinnashtak Varga atma shakti, adhikar, sarkari anugrah aur jeevani shakti ko darshata hai. Kisi bhav mein adhik bindu us bhav se sambandhit sakaratmak parinam darshate hain.",
  },
  Moon: {
    en: "The Moon's Bhinnashtak Varga indicates emotional well-being, mental peace, mother's health, and public relations. High scores bring comfort and happiness.",
    hi: "Chandra ka Bhinnashtak Varga bhavnatmak kalyan, mansik shanti, mata ka swasthya aur jan sampark darshata hai. Adhik ank sukh aur aanand laate hain.",
  },
  Mars: {
    en: "Mars' Bhinnashtak Varga shows courage, property, siblings, and physical strength. High bindus enhance Mars-related matters positively.",
    hi: "Mangal ka Bhinnashtak Varga sahas, sampatti, bhai-behen aur sharirik shakti darshata hai. Adhik bindu Mangal se sambandhit vishayon ko sakaratmak roop se badhate hain.",
  },
  Mercury: {
    en: "Mercury's Bhinnashtak Varga reflects intelligence, communication, business acumen, and education. Higher scores indicate better intellectual pursuits.",
    hi: "Budh ka Bhinnashtak Varga buddhi, samvad, vyapar kushalta aur shiksha darshata hai. Adhik ank behtar baudhik pravrittiyon ko darshate hain.",
  },
  Jupiter: {
    en: "Jupiter's Bhinnashtak Varga indicates wisdom, wealth, children, and spiritual growth. High bindus bring fortune and divine blessings.",
    hi: "Guru ka Bhinnashtak Varga gyan, dhan, santan aur adhyatmik vikas darshata hai. Adhik bindu bhagya aur divya ashirvaad laate hain.",
  },
  Venus: {
    en: "Venus' Bhinnashtak Varga shows luxury, marriage, arts, and comforts. Higher scores indicate a life filled with material pleasures and harmony.",
    hi: "Shukra ka Bhinnashtak Varga vaibhav, vivah, kala aur sukh darshata hai. Adhik ank bhautik sukh aur saamanjasya se bhari zindagi darshate hain.",
  },
  Saturn: {
    en: "Saturn's Bhinnashtak Varga reflects longevity, career stability, discipline, and karmic lessons. High scores mitigate Saturn's harsh effects.",
    hi: "Shani ka Bhinnashtak Varga dirghayu, career sthirata, anushasan aur karmik seekh darshata hai. Adhik ank Shani ke kathor prabhavon ko kam karte hain.",
  },
  Ascendant: {
    en: "The Ascendant's Bhinnashtak Varga reflects overall personality strength and life direction. Higher scores in houses indicate areas of natural strength.",
    hi: "Lagna ka Bhinnashtak Varga sampoorna vyaktitva shakti aur jeevan disha darshata hai. Bhavon mein adhik ank prakritik shakti ke kshetron ko darshate hain.",
  },
};

// ============================================
// Char Dasha Sign Map
// ============================================
export const CHAR_DASHA_SIGNS = [
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

// ============================================
// Planet Profile Data (Pages 49–66)
// ============================================
export interface PlanetProfileMeta {
  name: string;
  nameHi: string;
  intro: string;
  introHi: string;
  mantra: string;
  mantraHi: string;
  apiKey: string;
}

export const PLANET_PROFILES: PlanetProfileMeta[] = [
  {
    name: "Sun",
    nameHi: "Surya",
    intro:
      "The Sun is the king of all planets and represents the soul, authority, government, father, and vitality. Its position in your horoscope determines your core identity, self-expression, and life purpose. A well-placed Sun gives leadership abilities, confidence, and recognition in society.",
    introHi:
      "Surya sabhi grahon ka raja hai aur atma, adhikar, sarkar, pita aur jeevani shakti ka pratinidhi hai. Aapki kundali mein iska sthan aapki mool pahchaan, aatma-abhivyakti aur jeevan uddeshya nirdhaarit karta hai. Achchi sthiti mein Surya netritva kshamta, vishwas aur samaj mein manyata deta hai.",
    mantra: "|| Om Hring Hraung Suryay Namah ||",
    mantraHi: "|| Om Hring Hraung Suryay Namah ||",
    apiKey: "sun",
  },
  {
    name: "Moon",
    nameHi: "Chandra",
    intro:
      "The Moon governs the mind, emotions, mother, and overall mental well-being. It represents imagination, intuition, and the subconscious mind. The Moon's position in your chart reveals your emotional nature, habitual patterns, and how you nurture and seek comfort.",
    introHi:
      "Chandra mann, bhavnaon, mata aur sampoorna mansik kalyan ko niyantrit karta hai. Yah kalpana, antar-gyan aur avchetan mann ka pratinidhi hai. Aapki kundali mein Chandra ki sthiti aapki bhavnatmak pravritti, aadat ke patron aur aap kaise poshan karte hain, yah darshati hai.",
    mantra: "|| Om Shring Shraung Chandraya Namah ||",
    mantraHi: "|| Om Shring Shraung Chandraya Namah ||",
    apiKey: "moon",
  },
  {
    name: "Mars",
    nameHi: "Mangal",
    intro:
      "Mars is the commander-in-chief of the planetary army, representing courage, energy, physical strength, and determination. It governs property, siblings, and military affairs. Mars' placement shows your drive, ambition, and how you handle conflicts and challenges.",
    introHi:
      "Mangal grah sena ka senapati hai, jo sahas, urja, sharirik shakti aur dridh sankalp ka pratinidhi hai. Yah sampatti, bhai-behen aur sainya mamlon ko niyantrit karta hai. Mangal ki sthiti aapki prerna, mahatvaakanksha aur aap sangharsh kaise sambhalte hain, yah darshati hai.",
    mantra: "|| Om Kring Kraung Bhaumaya Namah ||",
    mantraHi: "|| Om Kring Kraung Bhaumaya Namah ||",
    apiKey: "mars",
  },
  {
    name: "Mercury",
    nameHi: "Budh",
    intro:
      "Mercury is the prince among planets, governing intellect, communication, commerce, and analytical abilities. It represents speech, education, and mathematical skills. Mercury's position reveals your thinking patterns, learning style, and commercial acumen.",
    introHi:
      "Budh grahon mein rajkumar hai, jo buddhi, samvad, vanijya aur vishleshan kshamta ko niyantrit karta hai. Yah vaani, shiksha aur ganit kaushal ka pratinidhi hai. Budh ki sthiti aapke vichaar pattern, seekhne ki shaili aur vyaparik kushalta darshati hai.",
    mantra: "|| Om Bring Braung Budhaya Namah ||",
    mantraHi: "|| Om Bring Braung Budhaya Namah ||",
    apiKey: "mercury",
  },
  {
    name: "Jupiter",
    nameHi: "Guru",
    intro:
      "Jupiter is the guru (teacher) of the gods, representing wisdom, knowledge, spirituality, and expansion. It governs fortune, children, higher education, and dharma. Jupiter's position shows your philosophical outlook, moral compass, and areas of growth and abundance.",
    introHi:
      "Guru devtaon ke guru hain, jo gyan, vidya, adhyatmikta aur vistar ka pratinidhi hai. Yah bhagya, santan, uchch shiksha aur dharma ko niyantrit karta hai. Guru ki sthiti aapka darshnik drishtikon, naitik disha aur vikas ke kshetron ko darshati hai.",
    mantra: "|| Om Gring Graung Gurave Namah ||",
    mantraHi: "|| Om Gring Graung Gurave Namah ||",
    apiKey: "jupiter",
  },
  {
    name: "Venus",
    nameHi: "Shukra",
    intro:
      "Venus is the preceptor of the demons, governing love, beauty, luxury, marriage, and artistic abilities. It represents material comforts, vehicles, and sensual pleasures. Venus' position reveals your approach to relationships, aesthetics, and material prosperity.",
    introHi:
      "Shukra daityon ke guru hain, jo prem, saundarya, vaibhav, vivah aur kala kshamta ko niyantrit karta hai. Yah bhautik sukh, vahan aur indriya sukh ka pratinidhi hai. Shukra ki sthiti sambandh, saundarya bodh aur bhautik samridhi ke prati aapka drishtikon darshati hai.",
    mantra: "|| Om Dring Draung Shukraya Namah ||",
    mantraHi: "|| Om Dring Draung Shukraya Namah ||",
    apiKey: "venus",
  },
  {
    name: "Saturn",
    nameHi: "Shani",
    intro:
      "Saturn is the servant among planets, representing discipline, hard work, longevity, and karmic lessons. It governs career, service, delays, and obstacles that ultimately lead to spiritual growth. Saturn's placement shows where you face challenges and develop resilience.",
    introHi:
      "Shani grahon mein sevak hai, jo anushasan, kathin parishram, dirghayu aur karmik seekh ka pratinidhi hai. Yah career, seva, deri aur baadhaon ko niyantrit karta hai jo antim mein adhyatmik vikas ki aur le jaati hain. Shani ki sthiti darshati hai ki aap kahan chunautiyon ka saamna karte hain.",
    mantra: "|| Om Pring Praung Shanaye Namah ||",
    mantraHi: "|| Om Pring Praung Shanaye Namah ||",
    apiKey: "saturn",
  },
  {
    name: "Rahu",
    nameHi: "Rahu",
    intro:
      "Rahu is the north node of the Moon, representing worldly desires, obsessions, sudden changes, and unconventional thinking. It amplifies the effects of the house it occupies and can bring both great success and confusion. Rahu's position shows your karmic desires and areas of intense focus.",
    introHi:
      "Rahu Chandra ka uttar node hai, jo sansaarik ichchhaon, junoon, achanak parivartan aur aparamparik soch ka pratinidhi hai. Yah jis bhav mein baithta hai uske prabhavon ko badhata hai. Rahu ki sthiti aapki karmik ichchhaon aur tivra dhyan ke kshetron ko darshati hai.",
    mantra: "|| Om Bhring Bhraung Rahave Namah ||",
    mantraHi: "|| Om Bhring Bhraung Rahave Namah ||",
    apiKey: "rahu",
  },
  {
    name: "Ketu",
    nameHi: "Ketu",
    intro:
      "Ketu is the south node of the Moon, representing spirituality, detachment, past-life karma, and liberation. It brings psychic abilities, mystical experiences, and a desire to transcend material existence. Ketu's position shows areas of past mastery and present detachment.",
    introHi:
      "Ketu Chandra ka dakshin node hai, jo adhyatmikta, vairagya, poorv janm karma aur moksha ka pratinidhi hai. Yah mansik shaktiyan, rahasyamay anubhav aur bhautik astitva se upar uthne ki ichchha laata hai. Ketu ki sthiti poorv janam ke nipun kshetron aur vartamaan vairagya ko darshati hai.",
    mantra: "|| Om Sring Sraung Ketave Namah ||",
    mantraHi: "|| Om Sring Sraung Ketave Namah ||",
    apiKey: "ketu",
  },
];

// ============================================
// Rudraksha Data
// ============================================
export const RUDRAKSHA_DATA = {
  name: "Gauri Shankar Rudraksha",
  nameHi: "Gauri Shankar Rudraksha",
  description:
    "Gauri Shankar Rudraksha consists of two naturally joined Rudraksha beads representing Shiva and Shakti (Parvati). It is considered highly auspicious for marital harmony, family peace, and spiritual advancement. This sacred bead removes obstacles in relationships and blesses the wearer with love, understanding, and divine grace.",
  descriptionHi:
    "Gauri Shankar Rudraksha do prakritik roop se jude hue Rudraksha ke daane hain jo Shiv aur Shakti (Parvati) ka pratinidhi karte hain. Yah vaivahik saamanjasya, parivarik shanti aur adhyatmik unnati ke liye ati shubh mana jata hai. Yah pavitra daana sambandh mein baadhaon ko door karta hai aur dharak ko prem, samajh aur divya kripa se ashirvaad deta hai.",
  mantra: "|| Om Namah Shivaya ||",
  mantraHi: "|| Om Namah Shivaya ||",
  benefits: [
    "Harmonizes marital relationships",
    "Removes obstacles in love and family life",
    "Calms the mind and reduces stress",
    "Enhances spiritual awareness",
    "Balances the energies of Lord Shiva and Goddess Parvati",
    "Promotes unity and understanding between couples",
  ],
  benefitsHi: [
    "Vaivahik sambandh mein saamanjasya lata hai",
    "Prem aur parivarik jeevan mein baadhaon ko door karta hai",
    "Mann ko shaant karta hai aur tanaav kam karta hai",
    "Adhyatmik jagrukta ko badhata hai",
    "Bhagwan Shiv aur Devi Parvati ki urjaon ko santulit karta hai",
    "Dampattiyon ke beech ekta aur samajh ko badhava deta hai",
  ],
};

// ============================================
// Sadhesati Remedies
// ============================================
export const SADHESATI_REMEDIES_EN = [
  "Chant 'Om Sham Shanaischaraya Namah' 108 times daily.",
  "Keep a fast on Saturdays and consume only vegetarian food.",
  "Donate black sesame seeds, mustard oil, or iron items on Saturdays.",
  "Worship Lord Hanuman on Tuesdays and Saturdays.",
  "Light a mustard oil lamp under a Peepal tree on Saturday evenings.",
  "Wear a Blue Sapphire (Neelam) gemstone after consulting an astrologer.",
  "Feed crows with cooked rice on Saturdays.",
  "Recite Hanuman Chalisa daily for protection from Saturn's effects.",
  "Visit Shani temples on Saturdays and offer til (sesame) oil.",
  "Practice charity and help the underprivileged regularly.",
];

export const SADHESATI_REMEDIES_HI = [
  "'Om Sham Shanaischaraya Namah' mantra ka jaap pratidin 108 baar karein.",
  "Shanivar ko vrat rakhein aur kewal shakahari bhojan karein.",
  "Shanivar ko kala til, sarson ka tel ya lohe ki vastu daan karein.",
  "Mangalvar aur Shanivar ko Bhagwan Hanuman ki pooja karein.",
  "Shanivar ki sham ko Peepal ke pedh ke neeche sarson ke tel ka diya jalayein.",
  "Jyotishi se paramarsh ke baad Neelam ratna dharain karein.",
  "Shanivar ko kawon ko pakaye hue chawal khilayein.",
  "Shani ke prabhavon se suraksha ke liye pratidin Hanuman Chalisa ka paath karein.",
  "Shanivar ko Shani mandir jayein aur til ka tel chadhayein.",
  "Niyamit roop se daan karein aur vanchiton ki madad karein.",
];

// ============================================
// Professional Labels — EN
// ============================================
const EN_PROF: Labels = {
  // Cover & basics
  title: "Professional Horoscope Report",
  coverSubtitle: "Comprehensive Vedic Astrology Analysis",
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
  lagnaDescription:
    "The Lagna (Ascendant) chart is the most important chart in Vedic astrology. It represents your physical body, personality, temperament, and overall approach to life. The position of planets in this chart determines the major life events and personality traits.",
  lagnaDescriptionHi:
    "Lagna (Uday) Kundali Vedic Jyotish mein sabse mahatvapurna kundali hai. Yah aapke bhautik shareer, vyaktitva, swabhav aur jeevan ke sampoorna drishtikon ko darshati hai.",

  // Page 4 charts
  divisionalCharts: "Divisional Charts",
  extDivisionalCharts: "Divisional Charts - II",

  // Page 5
  houseCusps: "House Cusps and Sandhi",
  ascendantLabel: "Ascendant",
  midheavenLabel: "Midheaven",
  bhavMadhya: "Bhav Madhya",
  bhavSandhi: "Bhav Sandhi",
  chalitChart: "Chalit Chart",

  // Friendship
  compositeFriendship: "Composite Friendship Table",
  permanentFriendship: "Permanent Friendship",
  temporalFriendship: "Temporal Friendship",
  fiveFoldFriendship: "Five-fold Friendship",

  // KP System
  kpPlanetaryDetails: "KP Planetary Details",
  kpHouseCusps: "KP House Cusps and Chart",
  charan: "Charan",
  subLord: "Sub Lord",
  subSubLord: "S-S Lord",

  // Ashtakvarga
  bhinnashtakVarga: "Bhinnashtak Varga",
  sarvashtakVarga: "Sarvashtak Varga",
  total: "Total",
  significance: "Significance",
  legends: "Legends",
  good: "Good (28+)",
  bad: "Bad (below 25)",
  mixed: "Mixed (25-27)",

  // Dasha
  vimshottariDasha1: "Vimshottari Dasha - I",
  vimshottariDasha2: "Vimshottari Dasha - II",
  mahadasha: "Mahadasha",
  antardasha: "Antardasha",
  startDate: "Start Date",
  endDate: "End Date",
  currentDasha: "Current Undergoing Dasha",
  dashaName: "Dasha Name",
  pratyantarDasha: "Prtyantar Dasha",
  sookshmDasha: "Sookshm Dasha",
  yoginiDasha1: "Yogini Dasha - I",
  yoginiDasha2: "Yogini Dasha - II",
  yoginiDasha3: "Yogini Dasha - III",
  charDasha: "Char Dasha",
  charDasha2: "Char Dasha - II",
  years: "Year",

  // Dosha
  kalsarpaDosha: "Kalsarpa Dosha",
  kalsarpaDescription:
    "Rahu and Ketu are two nodes of Moon and they are regarded as fullfledged planets in Vedic Astrology. They are considered as most dreaded planets due to their heavy karmic effects. If all the 7 planets are situated between Rahu and Ketu then Kaal Sarp Yog is formed.",
  kalsarpaPresent: "Kalsarpa is present",
  kalsarpaNotPresent: "Kalsarpa is not present",
  kalsarpaName: "Kalsarpa Name",
  kalsarpaDirection: "Direction",
  kalsarpaReport: "Kaal Sarp Dosh Report",
  remedies: "Remedies",
  remediesOfKalsarpa: "Remedies Of Kaal Sarp Dosh",
  manglikAnalysis: "Manglik Analysis",
  whatIsManglik: "What is Manglik Dosha?",
  manglikDescription:
    "Manglik Dosha is formed when Mars is placed in the 1st, 2nd, 4th, 7th, 8th or 12th house of the lunar chart. It is believed to cause delays in marriage and disharmony in marital life.",
  totalManglikPercentage: "TOTAL MANGLIK PERCENTAGE",
  manglikReport: "Manglik Report",
  basedOnHouse: "Based On House",
  basedOnAspects: "Based On Aspects",
  remediesOfManglik: "Remedies Of Manglik Dosha",
  sadhesatiAnalysis: "Sadhesati Analysis",
  whatIsSadhesati: "What is Sadhesati Dosha?",
  sadhesatiDescription:
    "Sadhesati is the 7.5 years period of Saturn (Shani). It starts when Saturn enters the sign immediately before the Moon sign, continues while Saturn is in the Moon sign, and ends when Saturn leaves the sign immediately following the Moon sign.",
  sadhesatiStatus: "Sadhesati Status",
  considerationDate: "Consideration Date",
  saturnRetrograde: "Saturn Retrograde",
  isSadhesatiPresent: "Is Sadhesati present?",
  sadhesatiLifeAnalysis: "Sadhesati Life Analysis",
  sadhesatiRemedies: "Sadhe-Sati Remedies",
  sadhesatiRemediesDescription:
    "Sadhe-Sati is a challenging period in one's life that requires patience, discipline, and spiritual practice. The following remedies can help mitigate the adverse effects of Saturn during this period.",
  moon: "Moon",
  saturn: "Saturn",
  isRetro: "Is Retro?",
  phase: "Phase",
  date: "Date",
  summary: "Summary",

  // Gemstones
  gemstoneSuggestions: "Gemstone Suggestions",
  gemstoneDescription:
    "Each planet has its unique corresponding astrological gemstone which radiates the same cosmic color energies as the planet itself. Wearing the appropriate gemstone can increase the corresponding planet's positive effect on its wearer.",
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

  // Rudraksha
  rudrakshaReport: "Rudraksha Report",

  // Favourables
  favourablePoints: "Favourable Points",
  destinyNumber: "Destiny Number",
  radicalNumber: "Radical Number",
  nameNumber: "Name Number",

  // Numerology
  numerologyReport: "Numerology Report",
  numerologyReport2: "Numerology Report - II",
  numerologyReport3: "Numerology Report - III",
  numerologyReport4: "Numerology Report - IV",
  aboutYou: "About You",
  favourableFast: "Favourable Fast",
  favourableLord: "Favourable Lord",
  gayatriMantra: "Gayatri Mantra",
  dhyanTimings: "Dhyan Timings",
  mantraJap: "Mantra Jap",
  favourableTimings: "Favourable Timings",
  aboutQuality: "About Quality",
  favourableVastu: "Favourable Vastu",
  favTimeForYou: "Favourable Time For You",
  favGayatriMantra: "Favourable Gayatri Mantra For You",

  // Ascendant
  ascendantReportTitle: "Ascendant Report",
  ascendantReport: "Ascendant Report",
  ascendantAnalysis: "Ascendant Analysis",
  lord: "Lord",
  symbol: "Symbol",
  element: "Element",
  nature: "Nature",
  direction: "Direction",
  luckyGem: "Lucky Gem",
  dayOfFast: "Day of Fast",
  shloka: "Sanskrit Shloka",
  personality: "Personality",
  characteristics: "Characteristics",
  luckyGems: "Lucky gems",
  spiritualLesson: "Spiritual Lesson to Learn",
  positiveTraits: "Positive Traits",
  negativeTraits: "Negative Traits",

  // Planet Profiles
  yourPlanetProfiles: "Your Personalized Planet Profiles",
  planetProfileCoverSubtitle:
    "Detailed analysis of each planet's influence in your horoscope",
  inYourHoroscope: "in your horoscope",
  zodiacSign: "Zodiac Sign",
  degree: "Degree",
  houseLord: "House Lord",
  currentHouse: "Current House",
  combustAwastha: "Combust/Awastha",
  neutral: "Neutral",
  friendly: "Friendly",
  unfavorable: "Unfavorable",
  isInHouse: "is in House",

  // Footer & meta
  disclaimer: "Disclaimer",
  disclaimerText:
    "This report is generated based on Vedic Astrology principles for informational and educational purposes only.",
  generatedBy: "Generated by Western Astro",
  contactInfo: "For queries, visit: www.westernastro.com",
  langName: "English",
};

// ============================================
// Professional Labels — HI
// ============================================
const HI_PROF: Labels = {
  title: "Vyavsayik Kundali Report",
  coverSubtitle: "Vyapak Vedic Jyotish Vishleshan",
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
  lagnaDescription:
    "Lagna Kundali Vedic Jyotish mein sabse mahatvapurna kundali hai. Yah aapke bhautik shareer, vyaktitva, swabhav aur jeevan ke sampoorna drishtikon ko darshati hai.",
  lagnaDescriptionHi:
    "Lagna Kundali Vedic Jyotish mein sabse mahatvapurna kundali hai.",
  divisionalCharts: "Vibhajan Kundali",
  extDivisionalCharts: "Vibhajan Kundali - II",
  houseCusps: "Bhav Sandhi Vivaran",
  ascendantLabel: "Lagna",
  midheavenLabel: "Madhya Aakash",
  bhavMadhya: "Bhav Madhya",
  bhavSandhi: "Bhav Sandhi",
  chalitChart: "Chalit Kundali",
  compositeFriendship: "Sanyukt Maitri Taalika",
  permanentFriendship: "Sthayi Maitri",
  temporalFriendship: "Tatkalik Maitri",
  fiveFoldFriendship: "Panch-vidh Maitri",
  kpPlanetaryDetails: "KP Graha Vivaran",
  kpHouseCusps: "KP Bhav Sandhi aur Kundali",
  charan: "Charan",
  subLord: "Upa Swami",
  subSubLord: "Upa-Upa Swami",
  bhinnashtakVarga: "Bhinnashtak Varga",
  sarvashtakVarga: "Sarvashtak Varga",
  total: "Yog",
  significance: "Mahatva",
  legends: "Sanket",
  good: "Achcha (28+)",
  bad: "Bura (25 se kam)",
  mixed: "Mishrit (25-27)",
  vimshottariDasha1: "Vimshottari Dasha - I",
  vimshottariDasha2: "Vimshottari Dasha - II",
  mahadasha: "Mahadasha",
  antardasha: "Antardasha",
  startDate: "Aarambh Tithi",
  endDate: "Samaapti Tithi",
  currentDasha: "Vartamaan Dasha",
  dashaName: "Dasha Naam",
  pratyantarDasha: "Pratyantardasha",
  sookshmDasha: "Sookshm Dasha",
  yoginiDasha1: "Yogini Dasha - I",
  yoginiDasha2: "Yogini Dasha - II",
  yoginiDasha3: "Yogini Dasha - III",
  charDasha: "Char Dasha",
  charDasha2: "Char Dasha - II",
  years: "Varsh",
  kalsarpaDosha: "Kaalsarp Dosh",
  kalsarpaDescription:
    "Rahu aur Ketu Chandra ke do node hain aur Vedic Jyotish mein inhe purn grah mana jata hai. Jab sabhi 7 grah Rahu aur Ketu ke beech sthit hote hain, tab Kaal Sarp Yog banta hai.",
  kalsarpaPresent: "Kaalsarp Upasthit Hai",
  kalsarpaNotPresent: "Kaalsarp Upasthit Nahi Hai",
  kalsarpaName: "Kaalsarp Naam",
  kalsarpaDirection: "Disha",
  kalsarpaReport: "Kaal Sarp Dosh Report",
  remedies: "Upay",
  remediesOfKalsarpa: "Kaal Sarp Dosh Ke Upay",
  manglikAnalysis: "Manglik Vishleshan",
  whatIsManglik: "Manglik Dosh Kya Hai?",
  manglikDescription:
    "Manglik Dosh tab banta hai jab Mangal Chandra kundali ke 1, 2, 4, 7, 8 ya 12 bhav mein sthit hota hai.",
  totalManglikPercentage: "KUL MANGLIK PRATISHAT",
  manglikReport: "Manglik Report",
  basedOnHouse: "Bhav Aadharit",
  basedOnAspects: "Drishti Aadharit",
  remediesOfManglik: "Manglik Dosh Ke Upay",
  sadhesatiAnalysis: "Sadhesati Vishleshan",
  whatIsSadhesati: "Sadhesati Dosh Kya Hai?",
  sadhesatiDescription:
    "Sadhesati Shani ki 7.5 varsh ki avadhi hai. Yah tab shuru hoti hai jab Shani Chandra rashi se pehle wali rashi mein pravesh karta hai.",
  sadhesatiStatus: "Sadhesati Sthiti",
  considerationDate: "Vichar Tithi",
  saturnRetrograde: "Shani Vakri",
  isSadhesatiPresent: "Kya Sadhesati Upasthit Hai?",
  sadhesatiLifeAnalysis: "Sadhesati Jeevan Vishleshan",
  sadhesatiRemedies: "Sadhe-Sati Ke Upay",
  sadhesatiRemediesDescription:
    "Sadhe-Sati jeevan ka ek chunautipurna samay hai jismein dhairya, anushasan aur adhyatmik sadhna ki aavashyakta hai. Niche diye gaye upay is avadhi mein Shani ke pratikool prabhavon ko kam karne mein sahayak ho sakte hain.",
  moon: "Chandra",
  saturn: "Shani",
  isRetro: "Kya Vakri?",
  phase: "Charan",
  date: "Tithi",
  summary: "Saransh",
  gemstoneSuggestions: "Ratna Sujhav",
  gemstoneDescription:
    "Pratyek grah ka apna vishisht ratna hota hai jo grah ki tarah hi cosmic urja failata hai. Uchit ratna dharan karne se dharak par grah ka sakaratmak prabhav badh sakta hai.",
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
  rudrakshaReport: "Rudraksha Report",
  favourablePoints: "Shubh Bindu",
  destinyNumber: "Bhagya Ank",
  radicalNumber: "Moolank",
  nameNumber: "Naam Ank",
  numerologyReport: "Ank Jyotish Report",
  numerologyReport2: "Ank Jyotish Report - II",
  numerologyReport3: "Ank Jyotish Report - III",
  numerologyReport4: "Ank Jyotish Report - IV",
  aboutYou: "Aapke Baare Mein",
  favourableFast: "Shubh Vrat",
  favourableLord: "Shubh Devta",
  gayatriMantra: "Gayatri Mantra",
  dhyanTimings: "Dhyan Samay",
  mantraJap: "Mantra Jaap",
  favourableTimings: "Shubh Samay",
  aboutQuality: "Guno Ke Baare Mein",
  favourableVastu: "Shubh Vastu",
  favTimeForYou: "Shubh Samay",
  favGayatriMantra: "Shubh Gayatri Mantra",
  ascendantReportTitle: "Lagna Vivaran",
  ascendantReport: "Lagna Vivaran",
  ascendantAnalysis: "Lagna Vishleshan",
  lord: "Swami",
  symbol: "Chinh",
  element: "Tatva",
  nature: "Svabhav",
  direction: "Disha",
  luckyGem: "Shubh Ratna",
  dayOfFast: "Vrat ka Din",
  shloka: "Sanskrit Shloka",
  personality: "Vyaktitva",
  characteristics: "Visheshta",
  luckyGems: "Shubh Ratna",
  spiritualLesson: "Adhyatmik Siksha",
  positiveTraits: "Sakaratmak Gun",
  negativeTraits: "Nakaratmak Gun",
  yourPlanetProfiles: "Aapke Vyaktigat Graha Vivaran",
  planetProfileCoverSubtitle:
    "Aapki kundali mein pratyek grah ke prabhav ka vistrit vishleshan",
  inYourHoroscope: "aapki kundali mein",
  zodiacSign: "Rashi",
  degree: "Ansh",
  houseLord: "Bhav Swami",
  currentHouse: "Vartamaan Bhav",
  combustAwastha: "Ast/Awastha",
  neutral: "Saamanya",
  friendly: "Mitr",
  unfavorable: "Pratikool",
  isInHouse: "Bhav mein hai",
  disclaimer: "Uchit Soochna",
  disclaimerText:
    "Yah report Vedic Jyotish siddhanton par aadharit hai aur kewal jaankaari ke liye hai.",
  generatedBy: "Western Astro dwara nirmit",
  contactInfo: "Sampark: www.westernastro.com",
  langName: "Hindi",
};

export function getProfessionalLabels(lang: string): Labels {
  return lang === "hi" ? HI_PROF : EN_PROF;
}
