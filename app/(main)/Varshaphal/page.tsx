"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import { useUser } from "@/context/UserContext";

// ============ Types Matching API Response ============

interface ChartSign {
  sign: number;
  sign_name: string;
  planet: string[];
  planet_small: string[];
  planet_degree: string[];
}

interface YearChart {
  year_lord: string;
  varshaphal_date: string;
  chart: ChartSign[];
}

interface MonthChart {
  month_id: number;
  chart: ChartSign[];
}

interface Panchadhikari {
  muntha_lord: string;
  muntha_lord_id: number;
  birth_ascendant_lord: string;
  birth_ascendant_lord_id: number;
  year_ascendant_lord: string;
  year_ascendant_lord_id: number;
  dinratri_lord: string;
  trirashi_lord: string;
}

interface VarshaphalMuntha {
  muntha_sign: string;
  muntha_sign_lord: string;
}

interface VarshaphalDetails {
  varshaphala_year: number;
  age_of_native: number;
  ayanamsha_name: string;
  ayanamsha_degree: number;
  varshaphala_timestamp: number;
  native_birth_date: string;
  varshaphala_date: string;
  panchadhikari: Panchadhikari;
  varshaphala_year_lord: string;
  varshaphala_muntha: VarshaphalMuntha;
}

interface VarshaphalPlanet {
  id: number;
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: string | boolean;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  nakshatra_pad: number;
  house: number;
  is_planet_set: boolean;
  planet_awastha: string;
}

interface MuddaDashaPeriod {
  planet: string;
  duration: number;
  dasha_start: string;
  dasha_end: string;
}

interface PanchavargeyaBala {
  kshetra_bala: number[];
  uccha_bala: number[];
  hadda_bala: number[];
  drekkana_bala: number[];
  navmansha_bala: number[];
  total_bala: number[];
  final_bala: number[];
}

interface HarshaBala {
  sthana_bala: number[];
  ucchaswachetri_bala: number[];
  gender_bala: number[];
  dinratri_bala: number[];
  total_bala: number[];
}

interface VarshaphalYoga {
  yog_name: string;
  yog_description: string;
  is_yog_happening: boolean;
  powerfullness_percentage: string;
  yog_prediction: string;
  planets?: (string | null)[][];
  planets_id?: number[][];
  yog_type?: string[];
}

interface SahamPoint {
  saham_id: number;
  saham_name: string;
  saham_degree: number;
}

interface VarshaphalData {
  year_chart: YearChart | null;
  month_chart: MonthChart[] | null;
  details: VarshaphalDetails | null;
  planets: VarshaphalPlanet[] | null;
  muntha: string | null;
  mudda_dasha: MuddaDashaPeriod[] | null;
  panchavargeeya_bala: PanchavargeyaBala | null;
  harsha_bala: HarshaBala | null;
  yoga: VarshaphalYoga[] | null;
  saham_points: SahamPoint[] | null;
}

interface VarshaphalResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: VarshaphalData;
  meta: {
    varshaphal_year: number;
    age_at_varshaphal: number;
    total_apis: number;
    successful: number;
    failed: number;
    failed_endpoints?: string[];
    success_rate: string;
    timestamp: string;
  };
}

// ============ Constants ============

const PLANET_ORDER = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

const PLANET_CONFIG: Record<
  string,
  { icon: string; color: string; name: string }
> = {
  Sun: { icon: "mdi:white-balance-sunny", color: "orange", name: "Sun" },
  Moon: { icon: "mdi:moon-waning-crescent", color: "blue", name: "Moon" },
  Mars: { icon: "mdi:triangle", color: "red", name: "Mars" },
  Mercury: { icon: "mdi:atom", color: "green", name: "Mercury" },
  Jupiter: { icon: "mdi:circle-outline", color: "yellow", name: "Jupiter" },
  Venus: { icon: "mdi:heart", color: "pink", name: "Venus" },
  Saturn: { icon: "mdi:hexagon-outline", color: "slate", name: "Saturn" },
  Rahu: { icon: "mdi:circle-half-full", color: "purple", name: "Rahu" },
  Ketu: { icon: "mdi:circle-half-full", color: "amber", name: "Ketu" },
  Ascendant: { icon: "mdi:arrow-up-bold", color: "indigo", name: "Ascendant" },
};

const ZODIAC_SIGNS = [
  { id: 1, name: "Aries", icon: "mdi:zodiac-aries" },
  { id: 2, name: "Taurus", icon: "mdi:zodiac-taurus" },
  { id: 3, name: "Gemini", icon: "mdi:zodiac-gemini" },
  { id: 4, name: "Cancer", icon: "mdi:zodiac-cancer" },
  { id: 5, name: "Leo", icon: "mdi:zodiac-leo" },
  { id: 6, name: "Virgo", icon: "mdi:zodiac-virgo" },
  { id: 7, name: "Libra", icon: "mdi:zodiac-libra" },
  { id: 8, name: "Scorpio", icon: "mdi:zodiac-scorpio" },
  { id: 9, name: "Sagittarius", icon: "mdi:zodiac-sagittarius" },
  { id: 10, name: "Capricorn", icon: "mdi:zodiac-capricorn" },
  { id: 11, name: "Aquarius", icon: "mdi:zodiac-aquarius" },
  { id: 12, name: "Pisces", icon: "mdi:zodiac-pisces" },
];

const MONTH_NAMES = [
  "Month 1",
  "Month 2",
  "Month 3",
  "Month 4",
  "Month 5",
  "Month 6",
  "Month 7",
  "Month 8",
  "Month 9",
  "Month 10",
  "Month 11",
  "Month 12",
];

const COLOR_CLASSES: Record<
  string,
  { bg: string; text: string; border: string; light: string }
> = {
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-600",
    border: "border-orange-200",
    light: "bg-orange-50",
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    border: "border-blue-200",
    light: "bg-blue-50",
  },
  red: {
    bg: "bg-red-500",
    text: "text-red-600",
    border: "border-red-200",
    light: "bg-red-50",
  },
  green: {
    bg: "bg-green-500",
    text: "text-green-600",
    border: "border-green-200",
    light: "bg-green-50",
  },
  yellow: {
    bg: "bg-yellow-500",
    text: "text-yellow-600",
    border: "border-yellow-200",
    light: "bg-yellow-50",
  },
  pink: {
    bg: "bg-pink-500",
    text: "text-pink-600",
    border: "border-pink-200",
    light: "bg-pink-50",
  },
  slate: {
    bg: "bg-slate-500",
    text: "text-slate-600",
    border: "border-slate-200",
    light: "bg-slate-50",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-600",
    border: "border-purple-200",
    light: "bg-purple-50",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-600",
    border: "border-amber-200",
    light: "bg-amber-50",
  },
  indigo: {
    bg: "bg-indigo-500",
    text: "text-indigo-600",
    border: "border-indigo-200",
    light: "bg-indigo-50",
  },
};

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "charts", label: "Charts", icon: "mdi:chart-box-outline" },
  { key: "planets", label: "Planets", icon: "mdi:planet" },
  { key: "muntha", label: "Muntha", icon: "mdi:map-marker-star" },
  { key: "mudda_dasha", label: "Mudda Dasha", icon: "mdi:chart-timeline" },
  { key: "strength", label: "Strength", icon: "mdi:arm-flex" },
  { key: "yogas", label: "Yogas", icon: "mdi:yoga" },
  { key: "saham", label: "Saham Points", icon: "mdi:target" },
];

export default function VarshaphalPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [varshaphalData, setVarshaphalData] =
    useState<VarshaphalResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(1);

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setVarshaphalData(null);
  };

  const getBirthDataPayload = (person: Person) => {
    const birthDate = new Date(person.BirthTime);
    let tzone = 0;
    if (person.TimezoneOffset) {
      const [h, m] = person.TimezoneOffset.replace("+", "").split(":");
      const sign = person.TimezoneOffset.startsWith("-") ? -1 : 1;
      tzone = sign * (parseInt(h) + parseInt(m) / 60);
    }

    return {
      day: birthDate.getUTCDate(),
      month: birthDate.getUTCMonth() + 1,
      year: birthDate.getUTCFullYear(),
      hour: birthDate.getUTCHours(),
      min: birthDate.getUTCMinutes(),
      lat: person.Latitude,
      lon: person.Longitude,
      tzone: tzone,
    };
  };

  const availableYears = useMemo(() => {
    if (!selectedPerson) return [];
    const birthYear = new Date(selectedPerson.BirthTime).getFullYear();
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let y = birthYear + 1; y <= currentYear + 5; y++) {
      years.push(y);
    }
    return years;
  }, [selectedPerson]);
  const { user } = useUser();
  const fetchVarshaphal = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...getBirthDataPayload(selectedPerson),
        varshaphal_year: selectedYear,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/varshaphal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result: VarshaphalResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch Varshaphal data");
      }
      setVarshaphalData(result);

      if (result.status === "Partial") {
        Swal.fire({
          icon: "warning",
          title: "Partial Data",
          text: result.message,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get data";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // ============ Helper Functions ============

  const getPlanetConfig = (name: string) => {
    const normalizedName =
      name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return (
      PLANET_CONFIG[normalizedName] || {
        icon: "mdi:circle",
        color: "slate",
        name: name,
      }
    );
  };

  const getColorClass = (color: string) => {
    return COLOR_CLASSES[color] || COLOR_CLASSES.slate;
  };

  const formatDashaDate = (dateStr: string): string => {
    if (!dateStr) return "-";
    // Format: "22-03-2026,22:13:50" -> "22 Mar 2026"
    const [datePart] = dateStr.split(",");
    const [day, month, year] = datePart.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = parseInt(month) - 1;
    return `${day} ${months[monthIndex]} ${year}`;
  };

  const getZodiacIcon = (signName: string): string => {
    const sign = ZODIAC_SIGNS.find(
      (s) => s.name.toLowerCase() === signName?.toLowerCase(),
    );
    return sign?.icon || "mdi:circle";
  };

  const getSignFromDegree = (
    degree: number,
  ): { sign: string; normDegree: number } => {
    const signIndex = Math.floor(degree / 30);
    const normalizedDegree = degree % 30;
    return {
      sign: ZODIAC_SIGNS[signIndex]?.name || "Unknown",
      normDegree: normalizedDegree,
    };
  };

  const isCurrentPeriod = (period: MuddaDashaPeriod): boolean => {
    const now = new Date();
    const parseDate = (str: string) => {
      const [datePart, timePart] = str.split(",");
      const [day, month, year] = datePart.split("-");
      const [hour, min, sec] = timePart.split(":");
      return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(min),
        parseInt(sec),
      );
    };
    const start = parseDate(period.dasha_start);
    const end = parseDate(period.dasha_end);
    return now >= start && now <= end;
  };

  // ============ Components ============

  // Planet Badge Component
  const PlanetBadge = ({
    name,
    size = "md",
  }: {
    name: string;
    size?: "sm" | "md" | "lg";
  }) => {
    const config = getPlanetConfig(name);
    const colorClass = getColorClass(config.color);

    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${colorClass.light} ${colorClass.border} ${colorClass.text} ${sizeClasses[size]}`}
      >
        <Iconify icon={config.icon} className="text-base" />
        {name}
      </span>
    );
  };

  // South Indian Chart Component
  const SouthIndianChart = ({
    chart,
    title,
  }: {
    chart: ChartSign[];
    title?: string;
  }) => {
    // South Indian Chart Layout (fixed signs)
    const positions = [
      { row: 0, col: 0, signId: 12 }, // Pisces
      { row: 0, col: 1, signId: 1 }, // Aries
      { row: 0, col: 2, signId: 2 }, // Taurus
      { row: 0, col: 3, signId: 3 }, // Gemini
      { row: 1, col: 0, signId: 11 }, // Aquarius
      { row: 1, col: 3, signId: 4 }, // Cancer
      { row: 2, col: 0, signId: 10 }, // Capricorn
      { row: 2, col: 3, signId: 5 }, // Leo
      { row: 3, col: 0, signId: 9 }, // Sagittarius
      { row: 3, col: 1, signId: 8 }, // Scorpio
      { row: 3, col: 2, signId: 7 }, // Libra
      { row: 3, col: 3, signId: 6 }, // Virgo
    ];

    const getChartDataForSign = (signId: number) => {
      return chart.find((c) => c.sign === signId);
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {title && (
          <h4 className="text-sm font-semibold text-gray-900 mb-3 text-center">
            {title}
          </h4>
        )}
        <div className="grid grid-cols-4 gap-0.5 bg-gray-300 border border-gray-300">
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3]
              .map((col) => {
                // Center cells are empty
                if ((row === 1 || row === 2) && (col === 1 || col === 2)) {
                  return (
                    <div
                      key={`${row}-${col}`}
                      className="bg-gray-100 aspect-square"
                    />
                  );
                }

                const position = positions.find(
                  (p) => p.row === row && p.col === col,
                );
                if (!position)
                  return (
                    <div
                      key={`${row}-${col}`}
                      className="bg-white aspect-square"
                    />
                  );

                const signData = getChartDataForSign(position.signId);
                const zodiac = ZODIAC_SIGNS.find(
                  (z) => z.id === position.signId,
                );

                return (
                  <div
                    key={`${row}-${col}`}
                    className="bg-white aspect-square p-1 flex flex-col items-center justify-center text-center relative"
                  >
                    <span className="text-[8px] text-gray-400 absolute top-0.5 left-0.5">
                      {zodiac?.name.slice(0, 3)}
                    </span>
                    <div className="flex flex-wrap justify-center gap-0.5 mt-2">
                      {signData?.planet_small.map((p, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium text-gray-700"
                        >
                          {p.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
              .flat(),
          )}
        </div>
      </div>
    );
  };

  // Overview Stats
  const OverviewStats = () => {
    const details = varshaphalData?.data?.details;
    const yearChart = varshaphalData?.data?.year_chart;
    const meta = varshaphalData?.meta;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Varshaphal Year
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {meta?.varshaphal_year || selectedYear}
          </p>
          <p className="text-xs text-gray-400">
            {details?.varshaphala_date?.split(" ")[0]}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Age</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {details?.age_of_native || meta?.age_at_varshaphal || "-"}
          </p>
          <p className="text-xs text-gray-400">years</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Year Lord
          </p>
          {(yearChart?.year_lord || details?.varshaphala_year_lord) && (
            <div className="flex items-center gap-2 mt-1">
              <Iconify
                icon={
                  getPlanetConfig(
                    yearChart?.year_lord ||
                      details?.varshaphala_year_lord ||
                      "",
                  ).icon
                }
                className={`text-xl ${getColorClass(getPlanetConfig(yearChart?.year_lord || details?.varshaphala_year_lord || "").color).text}`}
              />
              <span className="text-lg font-bold text-gray-900">
                {yearChart?.year_lord || details?.varshaphala_year_lord}
              </span>
            </div>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Muntha
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Iconify
              icon={getZodiacIcon(varshaphalData?.data?.muntha || "")}
              className="text-xl text-purple-600"
            />
            <span className="text-lg font-bold text-gray-900">
              {varshaphalData?.data?.muntha || "-"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Panchadhikari Card
  const PanchadhikariCard = () => {
    const panchadhikari = varshaphalData?.data?.details?.panchadhikari;
    if (!panchadhikari) return null;

    const lords = [
      { label: "Muntha Lord", value: panchadhikari.muntha_lord },
      { label: "Birth Asc Lord", value: panchadhikari.birth_ascendant_lord },
      { label: "Year Asc Lord", value: panchadhikari.year_ascendant_lord },
      { label: "Din/Ratri Lord", value: panchadhikari.dinratri_lord },
      { label: "Tri Rashi Lord", value: panchadhikari.trirashi_lord },
    ];

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-indigo-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Iconify
              icon="mdi:account-group"
              className="text-lg text-indigo-600"
            />
            Panchadhikari (Five Lords)
          </h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {lords.map((lord, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {lord.label}
                </p>
                <div className="mt-2">
                  <PlanetBadge name={lord.value} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Charts Section
  const ChartsSection = () => {
    const yearChart = varshaphalData?.data?.year_chart;
    const monthCharts = varshaphalData?.data?.month_chart;

    return (
      <div className="space-y-6">
        {/* Year Chart */}
        {yearChart?.chart && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Annual Chart (Varsha Kundali)
                  </h3>
                  <p className="text-sm text-gray-500">
                    Year Lord: {yearChart.year_lord}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {yearChart.varshaphal_date}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 flex justify-center">
              <div className="w-80">
                <SouthIndianChart chart={yearChart.chart} />
              </div>
            </div>
          </div>
        )}

        {/* Month Charts */}
        {monthCharts && monthCharts.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-purple-50">
              <h3 className="text-base font-semibold text-gray-900">
                Monthly Charts
              </h3>
              <p className="text-sm text-gray-500">
                Select month to view chart
              </p>
            </div>
            <div className="p-5">
              {/* Month Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {monthCharts.map((mc) => (
                  <button
                    key={mc.month_id}
                    onClick={() => setSelectedMonth(mc.month_id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedMonth === mc.month_id
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {MONTH_NAMES[mc.month_id - 1]}
                  </button>
                ))}
              </div>

              {/* Selected Month Chart */}
              <div className="flex justify-center">
                <div className="w-80">
                  <SouthIndianChart
                    chart={
                      monthCharts.find((mc) => mc.month_id === selectedMonth)
                        ?.chart || []
                    }
                    title={MONTH_NAMES[selectedMonth - 1]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Planets Section
  const PlanetsSection = () => {
    const planets = varshaphalData?.data?.planets;

    if (!planets || planets.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Iconify
            icon="mdi:planet"
            className="text-4xl text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500">No planetary data available</p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">
            Planetary Positions - Varshaphal {selectedYear}
          </h3>
          <p className="text-sm text-gray-500">
            Annual chart planetary placements
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Planet
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Sign
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Degree
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  House
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Nakshatra
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Lord
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Awastha
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {planets.map((planet, idx) => {
                const config = getPlanetConfig(planet.name);
                const colorClass = getColorClass(config.color);
                const isRetro =
                  planet.isRetro === "true" || planet.isRetro === true;

                return (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass.light}`}
                        >
                          <Iconify
                            icon={config.icon}
                            className={`text-lg ${colorClass.text}`}
                          />
                        </div>
                        <span className="font-medium text-gray-900">
                          {planet.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon={getZodiacIcon(planet.sign)}
                          className="text-lg text-gray-500"
                        />
                        <span className="text-sm text-gray-700">
                          {planet.sign}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {planet.normDegree?.toFixed(2)}°
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-indigo-600">
                        H{planet.house}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <span className="text-sm text-gray-700">
                          {planet.nakshatra}
                        </span>
                        {planet.nakshatra_pad && (
                          <span className="text-xs text-gray-500 ml-1">
                            (Pada {planet.nakshatra_pad})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {planet.nakshatraLord}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          planet.planet_awastha === "Yuva"
                            ? "bg-green-100 text-green-700"
                            : planet.planet_awastha === "Bala"
                              ? "bg-blue-100 text-blue-700"
                              : planet.planet_awastha === "Vridha"
                                ? "bg-yellow-100 text-yellow-700"
                                : planet.planet_awastha === "Mrit"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {planet.planet_awastha}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        {isRetro && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            R
                          </span>
                        )}
                        {planet.is_planet_set && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Set
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Muntha Section
  const MunthaSection = () => {
    const muntha = varshaphalData?.data?.muntha;
    const details = varshaphalData?.data?.details;
    const panchadhikari = details?.panchadhikari;

    if (!muntha) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Iconify
            icon="mdi:map-marker-star"
            className="text-4xl text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500">No Muntha data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white border border-purple-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-100 bg-purple-50">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Iconify
                icon="mdi:map-marker-star"
                className="text-lg text-purple-600"
              />
              Muntha Analysis
            </h3>
            <p className="text-sm text-gray-500">
              Annual progression point in the chart
            </p>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Muntha Sign */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Muntha Sign
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <Iconify
                      icon={getZodiacIcon(muntha)}
                      className="text-2xl text-purple-600"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{muntha}</p>
                  </div>
                </div>
              </div>

              {/* Muntha Lord */}
              {panchadhikari?.muntha_lord && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Muntha Lord
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClass(getPlanetConfig(panchadhikari.muntha_lord).color).light}`}
                    >
                      <Iconify
                        icon={getPlanetConfig(panchadhikari.muntha_lord).icon}
                        className={`text-2xl ${getColorClass(getPlanetConfig(panchadhikari.muntha_lord).color).text}`}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {panchadhikari.muntha_lord}
                      </p>
                      <p className="text-xs text-gray-500">Lord of Muntha</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Year Lord */}
              {details?.varshaphala_year_lord && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Year Lord (Varshesha)
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClass(getPlanetConfig(details.varshaphala_year_lord).color).light}`}
                    >
                      <Iconify
                        icon={
                          getPlanetConfig(details.varshaphala_year_lord).icon
                        }
                        className={`text-2xl ${getColorClass(getPlanetConfig(details.varshaphala_year_lord).color).text}`}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {details.varshaphala_year_lord}
                      </p>
                      <p className="text-xs text-gray-500">Governs this year</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panchadhikari */}
        <PanchadhikariCard />
      </div>
    );
  };

  // Mudda Dasha Section
  const MuddaDashaSection = () => {
    const muddaDasha = varshaphalData?.data?.mudda_dasha;

    if (!muddaDasha || muddaDasha.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Iconify
            icon="mdi:chart-timeline"
            className="text-4xl text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500">No Mudda Dasha data available</p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">
            Mudda Dasha Periods
          </h3>
          <p className="text-sm text-gray-500">
            Planetary periods for the year {selectedYear}
          </p>
        </div>

        <div className="p-5">
          <div className="space-y-3">
            {muddaDasha.map((period, idx) => {
              const config = getPlanetConfig(period.planet);
              const colorClass = getColorClass(config.color);
              const isCurrent = isCurrentPeriod(period);

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border transition-all ${
                    isCurrent
                      ? `${colorClass.light} ${colorClass.border} border-2`
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${isCurrent ? "bg-white" : colorClass.light}`}
                      >
                        <Iconify
                          icon={config.icon}
                          className={`text-xl ${colorClass.text}`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {period.planet}
                          </span>
                          {isCurrent && (
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {period.duration} days
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-700">
                        {formatDashaDate(period.dasha_start)}
                      </p>
                      <p className="text-xs text-gray-500">
                        to {formatDashaDate(period.dasha_end)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Strength Section
  const StrengthSection = () => {
    const panchaBala = varshaphalData?.data?.panchavargeeya_bala;
    const harshaBala = varshaphalData?.data?.harsha_bala;

    if (!panchaBala && !harshaBala) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Iconify
            icon="mdi:arm-flex"
            className="text-4xl text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500">No strength data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Panchavargeeya Bala */}
        {panchaBala && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-green-50">
              <h3 className="text-base font-semibold text-gray-900">
                Panchavargeeya Bala
              </h3>
              <p className="text-sm text-gray-500">
                Five-fold divisional strength
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Planet
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Kshetra
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Uccha
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Hadda
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Drekkana
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Navamsa
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Final
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {PLANET_ORDER.map((planet, idx) => {
                    const config = getPlanetConfig(planet);
                    const colorClass = getColorClass(config.color);

                    return (
                      <tr
                        key={planet}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Iconify
                              icon={config.icon}
                              className={`text-lg ${colorClass.text}`}
                            />
                            <span className="font-medium text-gray-900">
                              {planet}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center text-sm">
                          {panchaBala.kshetra_bala?.[idx] || 0}
                        </td>
                        <td className="px-5 py-3 text-center text-sm">
                          {panchaBala.uccha_bala?.[idx]?.toFixed(2) || 0}
                        </td>
                        <td className="px-5 py-3 text-center text-sm">
                          {panchaBala.hadda_bala?.[idx] || 0}
                        </td>
                        <td className="px-5 py-3 text-center text-sm">
                          {panchaBala.drekkana_bala?.[idx] || 0}
                        </td>
                        <td className="px-5 py-3 text-center text-sm">
                          {panchaBala.navmansha_bala?.[idx] || 0}
                        </td>
                        <td className="px-5 py-3 text-center font-semibold text-green-600">
                          {panchaBala.total_bala?.[idx]?.toFixed(2) || 0}
                        </td>
                        <td className="px-5 py-3 text-center font-bold text-indigo-600">
                          {panchaBala.final_bala?.[idx]?.toFixed(2) || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Harsha Bala */}
        {harshaBala && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-yellow-50">
              <h3 className="text-base font-semibold text-gray-900">
                Harsha Bala
              </h3>
              <p className="text-sm text-gray-500">
                Temporal strength based on time factors
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Planet
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Sthana
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Uccha/Swachetri
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Gender
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Din/Ratri
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {PLANET_ORDER.map((planet, idx) => {
                    const config = getPlanetConfig(planet);
                    const colorClass = getColorClass(config.color);

                    return (
                      <tr
                        key={planet}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Iconify
                              icon={config.icon}
                              className={`text-lg ${colorClass.text}`}
                            />
                            <span className="font-medium text-gray-900">
                              {planet}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center text-sm">
                          {harshaBala.sthana_bala?.[idx] || 0}
                        </td>
                        <td className="px-5 py-3 text-center text-sm">
                          {harshaBala.ucchaswachetri_bala?.[idx] || 0}
                        </td>
                        <td className="px-5 py-3 text-center text-sm">
                          {harshaBala.gender_bala?.[idx] || 0}
                        </td>
                        <td className="px-5 py-3 text-center text-sm">
                          {harshaBala.dinratri_bala?.[idx] || 0}
                        </td>
                        <td className="px-5 py-3 text-center font-bold text-yellow-600">
                          {harshaBala.total_bala?.[idx] || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Yogas Section
  const YogasSection = () => {
    const yogas = varshaphalData?.data?.yoga;

    if (!yogas || yogas.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Iconify
            icon="mdi:yoga"
            className="text-4xl text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500">No yogas data available</p>
        </div>
      );
    }

    const activeYogas = yogas.filter((y) => y.is_yog_happening);
    const inactiveYogas = yogas.filter((y) => !y.is_yog_happening);

    return (
      <div className="space-y-6">
        {/* Active Yogas */}
        <div className="bg-white border border-green-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-green-100 bg-green-50">
            <div className="flex items-center gap-2">
              <Iconify
                icon="mdi:check-circle"
                className="text-lg text-green-600"
              />
              <h3 className="text-base font-semibold text-gray-900">
                Active Yogas ({activeYogas.length})
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              Yogas formed in this Varshaphal
            </p>
          </div>

          <div className="p-5">
            {activeYogas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeYogas.map((yoga, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Iconify icon="mdi:star" className="text-green-600" />
                          {yoga.yog_name}
                        </h4>
                        {yoga.yog_description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {yoga.yog_description}
                          </p>
                        )}
                        {yoga.planets && yoga.planets.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {yoga.planets
                              .flat()
                              .filter(Boolean)
                              .map((planet, pIdx) => (
                                <PlanetBadge
                                  key={pIdx}
                                  name={planet || ""}
                                  size="sm"
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No active yogas in this Varshaphal
              </p>
            )}
          </div>
        </div>

        {/* Inactive Yogas */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-900">
              Other Tajika Yogas
            </h3>
            <p className="text-sm text-gray-500">
              Yogas not formed in this year
            </p>
          </div>

          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {inactiveYogas.map((yoga, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {yoga.yog_name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Saham Points Section
  const SahamSection = () => {
    const sahamPoints = varshaphalData?.data?.saham_points;

    if (!sahamPoints || sahamPoints.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Iconify
            icon="mdi:target"
            className="text-4xl text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500">No Saham points data available</p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">
            Saham Points (Sensitive Points)
          </h3>
          <p className="text-sm text-gray-500">
            Arabic parts/lots in Varshaphal - 36 Sahams
          </p>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sahamPoints.map((saham) => {
              const signInfo = getSignFromDegree(saham.saham_degree);

              return (
                <div
                  key={saham.saham_id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">
                      #{saham.saham_id}
                    </span>
                    <span className="font-medium text-gray-900 text-sm">
                      {saham.saham_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Iconify
                      icon={getZodiacIcon(signInfo.sign)}
                      className="text-lg text-gray-500"
                    />
                    <span className="text-sm text-gray-600">
                      {signInfo.sign}
                    </span>
                    <span className="text-xs text-gray-500">
                      {signInfo.normDegree.toFixed(2)}°
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Overview Section
  const OverviewSection = () => {
    const yearChart = varshaphalData?.data?.year_chart;

    return (
      <div className="space-y-6">
        <OverviewStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Year Chart */}
          {yearChart?.chart && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-indigo-50">
                <h3 className="text-base font-semibold text-gray-900">
                  Varsha Kundali
                </h3>
                <p className="text-sm text-gray-500">
                  {yearChart.varshaphal_date}
                </p>
              </div>
              <div className="p-5 flex justify-center">
                <div className="w-72">
                  <SouthIndianChart chart={yearChart.chart} />
                </div>
              </div>
            </div>
          )}

          {/* Mudda Dasha Summary */}
          <MuddaDashaSection />
        </div>

        {/* Panchadhikari */}
        <PanchadhikariCard />
      </div>
    );
  };

  // Render Tab Content
  const renderTabContent = () => {
    if (!varshaphalData?.data) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewSection />;
      case "charts":
        return <ChartsSection />;
      case "planets":
        return <PlanetsSection />;
      case "muntha":
        return <MunthaSection />;
      case "mudda_dasha":
        return <MuddaDashaSection />;
      case "strength":
        return <StrengthSection />;
      case "yogas":
        return <YogasSection />;
      case "saham":
        return <SahamSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Varshaphal"
          description="Annual Horoscope - Tajika System of Yearly Predictions"
          imageSrc="/images/varshaphal.png"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Person Selector */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Iconify
                  icon="mdi:account-outline"
                  className="text-lg text-gray-500"
                />
                Select Person
              </h3>
              <PersonSelector
                onPersonSelected={handlePersonSelected}
                label="Choose Profile"
              />

              {/* Year Selector */}
              {selectedPerson && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Varshaphal Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}{" "}
                        {year === new Date().getFullYear() ? "(Current)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={fetchVarshaphal}
                disabled={loading || !selectedPerson}
                className="mt-4 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Iconify icon="mdi:calendar-star" className="text-lg" />
                    Get Varshaphal
                  </>
                )}
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Iconify
                  icon="mdi:information-outline"
                  className="text-lg text-indigo-500"
                />
                About Varshaphal
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Varshaphal (Annual Horoscope) is based on the Tajika system,
                providing predictions for each year of life.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">System</span>
                  <span className="font-medium text-gray-900">Tajika</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Period</span>
                  <span className="font-medium text-gray-900">1 Year</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Key Factors</span>
                  <span className="font-medium text-gray-900">
                    Muntha, Year Lord
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {varshaphalData ? (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="flex overflow-x-auto border-b border-gray-200">
                    {TABS.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.key
                            ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                            : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Iconify icon={tab.icon} className="text-lg" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div>{renderTabContent()}</div>

                {/* Info Footer */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <Iconify
                      icon="mdi:information-outline"
                      className="text-xl text-gray-400 flex-shrink-0 mt-0.5"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900 mb-1">
                        About Varshaphal System
                      </p>
                      <p>
                        Varshaphal is calculated from the exact moment when the
                        Sun returns to its natal position each year (Solar
                        Return). Key factors include the Year Lord (Varshesha),
                        Muntha progression through signs, Panchadhikari (five
                        lords), and Mudda Dasha periods which divide the year
                        among planets proportionally.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                  <Iconify
                    icon="mdi:calendar-star"
                    className="text-3xl text-indigo-400"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Varshaphal Analysis
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a person and year, then click &quot;Get
                  Varshaphal&quot; to view annual predictions and planetary
                  positions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
