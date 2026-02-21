export const COLORS = {
  primary: [231, 76, 60], // Passion Red / Love
  secondary: [44, 62, 80], // Deep Blue
  accent: [241, 196, 15], // Golden
  text: [50, 50, 50],
  background: [255, 255, 255],
  lightGray: [245, 245, 245],
  tables: {
    header: [231, 76, 60],
    alternateRow: [253, 237, 236], // Light Reddish
  },
};

export const TEXT = {
  title: "SYNASTRY REPORT",
  subtitle: "Your Astrological Portrait",
  intro: {
    title: "What is Synastry?",
    content: [
      "Synastry is the art of relationship astrology. It is the study of how planetary forces in one chart interact with those in another. It reveals the chemistry, dynamics, and potential challenges between two people.",
      "Astrology is not fortune-telling. It is a tool for character analysis and self-awareness. In relationships, it helps us understand not just who we are, but how we affect each other.",
      "This report explores the energy flow between you and your partner. Remember: 'The wise man rules his stars.' Use this knowledge to build understanding and compassion.",
    ],
  },
  footer: "ASTROLOGY API - Premium Synastry Report",
  houseSystemDisclaimer: "NOTE - PLACIDUS SYSTEM OF HOUSE DIVISION IS USED",
  closing: {
    title: "The Dance of Relationship",
    message:
      "Relationships are the mirrors in which we see ourselves. This report has highlighted the cosmic themes at play between you. May this understanding guide you toward greater harmony and mutual growth.",
  },
};

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
  "Node",
  "Chiron",
];

// Fallback Interpretation Generators
export const TEMPLATES = {
  aspect: (p1: string, asp: string, p2: string, nature: string) => {
    const tone =
      nature === "Challenging" || nature === "Tension"
        ? "growth through friction"
        : "natural flow";
    return `When Person 1's ${p1} forms a ${asp} to Person 2's ${p2}, there is a strong energetic connection. This aspect indicates a dynamic of ${tone}.
    
    Psychologically, ${p1} represents the core drive involved, while ${p2} receives this energy.
    In this relationship, this manifests as a specific interaction style where ${p1} themes trigger ${p2} responses.
    
    Key Advice: Understand that this energy is always active. Use awareness to navigate the ${nature} nature of this bond.`;
  },

  houseOverlay: (p1: string, house: number) => {
    const areas = [
      "Identity & Appearance",
      "Values & Money",
      "Communication",
      "Home & Roots",
      "Creativity & Romance",
      "Daily Routine & Health",
      "Partnership",
      "Intimacy & Shared Resources",
      "Beliefs & Travel",
      "Career & Reputation",
      "Friends & Dreams",
      "Subconscious & Secrets",
    ];
    return `Person 1's ${p1} falling into Person 2's ${house} House activates the area of ${areas[house - 1]}.
    
    This placement suggests that Person 1 brings their ${p1} energy directly into this sphere of Person 2's life.
    Person 2 will feel Person 1's influence strongly in matters of ${areas[house - 1]}.
    
    Practical Impact: Person 1 stimulates growth and activity here, which can be supportive or demanding depending on the aspects involved.`;
  },
};
