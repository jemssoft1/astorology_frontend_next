"use client";

import React, { useState } from "react";
import Iconify from "@/components/Iconify";
import PersonSelector from "@/components/PersonSelector";
import PageHeader from "@/components/PageHeader";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";

// ============ CONSTANTS ============

const HOUSE_SYSTEMS = [
  { value: "placidus", label: "Placidus" },
  { value: "koch", label: "Koch" },
  { value: "whole_sign", label: "Whole Sign" },
  { value: "equal_house", label: "Equal House" },
];

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
  Node: { symbol: "☊", color: "#84CC16" },
  Chiron: { symbol: "⚷", color: "#A855F7" },
  Ascendant: { symbol: "AC", color: "#DC2626" },
  Midheaven: { symbol: "MC", color: "#2563EB" },
  "Part of Fortune": { symbol: "⊗", color: "#FBBF24" },
  Lilith: { symbol: "⚸", color: "#1F2937" },
};

const ZODIAC_SIGNS: Record<
  string,
  { symbol: string; element: string; color: string }
> = {
  Aries: { symbol: "♈", element: "Fire", color: "#EF4444" },
  Taurus: { symbol: "♉", element: "Earth", color: "#84CC16" },
  Gemini: { symbol: "♊", element: "Air", color: "#FBBF24" },
  Cancer: { symbol: "♋", element: "Water", color: "#3B82F6" },
  Leo: { symbol: "♌", element: "Fire", color: "#F97316" },
  Virgo: { symbol: "♍", element: "Earth", color: "#22C55E" },
  Libra: { symbol: "♎", element: "Air", color: "#EC4899" },
  Scorpio: { symbol: "♏", element: "Water", color: "#7C3AED" },
  Sagittarius: { symbol: "♐", element: "Fire", color: "#8B5CF6" },
  Capricorn: { symbol: "♑", element: "Earth", color: "#6B7280" },
  Aquarius: { symbol: "♒", element: "Air", color: "#06B6D4" },
  Pisces: { symbol: "♓", element: "Water", color: "#14B8A6" },
};

const ASPECT_SYMBOLS: Record<string, { symbol: string; color: string }> = {
  Conjunction: { symbol: "☌", color: "#EF4444" },
  Opposition: { symbol: "☍", color: "#3B82F6" },
  Trine: { symbol: "△", color: "#22C55E" },
  Square: { symbol: "□", color: "#F97316" },
  Sextile: { symbol: "⚹", color: "#8B5CF6" },
  Quincunx: { symbol: "⚻", color: "#6B7280" },
  "Semi Sextile": { symbol: "⚺", color: "#9CA3AF" },
  "Semi Square": { symbol: "∠", color: "#D97706" },
  Quintile: { symbol: "Q", color: "#14B8A6" },
};

const HOUSE_MEANINGS = [
  "Self & Identity",
  "Money & Values",
  "Communication",
  "Home & Family",
  "Creativity & Romance",
  "Health & Work",
  "Partnerships",
  "Transformation",
  "Philosophy & Travel",
  "Career & Status",
  "Friends & Goals",
  "Spirituality & Secrets",
];

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "planets", label: "Planets", icon: "mdi:earth" },
  { key: "houses", label: "Houses", icon: "mdi:home-outline" },
  { key: "aspects", label: "Aspects", icon: "mdi:vector-triangle" },
  { key: "reports", label: "Reports", icon: "mdi:file-document-outline" },
];

// ============ MAIN COMPONENT ============

function WesternAstrologyPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [houseSystem, setHouseSystem] = useState<string>("placidus");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedPlanet, setSelectedPlanet] = useState<string>("Sun");

  // Generate chart
  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person to generate the report.",
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
        house_type: houseSystem,
      };

      const response = await fetch("/api/natal-chart", {
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

  // Extract data helpers
  const getPlanets = () => {
    return (
      result?.data?.basic?.planets?.data?.planets ||
      result?.data?.basic?.horoscope?.data?.planets ||
      []
    );
  };

  const getHouses = () => {
    return (
      result?.data?.basic?.house_cusps?.data?.houses ||
      result?.data?.basic?.horoscope?.data?.houses ||
      []
    );
  };

  const getAspects = () => {
    return (
      result?.data?.basic?.horoscope?.data?.aspects ||
      result?.data?.basic?.chart_data?.data?.aspects ||
      []
    );
  };

  const getChartUrl = () => {
    return result?.data?.basic?.natal_wheel?.data?.chart_url || null;
  };

  const getAscendant = () => {
    const horoscope = result?.data?.basic?.horoscope?.data;
    if (horoscope?.ascendant) {
      const degree = horoscope.ascendant;
      const signIndex = Math.floor(degree / 30);
      const signs = Object.keys(ZODIAC_SIGNS);
      return signs[signIndex] || "—";
    }
    return "—";
  };

  const getMidheaven = () => {
    const horoscope = result?.data?.basic?.horoscope?.data;
    if (horoscope?.midheaven) {
      const degree = horoscope.midheaven;
      const signIndex = Math.floor(degree / 30);
      const signs = Object.keys(ZODIAC_SIGNS);
      return signs[signIndex] || "—";
    }
    return "—";
  };

  const getMoonPhase = () => {
    return result?.data?.basic?.horoscope?.data?.moon_phase || null;
  };

  const getElements = () => {
    return result?.data?.basic?.horoscope?.data?.elements || null;
  };

  const getModes = () => {
    return result?.data?.basic?.horoscope?.data?.modes || null;
  };

  const getDominantSign = () => {
    return result?.data?.basic?.horoscope?.data?.dominant_sign || null;
  };

  return (
    <div className="container mx-auto pb-12">
      <PageHeader
        title="Western Natal Chart"
        description="Complete Western astrology analysis"
        imageSrc="/images/western-astrology-banner.jpg"
      />

      {/* Input Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <PersonSelector onPersonSelected={setSelectedPerson} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              House System
            </label>
            <select
              value={houseSystem}
              onChange={(e) => setHouseSystem(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {HOUSE_SYSTEMS.map((hs) => (
                <option key={hs.value} value={hs.value}>
                  {hs.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={handleCalculate}
              disabled={loading || !selectedPerson}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                loading || !selectedPerson
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <Iconify
                    icon="mdi:loading"
                    className="animate-spin"
                    width={18}
                  />
                  Generating...
                </>
              ) : (
                <>
                  <Iconify icon="mdi:chart-arc" width={18} />
                  Generate Chart
                </>
              )}
            </button>
          </div>
        </div>

        {/* Person Info */}
        {selectedPerson && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
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
              <span className="text-gray-600">Date:</span>
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
              <span className="font-medium truncate">
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
                      ? "border-blue-600 text-blue-600"
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
              <div className="space-y-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <SummaryCard
                    label="Sun Sign"
                    value={
                      getPlanets().find((p: any) => p.name === "Sun")?.sign ||
                      "—"
                    }
                    symbol={PLANETS_CONFIG.Sun.symbol}
                    color={PLANETS_CONFIG.Sun.color}
                  />
                  <SummaryCard
                    label="Moon Sign"
                    value={
                      getPlanets().find((p: any) => p.name === "Moon")?.sign ||
                      "—"
                    }
                    symbol={PLANETS_CONFIG.Moon.symbol}
                    color={PLANETS_CONFIG.Moon.color}
                  />
                  <SummaryCard
                    label="Ascendant"
                    value={getAscendant()}
                    symbol="AC"
                    color="#DC2626"
                  />
                  <SummaryCard
                    label="Midheaven"
                    value={getMidheaven()}
                    symbol="MC"
                    color="#2563EB"
                  />
                </div>

                {/* Chart Image & Quick Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Natal Wheel Chart */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Natal Wheel Chart
                    </h3>
                    {getChartUrl() ? (
                      <img
                        src={getChartUrl()}
                        alt="Natal Wheel Chart"
                        className="w-full max-w-md mx-auto"
                      />
                    ) : (
                      <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">
                          Chart not available
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-4">
                    {/* Moon Phase */}
                    {getMoonPhase() && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                          Moon Phase
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                            🌓
                          </div>
                          <div>
                            <p className="font-medium">
                              {getMoonPhase().moon_phase_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {getMoonPhase().moon_phase_calc}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dominant Sign */}
                    {getDominantSign() && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                          Dominant Sign
                        </h3>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                            style={{
                              backgroundColor: `${ZODIAC_SIGNS[getDominantSign().sign_name]?.color}15`,
                              color:
                                ZODIAC_SIGNS[getDominantSign().sign_name]
                                  ?.color,
                            }}
                          >
                            {ZODIAC_SIGNS[getDominantSign().sign_name]?.symbol}
                          </div>
                          <div>
                            <p className="font-medium">
                              {getDominantSign().sign_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {getDominantSign().percentage?.toFixed(1)}%
                              dominance
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Elements */}
                    {getElements() && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Elements
                        </h3>
                        <div className="space-y-2">
                          {getElements().elements?.map((el: any) => (
                            <div
                              key={el.name}
                              className="flex items-center gap-2"
                            >
                              <span className="w-16 text-sm text-gray-600">
                                {el.name}
                              </span>
                              <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                                <div
                                  className="h-2.5 rounded-full"
                                  style={{
                                    width: `${el.percentage}%`,
                                    backgroundColor:
                                      el.name === "Fire"
                                        ? "#EF4444"
                                        : el.name === "Earth"
                                          ? "#22C55E"
                                          : el.name === "Air"
                                            ? "#FBBF24"
                                            : "#3B82F6",
                                  }}
                                />
                              </div>
                              <span className="w-12 text-sm text-gray-500 text-right">
                                {el.percentage?.toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Modes */}
                    {getModes() && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Modes
                        </h3>
                        <div className="space-y-2">
                          {getModes().modes?.map((mode: any) => (
                            <div
                              key={mode.name}
                              className="flex items-center gap-2"
                            >
                              <span className="w-16 text-sm text-gray-600">
                                {mode.name}
                              </span>
                              <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                                <div
                                  className="h-2.5 rounded-full bg-blue-500"
                                  style={{ width: `${mode.percentage}%` }}
                                />
                              </div>
                              <span className="w-12 text-sm text-gray-500 text-right">
                                {mode.percentage?.toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Planets Quick Table */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Planetary Positions
                  </h3>
                  <PlanetsTable planets={getPlanets()} />
                </div>
              </div>
            )}

            {/* ============ PLANETS TAB ============ */}
            {activeTab === "planets" && (
              <div className="space-y-6">
                {/* Full Planets Table */}
                <PlanetsTable planets={getPlanets()} showDetails />

                {/* Planet Reports */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Planet Reports
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      "Sun",
                      "Moon",
                      "Mars",
                      "Mercury",
                      "Jupiter",
                      "Venus",
                      "Saturn",
                    ].map((planet) => (
                      <button
                        key={planet}
                        onClick={() => setSelectedPlanet(planet)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          selectedPlanet === planet
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <span className="mr-1">
                          {PLANETS_CONFIG[planet]?.symbol}
                        </span>
                        {planet}
                      </button>
                    ))}
                  </div>

                  {/* Selected Planet Reports */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sign Report */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span
                          style={{
                            color: PLANETS_CONFIG[selectedPlanet]?.color,
                          }}
                        >
                          {PLANETS_CONFIG[selectedPlanet]?.symbol}
                        </span>
                        {selectedPlanet} in Sign
                      </h4>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        {result?.data?.planets?.[selectedPlanet.toLowerCase()]
                          ?.sign_report?.report || "Report not available"}
                      </div>
                    </div>

                    {/* House Report */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span
                          style={{
                            color: PLANETS_CONFIG[selectedPlanet]?.color,
                          }}
                        >
                          {PLANETS_CONFIG[selectedPlanet]?.symbol}
                        </span>
                        {selectedPlanet} in House
                      </h4>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        {result?.data?.planets?.[selectedPlanet.toLowerCase()]
                          ?.house_report?.report || "Report not available"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============ HOUSES TAB ============ */}
            {activeTab === "houses" && (
              <div className="space-y-6">
                {/* Houses Table */}
                <HousesTable houses={getHouses()} />

                {/* Houses Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getHouses().map((house: any, idx: number) => (
                    <HouseCard
                      key={idx}
                      houseNumber={house.house || idx + 1}
                      sign={house.sign}
                      degree={house.degree}
                      meaning={HOUSE_MEANINGS[idx]}
                    />
                  ))}
                </div>

                {/* House Cusp Reports */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    House Interpretations
                  </h3>
                  <div className="space-y-3">
                    {result?.data?.basic?.house_cusps_report?.data?.houses?.map(
                      (house: any, idx: number) => (
                        <div
                          key={idx}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-8 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center font-semibold text-sm">
                              {house.house || idx + 1}
                            </span>
                            <span className="font-medium text-gray-800">
                              House {house.house || idx + 1} - {house.sign}
                            </span>
                            <span className="text-sm text-gray-500">
                              ({HOUSE_MEANINGS[idx]})
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {house.report}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============ ASPECTS TAB ============ */}
            {activeTab === "aspects" && (
              <div className="space-y-6">
                <AspectsTable aspects={getAspects()} />

                {/* Aspects Summary */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Aspect Types
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(ASPECT_SYMBOLS).map(
                      ([name, { symbol, color }]) => {
                        const count = getAspects().filter(
                          (a: any) =>
                            a.type?.toLowerCase() === name.toLowerCase(),
                        ).length;
                        if (count === 0) return null;
                        return (
                          <div
                            key={name}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg"
                          >
                            <span style={{ color }} className="text-lg">
                              {symbol}
                            </span>
                            <span className="text-sm text-gray-700">
                              {name}
                            </span>
                            <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                              {count}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ============ REPORTS TAB ============ */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                {/* Ascendant Report */}
                {result?.data?.basic?.ascendant_report?.data && (
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                      Ascendant Report
                    </h3>
                    <p className="text-lg font-medium text-gray-800 mb-3">
                      {result.data.basic.ascendant_report.data.ascendant} Rising
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {result.data.basic.ascendant_report.data.report}
                    </p>
                  </div>
                )}

                {/* Chart Interpretation */}
                {result?.data?.basic?.interpretation?.data && (
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Chart Interpretation
                    </h3>
                    <DataRenderer
                      data={result.data.basic.interpretation.data}
                    />
                  </div>
                )}

                {/* Hemisphere */}
                {result?.data?.basic?.horoscope?.data?.hemisphere && (
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Hemisphere Emphasis
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800 mb-1">
                          East-West
                        </p>
                        <p className="text-sm text-gray-600">
                          {
                            result.data.basic.horoscope.data.hemisphere
                              .east_west?.description
                          }
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800 mb-1">
                          North-South
                        </p>
                        <p className="text-sm text-gray-600">
                          {
                            result.data.basic.horoscope.data.hemisphere
                              .north_south?.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Moon Phase Description */}
                {getMoonPhase()?.moon_phase_description && (
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Moon Phase: {getMoonPhase().moon_phase_name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {getMoonPhase().moon_phase_description}
                    </p>
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
            icon="mdi:chart-arc"
            width={48}
            className="text-gray-300 mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No Chart Generated
          </h3>
          <p className="text-sm text-gray-500">
            Select a profile and click "Generate Chart" to see your Western
            astrology analysis.
          </p>
        </div>
      )}
    </div>
  );
}

// ============ SUB COMPONENTS ============

function SummaryCard({
  label,
  value,
  symbol,
  color,
}: {
  label: string;
  value: string;
  symbol: string;
  color: string;
}) {
  const zodiacInfo = ZODIAC_SIGNS[value];
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-semibold"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {symbol}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <div className="flex items-center gap-1.5">
            {zodiacInfo && (
              <span style={{ color: zodiacInfo.color }}>
                {zodiacInfo.symbol}
              </span>
            )}
            <span className="font-semibold text-gray-800">{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanetsTable({
  planets,
  showDetails = false,
}: {
  planets: any[];
  showDetails?: boolean;
}) {
  if (!planets || planets.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        No planetary data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-3 font-semibold text-gray-600">
              Planet
            </th>
            <th className="text-left p-3 font-semibold text-gray-600">Sign</th>
            <th className="text-left p-3 font-semibold text-gray-600">
              Degree
            </th>
            <th className="text-left p-3 font-semibold text-gray-600">House</th>
            {showDetails && (
              <>
                <th className="text-left p-3 font-semibold text-gray-600">
                  Speed
                </th>
              </>
            )}
            <th className="text-center p-3 font-semibold text-gray-600">
              Retro
            </th>
          </tr>
        </thead>
        <tbody>
          {planets.map((planet: any, idx: number) => {
            const config = PLANETS_CONFIG[planet.name] || {
              symbol: "•",
              color: "#6B7280",
            };
            const zodiac = ZODIAC_SIGNS[planet.sign];
            const isRetro =
              planet.is_retro === "true" || planet.isRetro === "true";

            return (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: config.color }} className="text-lg">
                      {config.symbol}
                    </span>
                    <span className="font-medium text-gray-800">
                      {planet.name}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    {zodiac && (
                      <span style={{ color: zodiac.color }}>
                        {zodiac.symbol}
                      </span>
                    )}
                    <span className="text-gray-700">{planet.sign}</span>
                  </div>
                </td>
                <td className="p-3 text-gray-600">
                  {(
                    planet.norm_degree ||
                    planet.normDegree ||
                    planet.full_degree
                  )?.toFixed(2)}
                  °
                </td>
                <td className="p-3 text-gray-600">{planet.house || "—"}</td>
                {showDetails && (
                  <td className="p-3 text-gray-600">
                    {planet.speed?.toFixed(4) || "—"}
                  </td>
                )}
                <td className="p-3 text-center">
                  {isRetro ? (
                    <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                      <Iconify icon="mdi:rotate-left" width={14} />R
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
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

function HousesTable({ houses }: { houses: any[] }) {
  if (!houses || houses.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        No house data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-center p-3 font-semibold text-gray-600 w-20">
              House
            </th>
            <th className="text-left p-3 font-semibold text-gray-600">Sign</th>
            <th className="text-left p-3 font-semibold text-gray-600">
              Cusp Degree
            </th>
            <th className="text-left p-3 font-semibold text-gray-600">
              Meaning
            </th>
          </tr>
        </thead>
        <tbody>
          {houses.map((house: any, idx: number) => {
            const zodiac = ZODIAC_SIGNS[house.sign];
            return (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-700 rounded-lg font-semibold">
                    {house.house || idx + 1}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    {zodiac && (
                      <span style={{ color: zodiac.color }} className="text-lg">
                        {zodiac.symbol}
                      </span>
                    )}
                    <span className="text-gray-700">{house.sign}</span>
                  </div>
                </td>
                <td className="p-3 text-gray-600">
                  {house.degree?.toFixed(2)}°
                </td>
                <td className="p-3 text-gray-500 text-xs">
                  {HOUSE_MEANINGS[idx]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function HouseCard({
  houseNumber,
  sign,
  degree,
  meaning,
}: {
  houseNumber: number;
  sign: string;
  degree: number;
  meaning: string;
}) {
  const zodiac = ZODIAC_SIGNS[sign];
  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-7 h-7 bg-blue-50 text-blue-700 rounded flex items-center justify-center font-semibold text-sm">
          {houseNumber}
        </span>
        <div className="flex items-center gap-1">
          {zodiac && (
            <span style={{ color: zodiac.color }}>{zodiac.symbol}</span>
          )}
          <span className="font-medium text-gray-800">{sign}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500">{meaning}</p>
      <p className="text-xs text-gray-400 mt-1">{degree?.toFixed(2)}°</p>
    </div>
  );
}

function AspectsTable({ aspects }: { aspects: any[] }) {
  if (!aspects || aspects.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        No aspect data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-3 font-semibold text-gray-600">
              Planet 1
            </th>
            <th className="text-center p-3 font-semibold text-gray-600">
              Aspect
            </th>
            <th className="text-left p-3 font-semibold text-gray-600">
              Planet 2
            </th>
            <th className="text-left p-3 font-semibold text-gray-600">Orb</th>
          </tr>
        </thead>
        <tbody>
          {aspects.map((aspect: any, idx: number) => {
            const aspectConfig = ASPECT_SYMBOLS[aspect.type] || {
              symbol: "•",
              color: "#6B7280",
            };
            const planet1 = PLANETS_CONFIG[aspect.aspecting_planet] || {
              symbol: "•",
              color: "#6B7280",
            };
            const planet2 = PLANETS_CONFIG[aspect.aspected_planet] || {
              symbol: "•",
              color: "#6B7280",
            };

            return (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: planet1.color }}>
                      {planet1.symbol}
                    </span>
                    <span className="text-gray-700">
                      {aspect.aspecting_planet}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs font-medium"
                    style={{ color: aspectConfig.color }}
                  >
                    <span className="text-base">{aspectConfig.symbol}</span>
                    {aspect.type}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: planet2.color }}>
                      {planet2.symbol}
                    </span>
                    <span className="text-gray-700">
                      {aspect.aspected_planet}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-gray-600">{aspect.orb?.toFixed(2)}°</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DataRenderer({ data }: { data: any }) {
  if (data === null || data === undefined)
    return <span className="text-gray-400">—</span>;
  if (typeof data !== "object")
    return <span className="text-gray-700">{String(data)}</span>;

  if (Array.isArray(data)) {
    return (
      <div className="space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="pl-3 border-l-2 border-gray-200">
            <DataRenderer data={item} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="text-sm">
          <span className="font-medium text-gray-600 capitalize">
            {key.replace(/_/g, " ")}:{" "}
          </span>
          <DataRenderer data={value} />
        </div>
      ))}
    </div>
  );
}

export default WesternAstrologyPage;
