"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import APIMethodViewer from "@/components/APIMethodViewer";
import { API_DOC_METADATA } from "@/lib/api-docs";
import Iconify from "@/components/Iconify";

export default function APIBuilder() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMethods = useMemo(() => {
    return API_DOC_METADATA.methods.filter((method) => {
      const matchesCategory =
        selectedCategory === "All" || method.category === selectedCategory;
      const matchesSearch =
        method.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        method.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="container py-6">
      <PageHeader
        title="API Documentation"
        description="Astro data via a simple HTTP request. Build your app or service faster with our comprehensive Vedic Astrology APIs."
        imageSrc="/images/api-builder-banner.png"
      />

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="relative flex-1 w-full">
          <Iconify
            icon="mdi:magnify"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"
          />
          <input
            type="text"
            placeholder="Search API endpoints..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 transition-all text-sm outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === "All"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
            }`}
          >
            All
          </button>
          {API_DOC_METADATA.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredMethods.length > 0 ? (
          filteredMethods.map((method) => (
            <APIMethodViewer key={method.id} method={method} />
          ))
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500">
            <Iconify
              icon="mdi:alert-circle-outline"
              className="w-12 h-12 mx-auto mb-3 opacity-20"
            />
            <p className="text-lg font-medium">
              No APIs found matching your criteria
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 text-blue-600 hover:underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 text-center p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl shadow-blue-500/10">
        <h2 className="text-2xl font-bold mb-4">
          🙏 Join Our Developer Community 🙏
        </h2>
        <p className="opacity-90 max-w-2xl mx-auto mb-8 text-sm leading-relaxed">
          Help us build the most comprehensive open-source Vedic Astrology
          engine. Contribute code, report issues, or support the project through
          donations.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            target="_blank"
            href="https://github.com/astroweb/astroweb"
            className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-full transition-all flex items-center gap-2 font-semibold"
          >
            <Iconify icon="mdi:github" className="w-5 h-5" />
            Vist Source Code
          </a>
          <a
            target="_blank"
            href="https://www.youtube.com/@astroweb/videos"
            className="bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-full transition-all flex items-center gap-2 font-semibold"
          >
            <Iconify icon="mdi:youtube" className="w-5 h-5" />
            Watch Guides
          </a>
          <a
            target="_blank"
            href="https://astroweb.in/Donate.html"
            className="bg-red-500 hover:bg-red-600 px-8 py-2.5 rounded-full transition-all flex items-center gap-2 font-bold shadow-lg shadow-red-500/20"
          >
            <Iconify icon="mdi:hand-heart" className="w-5 h-5" />
            Support Free Use
          </a>
        </div>
      </div>
    </div>
  );
}
