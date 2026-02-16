import React, { useState, useMemo, useRef, useEffect } from "react";

// All available filters (Planet column removed - it's permanent)
const ALL_FILTERS = [
  // Basic
  {
    key: "HousePlanetOccupiesBasedOnSign",
    label: "House Planet Occupies Based On Sign",
    category: "Basic",
  },
  {
    key: "HousesOwnedByPlanet",
    label: "Houses Owned By Planet",
    category: "Basic",
  },
  {
    key: "PlanetConstellation",
    label: "Planet Constellation",
    category: "Basic",
  },
  {
    key: "PlanetLordOfConstellation",
    label: "Planet Lord Of Constellation",
    category: "Basic",
  },
  {
    key: "PlanetLordOfZodiacSign",
    label: "Planet Lord Of Zodiac Sign",
    category: "Basic",
  },
  { key: "PlanetRasiD1Sign", label: "Planet Rasi D1 Sign", category: "Basic" },

  // Conjunction & Aspects
  {
    key: "AllBeneficPlanetsInGoodConjunctionWith",
    label: "All Benefic Planets In Good Conjunction With",
    category: "Conjunction",
  },
  {
    key: "AllHarmfulPlanetsInBadConjunctionWith",
    label: "All Harmful Planets In Bad Conjunction With",
    category: "Conjunction",
  },
  {
    key: "AllMaleficPlanetsAspecting",
    label: "All Malefic Planets Aspecting",
    category: "Aspects",
  },
  {
    key: "AllPhysicallyHarmfulPlanetsAspecting",
    label: "All Physically Harmful Planets Aspecting",
    category: "Aspects",
  },
  {
    key: "AllPhysicallyHarmfulPlanetsConjunctWith",
    label: "All Physically Harmful Planets Conjunct With",
    category: "Conjunction",
  },
  {
    key: "AllPlanetsInBadAspectToPlanet",
    label: "All Planets In Bad Aspect To Planet",
    category: "Aspects",
  },
  {
    key: "AllPlanetsInEnemyConjunctionWith",
    label: "All Planets In Enemy Conjunction With",
    category: "Conjunction",
  },
  {
    key: "AllPlanetsInFriendConjunctionWith",
    label: "All Planets In Friend Conjunction With",
    category: "Conjunction",
  },
  {
    key: "AspectReceivedByDispositor",
    label: "Aspect Received By Dispositor",
    category: "Aspects",
  },
  {
    key: "BeneficPlanetsAspectingPlanet",
    label: "Benefic Planets Aspecting Planet",
    category: "Aspects",
  },
  {
    key: "MaleficPlanetsAspectingPlanet",
    label: "Malefic Planets Aspecting Planet",
    category: "Aspects",
  },
  {
    key: "PlanetsAspectingPlanet",
    label: "Planets Aspecting Planet",
    category: "Aspects",
  },
  { key: "PlanetsInAspect", label: "Planets In Aspect", category: "Aspects" },
  {
    key: "PlanetsInConjunction",
    label: "Planets In Conjunction",
    category: "Conjunction",
  },
  { key: "HousesInAspect", label: "Houses In Aspect", category: "Aspects" },
  {
    key: "SignsPlanetIsAspecting",
    label: "Signs Planet Is Aspecting",
    category: "Aspects",
  },

  // Dispositor
  {
    key: "DispositorConjunctWith",
    label: "Dispositor Conjunct With",
    category: "Dispositor",
  },
  {
    key: "DispositorFromLagna",
    label: "Dispositor From Lagna",
    category: "Dispositor",
  },
  {
    key: "DispositorFromMoon",
    label: "Dispositor From Moon",
    category: "Dispositor",
  },
  {
    key: "DispositorFromOwnHouses",
    label: "Dispositor From Own Houses",
    category: "Dispositor",
  },

  // House & Position
  {
    key: "HousePlanetOccupiesBasedOnLongitudes",
    label: "House Planet Occupies Based On Longitudes",
    category: "Position",
  },

  // Planet Status (Boolean)
  {
    key: "IsPlanetAfflicted",
    label: "Is Planet Afflicted",
    category: "Status",
  },
  {
    key: "IsPlanetAspectedByBeneficPlanets",
    label: "Is Planet Aspected By Benefic Planets",
    category: "Status",
  },
  {
    key: "IsPlanetAspectedByEnemyPlanets",
    label: "Is Planet Aspected By Enemy Planets",
    category: "Status",
  },
  {
    key: "IsPlanetAspectedByFriendPlanets",
    label: "Is Planet Aspected By Friend Planets",
    category: "Status",
  },
  {
    key: "IsPlanetAspectedByMaleficPlanets",
    label: "Is Planet Aspected By Malefic Planets",
    category: "Status",
  },
  {
    key: "IsPlanetAspectedByPhysicallyHarmfulPlanets",
    label: "Is Planet Aspected By Physically Harmful Planets",
    category: "Status",
  },
  { key: "IsPlanetBenefic", label: "Is Planet Benefic", category: "Status" },
  {
    key: "IsPlanetBeneficLordForLagna",
    label: "Is Planet Benefic Lord For Lagna",
    category: "Status",
  },
  {
    key: "IsPlanetBeneficToLagna",
    label: "Is Planet Benefic To Lagna",
    category: "Status",
  },
  { key: "IsPlanetCombust", label: "Is Planet Combust", category: "Status" },
  {
    key: "IsPlanetConjunctWithBeneficPlanets",
    label: "Is Planet Conjunct With Benefic Planets",
    category: "Status",
  },
  {
    key: "IsPlanetConjunctWithEnemyPlanets",
    label: "Is Planet Conjunct With Enemy Planets",
    category: "Status",
  },
  {
    key: "IsPlanetConjunctWithFriendPlanets",
    label: "Is Planet Conjunct With Friend Planets",
    category: "Status",
  },
  {
    key: "IsPlanetConjunctWithMaleficPlanets",
    label: "Is Planet Conjunct With Malefic Planets",
    category: "Status",
  },
  {
    key: "IsPlanetConjunctWithPhysicallyHarmfulPlanets",
    label: "Is Planet Conjunct With Physically Harmful Planets",
    category: "Status",
  },
  {
    key: "IsPlanetDebilitated",
    label: "Is Planet Debilitated",
    category: "Status",
  },
  { key: "IsPlanetExalted", label: "Is Planet Exalted", category: "Status" },
  {
    key: "IsPlanetExaltedDegree",
    label: "Is Planet Exalted Degree",
    category: "Status",
  },
  {
    key: "IsPlanetExaltedSign",
    label: "Is Planet Exalted Sign",
    category: "Status",
  },
  {
    key: "IsPlanetFortified",
    label: "Is Planet Fortified",
    category: "Status",
  },
  {
    key: "IsPlanetFunctionalMalefic",
    label: "Is Planet Functional Malefic",
    category: "Status",
  },
  {
    key: "IsPlanetInEnemyHouse",
    label: "Is Planet In Enemy House",
    category: "Status",
  },
  {
    key: "IsPlanetInEnemySign",
    label: "Is Planet In Enemy Sign",
    category: "Status",
  },
  {
    key: "IsPlanetInFriendHouse",
    label: "Is Planet In Friend House",
    category: "Status",
  },
  {
    key: "IsPlanetInFriendlyDrekkana",
    label: "Is Planet In Friendly Drekkana",
    category: "Status",
  },
  {
    key: "IsPlanetInFriendSign",
    label: "Is Planet In Friend Sign",
    category: "Status",
  },
  {
    key: "IsPlanetInGarvitaAvasta",
    label: "Is Planet In Garvita Avasta",
    category: "Avasta",
  },
  {
    key: "IsPlanetInGopuraAmsha",
    label: "Is Planet In Gopura Amsha",
    category: "Status",
  },
  { key: "IsPlanetInKendra", label: "Is Planet In Kendra", category: "Status" },
  {
    key: "IsPlanetInKshobhitaAvasta",
    label: "Is Planet In Kshobhita Avasta",
    category: "Avasta",
  },
  {
    key: "IsPlanetInKshuditaAvasta",
    label: "Is Planet In Kshudita Avasta",
    category: "Avasta",
  },
  {
    key: "IsPlanetInLajjitaAvasta",
    label: "Is Planet In Lajjita Avasta",
    category: "Avasta",
  },
  {
    key: "IsPlanetInMoolatrikona",
    label: "Is Planet In Moolatrikona",
    category: "Status",
  },
  {
    key: "IsPlanetInMuditaAvasta",
    label: "Is Planet In Mudita Avasta",
    category: "Avasta",
  },
  {
    key: "IsPlanetInOwnHouse",
    label: "Is Planet In Own House",
    category: "Status",
  },
  {
    key: "IsPlanetInOwnSign",
    label: "Is Planet In Own Sign",
    category: "Status",
  },
  {
    key: "IsPlanetInTrashitaAvasta",
    label: "Is Planet In Trashita Avasta",
    category: "Avasta",
  },
  {
    key: "IsPlanetInTrikona",
    label: "Is Planet In Trikona",
    category: "Status",
  },
  {
    key: "IsPlanetInUpachaya",
    label: "Is Planet In Upachaya",
    category: "Status",
  },
  {
    key: "IsPlanetInWaterySign",
    label: "Is Planet In Watery Sign",
    category: "Status",
  },
  {
    key: "IsPlanetMaleficForLagna",
    label: "Is Planet Malefic For Lagna",
    category: "Status",
  },
  {
    key: "IsPlanetMaleficLordForLagna",
    label: "Is Planet Malefic Lord For Lagna",
    category: "Status",
  },
  {
    key: "IsPlanetMaleficToLagna",
    label: "Is Planet Malefic To Lagna",
    category: "Status",
  },
  {
    key: "IsPlanetMarakaToLagna",
    label: "Is Planet Maraka To Lagna",
    category: "Status",
  },
  {
    key: "IsPlanetNeutralForLagna",
    label: "Is Planet Neutral For Lagna",
    category: "Status",
  },
  {
    key: "IsPlanetPhysicallyHarmful",
    label: "Is Planet Physically Harmful",
    category: "Status",
  },
  {
    key: "IsPlanetReceivingBadAspects",
    label: "Is Planet Receiving Bad Aspects",
    category: "Status",
  },
  {
    key: "IsPlanetReceivingHarmfulConjunctions",
    label: "Is Planet Receiving Harmful Conjunctions",
    category: "Status",
  },
  {
    key: "IsPlanetRetrograde",
    label: "Is Planet Retrograde",
    category: "Status",
  },
  {
    key: "IsPlanetStrongInShadbala",
    label: "Is Planet Strong In Shadbala",
    category: "Status",
  },
  {
    key: "IsPlanetVargottama",
    label: "Is Planet Vargottama",
    category: "Status",
  },
  {
    key: "IsPlanetYogakarakaToLagna",
    label: "Is Planet Yogakaraka To Lagna",
    category: "Status",
  },

  // Bala (Strength)
  { key: "PlanetAbdaBala", label: "Planet Abda Bala", category: "Bala" },
  { key: "PlanetAyanaBala", label: "Planet Ayana Bala", category: "Bala" },
  { key: "PlanetDigBala", label: "Planet Dig Bala", category: "Bala" },
  {
    key: "PlanetDrekkanaBala",
    label: "Planet Drekkana Bala",
    category: "Bala",
  },
  { key: "PlanetDrikBala", label: "Planet Drik Bala", category: "Bala" },
  { key: "PlanetHoraBala", label: "Planet Hora Bala", category: "Bala" },
  { key: "PlanetKalaBala", label: "Planet Kala Bala", category: "Bala" },
  { key: "PlanetKendraBala", label: "Planet Kendra Bala", category: "Bala" },
  { key: "PlanetMasaBala", label: "Planet Masa Bala", category: "Bala" },
  {
    key: "PlanetNaisargikaBala",
    label: "Planet Naisargika Bala",
    category: "Bala",
  },
  {
    key: "PlanetNathonnathaBala",
    label: "Planet Nathonnatha Bala",
    category: "Bala",
  },
  { key: "PlanetOchchaBala", label: "Planet Ochcha Bala", category: "Bala" },
  {
    key: "PlanetOjayugmarasyamsaBala",
    label: "Planet Ojayugmarasyamsa Bala",
    category: "Bala",
  },
  { key: "PlanetPakshaBala", label: "Planet Paksha Bala", category: "Bala" },
  {
    key: "PlanetSaptavargajaBala",
    label: "Planet Saptavargaja Bala",
    category: "Bala",
  },
  {
    key: "PlanetShadbalaPinda",
    label: "Planet Shadbala Pinda",
    category: "Bala",
  },
  { key: "PlanetSthanaBala", label: "Planet Sthana Bala", category: "Bala" },
  {
    key: "PlanetTribhagaBala",
    label: "Planet Tribhaga Bala",
    category: "Bala",
  },
  { key: "PlanetVaraBala", label: "Planet Vara Bala", category: "Bala" },

  // Varga (Divisional Charts)
  {
    key: "PlanetAkshavedamshaD45Sign",
    label: "Planet Akshavedamsha D45 Sign",
    category: "Varga",
  },
  {
    key: "PlanetBhamshaD27Sign",
    label: "Planet Bhamsha D27 Sign",
    category: "Varga",
  },
  {
    key: "PlanetChaturthamshaD4Sign",
    label: "Planet Chaturthamsha D4 Sign",
    category: "Varga",
  },
  {
    key: "PlanetChaturvimsamshaD24Sign",
    label: "Planet Chaturvimshamsha D24 Sign",
    category: "Varga",
  },
  {
    key: "PlanetDashamshaD10Sign",
    label: "Planet Dashamsha D10 Sign",
    category: "Varga",
  },
  {
    key: "PlanetDrekkanaD3Sign",
    label: "Planet Drekkana D3 Sign",
    category: "Varga",
  },
  {
    key: "PlanetDwadashamshaD12Sign",
    label: "Planet Dwadashamsha D12 Sign",
    category: "Varga",
  },
  {
    key: "PlanetDwadashamshaSignOLD",
    label: "Planet Dwadashamsha Sign OLD",
    category: "Varga",
  },
  {
    key: "PlanetHoraD2Signs",
    label: "Planet Hora D2 Signs",
    category: "Varga",
  },
  {
    key: "PlanetKhavedamshaD40Sign",
    label: "Planet Khavedamsha D40 Sign",
    category: "Varga",
  },
  {
    key: "PlanetNavamshaD9Sign",
    label: "Planet Navamsha D9 Sign",
    category: "Varga",
  },
  {
    key: "PlanetSaptamshaD7Sign",
    label: "Planet Saptamsha D7 Sign",
    category: "Varga",
  },
  {
    key: "PlanetSaptamshaSignOLD",
    label: "Planet Saptamsha Sign OLD",
    category: "Varga",
  },
  {
    key: "PlanetShashtyamshaD60Sign",
    label: "Planet Shashtyamsha D60 Sign",
    category: "Varga",
  },
  {
    key: "PlanetShodashamshaD16Sign",
    label: "Planet Shodashamsha D16 Sign",
    category: "Varga",
  },
  {
    key: "PlanetTrimsamshaD30Sign",
    label: "Planet Trimshamsha D30 Sign",
    category: "Varga",
  },
  {
    key: "PlanetVimsamshaD20Sign",
    label: "Planet Vimshamsha D20 Sign",
    category: "Varga",
  },

  // Technical
  { key: "PlanetAvasta", label: "Planet Avasta", category: "Technical" },
  {
    key: "PlanetDasaEffectsBasedOnIshtaKashta",
    label: "Planet Dasa Effects Based On Ishta Kashta",
    category: "Technical",
  },
  {
    key: "PlanetDeclination",
    label: "Planet Declination",
    category: "Technical",
  },
  {
    key: "PlanetEphemerisLongitude",
    label: "Planet Ephemeris Longitude",
    category: "Technical",
  },
  {
    key: "PlanetIshtaKashtaScoreDegree",
    label: "Planet Ishta Kashta Score Degree",
    category: "Technical",
  },
  {
    key: "PlanetIshtaScore",
    label: "Planet Ishta Score",
    category: "Technical",
  },
  {
    key: "PlanetKashtaScore",
    label: "Planet Kashta Score",
    category: "Technical",
  },
  {
    key: "PlanetMotionName",
    label: "Planet Motion Name",
    category: "Technical",
  },
  {
    key: "PlanetNatureScore",
    label: "Planet Nature Score",
    category: "Technical",
  },
  {
    key: "PlanetNirayanaLongitude",
    label: "Planet Nirayana Longitude",
    category: "Technical",
  },
  {
    key: "PlanetOwnAshtakvargaBindu",
    label: "Planet Own Ashtakvarga Bindu",
    category: "Technical",
  },
  {
    key: "PlanetPowerPercentage",
    label: "Planet Power Percentage",
    category: "Technical",
  },
  {
    key: "PlanetSayanaLatitude",
    label: "Planet Sayana Latitude",
    category: "Technical",
  },
  {
    key: "PlanetSayanaLongitude",
    label: "Planet Sayana Longitude",
    category: "Technical",
  },
  { key: "PlanetSpeed", label: "Planet Speed", category: "Technical" },
  { key: "PlanetStrength", label: "Planet Strength", category: "Technical" },
  {
    key: "PlanetTemporaryFriendList",
    label: "Planet Temporary Friend List",
    category: "Technical",
  },
  {
    key: "PlanetZodiacSignBasedOnHouseLongitudes",
    label: "Planet Zodiac Sign Based On House Longitudes",
    category: "Technical",
  },
  {
    key: "ResidentialStrength",
    label: "Residential Strength",
    category: "Technical",
  },
  { key: "SwissEphemeris", label: "Swiss Ephemeris", category: "Technical" },
];

// Default filters to show
const DEFAULT_SELECTED_FILTERS = [
  "PlanetRasiD1Sign",
  "PlanetConstellation",
  "HousePlanetOccupiesBasedOnSign",
  "HousesOwnedByPlanet",
  "PlanetLordOfZodiacSign",
  "PlanetLordOfConstellation",
];

// Get unique categories
const CATEGORIES = [...new Set(ALL_FILTERS.map((f) => f.category))];

// Filter preset options
const FILTER_PRESETS = {
  basic: [
    "PlanetRasiD1Sign",
    "PlanetConstellation",
    "HousePlanetOccupiesBasedOnSign",
    "HousesOwnedByPlanet",
    "PlanetLordOfZodiacSign",
    "PlanetLordOfConstellation",
  ],
  strength: [
    "PlanetShadbalaPinda",
    "PlanetSthanaBala",
    "PlanetDigBala",
    "PlanetKalaBala",
    "PlanetDrikBala",
    "PlanetNaisargikaBala",
    "PlanetPowerPercentage",
  ],
  status: ALL_FILTERS.filter((f) => f.key.startsWith("IsPlanet")).map(
    (f) => f.key,
  ),
  varga: ALL_FILTERS.filter((f) => f.category === "Varga").map((f) => f.key),
  aspects: ALL_FILTERS.filter((f) => f.category === "Aspects").map(
    (f) => f.key,
  ),
  conjunction: ALL_FILTERS.filter((f) => f.category === "Conjunction").map(
    (f) => f.key,
  ),
};

// Multi-select dropdown component
function FilterDropdown({
  selectedFilters,
  onFilterChange,
}: {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] =
    useState<string[]>(CATEGORIES);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFilter = (key: string) => {
    if (selectedFilters.includes(key)) {
      onFilterChange(selectedFilters.filter((f) => f !== key));
    } else {
      onFilterChange([...selectedFilters, key]);
    }
  };

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const selectAllInCategory = (category: string) => {
    const categoryFilters = ALL_FILTERS.filter(
      (f) => f.category === category,
    ).map((f) => f.key);
    const newFilters = [...new Set([...selectedFilters, ...categoryFilters])];
    onFilterChange(newFilters);
  };

  const deselectAllInCategory = (category: string) => {
    const categoryFilters = ALL_FILTERS.filter(
      (f) => f.category === category,
    ).map((f) => f.key);
    onFilterChange(selectedFilters.filter((f) => !categoryFilters.includes(f)));
  };

  const filteredFilters = ALL_FILTERS.filter((f) =>
    f.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const groupedFilters = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = filteredFilters.filter((f) => f.category === category);
      return acc;
    },
    {} as Record<string, typeof ALL_FILTERS>,
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="font-medium text-gray-700">Select Columns</span>
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-purple-600 rounded-full">
          {selectedFilters.length}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-[500px] max-h-[600px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search filters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-gray-500 mr-2">
                Presets:
              </span>
              {Object.entries(FILTER_PRESETS).map(([name, filters]) => (
                <button
                  key={name}
                  onClick={() => onFilterChange(filters)}
                  className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded hover:bg-purple-200 capitalize"
                >
                  {name}
                </button>
              ))}
              <button
                onClick={() => onFilterChange(ALL_FILTERS.map((f) => f.key))}
                className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                All
              </button>
              <button
                onClick={() => onFilterChange([])}
                className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Filter List */}
          <div className="overflow-y-auto max-h-[400px]">
            {CATEGORIES.map((category) => {
              const categoryFilters = groupedFilters[category] || [];
              if (categoryFilters.length === 0) return null;

              const selectedInCategory = categoryFilters.filter((f) =>
                selectedFilters.includes(f.key),
              ).length;
              const isExpanded = expandedCategories.includes(category);

              return (
                <div
                  key={category}
                  className="border-b border-gray-100 last:border-0"
                >
                  <div
                    className="flex items-center justify-between px-4 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="font-medium text-sm text-gray-700">
                        {category}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({selectedInCategory}/{categoryFilters.length})
                      </span>
                    </div>
                    <div
                      className="flex gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => selectAllInCategory(category)}
                        className="px-2 py-0.5 text-xs text-blue-600 hover:bg-blue-50 rounded"
                      >
                        All
                      </button>
                      <button
                        onClick={() => deselectAllInCategory(category)}
                        className="px-2 py-0.5 text-xs text-red-600 hover:bg-red-50 rounded"
                      >
                        None
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 py-2 grid grid-cols-1 gap-1">
                      {categoryFilters.map((filter) => (
                        <label
                          key={filter.key}
                          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(filter.key)}
                            onChange={() => toggleFilter(filter.key)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">
                            {filter.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {selectedFilters.length} columns selected
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
const getConstellationDisplay = (constellation: any): string => {
  if (!constellation) return "-";
  if (typeof constellation === "string") return constellation;
  if (typeof constellation === "object") {
    return constellation.Name || constellation.ConstellationName || "-";
  }
  return String(constellation);
};

const formatValue = (value: any, key: string): React.ReactNode => {
  if (value === null || value === undefined) return "-";

  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ✓ Yes
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        ✗ No
      </span>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "-";
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((v, i) => {
          const name =
            typeof v === "object"
              ? v.Name || v.name || JSON.stringify(v)
              : String(v);
          return (
            <span
              key={i}
              className="inline-block px-2 py-0.5 text-xs bg-gray-100 rounded"
            >
              {name}
            </span>
          );
        })}
      </div>
    );
  }

  if (typeof value === "object" && value !== null) {
    if (value.Name) return value.Name;
    if (value.name) return value.name;
    if (key === "PlanetConstellation") {
      return getConstellationDisplay(value);
    }
    if (Object.keys(value).length <= 3) {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    }
    return JSON.stringify(value).slice(0, 50) + "...";
  }

  if (typeof value === "number") {
    return value % 1 === 0 ? value : value.toFixed(2);
  }

  return String(value);
};

// Planet icon mapping
const PLANET_ICONS: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mars: "♂",
  Mercury: "☿",
  Jupiter: "♃",
  Venus: "♀",
  Saturn: "♄",
  Rahu: "☊",
  Ketu: "☋",
};

const PLANET_COLORS: Record<string, string> = {
  Sun: "bg-orange-500",
  Moon: "bg-gray-300",
  Mars: "bg-red-500",
  Mercury: "bg-green-500",
  Jupiter: "bg-yellow-500",
  Venus: "bg-pink-400",
  Saturn: "bg-blue-800",
  Rahu: "bg-slate-600",
  Ketu: "bg-amber-700",
};

// Main Planet Data Table Component
function PlanetDataTable({ data }: { data: any }) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    DEFAULT_SELECTED_FILTERS,
  );

  const planets = Array.isArray(data) ? data : [];

  if (planets.length === 0) {
    return <p className="text-gray-500">No planet data available</p>;
  }

  const getPlanetInfo = (obj: any) => {
    const key = Object.keys(obj)[0];
    return { name: key, data: obj[key] };
  };

  const columnsToShow = useMemo(() => {
    return ALL_FILTERS.filter((f) => selectedFilters.includes(f.key));
  }, [selectedFilters]);

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
        />

        {/* Permanent Planet column indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
          <svg
            className="w-4 h-4 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-purple-700">
            Planet (Fixed)
          </span>
        </div>

        {/* Selected filters count */}
        {selectedFilters.length > 0 && (
          <span className="text-sm text-gray-500">
            + {selectedFilters.length} columns
          </span>
        )}
      </div>

      {/* Table - Always shows Planet column */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* PERMANENT Planet Column */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gradient-to-r from-purple-50 to-purple-100 z-10 border-r border-purple-200">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Planet
                </div>
              </th>
              {columnsToShow.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] max-w-[180px]"
                >
                  <div className="break-words leading-tight">
                    <span>{column.label}</span>
                    <span className="block text-[10px] font-normal text-gray-400 normal-case">
                      {column.category}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {planets.map((item: any, i: number) => {
              const { name, data: p } = getPlanetInfo(item);
              const planetColor = PLANET_COLORS[name] || "bg-gray-500";
              const planetIcon = PLANET_ICONS[name] || "●";

              return (
                <tr key={i} className="hover:bg-gray-50">
                  {/* PERMANENT Planet Column */}
                  <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white z-10 whitespace-nowrap border-r border-gray-100">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full ${planetColor} flex items-center justify-center text-white text-sm`}
                      >
                        {planetIcon}
                      </span>
                      <span className="font-semibold">{name}</span>
                    </div>
                  </td>
                  {columnsToShow.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-gray-700"
                    >
                      {formatValue(p[column.key], column.key)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state for no columns selected */}
      {selectedFilters.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          <p>
            Select additional columns from the dropdown to view more planet data
          </p>
        </div>
      )}
    </div>
  );
}

export default PlanetDataTable;
