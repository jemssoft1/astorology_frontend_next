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
  "/": { icon: "ant-design:home-twotone", text: "Home" },
  "/match-checker": {
    icon: "bi:arrow-through-heart-fill",
    text: "Match Checker",
  },
  "/life-predictor": { icon: "gis:map-time", text: "Life Predictor" },
  "/horoscope": { icon: "fluent:book-star-20-filled", text: "Horoscope" },
  "/good-time-finder": { icon: "svg-spinners:clock", text: "Good Time Finder" },
  "/api-builder": { icon: "mdi:cloud-tags", text: "API Builder" },

  // Numerology
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
    text: "Western Numerology",
    category: "Numerology",
  },

  // Astrology Systems
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

  "/daily-nakshatra-predictions": {
    icon: "mdi:star-shooting",
    text: "Daily Nakshatra",
  },
  "/mini-calculators": {
    icon: "fluent:calculator-multiple-20-regular",
    text: "Mini Calculators",
  },
  "/ashtakvarga": {
    icon: "fluent:calculator-multiple-20-regular",
    text: "Ashtakvarga",
  },
   "/daily-horoscope": {
    icon: "fluent:calculator-multiple-20-regular",
    text: "Daily Horoscope",
  },
  "/indian-calender": { icon: "mdi:calendar-month", text: "Indian Calendar" },
  "/about": { icon: "mdi:information", text: "About" },
  "/contact-us": { icon: "mdi:email", text: "Contact Us" },
  "/donate": { icon: "mdi:hand-heart", text: "Donate" },
  "/privacy-policy": { icon: "mdi:shield-lock", text: "Privacy Policy" },
  "/terms-of-service": { icon: "mdi:file-document", text: "Terms of Service" },
  "/remedy": { icon: "mdi:meditation", text: "Remedy" },
  "/match-finder": { icon: "mdi:account-search", text: "Match Finder" },
  "/birth-time-finder": {
    icon: "mdi:clock-time-four",
    text: "Birth Time Finder",
  },
  "/Natal-Chart": {
    icon: "mdi:zodiac-aquarius",
    text: "Natal Chart (Western)",
    category: "Astrology Systems",
  },
  "/events-chart-viewer": {
    icon: "mdi:chart-timeline-variant",
    text: "Events Chart Viewer",
  },
  "/person-list": { icon: "mdi:account-group", text: "Person List" },
};

// Category icons
const categoryIcons: Record<string, string> = {
  Numerology: "mdi:numeric",
  "Astrology Systems": "mdi:chart-arc",
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
  "/person-list",
  "/contact-us",
  "/privacy-policy",
  "/donate",
  "/mini-calculators",
  "/remedy",
  "/terms-of-service",
  "/about",
  "/match-finder",
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
