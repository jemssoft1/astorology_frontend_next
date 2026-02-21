export interface SynastryRequest {
  person1: {
    name: string;
    date_of_birth: string; // DD-MM-YYYY
    time_of_birth: string; // HH:MM or HH:MM AM/PM
    place_of_birth: string;
    latitude: string;
    longitude: string;
    timezone: string;
  };
  person2: {
    name: string;
    date_of_birth: string;
    time_of_birth: string;
    place_of_birth: string;
    latitude: string;
    longitude: string;
    timezone: string;
  };
  language?: string;
  house_system?: string; // placidus
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

export interface SynastryAspect {
  planet1: string; // From Person 1
  planet2: string; // From Person 2
  aspect: string;
  orb: number;
  nature: "Dynamic" | "Harmony" | "Challenging" | "Opportunity" | "Tension";
  interpretation: string;
}

export interface SynastryHouseOverlay {
  planet: string; // From Person 1
  houseInP2: number; // Which house of Person 2 it falls into
  sign: string;
  degree: number;
  interpretation: string;
}

export interface NatalData {
  planets: PlanetPosition[];
  cusps: HouseCusp[];
  wheel_image?: Uint8Array;
}

export interface SynastryData {
  aspects: SynastryAspect[];
  overlays: SynastryHouseOverlay[]; // P1 planets in P2 houses
  overlaysReverse: SynastryHouseOverlay[]; // P2 planets in P1 houses (optional, but good for full report)
  biwheel_image?: Uint8Array;
}
