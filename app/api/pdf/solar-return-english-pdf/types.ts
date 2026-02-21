export interface SolarReturnRequest {
  name: string;
  date_of_birth: string; // DD-MM-YYYY
  time_of_birth: string; // HH:MM or HH:MM AM/PM
  place_of_birth: string;
  latitude: string;
  longitude: string;
  timezone: string;
  solar_return_year?: number; // Optional, defaults to current/next
  language?: string;
  house_system?: string; // placidus, koch, etc.
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  isRetro: boolean;
  speed?: number;
}

export interface HouseCusp {
  house: number;
  sign: string;
  degree: number;
}

export interface Aspect {
  planet1: string;
  planet2: string; // Natal planet if SR-Natal aspect
  aspect: string;
  orb: number;
  nature?: "Dynamic" | "Harmony" | "Challenging" | "Opportunity" | "Tension";
  interpretation?: string; // Calculated or fetched text
}

export interface NatalData {
  planets: PlanetPosition[];
  cusps: HouseCusp[];
  wheel_image?: Uint8Array;
}

export interface SolarReturnData {
  return_date: string; // ISO or formatted
  planets: PlanetPosition[];
  cusps: HouseCusp[];
  aspects: Aspect[];
  wheel_image?: Uint8Array;
}

export interface PdfGenerationData {
  user: {
    name: string;
    dob: string;
    tob: string;
    pob: string;
  };
  year_range: string;
  natal: NatalData;
  solar: SolarReturnData;
}
