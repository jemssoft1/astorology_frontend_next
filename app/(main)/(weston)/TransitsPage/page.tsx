"use client";

import React, { useState } from "react";
import Iconify from "@/components/Iconify";
import PersonSelector from "@/components/PersonSelector";
import PageHeader from "@/components/PageHeader";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";

// ============ CONSTANTS ============

const ZODIAC_SIGNS: Record<string, { symbol: string; color: string }> = {
  Aries: { symbol: "♈", color: "#EF4444" },
  Taurus: { symbol: "♉", color: "#84CC16" },
  Gemini: { symbol: "♊", color: "#FBBF24" },
  Cancer: { symbol: "♋", color: "#3B82F6" },
  Leo: { symbol: "♌", color: "#F97316" },
  Virgo: { symbol: "♍", color: "#22C55E" },
  Libra: { symbol: "♎", color: "#EC4899" },
  Scorpio: { symbol: "♏", color: "#7C3AED" },
  Sagittarius: { symbol: "♐", color: "#8B5CF6" },
  Capricorn: { symbol: "♑", color: "#6B7280" },
  Aquarius: { symbol: "♒", color: "#06B6D4" },
  Pisces: { symbol: "♓", color: "#14B8A6" },
};

const PLANETS_CONFIG: Record<string, { symbol: string; color: string }> = {
  Sun: { symbol: "☉", color: "#F59E0B" },
  Moon: { symbol: "☽", color: "#6B7280" },
  Mars: { symbol: "♂", color: "#EF4444" },
  Mercury: { symbol: "☿", color: "#10B981" },
  Jupiter: { symbol: "♃", color: "#F97316" },
  Venus: { symbol: "♀", color: "#EC4899" },
  Saturn: { symbol: "♄", color: "#8B5CF6" },
  Uranus: { symbol: "⛢", color: "#06B6D4" },
  Neptune: { symbol: "♆", color: "#3B82F6" },
  Pluto: { symbol: "♇", color: "#78716C" },
  "North Node": { symbol: "☊", color: "#84CC16" },
  Ascendant: { symbol: "AC", color: "#DC2626" },
};

const ASPECT_CONFIG: Record<
  string,
  { symbol: string; color: string; nature: string }
> = {
  Conjunction: { symbol: "☌", color: "#EF4444", nature: "major" },
  Opposition: { symbol: "☍", color: "#3B82F6", nature: "challenging" },
  Trine: { symbol: "△", color: "#22C55E", nature: "harmonious" },
  Square: { symbol: "□", color: "#F97316", nature: "challenging" },
  Sextile: { symbol: "⚹", color: "#8B5CF6", nature: "harmonious" },
  Quincunx: { symbol: "⚻", color: "#6B7280", nature: "minor" },
};

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "daily", label: "Daily", icon: "mdi:calendar-today" },
  { key: "weekly", label: "Weekly", icon: "mdi:calendar-week" },
  { key: "monthly", label: "Monthly", icon: "mdi:calendar-month" },
  { key: "forecast", label: "Life Forecast", icon: "mdi:crystal-ball" },
];

// ============ MAIN COMPONENT ============

function TransitsPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person to generate transit reports.",
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
      };

      const response = await fetch("/api/transits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Data helpers
  const getMonthly = () => result?.data?.monthly?.data || null;
  const getWeekly = () => result?.data?.weekly?.data || null;
  const getDaily = () => result?.data?.daily?.data || null;
  const getLifeForecast = () =>
    result?.data?.life_forecast?.data?.life_forecast || [];
  const getNatalDaily = () => result?.data?.natal_daily?.data || null;
  const getNatalWeekly = () => result?.data?.natal_weekly?.data || null;

  return (
    <div className="container mx-auto pb-12">
      <PageHeader
        title="Transit Reports"
        description="Discover current planetary transits affecting your chart"
        imageSrc="/images/transits-banner.jpg"
      />

      {/* Input Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <PersonSelector onPersonSelected={setSelectedPerson} />
            <Button
              handleCalculate={handleCalculate}
              selectedPerson={selectedPerson}
              isCalculating={loading}
            />
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
      {result && (
        <div className="mt-6">
          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-t-lg">
            <div className="flex overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Iconify icon={tab.icon} width={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-6">
            {/* ============ OVERVIEW TAB ============ */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Ascendant & Date Range */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getMonthly()?.ascendant && (
                    <InfoCard
                      label="Ascendant"
                      value={getMonthly().ascendant}
                      icon="mdi:arrow-up-bold"
                    />
                  )}
                  {getMonthly()?.month_start_date && (
                    <InfoCard
                      label="Month Start"
                      value={getMonthly().month_start_date}
                      icon="mdi:calendar-start"
                    />
                  )}
                  {getMonthly()?.month_end_date && (
                    <InfoCard
                      label="Month End"
                      value={getMonthly().month_end_date}
                      icon="mdi:calendar-end"
                    />
                  )}
                  {getDaily()?.transit_date && (
                    <InfoCard
                      label="Transit Date"
                      value={getDaily().transit_date}
                      icon="mdi:calendar-today"
                    />
                  )}
                </div>

                {/* Moon Phases */}
                {getMonthly()?.moon_phase &&
                  getMonthly().moon_phase.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Moon Phases
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getMonthly().moon_phase.map(
                          (phase: any, idx: number) => (
                            <MoonPhaseCard key={idx} phase={phase} />
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Today's Transit Houses */}
                {getDaily()?.transit_house && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Current Planet Positions
                    </h3>
                    <TransitHousesTable houses={getDaily().transit_house} />
                  </div>
                )}

                {/* Quick Transit Summary */}
                {getDaily()?.transit_relation &&
                  getDaily().transit_relation.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Today's Active Transits
                      </h3>
                      <TransitRelationsGrid
                        relations={getDaily().transit_relation.slice(0, 6)}
                      />
                    </div>
                  )}
              </div>
            )}

            {/* ============ DAILY TAB ============ */}
            {activeTab === "daily" && (
              <div className="space-y-6">
                {/* Transit Date */}
                {getDaily()?.transit_date && (
                  <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
                    <Iconify
                      icon="mdi:calendar-today"
                      width={24}
                      className="text-indigo-600"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Transit Date</p>
                      <p className="font-semibold text-gray-800">
                        {getDaily().transit_date}
                      </p>
                    </div>
                  </div>
                )}

                {/* Transit Houses */}
                {getDaily()?.transit_house && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Planets in Transit Houses
                    </h3>
                    <TransitHousesTable houses={getDaily().transit_house} />
                  </div>
                )}

                {/* Transit Relations */}
                {getDaily()?.transit_relation && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Transit Aspects
                    </h3>
                    <TransitRelationsTable
                      relations={getDaily().transit_relation}
                    />
                  </div>
                )}

                {/* Natal Daily Transits */}
                {getNatalDaily()?.transit_relation && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Detailed Natal Transits
                    </h3>
                    <NatalTransitsTable
                      transits={getNatalDaily().transit_relation}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ============ WEEKLY TAB ============ */}
            {activeTab === "weekly" && (
              <div className="space-y-6">
                {/* Week Range */}
                {getWeekly() && (
                  <div className="flex items-center gap-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Iconify
                        icon="mdi:calendar-start"
                        width={20}
                        className="text-blue-600"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Week Start</p>
                        <p className="font-medium text-gray-800">
                          {getWeekly().week_start_date}
                        </p>
                      </div>
                    </div>
                    <Iconify
                      icon="mdi:arrow-right"
                      width={20}
                      className="text-gray-400"
                    />
                    <div className="flex items-center gap-2">
                      <Iconify
                        icon="mdi:calendar-end"
                        width={20}
                        className="text-blue-600"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Week End</p>
                        <p className="font-medium text-gray-800">
                          {getWeekly().week_end_date}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weekly Transit Relations */}
                {getWeekly()?.transit_relation && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      This Week's Transits
                    </h3>
                    <TransitRelationsTable
                      relations={getWeekly().transit_relation}
                      showDate
                    />
                  </div>
                )}

                {/* Natal Weekly Transits */}
                {getNatalWeekly()?.transit_relation && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Detailed Weekly Natal Transits
                    </h3>
                    <NatalTransitsTable
                      transits={getNatalWeekly().transit_relation}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ============ MONTHLY TAB ============ */}
            {activeTab === "monthly" && (
              <div className="space-y-6">
                {/* Month Range */}
                {getMonthly() && (
                  <div className="flex items-center gap-6 p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Iconify
                        icon="mdi:calendar-start"
                        width={20}
                        className="text-purple-600"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Month Start</p>
                        <p className="font-medium text-gray-800">
                          {getMonthly().month_start_date}
                        </p>
                      </div>
                    </div>
                    <Iconify
                      icon="mdi:arrow-right"
                      width={20}
                      className="text-gray-400"
                    />
                    <div className="flex items-center gap-2">
                      <Iconify
                        icon="mdi:calendar-end"
                        width={20}
                        className="text-purple-600"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Month End</p>
                        <p className="font-medium text-gray-800">
                          {getMonthly().month_end_date}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Moon Phases */}
                {getMonthly()?.moon_phase &&
                  getMonthly().moon_phase.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Moon Phases
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getMonthly().moon_phase.map(
                          (phase: any, idx: number) => (
                            <MoonPhaseCard key={idx} phase={phase} />
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Monthly Transit Relations */}
                {getMonthly()?.transit_relation && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      This Month's Transits (
                      {getMonthly().transit_relation.length})
                    </h3>
                    <TransitRelationsTable
                      relations={getMonthly().transit_relation}
                      showDate
                    />
                  </div>
                )}

                {/* Retrogrades */}
                {getMonthly()?.retrogrades &&
                  getMonthly().retrogrades.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Retrograde Planets
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {getMonthly().retrogrades.map(
                          (retro: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium"
                            >
                              {retro.planet || retro} ℞
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* ============ FORECAST TAB ============ */}
            {activeTab === "forecast" && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500">
                  Detailed interpretations of current transits affecting your
                  natal chart.
                </p>

                {getLifeForecast().length > 0 ? (
                  <div className="space-y-4">
                    {getLifeForecast().map((item: any, idx: number) => (
                      <ForecastCard key={idx} forecast={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Iconify
                      icon="mdi:crystal-ball"
                      width={32}
                      className="mx-auto mb-2"
                    />
                    <p>No forecast data available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="mt-6 bg-white rounded-lg border-2 border-dashed border-gray-200 p-10 text-center">
          <Iconify
            icon="mdi:transit-connection-variant"
            width={48}
            className="text-gray-300 mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No Transit Report Generated
          </h3>
          <p className="text-sm text-gray-500">
            Select a profile and click "Get Transits" to see current planetary
            transits.
          </p>
        </div>
      )}
    </div>
  );
}

// ============ SUB COMPONENTS ============

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Iconify icon={icon} width={20} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MoonPhaseCard({ phase }: { phase: any }) {
  const getMoonIcon = (type: string) => {
    if (type.includes("Full")) return "mdi:moon-full";
    if (type.includes("New")) return "mdi:moon-new";
    if (type.includes("First")) return "mdi:moon-first-quarter";
    if (type.includes("Last")) return "mdi:moon-last-quarter";
    return "mdi:moon-waning-crescent";
  };

  const zodiac = ZODIAC_SIGNS[phase.sign];

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <Iconify
            icon={getMoonIcon(phase.phase_type)}
            width={28}
            className="text-gray-600"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{phase.phase_type}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{new Date(phase.date).toLocaleDateString()}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span style={{ color: zodiac?.color }}>{zodiac?.symbol}</span>
              <span>{phase.sign}</span>
            </div>
            {phase.house && <span>• House {phase.house}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function TransitHousesTable({ houses }: { houses: any[] }) {
  if (!houses || houses.length === 0) {
    return <p className="text-gray-400 text-center py-4">No data</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-3 font-semibold text-gray-600">
              Planet
            </th>
            <th className="text-left p-3 font-semibold text-gray-600">
              Natal Sign
            </th>
            <th className="text-left p-3 font-semibold text-gray-600">
              Transit House
            </th>
            <th className="text-center p-3 font-semibold text-gray-600">
              Retro
            </th>
          </tr>
        </thead>
        <tbody>
          {houses.map((item: any, idx: number) => {
            const planetConfig = PLANETS_CONFIG[item.planet];
            const zodiac = ZODIAC_SIGNS[item.natal_sign];

            return (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: planetConfig?.color }}>
                      {planetConfig?.symbol || "•"}
                    </span>
                    <span className="font-medium text-gray-700">
                      {item.planet}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <span style={{ color: zodiac?.color }}>
                      {zodiac?.symbol}
                    </span>
                    <span className="text-gray-700">{item.natal_sign}</span>
                  </div>
                </td>
                <td className="p-3 text-gray-700">
                  House {item.transit_house}
                </td>
                <td className="p-3 text-center">
                  {item.is_retrograde && (
                    <span className="text-red-500 text-xs font-medium">℞</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TransitRelationsGrid({ relations }: { relations: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {relations.map((rel: any, idx: number) => {
        const aspectConfig = ASPECT_CONFIG[rel.type];
        const isHarmonious = aspectConfig?.nature === "harmonious";
        const transitPlanet = PLANETS_CONFIG[rel.transit_planet];
        const natalPlanet = PLANETS_CONFIG[rel.natal_planet];

        return (
          <div
            key={idx}
            className={`border rounded-lg p-3 ${
              isHarmonious
                ? "border-green-200 bg-green-50"
                : "border-orange-200 bg-orange-50"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: aspectConfig?.color }} className="text-lg">
                {aspectConfig?.symbol || "•"}
              </span>
              <span className="text-xs font-medium text-gray-600">
                {rel.type}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span style={{ color: transitPlanet?.color }}>
                {transitPlanet?.symbol}
              </span>
              <span className="text-gray-700">{rel.transit_planet}</span>
              <span className="text-gray-400 mx-1">→</span>
              <span style={{ color: natalPlanet?.color }}>
                {natalPlanet?.symbol}
              </span>
              <span className="text-gray-700">{rel.natal_planet}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Orb: {rel.orb}°</p>
          </div>
        );
      })}
    </div>
  );
}

function TransitRelationsTable({
  relations,
  showDate = false,
}: {
  relations: any[];
  showDate?: boolean;
}) {
  if (!relations || relations.length === 0) {
    return (
      <p className="text-gray-400 text-center py-4">No transit relations</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-3 font-semibold text-gray-600">
              Transit Planet
            </th>
            <th className="text-center p-3 font-semibold text-gray-600">
              Aspect
            </th>
            <th className="text-left p-3 font-semibold text-gray-600">
              Natal Planet
            </th>
            <th className="text-left p-3 font-semibold text-gray-600">Orb</th>
            {showDate && (
              <th className="text-left p-3 font-semibold text-gray-600">
                Date
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {relations.map((rel: any, idx: number) => {
            const aspectConfig = ASPECT_CONFIG[rel.type];
            const transitPlanet = PLANETS_CONFIG[rel.transit_planet];
            const natalPlanet = PLANETS_CONFIG[rel.natal_planet];

            return (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: transitPlanet?.color }}>
                      {transitPlanet?.symbol || "•"}
                    </span>
                    <span className="text-gray-700">{rel.transit_planet}</span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${aspectConfig?.color}15`,
                      color: aspectConfig?.color,
                    }}
                  >
                    <span className="text-sm">
                      {aspectConfig?.symbol || "•"}
                    </span>
                    {rel.type}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: natalPlanet?.color }}>
                      {natalPlanet?.symbol || "•"}
                    </span>
                    <span className="text-gray-700">{rel.natal_planet}</span>
                  </div>
                </td>
                <td className="p-3 text-gray-500">{rel.orb}°</td>
                {showDate && <td className="p-3 text-gray-500">{rel.date}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function NatalTransitsTable({ transits }: { transits: any[] }) {
  if (!transits || transits.length === 0) {
    return <p className="text-gray-400 text-center py-4">No data</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-2 font-semibold text-gray-600">
              Transit
            </th>
            <th className="text-center p-2 font-semibold text-gray-600">
              Aspect
            </th>
            <th className="text-left p-2 font-semibold text-gray-600">Natal</th>
            <th className="text-left p-2 font-semibold text-gray-600">Sign</th>
            <th className="text-left p-2 font-semibold text-gray-600">
              Time Range
            </th>
          </tr>
        </thead>
        <tbody>
          {transits.slice(0, 15).map((t: any, idx: number) => {
            const aspectConfig = ASPECT_CONFIG[t.aspect_type];
            const transitPlanet = PLANETS_CONFIG[t.transit_planet];
            const natalPlanet = PLANETS_CONFIG[t.natal_planet];
            const zodiac = ZODIAC_SIGNS[t.transit_sign];

            return (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span style={{ color: transitPlanet?.color }}>
                      {transitPlanet?.symbol || "•"}
                    </span>
                    <span className="text-gray-700 text-xs">
                      {t.transit_planet}
                    </span>
                    {t.is_retrograde && (
                      <span className="text-red-500 text-xs">℞</span>
                    )}
                  </div>
                </td>
                <td className="p-2 text-center">
                  <span
                    className="text-sm"
                    style={{ color: aspectConfig?.color }}
                  >
                    {aspectConfig?.symbol || "•"}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span style={{ color: natalPlanet?.color }}>
                      {natalPlanet?.symbol || "•"}
                    </span>
                    <span className="text-gray-700 text-xs">
                      {t.natal_planet}
                    </span>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span style={{ color: zodiac?.color }}>
                      {zodiac?.symbol}
                    </span>
                    <span className="text-gray-600 text-xs">
                      {t.transit_sign}
                    </span>
                  </div>
                </td>
                <td className="p-2 text-xs text-gray-500">
                  {t.start_time && (
                    <div>
                      <span className="text-gray-400">Start: </span>
                      {new Date(t.start_time).toLocaleDateString()}
                    </div>
                  )}
                  {t.exact_time && t.exact_time !== "-" && (
                    <div>
                      <span className="text-green-600">Exact: </span>
                      {new Date(t.exact_time).toLocaleDateString()}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ForecastCard({ forecast }: { forecast: any }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h4 className="font-medium text-gray-800 text-sm">
          {forecast.planet_position}
        </h4>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
          {forecast.date}
        </span>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          {forecast.forecast}
        </p>
      </div>
    </div>
  );
}

export default TransitsPage;
