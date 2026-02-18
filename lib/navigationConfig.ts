export interface NavLink {
  url?: string;
  icon: string;
  text: string;
  children?: NavLink[];
}

// Route configuration with icons and categories
const routeMetadata: Record<
  string,
  { icon: string; text: string; category?: string }
> = {
  // --- General / Dashboard ---
  "/": { icon: "ant-design:home-twotone", text: "Home" },

  // --- Horoscopes ---
  "/horoscope": {
    icon: "fluent:book-star-20-filled",
    text: "Horoscope",
    category: "Horoscopes",
  },
  "/daily-horoscope": {
    icon: "mdi:forecast",
    text: "Daily Horoscope",
    category: "Horoscopes",
  },
  "/daily-nakshatra-predictions": {
    icon: "mdi:star-shooting",
    text: "Daily Nakshatra",
    category: "Horoscopes",
  },

  // --- Predictions ---
  "/life-predictor": {
    icon: "gis:map-time",
    text: "Life Predictor",
    category: "Predictions",
  },
  "/basic-astro-details": {
    icon: "mdi:script-text-outline",
    text: "Basic Astro Details",
    category: "Predictions",
  },
  "/suggestions-and-remedies": {
    icon: "mdi:script-text-outline",
    text: "Remedies",
    category: "Predictions",
  },
  // --- Match Making ---
  "/match-checker": {
    icon: "bi:arrow-through-heart-fill",
    text: "Match Checker",
    category: "Match Making",
  },

  // --- Numerology ---
  "/numerology": {
    icon: "mdi:calendar-account",
    text: "Birth Numerology",
    category: "Numerology",
  },
  "/name-numerology": {
    icon: "mdi:format-letter-case",
    text: "Name Numerology",
    category: "Numerology",
  },
  "/Numerology-weston": {
    icon: "mdi:earth",
    text: " Numerology",
    category: "Western Astrology",
  },

  // --- Astrology Systems ---
  "/vimshottari-dasha": {
    icon: "mdi:timer-sand",
    text: "Vimshottari Dasha",
    category: "Astrology Systems",
  },
  "/lalkitab": {
    icon: "mdi:book-open-page-variant",
    text: "Lal Kitab",
    category: "Astrology Systems",
  },
  "/kp-system": {
    icon: "mdi:star-circle",
    text: "KP System",
    category: "Astrology Systems",
  },
  "/yogini-dasha": {
    icon: "mdi:star-circle",
    text: "Yogini Dasha",
    category: "Astrology Systems",
  },
  "/ashtakvarga": {
    icon: "fluent:calculator-multiple-20-regular",
    text: "Ashtakvarga",
    category: "Astrology Systems",
  },

  // --- Western Astrology ---
  "/Natal-Chart": {
    icon: "mdi:chart-bubble",
    text: "Natal Chart",
    category: "Western Astrology",
  },
  "/LoveCompatibilityPage": {
    icon: "mdi:heart-multiple",
    text: "Love Compatibility",
    category: "Western Astrology",
  },
  "/PersonalityPage": {
    icon: "mdi:account-box-multiple",
    text: "Personality",
    category: "Western Astrology",
  },
  "/TransitsPage": {
    icon: "mdi:orbit",
    text: "Transits",
    category: "Western Astrology",
  },
  "/solar-return": {
    icon: "mdi:orbit",
    text: "Solar Return",
    category: "Western Astrology",
  },
  // --- Tools & Utilities ---
  "/indian-calender": {
    icon: "mdi:calendar-month",
    text: "Indian Calendar",
    category: "Tools",
  },

  "/api-builder": {
    icon: "mdi:cloud-tags",
    text: "API Builder",
    category: "Tools",
  },

  // --- Other (Hidden/Footer) ---
  "/about": { icon: "mdi:information", text: "About" },
  "/contact-us": { icon: "mdi:email", text: "Contact Us" },
  "/donate": { icon: "mdi:hand-heart", text: "Donate" },
  "/privacy-policy": { icon: "mdi:shield-lock", text: "Privacy Policy" },
  "/terms-of-service": { icon: "mdi:file-document", text: "Terms of Service" },
  "/remedy": { icon: "mdi:meditation", text: "Remedy" },
};

// Category icons
const categoryIcons: Record<string, string> = {
  Horoscopes: "mdi:weather-night",
  Predictions: "mdi:crystal-ball",
  "Match Making": "mdi:heart-multiple",
  Numerology: "mdi:numeric",
  "Astrology Systems": "mdi:chart-arc",
  "Western Astrology": "mdi:zodiac-leo",
  Tools: "mdi:tools",
};

// Routes to exclude from sidebar
const excludedRoutes = [
  "/login",
  "/register-subscription",
  "/thank-you",
  "/coming-soon",
  "/api-home",
  "/made-on-earth",
  "/now-in-dwapara",
  "/add-person",
  "/edit-person",
  "/contact-us",
  "/privacy-policy",
  "/donate",
  "/remedy",
  "/terms-of-service",
  "/about",
];

/**
 * Generates navigation links from route metadata
 * This function automatically organizes routes into categories
 */
export function getNavigationLinks(): NavLink[] {
  const routes: NavLink[] = [];
  const categorizedRoutes: Record<string, NavLink[]> = {};

  // Process all routes from metadata
  Object.entries(routeMetadata).forEach(([path, metadata]) => {
    // Skip excluded routes
    if (excludedRoutes.includes(path)) {
      return;
    }

    const route: NavLink = {
      url: path,
      icon: metadata.icon,
      text: metadata.text,
    };

    // Categorize routes
    if (metadata.category) {
      if (!categorizedRoutes[metadata.category]) {
        categorizedRoutes[metadata.category] = [];
      }
      categorizedRoutes[metadata.category].push(route);
    } else {
      routes.push(route);
    }
  });

  // Add categorized routes as parent items with children
  Object.entries(categorizedRoutes).forEach(([category, children]) => {
    routes.push({
      icon: categoryIcons[category] || "mdi:folder",
      text: category,
      children: children,
    });
  });

  return routes;
}

/**
 * Add a new route to the configuration
 * Call this function when you create a new page
 */
export function addRoute(
  path: string,
  icon: string,
  text: string,
  category?: string,
) {
  routeMetadata[path] = { icon, text, category };
}
