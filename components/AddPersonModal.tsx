"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { addPerson } from "@/lib/astroweb";
import Iconify from "./Iconify";
import Swal from "sweetalert2";

interface Props {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface LocationSuggestion {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

type FormData = {
  personName: string;
  gender: "Male" | "Female" | "Other";
  birthDate: string;
  birthTime: string;
  locationSearch: string;
  notes: string;
};

export default function AddPersonModal({ show, onClose, onSuccess }: Props) {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchingLocation, setSearchingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      personName: "",
      gender: "Male",
      birthDate: "",
      birthTime: "",
      locationSearch: "",
      notes: "",
    },
  });

  const locationSearchValue = watch("locationSearch");
  const genderValue = watch("gender");

  // Location search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationSearchValue.length >= 3) {
        searchLocation(locationSearchValue);
      } else {
        setLocationSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [locationSearchValue]);

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
    setValue("locationSearch", location.name.split(",")[0]);
    setShowSuggestions(false);
  };

  const resetForm = () => {
    reset();
    setSelectedLocation(null);
    setLocationSuggestions([]);
    setShowSuggestions(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    // Validation
    if (!selectedLocation) {
      Swal.fire("Error", "Please select birth location", "error");
      return;
    }

    setLoading(true);

    try {
      // Format birth time to SQL DateTime string (YYYY-MM-DD HH:mm:ss)
      const birthTimeSQL = `${data.birthDate} ${data.birthTime}:00`;

      let offset = "+00:00";
      if (selectedLocation.timezone === "Asia/Kolkata") {
        offset = "+05:30";
      }

      const result = await addPerson({
        personName: data.personName.trim(),
        gender: data.gender,
        birthTime: birthTimeSQL,
        notes: data.notes,
        birthLocation: selectedLocation.name,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        timezoneOffset: offset,
      });

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Person Added!",
          text: `${data.personName} has been added successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
        resetForm();
        onSuccess();
        onClose();
      } else {
        Swal.fire("Error", result.error || "Failed to add person", "error");
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
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h5 className="text-lg font-semibold flex items-center text-gray-800">
            <Iconify
              icon="bi:person-plus"
              className="mr-2 text-blue-600"
              width={24}
            />
            Add New Person
          </h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 space-y-4">
            {/* Person Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
                  errors.personName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter full name"
                {...register("personName", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                disabled={loading}
              />
              {errors.personName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.personName.message}
                </p>
              )}
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
                      genderValue === g
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setValue("gender", g)}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
                  errors.birthDate ? "border-red-500" : "border-gray-300"
                }`}
                {...register("birthDate", {
                  required: "Birth date is required",
                })}
                disabled={loading}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            {/* Birth Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
                  errors.birthTime ? "border-red-500" : "border-gray-300"
                }`}
                {...register("birthTime", {
                  required: "Birth time is required",
                })}
                disabled={loading}
              />
              {errors.birthTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.birthTime.message}
                </p>
              )}
            </div>

            {/* Birth Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Location <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                  <Iconify icon="bi:geo-alt" width={18} />
                </span>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  placeholder="Search city..."
                  {...register("locationSearch", {
                    required: "Location is required",
                  })}
                  onFocus={() =>
                    locationSuggestions.length > 0 && setShowSuggestions(true)
                  }
                  disabled={loading}
                  autoComplete="off"
                />
                {searchingLocation && (
                  <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </span>
                )}
              </div>

              {/* Location Suggestions Dropdown */}
              {showSuggestions && locationSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                  {locationSuggestions.map((loc, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 text-sm"
                      onClick={() => selectLocation(loc)}
                    >
                      {loc.name}
                    </li>
                  ))}
                </ul>
              )}

              {selectedLocation && (
                <small className="text-green-600 flex items-center mt-1">
                  <Iconify icon="bi:check-circle" className="mr-1" width={16} />
                  {selectedLocation.latitude.toFixed(4)},{" "}
                  {selectedLocation.longitude.toFixed(4)}
                </small>
              )}

              {errors.locationSearch && !selectedLocation && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a location from suggestions
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                rows={2}
                placeholder="Any additional notes..."
                {...register("notes")}
                disabled={loading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Iconify icon="bi:plus-lg" className="mr-2" width={16} />
                  Add Person
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
