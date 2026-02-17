// "use client";

// import { useState, useMemo } from "react";
// import PageHeader from "@/components/PageHeader";
// import PersonSelector from "@/components/PersonSelector";
// import Iconify from "@/components/Iconify";
// import { Person } from "@/lib/models";
// import Swal from "sweetalert2";

// // ============ Types ============

// interface CharDashaPeriod {
//   sign: string;
//   sign_id: number;
//   sign_lord?: string;
//   duration: number;
//   start_date: string;
//   end_date: string;
//   start_ms?: number;
//   end_ms?: number;
// }

// interface SubCharDashaPeriod {
//   sign: string;
//   sign_id: number;
//   start_date: string;
//   end_date: string;
//   duration?: number;
// }

// interface CurrentCharDasha {
//   major_dasha: CharDashaPeriod;
//   sub_dasha: CharDashaPeriod;
//   sub_sub_dasha?: CharDashaPeriod;
// }

// interface CharDashaData {
//   major_chardasha: CharDashaPeriod[] | null;
//   current_chardasha: CurrentCharDasha | null;
//   sub_chardasha_details: Record<
//     string,
//     { sub_dasha: SubCharDashaPeriod[] } | null
//   >;
//   sub_sub_chardasha: unknown | null;
// }

// interface CharDashaResponse {
//   status: "Pass" | "Partial" | "Fail";
//   message: string;
//   data: CharDashaData;
//   meta: {
//     total_apis: number;
//     successful: number;
//     failed: number;
//     failed_endpoints?: string[];
//     success_rate: string;
//     timestamp: string;
//   };
// }

// // ============ Constants ============

// const ZODIAC_SIGNS = [
//   {
//     id: 1,
//     name: "Aries",
//     short: "Ari",
//     icon: "mdi:zodiac-aries",
//     lord: "Mars",
//     element: "Fire",
//   },
//   {
//     id: 2,
//     name: "Taurus",
//     short: "Tau",
//     icon: "mdi:zodiac-taurus",
//     lord: "Venus",
//     element: "Earth",
//   },
//   {
//     id: 3,
//     name: "Gemini",
//     short: "Gem",
//     icon: "mdi:zodiac-gemini",
//     lord: "Mercury",
//     element: "Air",
//   },
//   {
//     id: 4,
//     name: "Cancer",
//     short: "Can",
//     icon: "mdi:zodiac-cancer",
//     lord: "Moon",
//     element: "Water",
//   },
//   {
//     id: 5,
//     name: "Leo",
//     short: "Leo",
//     icon: "mdi:zodiac-leo",
//     lord: "Sun",
//     element: "Fire",
//   },
//   {
//     id: 6,
//     name: "Virgo",
//     short: "Vir",
//     icon: "mdi:zodiac-virgo",
//     lord: "Mercury",
//     element: "Earth",
//   },
//   {
//     id: 7,
//     name: "Libra",
//     short: "Lib",
//     icon: "mdi:zodiac-libra",
//     lord: "Venus",
//     element: "Air",
//   },
//   {
//     id: 8,
//     name: "Scorpio",
//     short: "Sco",
//     icon: "mdi:zodiac-scorpio",
//     lord: "Mars",
//     element: "Water",
//   },
//   {
//     id: 9,
//     name: "Sagittarius",
//     short: "Sag",
//     icon: "mdi:zodiac-sagittarius",
//     lord: "Jupiter",
//     element: "Fire",
//   },
//   {
//     id: 10,
//     name: "Capricorn",
//     short: "Cap",
//     icon: "mdi:zodiac-capricorn",
//     lord: "Saturn",
//     element: "Earth",
//   },
//   {
//     id: 11,
//     name: "Aquarius",
//     short: "Aqu",
//     icon: "mdi:zodiac-aquarius",
//     lord: "Saturn",
//     element: "Air",
//   },
//   {
//     id: 12,
//     name: "Pisces",
//     short: "Pis",
//     icon: "mdi:zodiac-pisces",
//     lord: "Jupiter",
//     element: "Water",
//   },
// ];

// const ELEMENT_COLORS: Record<
//   string,
//   { bg: string; text: string; border: string; light: string }
// > = {
//   Fire: {
//     bg: "bg-red-500",
//     text: "text-red-600",
//     border: "border-red-200",
//     light: "bg-red-50",
//   },
//   Earth: {
//     bg: "bg-amber-500",
//     text: "text-amber-600",
//     border: "border-amber-200",
//     light: "bg-amber-50",
//   },
//   Air: {
//     bg: "bg-sky-500",
//     text: "text-sky-600",
//     border: "border-sky-200",
//     light: "bg-sky-50",
//   },
//   Water: {
//     bg: "bg-blue-500",
//     text: "text-blue-600",
//     border: "border-blue-200",
//     light: "bg-blue-50",
//   },
// };

// const PLANET_CONFIG: Record<string, { icon: string; color: string }> = {
//   Sun: { icon: "mdi:white-balance-sunny", color: "orange" },
//   Moon: { icon: "mdi:moon-waning-crescent", color: "blue" },
//   Mars: { icon: "mdi:triangle", color: "red" },
//   Mercury: { icon: "mdi:atom", color: "green" },
//   Jupiter: { icon: "mdi:circle-outline", color: "yellow" },
//   Venus: { icon: "mdi:heart", color: "pink" },
//   Saturn: { icon: "mdi:hexagon-outline", color: "slate" },
// };

// const COLOR_CLASSES: Record<
//   string,
//   { bg: string; text: string; border: string; light: string }
// > = {
//   orange: {
//     bg: "bg-orange-500",
//     text: "text-orange-600",
//     border: "border-orange-200",
//     light: "bg-orange-50",
//   },
//   blue: {
//     bg: "bg-blue-500",
//     text: "text-blue-600",
//     border: "border-blue-200",
//     light: "bg-blue-50",
//   },
//   red: {
//     bg: "bg-red-500",
//     text: "text-red-600",
//     border: "border-red-200",
//     light: "bg-red-50",
//   },
//   green: {
//     bg: "bg-green-500",
//     text: "text-green-600",
//     border: "border-green-200",
//     light: "bg-green-50",
//   },
//   yellow: {
//     bg: "bg-yellow-500",
//     text: "text-yellow-600",
//     border: "border-yellow-200",
//     light: "bg-yellow-50",
//   },
//   pink: {
//     bg: "bg-pink-500",
//     text: "text-pink-600",
//     border: "border-pink-200",
//     light: "bg-pink-50",
//   },
//   slate: {
//     bg: "bg-slate-500",
//     text: "text-slate-600",
//     border: "border-slate-200",
//     light: "bg-slate-50",
//   },
//   purple: {
//     bg: "bg-purple-500",
//     text: "text-purple-600",
//     border: "border-purple-200",
//     light: "bg-purple-50",
//   },
//   indigo: {
//     bg: "bg-indigo-500",
//     text: "text-indigo-600",
//     border: "border-indigo-200",
//     light: "bg-indigo-50",
//   },
// };

// const TABS = [
//   { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
//   { key: "major", label: "Major Dasha", icon: "mdi:chart-timeline-variant" },
//   { key: "sub", label: "Sub Dasha", icon: "mdi:subdirectory-arrow-right" },
//   { key: "current", label: "Current", icon: "mdi:clock-outline" },
// ];

// export default function CharDashaPage() {
//   const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [charDashaData, setCharDashaData] = useState<CharDashaResponse | null>(
//     null,
//   );
//   const [activeTab, setActiveTab] = useState<string>("overview");
//   const [selectedMajorSign, setSelectedMajorSign] = useState<string | null>(
//     null,
//   );

//   const handlePersonSelected = (person: Person) => {
//     setSelectedPerson(person);
//     setCharDashaData(null);
//   };

//   const getBirthDataPayload = (person: Person) => {
//     const birthDate = new Date(person.BirthTime);
//     let tzone = 0;
//     if (person.TimezoneOffset) {
//       const [h, m] = person.TimezoneOffset.replace("+", "").split(":");
//       const sign = person.TimezoneOffset.startsWith("-") ? -1 : 1;
//       tzone = sign * (parseInt(h) + parseInt(m) / 60);
//     }

//     return {
//       day: birthDate.getUTCDate(),
//       month: birthDate.getUTCMonth() + 1,
//       year: birthDate.getUTCFullYear(),
//       hour: birthDate.getUTCHours(),
//       min: birthDate.getUTCMinutes(),
//       lat: person.Latitude,
//       lon: person.Longitude,
//       tzone: tzone,
//     };
//   };

//   const fetchCharDasha = async () => {
//     if (!selectedPerson) {
//       Swal.fire("Error", "Please select a person first", "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = getBirthDataPayload(selectedPerson);
//       const response = await fetch(`/api/char-dasha`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result: CharDashaResponse = await response.json();
//       if (result.status === "Fail") {
//         throw new Error(result.message || "Failed to fetch Char Dasha data");
//       }
//       setCharDashaData(result);

//       // Set default selected major sign to current one
//       if (result.data?.current_chardasha?.major_dasha?.sign) {
//         setSelectedMajorSign(result.data.current_chardasha.major_dasha.sign);
//       } else if (
//         result.data?.major_chardasha &&
//         result.data.major_chardasha.length > 0
//       ) {
//         setSelectedMajorSign(result.data.major_chardasha[0].sign);
//       }

//       if (result.status === "Partial") {
//         Swal.fire({
//           icon: "warning",
//           title: "Partial Data",
//           text: result.message,
//           timer: 3000,
//           showConfirmButton: false,
//         });
//       }
//     } catch (error: unknown) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Failed to get data";
//       Swal.fire("Error", errorMessage, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============ Helper Functions ============

//   const getSignConfig = (signName: string) => {
//     return (
//       ZODIAC_SIGNS.find(
//         (s) => s.name.toLowerCase() === signName?.toLowerCase(),
//       ) || ZODIAC_SIGNS[0]
//     );
//   };

//   const getElementColor = (signName: string) => {
//     const sign = getSignConfig(signName);
//     return ELEMENT_COLORS[sign.element] || ELEMENT_COLORS.Fire;
//   };

//   const getPlanetConfig = (planetName: string) => {
//     return PLANET_CONFIG[planetName] || { icon: "mdi:circle", color: "slate" };
//   };

//   const getColorClass = (color: string) => {
//     return COLOR_CLASSES[color] || COLOR_CLASSES.slate;
//   };

//   const formatDate = (dateStr: string): string => {
//     if (!dateStr) return "-";
//     // Handle formats like "9-11-2000 5:9" or "22-03-2026"
//     const [datePart] = dateStr.split(" ");
//     const parts = datePart.split("-");
//     if (parts.length !== 3) return dateStr;

//     const [day, month, year] = parts;
//     const months = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     const monthIndex = parseInt(month) - 1;
//     return `${day.padStart(2, "0")} ${months[monthIndex]} ${year}`;
//   };

//   const isCurrentDasha = (dasha: CharDashaPeriod): boolean => {
//     if (dasha.start_ms && dasha.end_ms) {
//       const now = Date.now();
//       return now >= dasha.start_ms && now <= dasha.end_ms;
//     }
//     return false;
//   };

//   // Calculate total cycle years
//   const totalCycleYears = useMemo(() => {
//     if (!charDashaData?.data?.major_chardasha) return 0;
//     return charDashaData.data.major_chardasha.reduce(
//       (sum, d) => sum + (d.duration || 0),
//       0,
//     );
//   }, [charDashaData]);

//   // ============ Components ============

//   // Sign Badge Component
//   const SignBadge = ({
//     signName,
//     size = "md",
//   }: {
//     signName: string;
//     size?: "sm" | "md" | "lg";
//   }) => {
//     const sign = getSignConfig(signName);
//     const elementColor = getElementColor(signName);

//     const sizeClasses = {
//       sm: "px-2 py-1 text-xs",
//       md: "px-3 py-1.5 text-sm",
//       lg: "px-4 py-2 text-base",
//     };

//     return (
//       <span
//         className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${elementColor.light} ${elementColor.border} ${elementColor.text} ${sizeClasses[size]}`}
//       >
//         <Iconify icon={sign.icon} className="text-base" />
//         {signName}
//       </span>
//     );
//   };

//   // Current Dasha Card
//   const CurrentDashaCard = () => {
//     const current = charDashaData?.data?.current_chardasha;
//     if (!current) return null;

//     const majorSign = getSignConfig(current.major_dasha?.sign || "");
//     const majorColor = getElementColor(current.major_dasha?.sign || "");
//     const subSign = getSignConfig(current.sub_dasha?.sign || "");
//     const subColor = getElementColor(current.sub_dasha?.sign || "");

//     return (
//       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
//           <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
//             <Iconify
//               icon="mdi:clock-outline"
//               className="text-lg text-indigo-600"
//             />
//             Current Running Dasha
//           </h3>
//         </div>

//         <div className="p-5 space-y-4">
//           {/* Major Dasha */}
//           {current.major_dasha && (
//             <div
//               className={`p-4 rounded-lg border ${majorColor.light} ${majorColor.border}`}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div
//                     className={`w-12 h-12 rounded-full flex items-center justify-center ${majorColor.light}`}
//                   >
//                     <Iconify
//                       icon={majorSign.icon}
//                       className={`text-2xl ${majorColor.text}`}
//                     />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 uppercase tracking-wide">
//                       Major Dasha (Maha Dasha)
//                     </p>
//                     <p className="text-lg font-bold text-gray-900">
//                       {current.major_dasha.sign}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Lord: {majorSign.lord} • {current.major_dasha.duration}{" "}
//                       Years • {majorSign.element}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-gray-700">
//                     {formatDate(current.major_dasha.start_date)}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     to {formatDate(current.major_dasha.end_date)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Sub Dasha */}
//           {current.sub_dasha && (
//             <div
//               className={`p-4 rounded-lg border ${subColor.light} ${subColor.border}`}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center ${subColor.light}`}
//                   >
//                     <Iconify
//                       icon={subSign.icon}
//                       className={`text-xl ${subColor.text}`}
//                     />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 uppercase tracking-wide">
//                       Sub Dasha (Antar Dasha)
//                     </p>
//                     <p className="text-base font-semibold text-gray-900">
//                       {current.sub_dasha.sign}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Lord: {subSign.lord}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-gray-700">
//                     {formatDate(current.sub_dasha.start_date)}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     to {formatDate(current.sub_dasha.end_date)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Sub-Sub Dasha */}
//           {current.sub_sub_dasha && (
//             <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
//                     <Iconify
//                       icon={getSignConfig(current.sub_sub_dasha.sign).icon}
//                       className={`text-lg ${getElementColor(current.sub_sub_dasha.sign).text}`}
//                     />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 uppercase tracking-wide">
//                       Pratyantardasha
//                     </p>
//                     <p className="text-sm font-semibold text-gray-900">
//                       {current.sub_sub_dasha.sign}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-gray-700">
//                     {formatDate(current.sub_sub_dasha.start_date)}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     to {formatDate(current.sub_sub_dasha.end_date)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Major Dasha Timeline
//   const MajorDashaTimeline = () => {
//     const majorDashas = charDashaData?.data?.major_chardasha;
//     if (!majorDashas || majorDashas.length === 0) return null;

//     const currentMajor =
//       charDashaData?.data?.current_chardasha?.major_dasha?.sign;

//     return (
//       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
//           <h3 className="text-base font-semibold text-gray-900">
//             Char Dasha Cycle
//           </h3>
//           <p className="text-sm text-gray-500">
//             Total cycle: {totalCycleYears} years (Sign-based Jaimini system)
//           </p>
//         </div>

//         <div className="p-5">
//           <div className="flex gap-2 overflow-x-auto pb-2">
//             {majorDashas.map((dasha, idx) => {
//               const sign = getSignConfig(dasha.sign);
//               const elementColor = getElementColor(dasha.sign);
//               const isCurrent =
//                 dasha.sign === currentMajor || isCurrentDasha(dasha);

//               return (
//                 <div
//                   key={idx}
//                   className={`flex-shrink-0 w-32 p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
//                     isCurrent
//                       ? `${elementColor.border} ${elementColor.light} border-2`
//                       : "border-gray-200 bg-white hover:border-gray-300"
//                   }`}
//                   onClick={() => setSelectedMajorSign(dasha.sign)}
//                 >
//                   {isCurrent && (
//                     <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-wide">
//                       Current
//                     </span>
//                   )}
//                   <div className="flex items-center gap-2 mt-1">
//                     <Iconify
//                       icon={sign.icon}
//                       className={`text-lg ${elementColor.text}`}
//                     />
//                     <span className="font-semibold text-gray-900 text-sm">
//                       {dasha.sign}
//                     </span>
//                   </div>
//                   <p className="text-[10px] text-gray-500 mt-1">
//                     {sign.lord} • {dasha.duration}y
//                   </p>
//                   <p className="text-[11px] text-gray-500 mt-2">
//                     {formatDate(dasha.start_date)}
//                   </p>
//                   <p className="text-[11px] text-gray-400">
//                     to {formatDate(dasha.end_date)}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Major Dasha Table
//   const MajorDashaTable = () => {
//     const majorDashas = charDashaData?.data?.major_chardasha;
//     if (!majorDashas || majorDashas.length === 0) return null;

//     const currentMajor =
//       charDashaData?.data?.current_chardasha?.major_dasha?.sign;

//     return (
//       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
//           <h3 className="text-base font-semibold text-gray-900">
//             Major Char Dasha Periods
//           </h3>
//           <p className="text-sm text-gray-500">
//             Jaimini Chara Dasha - Sign-based periods
//           </p>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-100 bg-gray-50/50">
//                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                   #
//                 </th>
//                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                   Sign
//                 </th>
//                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                   Lord
//                 </th>
//                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                   Element
//                 </th>
//                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                   Duration
//                 </th>
//                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                   Start
//                 </th>
//                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                   End
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {majorDashas.map((dasha, idx) => {
//                 const sign = getSignConfig(dasha.sign);
//                 const isCurrent =
//                   dasha.sign === currentMajor || isCurrentDasha(dasha);
//                 const elementColor = getElementColor(dasha.sign);

//                 return (
//                   <tr
//                     key={idx}
//                     className={`hover:bg-gray-50 transition-colors ${isCurrent ? elementColor.light : ""}`}
//                   >
//                     <td className="px-5 py-3 text-sm text-gray-500">
//                       {idx + 1}
//                     </td>
//                     <td className="px-5 py-3">
//                       <div className="flex items-center gap-2">
//                         <SignBadge signName={dasha.sign} size="sm" />
//                         {isCurrent && (
//                           <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
//                             Current
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-5 py-3">
//                       <div className="flex items-center gap-2">
//                         <Iconify
//                           icon={getPlanetConfig(sign.lord).icon}
//                           className={`text-lg ${getColorClass(getPlanetConfig(sign.lord).color).text}`}
//                         />
//                         <span className="text-sm text-gray-700">
//                           {sign.lord}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-5 py-3">
//                       <span
//                         className={`text-xs px-2 py-1 rounded ${elementColor.light} ${elementColor.text}`}
//                       >
//                         {sign.element}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3 text-sm font-medium text-indigo-600">
//                       {dasha.duration} Years
//                     </td>
//                     <td className="px-5 py-3 text-sm text-gray-700">
//                       {formatDate(dasha.start_date)}
//                     </td>
//                     <td className="px-5 py-3 text-sm text-gray-700">
//                       {formatDate(dasha.end_date)}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   // Sub Dasha Section
//   const SubDashaSection = () => {
//     const subDetails = charDashaData?.data?.sub_chardasha_details;
//     const majorDashas = charDashaData?.data?.major_chardasha || [];

//     if (!subDetails || Object.keys(subDetails).length === 0) {
//       return (
//         <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
//           <Iconify
//             icon="mdi:information-outline"
//             className="text-4xl text-gray-300 mx-auto mb-3"
//           />
//           <p className="text-gray-500">No sub dasha details available</p>
//         </div>
//       );
//     }

//     const currentMajor =
//       charDashaData?.data?.current_chardasha?.major_dasha?.sign;
//     const selectedSubDashaData = selectedMajorSign
//       ? subDetails[selectedMajorSign]
//       : null;

//     // Get unique major dasha signs
//     const uniqueMajorSigns = [...new Set(majorDashas.map((d) => d.sign))];

//     return (
//       <div className="space-y-4">
//         {/* Sign Selector */}
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
//             Select Major Dasha to view Sub Periods
//           </p>

//           <div className="flex flex-wrap gap-2">
//             {uniqueMajorSigns.map((signName) => {
//               const sign = getSignConfig(signName);
//               const elementColor = getElementColor(signName);
//               const isSelected = selectedMajorSign === signName;
//               const isCurrent = signName === currentMajor;
//               const hasData = subDetails[signName];

//               return (
//                 <button
//                   key={signName}
//                   onClick={() => setSelectedMajorSign(signName)}
//                   disabled={!hasData}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
//                     isSelected
//                       ? `${elementColor.light} ${elementColor.border} ${elementColor.text}`
//                       : hasData
//                         ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
//                         : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
//                   }`}
//                 >
//                   <Iconify icon={sign.icon} className="text-lg" />
//                   {signName}
//                   {isCurrent && (
//                     <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">
//                       Now
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Selected Sub Dasha Table */}
//         {selectedSubDashaData && selectedMajorSign && (
//           <div
//             className={`bg-white border rounded-lg overflow-hidden ${getElementColor(selectedMajorSign).border}`}
//           >
//             <div
//               className={`px-5 py-4 border-b ${getElementColor(selectedMajorSign).light} ${getElementColor(selectedMajorSign).border}`}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
//                   <Iconify
//                     icon={getSignConfig(selectedMajorSign).icon}
//                     className={`text-xl ${getElementColor(selectedMajorSign).text}`}
//                   />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">
//                     {selectedMajorSign} Sub Periods
//                   </h3>
//                   <p className="text-xs text-gray-600">
//                     {majorDashas.find((d) => d.sign === selectedMajorSign) &&
//                       `${formatDate(majorDashas.find((d) => d.sign === selectedMajorSign)!.start_date)} to ${formatDate(majorDashas.find((d) => d.sign === selectedMajorSign)!.end_date)}`}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-100 bg-gray-50/50">
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                       #
//                     </th>
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                       Sub Sign
//                     </th>
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                       Lord
//                     </th>
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                       Element
//                     </th>
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                       Start
//                     </th>
//                     <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
//                       End
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50">
//                   {selectedSubDashaData?.sub_dasha?.map(
//                     (period: SubCharDashaPeriod, idx: number) => {
//                       const sign = getSignConfig(period.sign);
//                       const elementColor = getElementColor(period.sign);
//                       const currentSub =
//                         charDashaData?.data?.current_chardasha?.sub_dasha;
//                       const isCurrent =
//                         currentSub?.sign === period.sign &&
//                         selectedMajorSign === currentMajor;

//                       return (
//                         <tr
//                           key={idx}
//                           className={`hover:bg-gray-50 transition-colors ${isCurrent ? elementColor.light : ""}`}
//                         >
//                           <td className="px-5 py-3 text-sm text-gray-500">
//                             {idx + 1}
//                           </td>
//                           <td className="px-5 py-3">
//                             <div className="flex items-center gap-2">
//                               <SignBadge signName={period.sign} size="sm" />
//                               {isCurrent && (
//                                 <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
//                                   Current
//                                 </span>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-5 py-3">
//                             <div className="flex items-center gap-2">
//                               <Iconify
//                                 icon={getPlanetConfig(sign.lord).icon}
//                                 className={`text-lg ${getColorClass(getPlanetConfig(sign.lord).color).text}`}
//                               />
//                               <span className="text-sm text-gray-700">
//                                 {sign.lord}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-5 py-3">
//                             <span
//                               className={`text-xs px-2 py-1 rounded ${elementColor.light} ${elementColor.text}`}
//                             >
//                               {sign.element}
//                             </span>
//                           </td>
//                           <td className="px-5 py-3 text-sm text-gray-700">
//                             {formatDate(period.start_date)}
//                           </td>
//                           <td className="px-5 py-3 text-sm text-gray-700">
//                             {formatDate(period.end_date)}
//                           </td>
//                         </tr>
//                       );
//                     },
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Quick Stats
//   const QuickStats = () => {
//     const current = charDashaData?.data?.current_chardasha;
//     if (!current) return null;

//     return (
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-xs text-gray-500 uppercase tracking-wide">
//             Total Cycle
//           </p>
//           <p className="text-2xl font-bold text-indigo-600 mt-1">
//             {totalCycleYears} Years
//           </p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-xs text-gray-500 uppercase tracking-wide">Signs</p>
//           <p className="text-2xl font-bold text-purple-600 mt-1">12</p>
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-xs text-gray-500 uppercase tracking-wide">
//             Current Major
//           </p>
//           {current.major_dasha && (
//             <div className="flex items-center gap-2 mt-1">
//               <Iconify
//                 icon={getSignConfig(current.major_dasha.sign).icon}
//                 className={`text-xl ${getElementColor(current.major_dasha.sign).text}`}
//               />
//               <span className="text-lg font-bold text-gray-900">
//                 {current.major_dasha.sign}
//               </span>
//             </div>
//           )}
//         </div>
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-xs text-gray-500 uppercase tracking-wide">
//             Current Sub
//           </p>
//           {current.sub_dasha && (
//             <div className="flex items-center gap-2 mt-1">
//               <Iconify
//                 icon={getSignConfig(current.sub_dasha.sign).icon}
//                 className={`text-xl ${getElementColor(current.sub_dasha.sign).text}`}
//               />
//               <span className="text-lg font-bold text-gray-900">
//                 {current.sub_dasha.sign}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Overview Section
//   const OverviewSection = () => {
//     return (
//       <div className="space-y-6">
//         <QuickStats />
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <CurrentDashaCard />
//           <MajorDashaTimeline />
//         </div>
//       </div>
//     );
//   };

//   // Render Tab Content
//   const renderTabContent = () => {
//     if (!charDashaData?.data) return null;

//     switch (activeTab) {
//       case "overview":
//         return <OverviewSection />;
//       case "major":
//         return <MajorDashaTable />;
//       case "sub":
//         return <SubDashaSection />;
//       case "current":
//         return <CurrentDashaCard />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <PageHeader
//           title="Char Dasha"
//           description="Jaimini Chara Dasha - Sign-based planetary period system"
//           imageSrc="/images/chardasha.png"
//         />

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
//           {/* Sidebar */}
//           <div className="lg:col-span-3 space-y-4">
//             {/* Person Selector */}
//             <div className="bg-white border border-gray-200 rounded-lg p-5">
//               <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                 <Iconify
//                   icon="mdi:account-outline"
//                   className="text-lg text-gray-500"
//                 />
//                 Select Person
//               </h3>
//               <PersonSelector
//                 onPersonSelected={handlePersonSelected}
//                 label="Choose Profile"
//               />

//               <button
//                 onClick={fetchCharDasha}
//                 disabled={loading || !selectedPerson}
//                 className="mt-4 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Calculating...
//                   </>
//                 ) : (
//                   <>
//                     <Iconify
//                       icon="mdi:calculator-variant-outline"
//                       className="text-lg"
//                     />
//                     Calculate
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Signs Info */}
//             <div className="bg-white border border-gray-200 rounded-lg p-5">
//               <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                 <Iconify
//                   icon="mdi:information-outline"
//                   className="text-lg text-indigo-500"
//                 />
//                 12 Signs & Lords
//               </h4>
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {ZODIAC_SIGNS.map((sign) => {
//                   const elementColor = ELEMENT_COLORS[sign.element];
//                   return (
//                     <div
//                       key={sign.id}
//                       className="flex items-center justify-between text-sm"
//                     >
//                       <div className="flex items-center gap-2">
//                         <Iconify
//                           icon={sign.icon}
//                           className={`text-base ${elementColor.text}`}
//                         />
//                         <span className="text-gray-700">{sign.name}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-500 text-xs">
//                           {sign.lord}
//                         </span>
//                         <span
//                           className={`text-[10px] px-1.5 py-0.5 rounded ${elementColor.light} ${elementColor.text}`}
//                         >
//                           {sign.element}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* About Card */}
//             <div className="bg-white border border-gray-200 rounded-lg p-5">
//               <h4 className="text-sm font-semibold text-gray-900 mb-3">
//                 About Char Dasha
//               </h4>
//               <p className="text-sm text-gray-600">
//                 Chara Dasha is a Jaimini system where dasha periods are based on
//                 signs (rasis) rather than planets. Each sign gets a specific
//                 number of years based on its lord&apos;s position from the sign.
//               </p>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-9">
//             {charDashaData ? (
//               <div className="space-y-4">
//                 {/* Tabs */}
//                 <div className="bg-white border border-gray-200 rounded-lg">
//                   <div className="flex overflow-x-auto border-b border-gray-200">
//                     {TABS.map((tab) => (
//                       <button
//                         key={tab.key}
//                         onClick={() => setActiveTab(tab.key)}
//                         className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
//                           activeTab === tab.key
//                             ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
//                             : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                         }`}
//                       >
//                         <Iconify icon={tab.icon} className="text-lg" />
//                         {tab.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Tab Content */}
//                 <div>{renderTabContent()}</div>

//                 {/* Info Footer */}
//                 <div className="bg-white border border-gray-200 rounded-lg p-5">
//                   <div className="flex items-start gap-3">
//                     <Iconify
//                       icon="mdi:information-outline"
//                       className="text-xl text-gray-400 flex-shrink-0 mt-0.5"
//                     />
//                     <div className="text-sm text-gray-600">
//                       <p className="font-medium text-gray-900 mb-1">
//                         About Jaimini Chara Dasha
//                       </p>
//                       <p>
//                         Chara Dasha is unique to Jaimini astrology. Unlike
//                         Vimshottari which uses nakshatra-based planetary
//                         periods, Chara Dasha uses signs. The duration of each
//                         sign depends on the distance of its lord from the sign
//                         itself. This system is particularly useful for timing
//                         events related to career, relationships, and life
//                         changes.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center min-h-[500px] text-center p-8">
//                 <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
//                   <Iconify
//                     icon="mdi:zodiac-aries"
//                     className="text-3xl text-indigo-400"
//                   />
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   Char Dasha Analysis
//                 </h3>
//                 <p className="text-gray-500 max-w-sm">
//                   Select a person and click &quot;Calculate&quot; to view
//                   Jaimini Chara Dasha periods and predictions.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import { Person } from "@/lib/models";
import Swal from "sweetalert2";

// ============ Types (Fixed to match API response) ============

interface CharDashaPeriod {
  sign_id: number;
  sign_name: string;
  duration: string; // API returns "7 Years" as string
  start_date: string;
  end_date: string;
  start_ms?: number;
  end_ms?: number;
}

interface SubCharDashaPeriod {
  sign_id: number;
  sign_name: string;
  start_date: string;
  end_date: string;
  start_ms?: number;
  end_ms?: number;
  duration?: string;
}

interface CurrentCharDasha {
  dasha_date: string;
  major_dasha: CharDashaPeriod;
  sub_dasha: CharDashaPeriod;
  sub_sub_dasha?: {
    sign_id: number;
    sign_name: string;
    start_date: string;
    end_date: string;
  };
}

interface SubDashaDetails {
  major_dasha: CharDashaPeriod;
  sub_dasha: SubCharDashaPeriod[];
}

interface CharDashaData {
  major_chardasha: CharDashaPeriod[] | null;
  current_chardasha: CurrentCharDasha | null;
  sub_chardasha_details: Record<string, SubDashaDetails | null>;
  sub_sub_chardasha?: unknown | null;
}

interface CharDashaResponse {
  status: "Pass" | "Partial" | "Fail";
  message: string;
  data: CharDashaData;
  meta: {
    total_apis: number;
    successful: number;
    failed: number;
    failed_endpoints?: string[];
    success_rate: string;
    timestamp: string;
  };
}

// ============ Constants (Fixed: 0-indexed to match API) ============

const ZODIAC_SIGNS = [
  {
    id: 0,
    name: "Aries",
    short: "Ari",
    icon: "mdi:zodiac-aries",
    lord: "Mars",
    element: "Fire",
  },
  {
    id: 1,
    name: "Taurus",
    short: "Tau",
    icon: "mdi:zodiac-taurus",
    lord: "Venus",
    element: "Earth",
  },
  {
    id: 2,
    name: "Gemini",
    short: "Gem",
    icon: "mdi:zodiac-gemini",
    lord: "Mercury",
    element: "Air",
  },
  {
    id: 3,
    name: "Cancer",
    short: "Can",
    icon: "mdi:zodiac-cancer",
    lord: "Moon",
    element: "Water",
  },
  {
    id: 4,
    name: "Leo",
    short: "Leo",
    icon: "mdi:zodiac-leo",
    lord: "Sun",
    element: "Fire",
  },
  {
    id: 5,
    name: "Virgo",
    short: "Vir",
    icon: "mdi:zodiac-virgo",
    lord: "Mercury",
    element: "Earth",
  },
  {
    id: 6,
    name: "Libra",
    short: "Lib",
    icon: "mdi:zodiac-libra",
    lord: "Venus",
    element: "Air",
  },
  {
    id: 7,
    name: "Scorpio",
    short: "Sco",
    icon: "mdi:zodiac-scorpio",
    lord: "Mars",
    element: "Water",
  },
  {
    id: 8,
    name: "Sagittarius",
    short: "Sag",
    icon: "mdi:zodiac-sagittarius",
    lord: "Jupiter",
    element: "Fire",
  },
  {
    id: 9,
    name: "Capricorn",
    short: "Cap",
    icon: "mdi:zodiac-capricorn",
    lord: "Saturn",
    element: "Earth",
  },
  {
    id: 10,
    name: "Aquarius",
    short: "Aqu",
    icon: "mdi:zodiac-aquarius",
    lord: "Saturn",
    element: "Air",
  },
  {
    id: 11,
    name: "Pisces",
    short: "Pis",
    icon: "mdi:zodiac-pisces",
    lord: "Jupiter",
    element: "Water",
  },
];

const ELEMENT_COLORS: Record<
  string,
  { bg: string; text: string; border: string; light: string }
> = {
  Fire: {
    bg: "bg-red-500",
    text: "text-red-600",
    border: "border-red-200",
    light: "bg-red-50",
  },
  Earth: {
    bg: "bg-amber-500",
    text: "text-amber-600",
    border: "border-amber-200",
    light: "bg-amber-50",
  },
  Air: {
    bg: "bg-sky-500",
    text: "text-sky-600",
    border: "border-sky-200",
    light: "bg-sky-50",
  },
  Water: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    border: "border-blue-200",
    light: "bg-blue-50",
  },
};

const PLANET_CONFIG: Record<string, { icon: string; color: string }> = {
  Sun: { icon: "mdi:white-balance-sunny", color: "orange" },
  Moon: { icon: "mdi:moon-waning-crescent", color: "blue" },
  Mars: { icon: "mdi:triangle", color: "red" },
  Mercury: { icon: "mdi:atom", color: "green" },
  Jupiter: { icon: "mdi:circle-outline", color: "yellow" },
  Venus: { icon: "mdi:heart", color: "pink" },
  Saturn: { icon: "mdi:hexagon-outline", color: "slate" },
};

const COLOR_CLASSES: Record<
  string,
  { bg: string; text: string; border: string; light: string }
> = {
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-600",
    border: "border-orange-200",
    light: "bg-orange-50",
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    border: "border-blue-200",
    light: "bg-blue-50",
  },
  red: {
    bg: "bg-red-500",
    text: "text-red-600",
    border: "border-red-200",
    light: "bg-red-50",
  },
  green: {
    bg: "bg-green-500",
    text: "text-green-600",
    border: "border-green-200",
    light: "bg-green-50",
  },
  yellow: {
    bg: "bg-yellow-500",
    text: "text-yellow-600",
    border: "border-yellow-200",
    light: "bg-yellow-50",
  },
  pink: {
    bg: "bg-pink-500",
    text: "text-pink-600",
    border: "border-pink-200",
    light: "bg-pink-50",
  },
  slate: {
    bg: "bg-slate-500",
    text: "text-slate-600",
    border: "border-slate-200",
    light: "bg-slate-50",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-600",
    border: "border-purple-200",
    light: "bg-purple-50",
  },
  indigo: {
    bg: "bg-indigo-500",
    text: "text-indigo-600",
    border: "border-indigo-200",
    light: "bg-indigo-50",
  },
};

const TABS = [
  { key: "overview", label: "Overview", icon: "mdi:view-dashboard-outline" },
  { key: "major", label: "Major Dasha", icon: "mdi:chart-timeline-variant" },
  { key: "sub", label: "Sub Dasha", icon: "mdi:subdirectory-arrow-right" },
  { key: "current", label: "Current", icon: "mdi:clock-outline" },
];

export default function CharDashaPage() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [charDashaData, setCharDashaData] = useState<CharDashaResponse | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedMajorSign, setSelectedMajorSign] = useState<string | null>(
    null,
  );

  const handlePersonSelected = (person: Person) => {
    setSelectedPerson(person);
    setCharDashaData(null);
  };

  const getBirthDataPayload = (person: Person) => {
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
    };
  };

  const fetchCharDasha = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = getBirthDataPayload(selectedPerson);
      const response = await fetch(`/api/char-dasha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: CharDashaResponse = await response.json();
      if (result.status === "Fail") {
        throw new Error(result.message || "Failed to fetch Char Dasha data");
      }
      setCharDashaData(result);

      // Set default selected major sign to current one (using sign_name)
      if (result.data?.current_chardasha?.major_dasha?.sign_name) {
        setSelectedMajorSign(
          result.data.current_chardasha.major_dasha.sign_name,
        );
      } else if (
        result.data?.major_chardasha &&
        result.data.major_chardasha.length > 0
      ) {
        setSelectedMajorSign(result.data.major_chardasha[0].sign_name);
      }

      if (result.status === "Partial") {
        Swal.fire({
          icon: "warning",
          title: "Partial Data",
          text: result.message,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get data";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // ============ Helper Functions (Fixed) ============

  // Get sign config by name or id
  const getSignConfig = (signNameOrId: string | number) => {
    if (typeof signNameOrId === "number") {
      return ZODIAC_SIGNS.find((s) => s.id === signNameOrId) || ZODIAC_SIGNS[0];
    }
    return (
      ZODIAC_SIGNS.find(
        (s) => s.name.toLowerCase() === signNameOrId?.toLowerCase(),
      ) || ZODIAC_SIGNS[0]
    );
  };

  const getElementColor = (signName: string) => {
    const sign = getSignConfig(signName);
    return ELEMENT_COLORS[sign.element] || ELEMENT_COLORS.Fire;
  };

  const getPlanetConfig = (planetName: string) => {
    return PLANET_CONFIG[planetName] || { icon: "mdi:circle", color: "slate" };
  };

  const getColorClass = (color: string) => {
    return COLOR_CLASSES[color] || COLOR_CLASSES.slate;
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "-";
    const [datePart] = dateStr.split(" ");
    const parts = datePart.split("-");
    if (parts.length !== 3) return dateStr;

    const [day, month, year] = parts;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = parseInt(month) - 1;
    return `${day.padStart(2, "0")} ${months[monthIndex]} ${year}`;
  };

  // Parse duration string like "7 Years" to number
  const parseDuration = (durationStr: string): number => {
    if (!durationStr) return 0;
    const match = durationStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const isCurrentDasha = (
    dasha: CharDashaPeriod | SubCharDashaPeriod,
  ): boolean => {
    if (dasha.start_ms && dasha.end_ms) {
      const now = Date.now();
      return now >= dasha.start_ms && now <= dasha.end_ms;
    }
    return false;
  };

  // Calculate total cycle years
  const totalCycleYears = useMemo(() => {
    if (!charDashaData?.data?.major_chardasha) return 0;
    return charDashaData.data.major_chardasha.reduce(
      (sum, d) => sum + parseDuration(d.duration),
      0,
    );
  }, [charDashaData]);

  // ============ Components ============

  // Sign Badge Component
  const SignBadge = ({
    signName,
    size = "md",
  }: {
    signName: string;
    size?: "sm" | "md" | "lg";
  }) => {
    const sign = getSignConfig(signName);
    const elementColor = getElementColor(signName);

    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${elementColor.light} ${elementColor.border} ${elementColor.text} ${sizeClasses[size]}`}
      >
        <Iconify icon={sign.icon} className="text-base" />
        {signName}
      </span>
    );
  };

  // Current Dasha Card
  const CurrentDashaCard = () => {
    const current = charDashaData?.data?.current_chardasha;
    if (!current) return null;

    const majorSign = getSignConfig(current.major_dasha?.sign_name || "");
    const majorColor = getElementColor(current.major_dasha?.sign_name || "");
    const subSign = getSignConfig(current.sub_dasha?.sign_name || "");
    const subColor = getElementColor(current.sub_dasha?.sign_name || "");

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Iconify
              icon="mdi:clock-outline"
              className="text-lg text-indigo-600"
            />
            Current Running Dasha
          </h3>
          {current.dasha_date && (
            <p className="text-xs text-gray-500 mt-1">
              As of: {formatDate(current.dasha_date)}
            </p>
          )}
        </div>

        <div className="p-5 space-y-4">
          {/* Major Dasha */}
          {current.major_dasha && (
            <div
              className={`p-4 rounded-lg border ${majorColor.light} ${majorColor.border}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${majorColor.light}`}
                  >
                    <Iconify
                      icon={majorSign.icon}
                      className={`text-2xl ${majorColor.text}`}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Major Dasha (Maha Dasha)
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {current.major_dasha.sign_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Lord: {majorSign.lord} • {current.major_dasha.duration} •{" "}
                      {majorSign.element}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700">
                    {formatDate(current.major_dasha.start_date)}
                  </p>
                  <p className="text-xs text-gray-500">
                    to {formatDate(current.major_dasha.end_date)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sub Dasha */}
          {current.sub_dasha && (
            <div
              className={`p-4 rounded-lg border ${subColor.light} ${subColor.border}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${subColor.light}`}
                  >
                    <Iconify
                      icon={subSign.icon}
                      className={`text-xl ${subColor.text}`}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Sub Dasha (Antar Dasha)
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {current.sub_dasha.sign_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Lord: {subSign.lord} • {current.sub_dasha.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700">
                    {formatDate(current.sub_dasha.start_date)}
                  </p>
                  <p className="text-xs text-gray-500">
                    to {formatDate(current.sub_dasha.end_date)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Sub Dasha */}
          {current.sub_sub_dasha && (
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
                    <Iconify
                      icon={getSignConfig(current.sub_sub_dasha.sign_name).icon}
                      className={`text-lg ${getElementColor(current.sub_sub_dasha.sign_name).text}`}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Pratyantardasha
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {current.sub_sub_dasha.sign_name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700">
                    {formatDate(current.sub_sub_dasha.start_date)}
                  </p>
                  <p className="text-xs text-gray-500">
                    to {formatDate(current.sub_sub_dasha.end_date)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Major Dasha Timeline
  const MajorDashaTimeline = () => {
    const majorDashas = charDashaData?.data?.major_chardasha;
    if (!majorDashas || majorDashas.length === 0) return null;

    const currentMajor =
      charDashaData?.data?.current_chardasha?.major_dasha?.sign_name;

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">
            Char Dasha Cycle
          </h3>
          <p className="text-sm text-gray-500">
            Total cycle: {totalCycleYears} years (Sign-based Jaimini system)
          </p>
        </div>

        <div className="p-5">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {majorDashas.map((dasha, idx) => {
              const sign = getSignConfig(dasha.sign_name);
              const elementColor = getElementColor(dasha.sign_name);
              const isCurrent = dasha.sign_name === currentMajor;

              return (
                <div
                  key={idx}
                  className={`flex-shrink-0 w-32 p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                    isCurrent
                      ? `${elementColor.border} ${elementColor.light} border-2`
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedMajorSign(dasha.sign_name)}
                >
                  {isCurrent && (
                    <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-wide">
                      Current
                    </span>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Iconify
                      icon={sign.icon}
                      className={`text-lg ${elementColor.text}`}
                    />
                    <span className="font-semibold text-gray-900 text-sm">
                      {dasha.sign_name}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {sign.lord} • {dasha.duration}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-2">
                    {formatDate(dasha.start_date)}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    to {formatDate(dasha.end_date)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Major Dasha Table
  const MajorDashaTable = () => {
    const majorDashas = charDashaData?.data?.major_chardasha;
    if (!majorDashas || majorDashas.length === 0) return null;

    const currentMajor =
      charDashaData?.data?.current_chardasha?.major_dasha?.sign_name;

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-base font-semibold text-gray-900">
            Major Char Dasha Periods
          </h3>
          <p className="text-sm text-gray-500">
            Jaimini Chara Dasha - Sign-based periods
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  #
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Sign
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Lord
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Element
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Duration
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Start
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  End
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {majorDashas.map((dasha, idx) => {
                const sign = getSignConfig(dasha.sign_name);
                const isCurrent = dasha.sign_name === currentMajor;
                const elementColor = getElementColor(dasha.sign_name);

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-gray-50 transition-colors ${isCurrent ? elementColor.light : ""}`}
                  >
                    <td className="px-5 py-3 text-sm text-gray-500">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <SignBadge signName={dasha.sign_name} size="sm" />
                        {isCurrent && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon={getPlanetConfig(sign.lord).icon}
                          className={`text-lg ${getColorClass(getPlanetConfig(sign.lord).color).text}`}
                        />
                        <span className="text-sm text-gray-700">
                          {sign.lord}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${elementColor.light} ${elementColor.text}`}
                      >
                        {sign.element}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-indigo-600">
                      {dasha.duration}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {formatDate(dasha.start_date)}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">
                      {formatDate(dasha.end_date)}
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

  // Sub Dasha Section
  const SubDashaSection = () => {
    const subDetails = charDashaData?.data?.sub_chardasha_details;
    const majorDashas = charDashaData?.data?.major_chardasha || [];

    if (!subDetails || Object.keys(subDetails).length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Iconify
            icon="mdi:information-outline"
            className="text-4xl text-gray-300 mx-auto mb-3"
          />
          <p className="text-gray-500">No sub dasha details available</p>
        </div>
      );
    }

    const currentMajor =
      charDashaData?.data?.current_chardasha?.major_dasha?.sign_name;
    const currentSub =
      charDashaData?.data?.current_chardasha?.sub_dasha?.sign_name;
    const selectedSubDashaData = selectedMajorSign
      ? subDetails[selectedMajorSign]
      : null;

    // Get unique major dasha signs from sub_chardasha_details keys
    const availableSigns = Object.keys(subDetails);

    return (
      <div className="space-y-4">
        {/* Sign Selector */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
            Select Major Dasha to view Sub Periods
          </p>

          <div className="flex flex-wrap gap-2">
            {availableSigns.map((signName) => {
              const sign = getSignConfig(signName);
              const elementColor = getElementColor(signName);
              const isSelected = selectedMajorSign === signName;
              const isCurrent = signName === currentMajor;
              const hasData = subDetails[signName]?.sub_dasha?.length > 0;

              return (
                <button
                  key={signName}
                  onClick={() => setSelectedMajorSign(signName)}
                  disabled={!hasData}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    isSelected
                      ? `${elementColor.light} ${elementColor.border} ${elementColor.text}`
                      : hasData
                        ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Iconify icon={sign.icon} className="text-lg" />
                  {signName}
                  {isCurrent && (
                    <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">
                      Now
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Sub Dasha Table */}
        {selectedSubDashaData && selectedMajorSign && (
          <div
            className={`bg-white border rounded-lg overflow-hidden ${getElementColor(selectedMajorSign).border}`}
          >
            <div
              className={`px-5 py-4 border-b ${getElementColor(selectedMajorSign).light} ${getElementColor(selectedMajorSign).border}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Iconify
                    icon={getSignConfig(selectedMajorSign).icon}
                    className={`text-xl ${getElementColor(selectedMajorSign).text}`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedMajorSign} Sub Periods
                  </h3>
                  {selectedSubDashaData.major_dasha && (
                    <p className="text-xs text-gray-600">
                      {formatDate(selectedSubDashaData.major_dasha.start_date)}{" "}
                      to {formatDate(selectedSubDashaData.major_dasha.end_date)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      #
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Sub Sign
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Lord
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Element
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Start
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      End
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedSubDashaData.sub_dasha?.map((period, idx) => {
                    const sign = getSignConfig(period.sign_name);
                    const elementColor = getElementColor(period.sign_name);
                    const isCurrent =
                      currentSub === period.sign_name &&
                      selectedMajorSign === currentMajor;

                    return (
                      <tr
                        key={idx}
                        className={`hover:bg-gray-50 transition-colors ${isCurrent ? elementColor.light : ""}`}
                      >
                        <td className="px-5 py-3 text-sm text-gray-500">
                          {idx + 1}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <SignBadge signName={period.sign_name} size="sm" />
                            {isCurrent && (
                              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                                Current
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Iconify
                              icon={getPlanetConfig(sign.lord).icon}
                              className={`text-lg ${getColorClass(getPlanetConfig(sign.lord).color).text}`}
                            />
                            <span className="text-sm text-gray-700">
                              {sign.lord}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded ${elementColor.light} ${elementColor.text}`}
                          >
                            {sign.element}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {formatDate(period.start_date)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {formatDate(period.end_date)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Quick Stats
  const QuickStats = () => {
    const current = charDashaData?.data?.current_chardasha;
    if (!current) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Total Cycle
          </p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {totalCycleYears} Years
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Signs</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">12</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Current Major
          </p>
          {current.major_dasha && (
            <div className="flex items-center gap-2 mt-1">
              <Iconify
                icon={getSignConfig(current.major_dasha.sign_name).icon}
                className={`text-xl ${getElementColor(current.major_dasha.sign_name).text}`}
              />
              <span className="text-lg font-bold text-gray-900">
                {current.major_dasha.sign_name}
              </span>
            </div>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Current Sub
          </p>
          {current.sub_dasha && (
            <div className="flex items-center gap-2 mt-1">
              <Iconify
                icon={getSignConfig(current.sub_dasha.sign_name).icon}
                className={`text-xl ${getElementColor(current.sub_dasha.sign_name).text}`}
              />
              <span className="text-lg font-bold text-gray-900">
                {current.sub_dasha.sign_name}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Overview Section
  const OverviewSection = () => {
    return (
      <div className="space-y-6">
        <QuickStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrentDashaCard />
          <MajorDashaTimeline />
        </div>
      </div>
    );
  };

  // Render Tab Content
  const renderTabContent = () => {
    if (!charDashaData?.data) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewSection />;
      case "major":
        return <MajorDashaTable />;
      case "sub":
        return <SubDashaSection />;
      case "current":
        return <CurrentDashaCard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Char Dasha"
          description="Jaimini Chara Dasha - Sign-based planetary period system"
          imageSrc="/images/chardasha.png"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Person Selector */}
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
                onClick={fetchCharDasha}
                disabled={loading || !selectedPerson}
                className="mt-4 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Iconify
                      icon="mdi:calculator-variant-outline"
                      className="text-lg"
                    />
                    Calculate
                  </>
                )}
              </button>
            </div>

            {/* Signs Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Iconify
                  icon="mdi:information-outline"
                  className="text-lg text-indigo-500"
                />
                12 Signs & Lords
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {ZODIAC_SIGNS.map((sign) => {
                  const elementColor = ELEMENT_COLORS[sign.element];
                  return (
                    <div
                      key={sign.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon={sign.icon}
                          className={`text-base ${elementColor.text}`}
                        />
                        <span className="text-gray-700">{sign.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">
                          {sign.lord}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${elementColor.light} ${elementColor.text}`}
                        >
                          {sign.element}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* About Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                About Char Dasha
              </h4>
              <p className="text-sm text-gray-600">
                Chara Dasha is a Jaimini system where dasha periods are based on
                signs (rasis) rather than planets. Each sign gets a specific
                number of years based on its lord&apos;s position from the sign.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {charDashaData ? (
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
                <div>{renderTabContent()}</div>

                {/* Info Footer */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <Iconify
                      icon="mdi:information-outline"
                      className="text-xl text-gray-400 flex-shrink-0 mt-0.5"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900 mb-1">
                        About Jaimini Chara Dasha
                      </p>
                      <p>
                        Chara Dasha is unique to Jaimini astrology. Unlike
                        Vimshottari which uses nakshatra-based planetary
                        periods, Chara Dasha uses signs. The duration of each
                        sign depends on the distance of its lord from the sign
                        itself. This system is particularly useful for timing
                        events related to career, relationships, and life
                        changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                  <Iconify
                    icon="mdi:zodiac-aries"
                    className="text-3xl text-indigo-400"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Char Dasha Analysis
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Select a person and click &quot;Calculate&quot; to view
                  Jaimini Chara Dasha periods and predictions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
