"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EventsChartViewerContent() {
  const searchParams = useSearchParams();
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [chartLoaded, setChartLoaded] = useState(false);

  useEffect(() => {
    // This function will run after component mounts and global scripts are loaded
    const initChart = () => {
      const EventsChart = (window as any).EventsChart;
      const $ = (window as any).$;

      if (EventsChart && $) {
        // Initialize dark mode based on local storage
        const getProperty = (key: string) =>
          key in localStorage ? JSON.parse(localStorage[key]) : null;
        const prevMode = getProperty("darkmode");
        if (prevMode) {
          $("body").css("background-color", "#333");
          $("#ToolBar").css("background-color", "#ddd");
        } else {
          $("body").css("background-color", "#ddd");
          $("#ToolBar").css("background-color", "#ddd");
        }

        // Show/Hide logic is handled by state slightly differently in React, but to respect legacy logic:
        // The legacy logic uses direct DOM manipulation via $().show()/.hide()
        // We should let it do its thing or wrap it.
        // The EventsChart.ChartFromUrl expects to find #EventsChartSvgHolder and will inject SVG there.

        const parentElm = $("#EventsChartSvgHolder");

        // We need to make sure the URL params are set correctly for the chart to load
        // The legacy code reads from window.location.href or URL params directly.
        // Since we are in the same URL structure (presumably), it might work.

        EventsChart.ChartFromUrl(parentElm).then(() => {
          setChartLoaded(true);
          setToolbarVisible(true);
          $("#LoadingBox").hide();
          $("#EventsChartSvgHolder").show();
          $("#ToolBar").removeClass("visually-hidden").show();
        });
      } else {
        setTimeout(initChart, 500);
      }
    };

    const timer = setTimeout(initChart, 500);
    return () => clearTimeout(timer);
  }, []);

  const onClickRefresh = async () => {
    const EventsChart = (window as any).EventsChart;
    if (!EventsChart) return;

    EventsChart.showLoading();
    var chartData = EventsChart.GetChartDataFromToolbar();
    // window.history.pushState('page2', 'Title', newUrl); // Porting this might be tricky if newUrl is not exposed
    // For now, let's just assume getEventsChartFromApi works
    await EventsChart.getEventsChartFromApi(chartData);
    EventsChart.hideLoading();
  };

  const onClickDarkModeToggle = () => {
    const $ = (window as any).$;
    const getProperty = (key: string) =>
      key in localStorage ? JSON.parse(localStorage[key]) : null;
    const setProperty = (key: string, value: any) => {
      localStorage[key] = JSON.stringify(value);
    };

    var toggleMode = getProperty("darkmode");
    if (!toggleMode) {
      $("body").css("background-color", "#333");
      $("#ToolBar").css("background-color", "#ddd");
      setProperty("darkmode", true);
    } else {
      $("body").css("background-color", "#ddd");
      $("#ToolBar").css("background-color", "#ddd");
      setProperty("darkmode", false);
    }
  };

  return (
    <div className="container vstack d-flex align-items-center justify-content-center min-vh-100">
      {/* Loading Box */}
      <img
        id="LoadingBox"
        src="/images/loading-animation-progress-transparent.gif"
        alt="Loading..."
        style={{ display: chartLoaded ? "none" : "block" }}
      />

      {/* Toolbar */}
      <div
        id="ToolBar"
        className={`my-3 hstack gap-3 d-flex align-items-center justify-content-center ${toolbarVisible ? "" : "visually-hidden"}`}
        style={{ padding: "10px", borderRadius: "5px" }}
      >
        <span id="PersonNameBox"></span>
        <div>
          <label htmlFor="TimePreset">Time : </label>
          <select
            name="TimePreset"
            id="TimePresetSelector"
            className="form-select d-inline-block w-auto ms-1"
          >
            <option value="Hour">Hour</option>
            <option value="Day">Day</option>
            <option value="Week">Week</option>
            <option value="Month">Month</option>
            <option value="Year">Year</option>
          </select>
        </div>
        <div>
          <label htmlFor="EventPreset">Events : </label>
          <select
            name="EventPreset"
            id="EventPresetSelector"
            className="form-select d-inline-block w-auto ms-1"
          >
            <option value="General">General</option>
            <option value="Gochara">Gochara</option>
            <option value="Travel">Travel</option>
            <option value="Agriculture">Agriculture</option>
            <option value="HairNailCutting">Hair Nail Cutting</option>
            <option value="Medical">Medical</option>
            <option value="Marriage">Marriage</option>
            <option value="Astronomical">Astronomical</option>
          </select>
        </div>
        <button
          onClick={onClickRefresh}
          type="button"
          className="btn btn-primary btn-sm"
        >
          Refresh
        </button>
      </div>

      {/* Chart View Box */}
      <div id="EventsChartSvgHolder" style={{ display: "none", width: "100%" }}>
        {/* Insert SVG */}
      </div>

      {/* Footer */}
      <footer className="align-items-center py-3 my-4 border-top vstack gap-1">
        <span className="text-muted">
          <small>
            Light mobile friendly version of Dasa/Muhurtha chart viewer.{" "}
            <a href="https://astroweb.in/Muhurtha">Full Version</a>
          </small>
        </span>
        <span className="text-muted">
          <small>
            <b>How To Use: </b>Bookmark this page & access URL directly from
            mobile.
          </small>
        </span>
        <button
          onClick={onClickDarkModeToggle}
          type="button"
          className="btn btn-primary btn-sm"
        >
          Dark Mode
        </button>
        <span className="text-muted">
          <small>
            <a href="/donate">Support</a> ❤ <a href="/">astroweb</a>
          </small>
        </span>
      </footer>

      {/* Dependencies */}
      <Script
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"
        strategy="beforeInteractive"
      />
      {/* We strictly rely on astroweb.js loaded in layout or here. Since layout loads it lazy, we might need to be careful. */}
    </div>
  );
}

export default function EventsChartViewer() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventsChartViewerContent />
    </Suspense>
  );
}
