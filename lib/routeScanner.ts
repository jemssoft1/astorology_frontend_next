import { getNavigationLinks, NavLink } from "./navigationConfig";

// Re-export the interface for compatibility
export interface RouteConfig extends NavLink {
  category?: string;
}

/**
 * Returns the application routes from the static configuration.
 * Previously this scanned the file system, but now it uses the manual configuration
 * as per user request.
 */
export function scanRoutes(): RouteConfig[] {
  // We simply return the statically configured links.
  // The structure of NavLink is compatible with RouteConfig for our purposes.
  return getNavigationLinks() as RouteConfig[];
}
