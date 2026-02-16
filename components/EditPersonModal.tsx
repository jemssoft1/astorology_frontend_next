// components/EditPersonModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Person } from "@/lib/models";
import { updatePerson } from "@/lib/astroweb";
import Iconify from "./Iconify";
import Swal from "sweetalert2";

interface Props {
  show: boolean;
  person: Person | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface LocationSuggestion {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export default function EditPersonModal({
  show,
  person,
  onClose,
  onSuccess,
}: Props) {
  // Form state
  const [personName, setPersonName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);
  interface NominatimResult {
    display_name: string;
    lat: string;
    lon: string;
  }
  // Populate form when person changes
  useEffect(() => {
    if (person) {
      setPersonName(person.Name);
      setGender(person.Gender as "Male" | "Female" | "Other");
      setNotes(person.Notes || "");

      // Parse birth date and time
      if (person.BirthTime) {
        const dt = new Date(person.BirthTime);
        setBirthDate(dt.toISOString().split("T")[0]);
        setBirthTime(dt.toTimeString().slice(0, 5));
      }

      // Set location
      if (person?.BirthLocation) {
        setLocationSearch(person.BirthLocation || "");
        setSelectedLocation({
          name: person.BirthLocation,
          latitude: person.Latitude,
          longitude: person.Longitude,
          timezone: "Asia/Kolkata",
        });
      }
    }
  }, [person]);

  // Location search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationSearch.length >= 3 && !selectedLocation) {
        searchLocation(locationSearch);
      } else {
        setLocationSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locationSearch]);

  const searchLocation = async (query: string) => {
    setSearchingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      );
      const data = await response.json();

      const suggestions: LocationSuggestion[] = data.map(
        (item: NominatimResult) => ({
          name: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          timezone: "Asia/Kolkata",
        }),
      );

      setLocationSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Location search error:", error);
    } finally {
      setSearchingLocation(false);
    }
  };

  const selectLocation = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    setLocationSearch(location.name.split(",")[0]);
    setShowSuggestions(false);
  };

  const handleLocationChange = (value: string) => {
    setLocationSearch(value);
    setSelectedLocation(null); // Clear selection when typing
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!person) return;

    // Validation
    if (!personName.trim()) {
      Swal.fire("Error", "Please enter person name", "error");
      return;
    }
    if (!birthDate) {
      Swal.fire("Error", "Please select birth date", "error");
      return;
    }
    if (!birthTime) {
      Swal.fire("Error", "Please enter birth time", "error");
      return;
    }
    if (!selectedLocation) {
      Swal.fire("Error", "Please select birth location", "error");
      return;
    }

    setLoading(true);

    try {
      // Format birth time to SQL DateTime string (YYYY-MM-DD HH:mm:ss)
      const birthTimeSQL = `${birthDate} ${birthTime}:00`;

      let offset = "+00:00";
      if (selectedLocation.timezone === "Asia/Kolkata") {
        offset = "+05:30";
      }

      const result = await updatePerson({
        personId: person.PersonId,
        personName: personName.trim(),
        gender,
        birthTime: birthTimeSQL,
        notes,
        birthLocation: selectedLocation.name,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        timezoneOffset: offset,
      });

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `${personName} has been updated successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess();
        onClose();
      } else {
        Swal.fire("Error", result.error || "Failed to update person", "error");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h5 className="text-lg font-semibold flex items-center">
            <Iconify icon="bi:pencil" className="mr-2" />
            Edit Person
          </h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            onClick={handleClose}
            disabled={loading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {/* Person Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {(["Male", "Female", "Other"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`flex-1 px-4 py-2 rounded-md border transition-colors ${
                      gender === g
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setGender(g)}
                    disabled={loading}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Birth Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Birth Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Location <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                  <Iconify icon="bi:geo-alt" />
                </span>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search city..."
                  value={locationSearch}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onFocus={() =>
                    locationSuggestions.length > 0 && setShowSuggestions(true)
                  }
                  disabled={loading}
                />
                {searchingLocation && (
                  <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 rounded-r-md">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </span>
                )}
              </div>

              {showSuggestions && locationSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                  {locationSuggestions.map((loc, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectLocation(loc)}
                    >
                      <small>{loc.name}</small>
                    </li>
                  ))}
                </ul>
              )}

              {selectedLocation && (
                <small className="text-green-600 flex items-center mt-1">
                  <Iconify icon="bi:check-circle" className="mr-1" />
                  {selectedLocation.latitude.toFixed(4)},{" "}
                  {selectedLocation.longitude.toFixed(4)}
                </small>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Iconify icon="bi:check-lg" className="mr-2" />
                  Update Person
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
