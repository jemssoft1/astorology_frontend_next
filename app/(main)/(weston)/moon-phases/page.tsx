// "use client";

// import React, { useState } from "react";
// import Iconify from "@/components/Iconify";
// import PersonSelector from "@/components/PersonSelector";
// import PageHeader from "@/components/PageHeader";
// import { Person } from "@/lib/models";
// import Swal from "sweetalert2";
// import Button from "@/components/ui/Button";

// // ============ CONSTANTS ============

// const HOUSE_TYPES = [
//   { value: "placidus", label: "Placidus" },
//   { value: "koch", label: "Koch" },
//   { value: "topocentric", label: "Topocentric" },
//   { value: "poryphry", label: "Porphyry" },
//   { value: "equal_house", label: "Equal House" },
//   { value: "whole_sign", label: "Whole Sign" },
// ] as const;

// type HouseType = (typeof HOUSE_TYPES)[number]["value"];

// const MOON_PHASE_ICONS: Record<string, string> = {
//   "New Moon": "mdi:moon-new",
//   "Waxing Crescent": "mdi:moon-waxing-crescent",
//   "First Quarter": "mdi:moon-first-quarter",
//   "Waxing Gibbous": "mdi:moon-waxing-gibbous",
//   "Full Moon": "mdi:moon-full",
//   "Waning Gibbous": "mdi:moon-waning-gibbous",
//   "Last Quarter": "mdi:moon-last-quarter",
//   "Third Quarter": "mdi:moon-last-quarter",
//   "Waning Crescent": "mdi:moon-waning-crescent",
// };

// const MOON_PHASE_COLORS: Record<string, string> = {
//   "New Moon": "#1F2937",
//   "Waxing Crescent": "#6366F1",
//   "First Quarter": "#8B5CF6",
//   "Waxing Gibbous": "#A78BFA",
//   "Full Moon": "#F59E0B",
//   "Waning Gibbous": "#F97316",
//   "Last Quarter": "#EF4444",
//   "Third Quarter": "#EF4444",
//   "Waning Crescent": "#DC2626",
// };

// const SIGN_ICONS: Record<string, string> = {
//   Aries: "mdi:zodiac-aries",
//   Taurus: "mdi:zodiac-taurus",
//   Gemini: "mdi:zodiac-gemini",
//   Cancer: "mdi:zodiac-cancer",
//   Leo: "mdi:zodiac-leo",
//   Virgo: "mdi:zodiac-virgo",
//   Libra: "mdi:zodiac-libra",
//   Scorpio: "mdi:zodiac-scorpio",
//   Sagittarius: "mdi:zodiac-sagittarius",
//   Capricorn: "mdi:zodiac-capricorn",
//   Aquarius: "mdi:zodiac-aquarius",
//   Pisces: "mdi:zodiac-pisces",
// };

// const SIGN_COLORS: Record<string, string> = {
//   Aries: "#EF4444",
//   Taurus: "#22C55E",
//   Gemini: "#F59E0B",
//   Cancer: "#6B7280",
//   Leo: "#F97316",
//   Virgo: "#84CC16",
//   Libra: "#EC4899",
//   Scorpio: "#DC2626",
//   Sagittarius: "#8B5CF6",
//   Capricorn: "#6366F1",
//   Aquarius: "#06B6D4",
//   Pisces: "#3B82F6",
// };

// // ============ INTERFACES ============

// interface LunarMetrics {
//   moon_sign: string;
//   moon_degree: number;
//   moon_phase: string;
//   moon_phase_number: number;
//   moon_nakshatra: string;
//   moon_nakshatra_lord: string;
//   moon_nakshatra_pada: number;
//   moon_tithi: string;
//   moon_tithi_lord: string;
//   moon_yoga: string;
//   moon_karana: string;
//   moon_rise: string;
//   moon_set: string;
//   next_full_moon: string;
//   next_new_moon: string;
//   moon_age: number;
//   moon_illumination: number;
//   moon_distance: number;
//   is_waxing: boolean;
//   lunar_day: number;
//   lunar_month: string;
// }

// interface MoonPhaseReport {
//   moon_phase: string;
//   moon_sign: string;
//   general_meaning: string;
//   emotional_nature: string;
//   best_activities: string[];
//   avoid_activities: string[];
//   spiritual_guidance: string;
//   relationship_advice: string;
//   career_guidance: string;
//   health_tips: string;
//   lucky_color: string;
//   lucky_number: number;
//   element: string;
//   keywords: string[];
// }

// interface MoonPhasesResponse {
//   status: string;
//   message?: string;
//   data: {
//     birth_data: Record<string, unknown>;
//     house_type: string;
//     lunar_metrics: LunarMetrics;
//     moon_phase_report: MoonPhaseReport;
//   };
// }

// // ============ MAIN COMPONENT ============

// function MoonPhasesPage() {
//   const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
//   const [houseType, setHouseType] = useState<HouseType>("placidus");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<MoonPhasesResponse | null>(null);
//   const [activeTab, setActiveTab] = useState<string>("overview");

//   const handleCalculate = async () => {
//     if (!selectedPerson) {
//       Swal.fire({
//         icon: "warning",
//         title: "Select Person",
//         text: "Please select a person to generate moon phase report.",
//       });
//       return;
//     }

//     setLoading(true);
//     setResult(null);

//     try {
//       const birthDate = new Date(selectedPerson.BirthTime);

//       const requestBody = {
//         day: birthDate.getDate(),
//         month: birthDate.getMonth() + 1,
//         year: birthDate.getFullYear(),
//         hour: birthDate.getHours(),
//         min: birthDate.getMinutes(),
//         lat: selectedPerson.Latitude,
//         lon: selectedPerson.Longitude,
//         tzone: parseFloat(selectedPerson.TimezoneOffset || "5.5"),
//         house_type: houseType,
//       };

//       const response = await fetch("/api/lunar", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(requestBody),
//       });

//       const data = await response.json();

//       if (data.status === "Pass") {
//         setResult(data);
//       } else {
//         throw new Error(data.message || "Failed to fetch data");
//       }
//     } catch (error: unknown) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error instanceof Error ? error.message : "Something went wrong!",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const tabs = [
//     { id: "overview", label: "Overview", icon: "mdi:moon-full" },
//     { id: "metrics", label: "Lunar Metrics", icon: "mdi:chart-arc" },
//     { id: "guidance", label: "Guidance", icon: "mdi:compass" },
//     { id: "activities", label: "Activities", icon: "mdi:calendar-check" },
//   ];

//   return (
//     <div className="container mx-auto pb-12">
//       <PageHeader
//         title="Moon Phases Report"
//         description="Discover your lunar influences and moon phase guidance"
//         imageSrc="/images/moon-phases-banner.jpg"
//       />

//       {/* Input Section */}
//       <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
//           {/* Person Selector */}
//           <div>
//             <PersonSelector onPersonSelected={setSelectedPerson} />
//           </div>

//           {/* House Type Selector */}
//           <div>
//             <label
//               htmlFor="house-type"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               <div className="flex items-center gap-2">
//                 <Iconify
//                   icon="mdi:home-variant"
//                   width={16}
//                   className="text-gray-500"
//                 />
//                 House System
//               </div>
//             </label>
//             <div className="relative">
//               <select
//                 id="house-type"
//                 value={houseType}
//                 onChange={(e) => setHouseType(e.target.value as HouseType)}
//                 className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
//               >
//                 {HOUSE_TYPES.map((type) => (
//                   <option key={type.value} value={type.value}>
//                     {type.label}
//                   </option>
//                 ))}
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
//                 <Iconify
//                   icon="mdi:chevron-down"
//                   width={20}
//                   className="text-gray-400"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Calculate Button */}
//           <div>
//             <Button
//               handleCalculate={handleCalculate}
//               selectedPerson={selectedPerson}
//               isCalculating={loading}
//             />
//           </div>
//         </div>

//         {/* Person Info */}
//         {selectedPerson && (
//           <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
//             <div className="flex items-center gap-2">
//               <Iconify
//                 icon="mdi:account"
//                 className="text-gray-400"
//                 width={16}
//               />
//               <span className="text-gray-600">Name:</span>
//               <span className="font-medium">{selectedPerson.Name}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Iconify
//                 icon="mdi:calendar"
//                 className="text-gray-400"
//                 width={16}
//               />
//               <span className="text-gray-600">Birth Date:</span>
//               <span className="font-medium">
//                 {new Date(selectedPerson.BirthTime).toLocaleDateString()}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Iconify
//                 icon="mdi:clock-outline"
//                 className="text-gray-400"
//                 width={16}
//               />
//               <span className="text-gray-600">Time:</span>
//               <span className="font-medium">
//                 {new Date(selectedPerson.BirthTime).toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Iconify
//                 icon="mdi:map-marker"
//                 className="text-gray-400"
//                 width={16}
//               />
//               <span className="text-gray-600">Place:</span>
//               <span className="font-medium">
//                 {selectedPerson.BirthLocation}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Iconify
//                 icon="mdi:home-variant"
//                 className="text-gray-400"
//                 width={16}
//               />
//               <span className="text-gray-600">House System:</span>
//               <span className="font-medium capitalize">
//                 {HOUSE_TYPES.find((t) => t.value === houseType)?.label ||
//                   houseType}
//               </span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Results */}
//       {result && result.data && (
//         <div className="mt-6 space-y-6">
//           {/* House Type Badge */}
//           <div className="flex items-center gap-2">
//             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-sm text-indigo-700">
//               <Iconify icon="mdi:home-variant" width={16} />
//               House System:{" "}
//               <span className="font-semibold capitalize">
//                 {result.data.house_type || houseType}
//               </span>
//             </span>
//           </div>

//           {/* Moon Phase Hero Card */}
//           <MoonPhaseHeroCard
//             metrics={result.data.lunar_metrics}
//             report={result.data.moon_phase_report}
//           />

//           {/* Tabs */}
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             <div className="flex border-b border-gray-200 overflow-x-auto">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
//                     activeTab === tab.id
//                       ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
//                       : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
//                   }`}
//                 >
//                   <Iconify icon={tab.icon} width={18} />
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             <div className="p-5">
//               {activeTab === "overview" && (
//                 <OverviewTab
//                   metrics={result.data.lunar_metrics}
//                   report={result.data.moon_phase_report}
//                 />
//               )}
//               {activeTab === "metrics" && (
//                 <MetricsTab metrics={result.data.lunar_metrics} />
//               )}
//               {activeTab === "guidance" && (
//                 <GuidanceTab report={result.data.moon_phase_report} />
//               )}
//               {activeTab === "activities" && (
//                 <ActivitiesTab report={result.data.moon_phase_report} />
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Empty State */}
//       {!result && !loading && (
//         <div className="mt-6 bg-white rounded-lg border-2 border-dashed border-gray-200 p-10 text-center">
//           <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
//             <Iconify
//               icon="mdi:moon-waning-crescent"
//               width={40}
//               className="text-indigo-300"
//             />
//           </div>
//           <h3 className="text-lg font-medium text-gray-700 mb-1">
//             Discover Your Lunar Influence
//           </h3>
//           <p className="text-sm text-gray-500 max-w-md mx-auto">
//             Select a profile, choose a house system, and click calculate to
//             reveal your moon phase, lunar metrics, and personalized guidance
//             based on the moon&apos;s position at your birth.
//           </p>
//         </div>
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="mt-6 bg-white rounded-lg border border-gray-200 p-10 text-center">
//           <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
//             <Iconify
//               icon="mdi:loading"
//               width={32}
//               className="text-indigo-500 animate-spin"
//             />
//           </div>
//           <h3 className="text-lg font-medium text-gray-700 mb-1">
//             Calculating Moon Phases...
//           </h3>
//           <p className="text-sm text-gray-500">
//             Please wait while we analyze your lunar influences using the{" "}
//             <span className="font-medium capitalize">
//               {HOUSE_TYPES.find((t) => t.value === houseType)?.label ||
//                 houseType}
//             </span>{" "}
//             house system.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// // ============ HERO COMPONENT ============

// function MoonPhaseHeroCard({
//   metrics,
//   report,
// }: {
//   metrics: LunarMetrics;
//   report: MoonPhaseReport;
// }) {
//   const phaseColor = MOON_PHASE_COLORS[metrics.moon_phase] || "#6B7280";

//   return (
//     <div
//       className="rounded-xl p-6 text-white relative overflow-hidden"
//       style={{
//         background: `linear-gradient(135deg, ${phaseColor} 0%, #1F2937 100%)`,
//       }}
//     >
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-10 right-10">
//           <Iconify
//             icon={MOON_PHASE_ICONS[metrics.moon_phase] || "mdi:moon-full"}
//             width={200}
//           />
//         </div>
//       </div>

//       <div className="relative z-10">
//         <div className="flex flex-wrap items-start justify-between gap-6">
//           {/* Left Side - Moon Phase Info */}
//           <div className="flex items-center gap-6">
//             <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
//               <Iconify
//                 icon={MOON_PHASE_ICONS[metrics.moon_phase] || "mdi:moon-full"}
//                 width={60}
//               />
//             </div>
//             <div>
//               <p className="text-sm opacity-80 mb-1">Moon Phase</p>
//               <h2 className="text-3xl font-bold mb-2">{metrics.moon_phase}</h2>
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
//                   <Iconify
//                     icon={SIGN_ICONS[metrics.moon_sign] || "mdi:zodiac-cancer"}
//                     width={18}
//                   />
//                   <span className="font-medium">{metrics.moon_sign}</span>
//                 </div>
//                 <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
//                   <Iconify icon="mdi:angle-acute" width={18} />
//                   <span className="font-medium">
//                     {metrics.moon_degree.toFixed(2)}°
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Quick Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="text-center bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
//               <Iconify
//                 icon="mdi:brightness-percent"
//                 width={24}
//                 className="mx-auto mb-1"
//               />
//               <p className="text-2xl font-bold">{metrics.moon_illumination}%</p>
//               <p className="text-xs opacity-80">Illumination</p>
//             </div>
//             <div className="text-center bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
//               <Iconify
//                 icon="mdi:calendar-today"
//                 width={24}
//                 className="mx-auto mb-1"
//               />
//               <p className="text-2xl font-bold">{metrics.moon_age}</p>
//               <p className="text-xs opacity-80">Moon Age (Days)</p>
//             </div>
//             <div className="text-center bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
//               <Iconify
//                 icon="mdi:calendar-star"
//                 width={24}
//                 className="mx-auto mb-1"
//               />
//               <p className="text-2xl font-bold">{metrics.lunar_day}</p>
//               <p className="text-xs opacity-80">Lunar Day</p>
//             </div>
//             <div className="text-center bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
//               <Iconify
//                 icon={metrics.is_waxing ? "mdi:arrow-up" : "mdi:arrow-down"}
//                 width={24}
//                 className="mx-auto mb-1"
//               />
//               <p className="text-lg font-bold">
//                 {metrics.is_waxing ? "Waxing" : "Waning"}
//               </p>
//               <p className="text-xs opacity-80">Phase Direction</p>
//             </div>
//           </div>
//         </div>

//         {/* Keywords */}
//         {report.keywords && report.keywords.length > 0 && (
//           <div className="mt-6 pt-4 border-t border-white/20">
//             <div className="flex flex-wrap gap-2">
//               {report.keywords.map((keyword, idx) => (
//                 <span
//                   key={idx}
//                   className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm"
//                 >
//                   {keyword}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // ============ TAB COMPONENTS ============

// function OverviewTab({
//   metrics,
//   report,
// }: {
//   metrics: LunarMetrics;
//   report: MoonPhaseReport;
// }) {
//   return (
//     <div className="space-y-6">
//       {/* General Meaning */}
//       <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-5">
//         <div className="flex items-start gap-4">
//           <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
//             <Iconify
//               icon="mdi:book-open-variant"
//               width={24}
//               className="text-indigo-600"
//             />
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-800 mb-2">
//               General Meaning
//             </h3>
//             <p className="text-gray-600 leading-relaxed">
//               {report.general_meaning}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Emotional Nature */}
//       <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-lg p-5">
//         <div className="flex items-start gap-4">
//           <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
//             <Iconify icon="mdi:heart" width={24} className="text-pink-600" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-gray-800 mb-2">
//               Emotional Nature
//             </h3>
//             <p className="text-gray-600 leading-relaxed">
//               {report.emotional_nature}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Info Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <InfoCard
//           label="Element"
//           value={report.element}
//           icon="mdi:fire"
//           color="#F97316"
//         />
//         <InfoCard
//           label="Lucky Color"
//           value={report.lucky_color}
//           icon="mdi:palette"
//           color="#8B5CF6"
//         />
//         <InfoCard
//           label="Lucky Number"
//           value={report.lucky_number?.toString() || "N/A"}
//           icon="mdi:numeric"
//           color="#22C55E"
//         />
//         <InfoCard
//           label="Moon Sign"
//           value={report.moon_sign}
//           icon={SIGN_ICONS[report.moon_sign] || "mdi:zodiac-cancer"}
//           color={SIGN_COLORS[report.moon_sign] || "#6B7280"}
//         />
//       </div>

//       {/* Moon Rise & Set */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="border border-gray-200 rounded-lg p-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
//               <Iconify
//                 icon="mdi:weather-sunset-up"
//                 width={22}
//                 className="text-amber-600"
//               />
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 uppercase">Moon Rise</p>
//               <p className="font-semibold text-gray-800">{metrics.moon_rise}</p>
//             </div>
//           </div>
//         </div>
//         <div className="border border-gray-200 rounded-lg p-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
//               <Iconify
//                 icon="mdi:weather-sunset-down"
//                 width={22}
//                 className="text-indigo-600"
//               />
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 uppercase">Moon Set</p>
//               <p className="font-semibold text-gray-800">{metrics.moon_set}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Next Full & New Moon */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
//               <Iconify
//                 icon="mdi:moon-full"
//                 width={22}
//                 className="text-amber-600"
//               />
//             </div>
//             <div>
//               <p className="text-xs text-amber-600 uppercase">Next Full Moon</p>
//               <p className="font-semibold text-gray-800">
//                 {metrics.next_full_moon}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="border border-gray-300 bg-gray-50 rounded-lg p-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
//               <Iconify
//                 icon="mdi:moon-new"
//                 width={22}
//                 className="text-gray-600"
//               />
//             </div>
//             <div>
//               <p className="text-xs text-gray-600 uppercase">Next New Moon</p>
//               <p className="font-semibold text-gray-800">
//                 {metrics.next_new_moon}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function MetricsTab({ metrics }: { metrics: LunarMetrics }) {
//   const metricsData = [
//     {
//       category: "Position",
//       items: [
//         {
//           label: "Moon Sign",
//           value: metrics.moon_sign,
//           icon: SIGN_ICONS[metrics.moon_sign] || "mdi:zodiac-cancer",
//         },
//         {
//           label: "Moon Degree",
//           value: `${metrics.moon_degree.toFixed(2)}°`,
//           icon: "mdi:angle-acute",
//         },
//         {
//           label: "Moon Phase",
//           value: metrics.moon_phase,
//           icon: MOON_PHASE_ICONS[metrics.moon_phase] || "mdi:moon-full",
//         },
//         {
//           label: "Phase Number",
//           value: metrics.moon_phase_number.toString(),
//           icon: "mdi:numeric",
//         },
//       ],
//     },
//     {
//       category: "Vedic Metrics",
//       items: [
//         {
//           label: "Nakshatra",
//           value: metrics.moon_nakshatra,
//           icon: "mdi:star-four-points",
//         },
//         {
//           label: "Nakshatra Lord",
//           value: metrics.moon_nakshatra_lord,
//           icon: "mdi:crown",
//         },
//         {
//           label: "Nakshatra Pada",
//           value: metrics.moon_nakshatra_pada.toString(),
//           icon: "mdi:numeric-1-box",
//         },
//         {
//           label: "Tithi",
//           value: metrics.moon_tithi,
//           icon: "mdi:calendar-month",
//         },
//         {
//           label: "Tithi Lord",
//           value: metrics.moon_tithi_lord,
//           icon: "mdi:shield-crown",
//         },
//         { label: "Yoga", value: metrics.moon_yoga, icon: "mdi:yoga" },
//         {
//           label: "Karana",
//           value: metrics.moon_karana,
//           icon: "mdi:clock-outline",
//         },
//       ],
//     },
//     {
//       category: "Lunar Data",
//       items: [
//         {
//           label: "Moon Age",
//           value: `${metrics.moon_age} days`,
//           icon: "mdi:calendar-today",
//         },
//         {
//           label: "Illumination",
//           value: `${metrics.moon_illumination}%`,
//           icon: "mdi:brightness-percent",
//         },
//         {
//           label: "Distance",
//           value: `${metrics.moon_distance?.toLocaleString() || "N/A"} km`,
//           icon: "mdi:map-marker-distance",
//         },
//         {
//           label: "Lunar Day",
//           value: metrics.lunar_day.toString(),
//           icon: "mdi:calendar-star",
//         },
//         {
//           label: "Lunar Month",
//           value: metrics.lunar_month,
//           icon: "mdi:calendar-month",
//         },
//         {
//           label: "Direction",
//           value: metrics.is_waxing ? "Waxing" : "Waning",
//           icon: metrics.is_waxing
//             ? "mdi:arrow-up-circle"
//             : "mdi:arrow-down-circle",
//         },
//       ],
//     },
//     {
//       category: "Timings",
//       items: [
//         {
//           label: "Moon Rise",
//           value: metrics.moon_rise,
//           icon: "mdi:weather-sunset-up",
//         },
//         {
//           label: "Moon Set",
//           value: metrics.moon_set,
//           icon: "mdi:weather-sunset-down",
//         },
//         {
//           label: "Next Full Moon",
//           value: metrics.next_full_moon,
//           icon: "mdi:moon-full",
//         },
//         {
//           label: "Next New Moon",
//           value: metrics.next_new_moon,
//           icon: "mdi:moon-new",
//         },
//       ],
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {metricsData.map((category) => (
//         <div key={category.category}>
//           <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//             <Iconify
//               icon="mdi:chart-box"
//               width={18}
//               className="text-indigo-600"
//             />
//             {category.category}
//           </h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {category.items.map((item) => (
//               <div
//                 key={item.label}
//                 className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
//               >
//                 <div className="flex items-center gap-2 mb-1">
//                   <Iconify
//                     icon={item.icon}
//                     width={16}
//                     className="text-indigo-500"
//                   />
//                   <span className="text-xs text-gray-500">{item.label}</span>
//                 </div>
//                 <p
//                   className="font-semibold text-gray-800 truncate"
//                   title={item.value}
//                 >
//                   {item.value}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}

//       {/* Moon Phase Cycle Visual */}
//       <div className="border border-gray-200 rounded-lg p-5">
//         <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//           <Iconify
//             icon="mdi:moon-full"
//             width={18}
//             className="text-indigo-600"
//           />
//           Moon Phase Cycle
//         </h3>
//         <div className="flex justify-between items-center overflow-x-auto pb-2">
//           {Object.entries(MOON_PHASE_ICONS).map(([phase, icon]) => {
//             const isActive = metrics.moon_phase === phase;
//             return (
//               <div
//                 key={phase}
//                 className={`flex flex-col items-center min-w-[80px] p-2 rounded-lg transition-colors ${
//                   isActive ? "bg-indigo-100" : "hover:bg-gray-50"
//                 }`}
//               >
//                 <div
//                   className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
//                     isActive
//                       ? "bg-indigo-600 text-white"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   <Iconify icon={icon} width={28} />
//                 </div>
//                 <p
//                   className={`text-xs text-center font-medium ${
//                     isActive ? "text-indigo-600" : "text-gray-600"
//                   }`}
//                 >
//                   {phase}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Illumination Progress */}
//       <div className="border border-gray-200 rounded-lg p-5">
//         <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//           <Iconify
//             icon="mdi:brightness-percent"
//             width={18}
//             className="text-amber-500"
//           />
//           Moon Illumination
//         </h3>
//         <div className="relative pt-1">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-xs text-gray-500">New Moon (0%)</span>
//             <span className="text-xs font-semibold text-indigo-600">
//               {metrics.moon_illumination}%
//             </span>
//             <span className="text-xs text-gray-500">Full Moon (100%)</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
//             <div
//               className="h-full rounded-full bg-gradient-to-r from-gray-600 via-indigo-500 to-amber-400 transition-all duration-500"
//               style={{ width: `${metrics.moon_illumination}%` }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function GuidanceTab({ report }: { report: MoonPhaseReport }) {
//   const guidanceItems = [
//     {
//       title: "Spiritual Guidance",
//       content: report.spiritual_guidance,
//       icon: "mdi:meditation",
//       color: "#8B5CF6",
//       bgColor: "from-purple-50 to-indigo-50",
//       borderColor: "border-purple-100",
//     },
//     {
//       title: "Relationship Advice",
//       content: report.relationship_advice,
//       icon: "mdi:heart-multiple",
//       color: "#EC4899",
//       bgColor: "from-pink-50 to-rose-50",
//       borderColor: "border-pink-100",
//     },
//     {
//       title: "Career Guidance",
//       content: report.career_guidance,
//       icon: "mdi:briefcase",
//       color: "#3B82F6",
//       bgColor: "from-blue-50 to-cyan-50",
//       borderColor: "border-blue-100",
//     },
//     {
//       title: "Health Tips",
//       content: report.health_tips,
//       icon: "mdi:heart-pulse",
//       color: "#22C55E",
//       bgColor: "from-green-50 to-emerald-50",
//       borderColor: "border-green-100",
//     },
//   ];

//   return (
//     <div className="space-y-4">
//       {guidanceItems.map((item) => (
//         <div
//           key={item.title}
//           className={`bg-gradient-to-br ${item.bgColor} border ${item.borderColor} rounded-lg p-5`}
//         >
//           <div className="flex items-start gap-4">
//             <div
//               className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
//               style={{ backgroundColor: `${item.color}20` }}
//             >
//               <Iconify
//                 icon={item.icon}
//                 width={24}
//                 style={{ color: item.color }}
//               />
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
//               <p className="text-gray-600 leading-relaxed">{item.content}</p>
//             </div>
//           </div>
//         </div>
//       ))}

//       {/* Lucky Elements */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//         <div className="border border-gray-200 rounded-lg p-4 text-center">
//           <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
//             <Iconify
//               icon="mdi:palette"
//               width={24}
//               className="text-purple-600"
//             />
//           </div>
//           <p className="text-xs text-gray-500 uppercase mb-1">Lucky Color</p>
//           <p className="font-semibold text-gray-800">{report.lucky_color}</p>
//         </div>
//         <div className="border border-gray-200 rounded-lg p-4 text-center">
//           <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
//             <Iconify icon="mdi:numeric" width={24} className="text-green-600" />
//           </div>
//           <p className="text-xs text-gray-500 uppercase mb-1">Lucky Number</p>
//           <p className="font-semibold text-gray-800">{report.lucky_number}</p>
//         </div>
//         <div className="border border-gray-200 rounded-lg p-4 text-center">
//           <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
//             <Iconify icon="mdi:fire" width={24} className="text-orange-600" />
//           </div>
//           <p className="text-xs text-gray-500 uppercase mb-1">Element</p>
//           <p className="font-semibold text-gray-800">{report.element}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActivitiesTab({ report }: { report: MoonPhaseReport }) {
//   return (
//     <div className="space-y-6">
//       {/* Best Activities */}
//       <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-lg p-5">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
//             <Iconify
//               icon="mdi:check-circle"
//               width={22}
//               className="text-green-600"
//             />
//           </div>
//           <h3 className="font-semibold text-gray-800">Best Activities</h3>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {report.best_activities?.map((activity, idx) => (
//             <div
//               key={idx}
//               className="flex items-center gap-3 bg-white/70 rounded-lg p-3 border border-green-100"
//             >
//               <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
//                 <Iconify
//                   icon="mdi:thumb-up"
//                   width={16}
//                   className="text-green-600"
//                 />
//               </div>
//               <p className="text-sm text-gray-700">{activity}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Activities to Avoid */}
//       <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-lg p-5">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
//             <Iconify
//               icon="mdi:close-circle"
//               width={22}
//               className="text-red-600"
//             />
//           </div>
//           <h3 className="font-semibold text-gray-800">Activities to Avoid</h3>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {report.avoid_activities?.map((activity, idx) => (
//             <div
//               key={idx}
//               className="flex items-center gap-3 bg-white/70 rounded-lg p-3 border border-red-100"
//             >
//               <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
//                 <Iconify
//                   icon="mdi:thumb-down"
//                   width={16}
//                   className="text-red-600"
//                 />
//               </div>
//               <p className="text-sm text-gray-700">{activity}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Moon Phase Energy Guide */}
//       <div className="border border-gray-200 rounded-lg p-5">
//         <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
//           <Iconify
//             icon="mdi:information"
//             width={18}
//             className="text-indigo-600"
//           />
//           Understanding {report.moon_phase} Energy
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <EnergyCard
//             label="Energy Level"
//             value={getMoonPhaseEnergy(report.moon_phase)}
//             icon="mdi:lightning-bolt"
//             color="#F59E0B"
//           />
//           <EnergyCard
//             label="Manifestation"
//             value={getManifestationPower(report.moon_phase)}
//             icon="mdi:star-shooting"
//             color="#8B5CF6"
//           />
//           <EnergyCard
//             label="Introspection"
//             value={getIntrospectionLevel(report.moon_phase)}
//             icon="mdi:brain"
//             color="#3B82F6"
//           />
//           <EnergyCard
//             label="Action"
//             value={getActionLevel(report.moon_phase)}
//             icon="mdi:run-fast"
//             color="#22C55E"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============ HELPER COMPONENTS ============

// function InfoCard({
//   label,
//   value,
//   icon,
//   color,
// }: {
//   label: string;
//   value: string;
//   icon: string;
//   color: string;
// }) {
//   return (
//     <div className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-sm transition-shadow">
//       <div
//         className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
//         style={{ backgroundColor: `${color}15` }}
//       >
//         <Iconify icon={icon} width={20} style={{ color }} />
//       </div>
//       <p className="text-xs text-gray-500 mb-1">{label}</p>
//       <p className="font-semibold text-gray-800">{value}</p>
//     </div>
//   );
// }

// function EnergyCard({
//   label,
//   value,
//   icon,
//   color,
// }: {
//   label: string;
//   value: "Low" | "Medium" | "High";
//   icon: string;
//   color: string;
// }) {
//   const levels = { Low: 1, Medium: 2, High: 3 };
//   const level = levels[value] || 1;

//   return (
//     <div className="text-center">
//       <div
//         className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
//         style={{ backgroundColor: `${color}15` }}
//       >
//         <Iconify icon={icon} width={24} style={{ color }} />
//       </div>
//       <p className="text-xs text-gray-500 mb-2">{label}</p>
//       <div className="flex justify-center gap-1">
//         {[1, 2, 3].map((i) => (
//           <div
//             key={i}
//             className={`w-3 h-3 rounded-full ${
//               i <= level ? "bg-current" : "bg-gray-200"
//             }`}
//             style={{ color: i <= level ? color : undefined }}
//           />
//         ))}
//       </div>
//       <p className="text-xs font-medium text-gray-600 mt-1">{value}</p>
//     </div>
//   );
// }

// // ============ HELPER FUNCTIONS ============

// function getMoonPhaseEnergy(phase: string): "Low" | "Medium" | "High" {
//   const highEnergy = ["Full Moon", "First Quarter", "Waxing Gibbous"];
//   const lowEnergy = ["New Moon", "Waning Crescent", "Last Quarter"];
//   if (highEnergy.includes(phase)) return "High";
//   if (lowEnergy.includes(phase)) return "Low";
//   return "Medium";
// }

// function getManifestationPower(phase: string): "Low" | "Medium" | "High" {
//   const high = ["New Moon", "Waxing Crescent", "First Quarter"];
//   const low = ["Waning Gibbous", "Last Quarter", "Waning Crescent"];
//   if (high.includes(phase)) return "High";
//   if (low.includes(phase)) return "Low";
//   return "Medium";
// }

// function getIntrospectionLevel(phase: string): "Low" | "Medium" | "High" {
//   const high = ["New Moon", "Waning Crescent", "Last Quarter"];
//   const low = ["Full Moon", "Waxing Gibbous"];
//   if (high.includes(phase)) return "High";
//   if (low.includes(phase)) return "Low";
//   return "Medium";
// }

// function getActionLevel(phase: string): "Low" | "Medium" | "High" {
//   const high = ["Full Moon", "First Quarter", "Waxing Gibbous"];
//   const low = ["New Moon", "Waning Crescent"];
//   if (high.includes(phase)) return "High";
//   if (low.includes(phase)) return "Low";
//   return "Medium";
// }

// export default MoonPhasesPage;

"use client";

import React, { useState } from "react";
import Iconify from "@/components/Iconify";
import PersonSelector from "@/components/PersonSelector";
import PageHeader from "@/components/PageHeader";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";
import Button from "@/components/ui/Button";

// ============ CONSTANTS ============

const HOUSE_TYPES = [
  { value: "placidus", label: "Placidus" },
  { value: "koch", label: "Koch" },
  { value: "topocentric", label: "Topocentric" },
  { value: "poryphry", label: "Porphyry" },
  { value: "equal_house", label: "Equal House" },
  { value: "whole_sign", label: "Whole Sign" },
] as const;

type HouseType = (typeof HOUSE_TYPES)[number]["value"];

const MOON_PHASE_ICONS: Record<string, string> = {
  "New Moon": "mdi:moon-new",
  "Waxing Crescent": "mdi:moon-waxing-crescent",
  "First Quarter": "mdi:moon-first-quarter",
  "Waxing Gibbous": "mdi:moon-waxing-gibbous",
  "Full Moon": "mdi:moon-full",
  "Waning Gibbous": "mdi:moon-waning-gibbous",
  "Last Quarter": "mdi:moon-last-quarter",
  "Third Quarter": "mdi:moon-last-quarter",
  "Waning Crescent": "mdi:moon-waning-crescent",
};

const MOON_PHASE_COLORS: Record<string, string> = {
  "New Moon": "#1F2937",
  "Waxing Crescent": "#6366F1",
  "First Quarter": "#8B5CF6",
  "Waxing Gibbous": "#A78BFA",
  "Full Moon": "#F59E0B",
  "Waning Gibbous": "#F97316",
  "Last Quarter": "#EF4444",
  "Third Quarter": "#EF4444",
  "Waning Crescent": "#DC2626",
};

const SIGN_ICONS: Record<string, string> = {
  Aries: "mdi:zodiac-aries",
  Taurus: "mdi:zodiac-taurus",
  Gemini: "mdi:zodiac-gemini",
  Cancer: "mdi:zodiac-cancer",
  Leo: "mdi:zodiac-leo",
  Virgo: "mdi:zodiac-virgo",
  Libra: "mdi:zodiac-libra",
  Scorpio: "mdi:zodiac-scorpio",
  Sagittarius: "mdi:zodiac-sagittarius",
  Capricorn: "mdi:zodiac-capricorn",
  Aquarius: "mdi:zodiac-aquarius",
  Pisces: "mdi:zodiac-pisces",
};

const SIGN_COLORS: Record<string, string> = {
  Aries: "#EF4444",
  Taurus: "#22C55E",
  Gemini: "#F59E0B",
  Cancer: "#6B7280",
  Leo: "#F97316",
  Virgo: "#84CC16",
  Libra: "#EC4899",
  Scorpio: "#DC2626",
  Sagittarius: "#8B5CF6",
  Capricorn: "#6366F1",
  Aquarius: "#06B6D4",
  Pisces: "#3B82F6",
};

// ============ INTERFACES (Matched to actual API response) ============

interface LunarMetrics {
  month: string;
  within_perigee_range: boolean;
  distance: string;
  within_apogee_range: boolean;
  apogee_distance: string;
  moon_sign: string;
  moon_phase: string;
  moon_phase_id: number;
  moon_age_in_days: number;
  moon_day: number;
  moon_illumination: number;
}

interface MoonPhaseReport {
  considered_date: string;
  moon_phase: string;
  significance: string;
  report: string;
}

interface MoonPhasesResponse {
  status: string;
  message?: string;
  data: {
    birth_data: Record<string, unknown>;
    house_type: string;
    lunarMetrics: LunarMetrics;
    moonPhaseReport: MoonPhaseReport;
  };
}

// ============ HELPER FUNCTIONS ============

function getMoonPhaseEnergy(phase: string): "Low" | "Medium" | "High" {
  const highEnergy = ["Full Moon", "First Quarter", "Waxing Gibbous"];
  const lowEnergy = ["New Moon", "Waning Crescent", "Last Quarter"];
  if (highEnergy.includes(phase)) return "High";
  if (lowEnergy.includes(phase)) return "Low";
  return "Medium";
}

function getManifestationPower(phase: string): "Low" | "Medium" | "High" {
  const high = ["New Moon", "Waxing Crescent", "First Quarter"];
  const low = ["Waning Gibbous", "Last Quarter", "Waning Crescent"];
  if (high.includes(phase)) return "High";
  if (low.includes(phase)) return "Low";
  return "Medium";
}

function getIntrospectionLevel(phase: string): "Low" | "Medium" | "High" {
  const high = ["New Moon", "Waning Crescent", "Last Quarter"];
  const low = ["Full Moon", "Waxing Gibbous"];
  if (high.includes(phase)) return "High";
  if (low.includes(phase)) return "Low";
  return "Medium";
}

function getActionLevel(phase: string): "Low" | "Medium" | "High" {
  const high = ["Full Moon", "First Quarter", "Waxing Gibbous"];
  const low = ["New Moon", "Waning Crescent"];
  if (high.includes(phase)) return "High";
  if (low.includes(phase)) return "Low";
  return "Medium";
}

function isWaxingPhase(phase: string): boolean {
  return [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
  ].includes(phase);
}

function formatMoonAge(ageInDays: number): string {
  const days = Math.floor(ageInDays);
  const hours = Math.floor((ageInDays - days) * 24);
  return `${days}d ${hours}h`;
}

// ============ MAIN COMPONENT ============

function MoonPhasesPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [houseType, setHouseType] = useState<HouseType>("placidus");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MoonPhasesResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire({
        icon: "warning",
        title: "Select Person",
        text: "Please select a person to generate moon phase report.",
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
        house_type: houseType,
      };

      const response = await fetch("/api/lunar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.status === "Pass") {
        setResult(data);
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (error: unknown) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "mdi:moon-full" },
    { id: "metrics", label: "Lunar Metrics", icon: "mdi:chart-arc" },
    { id: "report", label: "Moon Report", icon: "mdi:file-document" },
  ];

  return (
    <div className="container mx-auto pb-12">
      <PageHeader
        title="Moon Phases Report"
        description="Discover your lunar influences and moon phase guidance"
        imageSrc="/images/moon-phases-banner.jpg"
      />

      {/* Input Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Person Selector */}
          <div>
            <PersonSelector onPersonSelected={setSelectedPerson} />
          </div>

          {/* House Type Selector */}
          <div>
            <label
              htmlFor="house-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <div className="flex items-center gap-2">
                <Iconify
                  icon="mdi:home-variant"
                  width={16}
                  className="text-gray-500"
                />
                House System
              </div>
            </label>
            <div className="relative">
              <select
                id="house-type"
                value={houseType}
                onChange={(e) => setHouseType(e.target.value as HouseType)}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {HOUSE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Iconify
                  icon="mdi:chevron-down"
                  width={20}
                  className="text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div>
            <Button
              handleCalculate={handleCalculate}
              selectedPerson={selectedPerson}
              isCalculating={loading}
            />
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
            <div className="flex items-center gap-2">
              <Iconify
                icon="mdi:home-variant"
                className="text-gray-400"
                width={16}
              />
              <span className="text-gray-600">House System:</span>
              <span className="font-medium capitalize">
                {HOUSE_TYPES.find((t) => t.value === houseType)?.label ||
                  houseType}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && result.data && (
        <div className="mt-6 space-y-6">
          {/* House Type Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-sm text-indigo-700">
              <Iconify icon="mdi:home-variant" width={16} />
              House System:{" "}
              <span className="font-semibold capitalize">
                {result.data.house_type || houseType}
              </span>
            </span>
          </div>

          {/* Moon Phase Hero Card */}
          <MoonPhaseHeroCard
            metrics={result.data.lunarMetrics}
            report={result.data.moonPhaseReport}
          />

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Iconify icon={tab.icon} width={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === "overview" && (
                <OverviewTab
                  metrics={result.data.lunarMetrics}
                  report={result.data.moonPhaseReport}
                />
              )}
              {activeTab === "metrics" && (
                <MetricsTab metrics={result.data.lunarMetrics} />
              )}
              {activeTab === "report" && (
                <ReportTab report={result.data.moonPhaseReport} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="mt-6 bg-white rounded-lg border-2 border-dashed border-gray-200 p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Iconify
              icon="mdi:moon-waning-crescent"
              width={40}
              className="text-indigo-300"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Discover Your Lunar Influence
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Select a profile, choose a house system, and click calculate to
            reveal your moon phase, lunar metrics, and personalized guidance
            based on the moon&apos;s position at your birth.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Iconify
              icon="mdi:loading"
              width={32}
              className="text-indigo-500 animate-spin"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            Calculating Moon Phases...
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we analyze your lunar influences using the{" "}
            <span className="font-medium capitalize">
              {HOUSE_TYPES.find((t) => t.value === houseType)?.label ||
                houseType}
            </span>{" "}
            house system.
          </p>
        </div>
      )}
    </div>
  );
}

// ============ HERO COMPONENT ============

function MoonPhaseHeroCard({
  metrics,
  report,
}: {
  metrics: LunarMetrics;
  report: MoonPhaseReport;
}) {
  const phaseColor = MOON_PHASE_COLORS[metrics.moon_phase] || "#6B7280";
  const waxing = isWaxingPhase(metrics.moon_phase);

  return (
    <div
      className="rounded-xl p-6 text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${phaseColor} 0%, #1F2937 100%)`,
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10">
          <Iconify
            icon={MOON_PHASE_ICONS[metrics.moon_phase] || "mdi:moon-full"}
            width={200}
          />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          {/* Left Side - Moon Phase Info */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Iconify
                icon={MOON_PHASE_ICONS[metrics.moon_phase] || "mdi:moon-full"}
                width={60}
              />
            </div>
            <div>
              <p className="text-sm opacity-80 mb-1">Moon Phase</p>
              <h2 className="text-3xl font-bold mb-2">{metrics.moon_phase}</h2>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <Iconify
                    icon={SIGN_ICONS[metrics.moon_sign] || "mdi:zodiac-cancer"}
                    width={18}
                  />
                  <span className="font-medium">{metrics.moon_sign}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <Iconify icon="mdi:calendar" width={18} />
                  <span className="font-medium">{metrics.month}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
              <Iconify
                icon="mdi:brightness-percent"
                width={24}
                className="mx-auto mb-1"
              />
              <p className="text-2xl font-bold">{metrics.moon_illumination}%</p>
              <p className="text-xs opacity-80">Illumination</p>
            </div>
            <div className="text-center bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
              <Iconify
                icon="mdi:calendar-today"
                width={24}
                className="mx-auto mb-1"
              />
              <p className="text-2xl font-bold">
                {formatMoonAge(metrics.moon_age_in_days)}
              </p>
              <p className="text-xs opacity-80">Moon Age</p>
            </div>
            <div className="text-center bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
              <Iconify
                icon="mdi:calendar-star"
                width={24}
                className="mx-auto mb-1"
              />
              <p className="text-2xl font-bold">{metrics.moon_day}</p>
              <p className="text-xs opacity-80">Lunar Day</p>
            </div>
            <div className="text-center bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm">
              <Iconify
                icon={waxing ? "mdi:arrow-up" : "mdi:arrow-down"}
                width={24}
                className="mx-auto mb-1"
              />
              <p className="text-lg font-bold">
                {waxing ? "Waxing" : "Waning"}
              </p>
              <p className="text-xs opacity-80">Phase Direction</p>
            </div>
          </div>
        </div>

        {/* Report Date Badge */}
        {report.considered_date && (
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                <Iconify icon="mdi:calendar-clock" width={16} />
                Report Date: {report.considered_date}
              </span>
              <span className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                <Iconify icon="mdi:moon-new" width={16} />
                Report Phase: {report.moon_phase}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ TAB COMPONENTS ============

function OverviewTab({
  metrics,
  report,
}: {
  metrics: LunarMetrics;
  report: MoonPhaseReport;
}) {
  const waxing = isWaxingPhase(metrics.moon_phase);

  return (
    <div className="space-y-6">
      {/* Significance */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <Iconify
              icon="mdi:book-open-variant"
              width={24}
              className="text-indigo-600"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Moon Phase Significance
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {report.significance}
            </p>
          </div>
        </div>
      </div>

      {/* Personalized Report */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-lg p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
            <Iconify
              icon="mdi:star-four-points"
              width={24}
              className="text-pink-600"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Your Personalized Report
            </h3>
            <p className="text-gray-600 leading-relaxed">{report.report}</p>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard
          label="Moon Sign"
          value={metrics.moon_sign}
          icon={SIGN_ICONS[metrics.moon_sign] || "mdi:zodiac-cancer"}
          color={SIGN_COLORS[metrics.moon_sign] || "#6B7280"}
        />
        <InfoCard
          label="Moon Phase"
          value={metrics.moon_phase}
          icon={MOON_PHASE_ICONS[metrics.moon_phase] || "mdi:moon-full"}
          color={MOON_PHASE_COLORS[metrics.moon_phase] || "#6B7280"}
        />
        <InfoCard
          label="Illumination"
          value={`${metrics.moon_illumination}%`}
          icon="mdi:brightness-percent"
          color="#F59E0B"
        />
        <InfoCard
          label="Direction"
          value={waxing ? "Waxing" : "Waning"}
          icon={waxing ? "mdi:arrow-up-circle" : "mdi:arrow-down-circle"}
          color={waxing ? "#22C55E" : "#EF4444"}
        />
      </div>

      {/* Distance Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                metrics.within_perigee_range ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Iconify
                icon="mdi:arrow-collapse"
                width={22}
                className={
                  metrics.within_perigee_range
                    ? "text-green-600"
                    : "text-gray-500"
                }
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Perigee Range</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-800">
                  {metrics.distance !== "--"
                    ? metrics.distance
                    : "Not Available"}
                </p>
                {metrics.within_perigee_range && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    In Range
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                metrics.within_apogee_range ? "bg-amber-100" : "bg-gray-100"
              }`}
            >
              <Iconify
                icon="mdi:arrow-expand"
                width={22}
                className={
                  metrics.within_apogee_range
                    ? "text-amber-600"
                    : "text-gray-500"
                }
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Apogee Range</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-800">
                  {metrics.apogee_distance !== "__"
                    ? metrics.apogee_distance
                    : "Not Available"}
                </p>
                {metrics.within_apogee_range && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                    In Range
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Moon Phase Energy Guide */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Iconify
            icon="mdi:lightning-bolt"
            width={18}
            className="text-amber-500"
          />
          Moon Phase Energy
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EnergyCard
            label="Energy Level"
            value={getMoonPhaseEnergy(metrics.moon_phase)}
            icon="mdi:lightning-bolt"
            color="#F59E0B"
          />
          <EnergyCard
            label="Manifestation"
            value={getManifestationPower(metrics.moon_phase)}
            icon="mdi:star-shooting"
            color="#8B5CF6"
          />
          <EnergyCard
            label="Introspection"
            value={getIntrospectionLevel(metrics.moon_phase)}
            icon="mdi:brain"
            color="#3B82F6"
          />
          <EnergyCard
            label="Action"
            value={getActionLevel(metrics.moon_phase)}
            icon="mdi:run-fast"
            color="#22C55E"
          />
        </div>
      </div>
    </div>
  );
}

function MetricsTab({ metrics }: { metrics: LunarMetrics }) {
  const waxing = isWaxingPhase(metrics.moon_phase);

  const metricsData = [
    {
      category: "Moon Position",
      icon: "mdi:moon-full",
      items: [
        {
          label: "Moon Sign",
          value: metrics.moon_sign,
          icon: SIGN_ICONS[metrics.moon_sign] || "mdi:zodiac-cancer",
        },
        {
          label: "Moon Phase",
          value: metrics.moon_phase,
          icon: MOON_PHASE_ICONS[metrics.moon_phase] || "mdi:moon-full",
        },
        {
          label: "Phase ID",
          value: metrics.moon_phase_id.toString(),
          icon: "mdi:numeric",
        },
        {
          label: "Direction",
          value: waxing ? "Waxing" : "Waning",
          icon: waxing ? "mdi:arrow-up-circle" : "mdi:arrow-down-circle",
        },
      ],
    },
    {
      category: "Lunar Timing",
      icon: "mdi:clock-outline",
      items: [
        {
          label: "Birth Date",
          value: metrics.month,
          icon: "mdi:calendar",
        },
        {
          label: "Moon Age",
          value: formatMoonAge(metrics.moon_age_in_days),
          icon: "mdi:calendar-today",
        },
        {
          label: "Moon Day",
          value: metrics.moon_day.toString(),
          icon: "mdi:calendar-star",
        },
        {
          label: "Illumination",
          value: `${metrics.moon_illumination}%`,
          icon: "mdi:brightness-percent",
        },
      ],
    },
    {
      category: "Distance & Range",
      icon: "mdi:map-marker-distance",
      items: [
        {
          label: "Perigee Distance",
          value: metrics.distance !== "--" ? metrics.distance : "Not Available",
          icon: "mdi:arrow-collapse",
        },
        {
          label: "Within Perigee",
          value: metrics.within_perigee_range ? "Yes" : "No",
          icon: metrics.within_perigee_range
            ? "mdi:check-circle"
            : "mdi:close-circle",
        },
        {
          label: "Apogee Distance",
          value:
            metrics.apogee_distance !== "__"
              ? metrics.apogee_distance
              : "Not Available",
          icon: "mdi:arrow-expand",
        },
        {
          label: "Within Apogee",
          value: metrics.within_apogee_range ? "Yes" : "No",
          icon: metrics.within_apogee_range
            ? "mdi:check-circle"
            : "mdi:close-circle",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {metricsData.map((category) => (
        <div key={category.category}>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Iconify
              icon={category.icon}
              width={18}
              className="text-indigo-600"
            />
            {category.category}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {category.items.map((item) => (
              <div
                key={item.label}
                className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Iconify
                    icon={item.icon}
                    width={16}
                    className="text-indigo-500"
                  />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
                <p
                  className="font-semibold text-gray-800 truncate"
                  title={item.value}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Moon Phase Cycle Visual */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Iconify
            icon="mdi:moon-full"
            width={18}
            className="text-indigo-600"
          />
          Moon Phase Cycle
        </h3>
        <div className="flex justify-between items-center overflow-x-auto pb-2">
          {Object.entries(MOON_PHASE_ICONS).map(([phase, icon]) => {
            const isActive = metrics.moon_phase === phase;
            return (
              <div
                key={phase}
                className={`flex flex-col items-center min-w-[80px] p-2 rounded-lg transition-colors ${
                  isActive ? "bg-indigo-100" : "hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Iconify icon={icon} width={28} />
                </div>
                <p
                  className={`text-xs text-center font-medium ${
                    isActive ? "text-indigo-600" : "text-gray-600"
                  }`}
                >
                  {phase}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Illumination Progress */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Iconify
            icon="mdi:brightness-percent"
            width={18}
            className="text-amber-500"
          />
          Moon Illumination
        </h3>
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">New Moon (0%)</span>
            <span className="text-xs font-semibold text-indigo-600">
              {metrics.moon_illumination}%
            </span>
            <span className="text-xs text-gray-500">Full Moon (100%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gray-600 via-indigo-500 to-amber-400 transition-all duration-500"
              style={{
                width: `${metrics.moon_illumination}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Moon Age Progress */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Iconify
            icon="mdi:timer-sand"
            width={18}
            className="text-indigo-500"
          />
          Moon Age in Lunar Cycle
        </h3>
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">New Moon (0 days)</span>
            <span className="text-xs font-semibold text-indigo-600">
              {formatMoonAge(metrics.moon_age_in_days)}
            </span>
            <span className="text-xs text-gray-500">
              Full Cycle (~29.5 days)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 transition-all duration-500"
              style={{
                width: `${Math.min(
                  (metrics.moon_age_in_days / 29.53) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportTab({ report }: { report: MoonPhaseReport }) {
  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Iconify
            icon={MOON_PHASE_ICONS[report.moon_phase] || "mdi:moon-full"}
            width={28}
            className="text-indigo-600"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            {report.moon_phase} Report
          </h3>
          <p className="text-sm text-gray-500">
            Considered Date: {report.considered_date}
          </p>
        </div>
      </div>

      {/* Significance Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <Iconify
              icon="mdi:lightbulb"
              width={24}
              className="text-indigo-600"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Phase Significance
            </h3>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              {report.significance}
            </p>
          </div>
        </div>
      </div>

      {/* Personalized Report */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Iconify
              icon="mdi:account-star"
              width={24}
              className="text-purple-600"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Your Personalized Guidance
            </h3>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              {report.report}
            </p>
          </div>
        </div>
      </div>

      {/* Phase Energy */}
      <div className="border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Iconify
            icon="mdi:lightning-bolt"
            width={18}
            className="text-amber-500"
          />
          {report.moon_phase} Energy Levels
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EnergyCard
            label="Energy Level"
            value={getMoonPhaseEnergy(report.moon_phase)}
            icon="mdi:lightning-bolt"
            color="#F59E0B"
          />
          <EnergyCard
            label="Manifestation"
            value={getManifestationPower(report.moon_phase)}
            icon="mdi:star-shooting"
            color="#8B5CF6"
          />
          <EnergyCard
            label="Introspection"
            value={getIntrospectionLevel(report.moon_phase)}
            icon="mdi:brain"
            color="#3B82F6"
          />
          <EnergyCard
            label="Action"
            value={getActionLevel(report.moon_phase)}
            icon="mdi:run-fast"
            color="#22C55E"
          />
        </div>
      </div>

      {/* Phase Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Iconify
                icon="mdi:check-circle"
                width={22}
                className="text-green-600"
              />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Best For</h3>
          </div>
          <ul className="space-y-2">
            {getPhaseBestActivities(report.moon_phase).map((activity, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <Iconify
                  icon="mdi:check"
                  width={16}
                  className="text-green-500 flex-shrink-0"
                />
                {activity}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Iconify
                icon="mdi:close-circle"
                width={22}
                className="text-red-600"
              />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Avoid</h3>
          </div>
          <ul className="space-y-2">
            {getPhaseAvoidActivities(report.moon_phase).map((activity, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <Iconify
                  icon="mdi:close"
                  width={16}
                  className="text-red-500 flex-shrink-0"
                />
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============ HELPER COMPONENTS ============

function InfoCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-sm transition-shadow">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Iconify icon={icon} width={20} style={{ color }} />
      </div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function EnergyCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: "Low" | "Medium" | "High";
  icon: string;
  color: string;
}) {
  const levels = { Low: 1, Medium: 2, High: 3 };
  const level = levels[value] || 1;

  return (
    <div className="text-center">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Iconify icon={icon} width={24} style={{ color }} />
      </div>
      <p className="text-xs text-gray-500 mb-2">{label}</p>
      <div className="flex justify-center gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i <= level ? "bg-current" : "bg-gray-200"
            }`}
            style={{ color: i <= level ? color : undefined }}
          />
        ))}
      </div>
      <p className="text-xs font-medium text-gray-600 mt-1">{value}</p>
    </div>
  );
}

// ============ PHASE-BASED ACTIVITY HELPERS ============

function getPhaseBestActivities(phase: string): string[] {
  const activities: Record<string, string[]> = {
    "New Moon": [
      "Setting intentions & goals",
      "Starting new projects",
      "Meditation & reflection",
      "Journaling & planning",
    ],
    "Waxing Crescent": [
      "Taking initial steps",
      "Building momentum",
      "Networking & connecting",
      "Learning new skills",
    ],
    "First Quarter": [
      "Taking decisive action",
      "Overcoming challenges",
      "Making commitments",
      "Problem-solving",
    ],
    "Waxing Gibbous": [
      "Refining & adjusting plans",
      "Patience & persistence",
      "Reviewing progress",
      "Fine-tuning details",
    ],
    "Full Moon": [
      "Celebrating achievements",
      "Social gatherings",
      "Expressing creativity",
      "Releasing what no longer serves",
    ],
    "Waning Gibbous": [
      "Sharing knowledge",
      "Gratitude practices",
      "Teaching others",
      "Reflecting on lessons",
    ],
    "Last Quarter": [
      "Letting go of old habits",
      "Forgiveness practices",
      "Decluttering & organizing",
      "Tying up loose ends",
    ],
    "Third Quarter": [
      "Letting go of old habits",
      "Forgiveness practices",
      "Decluttering & organizing",
      "Tying up loose ends",
    ],
    "Waning Crescent": [
      "Rest & recuperation",
      "Spiritual practices",
      "Surrender & trust",
      "Preparing for new cycle",
    ],
  };
  return activities[phase] || activities["New Moon"];
}

function getPhaseAvoidActivities(phase: string): string[] {
  const activities: Record<string, string[]> = {
    "New Moon": [
      "Launching major projects publicly",
      "Making hasty decisions",
      "Overexerting yourself",
      "Ignoring your intuition",
    ],
    "Waxing Crescent": [
      "Giving up too quickly",
      "Overcommitting",
      "Comparing to others",
      "Neglecting self-care",
    ],
    "First Quarter": [
      "Avoiding confrontation",
      "Procrastination",
      "Being too rigid",
      "Ignoring obstacles",
    ],
    "Waxing Gibbous": [
      "Starting new ventures",
      "Drastic changes",
      "Being impatient",
      "Overlooking details",
    ],
    "Full Moon": [
      "Making impulsive decisions",
      "Emotional confrontations",
      "Starting new projects",
      "Overindulging",
    ],
    "Waning Gibbous": [
      "Holding onto grudges",
      "Starting new ventures",
      "Being critical of others",
      "Resisting change",
    ],
    "Last Quarter": [
      "Beginning new projects",
      "Making major purchases",
      "Forcing outcomes",
      "Clinging to the past",
    ],
    "Third Quarter": [
      "Beginning new projects",
      "Making major purchases",
      "Forcing outcomes",
      "Clinging to the past",
    ],
    "Waning Crescent": [
      "Pushing too hard",
      "Making big commitments",
      "Ignoring need for rest",
      "Planning aggressively",
    ],
  };
  return activities[phase] || activities["New Moon"];
}

export default MoonPhasesPage;
