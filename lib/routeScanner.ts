import fs from "fs";
import path from "path";

export interface RouteConfig {
  url?: string;
  icon: string;
  text: string;
  children?: RouteConfig[];
  category?: string;
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
  "/events-chart-viewer": {
    icon: "mdi:chart-timeline-variant",
    text: "Events Chart Viewer",
  },
  "/person-list": { icon: "mdi:account-group", text: "Person List" },
  "/add-person": { icon: "mdi:account-plus", text: "Add Person" },
  "/edit-person": { icon: "mdi:account-edit", text: "Edit Person" },

  // Weston route group pages
  "/PersonalityPage": { icon: "mdi:account-circle", text: "Personality" },
  "/LoveCompatibilityPage": {
    icon: "mdi:heart-multiple",
    text: "Love Compatibility",
  },
  "/Natal-Chart": { icon: "mdi:chart-bubble", text: "Natal Chart" },
  "/Numerology-weston": { icon: "mdi:numeric-9-plus-box", text: "Numerology" },
  "/TransitsPage": { icon: "mdi:orbit", text: "Transits" },
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
];

/**
 * Recursively scans a directory for page.tsx files
 */
function scanDirectory(
  dir: string,
  baseDir: string,
  routes: RouteConfig[],
  categorizedRoutes: Record<string, RouteConfig[]>,
): void {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (!stat.isDirectory()) return;

    // Check if this folder has a page.tsx
    const pagePath = path.join(itemPath, "page.tsx");

    if (fs.existsSync(pagePath)) {
      // Calculate the route path relative to baseDir
      const relativePath = path.relative(baseDir, itemPath);
      // Remove route groups (folders in parentheses) from the path
      const routePath =
        "/" +
        relativePath
          .split(path.sep)
          .filter(
            (segment) => !segment.startsWith("(") || !segment.endsWith(")"),
          )
          .join("/");

      // Skip excluded routes
      if (excludedRoutes.includes(routePath)) {
        return;
      }

      const metadata = routeMetadata[routePath] || {
        icon: "mdi:circle",
        text: formatRouteName(item),
      };

      const route: RouteConfig = {
        url: routePath,
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
    }

    // Recursively scan subdirectories (including route groups)
    scanDirectory(itemPath, baseDir, routes, categorizedRoutes);
  });
}

/**
 * Scans the app/(main) directory for page.tsx files and generates route configuration
 */
export function scanRoutes(): RouteConfig[] {
  const appDir = path.join(process.cwd(), "app", "(main)");
  const routes: RouteConfig[] = [];
  const categorizedRoutes: Record<string, RouteConfig[]> = {};

  // Recursively scan directory for page.tsx files
  scanDirectory(appDir, appDir, routes, categorizedRoutes);

  // Add home route
  routes.unshift({
    url: "/",
    icon: "ant-design:home-twotone",
    text: "Home",
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
 * Formats a route folder name into a readable title
 */
function formatRouteName(folderName: string): string {
  return folderName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
