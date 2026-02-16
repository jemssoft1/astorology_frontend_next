"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";

// Types
interface DashaPeriod {
  planet: string;
  planet_id: number;
  start: string;
  end: string;
}

interface CurrentVdashaAll {
  major: { dasha_period: DashaPeriod[] };
  minor: { planet: { major: string }; dasha_period: DashaPeriod[] };
  sub_minor: {
    planet: { major: string; minor: string };
    dasha_period: DashaPeriod[];
  };
  sub_sub_minor: {
    planet: { major: string; minor: string; sub_minor: string };
    dasha_period: DashaPeriod[];
  };
  sub_sub_sub_minor: {
    planet: {
      major: string;
      minor: string;
      sub_minor: string;
      sub_sub_minor: string;
    };
    dasha_period: DashaPeriod[];
  };
}

interface CurrentVdasha {
  major: DashaPeriod;
  minor: DashaPeriod;
  sub_minor: DashaPeriod;
  sub_sub_minor: DashaPeriod;
  sub_sub_sub_minor: DashaPeriod;
}

interface VdashaData {
  current_vdasha_all?: CurrentVdashaAll;
  major_vdasha?: DashaPeriod[];
  current_vdasha?: CurrentVdasha;
  current_vdasha_date?: any;
  sub_vdasha?: DashaPeriod[];
  sub_sub_vdasha?: DashaPeriod[];
  sub_sub_sub_vdasha?: DashaPeriod[];
  sub_sub_sub_sub_vdasha?: DashaPeriod[];
}

interface VdashaResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: VdashaData;
  errors?: Record<string, string>;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

// Planet configuration
const PLANET_CONFIG: Record<
  string,
  { color: string; bg: string; icon: string }
> = {
  Sun: {
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
    icon: "mdi:white-balance-sunny",
  },
  Moon: {
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: "mdi:moon-waning-crescent",
  },
  Mars: {
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    icon: "mdi:triangle",
  },
  Mercury: {
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    icon: "mdi:atom",
  },
  Jupiter: {
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    icon: "mdi:circle-outline",
  },
  Venus: {
    color: "text-pink-600",
    bg: "bg-pink-50 border-pink-200",
    icon: "mdi:heart",
  },
  Saturn: {
    color: "text-slate-600",
    bg: "bg-slate-50 border-slate-200",
    icon: "mdi:hexagon-outline",
  },
  Rahu: {
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    icon: "mdi:circle-half-full",
  },
  Ketu: {
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: "mdi:star-four-points",
  },
};

const PLANETS = [
  { value: "Sun", label: "Sun (Surya)" },
  { value: "Moon", label: "Moon (Chandra)" },
  { value: "Mars", label: "Mars (Mangal)" },
  { value: "Mercury", label: "Mercury (Budh)" },
  { value: "Jupiter", label: "Jupiter (Guru)" },
  { value: "Venus", label: "Venus (Shukra)" },
  { value: "Saturn", label: "Saturn (Shani)" },
  { value: "Rahu", label: "Rahu" },
  { value: "Ketu", label: "Ketu" },
];

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "mahadasha", label: "Mahadasha", icon: "mdi:numeric-1-box-outline" },
  { key: "antardasha", label: "Antardasha", icon: "mdi:numeric-2-box-outline" },
  {
    key: "pratyantardasha",
    label: "Pratyantardasha",
    icon: "mdi:numeric-3-box-outline",
  },
  { key: "sukshma", label: "Sukshma", icon: "mdi:numeric-4-box-outline" },
  { key: "prana", label: "Prana", icon: "mdi:numeric-5-box-outline" },
];

export default function VimshottariDasha() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [dashaData, setDashaData] = useState<VdashaResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [md, setMd] = useState<string>("");
  const [ad, setAd] = useState<string>("");
  const [pd, setPd] = useState<string>("");
  const [sd, setSd] = useState<string>("");

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setDashaData(null);
    setMd("");
    setAd("");
    setPd("");
    setSd("");
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
      ...(md && { md }),
      ...(md && ad && { ad }),
      ...(md && ad && pd && { pd }),
      ...(md && ad && pd && sd && { sd }),
    };
  };

  const fetchDasha = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(`/api/vimshottari-dasha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: VdashaResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch Dasha data");
      }
      setDashaData(result);

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
        error instanceof Error ? error.message : "Failed to get Dasha data";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Calculate duration between dates
  const calculateDuration = (start: string, end: string): string => {
    const startParts = start.split("  ")[0].split("-");
    const endParts = end.split("  ")[0].split("-");
    const startDate = new Date(
      +startParts[2],
      +startParts[1] - 1,
      +startParts[0],
    );
    const endDate = new Date(+endParts[2], +endParts[1] - 1, +endParts[0]);
    const diffDays = Math.ceil(
      Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    if (years > 0) return `${years}y ${months}m`;
    if (months > 0) return `${months}m ${days}d`;
    return `${days}d`;
  };

  // Planet Badge Component
  const PlanetBadge = ({ planet }: { planet: string }) => {
    const config = PLANET_CONFIG[planet] || {
      color: "text-gray-600",
      bg: "bg-gray-50 border-gray-200",
      icon: "mdi:circle",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium border ${config.bg} ${config.color}`}
      >
        <Iconify icon={config.icon} className="text-base" />
        {planet}
      </span>
    );
  };

  // Current Running Dasha Component
  const CurrentDashaSection = () => {
    if (!dashaData?.data?.current_vdasha) return null;
    const current = dashaData.data.current_vdasha;

    const levels = [
      { label: "Mahadasha", data: current.major },
      { label: "Antardasha", data: current.minor },
      { label: "Pratyantardasha", data: current.sub_minor },
      { label: "Sukshma", data: current.sub_sub_minor },
      { label: "Prana", data: current.sub_sub_sub_minor },
    ];

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Iconify
              icon="mdi:clock-outline"
              className="text-lg text-indigo-600"
            />
            Current Running Dasha
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Active planetary periods as of today
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {levels.map((level, idx) => {
            const config = PLANET_CONFIG[level.data.planet];
            return (
              <div
                key={level.label}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {level.label}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Iconify
                        icon={config?.icon || "mdi:circle"}
                        className={`text-xl ${config?.color || "text-gray-500"}`}
                      />
                      <span className="text-base font-semibold text-gray-900">
                        {level.data.planet}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">
                    {level.data.start.split("  ")[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    to {level.data.end.split("  ")[0]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Dasha Table Component
  const DashaTable = ({
    periods,
    title,
    subtitle,
  }: {
    periods: DashaPeriod[];
    title: string;
    subtitle?: string;
  }) => {
    if (!periods || periods.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Iconify
            icon="mdi:database-off-outline"
            className="text-4xl text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  #
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Planet
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Start
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  End
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {periods.map((period, idx) => {
                const isCurrent =
                  dashaData?.data?.current_vdasha?.major.planet ===
                  period.planet;
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-gray-50 transition-colors ${isCurrent ? "bg-indigo-50" : ""}`}
                  >
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <PlanetBadge planet={period.planet} />
                      {isCurrent && (
                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">
                      {period.start.split("  ")[0]}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">
                      {period.end.split("  ")[0]}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-indigo-600">
                      {calculateDuration(period.start, period.end)}
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

  // Mahadasha Timeline
  const MahadashaTimeline = () => {
    if (!dashaData?.data?.major_vdasha) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">
            Mahadasha Timeline
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Complete 120-year planetary cycle
          </p>
        </div>

        <div className="p-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dashaData.data.major_vdasha.map((period, idx) => {
              const config = PLANET_CONFIG[period.planet];
              const isCurrent =
                dashaData?.data?.current_vdasha?.major.planet === period.planet;

              return (
                <div
                  key={idx}
                  className={`flex-shrink-0 w-28 p-3 rounded-lg border-2 transition-all ${
                    isCurrent
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {isCurrent && (
                    <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-wide">
                      Current
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 mt-1">
                    <Iconify
                      icon={config?.icon || "mdi:circle"}
                      className={`text-lg ${config?.color}`}
                    />
                    <span className="font-semibold text-gray-900 text-sm">
                      {period.planet}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">
                    {period.start.split("  ")[0]}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    to {period.end.split("  ")[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Quick Stats
  const QuickStats = () => {
    if (!dashaData?.data?.current_vdasha) return null;
    const current = dashaData.data.current_vdasha;

    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Mahadasha", value: current.major.planet },
          { label: "Antardasha", value: current.minor.planet },
          { label: "Pratyantardasha", value: current.sub_minor.planet },
          { label: "Sukshma", value: current.sub_sub_minor.planet },
          { label: "Prana", value: current.sub_sub_sub_minor.planet },
        ].map((stat) => {
          const config = PLANET_CONFIG[stat.value];
          return (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Iconify
                  icon={config?.icon || "mdi:circle"}
                  className={`text-xl ${config?.color}`}
                />
                <span className="text-lg font-semibold text-gray-900">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // All Periods Section
  const AllPeriodsSection = () => {
    if (!dashaData?.data?.current_vdasha_all) return null;
    const all = dashaData.data.current_vdasha_all;

    const sections = [
      {
        key: "major",
        label: "Mahadasha Periods",
        data: all.major.dasha_period,
        subtitle: "Full 120-year cycle",
      },
      {
        key: "minor",
        label: "Antardasha Periods",
        data: all.minor.dasha_period,
        subtitle: `Under ${all.minor.planet.major} Mahadasha`,
      },
      {
        key: "sub_minor",
        label: "Pratyantardasha Periods",
        data: all.sub_minor.dasha_period,
        subtitle: `${all.sub_minor.planet.major} → ${all.sub_minor.planet.minor}`,
      },
      {
        key: "sub_sub_minor",
        label: "Sukshma Periods",
        data: all.sub_sub_minor.dasha_period,
        subtitle: `${all.sub_sub_minor.planet.major} → ${all.sub_sub_minor.planet.minor} → ${all.sub_sub_minor.planet.sub_minor}`,
      },
      {
        key: "sub_sub_sub_minor",
        label: "Prana Periods",
        data: all.sub_sub_sub_minor.dasha_period,
        subtitle: `${all.sub_sub_sub_minor.planet.major} → ${all.sub_sub_sub_minor.planet.minor} → ${all.sub_sub_sub_minor.planet.sub_minor} → ${all.sub_sub_sub_minor.planet.sub_sub_minor}`,
      },
    ];

    return (
      <div className="space-y-6">
        {sections.map((section) => (
          <DashaTable
            key={section.key}
            periods={section.data}
            title={section.label}
            subtitle={section.subtitle}
          />
        ))}
      </div>
    );
  };

  // Render Tab Content
  const renderTabContent = () => {
    if (!dashaData?.data) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <QuickStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CurrentDashaSection />
              <MahadashaTimeline />
            </div>
          </div>
        );
      case "mahadasha":
        return <AllPeriodsSection />;
      case "antardasha":
        return dashaData.data.sub_vdasha ? (
          <DashaTable
            periods={dashaData.data.sub_vdasha}
            title="Antardasha Periods"
            subtitle={md ? `Under ${md} Mahadasha` : undefined}
          />
        ) : (
          <EmptyState message="Select a Mahadasha planet to view Antardasha periods" />
        );
      case "pratyantardasha":
        return dashaData.data.sub_sub_vdasha ? (
          <DashaTable
            periods={dashaData.data.sub_sub_vdasha}
            title="Pratyantardasha Periods"
            subtitle={md && ad ? `${md} → ${ad}` : undefined}
          />
        ) : (
          <EmptyState message="Select MD and AD planets to view Pratyantardasha" />
        );
      case "sukshma":
        return dashaData.data.sub_sub_sub_vdasha ? (
          <DashaTable
            periods={dashaData.data.sub_sub_sub_vdasha}
            title="Sukshma Dasha Periods"
            subtitle={md && ad && pd ? `${md} → ${ad} → ${pd}` : undefined}
          />
        ) : (
          <EmptyState message="Select MD, AD, and PD planets to view Sukshma Dasha" />
        );
      case "prana":
        return dashaData.data.sub_sub_sub_sub_vdasha ? (
          <DashaTable
            periods={dashaData.data.sub_sub_sub_sub_vdasha}
            title="Prana Dasha Periods"
            subtitle={
              md && ad && pd && sd ? `${md} → ${ad} → ${pd} → ${sd}` : undefined
            }
          />
        ) : (
          <EmptyState message="Select all four planets to view Prana Dasha" />
        );
      default:
        return null;
    }
  };

  // Empty State Component
  const EmptyState = ({ message }: { message: string }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
      <Iconify
        icon="mdi:information-outline"
        className="text-5xl text-gray-300 mx-auto mb-4"
      />
      <p className="text-gray-500">{message}</p>
      <p className="text-sm text-gray-400 mt-2">
        Use the sidebar to select planets and recalculate
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Vimshottari Dasha"
          description="120-year planetary period system for timing predictions"
          imageSrc="/images/vimshottari-dasha.png"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Person Selector Card */}
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
            </div>

            {/* Dasha Parameters Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <Iconify
                  icon="mdi:tune-variant"
                  className="text-lg text-gray-500"
                />
                Dasha Parameters
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Optional: For detailed sub-period data
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Mahadasha
                  </label>
                  <select
                    value={md}
                    onChange={(e) => {
                      setMd(e.target.value);
                      setAd("");
                      setPd("");
                      setSd("");
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select planet</option>
                    {PLANETS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Antardasha
                  </label>
                  <select
                    value={ad}
                    onChange={(e) => {
                      setAd(e.target.value);
                      setPd("");
                      setSd("");
                    }}
                    disabled={!md}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">Select planet</option>
                    {PLANETS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Pratyantardasha
                  </label>
                  <select
                    value={pd}
                    onChange={(e) => {
                      setPd(e.target.value);
                      setSd("");
                    }}
                    disabled={!ad}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">Select planet</option>
                    {PLANETS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Sukshma
                  </label>
                  <select
                    value={sd}
                    onChange={(e) => setSd(e.target.value)}
                    disabled={!pd}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
                  >
                    <option value="">Select planet</option>
                    {PLANETS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Path */}
              {md && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Selected Path</p>
                  <div className="flex flex-wrap items-center gap-1 text-sm">
                    <span className="font-medium text-gray-900">{md}</span>
                    {ad && (
                      <>
                        <Iconify
                          icon="mdi:chevron-right"
                          className="text-gray-400"
                        />
                        <span className="font-medium text-gray-900">{ad}</span>
                      </>
                    )}
                    {pd && (
                      <>
                        <Iconify
                          icon="mdi:chevron-right"
                          className="text-gray-400"
                        />
                        <span className="font-medium text-gray-900">{pd}</span>
                      </>
                    )}
                    {sd && (
                      <>
                        <Iconify
                          icon="mdi:chevron-right"
                          className="text-gray-400"
                        />
                        <span className="font-medium text-gray-900">{sd}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={fetchDasha}
                disabled={loading || !selectedPerson}
                className="mt-4 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Calculating...
                  </>
                ) : (
                  <>
                    <Iconify
                      icon="mdi:calculator-variant-outline"
                      className="text-lg"
                    />{" "}
                    Calculate Dasha
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {dashaData ? (
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
                        About Vimshottari Dasha
                      </p>
                      <p>
                        The Vimshottari Dasha is a 120-year planetary period
                        system based on the Moon's Nakshatra at birth. It
                        divides life into planetary periods (Mahadasha) which
                        are further subdivided into Antardasha, Pratyantardasha,
                        Sukshma, and Prana levels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Iconify
                    icon="mdi:timer-sand-empty"
                    className="text-3xl text-gray-400"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Data Yet
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a person from the sidebar and click "Calculate Dasha"
                  to view Vimshottari Dasha analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
