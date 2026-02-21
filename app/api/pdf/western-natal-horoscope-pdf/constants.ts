// constants.ts — Static text, labels, and styling for Western Natal Horoscope PDF

export const COLORS = {
  primary: [40, 60, 100] as [number, number, number], // Dark Blue
  secondary: [200, 150, 50] as [number, number, number], // Gold
  accent: [240, 240, 245] as [number, number, number], // Light Background
  text: [40, 40, 40] as [number, number, number], // Dark Gray
  lightText: [100, 100, 100] as [number, number, number], // Medium Gray
  white: [255, 255, 255] as [number, number, number],
  error: [200, 50, 50] as [number, number, number],
};

export const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export const PLANETS = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
  "Chiron",
  "Node",
  "Lilith",
  "Ascendant",
  "MC",
];

export const ZODIAC_ICONS: Record<string, string> = {
  Aries: "a",
  Taurus: "s",
  Gemini: "d",
  Cancer: "f",
  Leo: "g",
  Virgo: "h",
  Libra: "j",
  Scorpio: "k",
  Sagittarius: "l",
  Capricorn: "z",
  Aquarius: "x",
  Pisces: "c",
};

export const PLANET_ICONS: Record<string, string> = {
  Sun: "Q",
  Moon: "W",
  Mercury: "E",
  Venus: "R",
  Mars: "T",
  Jupiter: "Y",
  Saturn: "U",
  Uranus: "I",
  Neptune: "O",
  Pluto: "P",
  Node: "{",
  Lilith: "`",
  Chiron: "q", // Chiron mapping fallback
  Ascendant: "A",
  MC: "M",
};

export const ASPECT_ICONS: Record<string, string> = {
  Conjunction: "q",
  Square: "r",
  Trine: "e",
  Opposition: "w",
  Sextile: "t",
};

export const TEXT = {
  intro: {
    title: "Dear",
    subtitle: "Welcome to your Personalized Birth Chart Report",
    p1: "Astrology is an ancient practice that interprets the influence of the cosmos on our lives. Your birth chart is a snapshot of the sky at the exact moment you took your first breath. It reveals the unique blueprint of your personality, your potential, and your life path.",
    title2: "How This Report is Prepared",
    p2: "This report is crafted using precise astronomical calculations based on your date, time, and place of birth. We observe the positions of the planets in the zodiac signs and the astrological houses, as well as the geometric relationships (aspects) between them.",
    p3: "We hope this report serves as a valuable guide for self-discovery, helping you understand your strengths, challenges, and the cosmic energies that shape your destiny.",
  },
  houseDescriptions: [
    "The 1st House represents the Self, physical appearance, personality, and how you present yourself to the world.",
    "The 2nd House represents possessions, values, finances, and self-worth.",
    "The 3rd House represents communication, siblings, short trips, and early education.",
    "The 4th House represents home, family, roots, ancestry, and your inner emotional foundation.",
    "The 5th House represents creativity, self-expression, romance, fun, children, and risk-taking.",
    "The 6th House represents daily work, health, routines, service, and self-improvement.",
    "The 7th House represents partnerships, marriage, business contracts, and open enemies.",
    "The 8th House represents transformation, shared resources, intimacy, death, and regeneration.",
    "The 9th House represents philosophy, higher education, travel, religion, and the search for meaning.",
    "The 10th House represents career, public recognition, status, ambition, and authority.",
    "The 11th House represents friendships, groups, community, hopes, and future goals.",
    "The 12th House represents the unconscious, hidden things, spirituality, karma, and letting go.",
  ],
  fallback: {
    planet:
      "The position of this planet adds a unique flavor to your personality chart.",
    aspect:
      "This aspect creates a specific dynamic between two planetary energies in your life.",
    retro:
      "Retrograde motion indicates an internalized expression of this planet's energy.",
    emptyHouse:
      "This house has no planets, but the sign on the cusp still flavors this area of your life.",
  },
};
