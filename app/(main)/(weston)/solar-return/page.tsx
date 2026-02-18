"use client";

import React, { useState } from "react";
import Iconify from "@/components/Iconify";
import PersonSelector from "@/components/PersonSelector";
import PageHeader from "@/components/PageHeader";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";

// ============ CONSTANTS ============

const PLANET_ICONS: Record<string, string> = {
  Sun: "mdi:white-balance-sunny",
  Moon: "mdi:moon-waning-crescent",
  Mars: "mdi:shield-sword",
  Mercury: "mdi:message-fast",
  Jupiter: "mdi:crown",
  Venus: "mdi:heart",
  Saturn: "mdi:clock-outline",
  Uranus: "mdi:lightning-bolt",
  Neptune: "mdi:waves",
  Pluto: "mdi:skull",
  Ascendant: "mdi:arrow-up-bold-circle",
};

const PLANET_COLORS: Record<string, string> = {
  Sun: "#F59E0B",
  Moon: "#6B7280",
  Mars: "#EF4444",
  Mercury: "#8B5CF6",
  Jupiter: "#F97316",
  Venus: "#EC4899",
  Saturn: "#6366F1",
  Uranus: "#06B6D4",
  Neptune: "#3B82F6",
  Pluto: "#1F2937",
  Ascendant: "#22C55E",
};

const SIGN_ICONS: Record<string, string> = {
  Aries: "mdi:zodiac-aries",
  Taurus: "mdi:zodiac-taurus",
  Gemini: "mdi:zodiac-gemini",
  Cancer: "mdi:zodiac-cancer",
  Leo: "mdi:zodiac-leo",
  Virgo: "mdi:zodiac-virgo",
  Libra: "mdi:zodiac-libra",
  Scorpio: "mdi:zodiac-scorpio",
  Sagittarius: "mdi:zodiac-sagittarius",
  Capricorn: "mdi:zodiac-capricorn",
  Aquarius: "mdi:zodiac-aquarius",
  Pisces: "mdi:zodiac-pisces",
};

const ASPECT_COLORS: Record<string, string> = {
  Conjunction: "#8B5CF6",
  Opposition: "#EF4444",
  Trine: "#22C55E",
  Square: "#F97316",
  Sextile: "#3B82F6",
};

const ASPECT_ICONS: Record<string, string> = {
  Conjunction: "mdi:circle-double",
  Opposition: "mdi:arrow-left-right",
  Trine: "mdi:triangle-outline",
  Square: "mdi:square-outline",
  Sextile: "mdi:star-six-points-outline",
};

// ============ INTERFACES ============

interface Planet {
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: string;
  sign: string;
  house: number;
}

interface HouseCusp {
  house: number;
  sign: string;
  degree: number;
}

interface PlanetAspect {
  solar_return_planet: string;
  natal_planet: string;
  type: string;
  orb: number;
}

interface PlanetReport {
  name: string;
  isRetro: string;
  sign: string;
  forecast: string[];
}

interface AspectReport {
  solar_return_planet: string;
  natal_planet: string;
  type: string;
  orb: number;
  forecast: string;
}

interface SolarReturnData {
  solar_year: number;
  birth_data: {
    day: number;
    month: number;
    year: number;
    hour: number;
    min: number;
    lat: number;
    lon: number;
    tzone: number;
  };
  details: {
    native_birth_date: string;
    native_age: number;
    solar_return_date: string;
  };
  planets: Planet[];
  houseCusps: {
    houses: HouseCusp[];
    ascendant: number;
    midheaven: number;
    vertex: number;
  };
  planetAspects: PlanetAspect[];
  planetReport: PlanetReport[];
  aspectsReport: AspectReport[];
}

interface SolarReturnResponse {
  status: string;
  message?: string;
  data: SolarReturnData;
  meta?: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

// ============ MAIN COMPONENT ============

function SolarReturnPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SolarReturnResponse | null>(null);
  const [solarYear, setSolarYear] = useState<number>(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person to generate solar return report.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const birthDate = new Date(selectedPerson.BirthTime);

      const requestBody = {
        day: birthDate.getDate(),
        month: birthDate.getMonth() + 1,
        year: birthDate.getFullYear(),
        hour: birthDate.getHours(),
        min: birthDate.getMinutes(),
        lat: selectedPerson.Latitude,
        lon: selectedPerson.Longitude,
        tzone: parseFloat(selectedPerson.TimezoneOffset || "5.5"),
        house_type: "placidus",
        solar_year: solarYear,
      };

      const response = await fetch("/api/solar-return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.status === "Pass") {
        setResult(data);
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (error: unknown) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const tabs = [
    { id: "overview", label: "Overview", icon: "mdi:view-dashboard" },
    { id: "planets", label: "Planets", icon: "mdi:planet" },
    { id: "houses", label: "Houses", icon: "mdi:home-group" },
    { id: "aspects", label: "Aspects", icon: "mdi:connection" },
    { id: "forecasts", label: "Forecasts", icon: "mdi:crystal-ball" },
  ];

  return (
    <div className="container mx-auto pb-12">
      <PageHeader
        title="Solar Return Report"
        description="Discover your yearly forecast through Solar Return astrology"
        imageSrc="/images/solar-return-banner.jpg"
      />

      {/* Input Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <PersonSelector onPersonSelected={setSelectedPerson} />

            {/* Solar Year Selector */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Solar Return Year
              </label>
              <select
                value={solarYear}
                onChange={(e) => setSolarYear(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3">
              <Button
                handleCalculate={handleCalculate}
                selectedPerson={selectedPerson}
                isCalculating={loading}
              />
            </div>
          </div>
        </div>

        {/* Person Info */}
        {selectedPerson && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Iconify
                icon="mdi:account"
                className="text-gray-400"
                width={16}
              />
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{selectedPerson.Name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Iconify
                icon="mdi:calendar"
                className="text-gray-400"
                width={16}
              />
              <span className="text-gray-600">Birth Date:</span>
              <span className="font-medium">
                {new Date(selectedPerson.BirthTime).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Iconify
                icon="mdi:clock-outline"
                className="text-gray-400"
                width={16}
              />
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">
                {new Date(selectedPerson.BirthTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Iconify
                icon="mdi:map-marker"
                className="text-gray-400"
                width={16}
              />
              <span className="text-gray-600">Place:</span>
              <span className="font-medium">
                {selectedPerson.BirthLocation}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && result.data && (
        <div className="mt-6 space-y-6">
          {/* Solar Return Summary */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Solar Return {result.data.solar_year}
                </h2>
                <p className="text-purple-100">
                  Your cosmic forecast for the year ahead
                </p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {result.data.details.native_age}
                  </p>
                  <p className="text-sm text-purple-200">Years Old</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {result.data.details.solar_return_date.split(" ")[0]}
                  </p>
                  <p className="text-sm text-purple-200">Solar Return Date</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Iconify icon={tab.icon} width={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Overview Tab */}
              {activeTab === "overview" && <OverviewTab data={result.data} />}

              {/* Planets Tab */}
              {activeTab === "planets" && (
                <PlanetsTab planets={result.data.planets} />
              )}

              {/* Houses Tab */}
              {activeTab === "houses" && (
                <HousesTab houseCusps={result.data.houseCusps} />
              )}

              {/* Aspects Tab */}
              {activeTab === "aspects" && (
                <AspectsTab aspects={result.data.planetAspects} />
              )}

              {/* Forecasts Tab */}
              {activeTab === "forecasts" && (
                <ForecastsTab
                  planetReport={result.data.planetReport}
                  aspectsReport={result.data.aspectsReport}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="mt-6 bg-white rounded-lg border-2 border-dashed border-gray-200 p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
            <Iconify
              icon="mdi:white-balance-sunny"
              width={40}
              className="text-purple-300"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Calculate Your Solar Return
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Select a profile and year to generate your Solar Return chart and
            discover what the upcoming year holds for you.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
            <Iconify
              icon="mdi:loading"
              width={32}
              className="text-purple-500 animate-spin"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Calculating Solar Return...
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we generate your solar return report.
          </p>
        </div>
      )}
    </div>
  );
}

// ============ TAB COMPONENTS ============

function OverviewTab({ data }: { data: SolarReturnData }) {
  const ascendant = data.planets.find((p) => p.name === "Ascendant");
  const sun = data.planets.find((p) => p.name === "Sun");
  const moon = data.planets.find((p) => p.name === "Moon");

  return (
    <div className="space-y-6">
      {/* Key Placements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ascendant */}
        {ascendant && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Iconify
                  icon="mdi:arrow-up-bold-circle"
                  width={24}
                  className="text-green-600"
                />
              </div>
              <div>
                <p className="text-xs text-green-600 uppercase tracking-wide">
                  Ascendant
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {ascendant.sign}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {ascendant.normDegree.toFixed(2)}° in House {ascendant.house}
            </p>
          </div>
        )}

        {/* Sun */}
        {sun && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Iconify
                  icon="mdi:white-balance-sunny"
                  width={24}
                  className="text-amber-600"
                />
              </div>
              <div>
                <p className="text-xs text-amber-600 uppercase tracking-wide">
                  Sun
                </p>
                <p className="text-lg font-bold text-gray-800">{sun.sign}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {sun.normDegree.toFixed(2)}° in House {sun.house}
            </p>
          </div>
        )}

        {/* Moon */}
        {moon && (
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Iconify
                  icon="mdi:moon-waning-crescent"
                  width={24}
                  className="text-slate-600"
                />
              </div>
              <div>
                <p className="text-xs text-slate-600 uppercase tracking-wide">
                  Moon
                </p>
                <p className="text-lg font-bold text-gray-800">{moon.sign}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {moon.normDegree.toFixed(2)}° in House {moon.house}
            </p>
          </div>
        )}
      </div>

      {/* Birth Data */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Iconify
            icon="mdi:information"
            width={18}
            className="text-purple-600"
          />
          Birth Data Used
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Birth Date</p>
            <p className="font-medium">{data.details.native_birth_date}</p>
          </div>
          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-medium">
              {data.birth_data.lat.toFixed(4)}°,{" "}
              {data.birth_data.lon.toFixed(4)}°
            </p>
          </div>
          <div>
            <p className="text-gray-500">Timezone</p>
            <p className="font-medium">
              UTC {data.birth_data.tzone >= 0 ? "+" : ""}
              {data.birth_data.tzone}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Solar Return</p>
            <p className="font-medium">{data.details.solar_return_date}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Planets"
          value={data.planets.length}
          icon="mdi:planet"
          color="#8B5CF6"
        />
        <StatCard
          label="Aspects"
          value={data.planetAspects.length}
          icon="mdi:connection"
          color="#3B82F6"
        />
        <StatCard
          label="Retrograde"
          value={data.planets.filter((p) => p.isRetro === "true").length}
          icon="mdi:arrow-u-left-top"
          color="#F97316"
        />
        <StatCard
          label="Houses"
          value={data.houseCusps.houses.length}
          icon="mdi:home-group"
          color="#22C55E"
        />
      </div>

      {/* Midheaven & Vertex */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Iconify
                icon="mdi:arrow-up"
                width={20}
                className="text-blue-600"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Midheaven (MC)</p>
              <p className="font-semibold text-gray-800">
                {data.houseCusps.midheaven.toFixed(2)}°
              </p>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Iconify
                icon="mdi:star-four-points"
                width={20}
                className="text-indigo-600"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Vertex</p>
              <p className="font-semibold text-gray-800">
                {data.houseCusps.vertex.toFixed(2)}°
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanetsTab({ planets }: { planets: Planet[] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {planets.map((planet) => (
          <div
            key={planet.name}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${PLANET_COLORS[planet.name] || "#6B7280"}15`,
                }}
              >
                <Iconify
                  icon={PLANET_ICONS[planet.name] || "mdi:circle"}
                  width={24}
                  style={{ color: PLANET_COLORS[planet.name] || "#6B7280" }}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-800">{planet.name}</h4>
                  {planet.isRetro === "true" && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                      Retrograde
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Iconify
                    icon={SIGN_ICONS[planet.sign] || "mdi:zodiac-aries"}
                    width={16}
                  />
                  <span className="font-medium">{planet.sign}</span>
                  <span className="text-gray-400">•</span>
                  <span>{planet.normDegree.toFixed(2)}°</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Iconify icon="mdi:home" width={14} />
                    House {planet.house}
                  </span>
                  <span className="flex items-center gap-1">
                    <Iconify icon="mdi:speedometer" width={14} />
                    {planet.speed.toFixed(4)}°/day
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HousesTab({
  houseCusps,
}: {
  houseCusps: SolarReturnData["houseCusps"];
}) {
  return (
    <div className="space-y-6">
      {/* Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
          <p className="text-xs text-purple-600 uppercase mb-1">Ascendant</p>
          <p className="text-xl font-bold text-gray-800">
            {houseCusps.ascendant.toFixed(2)}°
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
          <p className="text-xs text-blue-600 uppercase mb-1">Midheaven (MC)</p>
          <p className="text-xl font-bold text-gray-800">
            {houseCusps.midheaven.toFixed(2)}°
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-center">
          <p className="text-xs text-indigo-600 uppercase mb-1">Vertex</p>
          <p className="text-xl font-bold text-gray-800">
            {houseCusps.vertex.toFixed(2)}°
          </p>
        </div>
      </div>

      {/* Houses Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {houseCusps.houses.map((house) => (
          <div
            key={house.house}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-bold text-purple-600">
                  {house.house}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">House {house.house}</p>
                <p className="font-medium text-gray-800">{house.sign}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Iconify
                icon={SIGN_ICONS[house.sign] || "mdi:zodiac-aries"}
                width={16}
              />
              <span>{house.degree.toFixed(2)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AspectsTab({ aspects }: { aspects: PlanetAspect[] }) {
  // Group aspects by type
  const groupedAspects = aspects.reduce(
    (acc, aspect) => {
      if (!acc[aspect.type]) {
        acc[aspect.type] = [];
      }
      acc[aspect.type].push(aspect);
      return acc;
    },
    {} as Record<string, PlanetAspect[]>,
  );

  return (
    <div className="space-y-6">
      {/* Aspect Summary */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(groupedAspects).map(([type, aspectList]) => (
          <div
            key={type}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border"
            style={{
              borderColor: ASPECT_COLORS[type] || "#6B7280",
              backgroundColor: `${ASPECT_COLORS[type] || "#6B7280"}10`,
            }}
          >
            <Iconify
              icon={ASPECT_ICONS[type] || "mdi:circle"}
              width={18}
              style={{ color: ASPECT_COLORS[type] || "#6B7280" }}
            />
            <span className="font-medium text-gray-700">{type}</span>
            <span
              className="px-2 py-0.5 rounded-full text-xs text-white"
              style={{ backgroundColor: ASPECT_COLORS[type] || "#6B7280" }}
            >
              {aspectList.length}
            </span>
          </div>
        ))}
      </div>

      {/* Aspects List */}
      <div className="space-y-3">
        {aspects.map((aspect, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
          >
            {/* Solar Return Planet */}
            <div className="flex items-center gap-2 min-w-[120px]">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${PLANET_COLORS[aspect.solar_return_planet] || "#6B7280"}15`,
                }}
              >
                <Iconify
                  icon={
                    PLANET_ICONS[aspect.solar_return_planet] || "mdi:circle"
                  }
                  width={18}
                  style={{
                    color:
                      PLANET_COLORS[aspect.solar_return_planet] || "#6B7280",
                  }}
                />
              </div>
              <span className="font-medium text-gray-700">
                {aspect.solar_return_planet}
              </span>
            </div>

            {/* Aspect Type */}
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${ASPECT_COLORS[aspect.type] || "#6B7280"}15`,
              }}
            >
              <Iconify
                icon={ASPECT_ICONS[aspect.type] || "mdi:circle"}
                width={16}
                style={{ color: ASPECT_COLORS[aspect.type] || "#6B7280" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: ASPECT_COLORS[aspect.type] || "#6B7280" }}
              >
                {aspect.type}
              </span>
            </div>

            {/* Natal Planet */}
            <div className="flex items-center gap-2 min-w-[120px]">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `${PLANET_COLORS[aspect.natal_planet] || "#6B7280"}15`,
                }}
              >
                <Iconify
                  icon={PLANET_ICONS[aspect.natal_planet] || "mdi:circle"}
                  width={18}
                  style={{
                    color: PLANET_COLORS[aspect.natal_planet] || "#6B7280",
                  }}
                />
              </div>
              <span className="font-medium text-gray-700">
                {aspect.natal_planet}
              </span>
            </div>

            {/* Orb */}
            <div className="ml-auto text-sm text-gray-500">
              Orb: {aspect.orb.toFixed(2)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ForecastsTab({
  planetReport,
  aspectsReport,
}: {
  planetReport: PlanetReport[];
  aspectsReport: AspectReport[];
}) {
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);
  const [expandedAspect, setExpandedAspect] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      {/* Planet Reports */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Iconify icon="mdi:planet" width={22} className="text-purple-600" />
          Planet Forecasts
        </h3>
        <div className="space-y-4">
          {planetReport.map((report) => (
            <div
              key={report.name}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedPlanet(
                    expandedPlanet === report.name ? null : report.name,
                  )
                }
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${PLANET_COLORS[report.name] || "#6B7280"}15`,
                    }}
                  >
                    <Iconify
                      icon={PLANET_ICONS[report.name] || "mdi:circle"}
                      width={22}
                      style={{ color: PLANET_COLORS[report.name] || "#6B7280" }}
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">
                      {report.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Iconify
                        icon={SIGN_ICONS[report.sign] || "mdi:zodiac-aries"}
                        width={14}
                      />
                      <span>{report.sign}</span>
                      {report.isRetro === "true" && (
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                          Rx
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Iconify
                  icon={
                    expandedPlanet === report.name
                      ? "mdi:chevron-up"
                      : "mdi:chevron-down"
                  }
                  width={24}
                  className="text-gray-400"
                />
              </button>

              {expandedPlanet === report.name && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                  <div className="space-y-3">
                    {report.forecast
                      .filter((f) => f.trim() !== "")
                      .map((paragraph, idx) => (
                        <p
                          key={idx}
                          className="text-sm text-gray-600 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Aspect Reports */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Iconify icon="mdi:connection" width={22} className="text-blue-600" />
          Aspect Forecasts
        </h3>
        <div className="space-y-4">
          {aspectsReport.map((report, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedAspect(expandedAspect === idx ? null : idx)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${
                          PLANET_COLORS[report.solar_return_planet] || "#6B7280"
                        }15`,
                      }}
                    >
                      <Iconify
                        icon={
                          PLANET_ICONS[report.solar_return_planet] ||
                          "mdi:circle"
                        }
                        width={18}
                        style={{
                          color:
                            PLANET_COLORS[report.solar_return_planet] ||
                            "#6B7280",
                        }}
                      />
                    </div>
                    <span className="font-medium text-gray-700">
                      {report.solar_return_planet}
                    </span>
                  </div>

                  <div
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${ASPECT_COLORS[report.type] || "#6B7280"}15`,
                      color: ASPECT_COLORS[report.type] || "#6B7280",
                    }}
                  >
                    {report.type}
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `${PLANET_COLORS[report.natal_planet] || "#6B7280"}15`,
                      }}
                    >
                      <Iconify
                        icon={PLANET_ICONS[report.natal_planet] || "mdi:circle"}
                        width={18}
                        style={{
                          color:
                            PLANET_COLORS[report.natal_planet] || "#6B7280",
                        }}
                      />
                    </div>
                    <span className="font-medium text-gray-700">
                      {report.natal_planet}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    Orb: {report.orb}°
                  </span>
                  <Iconify
                    icon={
                      expandedAspect === idx
                        ? "mdi:chevron-up"
                        : "mdi:chevron-down"
                    }
                    width={24}
                    className="text-gray-400"
                  />
                </div>
              </button>

              {expandedAspect === idx && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {report.forecast}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ HELPER COMPONENTS ============

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 text-center">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Iconify icon={icon} width={24} style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

export default SolarReturnPage;
