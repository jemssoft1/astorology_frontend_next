import React from "react";
import Iconify from "@/components/Iconify";

interface MatchResultProps {
  maleName: string;
  femaleName: string;
  result: any; // Ideally typed as MatchReport from API
}

const MatchResult: React.FC<MatchResultProps> = ({
  maleName,
  femaleName,
  result,
}) => {
  // Extract data based on provided JSON structure
  const score = result?.KutaScore ?? result?.Score ?? 0;

  const summary =
    result?.Summary?.ScoreSummary || result?.Notes || "Compatibility Report";

  const predictionList = result?.PredictionList || [];

  const getScoreColor = (scoreVal: number) => {
    // Standard Kuta Milan is out of 36
    if (scoreVal >= 25) return "#00a702"; // Excellent/Good
    if (scoreVal >= 18) return "#f57c00"; // Average
    return "#d32f2f"; // Bad
  };

  return (
    <div className="w-full max-w-[764px] mx-auto">
      {/* EASY REPORT HEADER */}
      <div className="flex items-center gap-2 mb-2 font-bold">
        <Iconify icon="maki:school" width={38} height={38} />
        <h3 className="text-xl text-gray-800 mt-1">Easy</h3>
      </div>
      <hr className="mt-1 mb-4 border-gray-200" />

      {/* EASY REPORT CARD */}
      <div className="max-w-[600px] mx-auto mb-8">
        <div
          className="rounded-[16px] shadow-sm border-0 bg-white"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <div className="p-4">
            {/* Names Section */}
            <div className="text-center mb-4">
              <small className="text-uppercase text-gray-500 font-semibold tracking-widest text-[11px] uppercase">
                Couple
              </small>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
                <h5 className="mb-0 font-semibold text-lg md:text-xl text-gray-800">
                  {maleName}
                </h5>
                <Iconify
                  icon="mdi:heart-plus"
                  width={22}
                  height={22}
                  className="text-pink-500 shrink-0"
                />
                <h5 className="mb-0 font-semibold text-lg md:text-xl text-gray-800">
                  {femaleName}
                </h5>
              </div>
            </div>

            <hr className="my-3 border-gray-100 opacity-50" />

            {/* Score & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center items-center">
              <div className="py-2 md:border-r border-gray-100">
                <small className="block text-uppercase text-gray-500 font-semibold tracking-widest text-[11px] mb-1 uppercase">
                  Score (Out of 36)
                </small>
                <div
                  className="font-bold leading-none"
                  style={{
                    color: getScoreColor(Number(score)),
                    fontSize: "clamp(2.5rem, 8vw, 4rem)",
                  }}
                >
                  {score}
                </div>
              </div>
              <div className="py-2">
                <small className="block text-uppercase text-gray-500 font-semibold tracking-widest text-[11px] mb-1 uppercase">
                  ✨ AI Summary
                </small>
                <div
                  className="font-medium text-gray-800"
                  style={{
                    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                    lineHeight: "1.4",
                  }}
                >
                  {summary}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADVANCED REPORT HEADER */}
      <div className="flex items-center gap-2 mb-2 font-bold mt-8">
        <Iconify icon="tabler:school" width={38} height={38} />
        <h3 className="text-xl text-gray-800 mt-1">Advanced</h3>
      </div>

      {/* ADVANCED TABLE */}
      <div className="overflow-hidden rounded-[10px] shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-4 w-1/3 md:w-[412px] font-semibold">Name</th>
              <th className="p-4 font-semibold">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {predictionList.length > 0 ? (
              predictionList.map((item: any, idx: number) => (
                <AdvancedRow key={idx} item={item} />
              ))
            ) : (
              <tr>
                <td colSpan={2} className="p-4 text-center text-gray-500">
                  No advanced details available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sub-component for a table row
const AdvancedRow = ({ item }: { item: any }) => {
  // Map fields from API (using structure from user feedback)
  const name = item.Name || "Unknown";
  const Description = item.Description || "Unknown";

  // The 'Info' field seems to contain the specific description/result often
  const resultText = item.Info || "";
  const status = item.Nature || "Neutral";

  const maleInfo = item.MaleInfo;
  const femaleInfo = item.FemaleInfo;

  // Helper to determine color based on status
  const getStatusColor = (s: string) => {
    const lower = String(s).toLowerCase();
    if (lower === "good" || lower === "pass" || lower === "excellent")
      return "text-green-600";
    if (lower === "bad" || lower === "fail" || lower === "poor")
      return "text-red-600";
    return "text-gray-600"; // Neutral or others
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4 align-top">
        <b className="block text-lg md:text-[22px] text-gray-800 mb-1 leading-tight">
          {name}
        </b>
        <p>{Description}</p>
      </td>
      <td className="p-4 align-top">
        <div className="flex flex-col justify-between h-full">
          <div>
            <b
              className={`block text-lg md:text-[22px] mb-1 ${getStatusColor(
                status,
              )}`}
            >
              {status}
            </b>
            <div className="text-sm md:text-[14px] text-gray-600 leading-relaxed">
              {resultText}
            </div>

            {(maleInfo !== undefined || femaleInfo !== undefined) && (
              <div className="mt-2 text-xs md:text-sm text-gray-500 bg-gray-50 p-2 rounded inline-block border border-gray-100">
                <span className="font-medium mr-1">Details:</span>
                {maleInfo !== undefined && <span>M: {maleInfo}</span>}
                {maleInfo !== undefined && femaleInfo !== undefined && (
                  <span className="mx-1">|</span>
                )}
                {femaleInfo !== undefined && <span>F: {femaleInfo}</span>}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default MatchResult;
