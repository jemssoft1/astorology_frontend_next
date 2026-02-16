"use client";

import { useState, useEffect, Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import TimeLocationInput from "@/components/TimeLocationInput";
import Iconify from "@/components/Iconify";
import Swal from "sweetalert2";
import { astroweb } from "@/lib/astroweb";
import { Person, Gender } from "@/lib/models";
import { CommonTools } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

function EditPersonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const personId = searchParams.get("SelectedPersonStorageKey"); // Using PersonId as key mainly

  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("Male");
  const [timeLocation, setTimeLocation] = useState<any>(null);
  const [originalPerson, setOriginalPerson] = useState<Person | null>(null);

  useEffect(() => {
    async function loadPerson() {
      if (!personId) {
        Swal.fire("Error", "No person selected", "error");
        router.push("/person-list"); // Redirect if no ID
        return;
      }

      CommonTools.ShowLoading();
      // Fetch person list to find the person (Private list usually)
      const list = await astroweb.FetchPersonListFromAPI("private");
      const found = list?.find((p) => p.PersonId === personId);

      if (found) {
        setOriginalPerson(found);
        setName(found.Name);
        setGender(found.Gender as Gender);

        // Parse BirthTime to TimeLocationData format
        // Parse BirthTime (ISO string) to TimeLocationData format
        const birthDate = new Date(found.BirthTime);
        if (!isNaN(birthDate.getTime())) {
          setTimeLocation({
            locationName: found.BirthLocation,
            latitude: found.Latitude,
            longitude: found.Longitude,
            year: birthDate.getFullYear(),
            month: birthDate.getMonth() + 1,
            date: birthDate.getDate(),
            hour: birthDate.getHours(),
            minute: birthDate.getMinutes(),
            timezoneOffset: found.TimezoneOffset,
          });
        }
      } else {
        Swal.fire("Error", "Person not found", "error");
      }
      CommonTools.HideLoading();
    }
    loadPerson();
  }, [personId, router]);

  const handleSave = async () => {
    if (!name || !timeLocation || !timeLocation.locationName || !originalPerson)
      return;

    CommonTools.ShowLoading();
    try {
      const offset = timeLocation.timezoneOffset;
      const timeStr = `${timeLocation.hour.toString().padStart(2, "0")}:${timeLocation.minute.toString().padStart(2, "0")}`;
      const dateStr = `${timeLocation.date.toString().padStart(2, "0")}/${timeLocation.month.toString().padStart(2, "0")}/${timeLocation.year}`;
      const timeUrl = `Location/${CommonTools.toUrlSafe(timeLocation.locationName)}/Time/${timeStr}/${dateStr}/${offset}`;

      const updateUrl = `${astroweb.ApiDomain}/Calculate/UpdatePerson/OwnerId/${originalPerson.OwnerId}/PersonId/${originalPerson.PersonId}/${timeUrl}/PersonName/${name}/Gender/${gender}/Notes/-`;

      const response = await fetch(updateUrl);
      const data = await response.json();

      if (data.Status === "Pass") {
        Swal.fire("Success", "Person updated successfully!", "success");
        // Clear cache if needed?
        // astroweb.CacheKeys.PRIVATE ...
        router.push("/person-list");
      } else {
        throw new Error(data.Payload);
      }
    } catch (e: any) {
      Swal.fire("Error", e.message, "error");
    } finally {
      CommonTools.HideLoading();
    }
  };

  const handleDelete = async () => {
    if (!originalPerson) return;

    const result = await Swal.fire({
      title: "Delete Person?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      CommonTools.ShowLoading();
      try {
        const url = `${astroweb.ApiDomain}/Calculate/DeletePerson/OwnerId/${originalPerson.OwnerId}/PersonId/${originalPerson.PersonId}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Status === "Pass") {
          Swal.fire("Deleted!", "Person has been deleted.", "success");
          router.push("/person-list");
        } else {
          throw new Error(data.Payload);
        }
      } catch (e: any) {
        Swal.fire("Error", e.message, "error");
      } finally {
        CommonTools.HideLoading();
      }
    }
  };

  if (!originalPerson) {
    return <div className="container p-5 text-center">Loading...</div>;
  }

  return (
    <div className="container">
      <PageHeader
        title="Edit Person"
        description="Edit existing person profile"
      />
      <div className="row">
        <div className="col-md-8">
          <div className="vstack gap-3">
            <div className="input-group">
              <span
                className="input-group-text gap-2"
                style={{ width: "136px" }}
              >
                Name
              </span>
              <input
                type="text"
                className="form-control fw-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <TimeLocationInput
              value={timeLocation}
              onChange={setTimeLocation}
            />

            <div className="input-group">
              <label
                className="input-group-text gap-2"
                style={{ width: "165px" }}
              >
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

            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-danger" onClick={handleDelete}>
                <Iconify icon="mdi:delete" /> Delete
              </button>
              <button className="btn btn-success" onClick={handleSave}>
                <Iconify icon="bx:save" /> Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditPerson() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPersonContent />
    </Suspense>
  );
}
