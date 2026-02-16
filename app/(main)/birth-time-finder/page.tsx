"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import PersonSelector from "@/components/PersonSelector";
import Iconify from "@/components/Iconify";
import Swal from "sweetalert2";
import { astroweb } from "@/lib/astroweb";
import { Person } from "@/lib/models";
import { CommonTools } from "@/lib/utils"; // Verify this import

export default function BirthTimeFinder() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [method, setMethod] = useState("Animal");
  const [result, setResult] = useState<any>(null);

  const handleCalculate = async () => {
    if (!selectedPerson) {
      Swal.fire("Error", "Please select a person first", "error");
      return;
    }

    CommonTools.ShowLoading();
    try {
      // Parse BirthTime (ISO string) and adjust for Timezone
      // We need Local Time components for the API URL
      const utcDate = new Date(selectedPerson.BirthTime);
      const offsetStr = selectedPerson.TimezoneOffset || "+00:00";

      // Parse offset string (e.g., "+05:30" or "-04:00")
      const offsetSign = offsetStr.startsWith("-") ? -1 : 1;
      const [offHours, offMins] = offsetStr
        .replace(/[+-]/, "")
        .split(":")
        .map(Number);
      const totalOffsetMinutes = offsetSign * (offHours * 60 + offMins);

      // Add offset to UTC time to get Local Time in UTC reference
      const localEpoch = utcDate.getTime() + totalOffsetMinutes * 60 * 1000;
      const localDate = new Date(localEpoch);

      // Use getUTC* methods on the shifted date to get Local components
      const timePart = `${localDate.getUTCHours().toString().padStart(2, "0")}:${localDate.getUTCMinutes().toString().padStart(2, "0")}`;
      const datePart = `${localDate.getUTCDate().toString().padStart(2, "0")}/${(localDate.getUTCMonth() + 1).toString().padStart(2, "0")}/${localDate.getUTCFullYear()}`;
      // Ensure offset is URL safe (replace + with %2B if needed, but encodeURIComponent handles it)
      const offsetPart = offsetStr;

      const locName = selectedPerson.BirthLocation || "Unknown";

      // URL: Location/City/Time/HH:mm/dd/MM/yyyy/Offset
      // Use helper to encode components
      const timeUrl = `Location/${encodeURIComponent(locName)}/Time/${timePart}/${datePart}/${encodeURIComponent(offsetPart)}`;

      // Use local proxy /api/Calculate instead of direct astroweb.ApiDomain
      const response = await fetch(`/api/Calculate/${method}/${timeUrl}`, {
        headers: astroweb.getAuthHeaders(), // Include auth headers
      });

      const data = await response.json();

      if (data.Status === "Pass") {
        setResult(data.Payload[method]);
      } else {
        throw new Error(data.Payload || data.message || "Calculation failed");
      }
    } catch (e: any) {
      console.error("Calculation Error:", e);
      Swal.fire("Error", e.message || "Calculation failed", "error");
    } finally {
      CommonTools.HideLoading();
    }
  };

  return (
    <div className="container">
      <PageHeader
        title="Birth Time Finder"
        description="Find forgotten or lost birth time using advanced algorithms."
        imageSrc="/images/birth-time-finder-card.jpg"
      />

      <div className="row">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <div className="mb-3">
              <label className="form-label">Method</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Iconify icon="gridicons:types" />
                </span>
                <select
                  className="form-select"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="Animal">Constellation Animal</option>
                  <option value="RisingSign">Rising Sign (Lagna)</option>
                </select>
              </div>
            </div>

            <PersonSelector onPersonSelected={setSelectedPerson} />

            <button
              className="btn btn-success d-flex align-items-center gap-2 mt-3"
              onClick={handleCalculate}
            >
              <Iconify icon="uim:process" width={20} height={20} />
              Calculate
            </button>
          </div>
        </div>

        <div className="col-md-6 mt-4 mt-md-0">
          {result && (
            <div className="alert alert-success mt-0">
              <h4 className="alert-heading">Result:</h4>
              <p className="mb-0 fs-5">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
