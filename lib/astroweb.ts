import { Person } from "./models";
import Swal from "sweetalert2";

// ============================================
// CONSTANTS & HELPERS
// ============================================

const ApiDomain = process.env.NEXT_PUBLIC_NEXT_JS_API_URL;

// Gets the user ID from local storage or assigns a guest ID if not present
export function getUserId(): string {
  if (typeof window === "undefined") return "101";
  const storedValue = localStorage.getItem("UserId");
  try {
    return storedValue ? JSON.parse(storedValue) : "101"; // Guest ID is "101"
  } catch (e) {
    return "101"; // Return guest ID on parse error
  }
}

export function setUserId(value: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("UserId", JSON.stringify(value));
  }
}

// Gets or generates a visitor ID for non-logged-in users
export function getVisitorId(): string {
  if (typeof window === "undefined") return "guest-server-side";
  if ("VisitorId" in localStorage) {
    return JSON.parse(localStorage.getItem("VisitorId") || "");
  } else {
    return generateAndSaveVisitorId();
  }
}

export function generateAndSaveVisitorId(): string {
  if (typeof window === "undefined") return "guest-server-side";
  const newVisitorId = `guest-${Math.random().toString(36).substr(2, 15)}`;
  localStorage.setItem("VisitorId", JSON.stringify(newVisitorId));
  return newVisitorId;
}

export function isGuestUser(): boolean {
  return getUserId() === "101";
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("AuthToken");
}

export function setAuthToken(value: string | null): void {
  if (typeof window !== "undefined") {
    if (value) {
      localStorage.setItem("AuthToken", value);
    } else {
      localStorage.removeItem("AuthToken");
    }
  }
}

// Common headers for authenticated requests
export function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ============================================
// PERSON API METHODS
// ============================================

/**
 * GET /person/list/:ownerId?visitorId=xxx
 * Fetches the person list from the API
 */
export async function getPersonList(
  cacheType: "private" | "public",
): Promise<Person[] | null> {
  const userId = getUserId();
  const visitorId = getVisitorId();

  const ownerId =
    cacheType === "private" ? (isGuestUser() ? visitorId : userId) : "101";

  try {
    const response = await fetch(
      `/api/person/list/${ownerId}?visitorId=${visitorId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    const data = await response.json();

    if (data.Status !== "Pass") {
      console.error("API Error:", data);
      return null;
    }

    return data.Payload as Person[];
  } catch (error) {
    console.error("Error fetching person list:", error);
    return null;
  }
}

/**
 * GET /person/list-hash/:ownerId?visitorId=xxx
 * Get hash of person list for cache validation
 */
export async function getPersonListHash(
  cacheType: "private" | "public",
): Promise<string | null> {
  const userId = getUserId();
  const visitorId = getVisitorId();

  const ownerId =
    cacheType === "private" ? (isGuestUser() ? visitorId : userId) : "101";

  try {
    const response = await fetch(
      `/api/person/list-hash/${ownerId}?visitorId=${visitorId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    const data = await response.json();

    if (data.Status !== "Pass") {
      console.error("API Error:", data);
      return null;
    }

    return data.Payload as string;
  } catch (error) {
    console.error("Error fetching person list hash:", error);
    return null;
  }
}

/**
 * GET /person/:ownerId/:personId
 * Get single person by ID
 */
export async function getPerson(
  personId: string,
  ownerId?: string,
): Promise<Person | null> {
  const owner = ownerId || getUserId();

  try {
    const response = await fetch(`/api/person/${owner}/${personId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (data.Status !== "Pass") {
      console.error("API Error:", data);
      return null;
    }

    return data.Payload as Person;
  } catch (error) {
    console.error("Error fetching person:", error);
    return null;
  }
}

/**
 * POST /person/add
 * Add new person
 */
export async function addPerson(person: {
  personName: string;
  birthTime: string;
  gender: "Male" | "Female" | "Other";
  notes?: string;
  birthLocation: string;
  latitude: number;
  longitude: number;
  timezoneOffset: string;
}): Promise<{ success: boolean; personId?: string; error?: string }> {
  const userId = getUserId();

  // Check if trying to add to public profiles
  if (userId === "101" && !isGuestUser()) {
    return {
      success: false,
      error: "You cannot add to public profiles",
    };
  }

  const ownerId = isGuestUser() ? getVisitorId() : userId;

  try {
    const payload = {
      ownerId,
      personName: person.personName,
      birthTime: person.birthTime,
      gender: person.gender,
      notes: person.notes || "",
      birthLocation: person.birthLocation,
      latitude: person.latitude,
      longitude: person.longitude,
      timezoneOffset: person.timezoneOffset,
    };
    const response = await fetch(`/api/person/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data.Status !== "Pass") {
      return {
        success: false,
        error: data.error || data.Payload || "Failed to add person",
      };
    }
    return {
      success: true,
      personId: data.Payload,
    };
  } catch (error: unknown) {
    console.error("Error adding person:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Network error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * POST /person/update
 * Update existing person
 */
export async function updatePerson(person: {
  personId: string;
  personName?: string;
  birthTime?: string;
  gender?: "Male" | "Female" | "Other";
  notes?: string;
  birthLocation?: string;
  latitude?: number;
  longitude?: number;
  timezoneOffset?: string;
}): Promise<{ success: boolean; error?: string }> {
  const ownerId = isGuestUser() ? getVisitorId() : getUserId();

  try {
    const response = await fetch(`/api/person/update`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ownerId,
        personId: person.personId,
        personName: person.personName,
        birthTime: person.birthTime,
        gender: person.gender,
        notes: person.notes,
        birthLocation: person.birthLocation,
        latitude: person.latitude,
        longitude: person.longitude,
        timezoneOffset: person.timezoneOffset,
      }),
    });

    const data = await response.json();

    if (data.Status !== "Pass") {
      return {
        success: false,
        error: data.error || data.Payload || "Failed to update person",
      };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error adding person:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Network error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * DELETE /person/delete/:ownerId/:personId
 * Delete person
 */
export async function deletePerson(
  personId: string,
): Promise<{ success: boolean; error?: string }> {
  const ownerId = isGuestUser() ? getVisitorId() : getUserId();

  try {
    const response = await fetch(`/api/person/delete/${ownerId}/${personId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (data.Status !== "Pass") {
      return {
        success: false,
        error: data.error || data.Payload || "Failed to delete person",
      };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error adding person:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Network error";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ============================================
// HELPER METHODS WITH SWEETALERT
// ============================================

/**
 * Add person with confirmation dialog
 */
export async function addPersonWithConfirm(person: {
  personName: string;
  birthTime: string;
  gender: "Male" | "Female" | "Other";
  notes?: string;
  birthLocation: string;
  latitude: number;
  longitude: number;
  timezoneOffset: string;
}): Promise<boolean> {
  const result = await addPerson(person);

  if (result.success) {
    await Swal.fire({
      icon: "success",
      title: "Person Added!",
      text: `${person.personName} has been added successfully.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return true;
  } else {
    await Swal.fire({
      icon: "error",
      title: "Failed to Add",
      text: result.error || "Something went wrong",
    });
    return false;
  }
}

/**
 * Delete person with confirmation dialog
 */
export async function deletePersonWithConfirm(
  personId: string,
  personName: string,
): Promise<boolean> {
  const confirmResult = await Swal.fire({
    icon: "warning",
    title: "Delete Person?",
    text: `Are you sure you want to delete "${personName}"? This cannot be undone.`,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete!",
    cancelButtonText: "Cancel",
  });

  if (!confirmResult.isConfirmed) {
    return false;
  }

  const result = await deletePerson(personId);

  if (result.success) {
    await Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: `${personName} has been deleted.`,
      timer: 2000,
      showConfirmButton: false,
    });
    return true;
  } else {
    await Swal.fire({
      icon: "error",
      title: "Failed to Delete",
      text: result.error || "Something went wrong",
    });
    return false;
  }
}

/**
 * Update person with confirmation
 */
export async function updatePersonWithConfirm(person: {
  personId: string;
  personName?: string;
  birthTime?: string;
  gender?: "Male" | "Female" | "Other";
  notes?: string;
  birthLocation?: string;
  latitude?: number;
  longitude?: number;
  timezoneOffset?: string;
}): Promise<boolean> {
  const result = await updatePerson(person);

  if (result.success) {
    await Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Person details have been updated.",
      timer: 2000,
      showConfirmButton: false,
    });
    return true;
  } else {
    await Swal.fire({
      icon: "error",
      title: "Failed to Update",
      text: result.error || "Something went wrong",
    });
    return false;
  }
}

// ============================================
// BACKWARD COMPATIBILITY EXPORTS
// ============================================

// Export astroweb class for backward compatibility
export class astroweb {
  static get ApiDomain() {
    return ApiDomain;
  }
  static get UserId() {
    return getUserId();
  }
  static set UserId(value: string) {
    setUserId(value);
  }
  static get VisitorId() {
    return getVisitorId();
  }
  static get AuthToken() {
    return getAuthToken();
  }
  static set AuthToken(value: string | null) {
    setAuthToken(value);
  }

  static generateAndSaveVisitorId = generateAndSaveVisitorId;
  static IsGuestUser = isGuestUser;
  static getAuthHeaders = getAuthHeaders;

  static GetPersonList = getPersonList;
  static GetPersonListHash = getPersonListHash;
  static GetPerson = getPerson;
  static AddPerson = addPerson;
  static UpdatePerson = updatePerson;
  static DeletePerson = deletePerson;

  static AddPersonWithConfirm = addPersonWithConfirm;
  static DeletePersonWithConfirm = deletePersonWithConfirm;
  static UpdatePersonWithConfirm = updatePersonWithConfirm;

  static async FetchPersonListFromAPI(cacheType: "private" | "public") {
    console.warn(
      "FetchPersonListFromAPI is deprecated. Use getPersonList instead.",
    );
    return getPersonList(cacheType);
  }
}

// Default export
export default {
  getUserId,
  setUserId,
  getVisitorId,
  generateAndSaveVisitorId,
  isGuestUser,
  getAuthToken,
  setAuthToken,
  getAuthHeaders,
  getPersonList,
  getPersonListHash,
  getPerson,
  addPerson,
  updatePerson,
  deletePerson,
  addPersonWithConfirm,
  deletePersonWithConfirm,
  updatePersonWithConfirm,
  astroweb, // For backward compatibility
};
