"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import { useUser } from "@/context/UserContext";

// ============ Types ============

interface PujaSuggestion {
  status: boolean;
  priority: number;
  title: string;
  puja_id: string;
  summary: string;
  one_line: string;
}

interface PujaSuggestionData {
  summary: string;
  suggestions: PujaSuggestion[];
}

interface GemDetails {
  name: string;
  gem_key: string;
  semi_gem: string;
  wear_finger: string;
  weight_caret: string;
  wear_metal: string;
  wear_day: string;
  gem_deity: string;
}

interface GemSuggestionData {
  LIFE: GemDetails;
  BENEFIC: GemDetails;
  LUCKY: GemDetails;
}

interface RudrakshaSuggestionData {
  img_url: string;
  rudraksha_key: string;
  name: string;
  recommend: string;
  detail: string;
}

interface SadhesatiRemediesData {
  what_is_sadhesati: string;
  remedies: string[];
}

interface RemediesData {
  puja_suggestion: PujaSuggestionData | null;
  gem_suggestion: GemSuggestionData | null;
  rudraksha_suggestion: RudrakshaSuggestionData | null;
  sadhesati_remedies: SadhesatiRemediesData | null;
}

interface RemediesResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: RemediesData;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    failed_endpoints?: string[];
    success_rate: string;
    timestamp: string;
  };
}

// ============ Constants ============

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "gemstones", label: "Gemstones", icon: "mdi:diamond-stone" },
  { key: "rudraksha", label: "Rudraksha", icon: "mdi:seed-outline" },
  { key: "puja", label: "Puja", icon: "mdi:hands-pray" },
  { key: "sadhesati", label: "Sade Sati", icon: "mdi:shield-outline" },
];

const GEM_TYPE_CONFIG: Record<
  string,
  { label: string; description: string; color: string; icon: string }
> = {
  LIFE: {
    label: "Life Stone",
    description: "Primary gemstone based on your Lagna lord",
    color: "emerald",
    icon: "mdi:heart-pulse",
  },
  BENEFIC: {
    label: "Benefic Stone",
    description: "Gemstone for overall beneficial effects",
    color: "blue",
    icon: "mdi:star-four-points",
  },
  LUCKY: {
    label: "Lucky Stone",
    description: "Gemstone to enhance luck and fortune",
    color: "purple",
    icon: "mdi:clover",
  },
};

const PLANET_CONFIG: Record<string, { icon: string; color: string }> = {
  Sun: { icon: "mdi:white-balance-sunny", color: "orange" },
  Moon: { icon: "mdi:moon-waning-crescent", color: "slate" },
  Mars: { icon: "mdi:triangle", color: "red" },
  Mercury: { icon: "mdi:atom", color: "green" },
  Jupiter: { icon: "mdi:circle-outline", color: "yellow" },
  Venus: { icon: "mdi:heart", color: "pink" },
  Saturn: { icon: "mdi:hexagon-outline", color: "indigo" },
  Rahu: { icon: "mdi:circle-half-full", color: "slate" },
  Ketu: { icon: "mdi:blur", color: "amber" },
};

const COLOR_CLASSES: Record<
  string,
  { bg: string; text: string; border: string; light: string; gradient: string }
> = {
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-600",
    border: "border-emerald-200",
    light: "bg-emerald-50",
    gradient: "from-emerald-500 to-emerald-600",
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    border: "border-blue-200",
    light: "bg-blue-50",
    gradient: "from-blue-500 to-blue-600",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-600",
    border: "border-purple-200",
    light: "bg-purple-50",
    gradient: "from-purple-500 to-purple-600",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-600",
    border: "border-orange-200",
    light: "bg-orange-50",
    gradient: "from-orange-500 to-orange-600",
  },
  red: {
    bg: "bg-red-500",
    text: "text-red-600",
    border: "border-red-200",
    light: "bg-red-50",
    gradient: "from-red-500 to-red-600",
  },
  green: {
    bg: "bg-green-500",
    text: "text-green-600",
    border: "border-green-200",
    light: "bg-green-50",
    gradient: "from-green-500 to-green-600",
  },
  yellow: {
    bg: "bg-yellow-500",
    text: "text-yellow-600",
    border: "border-yellow-200",
    light: "bg-yellow-50",
    gradient: "from-yellow-500 to-yellow-600",
  },
  pink: {
    bg: "bg-pink-500",
    text: "text-pink-600",
    border: "border-pink-200",
    light: "bg-pink-50",
    gradient: "from-pink-500 to-pink-600",
  },
  indigo: {
    bg: "bg-indigo-500",
    text: "text-indigo-600",
    border: "border-indigo-200",
    light: "bg-indigo-50",
    gradient: "from-indigo-500 to-indigo-600",
  },
  slate: {
    bg: "bg-slate-500",
    text: "text-slate-600",
    border: "border-slate-200",
    light: "bg-slate-50",
    gradient: "from-slate-500 to-slate-600",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-600",
    border: "border-amber-200",
    light: "bg-amber-50",
    gradient: "from-amber-500 to-amber-600",
  },
};

const GEM_IMAGES: Record<string, string> = {
  emerald: "💚",
  blue_sapphire: "💙",
  diamond: "💎",
  ruby: "❤️",
  pearl: "🤍",
  yellow_sapphire: "💛",
  hessonite: "🧡",
  cats_eye: "🟢",
  coral: "🔴",
};

export default function RemediesPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [remediesData, setRemediesData] = useState<RemediesResponse | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { user } = useUser();
  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setRemediesData(null);
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

  const fetchRemedies = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/remedies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result: RemediesResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch remedies data");
      }
      setRemediesData(result);

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

  const getColorClass = (color: string) => {
    return COLOR_CLASSES[color] || COLOR_CLASSES.slate;
  };

  const getPlanetConfig = (planetName: string) => {
    return PLANET_CONFIG[planetName] || { icon: "mdi:circle", color: "slate" };
  };

  // ============ Components ============

  // Gemstone Card Component
  const GemstoneCard = ({ type, gem }: { type: string; gem: GemDetails }) => {
    const config = GEM_TYPE_CONFIG[type];
    const colorClass = getColorClass(config.color);
    const planetConfig = getPlanetConfig(gem.gem_deity);
    const planetColorClass = getColorClass(planetConfig.color);
    const gemEmoji = GEM_IMAGES[gem.gem_key] || "💎";

    return (
      <div
        className={`bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${colorClass.border}`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 bg-gradient-to-r ${colorClass.gradient} text-white`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Iconify icon={config.icon} className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">{config.label}</h3>
                <p className="text-xs text-white/80">{config.description}</p>
              </div>
            </div>
            <span className="text-3xl">{gemEmoji}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Gemstone Name */}
          <div className="text-center pb-4 border-b border-gray-100">
            <h4 className={`text-2xl font-bold ${colorClass.text}`}>
              {gem.name}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Alternative: {gem.semi_gem}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Ruling Planet */}
            <div className={`p-3 rounded-lg ${planetColorClass.light}`}>
              <div className="flex items-center gap-2 mb-1">
                <Iconify
                  icon={planetConfig.icon}
                  className={`text-lg ${planetColorClass.text}`}
                />
                <span className="text-xs text-gray-500">Ruling Planet</span>
              </div>
              <p className={`font-semibold ${planetColorClass.text}`}>
                {gem.gem_deity}
              </p>
            </div>

            {/* Wear Day */}
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-1">
                <Iconify
                  icon="mdi:calendar"
                  className="text-lg text-gray-400"
                />
                <span className="text-xs text-gray-500">Wear Day</span>
              </div>
              <p className="font-semibold text-gray-700">{gem.wear_day}</p>
            </div>

            {/* Finger */}
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-1">
                <Iconify
                  icon="mdi:hand-back-right-outline"
                  className="text-lg text-gray-400"
                />
                <span className="text-xs text-gray-500">Finger</span>
              </div>
              <p className="font-semibold text-gray-700">{gem.wear_finger}</p>
            </div>

            {/* Metal */}
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2 mb-1">
                <Iconify icon="mdi:ring" className="text-lg text-gray-400" />
                <span className="text-xs text-gray-500">Metal</span>
              </div>
              <p className="font-semibold text-gray-700">{gem.wear_metal}</p>
            </div>
          </div>

          {/* Weight */}
          <div className={`p-3 rounded-lg ${colorClass.light} text-center`}>
            <span className="text-xs text-gray-500">Recommended Weight</span>
            <p className={`font-bold text-lg ${colorClass.text}`}>
              {gem.weight_caret} Carats
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Rudraksha Card Component
  const RudrakshaCard = () => {
    const rudraksha = remediesData?.data?.rudraksha_suggestion;
    if (!rudraksha) return null;

    return (
      <div className="bg-white border border-amber-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Iconify icon="mdi:seed-outline" className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Rudraksha Recommendation
              </h3>
              <p className="text-sm text-white/80">
                Sacred bead for spiritual protection
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Rudraksha Name */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
              <span className="text-5xl">📿</span>
            </div>
            <h4 className="text-xl font-bold text-amber-700">
              {rudraksha.name}
            </h4>
          </div>

          {/* Recommendation */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Iconify
                icon="mdi:check-circle"
                className="text-xl text-amber-600 flex-shrink-0 mt-0.5"
              />
              <p className="text-amber-800 font-medium">
                {rudraksha.recommend}
              </p>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 leading-relaxed">{rudraksha.detail}</p>
          </div>
        </div>
      </div>
    );
  };

  // Puja Suggestions Component
  const PujaSuggestions = () => {
    const pujaData = remediesData?.data?.puja_suggestion;
    if (!pujaData) return null;

    const getPriorityColor = (priority: number) => {
      if (priority <= 1) return "red";
      if (priority <= 2) return "orange";
      return "blue";
    };

    const getPriorityLabel = (priority: number) => {
      if (priority <= 1) return "High Priority";
      if (priority <= 2) return "Medium Priority";
      return "Recommended";
    };

    return (
      <div className="space-y-6">
        {/* Summary */}
        <div className="bg-white border border-purple-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Iconify
                icon="mdi:hands-pray"
                className="text-xl text-purple-600"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Puja Recommendations
              </h3>
              <p className="text-gray-600">{pujaData.summary}</p>
            </div>
          </div>
        </div>

        {/* Puja List */}
        <div className="space-y-4">
          {pujaData.suggestions.map((puja, idx) => {
            const priorityColor = getPriorityColor(puja.priority);
            const colorClass = getColorClass(priorityColor);

            return (
              <div
                key={idx}
                className={`bg-white border rounded-xl overflow-hidden ${colorClass.border}`}
              >
                <div
                  className={`px-5 py-3 ${colorClass.light} border-b ${colorClass.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${colorClass.bg} text-white`}
                      >
                        {getPriorityLabel(puja.priority)}
                      </span>
                      <h4 className="font-semibold text-gray-900">
                        {puja.title}
                      </h4>
                    </div>
                    {puja.status && (
                      <Iconify
                        icon="mdi:check-circle"
                        className="text-xl text-green-500"
                      />
                    )}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className={`p-3 rounded-lg ${colorClass.light}`}>
                    <p className={`text-sm font-medium ${colorClass.text}`}>
                      {puja.one_line}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {puja.summary}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Sadhesati Remedies Component
  const SadhesatiRemedies = () => {
    const sadhesati = remediesData?.data?.sadhesati_remedies;
    if (!sadhesati) return null;

    return (
      <div className="space-y-6">
        {/* What is Sadhesati */}
        <div className="bg-white border border-indigo-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Iconify icon="mdi:information-outline" className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">What is Sade Sati?</h3>
                <p className="text-sm text-white/80">
                  Understanding Saturn&apos;s 7.5 year transit
                </p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-gray-600 leading-relaxed">
              {sadhesati.what_is_sadhesati}
            </p>
          </div>
        </div>

        {/* Remedies */}
        <div className="bg-white border border-indigo-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-indigo-100 bg-indigo-50">
            <div className="flex items-center gap-3">
              <Iconify
                icon="mdi:shield-check-outline"
                className="text-xl text-indigo-600"
              />
              <h3 className="font-semibold text-gray-900">
                Recommended Remedies
              </h3>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {sadhesati.remedies.map((remedy, idx) => {
                // Skip the first item if it's a header
                if (idx === 0 && remedy.includes("Following are")) {
                  return (
                    <p key={idx} className="text-gray-500 text-sm mb-2">
                      {remedy}
                    </p>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-indigo-600">
                        {idx}
                      </span>
                    </div>
                    <p className="text-gray-700">{remedy}</p>
                  </div>
                );
              })}
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
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Iconify
                  icon="mdi:diamond-stone"
                  className="text-xl text-emerald-600"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Life Stone</p>
                <p className="font-semibold text-gray-900">
                  {remediesData?.data?.gem_suggestion?.LIFE?.name || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Iconify
                  icon="mdi:star-four-points"
                  className="text-xl text-blue-600"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Benefic Stone</p>
                <p className="font-semibold text-gray-900">
                  {remediesData?.data?.gem_suggestion?.BENEFIC?.name || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Iconify
                  icon="mdi:seed-outline"
                  className="text-xl text-amber-600"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Rudraksha</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {remediesData?.data?.rudraksha_suggestion?.name?.split(
                    " ",
                  )[0] || "-"}{" "}
                  Mukhi
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Iconify
                  icon="mdi:hands-pray"
                  className="text-xl text-purple-600"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pujas</p>
                <p className="font-semibold text-gray-900">
                  {remediesData?.data?.puja_suggestion?.suggestions?.length ||
                    0}{" "}
                  Suggested
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gemstones Preview */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Iconify
                  icon="mdi:diamond-stone"
                  className="text-lg text-gray-600"
                />
                <h3 className="font-semibold text-gray-900">
                  Gemstone Recommendations
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("gemstones")}
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View All <Iconify icon="mdi:arrow-right" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {remediesData?.data?.gem_suggestion &&
                Object.entries(remediesData.data.gem_suggestion).map(
                  ([type, gem]) => {
                    const config = GEM_TYPE_CONFIG[type];
                    const colorClass = getColorClass(config?.color || "slate");

                    return (
                      <div
                        key={type}
                        className={`flex items-center justify-between p-3 rounded-lg ${colorClass.light}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {GEM_IMAGES[gem.gem_key] || "💎"}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">
                              {gem.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {config?.label}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">
                            {gem.wear_day}
                          </p>
                          <p className="text-xs text-gray-500">
                            {gem.wear_finger} Finger
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
            </div>
          </div>

          {/* Rudraksha Preview */}
          <RudrakshaCard />
        </div>

        {/* Puja Preview */}
        {remediesData?.data?.puja_suggestion &&
          remediesData.data.puja_suggestion.suggestions.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Iconify
                    icon="mdi:hands-pray"
                    className="text-lg text-purple-600"
                  />
                  <h3 className="font-semibold text-gray-900">
                    Puja Suggestions
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("puja")}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View Details <Iconify icon="mdi:arrow-right" />
                </button>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-4">
                  {remediesData.data.puja_suggestion.summary}
                </p>
                <div className="space-y-2">
                  {remediesData.data.puja_suggestion.suggestions
                    .slice(0, 2)
                    .map((puja, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-purple-50"
                      >
                        <Iconify
                          icon="mdi:check-circle"
                          className="text-lg text-purple-500"
                        />
                        <p className="text-sm font-medium text-gray-700">
                          {puja.title}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
      </div>
    );
  };

  // Gemstones Section
  const GemstonesSection = () => {
    const gems = remediesData?.data?.gem_suggestion;
    if (!gems) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <Iconify
            icon="mdi:diamond-outline"
            className="text-5xl text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500">No gemstone recommendations available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Info Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Iconify icon="mdi:information" className="text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">
                How to Wear Gemstones
              </h3>
              <p className="text-white/90 text-sm">
                Wear the gemstone on the recommended day during the morning
                hours (Shubh Muhurat). Ensure the gem touches your skin for
                maximum benefit. Perform a simple puja before wearing and chant
                the respective planet&apos;s mantra.
              </p>
            </div>
          </div>
        </div>

        {/* Gemstone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(gems).map(([type, gem]) => (
            <GemstoneCard key={type} type={type} gem={gem} />
          ))}
        </div>

        {/* Wearing Instructions */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Iconify
              icon="mdi:format-list-checks"
              className="text-lg text-indigo-600"
            />
            General Guidelines
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Iconify icon="mdi:check" className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Natural & Untreated</p>
                <p className="text-sm text-gray-500">
                  Always use natural, untreated gemstones for astrological
                  benefits
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Iconify icon="mdi:check" className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Proper Weight</p>
                <p className="text-sm text-gray-500">
                  Follow the recommended carat weight for your body weight
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Iconify icon="mdi:check" className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Skin Contact</p>
                <p className="text-sm text-gray-500">
                  Ensure the gemstone touches your skin from the bottom of the
                  ring
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Iconify icon="mdi:check" className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Regular Cleansing</p>
                <p className="text-sm text-gray-500">
                  Clean and energize your gemstone periodically with water and
                  sunlight
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Tab Content
  const renderTabContent = () => {
    if (!remediesData?.data) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewSection />;
      case "gemstones":
        return <GemstonesSection />;
      case "rudraksha":
        return <RudrakshaCard />;
      case "puja":
        return <PujaSuggestions />;
      case "sadhesati":
        return <SadhesatiRemedies />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Astrological Remedies"
          description="Personalized gemstone, rudraksha, puja and remedial suggestions based on your horoscope"
          imageSrc="/images/remedies.png"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Person Selector */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
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
                onClick={fetchRemedies}
                disabled={loading || !selectedPerson}
                className="mt-4 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Iconify icon="mdi:sparkles" className="text-lg" />
                    Get Remedies
                  </>
                )}
              </button>
            </div>

            {/* Quick Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Iconify
                  icon="mdi:lightbulb-outline"
                  className="text-lg text-amber-500"
                />
                Remedy Types
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Iconify
                      icon="mdi:diamond-stone"
                      className="text-emerald-600"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Gemstones</p>
                    <p className="text-xs text-gray-500">
                      Based on planetary positions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Iconify
                      icon="mdi:seed-outline"
                      className="text-amber-600"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Rudraksha</p>
                    <p className="text-xs text-gray-500">
                      Sacred bead recommendations
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Iconify
                      icon="mdi:hands-pray"
                      className="text-purple-600"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Puja & Rituals</p>
                    <p className="text-xs text-gray-500">
                      Spiritual remedial measures
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Iconify
                      icon="mdi:shield-outline"
                      className="text-indigo-600"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sade Sati</p>
                    <p className="text-xs text-gray-500">
                      Saturn transit remedies
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Iconify
                  icon="mdi:alert-circle-outline"
                  className="text-lg text-amber-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-xs text-amber-800">
                  <strong>Disclaimer:</strong> These remedies are based on Vedic
                  astrological principles. Please consult a qualified astrologer
                  before wearing any gemstone.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {remediesData ? (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="bg-white border border-gray-200 rounded-xl">
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
              <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
                  <Iconify
                    icon="mdi:sparkles"
                    className="text-4xl text-indigo-500"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Discover Your Remedies
                </h3>
                <p className="text-gray-500 max-w-sm mb-6">
                  Select a person and click &quot;Get Remedies&quot; to receive
                  personalized gemstone, rudraksha, and puja recommendations.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm">
                    💎 Gemstones
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm">
                    📿 Rudraksha
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm">
                    🙏 Puja
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm">
                    🛡️ Sade Sati
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
