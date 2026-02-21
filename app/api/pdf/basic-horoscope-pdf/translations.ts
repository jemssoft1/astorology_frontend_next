// translations.ts — Translation dictionaries for API response data (English → 8 languages)
// Translates planet names, zodiac signs, nakshatras, day names, and other astrological terms

export type LangCode = "en" | "hi" | "bn" | "mr" | "ta" | "te" | "kn" | "ml";

// ============================================
// Planet Names (9 planets + Ascendant)
// ============================================
const PLANET_NAMES: Record<string, Record<LangCode, string>> = {
  Sun: {
    en: "Sun",
    hi: "सूर्य",
    bn: "সূর্য",
    mr: "सूर्य",
    ta: "சூரியன்",
    te: "సూర్యుడు",
    kn: "ಸೂರ್ಯ",
    ml: "സൂര്യൻ",
  },
  Moon: {
    en: "Moon",
    hi: "चंद्र",
    bn: "চন্দ্র",
    mr: "चंद्र",
    ta: "சந்திரன்",
    te: "చంద్రుడు",
    kn: "ಚಂದ್ರ",
    ml: "ചന്ദ്രൻ",
  },
  Mars: {
    en: "Mars",
    hi: "मंगल",
    bn: "মঙ্গল",
    mr: "मंगळ",
    ta: "செவ்வாய்",
    te: "కుజుడు",
    kn: "ಮಂಗಳ",
    ml: "ചൊവ്വ",
  },
  Mercury: {
    en: "Mercury",
    hi: "बुध",
    bn: "বুধ",
    mr: "बुध",
    ta: "புதன்",
    te: "బుధుడు",
    kn: "ಬುಧ",
    ml: "ബുധൻ",
  },
  Jupiter: {
    en: "Jupiter",
    hi: "गुरु",
    bn: "বৃহস্পতি",
    mr: "गुरु",
    ta: "குரு",
    te: "గురుడు",
    kn: "ಗುರು",
    ml: "വ്യാഴം",
  },
  Venus: {
    en: "Venus",
    hi: "शुक्र",
    bn: "শুক্র",
    mr: "शुक्र",
    ta: "சுக்கிரன்",
    te: "శుక్రుడు",
    kn: "ಶುಕ್ರ",
    ml: "ശുക്രൻ",
  },
  Saturn: {
    en: "Saturn",
    hi: "शनि",
    bn: "শনি",
    mr: "शनि",
    ta: "சனி",
    te: "శని",
    kn: "ಶನಿ",
    ml: "ശനി",
  },
  Rahu: {
    en: "Rahu",
    hi: "राहु",
    bn: "রাহু",
    mr: "राहु",
    ta: "ராகு",
    te: "రాహువు",
    kn: "ರಾಹು",
    ml: "രാഹു",
  },
  Ketu: {
    en: "Ketu",
    hi: "केतु",
    bn: "কেতু",
    mr: "केतु",
    ta: "கேது",
    te: "కేతువు",
    kn: "ಕೇತು",
    ml: "കേതു",
  },
  Ascendant: {
    en: "Ascendant",
    hi: "लग्न",
    bn: "লগ্ন",
    mr: "लग्न",
    ta: "லக்னம்",
    te: "లగ్నం",
    kn: "ಲಗ್ನ",
    ml: "ലഗ്നം",
  },
};

// ============================================
// Zodiac Signs (12 signs)
// ============================================
const ZODIAC_SIGN_NAMES: Record<string, Record<LangCode, string>> = {
  Aries: {
    en: "Aries",
    hi: "मेष",
    bn: "মেষ",
    mr: "मेष",
    ta: "மேஷம்",
    te: "మేషం",
    kn: "ಮೇಷ",
    ml: "മേടം",
  },
  Taurus: {
    en: "Taurus",
    hi: "वृषभ",
    bn: "বৃষ",
    mr: "वृषभ",
    ta: "ரிஷபம்",
    te: "వృషభం",
    kn: "ವೃಷಭ",
    ml: "ഇടവം",
  },
  Gemini: {
    en: "Gemini",
    hi: "मिथुन",
    bn: "মিথুন",
    mr: "मिथुन",
    ta: "மிதுனம்",
    te: "మిథునం",
    kn: "ಮಿಥುನ",
    ml: "മിഥുനം",
  },
  Cancer: {
    en: "Cancer",
    hi: "कर्क",
    bn: "কর্কট",
    mr: "कर्क",
    ta: "கடகம்",
    te: "కర్కాటకం",
    kn: "ಕರ್ಕಾಟಕ",
    ml: "കർക്കടകം",
  },
  Leo: {
    en: "Leo",
    hi: "सिंह",
    bn: "সিংহ",
    mr: "सिंह",
    ta: "சிம்மம்",
    te: "సింహం",
    kn: "ಸಿಂಹ",
    ml: "ചിങ്ങം",
  },
  Virgo: {
    en: "Virgo",
    hi: "कन्या",
    bn: "কন্যা",
    mr: "कन्या",
    ta: "கன்னி",
    te: "కన్య",
    kn: "ಕನ್ಯಾ",
    ml: "കന്നി",
  },
  Libra: {
    en: "Libra",
    hi: "तुला",
    bn: "তুলা",
    mr: "तूळ",
    ta: "துலாம்",
    te: "తుల",
    kn: "ತುಲಾ",
    ml: "തുലാം",
  },
  Scorpio: {
    en: "Scorpio",
    hi: "वृश्चिक",
    bn: "বৃশ্চিক",
    mr: "वृश्चिक",
    ta: "விருச்சிகம்",
    te: "వృశ్చికం",
    kn: "ವೃಶ್ಚಿಕ",
    ml: "വൃശ്ചികം",
  },
  Sagittarius: {
    en: "Sagittarius",
    hi: "धनु",
    bn: "ধনু",
    mr: "धनु",
    ta: "தனுசு",
    te: "ధనస్సు",
    kn: "ಧನು",
    ml: "ധനു",
  },
  Capricorn: {
    en: "Capricorn",
    hi: "मकर",
    bn: "মকর",
    mr: "मकर",
    ta: "மகரம்",
    te: "మకరం",
    kn: "ಮಕರ",
    ml: "മകരം",
  },
  Aquarius: {
    en: "Aquarius",
    hi: "कुम्भ",
    bn: "কুম্ভ",
    mr: "कुंभ",
    ta: "கும்பம்",
    te: "కుంభం",
    kn: "ಕುಂಭ",
    ml: "കുംഭം",
  },
  Pisces: {
    en: "Pisces",
    hi: "मीन",
    bn: "মীন",
    mr: "मीन",
    ta: "மீனம்",
    te: "మీనం",
    kn: "ಮೀನ",
    ml: "മീനം",
  },
};

// ============================================
// Nakshatras (27 nakshatras)
// ============================================
const NAKSHATRA_NAMES: Record<string, Record<LangCode, string>> = {
  Ashwini: {
    en: "Ashwini",
    hi: "अश्विनी",
    bn: "অশ্বিনী",
    mr: "अश्विनी",
    ta: "அஸ்வினி",
    te: "అశ్వని",
    kn: "ಅಶ್ವಿನಿ",
    ml: "അശ്വതി",
  },
  Bharani: {
    en: "Bharani",
    hi: "भरणी",
    bn: "ভরণী",
    mr: "भरणी",
    ta: "பரணி",
    te: "భరణి",
    kn: "ಭರಣಿ",
    ml: "ഭരണി",
  },
  Krittika: {
    en: "Krittika",
    hi: "कृत्तिका",
    bn: "কৃত্তিকা",
    mr: "कृत्तिका",
    ta: "கிருத்திகை",
    te: "కృత్తిక",
    kn: "ಕೃತ್ತಿಕಾ",
    ml: "കാർത്തിക",
  },
  Rohini: {
    en: "Rohini",
    hi: "रोहिणी",
    bn: "রোহিণী",
    mr: "रोहिणी",
    ta: "ரோகிணி",
    te: "రోహిణి",
    kn: "ರೋಹಿಣಿ",
    ml: "രോഹിണി",
  },
  Mrigashira: {
    en: "Mrigashira",
    hi: "मृगशिरा",
    bn: "মৃগশিরা",
    mr: "मृगशीर्ष",
    ta: "மிருகசீரிடம்",
    te: "మృగశిర",
    kn: "ಮೃಗಶಿರ",
    ml: "മകയിരം",
  },
  Ardra: {
    en: "Ardra",
    hi: "आर्द्रा",
    bn: "আর্দ্রা",
    mr: "आर्द्रा",
    ta: "திருவாதிரை",
    te: "ఆర్ద్ర",
    kn: "ಆರ್ದ್ರಾ",
    ml: "തിരുവാതിര",
  },
  Punarvasu: {
    en: "Punarvasu",
    hi: "पुनर्वसु",
    bn: "পুনর্বসু",
    mr: "पुनर्वसु",
    ta: "புனர்பூசம்",
    te: "పునర్వసు",
    kn: "ಪುನರ್ವಸು",
    ml: "പുണർതം",
  },
  Pushya: {
    en: "Pushya",
    hi: "पुष्य",
    bn: "পুষ্য",
    mr: "पुष्य",
    ta: "பூசம்",
    te: "పుష్యమి",
    kn: "ಪುಷ್ಯ",
    ml: "പൂയം",
  },
  Ashlesha: {
    en: "Ashlesha",
    hi: "आश्लेषा",
    bn: "আশ্লেষা",
    mr: "आश्लेषा",
    ta: "ஆயில்யம்",
    te: "ఆశ్లేష",
    kn: "ಆಶ್ಲೇಷ",
    ml: "ആയില്യം",
  },
  Magha: {
    en: "Magha",
    hi: "मघा",
    bn: "মঘা",
    mr: "मघा",
    ta: "மகம்",
    te: "మఘ",
    kn: "ಮಘಾ",
    ml: "മകം",
  },
  "Purva Phalguni": {
    en: "Purva Phalguni",
    hi: "पूर्व फाल्गुनी",
    bn: "পূর্ব ফাল্গুনী",
    mr: "पूर्वा फाल्गुनी",
    ta: "பூரம்",
    te: "పూర్వ ఫల్గుణి",
    kn: "ಪೂರ್ವ ಫಲ್ಗುಣಿ",
    ml: "പൂരം",
  },
  "Uttara Phalguni": {
    en: "Uttara Phalguni",
    hi: "उत्तर फाल्गुनी",
    bn: "উত্তর ফাল্গুনী",
    mr: "उत्तरा फाल्गुनी",
    ta: "உத்திரம்",
    te: "ఉత్తర ఫల్గుణి",
    kn: "ಉತ್ತರ ಫಲ್ಗುಣಿ",
    ml: "ഉത്രം",
  },
  Hasta: {
    en: "Hasta",
    hi: "हस्त",
    bn: "হস্ত",
    mr: "हस्त",
    ta: "அஸ்தம்",
    te: "హస్త",
    kn: "ಹಸ್ತ",
    ml: "അത്തം",
  },
  Chitra: {
    en: "Chitra",
    hi: "चित्रा",
    bn: "চিত্রা",
    mr: "चित्रा",
    ta: "சித்திரை",
    te: "చిత్ర",
    kn: "ಚಿತ್ರಾ",
    ml: "ചിത്തിര",
  },
  Swati: {
    en: "Swati",
    hi: "स्वाति",
    bn: "স্বাতী",
    mr: "स्वाती",
    ta: "சுவாதி",
    te: "స్వాతి",
    kn: "ಸ್ವಾತಿ",
    ml: "ചോതി",
  },
  Vishakha: {
    en: "Vishakha",
    hi: "विशाखा",
    bn: "বিশাখা",
    mr: "विशाखा",
    ta: "விசாகம்",
    te: "విశాఖ",
    kn: "ವಿಶಾಖ",
    ml: "വിശാഖം",
  },
  Anuradha: {
    en: "Anuradha",
    hi: "अनुराधा",
    bn: "অনুরাধা",
    mr: "अनुराधा",
    ta: "அனுஷம்",
    te: "అనూరాధ",
    kn: "ಅನುರಾಧ",
    ml: "അനിഴം",
  },
  Jyeshtha: {
    en: "Jyeshtha",
    hi: "ज्येष्ठा",
    bn: "জ্যেষ্ঠা",
    mr: "ज्येष्ठा",
    ta: "கேட்டை",
    te: "జ్యేష్ఠ",
    kn: "ಜ್ಯೇಷ್ಠ",
    ml: "തൃക്കേട്ട",
  },
  Mula: {
    en: "Mula",
    hi: "मूल",
    bn: "মূলা",
    mr: "मूळ",
    ta: "மூலம்",
    te: "మూల",
    kn: "ಮೂಲ",
    ml: "മൂലം",
  },
  "Purva Ashadha": {
    en: "Purva Ashadha",
    hi: "पूर्वाषाढ़ा",
    bn: "পূর্বাষাঢ়া",
    mr: "पूर्वाषाढा",
    ta: "பூராடம்",
    te: "పూర్వాషాఢ",
    kn: "ಪೂರ್ವಾಷಾಢ",
    ml: "പൂരാടം",
  },
  "Uttara Ashadha": {
    en: "Uttara Ashadha",
    hi: "उत्तराषाढ़ा",
    bn: "উত্তরাষাঢ়া",
    mr: "उत्तराषाढा",
    ta: "உத்திராடம்",
    te: "ఉత్తరాషాఢ",
    kn: "ಉತ್ತರಾಷಾಢ",
    ml: "ഉത്രാടം",
  },
  Shravana: {
    en: "Shravana",
    hi: "श्रवण",
    bn: "শ্রবণা",
    mr: "श्रवण",
    ta: "திருவோணம்",
    te: "శ్రవణం",
    kn: "ಶ್ರವಣ",
    ml: "തിരുവോണം",
  },
  Dhanishta: {
    en: "Dhanishta",
    hi: "धनिष्ठा",
    bn: "ধনিষ্ঠা",
    mr: "धनिष्ठा",
    ta: "அவிட்டம்",
    te: "ధనిష్ఠ",
    kn: "ಧನಿಷ್ಠಾ",
    ml: "അവിട്ടം",
  },
  Shatabhisha: {
    en: "Shatabhisha",
    hi: "शतभिषा",
    bn: "শতভিষা",
    mr: "शतभिषा",
    ta: "சதயம்",
    te: "శతభిషం",
    kn: "ಶತಭಿಷ",
    ml: "ചതയം",
  },
  "Purva Bhadrapada": {
    en: "Purva Bhadrapada",
    hi: "पूर्व भाद्रपद",
    bn: "পূর্ব ভাদ্রপদ",
    mr: "पूर्वा भाद्रपद",
    ta: "பூரட்டாதி",
    te: "పూర్వాభాద్ర",
    kn: "ಪೂರ್ವಾಭಾದ್ರ",
    ml: "പൂരുരുട്ടാതി",
  },
  "Uttara Bhadrapada": {
    en: "Uttara Bhadrapada",
    hi: "उत्तर भाद्रपद",
    bn: "উত্তর ভাদ্রপদ",
    mr: "उत्तरा भाद्रपद",
    ta: "உத்திரட்டாதி",
    te: "ఉత్తరాభాద్ర",
    kn: "ಉತ್ತರಾಭಾದ್ರ",
    ml: "ഉത്രട്ടാതി",
  },
  Revati: {
    en: "Revati",
    hi: "रेवती",
    bn: "রেবতী",
    mr: "रेवती",
    ta: "ரேவதி",
    te: "రేవతి",
    kn: "ರೇವತಿ",
    ml: "രേവതി",
  },
};

// ============================================
// Day Names
// ============================================
const DAY_NAMES: Record<string, Record<LangCode, string>> = {
  Sunday: {
    en: "Sunday",
    hi: "रविवार",
    bn: "রবিবার",
    mr: "रविवार",
    ta: "ஞாயிறு",
    te: "ఆదివారం",
    kn: "ಭಾನುವಾರ",
    ml: "ഞായർ",
  },
  Monday: {
    en: "Monday",
    hi: "सोमवार",
    bn: "সোমবার",
    mr: "सोमवार",
    ta: "திங்கள்",
    te: "సోమవారం",
    kn: "ಸೋಮವಾರ",
    ml: "തിങ്കൾ",
  },
  Tuesday: {
    en: "Tuesday",
    hi: "मंगलवार",
    bn: "মঙ্গলবার",
    mr: "मंगळवार",
    ta: "செவ்வாய்",
    te: "మంగళవారం",
    kn: "ಮಂಗಳವಾರ",
    ml: "ചൊവ്വ",
  },
  Wednesday: {
    en: "Wednesday",
    hi: "बुधवार",
    bn: "বুধবার",
    mr: "बुधवार",
    ta: "புதன்",
    te: "బుధవారం",
    kn: "ಬುಧವಾರ",
    ml: "ബുധൻ",
  },
  Thursday: {
    en: "Thursday",
    hi: "गुरुवार",
    bn: "বৃহস্পতিবার",
    mr: "गुरुवार",
    ta: "வியாழன்",
    te: "గురువారం",
    kn: "ಗುರುವಾರ",
    ml: "വ്യാഴം",
  },
  Friday: {
    en: "Friday",
    hi: "शुक्रवार",
    bn: "শুক্রবার",
    mr: "शुक्रवार",
    ta: "வெள்ளி",
    te: "శుక్రవారం",
    kn: "ಶುಕ್ರವಾರ",
    ml: "വെള്ളി",
  },
  Saturday: {
    en: "Saturday",
    hi: "शनिवार",
    bn: "শনিবার",
    mr: "शनिवार",
    ta: "சனி",
    te: "శనివారం",
    kn: "ಶನಿವಾರ",
    ml: "ശനി",
  },
};

// ============================================
// Common Astrological Terms
// ============================================
const ASTRO_TERMS: Record<string, Record<LangCode, string>> = {
  Retrograde: {
    en: "Retrograde",
    hi: "वक्री",
    bn: "বক্র",
    mr: "वक्री",
    ta: "வக்ர",
    te: "వక్ర",
    kn: "ವಕ್ರ",
    ml: "വക്ര",
  },
  Direct: {
    en: "Direct",
    hi: "मार्गी",
    bn: "মার্গী",
    mr: "मार्गी",
    ta: "நேர்",
    te: "మార్గి",
    kn: "ಮಾರ್ಗಿ",
    ml: "മാർഗി",
  },
  Exalted: {
    en: "Exalted",
    hi: "उच्च",
    bn: "উচ্চ",
    mr: "उच्च",
    ta: "உச்சம்",
    te: "ఉచ్ఛ",
    kn: "ಉಚ್ಛ",
    ml: "ഉച്ചം",
  },
  Debilitated: {
    en: "Debilitated",
    hi: "नीच",
    bn: "নীচ",
    mr: "नीच",
    ta: "நீசம்",
    te: "నీచ",
    kn: "ನೀಚ",
    ml: "നീചം",
  },
  Fire: {
    en: "Fire",
    hi: "अग्नि",
    bn: "অগ্নি",
    mr: "अग्नि",
    ta: "நெருப்பு",
    te: "అగ్ని",
    kn: "ಅಗ್ನಿ",
    ml: "അഗ്നി",
  },
  Earth: {
    en: "Earth",
    hi: "पृथ्वी",
    bn: "পৃথিবী",
    mr: "पृथ्वी",
    ta: "நிலம்",
    te: "భూమి",
    kn: "ಭೂಮಿ",
    ml: "ഭൂമി",
  },
  Air: {
    en: "Air",
    hi: "वायु",
    bn: "বায়ু",
    mr: "वायू",
    ta: "காற்று",
    te: "వాయువు",
    kn: "ವಾಯು",
    ml: "വായു",
  },
  Water: {
    en: "Water",
    hi: "जल",
    bn: "জল",
    mr: "जल",
    ta: "நீர்",
    te: "జలం",
    kn: "ಜಲ",
    ml: "ജലം",
  },
};

// ============================================
// Yogini Dasha Names
// ============================================
const YOGINI_NAMES: Record<string, Record<LangCode, string>> = {
  Mangala: {
    en: "Mangala",
    hi: "मंगला",
    bn: "মঙ্গলা",
    mr: "मंगला",
    ta: "மங்களா",
    te: "మంగళ",
    kn: "ಮಂಗಳ",
    ml: "മംഗള",
  },
  Mangla: {
    en: "Mangla",
    hi: "मंगला",
    bn: "মঙ্গলা",
    mr: "मंगला",
    ta: "மங்களா",
    te: "మంగళ",
    kn: "ಮಂಗಳ",
    ml: "മംഗള",
  },
  Pingala: {
    en: "Pingala",
    hi: "पिंगला",
    bn: "পিঙ্গলা",
    mr: "पिंगला",
    ta: "பிங்களா",
    te: "పింగళ",
    kn: "ಪಿಂಗಳ",
    ml: "പിംഗള",
  },
  Pingla: {
    en: "Pingla",
    hi: "पिंगला",
    bn: "পিঙ্গলা",
    mr: "पिंगला",
    ta: "பிங்களா",
    te: "పింగళ",
    kn: "ಪಿಂಗಳ",
    ml: "പിംഗള",
  },
  Dhanya: {
    en: "Dhanya",
    hi: "धान्या",
    bn: "ধান্যা",
    mr: "धान्या",
    ta: "தான்யா",
    te: "ధాన్య",
    kn: "ಧಾನ್ಯ",
    ml: "ധാന്യ",
  },
  Bhramari: {
    en: "Bhramari",
    hi: "भ्रामरी",
    bn: "ভ্রামরী",
    mr: "भ्रामरी",
    ta: "ப்ராமரி",
    te: "భ్రామరి",
    kn: "ಭ್ರಾಮರಿ",
    ml: "ഭ്രാമരി",
  },
  Bhadrika: {
    en: "Bhadrika",
    hi: "भद्रिका",
    bn: "ভদ্রিকা",
    mr: "भद्रिका",
    ta: "பத்ரிகா",
    te: "భద్రిక",
    kn: "ಭದ್ರಿಕ",
    ml: "ഭദ്രിക",
  },
  Ulka: {
    en: "Ulka",
    hi: "उल्का",
    bn: "উল্কা",
    mr: "उल्का",
    ta: "உல்கா",
    te: "ఉల్క",
    kn: "ಉಲ್ಕ",
    ml: "ഉൽക",
  },
  Siddha: {
    en: "Siddha",
    hi: "सिद्धा",
    bn: "সিদ্ধা",
    mr: "सिद्धा",
    ta: "சித்தா",
    te: "సిద్ధ",
    kn: "ಸಿದ್ಧ",
    ml: "സിദ്ധ",
  },
  Sankata: {
    en: "Sankata",
    hi: "संकटा",
    bn: "সঙ্কটা",
    mr: "संकटा",
    ta: "சங்கடா",
    te: "సంకట",
    kn: "ಸಂಕಟ",
    ml: "സങ്കട",
  },
};

// ============================================
// Translation Functions
// ============================================

/** Translate a planet name from English → target language */
export function translatePlanet(name: string, lang: LangCode): string {
  if (lang === "en") return name;
  const trimmed = name.trim();
  return PLANET_NAMES[trimmed]?.[lang] || name;
}

/** Translate a zodiac sign name from English → target language */
export function translateSign(name: string, lang: LangCode): string {
  if (lang === "en") return name;
  const trimmed = name.trim();
  return ZODIAC_SIGN_NAMES[trimmed]?.[lang] || name;
}

/** Translate a nakshatra name from English → target language */
export function translateNakshatra(name: string, lang: LangCode): string {
  if (lang === "en") return name;
  const trimmed = name.trim();
  return NAKSHATRA_NAMES[trimmed]?.[lang] || name;
}

/** Translate a day name from English → target language */
export function translateDay(name: string, lang: LangCode): string {
  if (lang === "en") return name;
  const trimmed = name.trim();
  return DAY_NAMES[trimmed]?.[lang] || name;
}

/** Translate a yogini dasha name from English → target language */
export function translateYogini(name: string, lang: LangCode): string {
  if (lang === "en") return name;
  // strip " (II)" / " (III)" suffix
  const base = name.replace(/\s*\(.*\)$/, "").trim();
  const suffix = name.includes("(") ? name.substring(name.indexOf("(")) : "";
  const translated = YOGINI_NAMES[base]?.[lang] || base;
  return suffix ? `${translated} ${suffix}` : translated;
}

/** Translate an astrological term from English → target language */
export function translateTerm(term: string, lang: LangCode): string {
  if (lang === "en") return term;
  const trimmed = term.trim();
  return ASTRO_TERMS[trimmed]?.[lang] || term;
}

/** Generic translate — tries all dictionaries in order */
export function translateValue(value: string, lang: LangCode): string {
  if (lang === "en" || !value) return value;
  const trimmed = value.trim();
  return (
    PLANET_NAMES[trimmed]?.[lang] ||
    ZODIAC_SIGN_NAMES[trimmed]?.[lang] ||
    NAKSHATRA_NAMES[trimmed]?.[lang] ||
    DAY_NAMES[trimmed]?.[lang] ||
    ASTRO_TERMS[trimmed]?.[lang] ||
    YOGINI_NAMES[trimmed]?.[lang] ||
    value
  );
}
