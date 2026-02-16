"use client";

import { useState, useEffect } from "react";
import Iconify from "./Iconify";

interface TimeLocationData {
  locationName: string;
  latitude: number;
  longitude: number;
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  timezoneOffset: string; // e.g. "+08:00"
}

interface Props {
  value?: TimeLocationData | null;
  onChange: (data: TimeLocationData) => void;
}

export default function TimeLocationInput({ value, onChange }: Props) {
  // Internal state to manage inputs, synced with value prop if provided
  const [data, setData] = useState<TimeLocationData>({
    locationName: "",
    latitude: 0,
    longitude: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: new Date().getDate(),
    hour: 0,
    minute: 0,
    timezoneOffset: "+00:00",
  });

  useEffect(() => {
    if (value) {
      setData(value);
    }
  }, [value]);

  useEffect(() => {
    onChange(data);
  }, [data, onChange]);

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearchLocation = async (query: string) => {
    if (query.length < 3) return;
    setLoadingLocation(true);
    // Using OpenStreetMap Nominatim for free geolocation
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
      );
      const results = await res.json();
      setSearchResults(results);
    } catch (e) {
      console.error("Location search failed", e);
    } finally {
      setLoadingLocation(false);
    }
  };

  const selectLocation = (result: any) => {
    setData((prev) => ({
      ...prev,
      locationName: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    }));
    setSearchResults([]);
  };

  return (
    <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm">
      <h5 className="mb-3 flex items-center text-lg font-semibold">
        <Iconify icon="gis:map-time" className="mr-2" />
        Time & Location
      </h5>

      <div className="mb-3 relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
            <Iconify icon="carbon:location" />
          </span>
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search City..."
            value={data.locationName}
            onChange={(e) => {
              setData((prev) => ({ ...prev, locationName: e.target.value }));
              handleSearchLocation(e.target.value);
            }}
          />
        </div>
        {searchResults.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
                onClick={() => selectLocation(result)}
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="DD"
            value={data.date}
            onChange={(e) =>
              setData({ ...data, date: parseInt(e.target.value) || 0 })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="MM"
            value={data.month}
            onChange={(e) =>
              setData({ ...data, month: parseInt(e.target.value) || 0 })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="YYYY"
            value={data.year}
            onChange={(e) =>
              setData({ ...data, year: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hour (24h)
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="HH"
            value={data.hour}
            onChange={(e) =>
              setData({ ...data, hour: parseInt(e.target.value) || 0 })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minute
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="MM"
            value={data.minute}
            onChange={(e) =>
              setData({ ...data, minute: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Timezone Offset (e.g. +05:30)
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.timezoneOffset}
          onChange={(e) => setData({ ...data, timezoneOffset: e.target.value })}
        />
      </div>
    </div>
  );
}
