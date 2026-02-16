"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";

// Types
interface PlanetAshtakData {
  ashtakvarga_points?: number[];
  ashtakvarga?: number[];
  total?: number;
  total_points?: number;
  planet?: string;
}

interface SarvashtakData {
  sarvashtakvarga?: number[];
  total?: number;
  sign_wise_total?: number[];
}

interface AshtakvargaData {
  sarvashtakvarga: SarvashtakData | null;
  planet_ashtakvarga: Record<string, PlanetAshtakData | null>;
}

interface AshtakvargaResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: AshtakvargaData;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

// Constants
const PLANETS = [
  { key: "sun", name: "Sun", icon: "mdi:white-balance-sunny", color: "orange" },
  {
    key: "moon",
    name: "Moon",
    icon: "mdi:moon-waning-crescent",
    color: "blue",
  },
  { key: "mars", name: "Mars", icon: "mdi:triangle", color: "red" },
  { key: "mercury", name: "Mercury", icon: "mdi:atom", color: "green" },
  {
    key: "jupiter",
    name: "Jupiter",
    icon: "mdi:circle-outline",
    color: "yellow",
  },
  { key: "venus", name: "Venus", icon: "mdi:heart", color: "pink" },
  {
    key: "saturn",
    name: "Saturn",
    icon: "mdi:hexagon-outline",
    color: "slate",
  },
];

const SIGNS = [
  { name: "Aries", short: "Ari", icon: "mdi:zodiac-aries" },
  { name: "Taurus", short: "Tau", icon: "mdi:zodiac-taurus" },
  { name: "Gemini", short: "Gem", icon: "mdi:zodiac-gemini" },
  { name: "Cancer", short: "Can", icon: "mdi:zodiac-cancer" },
  { name: "Leo", short: "Leo", icon: "mdi:zodiac-leo" },
  { name: "Virgo", short: "Vir", icon: "mdi:zodiac-virgo" },
  { name: "Libra", short: "Lib", icon: "mdi:zodiac-libra" },
  { name: "Scorpio", short: "Sco", icon: "mdi:zodiac-scorpio" },
  { name: "Sagittarius", short: "Sag", icon: "mdi:zodiac-sagittarius" },
  { name: "Capricorn", short: "Cap", icon: "mdi:zodiac-capricorn" },
  { name: "Aquarius", short: "Aqu", icon: "mdi:zodiac-aquarius" },
  { name: "Pisces", short: "Pis", icon: "mdi:zodiac-pisces" },
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
  indigo: {
    bg: "bg-indigo-500",
    text: "text-indigo-600",
    border: "border-indigo-200",
    light: "bg-indigo-50",
  },
};

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "sarvashtakvarga", label: "Sarvashtakvarga", icon: "mdi:grid" },
  { key: "planets", label: "Planet Ashtakvarga", icon: "mdi:planet" },
  { key: "analysis", label: "Analysis", icon: "mdi:chart-bar" },
];

export default function AshtakvargaPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [ashtakData, setAshtakData] = useState<AshtakvargaResponse | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedPlanet, setSelectedPlanet] = useState<string>("sun");

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setAshtakData(null);
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

  const fetchAshtakvarga = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(`/api/ashtakvarga`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: AshtakvargaResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch Ashtakvarga data");
      }
      setAshtakData(result);

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

  // Get points array from planet data
  const getPoints = (data: PlanetAshtakData | null): number[] => {
    if (!data) return Array(12).fill(0);
    return data.ashtakvarga_points || data.ashtakvarga || Array(12).fill(0);
  };

  // Get total points
  const getTotal = (data: PlanetAshtakData | null): number => {
    if (!data) return 0;
    return (
      data.total ||
      data.total_points ||
      getPoints(data).reduce((a, b) => a + b, 0)
    );
  };

  // Get sarvashtakvarga points
  const getSarvashtakPoints = (): number[] => {
    const sarva = ashtakData?.data?.sarvashtakvarga;
    if (!sarva) return Array(12).fill(0);
    return sarva.sarvashtakvarga || sarva.sign_wise_total || Array(12).fill(0);
  };

  // Get sarvashtakvarga total
  const getSarvashtakTotal = (): number => {
    const sarva = ashtakData?.data?.sarvashtakvarga;
    if (!sarva) return 0;
    return sarva.total || getSarvashtakPoints().reduce((a, b) => a + b, 0);
  };

  // Get color based on points
  const getPointColor = (points: number, max: number = 8): string => {
    const ratio = points / max;
    if (ratio >= 0.625) return "bg-green-500 text-white"; // 5+ out of 8
    if (ratio >= 0.375) return "bg-yellow-500 text-white"; // 3-4 out of 8
    return "bg-red-500 text-white"; // 0-2 out of 8
  };

  // Get sarvashtakvarga color
  const getSarvashtakColor = (points: number): string => {
    if (points >= 30) return "bg-green-500 text-white";
    if (points >= 25) return "bg-green-400 text-white";
    if (points >= 20) return "bg-yellow-500 text-white";
    if (points >= 15) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  // Calculate planet totals for summary
  const planetTotals = useMemo(() => {
    if (!ashtakData?.data?.planet_ashtakvarga) return [];
    return PLANETS.map((planet) => ({
      ...planet,
      total: getTotal(ashtakData.data.planet_ashtakvarga[planet.key]),
      points: getPoints(ashtakData.data.planet_ashtakvarga[planet.key]),
    }));
  }, [ashtakData]);

  // Bindu Cell Component
  const BinduCell = ({
    value,
    maxValue = 8,
    size = "md",
  }: {
    value: number;
    maxValue?: number;
    size?: "sm" | "md" | "lg";
  }) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
    };

    const colorClass =
      maxValue === 8
        ? getPointColor(value, maxValue)
        : getSarvashtakColor(value);

    return (
      <div
        className={`${sizeClasses[size]} rounded-lg flex items-center justify-center font-bold ${colorClass}`}
      >
        {value}
      </div>
    );
  };

  // Overview Stats Component
  const OverviewStats = () => {
    if (!ashtakData?.data) return null;

    const sarvaTotal = getSarvashtakTotal();
    const highestPlanet = planetTotals.reduce(
      (max, p) => (p.total > max.total ? p : max),
      planetTotals[0],
    );
    const lowestPlanet = planetTotals.reduce(
      (min, p) => (p.total < min.total ? p : min),
      planetTotals[0],
    );

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Sarvashtakvarga Total
          </p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">
            {sarvaTotal}
          </p>
          <p className="text-xs text-gray-400 mt-1">out of 337</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Average per Sign
          </p>
          <p className="text-3xl font-bold text-purple-600 mt-1">
            {(sarvaTotal / 12).toFixed(1)}
          </p>
          <p className="text-xs text-gray-400 mt-1">bindus</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Strongest Planet
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Iconify
              icon={highestPlanet?.icon || "mdi:circle"}
              className={`text-xl ${COLOR_CLASSES[highestPlanet?.color || "slate"].text}`}
            />
            <span className="text-lg font-bold text-gray-900">
              {highestPlanet?.name}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {highestPlanet?.total} bindus
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Weakest Planet
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Iconify
              icon={lowestPlanet?.icon || "mdi:circle"}
              className={`text-xl ${COLOR_CLASSES[lowestPlanet?.color || "slate"].text}`}
            />
            <span className="text-lg font-bold text-gray-900">
              {lowestPlanet?.name}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {lowestPlanet?.total} bindus
          </p>
        </div>
      </div>
    );
  };

  // Sarvashtakvarga Grid Component
  const SarvashtakvargaGrid = () => {
    const sarvaPoints = getSarvashtakPoints();
    const sarvaTotal = getSarvashtakTotal();

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                <Iconify icon="mdi:grid" className="text-xl text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Sarvashtakvarga
                </h3>
                <p className="text-sm text-gray-500">
                  Combined bindus of all planets
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-indigo-600">{sarvaTotal}</p>
              <p className="text-xs text-gray-500">Total Bindus</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Sign-wise Grid */}
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {SIGNS.map((sign, idx) => (
              <div key={idx} className="text-center">
                <div className="mb-2">
                  <Iconify
                    icon={sign.icon}
                    className="text-2xl text-gray-400 mx-auto"
                  />
                  <p className="text-xs text-gray-500 mt-1">{sign.short}</p>
                </div>
                <BinduCell
                  value={sarvaPoints[idx] || 0}
                  maxValue={56}
                  size="lg"
                />
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
              Bindu Strength
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-xs text-gray-600">Strong (30+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500"></div>
                <span className="text-xs text-gray-600">Moderate (20-29)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-xs text-gray-600">Weak (&lt;20)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Planet Ashtakvarga Component
  const PlanetAshtakvargaSection = () => {
    const selectedPlanetData = PLANETS.find((p) => p.key === selectedPlanet);
    const planetData = ashtakData?.data?.planet_ashtakvarga?.[selectedPlanet];
    const points = getPoints(planetData || null);
    const total = getTotal(planetData || null);
    const colorClass = COLOR_CLASSES[selectedPlanetData?.color || "slate"];

    return (
      <div className="space-y-4">
        {/* Planet Selector */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
            Select Planet
          </p>
          <div className="flex flex-wrap gap-2">
            {PLANETS.map((planet) => {
              const pColor = COLOR_CLASSES[planet.color];
              const isSelected = selectedPlanet === planet.key;
              const pData = ashtakData?.data?.planet_ashtakvarga?.[planet.key];
              const pTotal = getTotal(pData || null);

              return (
                <button
                  key={planet.key}
                  onClick={() => setSelectedPlanet(planet.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    isSelected
                      ? `${pColor.light} ${pColor.border} ${pColor.text}`
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Iconify icon={planet.icon} className="text-lg" />
                  {planet.name}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-white/50" : "bg-gray-100"
                    }`}
                  >
                    {pTotal}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Planet Grid */}
        <div
          className={`bg-white border rounded-lg overflow-hidden ${colorClass.border}`}
        >
          <div
            className={`px-5 py-4 border-b ${colorClass.light} ${colorClass.border}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${colorClass.bg} flex items-center justify-center`}
                >
                  <Iconify
                    icon={selectedPlanetData?.icon || "mdi:circle"}
                    className="text-2xl text-white"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedPlanetData?.name} Ashtakvarga
                  </h3>
                  <p className="text-sm text-gray-500">
                    Bindu distribution across signs
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${colorClass.text}`}>
                  {total}
                </p>
                <p className="text-xs text-gray-500">Total Bindus</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {/* Grid */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
              {SIGNS.map((sign, idx) => (
                <div key={idx} className="text-center">
                  <div className="mb-2">
                    <Iconify
                      icon={sign.icon}
                      className="text-2xl text-gray-400 mx-auto"
                    />
                    <p className="text-xs text-gray-500 mt-1">{sign.short}</p>
                  </div>
                  <BinduCell value={points[idx] || 0} size="md" />
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase">Highest</p>
                <p className="text-lg font-bold text-green-600">
                  {Math.max(...points)}
                </p>
                <p className="text-xs text-gray-400">
                  {SIGNS[points.indexOf(Math.max(...points))]?.name}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase">Lowest</p>
                <p className="text-lg font-bold text-red-600">
                  {Math.min(...points)}
                </p>
                <p className="text-xs text-gray-400">
                  {SIGNS[points.indexOf(Math.min(...points))]?.name}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase">Average</p>
                <p className="text-lg font-bold text-gray-600">
                  {(total / 12).toFixed(1)}
                </p>
                <p className="text-xs text-gray-400">per sign</p>
              </div>
            </div>
          </div>
        </div>

        {/* All Planets Summary Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-900">
              All Planets Summary
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Planet
                  </th>
                  {SIGNS.map((sign, idx) => (
                    <th
                      key={idx}
                      className="px-2 py-3 text-center text-xs font-semibold text-gray-500"
                    >
                      {sign.short}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PLANETS.map((planet) => {
                  const pData =
                    ashtakData?.data?.planet_ashtakvarga?.[planet.key];
                  const pPoints = getPoints(pData || null);
                  const pTotal = getTotal(pData || null);
                  const pColor = COLOR_CLASSES[planet.color];

                  return (
                    <tr key={planet.key} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Iconify
                            icon={planet.icon}
                            className={`text-lg ${pColor.text}`}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {planet.name}
                          </span>
                        </div>
                      </td>
                      {pPoints.map((point, idx) => (
                        <td key={idx} className="px-2 py-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold ${getPointColor(
                              point,
                            )}`}
                          >
                            {point}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3 text-center">
                        <span className={`font-bold ${pColor.text}`}>
                          {pTotal}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {/* Sarvashtakvarga Row */}
                <tr className="bg-indigo-50 font-semibold">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Iconify
                        icon="mdi:sigma"
                        className="text-lg text-indigo-600"
                      />
                      <span className="text-sm font-bold text-gray-900">
                        SAV
                      </span>
                    </div>
                  </td>
                  {getSarvashtakPoints().map((point, idx) => (
                    <td key={idx} className="px-2 py-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold ${getSarvashtakColor(
                          point,
                        )}`}
                      >
                        {point}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-indigo-600">
                      {getSarvashtakTotal()}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Analysis Section
  const AnalysisSection = () => {
    const sarvaPoints = getSarvashtakPoints();
    const strongSigns = sarvaPoints
      .map((points, idx) => ({ sign: SIGNS[idx], points }))
      .filter((s) => s.points >= 28)
      .sort((a, b) => b.points - a.points);

    const weakSigns = sarvaPoints
      .map((points, idx) => ({ sign: SIGNS[idx], points }))
      .filter((s) => s.points < 22)
      .sort((a, b) => a.points - b.points);

    return (
      <div className="space-y-6">
        {/* Strong & Weak Signs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strong Signs */}
          <div className="bg-white border border-green-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-green-100 bg-green-50">
              <div className="flex items-center gap-2">
                <Iconify
                  icon="mdi:arrow-up-bold-circle"
                  className="text-xl text-green-600"
                />
                <h3 className="text-base font-semibold text-gray-900">
                  Strong Signs
                </h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Signs with 28+ bindus
              </p>
            </div>
            <div className="p-5">
              {strongSigns.length > 0 ? (
                <div className="space-y-3">
                  {strongSigns.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Iconify
                          icon={item.sign.icon}
                          className="text-2xl text-green-600"
                        />
                        <span className="font-medium text-gray-900">
                          {item.sign.name}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {item.points}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No exceptionally strong signs
                </p>
              )}
            </div>
          </div>

          {/* Weak Signs */}
          <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-red-100 bg-red-50">
              <div className="flex items-center gap-2">
                <Iconify
                  icon="mdi:arrow-down-bold-circle"
                  className="text-xl text-red-600"
                />
                <h3 className="text-base font-semibold text-gray-900">
                  Weak Signs
                </h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Signs with less than 22 bindus
              </p>
            </div>
            <div className="p-5">
              {weakSigns.length > 0 ? (
                <div className="space-y-3">
                  {weakSigns.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Iconify
                          icon={item.sign.icon}
                          className="text-2xl text-red-600"
                        />
                        <span className="font-medium text-gray-900">
                          {item.sign.name}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-red-600">
                        {item.points}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No exceptionally weak signs
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Planet Strength Ranking */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-900">
              Planet Strength Ranking
            </h3>
            <p className="text-sm text-gray-500">Based on total bindus</p>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {[...planetTotals]
                .sort((a, b) => b.total - a.total)
                .map((planet, idx) => {
                  const colorClass = COLOR_CLASSES[planet.color];
                  const percentage = (planet.total / 56) * 100;

                  return (
                    <div key={planet.key} className="flex items-center gap-4">
                      <span className="w-6 text-sm font-bold text-gray-400">
                        #{idx + 1}
                      </span>
                      <div className="flex items-center gap-2 w-24">
                        <Iconify
                          icon={planet.icon}
                          className={`text-lg ${colorClass.text}`}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {planet.name}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colorClass.bg} rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className={`w-12 text-right font-bold ${colorClass.text}`}
                      >
                        {planet.total}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Interpretation Guide */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Iconify
              icon="mdi:book-open-variant"
              className="text-xl text-indigo-500"
            />
            Interpretation Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Sarvashtakvarga (SAV)
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Total bindus range: 0-337</li>
                <li>• Average per sign: ~28 bindus</li>
                <li>
                  • Signs with 28+ bindus are favorable for important activities
                </li>
                <li>• Transit planets give good results in high-bindu signs</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                Planet Ashtakvarga (BAV)
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Each planet has 0-56 total bindus</li>
                <li>• 0-8 bindus per sign</li>
                <li>• 4+ bindus in a sign is considered good</li>
                <li>• Used for transit predictions and muhurta</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Overview Section
  const OverviewSection = () => {
    return (
      <div className="space-y-6">
        <OverviewStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SarvashtakvargaGrid />

          {/* Planet Summary Card */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-base font-semibold text-gray-900">
                Planet Bindus Summary
              </h3>
              <p className="text-sm text-gray-500">
                Total bindus for each planet
              </p>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                {planetTotals.map((planet) => {
                  const colorClass = COLOR_CLASSES[planet.color];
                  const percentage = (planet.total / 56) * 100;

                  return (
                    <div key={planet.key} className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-24">
                        <Iconify
                          icon={planet.icon}
                          className={`text-lg ${colorClass.text}`}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {planet.name}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colorClass.bg} rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className={`w-8 text-right text-sm font-bold ${colorClass.text}`}
                      >
                        {planet.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Tab Content
  const renderTabContent = () => {
    if (!ashtakData?.data) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewSection />;
      case "sarvashtakvarga":
        return <SarvashtakvargaGrid />;
      case "planets":
        return <PlanetAshtakvargaSection />;
      case "analysis":
        return <AnalysisSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Ashtakvarga"
          description="Bindu-based strength analysis of planets and signs"
          imageSrc="/images/ashtakvarga.png"
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

              <button
                onClick={fetchAshtakvarga}
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
                    <Iconify
                      icon="mdi:calculator-variant-outline"
                      className="text-lg"
                    />
                    Calculate
                  </>
                )}
              </button>
            </div>

            {/* Status Card */}
            {ashtakData && (
              <div
                className={`border rounded-lg p-4 ${
                  ashtakData.status === "Pass"
                    ? "bg-green-50 border-green-200"
                    : ashtakData.status === "Partial"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Iconify
                    icon={
                      ashtakData.status === "Pass"
                        ? "mdi:check-circle"
                        : ashtakData.status === "Partial"
                          ? "mdi:alert-circle"
                          : "mdi:close-circle"
                    }
                    className={`text-lg ${
                      ashtakData.status === "Pass"
                        ? "text-green-600"
                        : ashtakData.status === "Partial"
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {ashtakData.status === "Pass"
                      ? "All Data Loaded"
                      : ashtakData.status === "Partial"
                        ? "Partial Data"
                        : "Failed"}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {ashtakData.meta.successful}/{ashtakData.meta.total_apis} APIs
                  • {ashtakData.meta.success_rate}
                </p>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Iconify
                  icon="mdi:information-outline"
                  className="text-lg text-indigo-500"
                />
                About Ashtakvarga
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Ashtakvarga is a unique Vedic system that quantifies planetary
                strength through &quot;bindus&quot; (points).
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Bindus</span>
                  <span className="font-medium text-gray-900">337</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Planets</span>
                  <span className="font-medium text-gray-900">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Signs</span>
                  <span className="font-medium text-gray-900">12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {ashtakData ? (
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
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                  <Iconify
                    icon="mdi:grid"
                    className="text-3xl text-indigo-400"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ashtakvarga Analysis
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a person and click &quot;Calculate&quot; to view
                  Ashtakvarga bindus and planetary strength analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
