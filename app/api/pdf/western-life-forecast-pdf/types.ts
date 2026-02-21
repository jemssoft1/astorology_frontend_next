export interface TransitRequest {
  name: string;
  date_of_birth: string; // DD-MM-YYYY
  time_of_birth: string; // HH:MM AM/PM
  place_of_birth: string;
  latitude: string;
  longitude: string;
  timezone: string;
  forecast_start: string; // DD-MM-YYYY
  forecast_end: string; // DD-MM-YYYY
  house_system?: string;
  zodiac_type?: string;
  language?: string;
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  isRetro: boolean;
}

export interface HouseCusp {
  house: number;
  sign: string;
  degree: number;
}

export interface TransitAspect {
  planet: string;       // Transiting Planet
  aspect: string;       // Conjunction, Square, etc.
  natal_planet: string; // Natal Planet
  orb: number;
  date: string;         // Exact date string
  nature: string;       // Dynamic, Harmony, Tension, Challenging
  interpretation?: {
    psychological?: string;
    external?: string;
    practical?: string;
    growth?: string;
  }; 
}

export interface NatalData {
  planets: PlanetPosition[];
  cusps: HouseCusp[];
  wheel_image?: string | Uint8Array; // Base64 or Buffer
}
