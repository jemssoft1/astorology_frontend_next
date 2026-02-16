import type { Metadata, Viewport } from "next";
import "./globals.css";

import PageTopNavbar from "../components/PageTopNavbar";
import DesktopSidebar from "../components/DesktopSidebar";
import PageFooter from "../components/PageFooter";
import ContentProtection from "@/components/ContentProtection";

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
};

// Comprehensive Metadata
export const metadata: Metadata = {
  // Basic Metadata
  title: {
    default:
      "AstroWeb - Free Vedic Astrology | Kundli, Horoscope & Birth Chart",
    template: "%s | AstroWeb - Vedic Astrology",
  },
  description:
    "Get FREE accurate Vedic astrology predictions, Kundli matching, birth chart analysis, daily horoscope, Rashifal, Panchang, and personalized astrological guidance. Ancient Indian astrology wisdom for modern life. जन्म कुंडली, राशिफल, और ज्योतिष विज्ञान।",

  // Keywords (for other search engines)
  keywords: [
    // Primary Keywords - English
    "vedic astrology",
    "kundli",
    "kundali",
    "horoscope",
    "birth chart",
    "janam kundli",
    "free kundli",
    "astrology",
    "jyotish",
    "indian astrology",
    "hindu astrology",

    // Horoscope & Rashifal
    "daily horoscope",
    "weekly horoscope",
    "monthly horoscope",
    "yearly horoscope",
    "rashifal",
    "today rashifal",
    "aaj ka rashifal",
    "rashi",
    "zodiac signs",

    // Zodiac Signs - English
    "aries horoscope",
    "taurus horoscope",
    "gemini horoscope",
    "cancer horoscope",
    "leo horoscope",
    "virgo horoscope",
    "libra horoscope",
    "scorpio horoscope",
    "sagittarius horoscope",
    "capricorn horoscope",
    "aquarius horoscope",
    "pisces horoscope",

    // Zodiac Signs - Hindi
    "mesh rashi",
    "vrishabh rashi",
    "mithun rashi",
    "kark rashi",
    "singh rashi",
    "kanya rashi",
    "tula rashi",
    "vrishchik rashi",
    "dhanu rashi",
    "makar rashi",
    "kumbh rashi",
    "meen rashi",

    // Kundli Matching
    "kundli matching",
    "kundli milan",
    "marriage matching",
    "gun milan",
    "horoscope matching",
    "compatibility",
    "manglik dosha",
    "mangal dosha",

    // Panchang & Calendar
    "panchang",
    "hindu calendar",
    "tithi",
    "nakshatra",
    "muhurat",
    "shubh muhurat",
    "auspicious time",
    "hindu panchang",

    // Doshas & Yogas
    "kaal sarp dosh",
    "pitra dosh",
    "shani sade sati",
    "rahu ketu",
    "dasha",
    "mahadasha",
    "antardasha",
    "graha dasha",
    "raj yoga",
    "gaj kesari yoga",

    // Planets - Grahas
    "surya",
    "chandra",
    "mangal",
    "budh",
    "guru",
    "shukra",
    "shani",
    "rahu",
    "ketu",
    "navagraha",

    // Houses & Charts
    "birth chart analysis",
    "natal chart",
    "lagna chart",
    "navamsa chart",
    "d9 chart",
    "bhava chart",
    "12 houses astrology",

    // Specific Services
    "career astrology",
    "love astrology",
    "marriage prediction",
    "health astrology",
    "wealth prediction",
    "business astrology",
    "education astrology",
    "child prediction",

    // Free Services
    "free horoscope",
    "free kundli online",
    "free birth chart",
    "free astrology prediction",
    "free janam kundli",
    "online kundli",

    // Hindi Keywords
    "ज्योतिष",
    "कुंडली",
    "जन्म कुंडली",
    "राशिफल",
    "पंचांग",
    "मुहूर्त",
    "ग्रह दशा",
    "कुंडली मिलान",
    "फ्री कुंडली",
    "वैदिक ज्योतिष",

    // Long-tail Keywords
    "vedic astrology predictions",
    "accurate horoscope prediction",
    "online astrology consultation",
    "best astrology website",
    "authentic vedic astrology",
    "traditional indian astrology",
    "jyotish shastra",
    "hindu jyotish",
  ],

  // Author & Creator
  authors: [{ name: "AstroWeb Team" }, { name: "Vedic Astrology Experts" }],
  creator: "AstroWeb",
  publisher: "AstroWeb",

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["hi_IN", "en_US"],
    url: "https://astroweb.com",
    siteName: "AstroWeb - Vedic Astrology",
    title: "AstroWeb - Free Vedic Astrology | Kundli, Horoscope & Birth Chart",
    description:
      "Get FREE accurate Vedic astrology predictions, Kundli matching, birth chart analysis, daily horoscope, Rashifal & personalized guidance. Ancient wisdom for modern life.",
    images: [
      {
        url: "https://astroweb.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AstroWeb - Vedic Astrology Platform",
        type: "image/jpeg",
      },
      {
        url: "https://astroweb.com/og-image-square.jpg",
        width: 600,
        height: 600,
        alt: "AstroWeb Logo",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@astroweb",
    creator: "@astroweb",
    title: "AstroWeb - Free Vedic Astrology | Kundli & Horoscope",
    description:
      "Get FREE Vedic astrology predictions, Kundli, birth chart, daily horoscope & Rashifal. Ancient Indian astrology for modern life.",
    images: {
      url: "https://astroweb.com/twitter-card.jpg",
      alt: "AstroWeb - Vedic Astrology",
    },
  },

  // Verification (Add your verification codes)
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
      "facebook-domain-verification": "your-facebook-verification-code",
    },
  },

  // App Links
  alternates: {
    canonical: "https://astroweb.com",
    languages: {
      "en-IN": "https://astroweb.com",
      "hi-IN": "https://astroweb.com/hi",
      "en-US": "https://astroweb.com/en",
    },
    types: {
      "application/rss+xml": "https://astroweb.com/feed.xml",
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },

  // Manifest
  manifest: "/manifest.json",

  // Category
  category: "Astrology",

  // Classification
  classification: "Vedic Astrology, Horoscope, Spiritual",

  // Other metadata
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // App-specific
  appleWebApp: {
    capable: true,
    title: "AstroWeb",
    statusBarStyle: "black-translucent",
  },

  // Archives
  archives: ["https://astroweb.com/archives"],

  // Assets
  assets: ["https://astroweb.com/assets"],

  // Bookmarks
  bookmarks: ["https://astroweb.com/bookmarks"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://astroweb.com/#website",
        url: "https://astroweb.com",
        name: "AstroWeb",
        description: "Free Vedic Astrology - Kundli, Horoscope & Birth Chart",
        publisher: { "@id": "https://astroweb.com/#organization" },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://astroweb.com/search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        ],
        inLanguage: ["en-IN", "hi-IN"],
      },
      {
        "@type": "Organization",
        "@id": "https://astroweb.com/#organization",
        name: "AstroWeb",
        url: "https://astroweb.com",
        logo: {
          "@type": "ImageObject",
          url: "https://astroweb.com/logo.png",
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://facebook.com/astroweb",
          "https://twitter.com/astroweb",
          "https://instagram.com/astroweb",
          "https://youtube.com/astroweb",
          "https://linkedin.com/company/astroweb",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+91-XXXXXXXXXX",
            contactType: "customer service",
            areaServed: ["IN", "US", "GB", "CA", "AU"],
            availableLanguage: ["English", "Hindi"],
          },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": "https://astroweb.com/#webapp",
        name: "AstroWeb - Vedic Astrology",
        url: "https://astroweb.com",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "15000",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://astroweb.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Vedic Astrology?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Vedic Astrology, also known as Jyotish Shastra, is an ancient Indian system of astrology that originated over 5,000 years ago. It uses the sidereal zodiac and focuses on karma, dharma, and spiritual growth.",
            },
          },
          {
            "@type": "Question",
            name: "How to get free Kundli online?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can get your free Kundli (birth chart) on AstroWeb by entering your birth date, time, and place. Our accurate Vedic calculations provide detailed analysis of all 12 houses and planetary positions.",
            },
          },
          {
            "@type": "Question",
            name: "What is Kundli matching for marriage?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Kundli matching (Gun Milan) is a Vedic astrology practice that compares the horoscopes of prospective bride and groom to determine compatibility. It analyzes 36 gunas (qualities) for marriage compatibility.",
            },
          },
        ],
      },
      {
        "@type": "Service",
        serviceType: "Astrology Consultation",
        provider: { "@id": "https://astroweb.com/#organization" },
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Astrology Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Free Kundli Generation",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Horoscope Matching",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Daily Rashifal",
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Google Fonts - Optimized URLs */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Varta:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Homemade+Apple&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="geo.position" content="20.5937;78.9629" />
        <meta name="ICBM" content="20.5937, 78.9629" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="1 days" />
        <meta name="distribution" content="global" />
        <meta name="language" content="English, Hindi" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="coverage" content="Worldwide" />
        <meta httpEquiv="Content-Language" content="en-IN, hi-IN" />

        {/* Pinterest Verification */}
        <meta name="p:domain_verify" content="your-pinterest-code" />

        {/* Additional Open Graph */}
        <meta property="og:email" content="contact@astroweb.com" />
        <meta property="og:phone_number" content="+91-XXXXXXXXXX" />
        <meta property="og:latitude" content="20.5937" />
        <meta property="og:longitude" content="78.9629" />
        <meta property="og:country-name" content="India" />
        <meta property="og:region" content="IN" />

        {/* Article Tags for Blog Posts */}
        <meta
          property="article:publisher"
          content="https://facebook.com/astroweb"
        />
        <meta property="article:section" content="Astrology" />
        <meta
          property="article:tag"
          content="Vedic Astrology, Kundli, Horoscope, Rashifal"
        />
      </head>
      <body
        style={{
          fontFamily: '"Lexend Deca", sans-serif',
          backgroundColor: "#f0f2f5",
          margin: 0,
          padding: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          {/* Sidebar (Desktop only) - Independent scroll */}
          <DesktopSidebar />
          <ContentProtection />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            {/* Navbar - Fixed at top */}
            <PageTopNavbar />

            {/* Main Content - Independent scroll */}
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
              <main className="container pt-16 mt-4 px-4">{children}</main>

              <div className="container px-4">
                <PageFooter />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
