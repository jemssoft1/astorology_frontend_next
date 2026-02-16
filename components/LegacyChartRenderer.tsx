import React, { useMemo, useState } from "react";
import Iconify from "./Iconify";

type TimeSlice = {
  StartTime: string;
  EndTime: string;
  Value: number;
  Color: string;
  EventName?: string;
  EventDescription?: string;
  NatureScore?: number;
};
type RenderedTimeSlice = TimeSlice & {
  x: number;
  width: number;
  y: number;
  fill: string;
  formattedDate: string;
};

type Props = {
  prediction: {
    TimeSlices: TimeSlice[];
  } | null;
};

export default function LegacyChartRenderer({ prediction }: Props) {
  const [hoveredEvent, setHoveredEvent] = useState<RenderedTimeSlice | null>(
    null,
  );

  const { slices, years, months, totalWidth, totalHeight } = useMemo(() => {
    if (!prediction || !prediction.TimeSlices) {
      return {
        slices: [],
        years: [],
        months: [],
        totalWidth: 1000,
        totalHeight: 300,
      };
    }

    // Sort by start time for better packing
    const data: TimeSlice[] = [...prediction.TimeSlices].sort(
      (a, b) =>
        new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime(),
    );

    if (data.length === 0) {
      return {
        slices: [],
        years: [],
        months: [],
        totalWidth: 1000,
        totalHeight: 300,
      };
    }

    const start = new Date(data[0].StartTime).getTime();
    const end = new Date(data[data.length - 1].EndTime).getTime();
    const duration = end - start || 1; // Avoid division by zero

    const width = 1000;

    // Header settings matching l.svg
    const headerHeight = 11; // Matching l.svg height
    const rowHeight = 16;
    const rowGap = 0;
    const startY = headerHeight + 11 + 2; // Year + Month height + gap

    // Calculate years for top axis
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const yearList = [];
    const monthList = [];

    for (let y = startYear; y <= endYear; y++) {
      const yearStart = new Date(y, 0, 1).getTime();
      const yearEnd = new Date(y + 1, 0, 1).getTime();

      // Calculate position relative to chart start/end
      const x1 = Math.max(0, ((yearStart - start) / duration) * width);
      const x2 = Math.min(width, ((yearEnd - start) / duration) * width);

      if (x2 > x1) {
        yearList.push({ year: y, x: x1, width: x2 - x1 });
      }

      // Months
      for (let m = 0; m < 12; m++) {
        const monthStart = new Date(y, m, 1).getTime();
        const monthEnd = new Date(y, m + 1, 1).getTime();

        const mx1 = Math.max(0, ((monthStart - start) / duration) * width);
        const mx2 = Math.min(width, ((monthEnd - start) / duration) * width);

        if (mx2 > mx1) {
          const monthName = new Date(y, m, 1)
            .toLocaleString("default", { month: "short" })
            .toUpperCase();
          monthList.push({ name: monthName, x: mx1, width: mx2 - mx1 });
        }
      }
    }

    // Smart Row Packing
    // rows[row_index] = end_time_of_last_event_in_this_row
    const rows: number[] = [];

    const processedSlices = data.map((slice) => {
      const sTime = new Date(slice.StartTime).getTime();
      const eTime = new Date(slice.EndTime).getTime();
      const x = ((sTime - start) / duration) * width;
      const w = Math.max(2, ((eTime - sTime) / duration) * width); // Min width 2px

      // Find first row where this event fits
      // Event fits if sTime >= rows[r] (meaning it starts after last event ends)
      let rowIndex = -1;
      for (let r = 0; r < rows.length; r++) {
        // Add a tiny buffer to avoid visual overlap if pixels match exactly
        if (sTime >= rows[r]) {
          rowIndex = r;
          break;
        }
      }

      if (rowIndex === -1) {
        // Create new row
        rowIndex = rows.length;
        rows.push(eTime);
      } else {
        // Update row end time
        rows[rowIndex] = eTime;
      }

      const y = startY + rowIndex * (rowHeight + rowGap);

      // Color logic based on NatureScore matching l.svg
      let fill = slice.Color;
      if (!fill) {
        if (slice.NatureScore !== undefined) {
          if (slice.NatureScore > 0)
            fill = "#00DD00"; // Green
          else if (slice.NatureScore < 0)
            fill = "#DD0000"; // Red
          else fill = "black";
        } else {
          fill = slice.Value > 0 ? "#00DD00" : "#DD0000";
        }
      }

      return {
        ...slice,
        x,
        width: w,
        y,
        fill,
        formattedDate: new Date(slice.StartTime).toLocaleDateString(),
      };
    });

    const totalRows = rows.length;
    // Add extra height for Month header and Smart Summary row?
    const computedHeight = Math.max(300, startY + totalRows * rowHeight + 50);

    return {
      slices: processedSlices,
      years: yearList,
      months: monthList,
      totalWidth: width,
      totalHeight: computedHeight,
    };
  }, [prediction]);

  if (!prediction || !prediction.TimeSlices) return null;

  // "NOW" line
  const now = new Date().getTime();
  const start = new Date(prediction.TimeSlices[0].StartTime).getTime();
  const end = new Date(
    prediction.TimeSlices[prediction.TimeSlices.length - 1].EndTime,
  ).getTime();
  const nowX = ((now - start) / (end - start)) * totalWidth;

  return (
    <div className="w-full bg-[#f0f0f0] p-2 border border-gray-400 rounded shadow-md overflow-hidden font-sans">
      {/* 1. Toolbar */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <div className="flex bg-[#007bff] rounded overflow-hidden">
            <button className="p-1 text-white border-r border-blue-400 hover:bg-blue-700">
              <Iconify icon="mdi:magnify-plus" width={18} />
            </button>
            <button className="p-1 text-white hover:bg-blue-700">
              <Iconify icon="mdi:magnify-minus" width={18} />
            </button>
          </div>
          <button className="bg-[#007bff] text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-blue-700">
            <Iconify icon="mdi:sparkles" width={14} /> Ask AI
          </button>
          <button className="bg-[#007bff] text-white px-3 py-1 rounded text-xs flex items-center gap-1 hover:bg-blue-700">
            <Iconify icon="mdi:account" width={14} /> Person
          </button>
        </div>

        {hoveredEvent && (
          <div className="text-xs bg-white border border-gray-300 px-2 py-1 rounded shadow-sm text-gray-700 truncate max-w-[300px]">
            <strong>{hoveredEvent.EventName}</strong>:{" "}
            {hoveredEvent.EventDescription}
          </div>
        )}
      </div>

      {/* 2. The SVG Chart */}
      <div className="bg-white border border-gray-600 relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          className="w-full h-auto block min-w-[800px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feFlood floodColor="white" floodOpacity="1" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="EventChartContent" transform="translate(2, 2)">
            {/* Year Header */}
            {years.map((year, i) => (
              <g key={`year-${i}`} transform={`translate(${year.x}, 0)`}>
                <rect
                  fill="#0d6efd"
                  x="0"
                  y="0"
                  width={year.width}
                  height="11"
                  style={{
                    paintOrder: "stroke",
                    stroke: "rgb(255, 255, 255)",
                    strokeOpacity: 1,
                    strokeLinejoin: "round",
                  }}
                />
                <text
                  x={year.width / 2}
                  y="9"
                  fill="white"
                  style={{
                    fill: "rgb(255, 255, 255)",
                    fontSize: "10px",
                    fontWeight: 700,
                    textAnchor: "middle",
                    whiteSpace: "pre",
                  }}
                >
                  {year.year}
                </text>
              </g>
            ))}

            {/* Month Header */}
            {months.map((month, i) => (
              <g key={`month-${i}`} transform={`translate(${month.x}, 11)`}>
                <rect
                  fill="#0d6efd"
                  x="0"
                  y="0"
                  width={month.width}
                  height="11"
                  style={{
                    paintOrder: "stroke",
                    stroke: "rgb(255, 255, 255)",
                    strokeOpacity: 1,
                    strokeLinejoin: "round",
                  }}
                />
                <text
                  x={month.width / 2}
                  y="8"
                  fill="white"
                  style={{
                    fill: "rgb(255, 255, 255)",
                    fontSize: "8px",
                    fontWeight: 700,
                    textAnchor: "middle",
                    whiteSpace: "pre",
                  }}
                >
                  {month.name}
                </text>
              </g>
            ))}

            {/* Event Slices */}
            {slices.map((slice, i) => (
              <g
                key={i}
                onMouseEnter={() => setHoveredEvent(slice)}
                onMouseLeave={() => setHoveredEvent(null)}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <rect
                  x={slice.x}
                  y={slice.y}
                  width={Math.max(1, slice.width)} // Ensure visibility
                  height="15"
                  fill={slice.fill}
                >
                  <title>{`${slice.EventName || "Event"}: ${slice.EventDescription || ""} (${slice.formattedDate})`}</title>
                </rect>
              </g>
            ))}

            {/* Smart Summary Row */}
            <g transform={`translate(0, ${totalHeight - 30})`}>
              <rect
                width={totalWidth}
                height="20"
                fill="#f0f0f0"
                opacity="0.5"
              />
              <g transform="translate(0,0)">
                <rect width="80" height="20" fill="#4B0082" rx="4" />
                <text x="5" y="14" fill="white" fontSize="10" fontWeight="bold">
                  Σ Smart Summary
                </text>
              </g>
            </g>
          </g>

          {/* NOW Marker Line */}
          {nowX >= 0 && nowX <= totalWidth && (
            <g>
              <line
                x1={nowX}
                y1="25"
                x2={nowX}
                y2={totalHeight - 30}
                stroke="darkblue"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <rect
                x={nowX - 20}
                y={totalHeight - 25}
                width="40"
                height="20"
                rx="4"
                fill="darkblue"
              />
              <text
                x={nowX}
                y={totalHeight - 11}
                fill="white"
                fontSize="10"
                textAnchor="middle"
                fontWeight="bold"
              >
                NOW
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* 3. Footer Tag */}
      <div className="mt-2 flex items-center justify-between">
        <div className="bg-[#1a237e] text-white text-[11px] font-bold px-2 py-1 rounded-sm flex items-center gap-1 shadow-sm">
          <Iconify icon="mdi:sigma" width={14} /> SMART SUMMARY
        </div>
        <div className="text-[10px] text-gray-500">{slices.length} events</div>
      </div>
    </div>
  );
}
