"use client";

import { useState, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";

import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import { fetchAllHoroscopeData, HoroscopeData } from "@/lib/horoscopeApi";
import { formatValue } from "@/utils/formatevalue";
import PlanetDataTable from "@/components/horoscope/PlanetDataTable";
import HouseDataTable from "@/components/horoscope/HouseDataTable";
import BirthChartSection from "@/components/horoscope/BirthChartSection";
import Button from "@/components/ui/Button";

type BirthData = {
  location: string;
  time: string;
  date: string;
  offset: string;
};

export default function Horoscope() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  // New state for API data
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeData | null>(
    null,
  );
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [birthData, setBirthData] = useState<BirthData | null>(null);

  // ... (keep existing initializeCharts and useEffect)

  // Parse person's birth data
  const parseBirthData = useCallback((person: Person) => {
    const time = person.BirthTime;
    const date = new Date(time);

    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();

    // Timezone offset
    const offsetMinutes = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
    const offsetMins = Math.abs(offsetMinutes) % 60;
    const offsetSign = offsetMinutes <= 0 ? "+" : "-";
    const rawOffset = `${offsetSign}${offsetHours
      .toString()
      .padStart(2, "0")}:${offsetMins.toString().padStart(2, "0")}`;

    return {
      // ✅ URL-safe
      location: encodeURIComponent(person.BirthLocation.trim()),
      time: `${hours}:${minutes}`,
      date: `${day}/${month}/${year}`,
      offset: encodeURIComponent(rawOffset),
    };
  }, []);

  const handleCalculate = async () => {
    if (!selectedPerson) {
      console.warn("❌ No person selected");

      Swal.fire({
        icon: "warning",
        title: "No Person Selected",
        text: "Please select a person first!",
      });

      console.groupEnd();
      return;
    }

    setIsCalculating(true);
    setShowOutput(true);
    setLoadingProgress(0);

    try {
      const parsedBirthData = parseBirthData(selectedPerson);
      setBirthData(parsedBirthData);
      // -------- FETCH HOROSCOPE DATA --------

      setLoadingProgress(10);

      const data = await fetchAllHoroscopeData(
        parsedBirthData.location,
        parsedBirthData.time,
        parsedBirthData.date,
        parsedBirthData.offset,
      );

      setLoadingProgress(70);
      setHoroscopeData(data);

      setLoadingProgress(100);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Horoscope generated successfully",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      console.error("🔥 Horoscope Calculation Error:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again.",
      });
    } finally {
      setIsCalculating(false);
      console.groupEnd();
    }
  };

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setShowOutput(false);
    setHoroscopeData(null);
  };

  // Helper to safely get value from API response
  const getValue = (data: unknown, defaultValue: string = "N/A"): string => {
    if (!data) return defaultValue;
    if (typeof data === "object" && data !== null) {
      const val = data as { Payload?: unknown; payload?: unknown };
      if (val.Payload) {
        return String(val.Payload);
      }
      if (val.payload) {
        return String(val.payload);
      }
    }
    return String(data);
  };
  const formatTime = (iso?: string): string => {
    if (!iso) return "-";

    const date = new Date(iso);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  type LocalMeanTime = {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  const formatLMT = (lmt: LocalMeanTime) => {
    if (!lmt) return "-";

    const date = new Date(
      lmt.year,
      lmt.month - 1, // JS months are 0-based
      lmt.day,
      lmt.hour,
      lmt.minute,
      lmt.second,
    );

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  type DMS = {
    degrees: number;
    minutes: number;
    seconds: number;
  };
  const formatDMS = (val: DMS) => {
    if (!val) return "-";
    return `${val.degrees}° ${val.minutes}′ ${val.seconds}″`;
  };

  const lunarDay = horoscopeData?.lunarDay?.Payload?.LunarDay;
  const yoga = horoscopeData?.nithyaYoga?.Payload?.NithyaYoga;
  const isDayBirth = horoscopeData?.isDayBirth?.Payload?.IsDayBirth;
  const weekdayLord = horoscopeData?.lordOfWeekday?.Payload?.LordOfWeekday;
  const hora = horoscopeData?.horaAtBirth?.Payload?.HoraAtBirth;
  const sunsetTime = horoscopeData?.sunsetTime?.Payload?.SunsetTime;
  const marakaPlanetList =
    horoscopeData?.marakaPlanetList?.Payload?.MarakaPlanetList
      ?.MarakaPlanetList;
  const lmt = horoscopeData?.localMeanTime?.Payload?.LocalMeanTime;
  const ayanamsa = horoscopeData?.ayanamsaDegree?.Payload?.AyanamsaDegree;
  return (
    <div className="container mx-auto px-4">
      <PageHeader
        title="Horoscope"
        description="View detailed horoscope charts and planetary positions"
        imageSrc="/images/life-predictor-banner.png"
      />

      {/* Controls Section */}
      <div className="bg-white p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 mb-6">
        <div className="w-full max-w-[354px]">
          <PersonSelector
            onPersonSelected={handlePersonSelected}
            label="Step 1: Select Person"
          />

          <div className="mt-6">
            <Button
              handleCalculate={handleCalculate}
              isCalculating={isCalculating}
              selectedPerson={selectedPerson}
              loadingProgress={loadingProgress}
            />
          </div>
        </div>

        {/* Selected Person Info */}
        {selectedPerson && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              Selected Person
            </h4>
            <p className="text-blue-700">{selectedPerson.Name}</p>
            <p className="text-sm text-blue-600">
              {selectedPerson.BirthLocation}
            </p>
          </div>
        )}
      </div>

      {/* Loading Progress Bar */}
      {isCalculating && (
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Output Section */}
      {showOutput && horoscopeData && (
        <div className="space-y-6 animate-fadeIn">
          {/* Basic Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard
              icon="mdi:zodiac-aries"
              label="Lagna (Ascendant)"
              value={getValue(
                horoscopeData?.lagnaSignName?.Payload?.LagnaSignName,
              )}
              color="purple"
            />
            <InfoCard
              icon="mdi:moon-waning-crescent"
              label="Moon Sign"
              value={getValue(
                horoscopeData?.moonSignName?.Payload?.MoonSignName,
              )}
              color="blue"
            />
            <InfoCard
              icon="mdi:star-four-points"
              label="Nakshatra"
              value={
                horoscopeData?.moonConstellation?.Payload?.MoonConstellation
                  ? `Name: ${horoscopeData.moonConstellation.Payload.MoonConstellation.name}, 
         Pada: ${horoscopeData.moonConstellation.Payload.MoonConstellation.pada}, 
         Lord: ${horoscopeData.moonConstellation.Payload.MoonConstellation.lord}`
                  : "-"
              }
              color="indigo"
            />

            <InfoCard
              icon="mdi:calendar"
              label="Day of Week"
              value={getValue(horoscopeData?.dayOfWeek?.Payload?.DayOfWeek)}
              color="green"
            />
          </div>

          {/* Panchang Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Iconify icon="mdi:calendar-star" width={24} />
                Panchang Details
              </h3>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <PanchangItem
                label="Tithi (Lunar Day)"
                value={
                  lunarDay
                    ? `${lunarDay.name} (Day ${lunarDay.number}) • ${lunarDay.percentage.toFixed(1)}%`
                    : "-"
                }
              />

              <PanchangItem
                label="Yoga"
                value={yoga ? `${yoga.Name} — ${yoga.Description}` : "-"}
              />
              <PanchangItem
                label="Karana"
                value={getValue(horoscopeData?.karana?.Payload?.Karana)}
              />
              <PanchangItem
                label="Hora Lord"
                value={hora ? `${hora.horaPlanet} (${hora.duration} min)` : "-"}
              />
              <PanchangItem
                label="Day/Night Birth"
                value={
                  isDayBirth === true || isDayBirth === "true"
                    ? "Day Birth"
                    : "Night Birth"
                }
              />
              <PanchangItem
                label="Weekday Lord"
                value={weekdayLord ? weekdayLord.Name : "-"}
              />
              <PanchangItem
                label="Birth Varna"
                value={getValue(horoscopeData?.birthVarna?.Payload?.BirthVarna)}
              />
              <PanchangItem
                label="Sunset Time"
                value={formatTime(sunsetTime)}
              />
            </div>
          </div>

          {/* Yoni & Bird Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <Iconify icon="mdi:cat" width={24} className="text-amber-600" />
                Yoni Kuta Animal
              </h4>
              <p className="text-2xl font-bold text-amber-600">
                {getValue(
                  horoscopeData?.yoniKutaAnimal?.Payload?.YoniKutaAnimal,
                )}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                <Iconify icon="mdi:bird" width={24} className="text-sky-600" />
                Pancha Pakshi Bird
              </h4>
              <p className="text-2xl font-bold text-sky-600">
                {getValue(
                  horoscopeData?.panchaPakshiBirthBird?.Payload
                    ?.PanchaPakshiBirthBird,
                )}
              </p>
            </div>
          </div>

          {/* Kuja Dosha */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Iconify icon="mdi:alert-circle" width={24} />
                Manglik / Kuja Dosha Analysis
              </h3>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-red-600">
                  {horoscopeData?.kujaDosaScore?.Payload?.KujaDosaScore}%
                </div>
                <div>
                  <p className="text-gray-600">Kuja Dosha Score</p>
                  <p className="text-sm text-gray-500">
                    Higher score indicates stronger Mars affliction
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kartari Yogas */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {horoscopeData?.shubKartariPlanets?.Payload?.ShubKartariPlanets
              .length > 0 ||
              (horoscopeData?.shubKartariHouses?.Payload?.ShubKartariHouses
                .length === "" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-green-500 px-4 py-3">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Iconify icon="mdi:check-circle" width={24} />
                      Shubh Kartari (Benefic)
                    </h3>
                  </div>
                  <div className="p-4">
                    {horoscopeData?.shubKartariPlanets?.Payload
                      ?.ShubKartariPlanets.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Planets:</span>
                        <p className="font-medium">
                          {getValue(
                            horoscopeData?.shubKartariPlanets?.Payload
                              ?.ShubKartariPlanets,
                            "None",
                          )}
                        </p>
                      </div>
                    )}
                    {horoscopeData?.shubKartariHouses?.Payload
                      ?.ShubKartariHouses.length === "" && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Houses:</span>
                        <p className="font-medium">
                          {getValue(
                            horoscopeData?.shubKartariHouses?.Payload
                              ?.ShubKartariHouses,
                            "None",
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {horoscopeData?.paapaKartariPlanets?.Payload?.PaapaKartariPlanets
              .length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-red-500 px-4 py-3">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Iconify icon="mdi:close-circle" width={24} />
                    Paapa Kartari (Malefic)
                  </h3>
                </div>
                <div className="p-4">
                  {horoscopeData?.paapaKartariPlanets?.Payload
                    ?.PaapaKartariPlanets.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">Planets:</span>
                      <p className="font-medium">
                        {getValue(
                          horoscopeData?.paapaKartariPlanets?.Payload
                            ?.PaapaKartariPlanets,
                          "None",
                        )}
                      </p>
                    </div>
                  )}
                  {horoscopeData?.paapaKartariHouses?.Payload
                    ?.PaapaKartariHouses.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-500">Houses:</span>
                      <p className="font-medium">
                        {getValue(
                          horoscopeData?.paapaKartariHouses?.Payload
                            ?.PaapaKartariHouses,
                          "None",
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Maraka Planets */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-800 px-4 py-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Iconify icon="mdi:skull" width={24} />
                Maraka Planets
              </h3>
            </div>
            <div className="p-4">
              {marakaPlanetList.map((item: string, index: number) => (
                <p className="text-gray-700" key={index}>
                  {item}
                </p>
              ))}
              <p className="text-sm text-gray-500 mt-2">
                Maraka planets are associated with the 2nd and 7th houses
              </p>
            </div>
          </div>

          {/* Technical Data */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 px-4 py-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Iconify icon="mdi:cog" width={24} />
                Technical Details
              </h3>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <TechItem label="Local Mean Time" value={formatLMT(lmt)} />
              <TechItem label="Ayanamsa" value={formatDMS(ayanamsa)} />
              <TechItem
                label="Day Duration"
                value={`${horoscopeData?.dayDurationHours?.Payload?.DayDurationHours} hours`}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-800">
                Planetary Strength Chart
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Planet Chart */}
              <div className="p-4 border-b lg:border-b-0 lg:border-r border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Planet Strength
                </h4>
                <StrengthChart
                  data={
                    horoscopeData?.planetShadbalaPinda?.Payload
                      ?.PlanetShadbalaPinda
                  }
                  type="planet"
                />
              </div>

              {/* House Chart */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  House Strength
                </h4>
                <StrengthChart
                  data={horoscopeData?.houseStrength?.Payload?.HouseStrength}
                  type="house"
                />
              </div>
            </div>
          </div>
          {/* Planet Data Table */}
          {horoscopeData?.allPlanetData?.Payload?.AllPlanetData
            ?.AllPlanetData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Iconify icon="twemoji:ringed-planet" width={24} />
                  All Planet Data
                </h3>
              </div>
              <div className="overflow-x-auto p-4">
                <PlanetDataTable
                  data={
                    horoscopeData?.allPlanetData?.Payload?.AllPlanetData
                      ?.AllPlanetData
                  }
                />
              </div>
            </div>
          )}

          {/* House Data Table */}
          {horoscopeData?.allHouseData?.Payload?.AllHouseData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Iconify icon="fluent-emoji-flat:house" width={24} />
                  All House Data
                </h3>
              </div>
              <div className="overflow-x-auto p-4">
                <HouseDataTable
                  data={
                    horoscopeData?.allHouseData?.Payload?.AllHouseData
                      ?.AllHouseData
                  }
                />
              </div>
            </div>
          )}

          {/* Predictions */}
          {horoscopeData?.horoscopePredictions?.Payload
            ?.HoroscopePredictions && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Iconify
                    icon="material-symbols:batch-prediction"
                    width={24}
                  />
                  Horoscope Predictions
                </h3>
              </div>
              <div className="p-4">
                <PredictionsList
                  data={
                    horoscopeData?.horoscopePredictions?.Payload
                      ?.HoroscopePredictions
                  }
                />
              </div>
            </div>
          )}

          {/* Legacy Charts (if loaded) */}
          {birthData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="font-semibold text-gray-800">Birth Chart</h3>
              </div>

              <BirthChartSection birthData={birthData} ayanamsa="RAMAN" />
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// Sub-components

function InfoCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
    green: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Iconify icon={icon} width={20} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function PanchangItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-orange-50 p-3 rounded-lg">
      <p className="text-xs text-orange-600 mb-1">{label}</p>
      <p className="font-semibold text-orange-800">{formatValue(value)}</p>
    </div>
  );
}

function TechItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-mono font-medium text-gray-800">{value}</p>
    </div>
  );
}

type StrengthItem = {
  Name?: string;
  name?: string;
  Strength?: number | string;
  strength?: number | string;
};

type StrengthData = StrengthItem[] | Record<string, number | string>;

function StrengthChart({
  data,
  type,
}: {
  data: StrengthData | null | undefined;
  type: "planet" | "house";
}) {
  // ❌ No data
  if (!data) {
    return <p className="text-gray-500 text-sm">No strength data available</p>;
  }

  // ✅ Normalize data (object → array OR array as is)
  const items = Array.isArray(data)
    ? data.map((item, i) => ({
        name:
          item.Name ||
          item.name ||
          (type === "house" ? `House ${i + 1}` : `Planet ${i + 1}`),
        strength: Number(item.Strength ?? item.strength ?? 0),
      }))
    : Object.entries(data).map(([key, value]) => ({
        name: key,
        strength: Number(value),
      }));

  if (items.length === 0) {
    return <p className="text-gray-500 text-sm">No strength data available</p>;
  }

  // ✅ Define colors BY INDEX (not by name)
  const colors = [
    "#FF8A80",
    "#FFB74D",
    "#FFD54F",
    "#4DB6AC",
    "#64B5F6",
    "#BA68C8",
    "#E0E0E0",
    "#D1C4E9",
    "#B0BEC5",
    "#90CAF9",
    "#81C784",
    "#FFB300",
  ];

  // Chart dimensions
  const MAX_VAL = 700;
  const CHART_HEIGHT = 200;
  const MARGIN_LEFT = 50;
  const MARGIN_BOTTOM = 60;
  const MARGIN_RIGHT = 20;
  const BAR_WIDTH = 30;
  const GAP = 15;

  // Calculate dynamic width based on number of items
  const totalWidth =
    items.length * (BAR_WIDTH + GAP) + MARGIN_LEFT + MARGIN_RIGHT;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        className="w-full min-w-[400px]"
        height={CHART_HEIGHT + MARGIN_BOTTOM}
        viewBox={`0 0 ${totalWidth} ${CHART_HEIGHT + MARGIN_BOTTOM}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background Grid Lines */}
        {[0, 175, 300, 480, 600].map((val) => {
          const y = CHART_HEIGHT - (val / MAX_VAL) * CHART_HEIGHT;
          return (
            <g key={val}>
              <line
                x1={MARGIN_LEFT}
                y1={y}
                x2={totalWidth - MARGIN_RIGHT}
                y2={y}
                stroke="#E0E0E0"
                strokeDasharray="4 4"
              />
              <text
                x={MARGIN_LEFT - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-500"
                fontSize="10"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Y-axis Line */}
        <line
          x1={MARGIN_LEFT}
          y1={0}
          x2={MARGIN_LEFT}
          y2={CHART_HEIGHT}
          stroke="#9E9E9E"
          strokeWidth="1"
        />

        {/* X-axis Line */}
        <line
          x1={MARGIN_LEFT}
          y1={CHART_HEIGHT}
          x2={totalWidth - MARGIN_RIGHT}
          y2={CHART_HEIGHT}
          stroke="#9E9E9E"
          strokeWidth="1"
        />

        {/* Bars */}
        {items.map((item, i) => {
          const height = Math.max(0, (item.strength / MAX_VAL) * CHART_HEIGHT);
          const x = MARGIN_LEFT + GAP + i * (BAR_WIDTH + GAP);
          const y = CHART_HEIGHT - height;

          // ✅ Color based on INDEX, not name
          const color = colors[i % colors.length];

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={BAR_WIDTH}
                height={height}
                fill={color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                rx="2"
              >
                <title>{`${item.name}: ${item.strength.toFixed(2)}`}</title>
              </rect>

              {/* Rotated Labels */}
              <text
                x={x + BAR_WIDTH / 2}
                y={CHART_HEIGHT + 15}
                transform={`rotate(-30, ${x + BAR_WIDTH / 2}, ${CHART_HEIGHT + 15})`}
                textAnchor="end"
                className="fill-gray-700 font-medium"
                fontSize="11"
              >
                {item.name}
              </text>

              {/* Value on top of bar */}
              {height > 15 && (
                <text
                  x={x + BAR_WIDTH / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="fill-gray-600"
                  fontSize="9"
                >
                  {item.strength.toFixed(0)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

type Prediction = {
  title?: string;
  description?: string;
  category?: string;
  weight?: number;
};
const getPredictionText = (pred: any) => {
  if (typeof pred === "string") {
    return { title: "Prediction", description: pred };
  }

  return {
    title: pred.title || pred.Title || "Prediction",
    description: pred.description || pred.Description || "-",
    category: pred.category,
    weight: pred.weight,
  };
};
function PredictionsList({ data }: { data: Prediction[] }) {
  const predictions = Array.isArray(data) ? data : [];

  if (predictions.length === 0) {
    return <p className="text-gray-500">No predictions available</p>;
  }

  return (
    <div className="space-y-4">
      {predictions.map((pred, i) => {
        const p = getPredictionText(pred);

        return (
          <div
            key={i}
            className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-indigo-800">{p.title}</h4>

              {p.category && (
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  {p.category}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700">{p.description}</p>

            {/* Weight (optional) */}
            {typeof p.weight === "number" && (
              <p className="text-xs text-gray-500 mt-2">Weight: {p.weight}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
