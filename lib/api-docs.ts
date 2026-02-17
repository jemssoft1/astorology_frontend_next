import { APIDocMetadata } from "@/types/api-docs";

const COMMON_BIRTH_PARAMS = [
  { name: "day", type: "number", required: true, description: "Birth day (1-31)", example: "15" },
  { name: "month", type: "number", required: true, description: "Birth month (1-12)", example: "8" },
  { name: "year", type: "number", required: true, description: "Birth year (e.g., 1990)", example: "1990" },
  { name: "hour", type: "number", required: true, description: "Birth hour (0-23)", example: "10" },
  { name: "min", type: "number", required: true, description: "Birth minute (0-59)", example: "30" },
  { name: "lat", type: "number", required: true, description: "Latitude of birth place", example: "22.57" },
  { name: "lon", type: "number", required: true, description: "Longitude of birth place", example: "88.36" },
  { name: "tzone", type: "number", required: true, description: "Timezone offset in hours", example: "5.5" },
];

const COMMON_NAME_PARAM = { name: "name", type: "string", required: true, description: "Name of the person", example: "John Doe" };

export const API_DOC_METADATA: APIDocMetadata = {
  categories: [
    "Astrology Systems",
    "Predictions",
    "Numerology",
    "Match Making",
    "Western Astrology",
    "Remedies",
    "Person Management",
    "Utilities"
  ],
  methods: [
    // --- Astrology Systems ---
    {
      id: "ashtakvarga",
      category: "Astrology Systems",
      title: "Ashtakvarga Data",
      description: "Fetches Sarvashtakvarga and Planet Ashtakvarga for all 7 major planets.",
      endpoint: "/api/ashtakvarga",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { sarvashtakvarga: {}, planet_ashtakvarga: {} } } }]
    },
    {
      id: "char-dasha",
      category: "Astrology Systems",
      title: "Char Dasha",
      description: "Get Jaimini Char Dasha details including major, sub, and current periods.",
      endpoint: "/api/char-dasha",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { major_chardasha: [], current_chardasha: {} } } }]
    },
    {
      id: "kp-system",
      category: "Astrology Systems",
      title: "K.P. System",
      description: "Detailed Krishnamurti Paddhati data including planets, cusps, and significators.",
      endpoint: "/api/kp-system",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { kp_planets: {}, kp_house_cusps: {} } } }]
    },
    {
      id: "lalkitab",
      category: "Astrology Systems",
      title: "Lal Kitab",
      description: "Lal Kitab horoscope, debts, and remedies for all planets.",
      endpoint: "/api/lalkitab",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { horoscope: {}, remedies: {} } } }]
    },
    {
      id: "varshaphal",
      category: "Astrology Systems",
      title: "Varshaphal (Annual Chart)",
      description: "Annual solar return chart and predictions.",
      endpoint: "/api/varshaphal",
      method: "POST",
      parameters: [...COMMON_BIRTH_PARAMS, { name: "varshaphal_year", type: "number", required: true, description: "Target Year", example: "2026" }],
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { year_chart: {}, mudda_dasha: [] } } }]
    },
    {
      id: "vimshottari-dasha",
      category: "Astrology Systems",
      title: "Vimshottari Dasha",
      description: "Complete Vimshottari Dasha hierarchy from Mahadasha to Sookshma Dasha.",
      endpoint: "/api/vimshottari-dasha",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { current_vdasha_all: {} } } }]
    },
    {
      id: "yogini-dasha",
      category: "Astrology Systems",
      title: "Yogini Dasha",
      description: "Yogini Dasha periods including major, sub, and current dasha.",
      endpoint: "/api/yogini-dasha",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { major_yogini_dasha: [] } } }]
    },

    // --- Predictions ---
    {
      id: "daily-horoscope",
      category: "Predictions",
      title: "Daily Horoscope",
      description: "Daily predictions based on Sun Sign for yesterday, today, and tomorrow.",
      endpoint: "/api/daily-horoscope",
      method: "POST",
      parameters: [
        { name: "sign", type: "string", required: true, description: "Zodiac Sign", example: "aries" },
        { name: "timezone", type: "number", required: false, description: "Timezone", example: "5.5" }
      ],
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { success: true, data: { predictions: { today: {} } } } }]
    },
    {
      id: "daily-nakshatra",
      category: "Predictions",
      title: "Daily Nakshatra Prediction",
      description: "Predictions based on birth Nakshatra.",
      endpoint: "/api/daily_nakshatra",
      method: "POST",
      parameters: [...COMMON_BIRTH_PARAMS, { name: "type", type: "string", required: false, description: "Type (prediction/next/previous)", example: "prediction" }],
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { prediction: {} } } }]
    },
    {
      id: "transits",
      category: "Predictions",
      title: "Transit Reports",
      description: "Daily, weekly, and monthly transit predictions.",
      endpoint: "/api/transits",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { success: true, data: { monthly: {}, weekly: {} } } }]
    },
     {
      id: "life-path-planet-nature",
      category: "Predictions",
      title: "Planet Nature",
      description: "Analysis of planetary nature in the chart.",
      endpoint: "/api/life-path/planet_nature",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: {} } }]
    },

    // --- Numerology ---
    {
      id: "numerology",
      category: "Numerology",
      title: "Vedic Numerology",
      description: "Comprehensive numerology report including favorite time, vastu, and mantras.",
      endpoint: "/api/numerology",
      method: "POST",
      parameters: [...COMMON_BIRTH_PARAMS.slice(0, 3), COMMON_NAME_PARAM], // day, month, year, name
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { numero_table: {} } } }]
    },
    {
      id: "western-numerology",
      category: "Numerology",
      title: "Western Numerology",
      description: "Western numerology calculations like Life Path, Personality, and Soul Urge numbers.",
      endpoint: "/api/western_numerology",
      method: "POST",
      parameters: [...COMMON_BIRTH_PARAMS.slice(0, 3), COMMON_NAME_PARAM],
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { success: true, data: { lifepath_number: {} } } }]
    },

    // --- Match Making ---
    {
      id: "compatibility",
      category: "Match Making",
      title: "Vedic Compatibility",
      description: "Ashtakoot Guna Milan for marriage matching.",
      endpoint: "/api/compatibility",
      method: "POST",
      parameters: [
        ...COMMON_BIRTH_PARAMS.map(p => ({ ...p, name: `p_${p.name}`, description: `Primary Person ${p.description}` })),
        ...COMMON_BIRTH_PARAMS.map(p => ({ ...p, name: `s_${p.name}`, description: `Secondary Person ${p.description}` })),
      ],
      responseExamples: [{ status: "Pass", description: "Successful Match", payload: { status: "Pass", data: { total_guna: 28 } } }]
    },
    {
      id: "love-compatibility",
      category: "Match Making",
      title: "Love Compatibility (Western)",
      description: "Western astrology compatibility reports including Synastry and Composite charts.",
      endpoint: "/api/love-compatibility",
      method: "POST",
      parameters: [
        ...COMMON_BIRTH_PARAMS.map(p => ({ ...p, name: `p_${p.name}`, description: `Primary Person ${p.description}` })),
        ...COMMON_BIRTH_PARAMS.map(p => ({ ...p, name: `s_${p.name}`, description: `Secondary Person ${p.description}` })),
      ],
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { success: true, data: { synastry: {} } } }]
    },

    // --- Western Astrology ---
    {
      id: "natal-chart",
      category: "Western Astrology",
      title: "Natal Chart",
      description: "Complete Western Natal Chart including wheel, house cusps, and planetary positions.",
      endpoint: "/api/natal-chart",
      method: "POST",
      parameters: [...COMMON_BIRTH_PARAMS, { name: "house_type", type: "string", required: false, description: "House System (placidus, etc.)", example: "placidus" }],
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { success: true, data: { planets: {}, basic: {} } } }]
    },

    // --- Remedies ---
    {
      id: "remedies",
      category: "Remedies",
      title: "Suggestions & Remedies",
      description: "Get personalized suggestions for gemstones, rudraksha, and pujas.",
      endpoint: "/api/remedies",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { gem_suggestion: {} } } }]
    },

    // --- Person Management ---
    {
      id: "person-list",
      category: "Person Management",
      title: "List Persons",
      description: "List all persons for a specific owner.",
      endpoint: "/api/person/list/{ownerId}",
      method: "GET",
      parameters: [
        { name: "ownerId", type: "string", required: true, description: "Owner ID", example: "user_123" },
        { name: "visitorId", type: "string", required: false, description: "Visitor ID for guests", example: "visitor_abc" }
      ],
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { persons: [] } } }]
    },
    {
      id: "person-add",
      category: "Person Management",
      title: "Add Person",
      description: "Add a new person record.",
      endpoint: "/api/person/add",
      method: "POST",
      parameters: [
        COMMON_NAME_PARAM,
        { name: "gender", type: "string", required: true, description: "Gender (male/female)", example: "male" },
        ...COMMON_BIRTH_PARAMS
      ],
      responseExamples: [{ status: "Pass", description: "Successful Creation", payload: { status: "Pass", message: "Person added successfully" } }]
    },

    // --- Utilities ---
    {
      id: "hindu-calendar",
      category: "Utilities",
      title: "Hindu Calendar",
      description: "Get Panchang and Hindu calendar details for a specific month.",
      endpoint: "/api/calendar/hindu-calender",
      method: "GET",
      parameters: [
        { name: "month", type: "number", required: true, description: "Month", example: "8" },
        { name: "year", type: "number", required: true, description: "Year", example: "2024" },
        { name: "type", type: "string", required: false, description: "Type (current/next/previous)", example: "current" }
      ],
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { panchang: {} } } }]
    },
    {
      id: "person-update",
      category: "Person Management",
      title: "Update Person",
      description: "Update an existing person record.",
      endpoint: "/api/person/update",
      method: "POST",
      parameters: [
        { name: "_id", type: "string", required: true, description: "Person ID", example: "person_123" },
        COMMON_NAME_PARAM,
        ...COMMON_BIRTH_PARAMS
      ],
      responseExamples: [{ status: "Pass", description: "Successful Update", payload: { status: "Pass", message: "Person updated successfully" } }]
    },
    {
      id: "person-delete",
      category: "Person Management",
      title: "Delete Person",
      description: "Delete a person record.",
      endpoint: "/api/person/delete/{ownerId}/{personId}",
      method: "DELETE",
      parameters: [
        { name: "ownerId", type: "string", required: true, description: "Owner ID", example: "user_123" },
        { name: "personId", type: "string", required: true, description: "Person ID", example: "person_456" }
      ],
      responseExamples: [{ status: "Pass", description: "Successful Deletion", payload: { status: "Pass", message: "Person deleted successfully" } }]
    },
    {
      id: "person-get",
      category: "Person Management",
      title: "Get Person",
      description: "Get details of a specific person.",
      endpoint: "/api/person/{ownerId}/{personId}",
      method: "GET",
      parameters: [
        { name: "ownerId", type: "string", required: true, description: "Owner ID", example: "user_123" },
        { name: "personId", type: "string", required: true, description: "Person ID", example: "person_456" }
      ],
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: { person: {} } } }]
    },
    {
      id: "life-path-ascendant",
      category: "Predictions",
      title: "Ascendant Report",
      description: "General report based on Ascendant.",
      endpoint: "/api/life-path/general_ascendant_report",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: {} } }]
    },
    {
      id: "life-path-nakshatra",
      category: "Predictions",
      title: "Nakshatra Report",
      description: "General report based on Nakshatra.",
      endpoint: "/api/life-path/general_nakshatra_report",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { status: "Pass", data: {} } }]
    },
    {
      id: "life-path-predict",
      category: "Predictions",
      title: "Life Path Predictions",
      description: "Detailed life path predictions and time slices.",
      endpoint: "/api/life-path/predict",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { success: true, data: { TimeSlices: [] } } }]
    },
    {
      id: "personality",
      category: "Predictions",
      title: "Personality Report",
      description: "Detailed personality analysis based on birth chart.",
      endpoint: "/api/personality",
      method: "POST",
      parameters: COMMON_BIRTH_PARAMS,
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: { success: true, data: {} } }]
    },
    {
      id: "routes",
      category: "Utilities",
      title: "List All Routes",
      description: "Get a list of all available API routes in the application.",
      endpoint: "/api/routes",
      method: "GET",
      parameters: [],
      responseExamples: [{ status: "Pass", description: "Successful Retrieval", payload: [] }]
    }
  ]
};
