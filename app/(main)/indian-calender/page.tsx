"use client";

import React, { useState, useEffect } from "react";
import Iconify from "@/components/Iconify";
import { useUser } from "@/context/UserContext";

// Types
interface PanchangInfo {
  tithi: {
    name: string;
    paksha: string;
    completeName: string;
  };
  nakshatra: {
    name: string;
    pada: number;
  };
  yoga: {
    name: string;
  };
  karana: {
    name: string;
  };
  sunrise: string;
  sunset: string;
  vara: {
    name: string;
    lord: string;
  };
}

interface DateInfo {
  date: string;
  day: string;
  dayNumber: number;
  active: boolean;
  isCurrentMonth: boolean;
  panchang?: PanchangInfo;
}

interface CalendarData {
  month: string;
  monthNumber: number;
  year: number;
  currentDate: string;
  totalDays: number;
  firstDayOfWeek: string;
  previousMonth: {
    month: number;
    year: number;
  };
  nextMonth: {
    month: number;
    year: number;
  };
  dates: DateInfo[];
}

interface ApiResponse {
  success: boolean;
  data: CalendarData;
}

const IndianCalendar = () => {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const { user } = useUser();
  const weekDays = [
    { short: "Sun", full: "Sunday", hindi: "रवि" },
    { short: "Mon", full: "Monday", hindi: "सोम" },
    { short: "Tue", full: "Tuesday", hindi: "मंगल" },
    { short: "Wed", full: "Wednesday", hindi: "बुध" },
    { short: "Thu", full: "Thursday", hindi: "गुरु" },
    { short: "Fri", full: "Friday", hindi: "शुक्र" },
    { short: "Sat", full: "Saturday", hindi: "शनि" },
  ];

  // Fetch calendar data
  const fetchCalendar = async (
    month: number,
    year: number,
    type: string = "current",
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calendar/hindu-calender?month=${month}&year=${year}&type=${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setCalendarData(data.data);
        setCurrentMonth(data.data.monthNumber);
        setCurrentYear(data.data.year);
      } else {
        setError("Failed to fetch calendar data");
      }
    } catch (err) {
      setError("Network or Server error");
      console.error("Calendar fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar(currentMonth, currentYear);
  }, []);

  const handlePrevious = () => {
    fetchCalendar(currentMonth, currentYear, "previous");
  };

  const handleNext = () => {
    fetchCalendar(currentMonth, currentYear, "next");
  };

  const handleToday = () => {
    const today = new Date();
    fetchCalendar(today.getMonth() + 1, today.getFullYear(), "current");
  };

  // Get empty cells for first week alignment
  const getEmptyCells = (): number => {
    if (!calendarData) return 0;
    const dayIndex = weekDays.findIndex(
      (d) => d.short === calendarData.firstDayOfWeek.slice(0, 3),
    );
    return dayIndex >= 0 ? dayIndex : 0;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Calendar...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <Iconify
            icon="mdi:alert-circle"
            className="text-red-500 mx-auto mb-4"
            width={48}
          />
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchCalendar(currentMonth, currentYear)}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!calendarData) return null;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-t-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all hover:scale-110"
            aria-label="Previous month"
          >
            <Iconify
              icon="mdi:chevron-left"
              width={28}
              height={28}
              className="text-white"
            />
          </button>

          {/* Month & Year */}
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold">
              {calendarData.month} {calendarData.year}
            </h1>
            <p className="text-white/80 mt-1">
              {calendarData.totalDays} Days • Hindu Panchang
            </p>
            <button
              onClick={handleToday}
              className="mt-3 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-all"
            >
              📅 Today
            </button>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all hover:scale-110"
            aria-label="Next month"
          >
            <Iconify
              icon="mdi:chevron-right"
              width={28}
              height={28}
              className="text-white"
            />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 bg-gray-800 text-white">
        {weekDays.map((day, index) => (
          <div
            key={day.short}
            className={`py-3 text-center font-semibold ${
              index === 0 ? "bg-red-600" : ""
            }`}
          >
            <span className="hidden md:block">{day.full}</span>
            <span className="md:hidden">{day.short}</span>
            <span className="block text-xs opacity-70">{day.hindi}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 bg-white border border-gray-200 rounded-b-2xl overflow-hidden">
        {/* Empty cells for alignment */}
        {Array.from({ length: getEmptyCells() }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="min-h-[120px] md:min-h-[140px] bg-gray-50 border-b border-r border-gray-100"
          ></div>
        ))}

        {/* Date cells */}
        {calendarData.dates.map((dateInfo) => (
          <DateCell key={dateInfo.date} dateInfo={dateInfo} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-xl p-4 shadow-md">
        <h3 className="font-semibold text-gray-700 mb-3">📖 Legend</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-orange-500 rounded"></span>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <Iconify
              icon="mdi:moon-waning-crescent"
              className="text-purple-500"
              width={16}
            />
            <span>Tithi</span>
          </div>
          <div className="flex items-center gap-2">
            <Iconify
              icon="mdi:star-four-points"
              className="text-blue-500"
              width={16}
            />
            <span>Nakshatra</span>
          </div>
          <div className="flex items-center gap-2">
            <Iconify icon="mdi:yoga" className="text-green-500" width={16} />
            <span>Yoga</span>
          </div>
          <div className="flex items-center gap-2">
            <Iconify icon="wi:sunrise" className="text-yellow-500" width={16} />
            <span>Sunrise/Sunset</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate Date Cell Component
const DateCell = ({ dateInfo }: { dateInfo: DateInfo }) => {
  const isSunday = dateInfo.day === "Sunday";

  return (
    <div
      className={`
        min-h-[120px] md:min-h-[140px] p-2 border-b border-r border-gray-100
        transition-all hover:shadow-lg hover:z-10 hover:scale-[1.02] cursor-default
        ${dateInfo.active ? "bg-orange-50 ring-2 ring-orange-500 ring-inset" : "bg-white"}
        ${isSunday ? "bg-red-50" : ""}
      `}
    >
      {/* Date Number */}
      <div className="flex items-start justify-between mb-1">
        <span
          className={`
            text-lg md:text-xl font-bold
            ${dateInfo.active ? "text-orange-600" : isSunday ? "text-red-500" : "text-gray-800"}
          `}
        >
          {dateInfo.dayNumber}
        </span>
        {dateInfo.active && (
          <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full">
            Today
          </span>
        )}
      </div>

      {/* Panchang Details */}
      {dateInfo.panchang && (
        <div className="space-y-1 text-[10px] md:text-xs">
          {/* Tithi */}
          <div className="flex items-center gap-1 text-purple-700 bg-purple-50 rounded px-1 py-0.5">
            <Iconify icon="mdi:moon-waning-crescent" width={12} />
            <span className="truncate">
              {dateInfo.panchang.tithi.completeName}
            </span>
          </div>

          {/* Nakshatra */}
          <div className="flex items-center gap-1 text-blue-700 bg-blue-50 rounded px-1 py-0.5">
            <Iconify icon="mdi:star-four-points" width={12} />
            <span className="truncate">
              {dateInfo.panchang.nakshatra.name}
              <span className="opacity-60 ml-1">
                P{dateInfo.panchang.nakshatra.pada}
              </span>
            </span>
          </div>

          {/* Yoga */}
          <div className="flex items-center gap-1 text-green-700 bg-green-50 rounded px-1 py-0.5">
            <Iconify icon="mdi:yoga" width={12} />
            <span className="truncate">{dateInfo.panchang.yoga.name}</span>
          </div>

          {/* Sunrise/Sunset - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 text-gray-600 mt-1">
            <div className="flex items-center gap-1">
              <Iconify
                icon="wi:sunrise"
                className="text-yellow-500"
                width={14}
              />
              <span>{dateInfo.panchang.sunrise}</span>
            </div>
            <div className="flex items-center gap-1">
              <Iconify
                icon="wi:sunset"
                className="text-orange-500"
                width={14}
              />
              <span>{dateInfo.panchang.sunset}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndianCalendar;
