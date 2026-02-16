"use client";

import React, { useState } from "react";
import Iconify from "@/components/Iconify";
import PersonSelector from "@/components/PersonSelector";
import PageHeader from "@/components/PageHeader";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";
// ============ CONSTANTS ============

const NUMBER_COLORS: Record<number, string> = {
  1: "#EF4444",
  2: "#F97316",
  3: "#FBBF24",
  4: "#22C55E",
  5: "#06B6D4",
  6: "#3B82F6",
  7: "#8B5CF6",
  8: "#EC4899",
  9: "#6B7280",
};

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "report", label: "About You", icon: "mdi:account-outline" },
  { key: "remedies", label: "Remedies", icon: "mdi:hand-heart-outline" },
  { key: "prediction", label: "Daily Prediction", icon: "mdi:crystal-ball" },
];

// ============ MAIN COMPONENT ============

function NumerologyPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

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
        name: selectedPerson.Name,
      };

      const response = await fetch("/api/western_numerology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.status === "Pass" || data.success) {
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

  // Get data helpers
  const getTable = () => result?.data?.numero_table || null;
  const getReport = () => result?.data?.numero_report || null;
  const getFavTime = () => result?.data?.numero_fav_time || null;
  const getVastu = () => result?.data?.numero_place_vastu || null;
  const getFasts = () => result?.data?.numero_fasts_report || null;
  const getFavLord = () => result?.data?.numero_fav_lord || null;
  const getFavMantra = () => result?.data?.numero_fav_mantra || null;
  const getDailyPrediction = () =>
    result?.data?.numero_daily_prediction || null;

  return (
    <div className="container mx-auto pb-12">
      <PageHeader
        title="Numerology Analysis"
        description="Discover your destiny through numbers"
        imageSrc="/images/numerology-banner.jpg"
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
            {activeTab === "overview" && getTable() && (
              <div className="space-y-6">
                {/* Main Numbers */}
                <div className="grid grid-cols-3 gap-4">
                  <NumberCard
                    label="Destiny Number"
                    number={getTable().destiny_number}
                    subtitle="Life Purpose"
                  />
                  <NumberCard
                    label="Radical Number"
                    number={getTable().radical_number}
                    subtitle={`Ruler: ${getTable().radical_ruler}`}
                  />
                  <NumberCard
                    label="Name Number"
                    number={getTable().name_number}
                    subtitle="Expression"
                  />
                </div>

                {/* Lucky & Unlucky Numbers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Friendly Numbers
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getTable()
                        .friendly_num?.split(",")
                        .map((num: string) => (
                          <span
                            key={num}
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm"
                            style={{
                              backgroundColor: `${NUMBER_COLORS[parseInt(num.trim())] || "#6B7280"}15`,
                              color:
                                NUMBER_COLORS[parseInt(num.trim())] ||
                                "#6B7280",
                            }}
                          >
                            {num.trim()}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Neutral Numbers
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getTable()
                        .neutral_num?.split(",")
                        .map((num: string) => (
                          <span
                            key={num}
                            className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center font-semibold text-sm"
                          >
                            {num.trim()}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Evil Numbers
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getTable()
                        .evil_num?.split(",")
                        .map((num: string) => (
                          <span
                            key={num}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-semibold text-sm"
                          >
                            {num.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Favourites Table */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Your Favourites
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-500 w-40">
                            <div className="flex items-center gap-2">
                              <Iconify
                                icon="mdi:palette"
                                width={16}
                                className="text-gray-400"
                              />
                              Favourite Color
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-800">
                            <span className="inline-flex items-center gap-2">
                              <span
                                className="w-4 h-4 rounded-full border border-gray-200"
                                style={{
                                  backgroundColor:
                                    getTable().fav_color?.toLowerCase(),
                                }}
                              />
                              {getTable().fav_color}
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-500">
                            <div className="flex items-center gap-2">
                              <Iconify
                                icon="mdi:calendar-week"
                                width={16}
                                className="text-gray-400"
                              />
                              Favourite Days
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-800">
                            {getTable().fav_day}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-500">
                            <div className="flex items-center gap-2">
                              <Iconify
                                icon="mdi:diamond-stone"
                                width={16}
                                className="text-gray-400"
                              />
                              Favourite Stone
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-800">
                            {getTable().fav_stone}
                            {getTable().fav_substone && (
                              <span className="text-gray-500 text-xs ml-2">
                                (Sub: {getTable().fav_substone})
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-500">
                            <div className="flex items-center gap-2">
                              <Iconify
                                icon="mdi:gold"
                                width={16}
                                className="text-gray-400"
                              />
                              Favourite Metal
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-800">
                            {getTable().fav_metal}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-500">
                            <div className="flex items-center gap-2">
                              <Iconify
                                icon="mdi:hands-pray"
                                width={16}
                                className="text-gray-400"
                              />
                              Favourite God
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-800">
                            {getTable().fav_god}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-gray-500">
                            <div className="flex items-center gap-2">
                              <Iconify
                                icon="mdi:om"
                                width={16}
                                className="text-gray-400"
                              />
                              Favourite Mantra
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-amber-700 italic">
                            {getTable().fav_mantra}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Personal Info Card */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-semibold text-gray-800 capitalize">
                        {getTable().name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Birth Date</p>
                      <p className="font-semibold text-gray-800">
                        {getTable().date}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Radical Ruler</p>
                      <p className="font-semibold text-gray-800">
                        {getTable().radical_ruler}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Radical Number</p>
                      <p className="font-semibold text-gray-800">
                        {getTable().radical_num}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============ REPORT TAB ============ */}
            {activeTab === "report" && (
              <div className="space-y-6">
                {/* Main Report */}
                {getReport() && (
                  <ReportCard
                    title={getReport().title}
                    description={getReport().description}
                    icon="mdi:account-details"
                    color="#3B82F6"
                  />
                )}

                {/* Favourable Time */}
                {getFavTime() && (
                  <ReportCard
                    title={getFavTime().title}
                    description={getFavTime().description}
                    icon="mdi:clock-outline"
                    color="#22C55E"
                  />
                )}

                {/* Vastu */}
                {getVastu() && (
                  <ReportCard
                    title={getVastu().title}
                    description={getVastu().description}
                    icon="mdi:home-outline"
                    color="#8B5CF6"
                  />
                )}
              </div>
            )}

            {/* ============ REMEDIES TAB ============ */}
            {activeTab === "remedies" && (
              <div className="space-y-6">
                {/* Fasts */}
                {getFasts() && (
                  <ReportCard
                    title={getFasts().title}
                    description={getFasts().description}
                    icon="mdi:food-off"
                    color="#F59E0B"
                  />
                )}

                {/* Favourite Lord */}
                {getFavLord() && (
                  <ReportCard
                    title={getFavLord().title}
                    description={getFavLord().description}
                    icon="mdi:temple-hindu"
                    color="#EF4444"
                  />
                )}

                {/* Mantra */}
                {getFavMantra() && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "#EC489915" }}
                      >
                        <Iconify
                          icon="mdi:om"
                          width={20}
                          className="text-[#EC4899]"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        {getFavMantra().title}
                      </h3>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {getFavMantra().description}
                      </p>
                      {/* Extract and highlight mantra */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                        <p className="text-amber-800 font-medium italic text-lg">
                          {getTable()?.fav_mantra}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============ PREDICTION TAB ============ */}
            {activeTab === "prediction" && getDailyPrediction() && (
              <div className="space-y-6">
                {/* Date Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Daily Prediction
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getDailyPrediction().prediction_date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Lucky Number</p>
                      <span
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg font-bold text-lg"
                        style={{
                          backgroundColor: `${NUMBER_COLORS[parseInt(getDailyPrediction().lucky_number)] || "#6B7280"}15`,
                          color:
                            NUMBER_COLORS[
                              parseInt(getDailyPrediction().lucky_number)
                            ] || "#6B7280",
                        }}
                      >
                        {getDailyPrediction().lucky_number}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Lucky Color</p>
                      <span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                        <span className="w-3 h-3 rounded-full bg-gray-400" />
                        {getDailyPrediction().lucky_color}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prediction */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <Iconify
                        icon="mdi:crystal-ball"
                        width={24}
                        className="text-indigo-600"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        Today's Forecast
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {getDailyPrediction().prediction}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Iconify
                        icon="mdi:check-circle"
                        width={18}
                        className="text-green-600"
                      />
                      <h4 className="font-medium text-green-800">Do's</h4>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Wear {getDailyPrediction().lucky_color}</li>
                      <li>
                        • Focus on number {getDailyPrediction().lucky_number}{" "}
                        activities
                      </li>
                      <li>• Start new ventures</li>
                    </ul>
                  </div>
                  <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Iconify
                        icon="mdi:close-circle"
                        width={18}
                        className="text-red-600"
                      />
                      <h4 className="font-medium text-red-800">Don'ts</h4>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Avoid numbers: {getTable()?.evil_num}</li>
                      <li>• Don't rush decisions</li>
                      <li>• Avoid conflicts</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="mt-6 bg-white rounded-lg border-2 border-dashed border-gray-200 p-10 text-center">
          <Iconify
            icon="mdi:numeric"
            width={48}
            className="text-gray-300 mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No Analysis Generated
          </h3>
          <p className="text-sm text-gray-500">
            Select a profile and click "Calculate Numbers" to see your
            numerology analysis.
          </p>
        </div>
      )}
    </div>
  );
}

// ============ SUB COMPONENTS ============

function NumberCard({
  label,
  number,
  subtitle,
}: {
  label: string;
  number: number;
  subtitle: string;
}) {
  const color = NUMBER_COLORS[number] || "#6B7280";

  return (
    <div className="border border-gray-200 rounded-lg p-4 text-center">
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold mx-auto mb-2"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {number}
      </div>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}

function ReportCard({
  title,
  description,
  icon,
  color,
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Iconify icon={icon} width={20} style={{ color }} />
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default NumerologyPage;
