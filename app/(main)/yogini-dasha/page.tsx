"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import { useUser } from "@/context/UserContext";

// Types matching API response
interface DashaPeriod {
  dasha_id: number;
  dasha_name: string;
  sub_dasha: string;
  start_date: string;
  end_date: string;
  start_ms?: number;
  end_ms?: number;
  duration?: number | string;
}

interface CurrentDasha {
  major_dasha: DashaPeriod;
  sub_dasha: DashaPeriod;
  sub_sub_dasha?: DashaPeriod;
}

interface YoginiDashaData {
  major_yogini_dasha: DashaPeriod[];
  sub_yogini_dasha_details: Record<string, { sub_dasha: DashaPeriod[] }>; // Object with keys like "sub_Mangala"
  current_yogini_dasha: CurrentDasha;
}

interface YoginiDashaResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: YoginiDashaData;
  errors?: Record<string, string>;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

// 8 Yoginis Configuration - Updated names to match API
const YOGINI_CONFIG: Record<
  string,
  { planet: string; years: number; nature: string; color: string; icon: string }
> = {
  Mangla: {
    planet: "Moon",
    years: 1,
    nature: "Auspicious",
    color: "blue",
    icon: "mdi:moon-waning-crescent",
  },
  Pingla: {
    planet: "Sun",
    years: 2,
    nature: "Mixed",
    color: "orange",
    icon: "mdi:white-balance-sunny",
  },
  Dhanya: {
    planet: "Jupiter",
    years: 3,
    nature: "Auspicious",
    color: "yellow",
    icon: "mdi:circle-outline",
  },
  Bhramari: {
    planet: "Mars",
    years: 4,
    nature: "Malefic",
    color: "red",
    icon: "mdi:triangle",
  },
  Bhadrika: {
    planet: "Mercury",
    years: 5,
    nature: "Auspicious",
    color: "green",
    icon: "mdi:atom",
  },
  Ulka: {
    planet: "Saturn",
    years: 6,
    nature: "Malefic",
    color: "slate",
    icon: "mdi:hexagon-outline",
  },
  Siddha: {
    planet: "Venus",
    years: 7,
    nature: "Auspicious",
    color: "pink",
    icon: "mdi:heart",
  },
  Sankata: {
    planet: "Rahu",
    years: 8,
    nature: "Malefic",
    color: "purple",
    icon: "mdi:circle-half-full",
  },
};

const COLOR_CLASSES: Record<
  string,
  { bg: string; text: string; border: string; light: string }
> = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    border: "border-blue-200",
    light: "bg-blue-50",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-600",
    border: "border-orange-200",
    light: "bg-orange-50",
  },
  yellow: {
    bg: "bg-yellow-500",
    text: "text-yellow-600",
    border: "border-yellow-200",
    light: "bg-yellow-50",
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
  slate: {
    bg: "bg-slate-500",
    text: "text-slate-600",
    border: "border-slate-200",
    light: "bg-slate-50",
  },
  pink: {
    bg: "bg-pink-500",
    text: "text-pink-600",
    border: "border-pink-200",
    light: "bg-pink-50",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-600",
    border: "border-purple-200",
    light: "bg-purple-50",
  },
};

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "major", label: "Major Dasha", icon: "mdi:chart-timeline-variant" },
  { key: "sub", label: "Sub Dasha", icon: "mdi:subdirectory-arrow-right" },
  { key: "current", label: "Current", icon: "mdi:clock-outline" },
];

export default function YoginiDashaPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [yoginiData, setYoginiData] = useState<YoginiDashaResponse | null>(
    null,
  );
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedMajorDasha, setSelectedMajorDasha] = useState<string | null>(
    null,
  );

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setYoginiData(null);
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

  const fetchYoginiDasha = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/yogini-dasha`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result: YoginiDashaResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch Yogini Dasha data");
      }
      setYoginiData(result);

      // Set default selected major dasha to current one
      if (result.data?.current_yogini_dasha?.major_dasha) {
        setSelectedMajorDasha(
          result.data.current_yogini_dasha.major_dasha.dasha_name,
        );
      } else if (result.data?.major_yogini_dasha?.length > 0) {
        setSelectedMajorDasha(result.data.major_yogini_dasha[0].dasha_name);
      }

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

  // Format date string
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "-";
    // Input format: "9-11-2000 5:9" -> "09 Nov 2000"
    const [datePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = parseInt(month) - 1;
    return `${day.padStart(2, "0")} ${months[monthIndex]} ${year}`;
  };

  // Get config with fallback
  const getYoginiConfig = (name: string) => {
    return (
      YOGINI_CONFIG[name] || {
        planet: "Unknown",
        years: 0,
        nature: "Unknown",
        color: "slate",
        icon: "mdi:circle",
      }
    );
  };

  const getColorClass = (name: string) => {
    const config = getYoginiConfig(name);
    return COLOR_CLASSES[config.color] || COLOR_CLASSES.slate;
  };

  // Check if a dasha is currently running
  const isCurrentDasha = (dasha: DashaPeriod): boolean => {
    if (!dasha.start_ms || !dasha.end_ms) return false;
    const now = Date.now();
    return now >= dasha.start_ms && now <= dasha.end_ms;
  };

  // Yogini Badge Component
  const YoginiBadge = ({
    name,
    size = "md",
  }: {
    name: string;
    size?: "sm" | "md" | "lg";
  }) => {
    const config = getYoginiConfig(name);
    const colorClass = getColorClass(name);

    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${colorClass.light} ${colorClass.border} ${colorClass.text} ${sizeClasses[size]}`}
      >
        <Iconify icon={config.icon} className="text-base" />
        {name}
      </span>
    );
  };

  // Current Dasha Card
  const CurrentDashaCard = () => {
    const current = yoginiData?.data?.current_yogini_dasha;
    if (!current) return null;

    const majorConfig = getYoginiConfig(current.major_dasha.dasha_name);
    const majorColor = getColorClass(current.major_dasha.dasha_name);
    const subConfig = getYoginiConfig(current.sub_dasha.dasha_name);
    const subColor = getColorClass(current.sub_dasha.dasha_name);

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
        </div>

        <div className="p-5 space-y-4">
          {/* Major Dasha */}
          <div
            className={`p-4 rounded-lg border ${majorColor.light} ${majorColor.border}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${majorColor.light}`}
                >
                  <Iconify
                    icon={majorConfig.icon}
                    className={`text-2xl ${majorColor.text}`}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Major Dasha
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {current.major_dasha.dasha_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {majorConfig.planet} •{" "}
                    {current.major_dasha.duration ||
                      majorConfig.years + " Years"}{" "}
                    • {majorConfig.nature}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700">
                  {formatDate(current.major_dasha.start_date)}
                </p>
                <p className="text-xs text-gray-500">
                  to {formatDate(current.major_dasha.end_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Sub Dasha */}
          <div
            className={`p-4 rounded-lg border ${subColor.light} ${subColor.border}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${subColor.light}`}
                >
                  <Iconify
                    icon={subConfig.icon}
                    className={`text-xl ${subColor.text}`}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Sub Dasha (Antardasha)
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {current.sub_dasha.dasha_name}
                  </p>
                  <p className="text-xs text-gray-500">{subConfig.planet}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700">
                  {formatDate(current.sub_dasha.start_date)}
                </p>
                <p className="text-xs text-gray-500">
                  to {formatDate(current.sub_dasha.end_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Sub Sub Dasha */}
          {current.sub_sub_dasha && (
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
                    <Iconify
                      icon={
                        getYoginiConfig(current.sub_sub_dasha.dasha_name).icon
                      }
                      className={`text-lg ${getColorClass(current.sub_sub_dasha.dasha_name).text}`}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Pratyantardasha
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {current.sub_sub_dasha.dasha_name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700">
                    {formatDate(current.sub_sub_dasha.start_date)}
                  </p>
                  <p className="text-xs text-gray-500">
                    to {formatDate(current.sub_sub_dasha.end_date)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Major Dasha Timeline
  const MajorDashaTimeline = () => {
    const majorDashas = yoginiData?.data?.major_yogini_dasha;
    if (!majorDashas || majorDashas.length === 0) return null;

    const currentMajor =
      yoginiData?.data?.current_yogini_dasha?.major_dasha?.dasha_name;

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">
            36-Year Yogini Cycle
          </h3>
          <p className="text-sm text-gray-500">
            Complete Yogini Dasha timeline
          </p>
        </div>

        <div className="p-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {majorDashas.map((dasha, idx) => {
              const config = getYoginiConfig(dasha.dasha_name);
              const colorClass = getColorClass(dasha.dasha_name);
              const isCurrent =
                dasha.dasha_name === currentMajor || isCurrentDasha(dasha);

              return (
                <div
                  key={idx}
                  className={`flex-shrink-0 w-32 p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                    isCurrent
                      ? `${colorClass.border} ${colorClass.light} border-2`
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedMajorDasha(dasha.dasha_name)}
                >
                  {isCurrent && (
                    <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-wide">
                      Current
                    </span>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Iconify
                      icon={config.icon}
                      className={`text-lg ${colorClass.text}`}
                    />
                    <span className="font-semibold text-gray-900 text-sm">
                      {dasha.dasha_name}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {config.planet} • {dasha.duration}y
                  </p>
                  <p className="text-[11px] text-gray-500 mt-2">
                    {formatDate(dasha.start_date)}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    to {formatDate(dasha.end_date)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Major Dasha Table
  const MajorDashaTable = () => {
    const majorDashas = yoginiData?.data?.major_yogini_dasha;
    if (!majorDashas || majorDashas.length === 0) return null;

    const currentMajor =
      yoginiData?.data?.current_yogini_dasha?.major_dasha?.dasha_name;

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">
            Major Yogini Dasha Periods
          </h3>
          <p className="text-sm text-gray-500">Complete dasha periods</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  #
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Yogini
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Planet
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Duration
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Nature
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Start
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  End
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {majorDashas.map((dasha, idx) => {
                const config = getYoginiConfig(dasha.dasha_name);
                const isCurrent =
                  dasha.dasha_name === currentMajor || isCurrentDasha(dasha);
                const colorClass = getColorClass(dasha.dasha_name);

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-gray-50 transition-colors ${isCurrent ? colorClass.light : ""}`}
                  >
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <YoginiBadge name={dasha.dasha_name} size="sm" />
                        {isCurrent && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {config.planet}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-indigo-600">
                      {dasha.duration} Years
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          config.nature === "Auspicious"
                            ? "bg-green-100 text-green-700"
                            : config.nature === "Malefic"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {config.nature}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {formatDate(dasha.start_date)}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {formatDate(dasha.end_date)}
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

  // Sub Dasha Section
  const SubDashaSection = () => {
    const subDetails = yoginiData?.data?.sub_yogini_dasha_details;

    if (!subDetails || Object.keys(subDetails).length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Iconify
            icon="mdi:information-outline"
            className="text-4xl text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500">No sub dasha details available</p>
        </div>
      );
    }

    // Get selected sub dasha data
    const selectedSubDashaKey = `sub_${selectedMajorDasha}`;
    const selectedSubDashaData = subDetails[selectedSubDashaKey];

    const currentMajor =
      yoginiData?.data?.current_yogini_dasha?.major_dasha?.dasha_name;

    // Get major dasha info from major_yogini_dasha array
    const majorDashas = yoginiData?.data?.major_yogini_dasha || [];

    return (
      <div className="space-y-4">
        {/* Yogini Selector */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
            Select Major Dasha to view Sub Periods
          </p>

          <div className="flex flex-wrap gap-2">
            {/* Show only unique Yogini names (8 Yoginis) */}
            {Array.from(new Set(majorDashas.map((d) => d.dasha_name))).map(
              (dashaName, idx) => {
                const config = getYoginiConfig(dashaName);
                const colorClass = getColorClass(dashaName);
                const isSelected = selectedMajorDasha === dashaName;
                const isCurrent = dashaName === currentMajor;
                const hasData = subDetails[`sub_${dashaName}`];

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedMajorDasha(dashaName)}
                    disabled={!hasData}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                      isSelected
                        ? `${colorClass.light} ${colorClass.border} ${colorClass.text}`
                        : hasData
                          ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Iconify icon={config.icon} className="text-lg" />
                    {dashaName}
                    {isCurrent && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">
                        Now
                      </span>
                    )}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Selected Sub Dasha Table */}
        {selectedSubDashaData && selectedMajorDasha && (
          <div
            className={`bg-white border rounded-lg overflow-hidden ${getColorClass(selectedMajorDasha).border}`}
          >
            <div
              className={`px-5 py-4 border-b ${getColorClass(selectedMajorDasha).light} ${getColorClass(selectedMajorDasha).border}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Iconify
                    icon={getYoginiConfig(selectedMajorDasha).icon}
                    className={`text-xl ${getColorClass(selectedMajorDasha).text}`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedMajorDasha} Sub Periods
                  </h3>
                  <p className="text-xs text-gray-600">
                    {majorDashas.find(
                      (d) => d.dasha_name === selectedMajorDasha,
                    ) &&
                      `${formatDate(majorDashas.find((d) => d.dasha_name === selectedMajorDasha)!.start_date)} to ${formatDate(majorDashas.find((d) => d.dasha_name === selectedMajorDasha)!.end_date)}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      #
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Sub Yogini
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Planet
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Nature
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Start
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      End
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedSubDashaData?.sub_dasha?.map(
                    (period: DashaPeriod, idx: number) => {
                      const config = getYoginiConfig(period.dasha_name);
                      const isCurrent = isCurrentDasha(period);

                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-gray-50 transition-colors ${isCurrent ? getColorClass(period.dasha_name).light : ""}`}
                        >
                          <td className="px-5 py-3 text-sm text-gray-500">
                            {idx + 1}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <YoginiBadge name={period.dasha_name} size="sm" />
                              {isCurrent && (
                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                                  Current
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-700">
                            {config.planet}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                config.nature === "Auspicious"
                                  ? "bg-green-100 text-green-700"
                                  : config.nature === "Malefic"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {config.nature}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-700">
                            {formatDate(period.start_date)}
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-700">
                            {formatDate(period.end_date)}
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Quick Stats
  const QuickStats = () => {
    const current = yoginiData?.data?.current_yogini_dasha;
    if (!current) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Total Cycle
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">36 Years</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Yoginis
          </p>
          <p className="text-2xl font-bold text-purple-600 mt-1">8</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Current Major
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Iconify
              icon={getYoginiConfig(current.major_dasha.dasha_name).icon}
              className={`text-xl ${getColorClass(current.major_dasha.dasha_name).text}`}
            />
            <span className="text-lg font-bold text-gray-900">
              {current.major_dasha.dasha_name}
            </span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Current Sub
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Iconify
              icon={getYoginiConfig(current.sub_dasha.dasha_name).icon}
              className={`text-xl ${getColorClass(current.sub_dasha.dasha_name).text}`}
            />
            <span className="text-lg font-bold text-gray-900">
              {current.sub_dasha.dasha_name}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Overview Section
  const OverviewSection = () => {
    return (
      <div className="space-y-6">
        <QuickStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrentDashaCard />
          <MajorDashaTimeline />
        </div>
      </div>
    );
  };

  // Render Tab Content
  const renderTabContent = () => {
    if (!yoginiData?.data) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewSection />;
      case "major":
        return <MajorDashaTable />;
      case "sub":
        return <SubDashaSection />;
      case "current":
        return <CurrentDashaCard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Yogini Dasha"
          description="36-year planetary period system based on 8 Yoginis"
          imageSrc="/images/yogini-dasha.png"
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
                onClick={fetchYoginiDasha}
                disabled={loading || !selectedPerson}
                className="mt-4 w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
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

            {/* 8 Yoginis Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Iconify
                  icon="mdi:information-outline"
                  className="text-lg text-purple-500"
                />
                8 Yoginis
              </h4>
              <div className="space-y-2">
                {Object.entries(YOGINI_CONFIG).map(([name, config]) => {
                  const colorClass = COLOR_CLASSES[config.color];
                  return (
                    <div
                      key={name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon={config.icon}
                          className={`text-base ${colorClass.text}`}
                        />
                        <span className="text-gray-700">{name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">
                          {config.planet}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {config.years}y
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Total Cycle</span>
                  <span className="text-purple-600 font-bold">36 Years</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {yoginiData ? (
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
                            ? "border-purple-600 text-purple-600 bg-purple-50/50"
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
                        About Yogini Dasha
                      </p>
                      <p>
                        Yogini Dasha is a 36-year planetary period system based
                        on 8 Yoginis, each ruled by a planet. It&apos;s known
                        for its simplicity and accuracy in timing events. The
                        cycle repeats every 36 years, making it easier to
                        calculate and predict life events.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
                  <Iconify
                    icon="mdi:yoga"
                    className="text-3xl text-purple-400"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Yogini Dasha Analysis
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a person and click &quot;Calculate&quot; to view Yogini
                  Dasha periods and predictions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
