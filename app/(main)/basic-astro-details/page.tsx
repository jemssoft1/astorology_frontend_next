"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import { useUser } from "@/context/UserContext";

// ============ Types matching API Response ============

interface BirthDetails {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone: number;
  seconds: number;
  ayanamsha: number;
  sunrise: string;
  sunset: string;
}

interface AstroDetails {
  ascendant: string;
  ascendant_lord: string;
  Varna: string;
  Vashya: string;
  Yoni: string;
  Gan: string;
  Nadi: string;
  SignLord: string;
  sign: string;
  Naksahtra: string;
  NaksahtraLord: string;
  Charan: number;
  Yog: string;
  Karan: string;
  Tithi: string;
  yunja: string;
  tatva: string;
  name_alphabet: string;
  paya: string;
}

interface PlanetExtended {
  id: number;
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: string;
  sign: string;
  signLord: string;
  nakshatra: string;
  nakshatraLord: string;
  nakshatra_pad: number;
  house: number;
  is_planet_set: boolean;
  planet_awastha: string;
}

interface BhavMadhya {
  house: number;
  degree: number;
  sign: string;
  norm_degree: number;
  sign_id: number;
}

interface GhatChakra {
  month: string;
  tithi: string;
  day: string;
  nakshatra: string;
  yog: string;
  karan: string;
  pahar: string;
  moon: string;
}

interface BasicAstroData {
  birth_details: BirthDetails;
  astro_details: AstroDetails;
  planets_extended: PlanetExtended[];
  bhav_madhya: {
    ascendant: number;
    midheaven: number;
    ayanamsha: number;
    bhav_madhya: BhavMadhya[];
    bhav_sandhi: BhavMadhya[];
  };
  ghat_chakra: GhatChakra;
}

interface ApiResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: BasicAstroData;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    success_rate: string;
    timestamp: string;
  };
}

// ============ Constants ============

const ZODIAC_SIGNS = [
  { name: "Aries", icon: "mdi:zodiac-aries", element: "Fire" },
  { name: "Taurus", icon: "mdi:zodiac-taurus", element: "Earth" },
  { name: "Gemini", icon: "mdi:zodiac-gemini", element: "Air" },
  { name: "Cancer", icon: "mdi:zodiac-cancer", element: "Water" },
  { name: "Leo", icon: "mdi:zodiac-leo", element: "Fire" },
  { name: "Virgo", icon: "mdi:zodiac-virgo", element: "Earth" },
  { name: "Libra", icon: "mdi:zodiac-libra", element: "Air" },
  { name: "Scorpio", icon: "mdi:zodiac-scorpio", element: "Water" },
  { name: "Sagittarius", icon: "mdi:zodiac-sagittarius", element: "Fire" },
  { name: "Capricorn", icon: "mdi:zodiac-capricorn", element: "Earth" },
  { name: "Aquarius", icon: "mdi:zodiac-aquarius", element: "Air" },
  { name: "Pisces", icon: "mdi:zodiac-pisces", element: "Water" },
];

const PLANET_CONFIG: Record<string, { icon: string; color: string }> = {
  SUN: { icon: "mdi:white-balance-sunny", color: "text-orange-500" },
  MOON: { icon: "mdi:moon-waning-crescent", color: "text-blue-400" },
  MARS: { icon: "mdi:triangle", color: "text-red-500" },
  MERCURY: { icon: "mdi:atom", color: "text-green-500" },
  JUPITER: { icon: "mdi:circle-outline", color: "text-yellow-500" },
  VENUS: { icon: "mdi:heart", color: "text-pink-500" },
  SATURN: { icon: "mdi:hexagon-outline", color: "text-slate-600" },
  RAHU: { icon: "mdi:debug-step-over", color: "text-indigo-500" },
  KETU: { icon: "mdi:debug-step-into", color: "text-purple-500" },
  URANUS: { icon: "mdi:orbit", color: "text-cyan-500" },
  NEPTUNE: { icon: "mdi:waves", color: "text-blue-600" },
  PLUTO: { icon: "mdi:atom-variant", color: "text-gray-600" },
  Ascendant: { icon: "mdi:arrow-up-bold", color: "text-indigo-600" },
};

const ELEMENT_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Fire: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  Earth: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
  },
  Air: { bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200" },
  Water: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
};

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "planets", label: "Planets", icon: "mdi:planet" },
  { key: "houses", label: "Houses", icon: "mdi:home-outline" },
  { key: "panchang", label: "Panchang", icon: "mdi:calendar-star" },
];

export default function BasicAstroPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [astroData, setAstroData] = useState<ApiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setAstroData(null);
  };
  const { user } = useUser();
  const getBirthDataPayload = (person: Person) => {
    const birthDate = new Date(person.BirthTime);
    let tzone = 5.5; // Default IST
    if (person.TimezoneOffset) {
      const match = person.TimezoneOffset.match(/([+-]?)(\d+):(\d+)/);
      if (match) {
        const sign = match[1] === "-" ? -1 : 1;
        tzone = sign * (parseInt(match[2]) + parseInt(match[3]) / 60);
      }
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
    };
  };

  const fetchAstroData = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/basic-astro-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result: ApiResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch data");
      }
      setAstroData(result);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get data";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // ============ Helper Functions ============

  const getSignConfig = (signName: string) => {
    return (
      ZODIAC_SIGNS.find(
        (s) => s.name.toLowerCase() === signName?.toLowerCase(),
      ) || ZODIAC_SIGNS[0]
    );
  };

  const getElementColor = (signName: string) => {
    const sign = getSignConfig(signName);
    return ELEMENT_COLORS[sign.element] || ELEMENT_COLORS.Fire;
  };

  const formatDegree = (deg: number) => {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    const s = Math.round(((deg - d) * 60 - m) * 60);
    return `${d}° ${m}' ${s}"`;
  };

  // ============ Components ============

  const SignBadge = ({
    signName,
    size = "md",
  }: {
    signName: string;
    size?: "sm" | "md";
  }) => {
    const sign = getSignConfig(signName);
    const elementColor = getElementColor(signName);
    const sizeClasses =
      size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${elementColor.bg} ${elementColor.border} ${elementColor.text} ${sizeClasses}`}
      >
        <Iconify icon={sign.icon} className="text-base" />
        {signName}
      </span>
    );
  };

  // Birth Details Card
  const BirthDetailsCard = () => {
    const birth = astroData?.data?.birth_details;
    if (!birth) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Iconify
              icon="mdi:calendar-account"
              className="text-lg text-indigo-600"
            />
            Birth Details
          </h3>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Date</p>
            <p className="text-sm font-semibold text-gray-900">
              {birth.day}/{birth.month}/{birth.year}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Time</p>
            <p className="text-sm font-semibold text-gray-900">
              {birth.hour}:{String(birth.minute).padStart(2, "0")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Timezone</p>
            <p className="text-sm font-semibold text-gray-900">
              UTC+{birth.timezone}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Latitude</p>
            <p className="text-sm font-semibold text-gray-900">
              {birth.latitude.toFixed(4)}°
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Longitude</p>
            <p className="text-sm font-semibold text-gray-900">
              {birth.longitude.toFixed(4)}°
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Ayanamsha</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDegree(birth.ayanamsha)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Sunrise</p>
            <p className="text-sm font-semibold text-orange-600">
              {birth.sunrise}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Sunset</p>
            <p className="text-sm font-semibold text-indigo-600">
              {birth.sunset}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Astro Details Card
  const AstroDetailsCard = () => {
    const astro = astroData?.data?.astro_details;
    if (!astro) return null;

    const ascSign = getSignConfig(astro.ascendant);
    const moonSign = getSignConfig(astro.sign);

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Iconify
              icon="mdi:star-four-points"
              className="text-lg text-purple-600"
            />
            Astrological Details
          </h3>
        </div>

        <div className="p-5 space-y-4">
          {/* Main Signs */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-lg border ${getElementColor(astro.ascendant).bg} ${getElementColor(astro.ascendant).border}`}
            >
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Ascendant (Lagna)
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Iconify
                  icon={ascSign.icon}
                  className={`text-2xl ${getElementColor(astro.ascendant).text}`}
                />
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {astro.ascendant}
                  </p>
                  <p className="text-xs text-gray-500">
                    Lord: {astro.ascendant_lord}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border ${getElementColor(astro.sign).bg} ${getElementColor(astro.sign).border}`}
            >
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Moon Sign (Rashi)
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Iconify
                  icon={moonSign.icon}
                  className={`text-2xl ${getElementColor(astro.sign).text}`}
                />
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {astro.sign}
                  </p>
                  <p className="text-xs text-gray-500">
                    Lord: {astro.SignLord}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nakshatra */}
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Nakshatra
            </p>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {astro.Naksahtra}
                </p>
                <p className="text-xs text-gray-500">
                  Lord: {astro.NaksahtraLord} • Pada: {astro.Charan}
                </p>
              </div>
              <span className="text-2xl">{astro.name_alphabet}</span>
            </div>
          </div>

          {/* Panchang Details Grid */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: "Tithi", value: astro.Tithi },
              { label: "Yoga", value: astro.Yog },
              { label: "Karana", value: astro.Karan },
              { label: "Varna", value: astro.Varna },
              { label: "Nadi", value: astro.Nadi },
              { label: "Yoni", value: astro.Yoni },
              { label: "Gana", value: astro.Gan },
              { label: "Vashya", value: astro.Vashya },
              { label: "Tatva", value: astro.tatva },
              { label: "Paya", value: astro.paya },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <p className="text-[10px] text-gray-500 uppercase">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Planets Table
  const PlanetsTable = () => {
    const planets = astroData?.data?.planets_extended;
    if (!planets) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">
            Planetary Positions
          </h3>
          <p className="text-sm text-gray-500">
            Sidereal positions using Lahiri Ayanamsha
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Planet
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Sign
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Degree
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Nakshatra
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  House
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {planets.map((planet, idx) => {
                const config = PLANET_CONFIG[planet.name] || {
                  icon: "mdi:circle",
                  color: "text-gray-500",
                };
                const isRetro = planet.isRetro === "true";

                return (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon={config.icon}
                          className={`text-lg ${config.color}`}
                        />
                        <span className="font-medium text-gray-900">
                          {planet.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <SignBadge signName={planet.sign} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700 font-mono">
                        {formatDegree(planet.normDegree)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-gray-900">
                          {planet.nakshatra}
                        </p>
                        <p className="text-xs text-gray-500">
                          Pada {planet.nakshatra_pad}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm">
                        {planet.house}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isRetro && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                            ℞ Retro
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          {planet.planet_awastha}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Houses Table
  const HousesTable = () => {
    const bhav = astroData?.data?.bhav_madhya;
    if (!bhav) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">
            Bhava (House) Positions
          </h3>
          <p className="text-sm text-gray-500">
            Ascendant: {formatDegree(bhav.ascendant)} • MC:{" "}
            {formatDegree(bhav.midheaven)}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
          {bhav.bhav_madhya.map((house, idx) => {
            const elementColor = getElementColor(house.sign);
            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${elementColor.bg} ${elementColor.border}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    House {house.house}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${elementColor.text} bg-white`}
                  >
                    {house.sign}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-mono">
                  {formatDegree(house.norm_degree)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Ghat Chakra Card
  const GhatChakraCard = () => {
    const ghat = astroData?.data?.ghat_chakra;
    if (!ghat) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Iconify
              icon="mdi:alert-circle-outline"
              className="text-lg text-red-500"
            />
            Ghat Chakra (Unfavorable Periods)
          </h3>
          <p className="text-xs text-gray-500 mt-1">Times to be cautious</p>
        </div>

        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Ghat Month",
              value: ghat.month,
              icon: "mdi:calendar-month",
            },
            {
              label: "Ghat Tithi",
              value: ghat.tithi,
              icon: "mdi:moon-waning-crescent",
            },
            { label: "Ghat Day", value: ghat.day, icon: "mdi:calendar-today" },
            {
              label: "Ghat Nakshatra",
              value: ghat.nakshatra,
              icon: "mdi:star-outline",
            },
            { label: "Ghat Yoga", value: ghat.yog, icon: "mdi:yoga" },
            {
              label: "Ghat Karana",
              value: ghat.karan,
              icon: "mdi:clock-outline",
            },
            {
              label: "Ghat Pahar",
              value: ghat.pahar,
              icon: "mdi:timer-outline",
            },
            { label: "Ghat Moon", value: ghat.moon, icon: "mdi:moon-full" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-red-50/50 border border-red-100"
            >
              <div className="flex items-center gap-2 mb-1">
                <Iconify icon={item.icon} className="text-sm text-red-400" />
                <p className="text-[10px] text-gray-500 uppercase">
                  {item.label}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Quick Summary Stats
  const QuickStats = () => {
    const astro = astroData?.data?.astro_details;
    const birth = astroData?.data?.birth_details;
    if (!astro || !birth) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
          <Iconify
            icon="mdi:arrow-up-bold-circle"
            className="text-2xl opacity-80 mb-2"
          />
          <p className="text-xs opacity-80 uppercase">Ascendant</p>
          <p className="text-xl font-bold">{astro.ascendant}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-4 text-white">
          <Iconify
            icon="mdi:moon-waning-crescent"
            className="text-2xl opacity-80 mb-2"
          />
          <p className="text-xs opacity-80 uppercase">Moon Sign</p>
          <p className="text-xl font-bold">{astro.sign}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-4 text-white">
          <Iconify
            icon="mdi:star-four-points"
            className="text-2xl opacity-80 mb-2"
          />
          <p className="text-xs opacity-80 uppercase">Nakshatra</p>
          <p className="text-xl font-bold">{astro.Naksahtra}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg p-4 text-white">
          <Iconify
            icon="mdi:calendar-star"
            className="text-2xl opacity-80 mb-2"
          />
          <p className="text-xs opacity-80 uppercase">Tithi</p>
          <p className="text-xl font-bold">{astro.Tithi}</p>
        </div>
      </div>
    );
  };

  // Overview Tab Content
  const OverviewContent = () => (
    <div className="space-y-6">
      <QuickStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BirthDetailsCard />
        <AstroDetailsCard />
      </div>
    </div>
  );

  // Tab Content Renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent />;
      case "planets":
        return <PlanetsTable />;
      case "houses":
        return <HousesTable />;
      case "panchang":
        return (
          <div className="space-y-6">
            <AstroDetailsCard />
            <GhatChakraCard />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Basic Astrology Details"
          description="Complete birth chart analysis with planetary positions"
          imageSrc="/images/astro.png"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Iconify
                  icon="mdi:account-outline"
                  className="text-lg text-gray-500"
                />
                Select Person
              </h3>
              <PersonSelector
                onPersonSelected={handlePersonSelected}
                label="Choose Profile"
              />

              <button
                onClick={fetchAstroData}
                disabled={loading || !selectedPerson}
                className="mt-4 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Iconify icon="mdi:chart-arc" className="text-lg" />
                    Get Chart
                  </>
                )}
              </button>
            </div>

            {/* Person Info */}
            {selectedPerson && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Selected Profile
                </h4>
                <p className="text-lg font-bold text-indigo-600">
                  {selectedPerson.Name}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedPerson?.PlaceOfBirth}
                </p>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {astroData ? (
              <div className="space-y-4">
                {/* Tabs */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="flex overflow-x-auto border-b border-gray-200">
                    {TABS.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.key
                            ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                            : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Iconify icon={tab.icon} className="text-lg" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                {renderTabContent()}

                {/* API Status */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      API Success Rate: {astroData.meta.success_rate}
                    </span>
                    <span className="text-gray-400">
                      {new Date(astroData.meta.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                  <Iconify
                    icon="mdi:chart-arc"
                    className="text-3xl text-indigo-400"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Birth Chart Analysis
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a person and click &quot;Get Chart&quot; to view
                  complete astrological details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
