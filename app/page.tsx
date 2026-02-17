"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Iconify from "@/components/Iconify";

interface QuickLink {
  href: string;
  imgSrc: string;
  title: string;
  text: string;
}

export default function Home() {
  const [shuffledLinks, setShuffledLinks] = useState<QuickLink[]>([]);

  const quickLinks: QuickLink[] = [
    {
      href: "/life-predictor",
      imgSrc: "/images/dasa-card.jpg",
      title: "Life Predictor",
      text: "Know good and bad periods of your life years ahead",
    },
    {
      href: "/horoscope",
      imgSrc: "/images/horoscope-card.jpg",
      title: "Horoscope",
      text: "Predict a person's character, speech, body & general life",
    },
    {
      href: "/match-checker",
      imgSrc: "/images/match-card.jpg",
      title: "Match",
      text: "Check astro chemistry for romance & relationship",
    },
  ];

  useEffect(() => {
    const shuffle = (array: QuickLink[]) => {
      let newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };
    setShuffledLinks(shuffle(quickLinks));
  }, []);

  const displayLinks = shuffledLinks.length > 0 ? shuffledLinks : quickLinks;

  return (
    <div className="container mx-auto px-4 bg-[#f0f2f5]">
      {/* MOBILE TITLE */}
      <div className="block md:hidden">
        <div className="px-4 py-1 my-2 text-center">
          <img
            className="block mx-auto -mb-[75px]"
            src="/images/astroweb-api-logo.png"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
            }}
            alt="astroweb Logo"
          />
          <div className="max-w-lg mx-auto">
            <p className="text-lg text-gray-600 mb-4">
              A non-profit, open source project to make Vedic Astrology easily
              available to all.
            </p>
            <div className="grid gap-2 sm:flex sm:justify-center">
              <Link
                href="/donate"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                <Iconify icon="openmoji:love-letter" width={28} height={28} />
                Donate
              </Link>
              <a
                href="https://github.com/astroweb/astroweb"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                <Iconify icon="uil:github" width={28} height={28} />
                Source Code
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP TITLE */}
      <div className="hidden md:block">
        <div
          className="bg-white p-4 pb-0 lg:pr-0 lg:pt-5 items-center rounded-xl border shadow bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/zodiac-wheel-faded-2.png")',
          }}
        >
          <div className="p-3 lg:p-5 lg:pt-3">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
              astroweb
            </h1>
            <p className="text-lg leading-relaxed font-normal mt-2 text-gray-900">
              A non-profit, open source project to make
              <br className="hidden md:block" />
              <span className="font-bold">Vedic Astrology</span> easily
              available to all.
            </p>
            <div className="grid gap-2 md:flex md:justify-start mb-4 lg:mb-3 mt-4">
              <a
                href="https://github.com/astroweb/astroweb"
                target="_blank"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-fit"
                style={{ fontFamily: '"Lexend Deca", serif' }}
              >
                <Iconify icon="uil:github" width={25} height={25} />
                Source Code
              </a>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-fit"
                style={{ fontFamily: '"Lexend Deca", serif' }}
              >
                <Iconify icon="iconoir:donate" width={25} height={25} />
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="py-4" id="icon-grid">
        <div>
          <div className="font-bold flex items-center gap-2">
            <Iconify icon="flat-color-icons:mind-map" width={38} height={38} />
            <h4 className="mt-2 mr-auto text-xl">Quick Links</h4>
          </div>
          <hr className="mt-1 mb-2 border-gray-200" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayLinks.map((link, index) => (
            <div key={index} className="cursor-pointer">
              <Link href={link.href} className="no-underline text-gray-900">
                <div className="bg-white rounded-lg shadow h-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors">
                  <img
                    src={link.imgSrc}
                    className="w-full h-auto"
                    alt={link.title}
                  />
                  <div className="p-4">
                    <h5 className="text-lg font-semibold mb-2">{link.title}</h5>
                    <p className="text-gray-600 text-sm">{link.text}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
