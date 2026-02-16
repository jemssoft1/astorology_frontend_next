import React, { useState, useMemo, useRef, useEffect } from "react";

// ============================================
// TYPES
// ============================================
interface FilterOption {
  key: string;
  label: string;
  category: string;
}

// ============================================
// ALL AVAILABLE FILTERS (House column is NOT here - it's permanent)
// ============================================
const ALL_HOUSE_FILTERS: FilterOption[] = [
  // Basic
  { key: "HouseRasiSign", label: "House Rasi Sign", category: "Basic" },
  { key: "HouseSignName", label: "House Sign Name", category: "Basic" },
  {
    key: "HouseConstellation",
    label: "House Constellation",
    category: "Basic",
  },
  {
    key: "HouseConstellationLord",
    label: "House Constellation Lord",
    category: "Basic",
  },
  { key: "LordOfHouse", label: "Lord Of House", category: "Basic" },
  { key: "HouseLongitude", label: "House Longitude", category: "Basic" },
  {
    key: "HouseBhavaClitSign",
    label: "House Bhava Chalit Sign",
    category: "Basic",
  },
  { key: "ArudhaOfHouse", label: "Arudha Of House", category: "Basic" },

  // Strength
  { key: "HouseStrength", label: "House Strength", category: "Strength" },
  {
    key: "HouseStrengthCategory",
    label: "House Strength Category",
    category: "Strength",
  },
  {
    key: "HouseNatureScore",
    label: "House Nature Score",
    category: "Strength",
  },
  {
    key: "IsHouseStrongInShadbala",
    label: "Is House Strong In Shadbala",
    category: "Strength",
  },
  {
    key: "IsHouseWeakInShadbala",
    label: "Is House Weak In Shadbala",
    category: "Strength",
  },

  // Planets In House
  {
    key: "PlanetsInHouseBasedOnSign",
    label: "Planets In House Based On Sign",
    category: "Planets",
  },
  {
    key: "PlanetsInHouseBasedOnLongitudes",
    label: "Planets In House Based On Longitudes",
    category: "Planets",
  },

  // Aspects
  {
    key: "PlanetsAspectingHouse",
    label: "Planets Aspecting House",
    category: "Aspects",
  },
  {
    key: "BeneficPlanetsAspectingHouse",
    label: "Benefic Planets Aspecting House",
    category: "Aspects",
  },
  {
    key: "PhysicallyHarmfulPlanetsAspectingHouse",
    label: "Physically Harmful Planets Aspecting House",
    category: "Aspects",
  },
  {
    key: "AllPlanetsInBadAspectToHouse",
    label: "All Planets In Bad Aspect To House",
    category: "Aspects",
  },

  // Status (Boolean)
  {
    key: "IsBeneficPlanetAspectHouse",
    label: "Is Benefic Planet Aspect House",
    category: "Status",
  },
  {
    key: "IsBeneficPlanetInHouse",
    label: "Is Benefic Planet In House",
    category: "Status",
  },
  {
    key: "IsHarmfulPlanetAspectingHouse",
    label: "Is Harmful Planet Aspecting House",
    category: "Status",
  },
  {
    key: "IsMaleficPlanetAspectHouse",
    label: "Is Malefic Planet Aspect House",
    category: "Status",
  },
  {
    key: "IsMaleficPlanetInHouse",
    label: "Is Malefic Planet In House",
    category: "Status",
  },
  {
    key: "IsPlanetInBadAspectToHouse",
    label: "Is Planet In Bad Aspect To House",
    category: "Status",
  },

  // Varga (Divisional Charts)
  { key: "HouseHoraD2Sign", label: "House Hora D2 Sign", category: "Varga" },
  {
    key: "HouseDrekkanaD3Sign",
    label: "House Drekkana D3 Sign",
    category: "Varga",
  },
  {
    key: "HouseChaturthamshaD4Sign",
    label: "House Chaturthamsha D4 Sign",
    category: "Varga",
  },
  {
    key: "HouseSaptamshaD7Sign",
    label: "House Saptamsha D7 Sign",
    category: "Varga",
  },
  {
    key: "HouseNavamshaD9Sign",
    label: "House Navamsha D9 Sign",
    category: "Varga",
  },
  {
    key: "HouseDashamshaD10Sign",
    label: "House Dashamsha D10 Sign",
    category: "Varga",
  },
  {
    key: "HouseDwadashamshaD12Sign",
    label: "House Dwadashamsha D12 Sign",
    category: "Varga",
  },
  {
    key: "HouseShodashamshaD16Sign",
    label: "House Shodashamsha D16 Sign",
    category: "Varga",
  },
  {
    key: "HouseVimsamshaD20Sign",
    label: "House Vimshamsha D20 Sign",
    category: "Varga",
  },
  {
    key: "HouseChaturvimsamshaD24Sign",
    label: "House Chaturvimshamsha D24 Sign",
    category: "Varga",
  },
  {
    key: "HouseBhamshaD27Sign",
    label: "House Bhamsha D27 Sign",
    category: "Varga",
  },
  {
    key: "HouseTrimsamshaD30Sign",
    label: "House Trimshamsha D30 Sign",
    category: "Varga",
  },
  {
    key: "HouseKhavedamshaD40Sign",
    label: "House Khavedamsha D40 Sign",
    category: "Varga",
  },
  {
    key: "HouseAkshavedamshaD45Sign",
    label: "House Akshavedamsha D45 Sign",
    category: "Varga",
  },
  {
    key: "HouseShashtyamshaD60Sign",
    label: "House Shashtyamsha D60 Sign",
    category: "Varga",
  },
];

// ============================================
// DEFAULT SELECTED FILTERS
// ============================================
const DEFAULT_HOUSE_FILTERS: string[] = [
  "HouseRasiSign",
  "HouseConstellation",
  "PlanetsInHouseBasedOnSign",
  "LordOfHouse",
  "HouseConstellationLord",
  "PlanetsAspectingHouse",
];

// ============================================
// GET UNIQUE CATEGORIES
// ============================================
const HOUSE_CATEGORIES: string[] = [
  ...new Set(ALL_HOUSE_FILTERS.map((f) => f.category)),
];

// ============================================
// FILTER PRESETS
// ============================================
const HOUSE_FILTER_PRESETS: Record<string, string[]> = {
  basic: [
    "HouseRasiSign",
    "HouseConstellation",
    "LordOfHouse",
    "HouseConstellationLord",
    "PlanetsInHouseBasedOnSign",
    "PlanetsAspectingHouse",
  ],
  strength: [
    "HouseStrength",
    "HouseStrengthCategory",
    "HouseNatureScore",
    "IsHouseStrongInShadbala",
    "IsHouseWeakInShadbala",
  ],
  planets: [
    "PlanetsInHouseBasedOnSign",
    "PlanetsInHouseBasedOnLongitudes",
    "PlanetsAspectingHouse",
    "BeneficPlanetsAspectingHouse",
  ],
  status: ALL_HOUSE_FILTERS.filter((f) => f.key.startsWith("Is")).map(
    (f) => f.key,
  ),
  varga: ALL_HOUSE_FILTERS.filter((f) => f.category === "Varga").map(
    (f) => f.key,
  ),
  aspects: ALL_HOUSE_FILTERS.filter((f) => f.category === "Aspects").map(
    (f) => f.key,
  ),
};

// ============================================
// HOUSE COLORS (1-12)
// ============================================
const HOUSE_COLORS: string[] = [
  "bg-red-500", // 1
  "bg-orange-500", // 2
  "bg-amber-500", // 3
  "bg-yellow-500", // 4
  "bg-lime-500", // 5
  "bg-green-500", // 6
  "bg-emerald-500", // 7
  "bg-teal-500", // 8
  "bg-cyan-500", // 9
  "bg-blue-500", // 10
  "bg-indigo-500", // 11
  "bg-purple-500", // 12
];

// ============================================
// HELPER FUNCTIONS
// ============================================
const getZodiacName = (name: any): string => {
  if (!name) return "-";
  if (typeof name === "string") return name;
  if (typeof name === "object" && name.Name) return name.Name;
  return String(name);
};

const getPlanetName = (name: any): string => {
  if (!name) return "-";
  if (typeof name === "string") return name;
  if (typeof name === "object" && name.Name) return name.Name;
  return String(name);
};

const getConstellationDisplay = (constellation: any): string => {
  if (!constellation) return "-";
  if (typeof constellation === "string") return constellation;
  if (typeof constellation === "object") {
    return constellation.Name || constellation.ConstellationName || "-";
  }
  return String(constellation);
};

const formatHouseValue = (value: any, key: string): React.ReactNode => {
  if (value === null || value === undefined) return "-";

  // Handle boolean values
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

  // Handle arrays (planets list)
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-gray-400 italic">Empty</span>;
    }
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
              className="inline-block px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded font-medium"
            >
              {name}
            </span>
          );
        })}
      </div>
    );
  }

  // Handle objects with Name property
  if (typeof value === "object" && value !== null) {
    if (value.Name) return value.Name;
    if (value.name) return value.name;
    if (key.includes("Constellation")) {
      return getConstellationDisplay(value);
    }
    if (Object.keys(value).length <= 3) {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    }
    return JSON.stringify(value).slice(0, 50) + "...";
  }

  // Handle numbers
  if (typeof value === "number") {
    return value % 1 === 0 ? value : value.toFixed(2);
  }

  return String(value);
};

// ============================================
// FILTER DROPDOWN COMPONENT
// ============================================
interface HouseFilterDropdownProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

function HouseFilterDropdown({
  selectedFilters,
  onFilterChange,
}: HouseFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] =
    useState<string[]>(HOUSE_CATEGORIES);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
    const categoryFilters = ALL_HOUSE_FILTERS.filter(
      (f) => f.category === category,
    ).map((f) => f.key);
    const newFilters = [...new Set([...selectedFilters, ...categoryFilters])];
    onFilterChange(newFilters);
  };

  const deselectAllInCategory = (category: string) => {
    const categoryFilters = ALL_HOUSE_FILTERS.filter(
      (f) => f.category === category,
    ).map((f) => f.key);
    onFilterChange(selectedFilters.filter((f) => !categoryFilters.includes(f)));
  };

  const filteredFilters = ALL_HOUSE_FILTERS.filter((f) =>
    f.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const groupedFilters = HOUSE_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = filteredFilters.filter((f) => f.category === category);
      return acc;
    },
    {} as Record<string, FilterOption[]>,
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
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
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-teal-600 rounded-full">
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

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-[500px] max-h-[600px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {/* Search Input */}
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
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-gray-500 mr-2">
                Presets:
              </span>
              {Object.entries(HOUSE_FILTER_PRESETS).map(([name, filters]) => (
                <button
                  key={name}
                  onClick={() => onFilterChange(filters)}
                  className="px-2 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded hover:bg-teal-200 capitalize transition-colors"
                >
                  {name}
                </button>
              ))}
              <button
                onClick={() =>
                  onFilterChange(ALL_HOUSE_FILTERS.map((f) => f.key))
                }
                className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              >
                All
              </button>
              <button
                onClick={() => onFilterChange([])}
                className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Filter Categories List */}
          <div className="overflow-y-auto max-h-[400px]">
            {HOUSE_CATEGORIES.map((category) => {
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
                  {/* Category Header */}
                  <div
                    className="flex items-center justify-between px-4 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
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
                        className="px-2 py-0.5 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        All
                      </button>
                      <button
                        onClick={() => deselectAllInCategory(category)}
                        className="px-2 py-0.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        None
                      </button>
                    </div>
                  </div>

                  {/* Category Items */}
                  {isExpanded && (
                    <div className="px-4 py-2 grid grid-cols-1 gap-1">
                      {categoryFilters.map((filter) => (
                        <label
                          key={filter.key}
                          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(filter.key)}
                            onChange={() => toggleFilter(filter.key)}
                            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
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

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {selectedFilters.length} columns selected
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-1.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN HOUSE DATA TABLE COMPONENT
// ============================================
type HouseValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, any>
  | any[];

interface HouseData {
  [key: string]: HouseValue;
}

interface HouseDataTableProps {
  data: HouseData[];
}

function HouseDataTable({ data }: HouseDataTableProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    DEFAULT_HOUSE_FILTERS,
  );

  const allHouseData = data;

  // If no data, show empty state
  if (!Array.isArray(allHouseData) || allHouseData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <p className="text-lg font-medium">No house data available</p>
      </div>
    );
  }

  // Extract house data from nested format like {House1: {...}}
  const getHouseData = (houseObj: any, index: number) => {
    const houseKey = `House${index + 1}`;
    return houseObj[houseKey] || houseObj;
  };

  // Get columns to show based on selected filters
  const columnsToShow = useMemo(() => {
    return ALL_HOUSE_FILTERS.filter((f) => selectedFilters.includes(f.key));
  }, [selectedFilters]);

  return (
    <div className="space-y-4">
      {/* ============================================ */}
      {/* FILTER CONTROLS */}
      {/* ============================================ */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Dropdown */}
        <HouseFilterDropdown
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
        />

        {/* Permanent House Column Indicator (LOCKED) */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg">
          <svg
            className="w-4 h-4 text-teal-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium text-teal-700">
            House (Fixed)
          </span>
        </div>

        {/* Selected Columns Count */}
        {selectedFilters.length > 0 && (
          <span className="text-sm text-gray-500">
            + {selectedFilters.length} columns
          </span>
        )}
      </div>

      {/* ============================================ */}
      {/* DATA TABLE */}
      {/* ============================================ */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          {/* Table Header */}
          <thead>
            <tr className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
              {/* ============================================ */}
              {/* PERMANENT HOUSE COLUMN HEADER (LOCKED) */}
              {/* ============================================ */}
              <th className="px-4 py-3 text-left text-sm font-semibold sticky left-0 bg-gradient-to-r from-teal-700 to-teal-600 z-10 border-r border-teal-500 min-w-[140px]">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  House
                </div>
              </th>

              {/* Dynamic Column Headers */}
              {columnsToShow.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-sm font-semibold min-w-[120px] max-w-[200px]"
                >
                  <div className="break-words leading-tight">
                    <span>{column.label}</span>
                    <span className="block text-[10px] font-normal text-teal-200 normal-case mt-0.5">
                      {column.category}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {allHouseData.map((houseObj: any, i: number) => {
              const house = getHouseData(houseObj, i);
              const houseNumber = i + 1;
              const houseColor = HOUSE_COLORS[i % 12];
              const rowBg = i % 2 === 0 ? "bg-white" : "bg-gray-50";

              return (
                <tr
                  key={i}
                  className={`${rowBg} hover:bg-teal-50 transition-colors`}
                >
                  {/* ============================================ */}
                  {/* PERMANENT HOUSE COLUMN CELL (LOCKED) */}
                  {/* ============================================ */}
                  <td
                    className={`px-4 py-3 font-medium text-gray-900 sticky left-0 ${rowBg} z-10 whitespace-nowrap border-r border-gray-100`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-full ${houseColor} text-white font-bold text-sm shadow-sm`}
                      >
                        {houseNumber}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-semibold">
                          House {houseNumber}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getZodiacName(
                            house.HouseRasiSign?.Name || house.HouseSignName,
                          )}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Dynamic Column Cells */}
                  {columnsToShow.map((column) => (
                    <td
                      key={column.key}
                      className="px-1 py-1 text-sm text-gray-700"
                    >
                      {formatHouseValue(house[column.key], column.key)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ============================================ */}
      {/* EMPTY COLUMNS MESSAGE */}
      {/* ============================================ */}
      {selectedFilters.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm bg-gray-50 rounded-lg border border-gray-200">
          <svg
            className="mx-auto h-8 w-8 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <p>Select columns from the dropdown to view more house data</p>
        </div>
      )}
    </div>
  );
}

export default HouseDataTable;
