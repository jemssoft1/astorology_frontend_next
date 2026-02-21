const fs = require("fs");
let code = fs.readFileSync(
  "app/api/pdf/basic-horoscope-pdf/pdf-pages.ts",
  "utf8",
);

const interfaces = `
export interface AstroPlanet {
  name?: string;
  Name?: string;
  planet?: string | number;
  isRetro?: boolean | string;
  is_retro?: boolean;
  isRetrograde?: boolean;
  sign?: unknown;
  normDegree?: number | string;
  fullDegree?: number | string;
  norm_degree?: number;
  full_degree?: number;
  longitude?: { totalDegrees?: number };
  signLord?: string;
  sign_lord?: string;
  nakshatra?: string;
  Nakshatra?: string;
  nakshatraLord?: string;
  nakshatra_lord?: string;
  house?: string | number;
  House?: string | number;
  [key: string]: unknown;
}

export interface AstroApiData {
  astro_details?: Record<string, unknown>;
  ghat_chakra?: Record<string, unknown>;
  planets?: { data?: AstroPlanet[] } | AstroPlanet[];
  planets_extended?: AstroPlanet[];
  lagna?: { sign?: unknown };
  ascendant?: unknown;
  sadhesati_current_status?: Record<string, unknown> & { what_is_sadhesati?: string };
  manglik?: Record<string, unknown>;
  simple_manglik?: Record<string, unknown>;
  kalsarpa_details?: Record<string, unknown>;
  basic_gem_suggestion?: Record<string, { name?: string; [key: string]: unknown }>;
  major_vdasha?: Record<string, unknown>;
  current_vdasha?: Record<string, unknown>;
  major_yogini_dasha?: Record<string, unknown>;
  sub_yogini_dasha?: Record<string, unknown>;
  current_yogini_dasha?: Record<string, unknown>;
  kp_house_cusps?: unknown[];
  numero_table?: unknown;
  numero_report?: unknown;
  numero_fav_time?: unknown;
  numero_fav_lord?: unknown;
  numero_fav_mantra?: unknown;
  [key: string]: unknown;
}
`;

code = code.replace(
  'import { isDevanagari, setHindiFont } from "./font-loader";',
  'import { isDevanagari, setHindiFont } from "./font-loader";\n' + interfaces,
);

// Replace Record<string, any> with AstroApiData
code = code.replace(/Record<string, any>/g, "AstroApiData");

// Replace doc: any with doc: jsPDF
code = code.replace(/doc:\s*any/g, "doc: jsPDF");

// Replace L: any with L: Labels
code = code.replace(/L:\s*any/g, "L: Labels");

// Replace (p: any) with (p: AstroPlanet)
code = code.replace(/\(p:\s*any\)/g, "(p: AstroPlanet)");

// Replace (planet: any) with (planet: AstroPlanet)
code = code.replace(/\(planet:\s*any\)/g, "(planet: AstroPlanet)");

// Replace obj: any with obj: Record<string, unknown>
code = code.replace(
  /obj:\s*any/g,
  "obj: Record<string, unknown> | null | undefined",
);

// Replace signData: any with signData: unknown
code = code.replace(/signData:\s*any/g, "signData: unknown");

// Replace any[] with AstroPlanet[]
code = code.replace(/any\[\]/g, "AstroPlanet[]");

// Fix specific inline any left overs
code = code.replace(/kalsarpaData:\s*any,/g, "kalsarpaData: AstroApiData,");
code = code.replace(/apiData:\s*any,/g, "apiData: AstroApiData,");
code = code.replace(/manglikData:\s*any,/g, "manglikData: AstroApiData,");
code = code.replace(/gemData:\s*any,/g, "gemData: AstroApiData,");
code = code.replace(
  /simpleManglikParam:\s*any,/g,
  "simpleManglikParam: AstroApiData,",
);

fs.writeFileSync("app/api/pdf/basic-horoscope-pdf/pdf-pages.ts", code);
console.log("Replaced any with typed interfaces in pdf-pages.ts");
