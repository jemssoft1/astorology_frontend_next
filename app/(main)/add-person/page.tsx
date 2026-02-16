"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import TimeLocationInput from "@/components/TimeLocationInput";
import Iconify from "@/components/Iconify";
import Swal from "sweetalert2";
import { astroweb } from "@/lib/astroweb";
import { Person, Gender } from "@/lib/models";
import { CommonTools } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AddPerson() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("Male");
  const [timeLocation, setTimeLocation] = useState<any>(null);

  const handleSave = async () => {
    if (!name || !timeLocation || !timeLocation.locationName) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    CommonTools.ShowLoading();

    try {
      // Construct time URL format expected by API
      // Format: Location/City/Time/HH:mm/dd/MM/yyyy/Offset
      // Location/Singapore/Time/14:30/24/06/2024/+08:00
      const offset = timeLocation.timezoneOffset;
      const timeStr = `${timeLocation.hour.toString().padStart(2, "0")}:${timeLocation.minute.toString().padStart(2, "0")}`;
      const dateStr = `${timeLocation.date.toString().padStart(2, "0")}/${timeLocation.month.toString().padStart(2, "0")}/${timeLocation.year}`;

      // Note: The API likely expects the full URL structure for BirthTime
      // In legacy AddPersonViaApi:
      // `/${timeUrl}` where timeUrl is `person.BirthTime.ToUrl()`
      // We need to replicate ToUrl: "Location/{Name}/Time/{Time}/{Date}/{Offset}"
      // Note: API might handle Lat/Long or just Name. Legacy uses Name.
      // We'll use Name for now.
      const timeUrl = `Location/${CommonTools.toUrlSafe(timeLocation.locationName)}/Time/${timeStr}/${dateStr}/${offset}`;

      const response = await fetch(
        `${astroweb.ApiDomain}/Calculate/AddPerson/OwnerId/${astroweb.IsGuestUser() ? astroweb.VisitorId : astroweb.UserId}/${timeUrl}/PersonName/${name}/Gender/${gender}/Notes/-`,
      );
      const data = await response.json();

      if (data.Status === "Pass") {
        Swal.fire("Success", "Person added successfully!", "success");
        router.push("/person-list"); // Redirect to person list
      } else {
        throw new Error(data.Payload);
      }
    } catch (e: any) {
      Swal.fire("Error", e.message || "Failed to add person", "error");
    } finally {
      CommonTools.HideLoading();
    }
  };

  return (
    <div className="container">
      <PageHeader
        title="Add Person"
        description="Create a new person profile"
      />

      <div className="row">
        <div className="col-md-8">
          <div className="vstack gap-3">
            {/* NAME */}
            <div className="input-group">
              <span
                className="input-group-text gap-2"
                style={{ width: "136px" }}
              >
                <Iconify
                  icon="flat-color-icons:butting-in"
                  width={35}
                  height={35}
                />
                Name
              </span>
              <input
                type="text"
                className="form-control fw-bold"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* TIME & LOCATION */}
            <TimeLocationInput onChange={setTimeLocation} />

            {/* GENDER */}
            <div className="input-group">
              <label
                className="input-group-text gap-2"
                style={{ width: "165px" }}
              >
                <Iconify icon="mdi:human-male-female" width={34} height={34} />
                Gender
              </label>
              <select
                className="form-select fw-bold"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* SAVE BUTTON */}
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-success d-flex align-items-center gap-2"
                onClick={handleSave}
              >
                <Iconify icon="bx:save" width={24} height={24} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
