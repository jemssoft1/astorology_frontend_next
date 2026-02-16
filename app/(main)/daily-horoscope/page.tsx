"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Star,
  Moon,
  Sun,
  Heart,
  Briefcase,
  Activity,
  Smile,
  Plane,
  Clover,
} from "lucide-react";
import AstroLoader from "@/components/ui/AstroLoader";

// --- Zodiac Data ---
const ZODIAC_SIGNS = [
  { name: "aries", label: "Aries", date: "Mar 21 - Apr 19", element: "Fire" },
  {
    name: "taurus",
    label: "Taurus",
    date: "Apr 20 - May 20",
    element: "Earth",
  },
  { name: "gemini", label: "Gemini", date: "May 21 - Jun 20", element: "Air" },
  {
    name: "cancer",
    label: "Cancer",
    date: "Jun 21 - Jul 22",
    element: "Water",
  },
  { name: "leo", label: "Leo", date: "Jul 23 - Aug 22", element: "Fire" },
  { name: "virgo", label: "Virgo", date: "Aug 23 - Sep 22", element: "Earth" },
  { name: "libra", label: "Libra", date: "Sep 23 - Oct 22", element: "Air" },
  {
    name: "scorpio",
    label: "Scorpio",
    date: "Oct 23 - Nov 21",
    element: "Water",
  },
  {
    name: "sagittarius",
    label: "Sagittarius",
    date: "Nov 22 - Dec 21",
    element: "Fire",
  },
  {
    name: "capricorn",
    label: "Capricorn",
    date: "Dec 22 - Jan 19",
    element: "Earth",
  },
  {
    name: "aquarius",
    label: "Aquarius",
    date: "Jan 20 - Feb 18",
    element: "Air",
  },
  {
    name: "pisces",
    label: "Pisces",
    date: "Feb 19 - Mar 20",
    element: "Water",
  },
];

const ELEMENTS_COLOR = {
  Fire: "from-red-500 to-orange-500",
  Earth: "from-green-500 to-emerald-500",
  Air: "from-blue-400 to-indigo-500",
  Water: "from-cyan-500 to-blue-600",
};

// --- Types ---
interface NormalizedPrediction {
  personal_life: string | null;
  profession: string | null;
  health: string | null;
  emotions: string | null;
  travel: string | null;
  luck: string | null;
  prediction: string | null;
  personal_life_rating: number | null;
  profession_rating: number | null;
  health_rating: number | null;
  emotions_rating: number | null;
  travel_rating: number | null;
  luck_rating: number | null;
}

interface PredictionsData {
  yesterday: NormalizedPrediction | null;
  today: NormalizedPrediction | null;
  tomorrow: NormalizedPrediction | null;
}

// --- Section Config ---
const SECTIONS = [
  {
    key: "personal_life",
    ratingKey: "personal_life_rating",
    label: "Personal Life",
    icon: Heart,
    bg: "bg-pink-50 ",
    border: "border-pink-100 ",
    text: "text-pink-700 ",
    dot: "bg-pink-500",
  },
  {
    key: "profession",
    ratingKey: "profession_rating",
    label: "Profession",
    icon: Briefcase,
    bg: "bg-blue-50 ",
    border: "border-blue-100 ",
    text: "text-blue-700 ",
    dot: "bg-blue-500",
  },
  {
    key: "health",
    ratingKey: "health_rating",
    label: "Health",
    icon: Activity,
    bg: "bg-green-50 ",
    border: "border-green-100 ",
    text: "text-green-700 ",
    dot: "bg-green-500",
  },
  {
    key: "emotions",
    ratingKey: "emotions_rating",
    label: "Emotions",
    icon: Smile,
    bg: "bg-purple-50 ",
    border: "border-purple-100 ",
    text: "text-purple-700 ",
    dot: "bg-purple-500",
  },
  {
    key: "travel",
    ratingKey: "travel_rating",
    label: "Travel",
    icon: Plane,
    bg: "bg-yellow-50 ",
    border: "border-yellow-100 ",
    text: "text-yellow-700 ",
    dot: "bg-yellow-500",
  },
  {
    key: "luck",
    ratingKey: "luck_rating",
    label: "Luck",
    icon: Clover,
    bg: "bg-emerald-50 ",
    border: "border-emerald-100 ",
    text: "text-emerald-700 ",
    dot: "bg-emerald-500",
  },
] as const;

// --- Rating Stars Component ---
const RatingStars = ({ rating }: { rating: number | null }) => {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1 mt-2">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i < rating ? "bg-orange-400" : "bg-gray-200 "
          }`}
        />
      ))}
      <span className="text-xs text-gray-400 ml-1">{rating}/10</span>
    </div>
  );
};

// --- Components ---
const Header = () => (
  <div className="text-center mb-12 space-y-4">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium border border-orange-500/20"
    >
      <Sparkles size={16} />
      <span>Daily Insights</span>
    </motion.div>
    <motion.h1
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="text-4xl md:text-5xl font-bold text-gray-900   "
    >
      Your Daily Horoscope
    </motion.h1>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-gray-600  max-w-2xl mx-auto"
    >
      Unlock the mysteries of the stars. Select your zodiac sign to reveal what
      yesterday taught you, what today holds, and what tomorrow promises.
    </motion.p>
  </div>
);

const ZodiacCard = ({
  sign,
  isSelected,
  onClick,
}: {
  sign: (typeof ZODIAC_SIGNS)[0];
  isSelected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative group p-6 rounded-2xl transition-all duration-300 border text-left w-full h-full flex flex-col justify-between overflow-hidden
      ${
        isSelected
          ? "bg-white border-orange-500 shadow-xl shadow-orange-500/20 ring-2 ring-orange-500/50"
          : "bg-white/50 border-gray-200 hover:border-orange-500/50 hover:shadow-lg"
      }`}
  >
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${
        ELEMENTS_COLOR[sign.element as keyof typeof ELEMENTS_COLOR]
      }`}
    />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-xl ${
            isSelected
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300"
          }`}
        >
          <Star size={24} />
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">
          {sign.element}
        </span>
      </div>
      <div>
        <h3
          className={`text-lg font-bold mb-1 ${
            isSelected ? "text-gray-900 " : "text-gray-700 "
          }`}
        >
          {sign.label}
        </h3>
        <p className="text-sm text-gray-500">{sign.date}</p>
      </div>
    </div>
  </motion.button>
);

// ✅ Updated PredictionContent to handle all formats
const PredictionContent = ({
  data,
  loading,
}: {
  data: NormalizedPrediction | null;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center">
        <AstroLoader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400">
        <AlertCircle size={32} className="mb-4 opacity-50" />
        <p>No prediction data available.</p>
      </div>
    );
  }

  // ✅ Check if it's a plain string prediction (Format 4)
  const isPlainPrediction =
    data.prediction && !data.personal_life && !data.profession && !data.health;

  if (isPlainPrediction) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 ">
          <div className="flex items-center gap-2 mb-3">
            <Star className="text-orange-500" size={20} />
            <h4 className="font-semibold text-orange-700 ">Daily Prediction</h4>
          </div>
          <p className="text-lg leading-relaxed text-gray-700 ">
            {data.prediction}
          </p>
        </div>
      </motion.div>
    );
  }

  // ✅ Detailed prediction with sections (Format 1, 2, 3)
  // Filter sections that have data
  const availableSections = SECTIONS.filter(
    (section) => data[section.key as keyof NormalizedPrediction],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableSections.map((section) => {
          const Icon = section.icon;
          const content = data[
            section.key as keyof NormalizedPrediction
          ] as string;
          const rating = data[
            section.ratingKey as keyof NormalizedPrediction
          ] as number | null;

          return (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 ${section.bg} rounded-xl border ${section.border}`}
            >
              <h4
                className={`font-semibold ${section.text} mb-2 flex items-center gap-2`}
              >
                <Icon size={16} />
                {section.label}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
              {/* ✅ Show rating if available */}
              <RatingStars rating={rating} />
            </motion.div>
          );
        })}
      </div>

      {/* No sections available fallback */}
      {availableSections.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <AlertCircle size={24} className="mx-auto mb-2 opacity-50" />
          <p>No detailed predictions available for this day.</p>
        </div>
      )}
    </motion.div>
  );
};

// --- Main Page Component ---
export default function DailyHoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string>("aries");
  const [activeTab, setActiveTab] = useState<
    "yesterday" | "today" | "tomorrow"
  >("today");
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch data when sign changes
  useEffect(() => {
    const fetchHoroscope = async () => {
      setLoading(true);
      setError(null);
      setPredictions(null);

      try {
        const res = await fetch("/api/daily-horoscope", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sign: selectedSign,
            timezone: 5.5,
          }),
        });

        const result = await res.json();

        if (result.success) {
          setPredictions(result.data.predictions);
        } else {
          setError(result.error || "Failed to fetch horoscope");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, [selectedSign]);

  const tabs = [
    { id: "yesterday", label: "Yesterday", icon: Moon },
    { id: "today", label: "Today", icon: Sun },
    { id: "tomorrow", label: "Tomorrow", icon: Calendar },
  ] as const;

  const currentPrediction = predictions ? predictions[activeTab] : null;

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Zodiac Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
          {ZODIAC_SIGNS.map((sign) => (
            <ZodiacCard
              key={sign.name}
              sign={sign}
              isSelected={selectedSign === sign.name}
              onClick={() => setSelectedSign(sign.name)}
            />
          ))}
        </div>

        {/* Prediction Display */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 ">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50 p-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 relative
                      ${
                        isActive
                          ? "text-orange-600 bg-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full mx-6"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-6 md:p-10 min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {selectedSign} Daily Horoscope
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {tabs.find((t) => t.id === activeTab)?.label}&apos;s
                    celestial forecast
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Star size={24} />
                </div>
              </div>

              {error ? (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3">
                  <AlertCircle size={20} />
                  {error}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedSign}-${activeTab}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PredictionContent
                      loading={loading}
                      data={currentPrediction}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                Explore more astrological insights for {selectedSign}.
              </p>
              <button className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm group">
                View Weekly Forecast
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
