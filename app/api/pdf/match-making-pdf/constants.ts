// constants.ts — Labels, descriptions, and configs for Match Making PDF

// Re-export shared constants
export {
  ZODIAC_SIGNS,
  PLANET_SYMBOLS,
  COLORS,
} from "../mini-horoscope-pdf/constants";

import { COLORS as C } from "../mini-horoscope-pdf/constants";

// ═══════════════════════════════════════════════
//  DASHAKOOT ATTRIBUTES
// ═══════════════════════════════════════════════
export const DASHAKOOT_ATTRIBUTES = [
  { key: "dina", en: "Dina (Nakshatra)", hi: "दिन (नक्षत्र)" },
  { key: "gan", en: "Gan", hi: "गण" },
  { key: "yoni", en: "Yoni", hi: "योनि" },
  { key: "rashi", en: "Rashi (Bhakoot)", hi: "राशि (भकूट)" },
  { key: "raspiyadhipati", en: "Rasyadhipati", hi: "रश्याधिपति" },
  { key: "rajju", en: "Rajju", hi: "रज्जु" },
  { key: "vedha", en: "Vedha", hi: "वेध" },
  { key: "vashya", en: "Vashya", hi: "वश्य" },
  { key: "mahendra", en: "Mahendra", hi: "महेंद्र" },
  { key: "stree", en: "Stree Deergha", hi: "स्त्री दीर्घ" },
  { key: "deergha", en: "Deergha", hi: "दीर्घ" },
];

export const DASHAKOOT_COLORS: Record<string, [number, number, number]> = {
  dina: [70, 130, 180],
  gan: [205, 92, 92],
  yoni: [60, 179, 113],
  rashi: [255, 165, 0],
  raspiyadhipati: [147, 112, 219],
  rajju: [220, 20, 60],
  vedha: [0, 128, 128],
  vashya: [255, 140, 0],
  mahendra: [100, 149, 237],
  stree: [199, 21, 133],
  deergha: [85, 107, 47],
};

// ═══════════════════════════════════════════════
//  MANGLIK HOUSE EFFECTS
// ═══════════════════════════════════════════════
export const MANGLIK_HOUSE_EFFECTS_EN: Record<string, string> = {
  "1st House":
    "Mars in the 1st house can make a person aggressive and dominant. This placement indicates possible conflicts in marriage due to temperament issues.",
  "2nd House":
    "Mars in the 2nd house affects family life and finances. The native may face obstacles in accumulating wealth or family harmony.",
  "4th House":
    "Mars in the 4th house affects domestic peace. The native may frequently change residences and may face disturbances in home environment.",
  "7th House":
    "Mars in the 7th house directly affects the spouse. This is considered the most significant placement for Manglik dosha, causing disputes with partner.",
  "8th House":
    "Mars in the 8th house affects longevity and inheritance. The native may face sudden changes and transformative events in married life.",
  "12th House":
    "Mars in the 12th house indicates expenditure and losses. It can lead to financial drain and possible separation if not remedied properly.",
};

export const MANGLIK_HOUSE_EFFECTS_HI: Record<string, string> = {
  "1st House":
    "प्रथम भाव में मंगल व्यक्ति को आक्रामक और प्रभावशाली बना सकता है। यह स्थिति स्वभाव के कारण विवाह में संभावित संघर्ष का संकेत देती है।",
  "2nd House":
    "द्वितीय भाव में मंगल पारिवारिक जीवन और वित्त को प्रभावित करता है। जातक को धन संचय या पारिवारिक सद्भाव में बाधाओं का सामना करना पड़ सकता है।",
  "4th House":
    "चतुर्थ भाव में मंगल घरेलू शांति को प्रभावित करता है। जातक बार-बार निवास बदल सकता है और घरेलू वातावरण में गड़बड़ी का सामना कर सकता है।",
  "7th House":
    "सप्तम भाव में मंगल सीधे जीवनसाथी को प्रभावित करता है। मांगलिक दोष के लिए यह सबसे महत्वपूर्ण स्थान माना जाता है, जो साथी के साथ विवाद का कारण बनता है।",
  "8th House":
    "अष्टम भाव में मंगल दीर्घायु और विरासत को प्रभावित करता है। जातक को वैवाहिक जीवन में अचानक परिवर्तन का सामना करना पड़ सकता है।",
  "12th House":
    "द्वादश भाव में मंगल व्यय और हानि का संकेत देता है। यदि उपचार नहीं किया गया तो यह वित्तीय हानि और संभावित अलगाव का कारण बन सकता है।",
};

// ═══════════════════════════════════════════════
//  IMPORTANCE OF MATCHMAKING TEXT
// ═══════════════════════════════════════════════
export const IMPORTANCE_TEXT_EN = `'Vivaha' or Marriage is one of the 16 Samskaras or religious conducts/rites prescribed by the ancient Hindu scriptures. It is considered the most important Sanskara as it marks the beginning of Grihastha Ashrama – the stage of householder. Hindu marriages are performed with great care and elaborate rituals, keeping in mind the compatibility of the bride and groom.

In Vedic Astrology, Kundli matching or Horoscope matching is one of the most important aspects before solemnizing a marriage. It involves careful examination of the birth charts of both the boy and the girl to determine their compatibility on various parameters.

The process of Kundli matching involves comparing the planetary positions in both horoscopes. The ancient sages developed the Ashtakoot (8 Koota) or Dashakoot (10 Koota) system to evaluate compatibility. These systems analyze various aspects of the couple's life including their mental compatibility, physical compatibility, financial prosperity, health, progeny, and longevity of the relationship.

A thorough analysis of the horoscopes helps identify potential problems and suggests remedies to overcome them. It also helps understand the nature and temperament of both partners, their family values, and their approach to life. This comprehensive analysis ensures a harmonious and blissful married life.

Match making also involves checking for specific doshas (afflictions) like Manglik Dosha, Nadi Dosha, and Rajju Dosha which are considered significant for marital happiness. If such doshas are present, appropriate remedies are suggested to mitigate their negative effects.`;

export const IMPORTANCE_TEXT_HI = `'विवाह' प्राचीन हिन्दू शास्त्रों द्वारा निर्धारित 16 संस्कारों या धार्मिक आचार/संस्कारों में से एक है। इसे सबसे महत्वपूर्ण संस्कार माना जाता है क्योंकि यह गृहस्थ आश्रम की शुरुआत का प्रतीक है। हिन्दू विवाह वर-वधू की अनुकूलता को ध्यान में रखते हुए बड़ी सावधानी और विस्तृत अनुष्ठानों के साथ किए जाते हैं।

वैदिक ज्योतिष में कुंडली मिलान विवाह से पहले सबसे महत्वपूर्ण पहलुओं में से एक है। इसमें विभिन्न मापदंडों पर उनकी अनुकूलता निर्धारित करने के लिए लड़के और लड़की दोनों की जन्म कुंडलियों की सावधानीपूर्वक जांच शामिल है।

कुंडली मिलान की प्रक्रिया में दोनों कुंडलियों में ग्रहों की स्थिति की तुलना शामिल है। प्राचीन ऋषियों ने अनुकूलता का मूल्यांकन करने के लिए अष्टकूट (8 कूट) या दशकूट (10 कूट) प्रणाली विकसित की। ये प्रणालियाँ दंपति के जीवन के विभिन्न पहलुओं का विश्लेषण करती हैं।

कुण्डलियों का गहन विश्लेषण संभावित समस्याओं की पहचान करने और उन्हें दूर करने के उपाय सुझाने में मदद करता है। मिलान में मांगलिक दोष, नाड़ी दोष और रज्जु दोष जैसे विशिष्ट दोषों की जाँच भी शामिल है।`;

// ═══════════════════════════════════════════════
//  DASHAKOOT DESCRIPTION TEXT
// ═══════════════════════════════════════════════
export const DASHAKOOT_DESC_EN = `Dashakoot is a Vedic compatibility matching system that examines 10 aspects (Kootas) of a couple's horoscopes. Each Koota evaluates a specific dimension of compatibility. The total score is calculated out of 36 points. A score of 18 or above is generally considered acceptable for marriage, while 24 or more indicates excellent compatibility.`;

export const DASHAKOOT_DESC_HI = `दशकूट एक वैदिक अनुकूलता मिलान प्रणाली है जो दंपति की कुंडलियों के 10 पहलुओं (कूटों) की जांच करती है। प्रत्येक कूट अनुकूलता के एक विशिष्ट आयाम का मूल्यांकन करता है। कुल स्कोर 36 अंकों में से गणना की जाती है। 18 या उससे अधिक का स्कोर आमतौर पर विवाह के लिए स्वीकार्य माना जाता है।`;

export const DASHAKOOT_ASPECTS_EN: Record<string, string> = {
  dina: "Dina Koota checks Nakshatra compatibility and indicates general health and well-being after marriage.",
  gan: "Gana Koota represents the temperament — Deva (divine), Manushya (human), or Rakshasa (demon). It ensures mental compatibility.",
  yoni: "Yoni Koota indicates physical and sexual compatibility between the couple. It is based on animal symbolism of Nakshatras.",
  rashi:
    "Rashi Koota (Bhakoot) indicates the influence of one partner's zodiac on the other. It checks for emotional compatibility.",
  raspiyadhipati:
    "Rasyadhipati Koota compares the planetary rulers of both partners' moon signs and checks for friendship between them.",
  rajju:
    "Rajju Dosha checks the Nakshatra's position in the body classification (head, neck, waist, legs, feet). Same Rajju can cause harm.",
  vedha:
    "Vedha checks for Nakshatra obstructions. Certain Nakshatras are mutually antagonistic and their pairing should be avoided.",
  vashya:
    "Vashya Koota indicates mutual attraction and the power of control between the couple.",
  mahendra:
    "Mahendra Koota ensures prosperity, well-being, and the blessing of children. It grants longevity to the relationship.",
  stree:
    "Stree Deergha ensures the well-being and prosperity of the bride. It indicates happiness in married life.",
  deergha:
    "Deergha Koota evaluates the overall longevity and sustainability of the marriage bond.",
};

export const DASHAKOOT_ASPECTS_HI: Record<string, string> = {
  dina: "दिन कूट नक्षत्र अनुकूलता की जांच करता है और विवाह के बाद सामान्य स्वास्थ्य और कल्याण का संकेत देता है।",
  gan: "गण कूट स्वभाव का प्रतिनिधित्व करता है — देव, मनुष्य, या राक्षस। यह मानसिक अनुकूलता सुनिश्चित करता है।",
  yoni: "योनि कूट युगल के बीच शारीरिक अनुकूलता का संकेत देता है। यह नक्षत्रों के पशु प्रतीकवाद पर आधारित है।",
  rashi:
    "राशि कूट एक साथी की राशि का दूसरे पर प्रभाव दर्शाता है। यह भावनात्मक अनुकूलता की जांच करता है।",
  raspiyadhipati:
    "रश्याधिपति कूट दोनों भागीदारों के चंद्र राशि के ग्रह शासकों की तुलना करता है।",
  rajju:
    "रज्जु दोष नक्षत्र की शरीर वर्गीकरण में स्थिति की जांच करता है। समान रज्जु हानि का कारण बन सकता है।",
  vedha:
    "वेध नक्षत्र बाधाओं की जांच करता है। कुछ नक्षत्र परस्पर विरोधी हैं और उनके जोड़ से बचना चाहिए।",
  vashya:
    "वश्य कूट आपसी आकर्षण और दंपति के बीच नियंत्रण की शक्ति को दर्शाता है।",
  mahendra:
    "महेंद्र कूट समृद्धि, कल्याण और संतान का आशीर्वाद सुनिश्चित करता है।",
  stree:
    "स्त्री दीर्घ वधू की भलाई और समृद्धि सुनिश्चित करता है। यह वैवाहिक जीवन में सुख का संकेत देता है।",
  deergha:
    "दीर्घ कूट विवाह बंधन की समग्र दीर्घायु और स्थिरता का मूल्यांकन करता है।",
};

// ═══════════════════════════════════════════════
//  RAJJU DOSHA TEXT
// ═══════════════════════════════════════════════
export const RAJJU_DESC_EN = `Rajju Dosha is one of the most important checks in Vedic matchmaking. The word 'Rajju' means 'rope' and it signifies the bond of marriage. The 27 Nakshatras are classified into five body parts — Head (Shira), Neck (Kantha), Navel (Udara), Waist (Kati), and Feet (Paada).

If both the bride and groom's Nakshatras fall in the same Rajju category, it is considered inauspicious. Specifically:
• Same Head Rajju — May cause death of the husband
• Same Neck Rajju — May cause death of the wife  
• Same Navel Rajju — Loss of children
• Same Waist Rajju — Poverty and financial problems
• Same Feet Rajju — Wandering/constant travel

When Rajju Dosha is not present, the marriage bond is considered strong and long-lasting. The couple is expected to have a harmonious and stable relationship.`;

export const RAJJU_DESC_HI = `रज्जु दोष वैदिक कुंडली मिलान में सबसे महत्वपूर्ण जांचों में से एक है। 'रज्जु' का अर्थ 'रस्सी' है और यह विवाह के बंधन का प्रतीक है। 27 नक्षत्रों को पांच शरीर के अंगों में वर्गीकृत किया गया है — सिर (शिर), गर्दन (कंठ), नाभि (उदर), कमर (कटि), और पैर (पाद)।

यदि वर और वधू दोनों के नक्षत्र एक ही रज्जु श्रेणी में आते हैं, तो इसे अशुभ माना जाता है। जब रज्जु दोष मौजूद नहीं होता है, तो विवाह बंधन मजबूत और लंबे समय तक चलने वाला माना जाता है।`;

// ═══════════════════════════════════════════════
//  PAPASAMYAM TEXT
// ═══════════════════════════════════════════════
export const PAPASAMYAM_DESC_EN = `Papa (Dosha) Comparison is done to check the balance of malefic planetary influences in both horoscopes. The analysis considers malefic effects from the Ascendant (Lagna), Moon, and Venus. The malefic planets considered are Sun, Mars, Saturn, and Rahu (North Node). 

If the total papa points of the male are greater than or equal to the female's, the match is considered favorable. An imbalance may lead to disharmony in married life.`;

export const PAPASAMYAM_DESC_HI = `पापसम्यम (दोष) तुलना दोनों कुंडलियों में पाप ग्रहों के प्रभाव के संतुलन की जांच करने के लिए की जाती है। विश्लेषण लग्न, चंद्रमा और शुक्र से पाप प्रभावों पर विचार करता है। सूर्य, मंगल, शनि और राहु को पाप ग्रह माना जाता है।`;

// ═══════════════════════════════════════════════
//  DASHA ORDER (for Vimshottari pages)
// ═══════════════════════════════════════════════
export const DASHA_PLANETS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

// ═══════════════════════════════════════════════
//  LABELS (EN / HI)
// ═══════════════════════════════════════════════
export interface Labels {
  // Cover
  coverTitle: string;
  matchMakingReport: string;
  male: string;
  female: string;
  name: string;
  dob: string;
  tob: string;
  place: string;
  generatedOn: string;

  // Importance
  importanceTitle: string;

  // Basic Details
  basicDetails: string;
  attributes: string;
  dateOfBirth: string;
  timeOfBirth: string;
  latitude: string;
  longitude: string;
  timezone: string;
  sunrise: string;
  sunset: string;
  ayanamsha: string;
  astrologicalDetails: string;
  varna: string;
  vashya: string;
  yoni: string;
  gan: string;
  nadi: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  charan: string;
  yog: string;
  karan: string;
  tithi: string;
  yunja: string;
  tatva: string;
  pooNameAlphabet: string;
  paya: string;

  // Planets
  planetaryPositions: string;
  planet: string;
  retrograde: string;
  sign: string;
  degrees: string;
  house: string;

  // Charts
  lagnaChart: string;
  chalitChart: string;
  moonChart: string;
  navamshaChart: string;

  // Vimshottari
  vimshottariDasha: string;
  currentDasha: string;
  mahadasha: string;
  antardasha: string;
  dashaName: string;
  startDate: string;
  endDate: string;

  // Manglik
  manglikDosha: string;
  whatIsManglik: string;
  manglikEffect: string;
  manglikAnalysis: string;
  manglikMatch: string;
  manglikMatchResult: string;
  totalManglikPercentage: string;
  manglikPresent: string;
  manglikNotPresent: string;

  // Dashakoot
  dashakoot: string;
  whatIsDashakoot: string;
  dashakootMatching: string;
  total: string;
  received: string;
  totalScore: string;
  outOf36: string;

  // Rajju
  rajjuDosha: string;
  whatIsRajju: string;
  rajjuAnalysis: string;
  present: string;
  notPresent: string;

  // Papasamyam
  papasamyam: string;
  papaPoints: string;
  fromAscendant: string;
  fromMoon: string;
  fromVenus: string;

  // Personality
  personalityReport: string;

  // Traits
  traitsTitle: string;
  positiveTraits: string;
  negativeTraits: string;

  // Match Report
  matchReport: string;
  matchConclusion: string;
  dashakootSummary: string;
  manglikSummary: string;

  // Back cover
  thankYou: string;
  blessingQuote: string;
  years: string;
  page: string;
}

export const LABELS_EN: Labels = {
  coverTitle: "Match Making Report",
  matchMakingReport: "Match Making Report",
  male: "Male (Groom)",
  female: "Female (Bride)",
  name: "Name",
  dob: "Date of Birth",
  tob: "Time of Birth",
  place: "Place of Birth",
  generatedOn: "Generated on",

  importanceTitle: "Importance of Match Making",

  basicDetails: "Basic Astrological Details",
  attributes: "Attributes",
  dateOfBirth: "Date of Birth",
  timeOfBirth: "Time of Birth",
  latitude: "Latitude",
  longitude: "Longitude",
  timezone: "Timezone",
  sunrise: "Sunrise",
  sunset: "Sunset",
  ayanamsha: "Ayanamsha",
  astrologicalDetails: "Astrological Details",
  varna: "Varna",
  vashya: "Vashya",
  yoni: "Yoni",
  gan: "Gan",
  nadi: "Nadi",
  signLord: "Sign Lord",
  nakshatra: "Nakshatra",
  nakshatraLord: "Nakshatra Lord",
  charan: "Charan",
  yog: "Yog",
  karan: "Karan",
  tithi: "Tithi",
  yunja: "Yunja",
  tatva: "Tatva",
  pooNameAlphabet: "Poo Name Alphabet",
  paya: "Paya",

  planetaryPositions: "Planetary Positions",
  planet: "Planet",
  retrograde: "R",
  sign: "Sign",
  degrees: "Degrees",
  house: "House",

  lagnaChart: "Lagna Chart (D1)",
  chalitChart: "Chalit Chart",
  moonChart: "Moon Chart",
  navamshaChart: "Navamsha Chart (D9)",

  vimshottariDasha: "Vimshottari Dasha",
  currentDasha: "Current Undergoing Dasha",
  mahadasha: "Mahadasha",
  antardasha: "Antardasha",
  dashaName: "Dasha",
  startDate: "Start",
  endDate: "End",

  manglikDosha: "Manglik Dosha",
  whatIsManglik: "What is Manglik Dosha?",
  manglikEffect: "Manglik Dosha Effect",
  manglikAnalysis: "Manglik Analysis",
  manglikMatch: "Manglik Match Analysis",
  manglikMatchResult: "Manglik Match Result",
  totalManglikPercentage: "Total Manglik Percentage",
  manglikPresent: "Manglik Dosha Present",
  manglikNotPresent: "Manglik Dosha Not Present",

  dashakoot: "Dashakoot Matching",
  whatIsDashakoot: "What is Dashakoot?",
  dashakootMatching: "Dashakoot Matching Table",
  total: "Total",
  received: "Received",
  totalScore: "Total Score",
  outOf36: "out of 36",

  rajjuDosha: "Rajju Dosha",
  whatIsRajju: "What is Rajju Dosha?",
  rajjuAnalysis: "Rajju Dosha Analysis",
  present: "Present",
  notPresent: "Not Present",

  papasamyam: "Papasamyam Analysis",
  papaPoints: "Papa Points",
  fromAscendant: "From Ascendant",
  fromMoon: "From Moon",
  fromVenus: "From Venus",

  personalityReport: "Personality Report",

  traitsTitle: "Traits - Characteristics",
  positiveTraits: "Positive Traits",
  negativeTraits: "Negative Traits",

  matchReport: "Match Making Report",
  matchConclusion: "Match Conclusion",
  dashakootSummary: "Dashakoot",
  manglikSummary: "Manglik",

  thankYou: "Thank You",
  blessingQuote:
    "May the stars align for a blissful and harmonious union. Wishing you both a lifetime of love, happiness, and togetherness.",
  years: "years",
  page: "Page",
};

export const LABELS_HI: Labels = {
  coverTitle: "कुंडली मिलान रिपोर्ट",
  matchMakingReport: "कुंडली मिलान रिपोर्ट",
  male: "वर (लड़का)",
  female: "वधू (लड़की)",
  name: "नाम",
  dob: "जन्म तिथि",
  tob: "जन्म समय",
  place: "जन्म स्थान",
  generatedOn: "रिपोर्ट तिथि",

  importanceTitle: "कुंडली मिलान का महत्व",

  basicDetails: "मूल ज्योतिषीय विवरण",
  attributes: "विवरण",
  dateOfBirth: "जन्म तिथि",
  timeOfBirth: "जन्म समय",
  latitude: "अक्षांश",
  longitude: "देशांतर",
  timezone: "समय क्षेत्र",
  sunrise: "सूर्योदय",
  sunset: "सूर्यास्त",
  ayanamsha: "अयनांश",
  astrologicalDetails: "ज्योतिषीय विवरण",
  varna: "वर्ण",
  vashya: "वश्य",
  yoni: "योनि",
  gan: "गण",
  nadi: "नाड़ी",
  signLord: "राशि स्वामी",
  nakshatra: "नक्षत्र",
  nakshatraLord: "नक्षत्र स्वामी",
  charan: "चरण",
  yog: "योग",
  karan: "करण",
  tithi: "तिथि",
  yunja: "युंजा",
  tatva: "तत्व",
  pooNameAlphabet: "पू नाम अक्षर",
  paya: "पाया",

  planetaryPositions: "ग्रह स्थिति",
  planet: "ग्रह",
  retrograde: "वक्री",
  sign: "राशि",
  degrees: "अंश",
  house: "भाव",

  lagnaChart: "लग्न कुंडली (D1)",
  chalitChart: "चलित कुंडली",
  moonChart: "चंद्र कुंडली",
  navamshaChart: "नवांश कुंडली (D9)",

  vimshottariDasha: "विंशोत्तरी दशा",
  currentDasha: "वर्तमान दशा",
  mahadasha: "महादशा",
  antardasha: "अंतर्दशा",
  dashaName: "दशा",
  startDate: "आरंभ",
  endDate: "समाप्त",

  manglikDosha: "मांगलिक दोष",
  whatIsManglik: "मांगलिक दोष क्या है?",
  manglikEffect: "मांगलिक दोष प्रभाव",
  manglikAnalysis: "मांगलिक विश्लेषण",
  manglikMatch: "मांगलिक मिलान विश्लेषण",
  manglikMatchResult: "मांगलिक मिलान परिणाम",
  totalManglikPercentage: "कुल मांगलिक प्रतिशत",
  manglikPresent: "मांगलिक दोष उपस्थित",
  manglikNotPresent: "मांगलिक दोष अनुपस्थित",

  dashakoot: "दशकूट मिलान",
  whatIsDashakoot: "दशकूट क्या है?",
  dashakootMatching: "दशकूट मिलान तालिका",
  total: "कुल",
  received: "प्राप्त",
  totalScore: "कुल स्कोर",
  outOf36: "36 में से",

  rajjuDosha: "रज्जु दोष",
  whatIsRajju: "रज्जु दोष क्या है?",
  rajjuAnalysis: "रज्जु दोष विश्लेषण",
  present: "उपस्थित",
  notPresent: "अनुपस्थित",

  papasamyam: "पापसम्यम विश्लेषण",
  papaPoints: "पाप अंक",
  fromAscendant: "लग्न से",
  fromMoon: "चंद्र से",
  fromVenus: "शुक्र से",

  personalityReport: "व्यक्तित्व रिपोर्ट",

  traitsTitle: "गुण - विशेषताएं",
  positiveTraits: "सकारात्मक गुण",
  negativeTraits: "नकारात्मक गुण",

  matchReport: "कुंडली मिलान रिपोर्ट",
  matchConclusion: "मिलान निष्कर्ष",
  dashakootSummary: "दशकूट",
  manglikSummary: "मांगलिक",

  thankYou: "धन्यवाद",
  blessingQuote:
    "सितारे एक सुखी और सामंजस्यपूर्ण मिलन के लिए संरेखित हों। आप दोनों को प्रेम, सुख और एकजुटता का जीवन मिले।",
  years: "वर्ष",
  page: "पृष्ठ",
};

export function getLabels(lang: string): Labels {
  return lang === "hi" ? LABELS_HI : LABELS_EN;
}
