"use client";

import Iconify from "@/components/Iconify";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Button from "@/components/ui/Button";
import { Person } from "@/lib/models";
import { CommonTools } from "@/lib/utils";
import { useState } from "react";

export default function LifePredictor() {
  /* -------------------------------------------
   * State Interfaces
   * ------------------------------------------- */
  interface PlanetNature {
    GOOD: string[];
    BAD: string[];
    KILLER: string[];
    YOGAKARAKA: string[];
  }

  interface NakshatraReport {
    physical: string[];
    character: string[];
    education: string[];
    family: string[];
    health: string[];
  }

  interface AscendantReport {
    ascendant: string;
    report: string;
  }

  interface PlanetReport {
    planet: string;
    report: string;
  }

  interface PredictionResult {
    nature: PlanetNature | null;
    nakshatra: NakshatraReport | null;
    ascendant: AscendantReport | null;
    rashiReports: PlanetReport[];
    houseReports: PlanetReport[];
  }

  /* -------------------------------------------
   * Component Logic
   * ------------------------------------------- */
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleMalePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setShowOutput(false);
    setResult(null);
  };

  const getBirthDataPayload = (person: Person) => {
    const date = new Date(person.BirthTime);
    // Parse timezone offset "HH:MM" or "-HH:MM"
    // Assuming person.TimezoneOffset is like "+05:30" or "-04:00"
    let tzone = 0;
    if (person.TimezoneOffset) {
      const [h, m] = person.TimezoneOffset.replace("+", "").split(":");
      const sign = person.TimezoneOffset.startsWith("-") ? -1 : 1;
      tzone = sign * (parseInt(h) + parseInt(m) / 60);
    }

    return {
      day: date.getUTCDate(),
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear(),
      hour: date.getUTCHours(),
      min: date.getUTCMinutes(),
      lat: person.Latitude,
      lon: person.Longitude,
      tzone: tzone,
      location: {
        latitude: person.Latitude,
        longitude: person.Longitude,
        timezone: tzone,
      },
    };
  };

  const handleCalculate = async () => {
    if (!selectedPerson) return;

    setIsCalculating(true);
    setShowOutput(true);
    setLoadingProgress(10);
    setResult(null);

    try {
      const payload = getBirthDataPayload(selectedPerson);
      const planets = [
        "sun",
        "moon",
        "mars",
        "mercury",
        "jupiter",
        "venus",
        "saturn",
      ];
      const totalSteps = 3 + planets.length * 2; // nature, asc, nak + 2 per planet
      let completedSteps = 0;

      const updateProgress = () => {
        completedSteps++;
        setLoadingProgress(Math.round((completedSteps / totalSteps) * 100));
      };

      // 1. Planet Nature
      const natureRes = await fetch("/api/life-path/planet_nature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const natureData = await natureRes.json();
      updateProgress();

      // 2. Ascendant Report
      const ascRes = await fetch("/api/life-path/general_ascendant_report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const ascData = await ascRes.json();
      updateProgress();

      // 3. Nakshatra Report
      const nakRes = await fetch("/api/life-path/general_nakshatra_report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const nakData = await nakRes.json();
      updateProgress();

      // 4. Rashi & House Reports (Parallel allowed per planet, but keeping simple chunks to not flood)
      const rashiReports: PlanetReport[] = [];
      const houseReports: PlanetReport[] = [];

      for (const planet of planets) {
        // Rashi
        const rashiPromise = fetch(
          `/api/life-path/general_rashi_report/${planet}`,
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
        ).then((r) => r.json());

        // House
        const housePromise = fetch(
          `/api/life-path/general_house_report/${planet}`,
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
        ).then((r) => r.json());

        const [rData, hData] = await Promise.all([rashiPromise, housePromise]);

        if (rData?.rashi_report) {
          rashiReports.push({ planet, report: rData.rashi_report });
        }
        if (hData?.house_report) {
          houseReports.push({ planet, report: hData.house_report });
        }
        updateProgress();
        updateProgress(); // counted as 2 steps
      }

      setResult({
        nature: natureData,
        ascendant: ascData?.asc_report,
        nakshatra: nakData,
        rashiReports,
        houseReports,
      });
    } catch (err) {
      console.error(err);
      // CommonTools.ShowError("Failed to fetch predictions");
    } finally {
      setIsCalculating(false);
      CommonTools.HideLoading();
    }
  };

  return (
    <div className="container mx-auto px-4">
      <PageHeader
        title="Life Predictor"
        description="Predict life events and analyze planetary dashas"
        imageSrc="/images/life-predictor-banner.png"
      />

      <div className="mb-6 bg-white p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200">
        <div className="w-full">
          <div className="w-full lg:w-[354px]">
            <PersonSelector
              onPersonSelected={handleMalePersonSelected}
              label="Male"
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
        </div>

        {/* Results Section */}
        {showOutput && result && (
          <div className="w-full md:col-span-2 space-y-8 animate-fadeIn">
            {/* 1. Planet Nature */}
            {result.nature && (
              <section className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Iconify icon="mdi:yin-yang" className="text-purple-600" />
                  Planetary Nature
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <NatureCard
                    title="Good"
                    planets={result.nature.GOOD}
                    color="text-green-600"
                    bg="bg-green-50"
                    border="border-green-200"
                    icon="mdi:thumb-up"
                  />
                  <NatureCard
                    title="Bad"
                    planets={result.nature.BAD}
                    color="text-red-600"
                    bg="bg-red-50"
                    border="border-red-200"
                    icon="mdi:thumb-down"
                  />
                  <NatureCard
                    title="Killer (Maraka)"
                    planets={result.nature.KILLER}
                    color="text-orange-600"
                    bg="bg-orange-50"
                    border="border-orange-200"
                    icon="mdi:skull-outline"
                  />
                  <NatureCard
                    title="Yogakaraka"
                    planets={result.nature.YOGAKARAKA}
                    color="text-blue-600"
                    bg="bg-blue-50"
                    border="border-blue-200"
                    icon="mdi:star-face"
                  />
                </div>
              </section>
            )}

            {/* 2. Ascendant Report */}
            {result.ascendant && (
              <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Iconify icon="mdi:human-handsup" className="text-blue-600" />
                  Ascendant:{" "}
                  <span className="text-blue-600">
                    {result.ascendant.ascendant}
                  </span>
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                  {result.ascendant.report}
                </p>
              </section>
            )}

            {/* 3. Nakshatra Details */}
            {result.nakshatra && (
              <section className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                  <Iconify
                    icon="mdi:star-shooting"
                    className="text-amber-500"
                  />
                  Nakshatra Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ReportCard
                    title="Character"
                    content={result.nakshatra.character}
                    icon="mdi:account-details"
                  />
                  <ReportCard
                    title="Physical"
                    content={result.nakshatra.physical}
                    icon="mdi:arm-flex"
                  />
                  <ReportCard
                    title="Education"
                    content={result.nakshatra.education}
                    icon="mdi:school"
                  />
                  <ReportCard
                    title="Family"
                    content={result.nakshatra.family}
                    icon="mdi:home-heart"
                  />
                  <ReportCard
                    title="Health"
                    content={result.nakshatra.health}
                    icon="mdi:heart-pulse"
                  />
                </div>
              </section>
            )}

            {/* 4. Planetary Reports */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <Iconify icon="mdi:planet" className="text-indigo-600" />
                Planetary Life Reports
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {result.rashiReports.map((r, i) => (
                  <div
                    key={`rashi-${i}`}
                    className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <h4 className="text-lg font-semibold capitalize text-indigo-700 mb-2 flex items-center gap-2">
                      <Iconify icon="mdi:zodiac-sign" /> {r.planet} - Rashi
                      Impact
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {r.report}
                    </p>

                    {/* Combine House Report if available for same planet */}
                    {result.houseReports.find((h) => h.planet === r.planet) && (
                      <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                        <h4 className="text-lg font-semibold capitalize text-purple-700 mb-2 flex items-center gap-2">
                          <Iconify icon="mdi:home-analytics" /> {r.planet} -
                          House Impact
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {
                            result.houseReports.find(
                              (h) => h.planet === r.planet,
                            )?.report
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------
// Sub-components
// ----------------------

interface NatureCardProps {
  title: string;
  planets: string[];
  color: string;
  bg: string;
  border: string;
  icon: string;
}

function NatureCard({
  title,
  planets,
  color,
  bg,
  border,
  icon,
}: NatureCardProps) {
  if (!planets || planets.length === 0) return null;
  return (
    <div
      className={`${bg} ${border} border rounded-lg p-4 flex flex-col items-center text-center`}
    >
      <Iconify icon={icon} className={`mb-2 text-2xl ${color}`} />
      <h4 className={`font-bold ${color} mb-1`}>{title}</h4>
      <div className="flex flex-wrap justify-center gap-1">
        {planets.map((p: string) => (
          <span
            key={p}
            className="text-xs font-medium bg-white px-2 py-1 rounded shadow-sm opacity-90"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

interface ReportCardProps {
  title: string;
  content: string[];
  icon: string;
}

function ReportCard({ title, content, icon }: ReportCardProps) {
  if (!content || content.length === 0) return null;
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-200 transition-colors">
      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-lg">
        <Iconify icon={icon} className="text-blue-500" />
        {title}
      </h4>
      <div className="space-y-2">
        {content.map((text: string, idx: number) => (
          <p
            key={idx}
            className="text-gray-600 text-sm leading-relaxed text-justify"
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
