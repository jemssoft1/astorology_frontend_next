"use client";
import { useForm } from "react-hook-form";

import PageHeader from "@/components/PageHeader";
import Iconify from "@/components/Iconify";
import { CommonTools } from "@/lib/utils";
import { useState, useEffect } from "react";

type FormData = {
  name: string;
};

type PredictionSummary = {
  Finance: number;
  Romance: number;
  Education: number;
  Health: number;
  Family: number;
  Growth: number;
  Career: number;
  Reputation: number;
  Spirituality: number;
  Luck: number;
};

type NumerologyResult = {
  number: number;
  planet: string;
  prediction: string;
  summary: PredictionSummary;
};

// Icon mapping for each aspect
const aspectIcons: Record<string, { icon: string; color: string }> = {
  Finance: { icon: "fluent-emoji:money-bag", color: "#2e7d32" },
  Romance: { icon: "fluent-emoji:heart-with-arrow", color: "#c62828" },
  Education: { icon: "fluent-emoji:graduation-cap", color: "#1565c0" },
  Health: { icon: "fluent-emoji:red-heart", color: "#d32f2f" },
  Family: { icon: "fluent-emoji:family-man-woman-boy", color: "#6a1b9a" },
  Growth: { icon: "fluent-emoji:seedling", color: "#388e3c" },
  Career: { icon: "fluent-emoji:briefcase", color: "#4527a0" },
  Reputation: { icon: "fluent-emoji:star", color: "#f9a825" },
  Spirituality: {
    icon: "fluent-emoji:person-in-lotus-position",
    color: "#00838f",
  },
  Luck: { icon: "fluent-emoji:four-leaf-clover", color: "#2e7d32" },
};

export default function Numerology() {
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
    },
  });

  const nameValue = watch("name");

  const fetchPrediction = async (name: string) => {
    try {
      CommonTools.ShowLoading();

      const res = await fetch(
        `/api/Calculate/NameNumberPrediction/FullName/${encodeURIComponent(name)}`,
      );

      if (!res.ok) throw new Error("API failed");

      const apiResult = await res.json();

      if (
        apiResult.Status === "Pass" &&
        apiResult.Payload?.NameNumberPrediction
      ) {
        const prediction = apiResult.Payload.NameNumberPrediction;
        setResult({
          number: prediction.Number,
          planet: prediction.Planet,
          prediction: prediction.Prediction,
          summary: prediction.PredictionSummary,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      CommonTools.HideLoading();
    }
  };

  // Auto-fetch when name length >= 4 with debouncing
  useEffect(() => {
    if (nameValue && nameValue.trim().length >= 4) {
      const timeoutId = setTimeout(() => {
        fetchPrediction(nameValue);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setResult(null);
    }
  }, [nameValue]);

  // Get color based on percentage
  const getScoreColor = (value: number): string => {
    if (value >= 75) return "#2e7d32"; // Green
    if (value >= 50) return "#f57c00"; // Orange
    if (value >= 25) return "#fbc02d"; // Yellow
    return "#d32f2f"; // Red
  };

  return (
    <div className="container mx-auto px-4">
      <PageHeader
        title="Numerology"
        description="A person's life can be predicted through his name spellings. From Mantra Shastra, uses vibration frequency of alphabets."
        imageSrc="/images/numerology-banner.svg"
      />

      <div className="flex flex-wrap gap-5 max-w-[667.5px]">
        <div className="w-full">
          <div className="font-bold flex items-center gap-2 max-w-[667px]">
            <Iconify
              icon="fluent:text-number-format-20-filled"
              width={38}
              height={38}
            />
            <h5 className="mt-2 mr-auto text-xl text-gray-800">Name Number</h5>
          </div>
          <hr className="mt-1 mb-2 border-gray-200" />

          <div className="flex items-center gap-2 mt-3">
            <div className="flex w-full">
              <span className="inline-flex items-center gap-2 px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md w-[136px]">
                <Iconify
                  icon="flat-color-icons:butting-in"
                  width={35}
                  height={35}
                />
                <span className="text-gray-700">Name</span>
              </span>
              <input
                type="text"
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-semibold text-base ${
                  errors.name ? "border-red-500" : ""
                }`}
                placeholder="Enter name (min 4 characters)"
                {...register("name", {
                  minLength: {
                    value: 4,
                    message: "Name must be at least 4 characters",
                  },
                })}
              />
            </div>
          </div>

          {/* Validation Error */}
          {errors.name && (
            <div className="text-red-600 mt-2 text-sm flex items-center gap-1">
              <Iconify icon="mdi:alert-circle" width={16} height={16} />
              {errors.name.message}
            </div>
          )}

          {/* Helper Text */}
          <div className="text-gray-500 text-sm mt-2">
            Prediction will appear automatically when you type 4 or more
            characters.
          </div>

          {/* OUTPUT */}
          {result && (
            <div id="OutputHolder" className="mt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Iconify
                    icon="solar:hashtag-square-bold"
                    width={37}
                    height={37}
                  />
                  <strong className="text-[33px] text-gray-800">
                    {result.number}
                  </strong>
                </div>
                <div className="flex items-center gap-1">
                  <Iconify
                    icon="famicons:planet-sharp"
                    width={37}
                    height={37}
                  />
                  <div className="text-[33px] text-gray-800">
                    {result.planet}
                  </div>
                </div>
              </div>

              {/* Prediction Text with HTML support */}
              <div
                className="p-3 rounded-lg mb-0 mt-3 bg-white text-base border border-gray-200 leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: result.prediction }}
              />

              {/* Life Aspects Analysis */}
              {result.summary && (
                <div className="mt-4">
                  <div className="font-bold flex items-center gap-2 mb-3">
                    <Iconify
                      icon="fluent-emoji:bar-chart"
                      width={32}
                      height={32}
                    />
                    <h5 className="mb-0 text-lg text-gray-800">
                      Life Aspects Analysis
                    </h5>
                  </div>

                  {/* Grid Layout */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {Object.entries(result.summary).map(([key, value]) => {
                      const aspectConfig = aspectIcons[key];
                      const scoreColor = getScoreColor(value);

                      return (
                        <div
                          key={`grid-${key}`}
                          className="text-center p-2 rounded-xl bg-white border border-gray-200 shadow-sm"
                        >
                          {/* Circular Progress */}
                          <div className="relative mx-auto w-[60px] h-[60px]">
                            {/* Background Circle */}
                            <svg width="60" height="60" className="-rotate-90">
                              <circle
                                cx="30"
                                cy="30"
                                r="26"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="6"
                              />
                              <circle
                                cx="30"
                                cy="30"
                                r="26"
                                fill="none"
                                stroke={scoreColor}
                                strokeWidth="6"
                                strokeDasharray={`${(value / 100) * 163.36} 163.36`}
                                strokeLinecap="round"
                                style={{
                                  transition: "stroke-dasharray 0.5s ease",
                                }}
                              />
                            </svg>

                            {/* Icon in Center */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              <Iconify
                                icon={aspectConfig?.icon || "mdi:star"}
                                width={28}
                                height={28}
                              />
                            </div>
                          </div>

                          {/* Name & Percentage */}
                          <div className="mt-2 text-[11px] text-gray-600">
                            {key}
                          </div>
                          <div
                            className="font-bold text-base"
                            style={{ color: scoreColor }}
                          >
                            {value}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ACCURATE PREDICTIONS Table */}
      <div className="mt-5 max-w-[667.5px]">
        <div>
          <div className="font-bold flex items-center gap-2">
            <Iconify
              className="mr-2"
              icon="noto-v1:direct-hit"
              width={38}
              height={38}
            />
            <h3 className="mt-2 mr-auto text-xl text-gray-800">Accurate</h3>
          </div>
          <hr className="mt-1 mb-2 border-gray-200" />
          <div className="overflow-x-auto">
            <table className="w-full mb-3 border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                    Number
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                    Prediction
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-800 border-b border-gray-200">
                    THOMAS ALVA EDISON
                  </td>
                  <td className="px-4 py-3 text-xl font-medium text-gray-800 border-b border-gray-200">
                    60
                  </td>
                  <td className="px-4 py-3 text-gray-700 border-b border-gray-200">
                    This number signifies peace, prosperity, appreciation of
                    fine arts, a balanced state of mind and wisdom...
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-800 border-b border-gray-200">
                    ADOLF HITLER
                  </td>
                  <td className="px-4 py-3 text-xl font-medium text-gray-800 border-b border-gray-200">
                    43
                  </td>
                  <td className="px-4 py-3 text-gray-700 border-b border-gray-200">
                    This number signifies revolutionary life...
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-800 border-b border-gray-200">
                    MICHAEL JACKSON
                  </td>
                  <td className="px-4 py-3 text-xl font-medium text-gray-800 border-b border-gray-200">
                    44
                  </td>
                  <td className="px-4 py-3 text-gray-700 border-b border-gray-200">
                    This number helps in earning money easily...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="py-2">
          <div className="font-bold flex items-center gap-2">
            <Iconify
              className="mr-2"
              icon="fluent-emoji-flat:thinking-face"
              width={38}
              height={38}
            />
            <h4 className="mt-2 mr-auto text-lg text-gray-800">
              What is Numerology?
            </h4>
          </div>
          <hr className="mt-1 mb-2 border-gray-200" />
          <p className="text-justify text-gray-700 leading-relaxed">
            To put things in a nutshell, every man or woman is represented by a
            Number (since he is born on a particular date, month and year) and
            also defined by letters pertaining to their names.
          </p>
        </div>

        <div className="py-2">
          <div className="font-bold flex items-center gap-2">
            <Iconify
              className="mr-2"
              icon="fluent-emoji:crystal-ball"
              width={42}
              height={42}
            />
            <h4 className="mt-2 mr-auto text-lg text-gray-800">
              Source of Numerology?
            </h4>
          </div>
          <hr className="mt-1 mb-2 border-gray-200" />
          <p className="text-justify text-gray-700 leading-relaxed">
            <strong>Mantra Sastra</strong> helps us to understand the latent
            powers of nature, and we learn to command them through sound
            vibrations. Finding out the forms of those invisible powers and then
            using them is the <strong>aim of Tantra Sastra</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
