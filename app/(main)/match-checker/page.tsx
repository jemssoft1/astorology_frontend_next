"use client";
import MatchResult from "@/components/MatchResult";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Button from "@/components/ui/Button";
import { Person } from "@/lib/models";
import { CommonTools } from "@/lib/utils";
import { useCallback, useState } from "react";

export default function MatchChecker() {
  const [selectedMalePerson, setSelectedMalePerson] = useState<Person | null>(
    null,
  );
  const [selectedFemalePerson, setSelectedFemalePerson] =
    useState<Person | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const handleMalePersonSelected = (person: Person) => {
    setSelectedMalePerson(person);
    setShowOutput(false);
    setResult(null);
  };

  const handleFemalePersonSelected = (person: Person) => {
    setSelectedFemalePerson(person);
    setShowOutput(false);
    setResult(null);
  };

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

  const fetchPrediction = async () => {
    if (!selectedMalePerson || !selectedFemalePerson) {
      return;
    }
    setIsCalculating(true);
    setShowOutput(true);
    setLoadingProgress(0);
    try {
      CommonTools.ShowLoading();
      const maleData = parseBirthData(selectedMalePerson);
      const femaleData = parseBirthData(selectedFemalePerson);

      const res = await fetch(
        `/api/Calculate/MatchReport/Location/${maleData.location}/Time/${maleData.time}/${maleData.date}/${maleData.offset}/Location/${femaleData.location}/Time/${femaleData.time}/${femaleData.date}/${femaleData.offset}`,
      );

      if (!res.ok) throw new Error("API failed");

      const apiResult = await res.json();

      if (apiResult.Status === "Pass") {
        setResult(apiResult.Payload);
        setShowOutput(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      setResult(null);
      setShowOutput(false);
    } finally {
      setIsCalculating(false);
      CommonTools.HideLoading();
    }
  };

  return (
    <div className="container mx-auto px-4">
      <PageHeader
        title="Match Checker"
        description="Check astrological compatibility between two people"
        imageSrc="/images/life-predictor-banner.png"
      />

      <div className="mb-6">
        <div className="bg-white p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200">
          <div className="w-full">
            <PersonSelector
              onPersonSelected={handleMalePersonSelected}
              label="Male"
            />
          </div>
          <div className="w-full">
            <PersonSelector
              onPersonSelected={handleFemalePersonSelected}
              label="Female"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            handleCalculate={fetchPrediction}
            isCalculating={isCalculating}
            selectedPerson={selectedMalePerson || selectedFemalePerson}
            loadingProgress={loadingProgress}
            buttonName="Check Compatibility"
          />
        </div>
      </div>

      {/* Introduction / Placeholder */}
      {!showOutput && (
        <div className="hidden md:flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-lg border border-gray-100 min-h-[300px]">
          <img
            src="/images/match-making.svg"
            alt="Match Making"
            className="w-48 h-48 mb-4 opacity-80"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Ready to check compatibility?
          </h3>
          <p className="text-gray-500 max-w-xs">
            Select both a male and female profile to generate a detailed
            astrological compatibility report.
          </p>
        </div>
      )}

      {/* Results Section */}
      {showOutput && result && selectedMalePerson && selectedFemalePerson && (
        <div className="w-full animate-fadeIn mb-12">
          <MatchResult
            maleName={selectedMalePerson.Name}
            femaleName={selectedFemalePerson.Name}
            result={result?.MatchReport}
          />
        </div>
      )}
    </div>
  );
}
