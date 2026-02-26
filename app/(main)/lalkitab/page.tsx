"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import { useUser } from "@/context/UserContext";

// Types
interface LalKitabData {
  horoscope?: any;
  debts?: any;
  houses?: any;
  planets?: any;
  remedies?: Record<string, any>;
}

interface LalKitabResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: LalKitabData;
  errors?: Record<string, string>;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

const PLANETS = [
  {
    value: "Sun",
    label: "Sun",
    hindi: "सूर्य",
    icon: "mdi:white-balance-sunny",
    color: "orange",
  },
  {
    value: "Moon",
    label: "Moon",
    hindi: "चंद्र",
    icon: "mdi:moon-waning-crescent",
    color: "blue",
  },
  {
    value: "Mars",
    label: "Mars",
    hindi: "मंगल",
    icon: "mdi:triangle",
    color: "red",
  },
  {
    value: "Mercury",
    label: "Mercury",
    hindi: "बुध",
    icon: "mdi:atom",
    color: "green",
  },
  {
    value: "Jupiter",
    label: "Jupiter",
    hindi: "गुरु",
    icon: "mdi:circle-outline",
    color: "yellow",
  },
  {
    value: "Venus",
    label: "Venus",
    hindi: "शुक्र",
    icon: "mdi:heart",
    color: "pink",
  },
  {
    value: "Saturn",
    label: "Saturn",
    hindi: "शनि",
    icon: "mdi:hexagon-outline",
    color: "slate",
  },
  {
    value: "Rahu",
    label: "Rahu",
    hindi: "राहु",
    icon: "mdi:circle-half-full",
    color: "purple",
  },
  {
    value: "Ketu",
    label: "Ketu",
    hindi: "केतु",
    icon: "mdi:star-four-points",
    color: "amber",
  },
];

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "horoscope", label: "Horoscope", icon: "mdi:chart-arc" },
  { key: "houses", label: "Houses", icon: "mdi:home-outline" },
  { key: "planets", label: "Planets", icon: "mdi:planet" },
  { key: "debts", label: "Debts (Rin)", icon: "mdi:scale-balance" },
  { key: "remedies", label: "Remedies", icon: "mdi:medical-bag" },
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
};

export default function LalKitabPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [lalKitabData, setLalKitabData] = useState<LalKitabResponse | null>(
    null,
  );
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedRemedyPlanet, setSelectedRemedyPlanet] =
    useState<string>("Sun");

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setLalKitabData(null);
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

  const fetchLalKitab = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lalkitab`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result: LalKitabResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch Lal Kitab data");
      }
      setLalKitabData(result);

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
        error instanceof Error ? error.message : "Failed to get Lal Kitab data";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Data Table Component
  // Data Table Component
  const DataTable = ({ data, title }: { data: any; title?: string }) => {
    if (!data) return <EmptyState message="No data available" />;

    // Helper function to format cell value
    const formatCellValue = (value: any): string => {
      if (value === null || value === undefined) return "-";

      // If array, join values or show dash if empty
      if (Array.isArray(value)) {
        if (value.length === 0) return "-";
        return value.join(", ");
      }

      // If object, stringify it
      if (typeof value === "object") {
        return JSON.stringify(value);
      }

      return String(value);
    };

    if (Array.isArray(data)) {
      if (data.length === 0) return <EmptyState message="No data available" />;
      const keys = [...new Set(data.flatMap((item) => Object.keys(item)))];

      return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {title && (
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {keys.map((key) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide"
                    >
                      {key.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {keys.map((key) => (
                      <td key={key} className="px-4 py-3 text-sm text-gray-700">
                        {formatCellValue(item[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (typeof data === "object") {
      return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {title && (
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
            </div>
          )}
          <div className="divide-y divide-gray-50">
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-sm text-gray-900">
                  {formatCellValue(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <p className="text-gray-700">{String(data)}</p>;
  };

  // Empty State Component
  const EmptyState = ({ message }: { message: string }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
      <Iconify
        icon="mdi:database-off-outline"
        className="text-4xl text-gray-300 mx-auto mb-3"
      />
      <p className="text-gray-500">{message}</p>
    </div>
  );

  // Houses Grid
  const HousesGrid = ({ houses }: { houses: any[] }) => {
    if (!houses || houses.length === 0)
      return <EmptyState message="No houses data" />;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {houses.map((house: any, idx: number) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <span className="text-sm font-bold text-red-600">
                  {house.house_number || idx + 1}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                House {house.house_number || idx + 1}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(house).map(([key, value]) => {
                if (key === "house_number") return null;
                return (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {String(value) || "-"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Planets Grid
  const PlanetsGrid = ({ planets }: { planets: any[] }) => {
    if (!planets || planets.length === 0)
      return <EmptyState message="No planets data" />;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {planets.map((planet: any, idx: number) => {
          const planetName =
            planet.name || planet.planet || `Planet ${idx + 1}`;
          const planetConfig = PLANETS.find((p) => p.value === planetName);
          const colorClass = COLOR_CLASSES[planetConfig?.color || "slate"];

          return (
            <div
              key={idx}
              className={`bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow ${colorClass.border}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-full ${colorClass.light} flex items-center justify-center`}
                >
                  <Iconify
                    icon={planetConfig?.icon || "mdi:circle"}
                    className={`text-xl ${colorClass.text}`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{planetName}</p>
                  {planetConfig?.hindi && (
                    <p className="text-xs text-gray-500">
                      {planetConfig.hindi}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {Object.entries(planet).map(([key, value]) => {
                  if (key === "name" || key === "planet") return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-900">
                        {value === null ? "-" : String(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Debts Section
  const DebtsSection = ({ debts }: { debts: any }) => {
    if (!debts) return <EmptyState message="No debts data available" />;

    if (Array.isArray(debts)) {
      return <DataTable data={debts} title="Karmic Debts (Rin)" />;
    }

    const debtTypes = [
      {
        key: "pitra_rin",
        label: "Pitra Rin",
        desc: "Ancestral Debt",
        icon: "mdi:account-group",
        color: "red",
      },
      {
        key: "stri_rin",
        label: "Stri Rin",
        desc: "Spouse Debt",
        icon: "mdi:account-heart",
        color: "pink",
      },
      {
        key: "mata_rin",
        label: "Mata Rin",
        desc: "Mother's Debt",
        icon: "mdi:mother-nurse",
        color: "purple",
      },
      {
        key: "swayam_rin",
        label: "Swayam Rin",
        desc: "Self Debt",
        icon: "mdi:account",
        color: "blue",
      },
      {
        key: "bhratri_rin",
        label: "Bhratri Rin",
        desc: "Sibling Debt",
        icon: "mdi:account-multiple",
        color: "green",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {debtTypes.map((debt) => {
          const debtData = debts[debt.key];
          const colorClass = COLOR_CLASSES[debt.color];

          return (
            <div
              key={debt.key}
              className={`bg-white border rounded-lg p-5 ${colorClass.border}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full ${colorClass.light} flex items-center justify-center`}
                >
                  <Iconify
                    icon={debt.icon}
                    className={`text-xl ${colorClass.text}`}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{debt.label}</h4>
                  <p className="text-xs text-gray-500">{debt.desc}</p>
                </div>
              </div>
              {debtData ? (
                typeof debtData === "object" ? (
                  <div className="space-y-2 text-sm">
                    {Object.entries(debtData).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">{String(debtData)}</p>
                )
              ) : (
                <p className="text-sm text-gray-400">No data</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // All Planets Remedies Section
  const RemediesSection = ({
    remedies,
  }: {
    remedies: Record<string, any> | undefined;
  }) => {
    if (!remedies || Object.keys(remedies).length === 0) {
      return <EmptyState message="No remedies data available" />;
    }

    const currentPlanetConfig = PLANETS.find(
      (p) => p.value === selectedRemedyPlanet,
    );
    const colorClass = COLOR_CLASSES[currentPlanetConfig?.color || "slate"];
    const currentRemedies = remedies[selectedRemedyPlanet];

    return (
      <div className="space-y-6">
        {/* Planet Selector Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
            Select Planet for Remedies
          </p>
          <div className="flex flex-wrap gap-2">
            {PLANETS.map((planet) => {
              const hasData = remedies[planet.value];
              const pColorClass = COLOR_CLASSES[planet.color];
              const isSelected = selectedRemedyPlanet === planet.value;

              return (
                <button
                  key={planet.value}
                  onClick={() => setSelectedRemedyPlanet(planet.value)}
                  disabled={!hasData}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    isSelected
                      ? `${pColorClass.light} ${pColorClass.border} ${pColorClass.text}`
                      : hasData
                        ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Iconify icon={planet.icon} className="text-lg" />
                  {planet.label}
                  {!hasData && (
                    <Iconify
                      icon="mdi:alert-circle-outline"
                      className="text-sm text-gray-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Planet Remedies */}
        <div
          className={`bg-white border rounded-lg overflow-hidden ${colorClass.border}`}
        >
          <div
            className={`px-5 py-4 border-b ${colorClass.light} ${colorClass.border}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full bg-white flex items-center justify-center`}
              >
                <Iconify
                  icon={currentPlanetConfig?.icon || "mdi:circle"}
                  className={`text-2xl ${colorClass.text}`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedRemedyPlanet} Remedies
                </h3>
                <p className="text-xs text-gray-600">
                  {currentPlanetConfig?.hindi} के उपाय
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {currentRemedies ? (
              Array.isArray(currentRemedies) ? (
                <div className="space-y-4">
                  {currentRemedies.map((remedy: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`w-7 h-7 rounded-full ${colorClass.light} flex items-center justify-center flex-shrink-0`}
                      >
                        <span
                          className={`text-sm font-bold ${colorClass.text}`}
                        >
                          {idx + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        {typeof remedy === "string" ? (
                          <p className="text-gray-700">{remedy}</p>
                        ) : (
                          <div className="space-y-1">
                            {Object.entries(remedy).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-sm font-medium text-gray-600 capitalize">
                                  {key.replace(/_/g, " ")}:{" "}
                                </span>
                                <span className="text-sm text-gray-900">
                                  {String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : typeof currentRemedies === "object" ? (
                <div className="space-y-3">
                  {Object.entries(currentRemedies).map(([key, value]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 capitalize block mb-2">
                        {key.replace(/_/g, " ")}
                      </span>

                      {/* Handle array of remedies */}
                      {Array.isArray(value) ? (
                        value.length > 0 ? (
                          <div className="space-y-2">
                            {value.map((item, idx) => (
                              <p
                                key={idx}
                                className="text-sm text-gray-700 flex items-start gap-2"
                              >
                                <span
                                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${colorClass.light} ${colorClass.text} border ${colorClass.border}  text-xs font-medium flex-shrink-0 mt-0.5`}
                                >
                                  {idx + 1}
                                </span>
                                <span>{String(item)}</span>
                              </p>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )
                      ) : typeof value === "object" && value !== null ? (
                        <span className="text-sm text-gray-900">
                          {JSON.stringify(value)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-900">
                          {String(value) || "-"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">{String(currentRemedies)}</p>
              )
            ) : (
              <p className="text-gray-500 text-center py-6">
                No remedies available for {selectedRemedyPlanet}
              </p>
            )}
          </div>
        </div>

        {/* Remedies Summary Grid */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-900">
              All Planets Remedies Summary
            </h4>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 divide-x divide-gray-100">
            {PLANETS.map((planet) => {
              const hasData = remedies[planet.value];
              const pColorClass = COLOR_CLASSES[planet.color];
              const remedyCount = Array.isArray(hasData)
                ? hasData.length
                : hasData
                  ? 1
                  : 0;

              return (
                <button
                  key={planet.value}
                  onClick={() =>
                    hasData && setSelectedRemedyPlanet(planet.value)
                  }
                  className={`p-4 text-center hover:bg-gray-50 transition-colors ${
                    selectedRemedyPlanet === planet.value
                      ? pColorClass.light
                      : ""
                  }`}
                >
                  <Iconify
                    icon={planet.icon}
                    className={`text-2xl mx-auto mb-1 ${hasData ? pColorClass.text : "text-gray-300"}`}
                  />
                  <p className="text-xs font-medium text-gray-900">
                    {planet.label}
                  </p>
                  <p
                    className={`text-lg font-bold ${hasData ? pColorClass.text : "text-gray-300"}`}
                  >
                    {remedyCount}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Overview Section
  const OverviewSection = () => {
    if (!lalKitabData?.data) return null;

    const remediesCount = lalKitabData.data.remedies
      ? Object.values(lalKitabData.data.remedies).reduce(
          (acc: number, val: any) => {
            return acc + (Array.isArray(val) ? val.length : val ? 1 : 0);
          },
          0,
        )
      : 0;

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Iconify icon="mdi:chart-arc" className="text-lg text-red-600" />
              <span className="text-xs text-gray-500 uppercase">Horoscope</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {lalKitabData.data.horoscope ? "✓" : "-"}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Iconify
                icon="mdi:home-outline"
                className="text-lg text-blue-600"
              />
              <span className="text-xs text-gray-500 uppercase">Houses</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {Array.isArray(lalKitabData.data.houses)
                ? lalKitabData.data.houses.length
                : "12"}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Iconify icon="mdi:planet" className="text-lg text-purple-600" />
              <span className="text-xs text-gray-500 uppercase">Planets</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {Array.isArray(lalKitabData.data.planets)
                ? lalKitabData.data.planets.length
                : "9"}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Iconify
                icon="mdi:scale-balance"
                className="text-lg text-amber-600"
              />
              <span className="text-xs text-gray-500 uppercase">Debts</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {lalKitabData.data.debts ? "✓" : "-"}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Iconify
                icon="mdi:medical-bag"
                className="text-lg text-green-600"
              />
              <span className="text-xs text-gray-500 uppercase">Remedies</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {remediesCount}
            </p>
          </div>
        </div>

        {/* Horoscope Summary */}
        {lalKitabData.data.horoscope && (
          <DataTable
            data={lalKitabData.data.horoscope}
            title="Lal Kitab Horoscope"
          />
        )}

        {/* Planets Quick View */}
        {lalKitabData.data.planets &&
          Array.isArray(lalKitabData.data.planets) && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">
                  Planetary Positions
                </h4>
                <button
                  onClick={() => setActiveTab("planets")}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {lalKitabData.data.planets
                    .slice(0, 9)
                    .map((planet: any, idx: number) => {
                      const planetName = planet.name || planet.planet;
                      const planetConfig = PLANETS.find(
                        (p) => p.value === planetName,
                      );
                      const colorClass =
                        COLOR_CLASSES[planetConfig?.color || "slate"];

                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colorClass.light} ${colorClass.border} border`}
                        >
                          <Iconify
                            icon={planetConfig?.icon || "mdi:circle"}
                            className={colorClass.text}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {planetName}
                          </span>
                          {planet.house && (
                            <span className="text-xs text-gray-500">
                              H{planet.house}
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
      </div>
    );
  };

  // Render Tab Content
  const renderTabContent = () => {
    if (!lalKitabData?.data) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewSection />;
      case "horoscope":
        return (
          <DataTable
            data={lalKitabData.data.horoscope}
            title="Lal Kitab Horoscope"
          />
        );
      case "houses":
        return Array.isArray(lalKitabData.data.houses) ? (
          <HousesGrid houses={lalKitabData.data.houses} />
        ) : (
          <DataTable data={lalKitabData.data.houses} title="Houses" />
        );
      case "planets":
        return Array.isArray(lalKitabData.data.planets) ? (
          <PlanetsGrid planets={lalKitabData.data.planets} />
        ) : (
          <DataTable data={lalKitabData.data.planets} title="Planets" />
        );
      case "debts":
        return <DebtsSection debts={lalKitabData.data.debts} />;
      case "remedies":
        return <RemediesSection remedies={lalKitabData.data.remedies} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Lal Kitab"
          description="Traditional Vedic astrology with remedies for all planets"
          imageSrc="/images/lalkitab.png"
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
                onClick={fetchLalKitab}
                disabled={loading || !selectedPerson}
                className="mt-4 w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
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

            {/* Info Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Iconify
                  icon="mdi:book-open-page-variant"
                  className="text-lg text-red-500"
                />
                About Lal Kitab
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Lal Kitab is known for its simple and effective remedies (upay)
                to mitigate planetary afflictions.
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• 4 Base APIs (Horoscope, Houses, Planets, Debts)</p>
                <p>• 9 Remedies APIs (All Planets)</p>
                <p>• Total: 13 API Calls</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {lalKitabData ? (
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
                            ? "border-red-600 text-red-600 bg-red-50/50"
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
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                  <Iconify
                    icon="mdi:book-open-page-variant"
                    className="text-3xl text-red-400"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Lal Kitab Analysis
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a person and click "Calculate" to view complete Lal
                  Kitab analysis with remedies for all 9 planets.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
