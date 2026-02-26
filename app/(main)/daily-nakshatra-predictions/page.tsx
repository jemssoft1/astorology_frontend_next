"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import { useUser } from "@/context/UserContext";

interface PredictionResponse {
  birth_moon_sign: string;
  birth_moon_nakshatra: string;
  prediction: {
    health: string;
    emotions: string;
    profession: string;
    luck: string;
    personal_life: string;
    travel: string;
  };
  prediction_date: string;
}

export default function DailyNakshatraPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] =
    useState<PredictionResponse | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setPredictionData(null);
  };

  const getBirthDataPayload = (person: Person, date: Date) => {
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
      location: {
        latitude: person.Latitude,
        longitude: person.Longitude,
        timezone: tzone,
      },
      predictionDate: {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        hour: date.getHours(),
        min: date.getMinutes(),
      },
    };
  };
  const { user } = useUser();

  const fetchPrediction = async (
    type: string = "prediction",
    date: Date = currentDate,
  ) => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson, date);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/daily_nakshatra?type=${type}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (
        result.status === "Fail" ||
        (result.success === false && result.status !== "Pass")
      ) {
        throw new Error(
          result.message || result.error || "Failed to fetch prediction",
        );
      }

      // Set the data from response
      setPredictionData(result.data);

      // Update current date based on navigation
      if (type === "next") {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        setCurrentDate(nextDate);
      } else if (type === "previous") {
        const prevDate = new Date(date);
        prevDate.setDate(date.getDate() - 1);
        setCurrentDate(prevDate);
      }
    } catch (error: unknown) {
      console.error("Prediction error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get prediction";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = () => {
    fetchPrediction("prediction", currentDate);
  };

  const handlePrevious = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDate);
    fetchPrediction("previous", prevDate);
  };

  const handleNext = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDate);
    fetchPrediction("next", nextDate);
  };

  // Prediction categories configuration
  const predictionCategories = [
    {
      key: "health",
      label: "Health & Wellness",
      icon: "mdi:heart-pulse",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      textColor: "text-rose-700",
    },
    {
      key: "emotions",
      label: "Emotions & Mood",
      icon: "mdi:emoticon-happy-outline",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-purple-700",
    },
    {
      key: "profession",
      label: "Career & Finance",
      icon: "mdi:briefcase-outline",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-700",
    },
    {
      key: "luck",
      label: "Luck & Fortune",
      icon: "mdi:clover",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-700",
    },
    {
      key: "personal_life",
      label: "Personal Life",
      icon: "mdi:account-heart-outline",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      textColor: "text-pink-700",
    },
    {
      key: "travel",
      label: "Travel & Journey",
      icon: "mdi:airplane",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      textColor: "text-indigo-700",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Daily Nakshatra Predictions"
        description="Get daily insights based on your Nakshatra"
        imageSrc="/images/daily-nakshatra.png"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Iconify icon="bi:person-circle" className="text-blue-600" />
              Select Person
            </h3>
            <PersonSelector
              onPersonSelected={handlePersonSelected}
              label="Choose Profile"
            />

            <div className="mt-6 pt-6 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium text-center">
                {currentDate.toDateString()}
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading || !selectedPerson}
              className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Calculating...
                </>
              ) : (
                <>
                  <Iconify icon="bi:calculator" />
                  Calculate Prediction
                </>
              )}
            </button>
          </div>

          {/* Moon Sign & Nakshatra Info Card */}
          {predictionData && (
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg text-white animate-fadeIn">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Iconify
                  icon="mdi:moon-waning-crescent"
                  className="text-yellow-300"
                />
                Your Lunar Profile
              </h3>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Iconify
                        icon="mdi:zodiac-gemini"
                        className="text-2xl text-yellow-300"
                      />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Moon Sign</p>
                      <p className="text-xl font-bold">
                        {predictionData.birth_moon_sign}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Iconify
                        icon="mdi:star-four-points"
                        className="text-2xl text-yellow-300"
                      />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Birth Nakshatra</p>
                      <p className="text-xl font-bold">
                        {predictionData.birth_moon_nakshatra}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Content: Results */}
        <div className="lg:col-span-2">
          {predictionData ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Navigation */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <button
                  onClick={handlePrevious}
                  disabled={loading}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Iconify icon="bi:arrow-left" />
                  Previous Day
                </button>
                <div className="text-center">
                  <span className="font-bold text-gray-800 text-lg">
                    {predictionData.prediction_date}
                  </span>
                </div>
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  Next Day
                  <Iconify icon="bi:arrow-right" />
                </button>
              </div>

              {/* Prediction Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Iconify icon="mdi:crystal-ball" className="text-3xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Daily Predictions</h2>
                    <p className="text-white/80">
                      Based on {predictionData.birth_moon_nakshatra} Nakshatra
                      in {predictionData.birth_moon_sign}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prediction Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictionCategories.map((category) => {
                  const predictionText =
                    predictionData.prediction[
                      category.key as keyof typeof predictionData.prediction
                    ];

                  if (!predictionText) return null;

                  return (
                    <div
                      key={category.key}
                      className={`${category.bgColor} ${category.borderColor} border p-5 rounded-xl transition-all hover:shadow-lg hover:scale-[1.02] group`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`${category.iconBg} p-3 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform`}
                        >
                          <Iconify
                            icon={category.icon}
                            className={`text-2xl ${category.iconColor}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-lg font-bold ${category.textColor} mb-2`}
                          >
                            {category.label}
                          </h4>
                          <p className="text-gray-700 leading-relaxed text-sm">
                            {predictionText.replace(/\\'/g, "'")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-gray-500 text-sm text-center flex items-center justify-center gap-2">
                  <Iconify icon="mdi:information-outline" />
                  These predictions are for guidance only. Your actions shape
                  your destiny.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-dashed border-gray-300 min-h-[500px]">
              <div className="text-center">
                <Iconify
                  icon="mdi:stars"
                  className="text-8xl mb-4 opacity-20"
                />
                <p className="text-xl font-medium text-gray-500">
                  Select a person and calculate
                </p>
                <p className="text-gray-400 mt-2">
                  to see your daily Nakshatra predictions
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
