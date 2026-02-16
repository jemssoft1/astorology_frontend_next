"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import Swal from "sweetalert2";
import { CommonTools } from "@/lib/utils";
import { Person } from "@/lib/models";
import LegacyChartRenderer from "@/components/LegacyChartRenderer";
import { TimeSlice } from "@/lib/models";

interface ChartData {
  personId: string;
  prediction: { TimeSlices: TimeSlice[] };
  timeRangeUrl: string;
  daysPerPixel: number;
  eventTags: any[];
  algorithms: any[];
  ayanamsa: string;
}

export default function GoodTimeFinder() {
  // State
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setChartData(null);
  };

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person", "error");
      return;
    }

    setIsCalculating(true);
    CommonTools.ShowLoading();

    try {
      // Prepare request body for API
      const requestBody = {
        birthTime: selectedPerson.BirthTime, // or construct Time object
        startDate: new Date().toISOString(), // Start from today
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ahead
        daysPerPixel: 1,
        precisionHours: 1,
      };

      // Make API call
      const response = await fetch("/api/life-path/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.success) {
        setChartData({
          personId: selectedPerson.PersonId,
          prediction: result.data,
          timeRangeUrl: "", // Add if needed
          daysPerPixel: 1,
          eventTags: [], // Add if needed
          algorithms: [], // Add if needed
          ayanamsa: "LAHIRI", // Add if needed
        });

        Swal.fire({
          title: "Success!",
          text: `Generated ${result.data.TimeSlices.length} time slices`,
          icon: "success",
          timer: 2000,
        });
      } else {
        Swal.fire("Error", result.error || "Failed to calculate", "error");
      }
    } catch (error: any) {
      Swal.fire("Error", error.message || "Failed to calculate", "error");
    } finally {
      setIsCalculating(false);
      CommonTools.HideLoading();
    }
  };

  return (
    <div className="container">
      <PageHeader
        title="Good Time Finder"
        description="Find the right time for wedding, job, etc."
        imageSrc="/images/good-time-finder.png"
      />

      <div className="row">
        <div className="col-md-4">
          <div className="vstack gap-3">
            <PersonSelector onPersonSelected={handlePersonSelected} />

            <div className="alert alert-info">
              Time Range, Events, and Advanced Options are currently using
              defaults in this ported version.
            </div>

            <div className="mt-6">
              <button
                onClick={handleCalculate}
                disabled={isCalculating || !selectedPerson}
                className={`
                  w-full px-6 py-3 rounded-lg text-white font-medium shadow-sm transition-all
                  flex items-center justify-center gap-2
                  ${
                    isCalculating || !selectedPerson
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  }
                `}
              >
                {isCalculating ? (
                  <>
                    <Iconify
                      icon="eos-icons:loading"
                      className="animate-spin"
                      width={20}
                    />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Iconify icon="akar-icons:thunder" width={20} />
                    Calculate Horoscope
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div
            id="GoodTimeFinderChartHolder"
            style={{ minHeight: "400px", border: "1px dashed #ccc" }}
          >
            {chartData && (
              <LegacyChartRenderer prediction={chartData.prediction} />
            )}
            {!chartData && (
              <div className="text-center p-5 text-muted">
                <Iconify
                  icon="mdi:chart-timeline"
                  width={64}
                  className="mb-3 opacity-25"
                />
                <p>Select a person and click Calculate to see the chart</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
