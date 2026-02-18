"use client";

import React, { useState } from "react";
import Iconify from "@/components/Iconify";
import PersonSelector from "@/components/PersonSelector";
import PageHeader from "@/components/PageHeader";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";

// ============ CONSTANTS ============

const PERSONALITY_ICONS = [
  "mdi:account-heart",
  "mdi:head-cog",
  "mdi:emoticon",
  "mdi:heart-pulse",
  "mdi:briefcase",
  "mdi:book-open-variant",
  "mdi:handshake",
  "mdi:currency-usd",
  "mdi:star-four-points",
];

const PERSONALITY_COLORS = [
  "#EF4444",
  "#F97316",
  "#FBBF24",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#6B7280",
];

const PERSONALITY_TITLES = [
  "Communication Style",
  "Emotional Nature",
  "Sensitivity & Feelings",
  "Relationships & Love",
  "Work & Efficiency",
  "Intellectual Pursuits",
  "Social Approach",
  "Material & Financial",
  "Perfectionism & Focus",
];

// ============ MAIN COMPONENT ============

interface PersonalityData {
  report: string[];
  spiritual_lesson: string;
  key_quality: string;
}

interface PersonalityResponse {
  success: boolean;
  message?: string;
  data: PersonalityData;
}

function PersonalityPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PersonalityResponse | null>(null);

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person to generate personality report.",
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
        hour: birthDate.getHours(),
        min: birthDate.getMinutes(),
        lat: selectedPerson.Latitude,
        lon: selectedPerson.Longitude,
        tzone: parseFloat(selectedPerson.TimezoneOffset || "5.5"),
        house_type: "placidus",
      };

      const response = await fetch("/api/personality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (error: unknown) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Data helpers
  const getReport = () => result?.data?.report || [];
  const getSpiritualLesson = () => result?.data?.spiritual_lesson || null;
  const getKeyQuality = () => result?.data?.key_quality || null;

  return (
    <div className="container mx-auto pb-12">
      <PageHeader
        title="Personality Report"
        description="Discover your personality traits through Western astrology"
        imageSrc="/images/personality-banner.jpg"
      />

      {/* Input Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Profile
            </label>
            <PersonSelector onPersonSelected={setSelectedPerson} />
          </div>

          <div>
            <button
              onClick={handleCalculate}
              disabled={loading || !selectedPerson}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                loading || !selectedPerson
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {loading ? (
                <>
                  <Iconify
                    icon="mdi:loading"
                    className="animate-spin"
                    width={18}
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Iconify icon="mdi:account-search" width={18} />
                  Analyze Personality
                </>
              )}
            </button>
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
            <div className="flex items-center gap-2">
              <Iconify
                icon="mdi:clock-outline"
                className="text-gray-400"
                width={16}
              />
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">
                {new Date(selectedPerson.BirthTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Iconify
                icon="mdi:map-marker"
                className="text-gray-400"
                width={16}
              />
              <span className="text-gray-600">Place:</span>
              <span className="font-medium">
                {selectedPerson.BirthLocation}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-6">
          {/* Key Quality & Spiritual Lesson */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Quality */}
            {getKeyQuality() && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Iconify
                      icon="mdi:key-variant"
                      width={24}
                      className="text-purple-600"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Key Quality
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {getKeyQuality()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Spiritual Lesson */}
            {getSpiritualLesson() && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Iconify
                      icon="mdi:meditation"
                      width={24}
                      className="text-indigo-600"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Spiritual Lesson
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                      {getSpiritualLesson()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Personality Traits */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <Iconify
                icon="mdi:account-details"
                width={24}
                className="text-purple-600"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                Your Personality Traits
              </h2>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                {getReport().map((trait: string, idx: number) => (
                  <PersonalityTraitCard
                    key={idx}
                    index={idx}
                    trait={trait}
                    title={PERSONALITY_TITLES[idx] || `Trait ${idx + 1}`}
                    icon={PERSONALITY_ICONS[idx % PERSONALITY_ICONS.length]}
                    color={PERSONALITY_COLORS[idx % PERSONALITY_COLORS.length]}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Personality Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Iconify
                icon="mdi:chart-pie"
                width={18}
                className="text-purple-600"
              />
              Personality Overview
            </h3>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              <TraitBadge
                label="Traits"
                count={getReport().length}
                icon="mdi:format-list-bulleted"
              />
              <TraitBadge
                label="Positive"
                count={
                  getReport().filter(
                    (t: string) => !t.includes("not") && !t.includes("avoid"),
                  ).length
                }
                icon="mdi:plus-circle"
                color="#22C55E"
              />
              <TraitBadge
                label="Growth Areas"
                count={
                  getReport().filter(
                    (t: string) => t.includes("need") || t.includes("should"),
                  ).length
                }
                icon="mdi:arrow-up-circle"
                color="#F97316"
              />
              <TraitBadge
                label="Key Quality"
                count={1}
                icon="mdi:key"
                color="#8B5CF6"
              />
              <TraitBadge
                label="Lesson"
                count={1}
                icon="mdi:lightbulb"
                color="#06B6D4"
              />
            </div>
          </div>

          {/* Full Report - Expandable */}
          <details className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <summary className="px-5 py-4 cursor-pointer hover:bg-gray-50 flex items-center gap-3 font-medium text-gray-700">
              <Iconify icon="mdi:text-box" width={20} />
              View Full Report Text
              <Iconify icon="mdi:chevron-down" width={20} className="ml-auto" />
            </summary>
            <div className="px-5 pb-5 pt-2 border-t border-gray-100">
              <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                {getReport().map((paragraph: string, idx: number) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </details>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="mt-6 bg-white rounded-lg border-2 border-dashed border-gray-200 p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
            <Iconify
              icon="mdi:account-question"
              width={40}
              className="text-purple-300"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Discover Your Personality
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Select a profile and click &quot;Analyze Personality&quot; to
            uncover your unique personality traits based on your birth chart.
          </p>
        </div>
      )}
    </div>
  );
}

// ============ SUB COMPONENTS ============

function PersonalityTraitCard({
  index,
  trait,
  title,
  icon,
  color,
}: {
  index: number;
  trait: string;
  title: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Iconify icon={icon} width={20} style={{ color }} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {index + 1}
            </span>
            <h4 className="font-medium text-gray-800">{title}</h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{trait}</p>
        </div>
      </div>
    </div>
  );
}

function TraitBadge({
  label,
  count,

  color = "#6B7280",
}: {
  label: string;
  count: number;
  icon: string;
  color?: string;
}) {
  return (
    <div className="text-center">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <span className="text-xl font-bold" style={{ color }}>
          {count}
        </span>
      </div>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

export default PersonalityPage;
