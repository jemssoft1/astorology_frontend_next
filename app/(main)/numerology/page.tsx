"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";

// Types
interface NumerologyData {
  numero_table?: any;
  numero_report?: any;
  numero_fav_time?: any;
  numero_place_vastu?: any;
  numero_fasts_report?: any;
  numero_fav_lord?: any;
  numero_fav_mantra?: any;
  numero_daily_prediction?: any;
}

interface NumerologyResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: NumerologyData;
  errors?: Record<string, string>;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "numero_table", label: "Number Table", icon: "mdi:table" },
  { key: "numero_report", label: "Report", icon: "mdi:file-document-outline" },
  {
    key: "numero_fav_time",
    label: "Favorable Time",
    icon: "mdi:clock-outline",
  },
  {
    key: "numero_place_vastu",
    label: "Vastu & Place",
    icon: "mdi:home-city-outline",
  },
  { key: "numero_fasts_report", label: "Fasts", icon: "mdi:food-off-outline" },
  {
    key: "numero_fav_lord",
    label: "Favorable Lord",
    icon: "mdi:account-star-outline",
  },
  { key: "numero_fav_mantra", label: "Mantras", icon: "mdi:om" },
  {
    key: "numero_daily_prediction",
    label: "Daily Prediction",
    icon: "mdi:calendar-today",
  },
];

const NUMBER_COLORS: Record<
  number,
  { bg: string; text: string; border: string }
> = {
  1: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
  },
  2: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  3: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-200",
  },
  4: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  5: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  6: { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
  7: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
  },
  8: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
  9: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
};

export default function NumerologyPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [numeroData, setNumeroData] = useState<NumerologyResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setNumeroData(null);
  };

  const getPayload = (person: Person) => {
    const birthDate = new Date(person.BirthTime);

    return {
      day: birthDate.getUTCDate(),
      month: birthDate.getUTCMonth() + 1,
      year: birthDate.getUTCFullYear(),
      name: person.Name,
    };
  };

  const fetchNumerology = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = getPayload(selectedPerson);
      const response = await fetch(`/api/numerology`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: NumerologyResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch Numerology data");
      }
      setNumeroData(result);

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
        error instanceof Error
          ? error.message
          : "Failed to get Numerology data";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Format cell value helper
  const formatCellValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return "-";

    if (Array.isArray(value)) {
      if (value.length === 0) return "-";
      if (value.length === 1) return String(value[0]);
      return (
        <div className="space-y-1">
          {value.map((item, idx) => (
            <p key={idx} className="text-sm">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-medium mr-2">
                {idx + 1}
              </span>
              {String(item)}
            </p>
          ))}
        </div>
      );
    }

    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return String(value);
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

  // Data Table Component
  const DataTable = ({ data, title }: { data: any; title?: string }) => {
    if (!data) return <EmptyState message="No data available" />;

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
                      <td
                        key={key}
                        className="px-4 py-3 text-sm text-gray-700 align-top"
                      >
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
              <div key={key} className="flex px-5 py-3 hover:bg-gray-50">
                <span className="text-sm font-medium text-gray-600 capitalize min-w-[180px]">
                  {key.replace(/_/g, " ")}
                </span>
                <div className="flex-1 text-sm text-gray-900">
                  {formatCellValue(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <p className="text-gray-700">{String(data)}</p>;
  };

  // Number Card Component
  const NumberCard = ({
    number,
    label,
    description,
  }: {
    number: number;
    label: string;
    description?: string;
  }) => {
    const colors = NUMBER_COLORS[number] || NUMBER_COLORS[1];

    return (
      <div className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 ${colors.border}`}
          >
            <span className={`text-2xl font-bold ${colors.text}`}>
              {number}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{label}</p>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Numero Table Component
  const NumeroTableSection = ({ data }: { data: any }) => {
    if (!data) return <EmptyState message="No number table data available" />;

    // Check if it has common numerology fields
    const keyNumbers = [
      { key: "destiny_number", label: "Destiny Number", desc: "Life Path" },
      { key: "radical_number", label: "Radical Number", desc: "Birth Number" },
      { key: "name_number", label: "Name Number", desc: "Expression" },
      { key: "evil_number", label: "Evil Number", desc: "Challenges" },
      { key: "lucky_number", label: "Lucky Number", desc: "Fortune" },
      { key: "friendly_number", label: "Friendly Numbers", desc: "Compatible" },
      { key: "neutral_number", label: "Neutral Numbers", desc: "Neutral" },
      { key: "enemy_number", label: "Enemy Numbers", desc: "Conflicting" },
    ];

    const hasKeyNumbers = keyNumbers.some((kn) => data[kn.key] !== undefined);

    if (hasKeyNumbers) {
      return (
        <div className="space-y-6">
          {/* Primary Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyNumbers.slice(0, 4).map((item) => {
              const value = data[item.key];
              if (value === undefined) return null;
              const num =
                typeof value === "number"
                  ? value
                  : parseInt(String(value)) || 1;

              return (
                <NumberCard
                  key={item.key}
                  number={num}
                  label={item.label}
                  description={item.desc}
                />
              );
            })}
          </div>

          {/* Secondary Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyNumbers.slice(4).map((item) => {
              const value = data[item.key];
              if (value === undefined) return null;

              const colors = NUMBER_COLORS[1];

              return (
                <div
                  key={item.key}
                  className={`bg-white border border-gray-200 rounded-lg p-4`}
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {item.label}
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formatCellValue(value)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Other Data */}
          <DataTable data={data} title="Complete Number Analysis" />
        </div>
      );
    }

    return <DataTable data={data} title="Number Table" />;
  };

  // Favorable Time Section
  const FavorableTimeSection = ({ data }: { data: any }) => {
    if (!data) return <EmptyState message="No favorable time data available" />;

    if (typeof data === "object" && !Array.isArray(data)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Iconify
                  icon="mdi:clock-outline"
                  className="text-lg text-indigo-600"
                />
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {key.replace(/_/g, " ")}
                </p>
              </div>
              <p className="font-semibold text-gray-900">
                {formatCellValue(value)}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return <DataTable data={data} title="Favorable Time" />;
  };

  // Vastu Section
  const VastuSection = ({ data }: { data: any }) => {
    if (!data) return <EmptyState message="No vastu data available" />;

    if (typeof data === "object" && !Array.isArray(data)) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data).map(([key, value]) => {
              const icons: Record<string, string> = {
                direction: "mdi:compass-outline",
                place: "mdi:map-marker-outline",
                color: "mdi:palette-outline",
                metal: "mdi:gold",
                stone: "mdi:diamond-stone",
                default: "mdi:home-city-outline",
              };
              const icon = icons[key.toLowerCase()] || icons.default;

              return (
                <div
                  key={key}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Iconify icon={icon} className="text-lg text-green-600" />
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {key.replace(/_/g, " ")}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatCellValue(value)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return <DataTable data={data} title="Vastu & Place" />;
  };

  // Fasts Section
  const FastsSection = ({ data }: { data: any }) => {
    if (!data) return <EmptyState message="No fasts data available" />;

    const dayIcons: Record<string, string> = {
      sunday: "mdi:white-balance-sunny",
      monday: "mdi:moon-waning-crescent",
      tuesday: "mdi:triangle",
      wednesday: "mdi:atom",
      thursday: "mdi:circle-outline",
      friday: "mdi:heart",
      saturday: "mdi:hexagon-outline",
    };

    if (Array.isArray(data)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((fast: any, idx: number) => {
            const day = fast.day || fast.name || `Fast ${idx + 1}`;
            const icon = dayIcons[day.toLowerCase()] || "mdi:food-off-outline";

            return (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    <Iconify icon={icon} className="text-xl text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{day}</p>
                    {fast.deity && (
                      <p className="text-xs text-gray-500">{fast.deity}</p>
                    )}
                  </div>
                </div>
                {Object.entries(fast).map(([key, value]) => {
                  if (key === "day" || key === "name" || key === "deity")
                    return null;
                  return (
                    <div
                      key={key}
                      className="flex justify-between text-sm py-1"
                    >
                      <span className="text-gray-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-900">
                        {formatCellValue(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    }

    return <DataTable data={data} title="Fasts Report" />;
  };

  // Mantra Section
  const MantraSection = ({ data }: { data: any }) => {
    if (!data) return <EmptyState message="No mantra data available" />;

    if (Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {data.map((mantra: any, idx: number) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Iconify icon="mdi:om" className="text-xl text-purple-600" />
                </div>
                <div className="flex-1">
                  {typeof mantra === "string" ? (
                    <p className="text-gray-900 font-medium">{mantra}</p>
                  ) : (
                    <>
                      {mantra.name && (
                        <p className="font-semibold text-gray-900 mb-1">
                          {mantra.name}
                        </p>
                      )}
                      {mantra.mantra && (
                        <p className="text-indigo-700 font-medium bg-indigo-50 p-3 rounded-lg mb-2">
                          {mantra.mantra}
                        </p>
                      )}
                      {Object.entries(mantra).map(([key, value]) => {
                        if (key === "name" || key === "mantra") return null;
                        return (
                          <div
                            key={key}
                            className="flex justify-between text-sm py-1"
                          >
                            <span className="text-gray-500 capitalize">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="text-gray-900">
                              {formatCellValue(value)}
                            </span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (typeof data === "object") {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Iconify icon="mdi:om" className="text-xl text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Favorable Mantras</h4>
          </div>
          <div className="space-y-3">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {key.replace(/_/g, " ")}
                </p>
                <p className="text-gray-900">{formatCellValue(value)}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <DataTable data={data} title="Mantras" />;
  };

  // Daily Prediction Section
  const DailyPredictionSection = ({ data }: { data: any }) => {
    if (!data) return <EmptyState message="No daily prediction available" />;

    const categories = [
      {
        key: "general",
        label: "General",
        icon: "mdi:star-outline",
        color: "indigo",
      },
      {
        key: "love",
        label: "Love & Relationship",
        icon: "mdi:heart-outline",
        color: "pink",
      },
      {
        key: "career",
        label: "Career",
        icon: "mdi:briefcase-outline",
        color: "blue",
      },
      {
        key: "health",
        label: "Health",
        icon: "mdi:heart-pulse",
        color: "green",
      },
      {
        key: "finance",
        label: "Finance",
        icon: "mdi:currency-usd",
        color: "amber",
      },
      { key: "lucky", label: "Lucky", icon: "mdi:clover", color: "emerald" },
    ];

    if (typeof data === "object" && !Array.isArray(data)) {
      return (
        <div className="space-y-4">
          {/* Date Header */}
          {data.date && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
              <Iconify
                icon="mdi:calendar"
                className="text-2xl text-indigo-600"
              />
              <div>
                <p className="text-xs text-gray-500">Prediction for</p>
                <p className="font-semibold text-gray-900">{data.date}</p>
              </div>
            </div>
          )}

          {/* Prediction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data).map(([key, value]) => {
              if (key === "date") return null;

              const category = categories.find((c) =>
                key.toLowerCase().includes(c.key),
              );
              const icon = category?.icon || "mdi:information-outline";

              return (
                <div
                  key={key}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Iconify icon={icon} className="text-lg text-indigo-600" />
                    <p className="font-semibold text-gray-900 capitalize">
                      {key.replace(/_/g, " ")}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {formatCellValue(value)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return <DataTable data={data} title="Daily Prediction" />;
  };

  // Overview Section
  const OverviewSection = () => {
    if (!numeroData?.data) return null;

    const { numero_table, numero_report, numero_daily_prediction } =
      numeroData.data;

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {numero_table?.destiny_number && (
            <NumberCard
              number={numero_table.destiny_number}
              label="Destiny Number"
              description="Life Path"
            />
          )}
          {numero_table?.radical_number && (
            <NumberCard
              number={numero_table.radical_number}
              label="Radical Number"
              description="Birth Number"
            />
          )}
          {numero_table?.name_number && (
            <NumberCard
              number={numero_table.name_number}
              label="Name Number"
              description="Expression"
            />
          )}
          {numero_table?.lucky_number && (
            <NumberCard
              number={numero_table.lucky_number}
              label="Lucky Number"
              description="Fortune"
            />
          )}
        </div>

        {/* Report Summary */}
        {numero_report && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">
                Numerology Report
              </h4>
              <button
                onClick={() => setActiveTab("numero_report")}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Full →
              </button>
            </div>
            <div className="p-5">
              {typeof numero_report === "object" &&
              !Array.isArray(numero_report) ? (
                <div className="space-y-3">
                  {Object.entries(numero_report)
                    .slice(0, 3)
                    .map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-gray-900">
                          {formatCellValue(value)}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-700">
                  {formatCellValue(numero_report)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Daily Prediction Quick View */}
        {numero_daily_prediction && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">
                Today's Prediction
              </h4>
              <button
                onClick={() => setActiveTab("numero_daily_prediction")}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Full →
              </button>
            </div>
            <div className="p-5">
              {typeof numero_daily_prediction === "object" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(numero_daily_prediction)
                    .slice(0, 4)
                    .map(([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {formatCellValue(value)}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-700">
                  {formatCellValue(numero_daily_prediction)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Tab Content
  const renderTabContent = () => {
    if (!numeroData?.data) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewSection />;
      case "numero_table":
        return <NumeroTableSection data={numeroData.data.numero_table} />;
      case "numero_report":
        return (
          <DataTable
            data={numeroData.data.numero_report}
            title="Numerology Report"
          />
        );
      case "numero_fav_time":
        return <FavorableTimeSection data={numeroData.data.numero_fav_time} />;
      case "numero_place_vastu":
        return <VastuSection data={numeroData.data.numero_place_vastu} />;
      case "numero_fasts_report":
        return <FastsSection data={numeroData.data.numero_fasts_report} />;
      case "numero_fav_lord":
        return (
          <DataTable
            data={numeroData.data.numero_fav_lord}
            title="Favorable Lord"
          />
        );
      case "numero_fav_mantra":
        return <MantraSection data={numeroData.data.numero_fav_mantra} />;
      case "numero_daily_prediction":
        return (
          <DailyPredictionSection
            data={numeroData.data.numero_daily_prediction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Numerology"
          description="Discover the power of numbers in your life"
          imageSrc="/images/numerology.png"
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
                onClick={fetchNumerology}
                disabled={loading || !selectedPerson}
                className="mt-4 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                  icon="mdi:information-outline"
                  className="text-lg text-indigo-500"
                />
                About Numerology
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Numerology is the study of numbers and their influence on human
                life. It reveals your personality, destiny, and life path
                through your birth date and name.
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Destiny Number - Life Purpose</p>
                <p>• Radical Number - Core Personality</p>
                <p>• Name Number - Expression</p>
                <p>• Lucky Numbers & Colors</p>
              </div>
            </div>

            {/* Selected Person Info */}
            {selectedPerson && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Selected Profile
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="text-gray-900 font-medium">
                      {selectedPerson.Name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Birth Date</span>
                    <span className="text-gray-900">
                      {new Date(selectedPerson.BirthTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {numeroData ? (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="flex overflow-x-auto border-b border-gray-200">
                    {TABS.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.key
                            ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                            : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Iconify icon={tab.icon} className="text-lg" />
                        <span className="hidden md:inline">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div>{renderTabContent()}</div>

                {/* Errors Section */}
                {numeroData.errors &&
                  Object.keys(numeroData.errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                        <Iconify icon="mdi:alert-circle" />
                        API Errors
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(numeroData.errors).map(
                          ([key, error]) => (
                            <p key={key} className="text-xs text-red-600">
                              <span className="font-medium capitalize">
                                {key.replace(/_/g, " ")}:
                              </span>{" "}
                              {error}
                            </p>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                  <Iconify
                    icon="mdi:numeric"
                    className="text-3xl text-indigo-400"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Numerology Analysis
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a person and click "Calculate" to discover your
                  numerology profile, lucky numbers, and daily predictions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
