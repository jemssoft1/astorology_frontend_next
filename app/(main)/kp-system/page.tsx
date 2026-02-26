"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import BirthChartSection from "@/components/horoscope/BirthChartSection";
import { useUser } from "@/context/UserContext";

// Types
interface KPSystemData {
  kp_planets?: any;
  kp_house_cusps?: any;
  kp_birth_chart?: any;
  kp_house_significator?: any;
  kp_planet_significator?: any;
}

interface KPSystemResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: KPSystemData;
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
    icon: "mdi:white-balance-sunny",
    color: "orange",
  },
  {
    value: "Moon",
    label: "Moon",
    icon: "mdi:moon-waning-crescent",
    color: "blue",
  },
  { value: "Mars", label: "Mars", icon: "mdi:triangle", color: "red" },
  { value: "Mercury", label: "Mercury", icon: "mdi:atom", color: "green" },
  {
    value: "Jupiter",
    label: "Jupiter",
    icon: "mdi:circle-outline",
    color: "yellow",
  },
  { value: "Venus", label: "Venus", icon: "mdi:heart", color: "pink" },
  {
    value: "Saturn",
    label: "Saturn",
    icon: "mdi:hexagon-outline",
    color: "slate",
  },
  {
    value: "Rahu",
    label: "Rahu",
    icon: "mdi:circle-half-full",
    color: "purple",
  },
  {
    value: "Ketu",
    label: "Ketu",
    icon: "mdi:star-four-points",
    color: "amber",
  },
  {
    value: "Ascendant",
    label: "Asc",
    icon: "mdi:arrow-up-bold",
    color: "indigo",
  },
];

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "kp_planets", label: "Planets", icon: "mdi:planet" },
  { key: "kp_house_cusps", label: "House Cusps", icon: "mdi:home-outline" },
  { key: "kp_birth_chart", label: "Birth Chart", icon: "mdi:chart-arc" },
  {
    key: "kp_house_significator",
    label: "House Significators",
    icon: "mdi:home-search",
  },
  {
    key: "kp_planet_significator",
    label: "Planet Significators",
    icon: "mdi:star-circle-outline",
  },
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

export default function KPSystemPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [kpData, setKpData] = useState<KPSystemResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { user } = useUser();
  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setKpData(null);
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

  const fetchKPSystem = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kp-system`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result: KPSystemResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch KP System data");
      }
      setKpData(result);

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
        error instanceof Error ? error.message : "Failed to get KP System data";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format cell value
  const formatCellValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return "-";

    if (Array.isArray(value)) {
      if (value.length === 0) return "-";
      if (value.length === 1) return String(value[0]);
      return (
        <div className="space-y-1">
          {value.map((item, idx) => (
            <span
              key={idx}
              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded mr-1"
            >
              {String(item)}
            </span>
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

  // Planets Grid Component
  const PlanetsGrid = ({ planets }: { planets: any[] }) => {
    if (!planets || planets.length === 0)
      return <EmptyState message="No planets data" />;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {planets.map((planet: any, idx: number) => {
          const planetName =
            planet.name ||
            planet.planet ||
            planet.planet_name ||
            `Planet ${idx + 1}`;
          const planetConfig = PLANETS.find(
            (p) => p.value === planetName || p.label === planetName,
          );
          const colorClass = COLOR_CLASSES[planetConfig?.color || "slate"];

          return (
            <div
              key={idx}
              className={`bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow ${colorClass.border}`}
            >
              <div className="flex items-center gap-3 mb-4">
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
                  {planet.sign && (
                    <p className="text-xs text-gray-500">{planet.sign}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {Object.entries(planet).map(([key, value]) => {
                  if (
                    key === "name" ||
                    key === "planet" ||
                    key === "planet_name"
                  )
                    return null;
                  return (
                    <div key={key} className="flex justify-between items-start">
                      <span className="text-gray-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-900 text-right max-w-[60%]">
                        {formatCellValue(value)}
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

  // House Cusps Grid Component
  const HouseCuspsGrid = ({ cusps }: { cusps: any[] }) => {
    if (!cusps || cusps.length === 0)
      return <EmptyState message="No house cusps data" />;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cusps.map((cusp: any, idx: number) => {
          const houseNum = cusp.house || cusp.house_number || idx + 1;

          return (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600">
                    {houseNum}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  House {houseNum}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {Object.entries(cusp).map(([key, value]) => {
                  if (key === "house" || key === "house_number") return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {formatCellValue(value)}
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

  // Significators Grid Component
  const SignificatorsGrid = ({
    data,
    type,
  }: {
    data: any[];
    type: "house" | "planet";
  }) => {
    if (!data || data.length === 0)
      return <EmptyState message="No significators data" />;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item: any, idx: number) => {
          const title =
            type === "house"
              ? `House ${item.house || item.house_number || idx + 1}`
              : item.planet || item.name || `Planet ${idx + 1}`;

          const planetConfig =
            type === "planet"
              ? PLANETS.find((p) => p.value === title || p.label === title)
              : null;
          const colorClass = COLOR_CLASSES[planetConfig?.color || "indigo"];

          return (
            <div
              key={idx}
              className={`bg-white border rounded-lg p-4 ${colorClass.border}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full ${colorClass.light} flex items-center justify-center`}
                >
                  {type === "house" ? (
                    <span className="text-sm font-bold text-indigo-600">
                      {item.house || idx + 1}
                    </span>
                  ) : (
                    <Iconify
                      icon={planetConfig?.icon || "mdi:circle"}
                      className={`text-xl ${colorClass.text}`}
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">
                    {type === "house" ? "Significator" : "Significances"}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {Object.entries(item).map(([key, value]) => {
                  if (
                    key === "house" ||
                    key === "house_number" ||
                    key === "planet" ||
                    key === "name"
                  )
                    return null;
                  return (
                    <div key={key} className="flex justify-between items-start">
                      <span className="text-gray-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-900 text-right max-w-[60%]">
                        {formatCellValue(value)}
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

  // Overview Section
  const OverviewSection = () => {
    if (!kpData?.data) return null;

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Iconify icon="mdi:planet" className="text-lg text-indigo-600" />
              <span className="text-xs text-gray-500 uppercase">Planets</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {Array.isArray(kpData.data.kp_planets)
                ? kpData.data.kp_planets.length
                : kpData.data.kp_planets
                  ? "✓"
                  : "-"}
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
              {Array.isArray(kpData.data.kp_house_cusps)
                ? kpData.data.kp_house_cusps.length
                : "12"}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Iconify
                icon="mdi:chart-arc"
                className="text-lg text-purple-600"
              />
              <span className="text-xs text-gray-500 uppercase">
                Birth Chart
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {kpData.data.kp_birth_chart ? "✓" : "-"}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Iconify
                icon="mdi:home-search"
                className="text-lg text-green-600"
              />
              <span className="text-xs text-gray-500 uppercase">
                House Sig.
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {kpData.data.kp_house_significator ? "✓" : "-"}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Iconify
                icon="mdi:star-circle-outline"
                className="text-lg text-amber-600"
              />
              <span className="text-xs text-gray-500 uppercase">
                Planet Sig.
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {kpData.data.kp_planet_significator ? "✓" : "-"}
            </p>
          </div>
        </div>

        {/* Planets Quick View */}
        {kpData.data.kp_planets && Array.isArray(kpData.data.kp_planets) && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">
                KP Planets Overview
              </h4>
              <button
                onClick={() => setActiveTab("kp_planets")}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-3">
                {kpData.data.kp_planets
                  .slice(0, 9)
                  .map((planet: any, idx: number) => {
                    const planetName =
                      planet.name || planet.planet || planet.planet_name;
                    const planetConfig = PLANETS.find(
                      (p) => p.value === planetName || p.label === planetName,
                    );
                    const colorClass =
                      COLOR_CLASSES[planetConfig?.color || "slate"];

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colorClass.light} ${colorClass.border}`}
                      >
                        <Iconify
                          icon={planetConfig?.icon || "mdi:circle"}
                          className={colorClass.text}
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {planetName}
                          </span>
                          {planet.sign && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({planet.sign})
                            </span>
                          )}
                        </div>
                        {planet.nakshatra && (
                          <span className="text-xs bg-white px-2 py-0.5 rounded text-gray-600">
                            {planet.nakshatra}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* House Cusps Quick View */}
        {kpData.data.kp_house_cusps &&
          Array.isArray(kpData.data.kp_house_cusps) && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">
                  House Cusps Overview
                </h4>
                <button
                  onClick={() => setActiveTab("kp_house_cusps")}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View All →
                </button>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                  {kpData.data.kp_house_cusps
                    .slice(0, 12)
                    .map((cusp: any, idx: number) => (
                      <div
                        key={idx}
                        className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <p className="text-lg font-bold text-indigo-600">
                          {cusp.house || idx + 1}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {cusp.sign || cusp.cusp_sign || "-"}
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

  // Render Tab Content
  const renderTabContent = () => {
    if (!kpData?.data) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewSection />;

      case "kp_planets":
        return Array.isArray(kpData.data.kp_planets) ? (
          <PlanetsGrid planets={kpData.data.kp_planets} />
        ) : (
          <DataTable data={kpData.data.kp_planets} title="KP Planets" />
        );

      case "kp_house_cusps":
        return Array.isArray(kpData.data.kp_house_cusps) ? (
          <HouseCuspsGrid cusps={kpData.data.kp_house_cusps} />
        ) : (
          <DataTable data={kpData.data.kp_house_cusps} title="House Cusps" />
        );

      case "kp_birth_chart":
        if (!selectedPerson)
          return <EmptyState message="Select a person to view birth chart" />;

        // Prepare birth data for helper
        const chartBirthData = {
          location: encodeURIComponent(selectedPerson.BirthLocation.trim()),
          time: new Date(selectedPerson.BirthTime).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(selectedPerson.BirthTime).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          offset: encodeURIComponent(selectedPerson.TimezoneOffset || "+05:30"),
        };

        return (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <BirthChartSection birthData={chartBirthData} ayanamsa="KP" />
          </div>
        );

      case "kp_house_significator":
        return Array.isArray(kpData.data.kp_house_significator) ? (
          <SignificatorsGrid
            data={kpData.data.kp_house_significator}
            type="house"
          />
        ) : (
          <DataTable
            data={kpData.data.kp_house_significator}
            title="House Significators"
          />
        );

      case "kp_planet_significator":
        return Array.isArray(kpData.data.kp_planet_significator) ? (
          <SignificatorsGrid
            data={kpData.data.kp_planet_significator}
            type="planet"
          />
        ) : (
          <DataTable
            data={kpData.data.kp_planet_significator}
            title="Planet Significators"
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
          title="KP System (Krishnamurti Paddhati)"
          description="Advanced stellar astrology system with sub-lord theory"
          imageSrc="/images/kp-system.png"
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
                onClick={fetchKPSystem}
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
                About KP System
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Krishnamurti Paddhati (KP) is a modern system of Vedic astrology
                developed by Prof. K.S. Krishnamurti. It uses the concept of
                Sub-Lords for precise predictions.
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Sub-Lord based predictions</p>
                <p>• 249 Sub divisions (Nakshatra Pada)</p>
                <p>• House & Planet Significators</p>
                <p>• Cuspal Sub-Lord theory</p>
              </div>
            </div>

            {/* Selected Person Info */}
            {selectedPerson && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Iconify
                    icon="mdi:account-circle-outline"
                    className="text-lg text-gray-500"
                  />
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
                  <div className="flex justify-between">
                    <span className="text-gray-500">Birth Time</span>
                    <span className="text-gray-900">
                      {new Date(selectedPerson.BirthTime).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {kpData ? (
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

                {/* Errors Section */}
                {kpData.errors && Object.keys(kpData.errors).length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                      <Iconify icon="mdi:alert-circle" />
                      API Errors
                    </h4>
                    <div className="space-y-1">
                      {Object.entries(kpData.errors).map(([key, error]) => (
                        <p key={key} className="text-xs text-red-600">
                          <span className="font-medium capitalize">
                            {key.replace(/_/g, " ")}:
                          </span>{" "}
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                  <Iconify
                    icon="mdi:chart-arc"
                    className="text-3xl text-indigo-400"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  KP System Analysis
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a person and click "Calculate" to view KP System
                  analysis including planets, house cusps, and significators.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
