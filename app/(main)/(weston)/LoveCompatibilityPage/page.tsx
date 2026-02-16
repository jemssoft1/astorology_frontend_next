"use client";

import React, { useState } from "react";
import Iconify from "@/components/Iconify";
import PersonSelector from "@/components/PersonSelector";
import PageHeader from "@/components/PageHeader";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";

// ============ CONSTANTS ============

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
  "Part of Fortune": { symbol: "⊕", color: "#059669" },
};

const ASPECT_CONFIG: Record<
  string,
  { symbol: string; color: string; type: string }
> = {
  Conjunction: { symbol: "☌", color: "#EF4444", type: "major" },
  Opposition: { symbol: "☍", color: "#3B82F6", type: "major" },
  Trine: { symbol: "△", color: "#22C55E", type: "major" },
  Square: { symbol: "□", color: "#F97316", type: "major" },
  Sextile: { symbol: "⚹", color: "#8B5CF6", type: "major" },
  Quincunx: { symbol: "⚻", color: "#6B7280", type: "minor" },
  "Semi Sextile": { symbol: "⚺", color: "#9CA3AF", type: "minor" },
  "Semi Square": { symbol: "∠", color: "#D97706", type: "minor" },
  Quintile: { symbol: "Q", color: "#14B8A6", type: "minor" },
};

// Updated TABS
const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:heart-multiple-outline" },
  { key: "synastry", label: "Synastry", icon: "mdi:vector-intersection" },
  { key: "composite", label: "Composite", icon: "mdi:chart-arc" },
  { key: "karma", label: "Karma & Destiny", icon: "mdi:infinity" },
  {
    key: "friendship",
    label: "Friendship Forecast",
    icon: "mdi:account-group",
  },
  {
    key: "personality",
    label: "Romantic Personality",
    icon: "mdi:account-heart",
  },
];

// ============ MAIN COMPONENT ============

function LoveCompatibilityPage() {
  const [partner1, setPartner1] = useState<Person | null>(null);
  const [partner2, setPartner2] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleCalculate = async () => {
    if (!partner1 || !partner2) {
      Swal.fire({
        icon: "warning",
        title: "Select Both Partners",
        text: "Please select both partners to check compatibility.",
      });
      return;
    }

    if (partner1.PersonId === partner2.PersonId) {
      Swal.fire({
        icon: "warning",
        title: "Different Partners Required",
        text: "Please select two different persons.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const p1Date = new Date(partner1.BirthTime);
      const p2Date = new Date(partner2.BirthTime);

      const requestBody = {
        p_day: p1Date.getDate(),
        p_month: p1Date.getMonth() + 1,
        p_year: p1Date.getFullYear(),
        p_hour: p1Date.getHours(),
        p_min: p1Date.getMinutes(),
        p_lat: partner1.Latitude,
        p_lon: partner1.Longitude,
        p_tzone: parseFloat(partner1.TimezoneOffset || "5.5"),
        s_day: p2Date.getDate(),
        s_month: p2Date.getMonth() + 1,
        s_year: p2Date.getFullYear(),
        s_hour: p2Date.getHours(),
        s_min: p2Date.getMinutes(),
        s_lat: partner2.Latitude,
        s_lon: partner2.Longitude,
        s_tzone: parseFloat(partner2.TimezoneOffset || "5.5"),
      };

      const response = await fetch("/api/love-compatibility", {
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

  // Data helpers - Updated based on actual API response
  const getSynastry = () => result?.data?.synastry || null;
  const getComposite = () => result?.data?.composite || null;
  const getKarmaDestiny = () => result?.data?.karma_destiny || null;
  const getFriendshipForecast = () => result?.data?.friendship || null;
  const getRomanticPersonality = () =>
    result?.data?.romantic_personality || null;
  const getPartners = () => result?.partners || null;

  // Check if data has error
  const hasError = (data: any) => data?.error === true;

  return (
    <div className="container mx-auto pb-12">
      <PageHeader
        title="Complete Compatibility"
        description="Discover all aspects of your compatibility through Western astrology"
        imageSrc="/images/love-compatibility-banner.jpg"
      />

      {/* Input Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                1
              </span>
              Partner 1
            </label>
            <PersonSelector onPersonSelected={setPartner1} />
          </div>

          <div className="hidden md:flex justify-center items-center">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
              <Iconify icon="mdi:heart" width={24} className="text-pink-500" />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">
                2
              </span>
              Partner 2
            </label>
            <PersonSelector onPersonSelected={setPartner2} />
          </div>
        </div>

        {(partner1 || partner2) && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            {partner1 && <PartnerInfoCard partner={partner1} color="blue" />}
            {partner2 && <PartnerInfoCard partner={partner2} color="pink" />}
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={handleCalculate}
            disabled={loading || !partner1 || !partner2}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
              loading || !partner1 || !partner2
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-pink-600 text-white hover:bg-pink-700"
            }`}
          >
            {loading ? (
              <>
                <Iconify
                  icon="mdi:loading"
                  className="animate-spin"
                  width={20}
                />
                Calculating All Compatibility...
              </>
            ) : (
              <>
                <Iconify icon="mdi:heart-multiple" width={20} />
                Check Complete Compatibility
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6">
          {/* Tabs - Scrollable */}
          <div className="bg-white border border-gray-200 rounded-t-lg">
            <div className="flex overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-pink-600 text-pink-600 bg-pink-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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
              <OverviewTab
                partner1={partner1}
                partner2={partner2}
                synastry={getSynastry()}
                composite={getComposite()}
                partners={getPartners()}
                karmaDestiny={getKarmaDestiny()}
                romanticPersonality={getRomanticPersonality()}
              />
            )}

            {/* ============ SYNASTRY TAB ============ */}
            {activeTab === "synastry" && (
              <SynastryTab
                synastry={getSynastry()}
                partner1={partner1}
                partner2={partner2}
              />
            )}

            {/* ============ COMPOSITE TAB ============ */}
            {activeTab === "composite" && (
              <CompositeTab composite={getComposite()} />
            )}

            {/* ============ KARMA & DESTINY TAB ============ */}
            {activeTab === "karma" && (
              <KarmaDestinyTab data={getKarmaDestiny()} />
            )}

            {/* ============ FRIENDSHIP FORECAST TAB ============ */}
            {activeTab === "friendship" && (
              <FriendshipForecastTab data={getFriendshipForecast()} />
            )}

            {/* ============ ROMANTIC PERSONALITY TAB ============ */}
            {activeTab === "personality" && (
              <RomanticPersonalityTab
                data={getRomanticPersonality()}
                partner1={partner1}
              />
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="mt-6 bg-white rounded-lg border-2 border-dashed border-gray-200 p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-4">
            <Iconify
              icon="mdi:heart-multiple"
              width={40}
              className="text-pink-300"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Complete Compatibility Analysis
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
            Get comprehensive compatibility insights including synastry,
            composite charts, karma & destiny analysis, and romantic personality
            profiles.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {TABS.map((tab) => (
              <span
                key={tab.key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                <Iconify icon={tab.icon} width={14} />
                {tab.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ TAB COMPONENTS ============

function OverviewTab({
  partner1,
  partner2,
  synastry,
  composite,
  partners,
  karmaDestiny,
  romanticPersonality,
}: {
  partner1: Person | null;
  partner2: Person | null;
  synastry: any;
  composite: any;
  partners: any;
  karmaDestiny: any;
  romanticPersonality: any;
}) {
  const partner1Sun = synastry?.first?.find((p: any) => p.name === "Sun");
  const partner2Sun = synastry?.second?.find((p: any) => p.name === "Sun");

  return (
    <div className="space-y-6">
      {/* Partners Header */}
      <div className="flex items-center justify-center gap-4 md:gap-8 py-4">
        <PartnerCircle
          partner={partner1}
          planets={synastry?.first}
          zodiac={partners?.primary?.zodiac}
          color="blue"
        />
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 flex items-center justify-center">
          <Iconify icon="mdi:heart" width={28} className="text-pink-500" />
        </div>
        <PartnerCircle
          partner={partner2}
          planets={synastry?.second}
          zodiac={partners?.secondary?.zodiac}
          color="pink"
        />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickStatCard
          icon="mdi:zodiac-aries"
          label="Zodiac Match"
          value={`${capitalize(partners?.primary?.zodiac || "?")} + ${capitalize(partners?.secondary?.zodiac || "?")}`}
          color="purple"
        />
        <QuickStatCard
          icon="mdi:white-balance-sunny"
          label="Sun Signs"
          value={`${partner1Sun?.sign || "?"} + ${partner2Sun?.sign || "?"}`}
          color="orange"
        />
        <QuickStatCard
          icon="mdi:moon-waning-crescent"
          label="Moon Signs"
          value={`${synastry?.first?.find((p: any) => p.name === "Moon")?.sign || "?"} + ${synastry?.second?.find((p: any) => p.name === "Moon")?.sign || "?"}`}
          color="blue"
        />
        <QuickStatCard
          icon="mdi:heart"
          label="Venus Signs"
          value={`${synastry?.first?.find((p: any) => p.name === "Venus")?.sign || "?"} + ${synastry?.second?.find((p: any) => p.name === "Venus")?.sign || "?"}`}
          color="pink"
        />
      </div>

      {/* Key Planets Comparison */}
      {synastry && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Iconify icon="mdi:compare" width={18} className="text-gray-500" />
            Key Planets Comparison
          </h3>
          <PlanetsComparisonTable
            first={synastry.first}
            second={synastry.second}
            partner1Name={partner1?.Name || "Partner 1"}
            partner2Name={partner2?.Name || "Partner 2"}
          />
        </div>
      )}

      {/* Composite Quick View */}
      {composite?.composite?.planets && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Iconify
              icon="mdi:chart-arc"
              width={18}
              className="text-gray-500"
            />
            Relationship Energy (Composite Chart)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Sun", "Moon", "Venus", "Mars"].map((planet) => {
              const p = composite.composite.planets?.find(
                (pl: any) => pl.name === planet,
              );
              if (!p) return null;
              const zodiac = ZODIAC_SIGNS[p.sign];
              const planetConfig = PLANETS_CONFIG[planet];
              return (
                <div
                  key={planet}
                  className="border border-gray-200 rounded-lg p-3 text-center hover:border-gray-300 transition-colors"
                >
                  <span
                    className="text-2xl"
                    style={{ color: planetConfig?.color }}
                  >
                    {planetConfig?.symbol}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{planet}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span style={{ color: zodiac?.color }}>
                      {zodiac?.symbol}
                    </span>
                    <span className="font-medium text-gray-800 text-sm">
                      {p.sign}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">House {p.house}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Karma & Destiny Preview */}
      {karmaDestiny?.friendship_report && !karmaDestiny.error && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Iconify
              icon="mdi:infinity"
              width={18}
              className="text-purple-500"
            />
            Karmic Connection Highlights
          </h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800 leading-relaxed">
              {karmaDestiny.friendship_report[0]?.substring(0, 300)}...
            </p>
            <button
              onClick={() => {}}
              className="text-purple-600 text-sm font-medium mt-2 hover:underline"
            >
              Read full analysis in Karma & Destiny tab →
            </button>
          </div>
        </div>
      )}

      {/* Romantic Personality Preview */}
      {romanticPersonality?.report && !romanticPersonality.error && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Iconify
              icon="mdi:account-heart"
              width={18}
              className="text-rose-500"
            />
            {partner1?.Name}'s Romantic Style
          </h3>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="text-sm text-rose-800 leading-relaxed">
              {romanticPersonality.report[0]}
            </p>
          </div>
        </div>
      )}

      {/* Key Synastry Aspects */}
      {synastry?.synastry?.aspects && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Iconify
              icon="mdi:vector-intersection"
              width={18}
              className="text-gray-500"
            />
            Key Relationship Aspects
          </h3>
          <KeyAspectsGrid aspects={synastry.synastry.aspects} />
        </div>
      )}
    </div>
  );
}

function SynastryTab({
  synastry,
  partner1,
  partner2,
}: {
  synastry: any;
  partner1: Person | null;
  partner2: Person | null;
}) {
  const [showAllAspects, setShowAllAspects] = useState(false);

  if (!synastry) {
    return <NoDataMessage message="Synastry data not available" />;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Synastry compares both birth charts to reveal how your planets interact
        with each other.
      </p>

      {/* Both Partners Planets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-blue-50 border-b border-gray-200 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h4 className="font-medium text-gray-800">
              {partner1?.Name}'s Planets
            </h4>
          </div>
          <div className="p-4">
            <PlanetsTable planets={synastry.first} />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-pink-50 border-b border-gray-200 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h4 className="font-medium text-gray-800">
              {partner2?.Name}'s Planets
            </h4>
          </div>
          <div className="p-4">
            <PlanetsTable planets={synastry.second} />
          </div>
        </div>
      </div>

      {/* Synastry House Overlays */}
      {synastry.synastry?.house_1 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            House Overlays - {partner1?.Name}'s Planets in {partner2?.Name}'s
            Houses
          </h3>
          <HouseOverlayTable
            houses={synastry.synastry.house_1}
            partnerName={partner2?.Name || "Partner 2"}
          />
        </div>
      )}

      {synastry.synastry?.house_2 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            House Overlays - {partner2?.Name}'s Planets in {partner1?.Name}'s
            Houses
          </h3>
          <HouseOverlayTable
            houses={synastry.synastry.house_2}
            partnerName={partner1?.Name || "Partner 1"}
          />
        </div>
      )}

      {/* Synastry Aspects */}
      {synastry.synastry?.aspects && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Cross-Chart Aspects ({synastry.synastry.aspects.length} total)
            </h3>
            <button
              onClick={() => setShowAllAspects(!showAllAspects)}
              className="text-sm text-pink-600 hover:underline"
            >
              {showAllAspects ? "Show Major Only" : "Show All Aspects"}
            </button>
          </div>
          <SynastryAspectsTable
            aspects={synastry.synastry.aspects}
            showAll={showAllAspects}
          />
        </div>
      )}
    </div>
  );
}

function CompositeTab({ composite }: { composite: any }) {
  if (!composite?.composite) {
    return <NoDataMessage message="Composite chart data not available" />;
  }

  const comp = composite.composite;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        The composite chart represents your relationship as a single entity -
        the energy you create together as a couple.
      </p>

      {/* Ascendant & Midheaven */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4 text-center">
          <span
            className="text-2xl"
            style={{ color: PLANETS_CONFIG.Ascendant.color }}
          >
            {PLANETS_CONFIG.Ascendant.symbol}
          </span>
          <p className="text-xs text-gray-500 mt-1">Ascendant</p>
          <p className="font-medium text-gray-800">
            {comp.houses?.find((h: any) => h.house === 1)?.sign || "N/A"}
          </p>
          <p className="text-xs text-gray-400">{comp.ascendant?.toFixed(2)}°</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 text-center">
          <span
            className="text-2xl"
            style={{ color: PLANETS_CONFIG.Midheaven.color }}
          >
            {PLANETS_CONFIG.Midheaven.symbol}
          </span>
          <p className="text-xs text-gray-500 mt-1">Midheaven</p>
          <p className="font-medium text-gray-800">
            {comp.houses?.find((h: any) => h.house === 10)?.sign || "N/A"}
          </p>
          <p className="text-xs text-gray-400">{comp.midheaven?.toFixed(2)}°</p>
        </div>
      </div>

      {/* Composite Planets */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Composite Planets
        </h3>
        <PlanetsTable planets={comp.planets} showFullDegree />
      </div>

      {/* Composite Houses */}
      {comp.houses && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Composite Houses
          </h3>
          <HousesGrid houses={comp.houses} />
        </div>
      )}

      {/* Composite Aspects */}
      {comp.aspects && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Composite Aspects
          </h3>
          <CompositeAspectsTable aspects={comp.aspects} />
        </div>
      )}
    </div>
  );
}

function KarmaDestinyTab({ data }: { data: any }) {
  if (!data || data.error) {
    return <NoDataMessage message="Karma & Destiny data not available" />;
  }

  const reports = data.friendship_report || [];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Karmic connections and destiny patterns in your relationship -
        understanding the deeper purpose of your bond.
      </p>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report: string, idx: number) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-5 hover:border-purple-200 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 font-semibold text-sm">
                    {idx + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {report}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoDataMessage message="No karma & destiny insights available" />
      )}

      {/* Summary Card */}
      {reports.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-5">
          <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
            <Iconify icon="mdi:lightbulb" width={18} />
            Key Takeaway
          </h4>
          <p className="text-sm text-purple-700">
            Your karmic connection shows {reports.length} key areas of soul
            growth and learning together. These insights reveal the deeper
            spiritual purpose of your relationship beyond the surface level
            attraction.
          </p>
        </div>
      )}
    </div>
  );
}

function FriendshipForecastTab({ data }: { data: any }) {
  if (!data || data.error) {
    return <NoDataMessage message="Friendship forecast data not available" />;
  }

  const forecasts = data.romantic_forecast || [];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Romantic transits and forecasts for the relationship - upcoming
        planetary influences affecting your bond.
      </p>

      {forecasts.length > 0 ? (
        <div className="space-y-4">
          {forecasts.map((forecast: any, idx: number) => (
            <ForecastCard key={idx} forecast={forecast} index={idx} />
          ))}
        </div>
      ) : (
        <NoDataMessage message="No forecast data available" />
      )}
    </div>
  );
}

function RomanticPersonalityTab({
  data,
  partner1,
}: {
  data: any;
  partner1: Person | null;
}) {
  if (!data || data.error) {
    return <NoDataMessage message="Romantic personality data not available" />;
  }

  const reports = data.report || [];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        {partner1?.Name}'s romantic personality profile - understanding their
        love style and relationship needs.
      </p>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
            <Iconify
              icon="mdi:account-heart"
              width={32}
              className="text-rose-500"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {partner1?.Name}'s Love Profile
            </h3>
            <p className="text-sm text-gray-500">
              Based on natal chart analysis
            </p>
          </div>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report: string, idx: number) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 hover:border-rose-200 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Iconify
                    icon="mdi:heart"
                    width={14}
                    className="text-rose-500"
                  />
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {report}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoDataMessage message="No romantic personality insights available" />
      )}

      {/* Love Style Summary */}
      {reports.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
            <Iconify icon="mdi:star" width={18} />
            Relationship Summary
          </h4>
          <p className="text-sm text-amber-700">
            {partner1?.Name} brings {reports.length} unique romantic qualities
            to relationships. Understanding these traits can help build a
            stronger, more harmonious connection.
          </p>
        </div>
      )}
    </div>
  );
}

// ============ HELPER COMPONENTS ============

function PartnerInfoCard({
  partner,
  color,
}: {
  partner: Person;
  color: "blue" | "pink";
}) {
  const bgColor = color === "blue" ? "bg-blue-50" : "bg-pink-50";
  const iconColor = color === "blue" ? "text-blue-600" : "text-pink-600";
  const iconBg = color === "blue" ? "bg-blue-100" : "bg-pink-100";

  return (
    <div className={`${bgColor} rounded-lg p-3`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}
        >
          <Iconify icon="mdi:account" width={20} className={iconColor} />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-800 truncate">{partner.Name}</p>
          <p className="text-xs text-gray-500 truncate">
            {new Date(partner.BirthTime).toLocaleDateString()} •{" "}
            {partner.BirthLocation}
          </p>
        </div>
      </div>
    </div>
  );
}

function PartnerCircle({
  partner,
  planets,
  zodiac,
  color,
}: {
  partner: Person | null;
  planets: any[] | null;
  zodiac?: string;
  color: "blue" | "pink";
}) {
  const bgColor = color === "blue" ? "bg-blue-100" : "bg-pink-100";
  const textColor = color === "blue" ? "text-blue-600" : "text-pink-600";

  const sunSign = planets?.find((p) => p.name === "Sun")?.sign;
  const zodiacData = sunSign ? ZODIAC_SIGNS[sunSign] : null;

  return (
    <div className="text-center">
      <div
        className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${bgColor} flex flex-col items-center justify-center mx-auto mb-2`}
      >
        {zodiacData ? (
          <span
            className="text-3xl md:text-4xl"
            style={{ color: zodiacData.color }}
          >
            {zodiacData.symbol}
          </span>
        ) : (
          <Iconify icon="mdi:account" width={36} className={textColor} />
        )}
      </div>
      <p className="font-semibold text-gray-800 text-sm md:text-base">
        {partner?.Name}
      </p>
      {sunSign && <p className="text-xs text-gray-500">{sunSign}</p>}
      {zodiac && !sunSign && (
        <p className="text-xs text-gray-500 capitalize">{zodiac}</p>
      )}
    </div>
  );
}

function QuickStatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: "purple" | "pink" | "orange" | "blue" | "green";
}) {
  const colors = {
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    pink: "bg-pink-50 text-pink-600 border-pink-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
  };

  return (
    <div className={`${colors[color]} rounded-lg p-3 text-center border`}>
      <Iconify icon={icon} width={22} className="mx-auto mb-1" />
      <p className="text-xs opacity-75 mb-1">{label}</p>
      <p className="font-semibold text-xs md:text-sm truncate">{value}</p>
    </div>
  );
}

function NoDataMessage({ message }: { message: string }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <Iconify icon="mdi:database-off" width={40} className="mx-auto mb-3" />
      <p>{message}</p>
    </div>
  );
}

function PlanetsComparisonTable({
  first,
  second,
  partner1Name,
  partner2Name,
}: {
  first: any[];
  second: any[];
  partner1Name: string;
  partner2Name: string;
}) {
  const keyPlanets = ["Sun", "Moon", "Venus", "Mars", "Mercury", "Jupiter"];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-3 font-semibold text-gray-600">
              Planet
            </th>
            <th className="text-left p-3 font-semibold text-blue-600">
              {partner1Name}
            </th>
            <th className="text-left p-3 font-semibold text-pink-600">
              {partner2Name}
            </th>
          </tr>
        </thead>
        <tbody>
          {keyPlanets.map((planetName) => {
            const p1 = first?.find((p) => p.name === planetName);
            const p2 = second?.find((p) => p.name === planetName);
            const planetConfig = PLANETS_CONFIG[planetName];

            return (
              <tr
                key={planetName}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ color: planetConfig?.color }}
                      className="text-lg"
                    >
                      {planetConfig?.symbol}
                    </span>
                    <span className="font-medium text-gray-700">
                      {planetName}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  {p1 && (
                    <div className="flex items-center gap-2">
                      <span
                        style={{ color: ZODIAC_SIGNS[p1.sign]?.color }}
                        className="text-lg"
                      >
                        {ZODIAC_SIGNS[p1.sign]?.symbol}
                      </span>
                      <div>
                        <span className="text-gray-700">{p1.sign}</span>
                        <span className="text-gray-400 text-xs ml-1">
                          H{p1.house}
                        </span>
                      </div>
                    </div>
                  )}
                </td>
                <td className="p-3">
                  {p2 && (
                    <div className="flex items-center gap-2">
                      <span
                        style={{ color: ZODIAC_SIGNS[p2.sign]?.color }}
                        className="text-lg"
                      >
                        {ZODIAC_SIGNS[p2.sign]?.symbol}
                      </span>
                      <div>
                        <span className="text-gray-700">{p2.sign}</span>
                        <span className="text-gray-400 text-xs ml-1">
                          H{p2.house}
                        </span>
                      </div>
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

function PlanetsTable({
  planets,
  showFullDegree,
}: {
  planets: any[];
  showFullDegree?: boolean;
}) {
  if (!planets || planets.length === 0) {
    return <p className="text-gray-400 text-center py-4">No data</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-2 font-semibold text-gray-600">
              Planet
            </th>
            <th className="text-left p-2 font-semibold text-gray-600">Sign</th>
            <th className="text-left p-2 font-semibold text-gray-600">
              Degree
            </th>
            <th className="text-left p-2 font-semibold text-gray-600">House</th>
            <th className="text-center p-2 font-semibold text-gray-600">R</th>
          </tr>
        </thead>
        <tbody>
          {planets.map((planet: any, idx: number) => {
            const config = PLANETS_CONFIG[planet.name];
            const zodiac = ZODIAC_SIGNS[planet.sign];
            const isRetro =
              planet.is_retro === "true" || planet.is_retro === true;

            return (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span
                      style={{ color: config?.color }}
                      className="text-base"
                    >
                      {config?.symbol || "•"}
                    </span>
                    <span className="text-gray-700">{planet.name}</span>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span style={{ color: zodiac?.color }}>
                      {zodiac?.symbol}
                    </span>
                    <span className="text-gray-700">{planet.sign}</span>
                  </div>
                </td>
                <td className="p-2 text-gray-600">
                  {(planet.norm_degree || planet.full_degree)?.toFixed(2)}°
                </td>
                <td className="p-2 text-gray-600">{planet.house}</td>
                <td className="p-2 text-center">
                  {isRetro && (
                    <span className="text-red-500 text-xs font-medium">R</span>
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

function HouseOverlayTable({
  houses,
  partnerName,
}: {
  houses: any[];
  partnerName: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-2 font-semibold text-gray-600">
              Planet
            </th>
            <th className="text-left p-2 font-semibold text-gray-600">
              Falls in {partnerName}'s House
            </th>
          </tr>
        </thead>
        <tbody>
          {houses.map((item: any, idx: number) => {
            const config = PLANETS_CONFIG[item.name];
            return (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <span style={{ color: config?.color }}>
                      {config?.symbol || "•"}
                    </span>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                </td>
                <td className="p-2">
                  <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                    House {item.synastry_house}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function HousesGrid({ houses }: { houses: any[] }) {
  if (!houses || houses.length === 0) return null;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {houses.map((house: any, idx: number) => {
        const zodiac = ZODIAC_SIGNS[house.sign];
        return (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-2 text-center hover:border-gray-300 transition-colors"
          >
            <span className="text-xs font-medium text-gray-500">
              House {house.house}
            </span>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span style={{ color: zodiac?.color }} className="text-lg">
                {zodiac?.symbol}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-700">
              {house.sign}
            </span>
            <p className="text-xs text-gray-400">{house.degree?.toFixed(1)}°</p>
          </div>
        );
      })}
    </div>
  );
}

function SynastryAspectsTable({
  aspects,
  showAll,
}: {
  aspects: any[];
  showAll: boolean;
}) {
  if (!aspects || aspects.length === 0) return null;

  const filteredAspects = showAll
    ? aspects
    : aspects.filter(
        (a) => ASPECT_CONFIG[a.type]?.type === "major" && a.orb < 8,
      );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-2 font-semibold text-gray-600">
              Planet 1
            </th>
            <th className="text-center p-2 font-semibold text-gray-600">
              Aspect
            </th>
            <th className="text-left p-2 font-semibold text-gray-600">
              Planet 2
            </th>
            <th className="text-left p-2 font-semibold text-gray-600">Orb</th>
          </tr>
        </thead>
        <tbody>
          {filteredAspects
            .slice(0, showAll ? 100 : 20)
            .map((aspect: any, idx: number) => {
              const aspectConfig = ASPECT_CONFIG[aspect.type];
              const p1Config = PLANETS_CONFIG[aspect.first];
              const p2Config = PLANETS_CONFIG[aspect.second];
              const isHarmonious = ["Trine", "Sextile", "Conjunction"].includes(
                aspect.type,
              );

              return (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-2">
                    <div className="flex items-center gap-1">
                      <span style={{ color: p1Config?.color }}>
                        {p1Config?.symbol || "•"}
                      </span>
                      <span className="text-gray-700">{aspect.first}</span>
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                        isHarmonious ? "bg-green-100" : "bg-orange-100"
                      }`}
                      style={{ color: aspectConfig?.color }}
                    >
                      <span className="text-sm">
                        {aspectConfig?.symbol || "•"}
                      </span>
                      {aspect.type}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-1">
                      <span style={{ color: p2Config?.color }}>
                        {p2Config?.symbol || "•"}
                      </span>
                      <span className="text-gray-700">{aspect.second}</span>
                    </div>
                  </td>
                  <td className="p-2 text-gray-500">
                    {aspect.orb?.toFixed(2)}°
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {!showAll && filteredAspects.length > 20 && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Showing 20 of {filteredAspects.length} aspects
        </p>
      )}
    </div>
  );
}

function CompositeAspectsTable({ aspects }: { aspects: any[] }) {
  if (!aspects || aspects.length === 0) return null;

  const majorAspects = aspects
    .filter((a) => ASPECT_CONFIG[a.type]?.type === "major")
    .slice(0, 20);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left p-2 font-semibold text-gray-600">
              Planet 1
            </th>
            <th className="text-center p-2 font-semibold text-gray-600">
              Aspect
            </th>
            <th className="text-left p-2 font-semibold text-gray-600">
              Planet 2
            </th>
            <th className="text-left p-2 font-semibold text-gray-600">Orb</th>
          </tr>
        </thead>
        <tbody>
          {majorAspects.map((aspect: any, idx: number) => {
            const aspectConfig = ASPECT_CONFIG[aspect.type];
            const p1Config = PLANETS_CONFIG[aspect.aspecting_planet];
            const p2Config = PLANETS_CONFIG[aspect.aspected_planet];
            const isHarmonious = ["Trine", "Sextile", "Conjunction"].includes(
              aspect.type,
            );

            return (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span style={{ color: p1Config?.color }}>
                      {p1Config?.symbol || "•"}
                    </span>
                    <span className="text-gray-700">
                      {aspect.aspecting_planet}
                    </span>
                  </div>
                </td>
                <td className="p-2 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                      isHarmonious ? "bg-green-100" : "bg-orange-100"
                    }`}
                    style={{ color: aspectConfig?.color }}
                  >
                    <span className="text-sm">
                      {aspectConfig?.symbol || "•"}
                    </span>
                    {aspect.type}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-1">
                    <span style={{ color: p2Config?.color }}>
                      {p2Config?.symbol || "•"}
                    </span>
                    <span className="text-gray-700">
                      {aspect.aspected_planet}
                    </span>
                  </div>
                </td>
                <td className="p-2 text-gray-500">{aspect.orb?.toFixed(2)}°</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function KeyAspectsGrid({ aspects }: { aspects: any[] }) {
  const importantAspects = aspects
    .filter((a) => ASPECT_CONFIG[a.type]?.type === "major" && a.orb < 5)
    .slice(0, 6);

  if (importantAspects.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {importantAspects.map((aspect: any, idx: number) => {
        const aspectConfig = ASPECT_CONFIG[aspect.type];
        const isHarmonious = ["Trine", "Sextile", "Conjunction"].includes(
          aspect.type,
        );

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
              <span style={{ color: aspectConfig?.color }} className="text-xl">
                {aspectConfig?.symbol}
              </span>
              <span className="text-xs font-medium text-gray-600">
                {aspect.type}
              </span>
            </div>
            <p className="text-sm text-gray-700 font-medium">
              {aspect.first} - {aspect.second}
            </p>
            <p className="text-xs text-gray-500">
              Orb: {aspect.orb?.toFixed(1)}°
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ForecastCard({ forecast, index }: { forecast: any; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-pink-200 transition-colors">
      <div
        className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
            <span className="text-pink-600 font-semibold text-sm">
              {index + 1}
            </span>
          </div>
          <h4 className="font-medium text-gray-800 text-sm">
            {forecast.planet_position}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
            {forecast.date}
          </span>
          <Iconify
            icon={expanded ? "mdi:chevron-up" : "mdi:chevron-down"}
            width={20}
            className="text-gray-400"
          />
        </div>
      </div>
      {expanded && (
        <div className="p-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {forecast.forecast}
          </p>
        </div>
      )}
    </div>
  );
}

// Utility function
function capitalize(str: string | undefined): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default LoveCompatibilityPage;
