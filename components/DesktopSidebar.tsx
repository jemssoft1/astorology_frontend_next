"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import Iconify from "./Iconify";
import { getNavigationLinks, type NavLink } from "@/lib/navigationConfig";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Get navigation links from configuration
  const links = useMemo(() => getNavigationLinks(), []);

  const toggleMenu = (text: string) => {
    setOpenMenus((prev) =>
      prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text],
    );
  };

  const isChildActive = (children: NavLink[] | undefined): boolean => {
    if (!children) return false;
    return children.some((child) => child.url === pathname);
  };

  const renderNavItem = (link: NavLink, index: number) => {
    const hasChildren = link.children && link.children.length > 0;
    const isOpen = openMenus.includes(link.text);
    const isActive = link.url === pathname;
    const isParentActive = isChildActive(link.children);

    // Auto-open menu if child is active
    if (isParentActive && !openMenus.includes(link.text)) {
      setOpenMenus((prev) => [...prev, link.text]);
    }

    if (hasChildren) {
      return (
        <li key={index} className="mb-1">
          <button
            onClick={() => toggleMenu(link.text)}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded transition-colors ${
              isParentActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-900 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Iconify icon={link.icon} className="text-lg" />
              <span>{link.text}</span>
            </div>
            <Iconify
              icon="mdi:chevron-down"
              className={`text-lg transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Submenu */}
          <ul
            className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-200 ${
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {link.children?.map((child, childIndex) => {
              const isChildActive = child.url === pathname;
              return (
                <li key={childIndex}>
                  <Link
                    href={child.url || "#"}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                      isChildActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Iconify icon={child.icon} className="text-base" />
                    {child.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      );
    }

    // Regular link without children
    return (
      <li key={index} className="mb-1">
        <Link
          href={link.url || "#"}
          className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-900 hover:bg-gray-100"
          }`}
          aria-current={isActive ? "page" : undefined}
        >
          <Iconify icon={link.icon} className="text-lg" />
          {link.text}
        </Link>
      </li>
    );
  };

  return (
    <div
      className="hidden md:flex flex-col flex-shrink-0 bg-white border-r"
      style={{
        width: "280px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div className="p-3">
        <Link
          href="/"
          className="flex items-center mb-3 py-3 md:mb-0 md:mr-auto text-gray-900 no-underline"
        >
          <span className="text-2xl font-bold">AstroWeb</span>
        </Link>
        <hr />
      </div>

      {/* Scrollable navigation area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "0 12px",
        }}
      >
        <ul className="flex flex-col space-y-1 pt-5">
          {links.map((link, index) => renderNavItem(link, index))}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t pt-4 mt-4 p-3">
        <div className="text-xs text-gray-500 text-center">© 2024 AstroWeb</div>
      </div>
    </div>
  );
}
