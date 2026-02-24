"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Iconify from "./Iconify";

interface NavLink {
  icon?: string;
  text: string;
  href: string;
  target?: string;
}

export default function PageTopNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const leftLinks: NavLink[] = [
    {
      icon: "carbon:gateway-api",
      text: "Open API",
      href: "/api-builder",
    },
    { icon: "openmoji:love-letter", text: "Donate", href: "/donate" },
  ];

  const rightLinks: NavLink[] = [
    {
      icon: "heroicons-outline:mail",
      text: "Contact Us",
      href: "/contact-us",
    },
    { icon: "ix:about", text: "About", href: "/about" },
    {
      icon: "octicon:video-16",
      text: "Video Guides",
      href: "https://www.youtube.com/@astroweb/videos",
      target: "_blank",
    },
    { icon: "line-md:list", text: "Person List", href: "/person-list" },
  ];

  const mobileLinks: NavLink[] = [
    { icon: "mdi:home", text: "Home", href: "/" },
    {
      icon: "fluent:book-star-20-filled",
      text: "Horoscope",
      href: "/horoscope",
    },
    {
      icon: "bi:arrow-through-heart-fill",
      text: "Match",
      href: "/match-checker",
    },
    { icon: "mdi:numbers", text: "Numerology", href: "/numerology" },
    {
      icon: "gis:map-time",
      text: "Life Predictor",
      href: "/life-predictor",
    },
  ];

  return (
    <nav className="w-full bg-white border-b shadow-sm fixed top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-100"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t py-4">
            {/* All Links for Mobile */}
            <div className="flex flex-col gap-2 mb-4">
              {[...leftLinks, ...rightLinks].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded ${
                    pathname === link.href
                      ? "bg-blue-100 text-blue-600"
                      : " text-gray-900 hover:bg-gray-100"
                  }`}
                  target={link.target}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon && <Iconify icon={link.icon} />}
                  {link.text}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Links */}
            <div className="border-t pt-3">
              <h6 className="px-3 py-2 text-sm font-semibold text-gray-700">
                Menu
              </h6>
              <div className="grid gap-2">
                {mobileLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className={`flex items-center justify-center gap-2 px-4 py-2 border rounded transition-colors ${
                      pathname === link.href
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-blue-600 text-blue-600 hover:bg-blue-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon && <Iconify icon={link.icon} />}
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
