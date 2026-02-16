"use client";

import PageHeader from "@/components/PageHeader";
import Iconify from "@/components/Iconify";
import { useEffect } from "react";
import Script from "next/script";

export default function MiniCalculators() {
  useEffect(() => {
    // We rely on legacy JS logic for these calculators for now.
    // It uses function calls like calculateLmtToStd(), calculatelongToLmtOffset() etc.
    // These are defined in MiniCalculators.js or need to be ported.
    // Since we are loading MiniCalculators.js below, we can try to use them.
    // However, MiniCalculators.js likely attaches to IDs.
    // We must ensure IDs match exactly.
  }, []);

  return (
    <div className="container">
      <Script src="/js/MiniCalculators.js" strategy="lazyOnload" />

      <PageHeader
        title="Mini Calculators"
        description="Collection of small calculators for converting, parsing & working with aspects of Astrology."
        imageSrc="/images/life-predictor-banner.png"
      />

      <div className="row" style={{ maxWidth: "667px" }}>
        <div className="col-md-12">
          <div className="accordion" id="accordionExample">
            {/* Calculator 1: LMT to STD */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="heading1">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse1"
                  aria-expanded="false"
                  aria-controls="collapse1"
                >
                  <Iconify
                    className="me-2"
                    icon="gis:map-time"
                    width={25}
                    height={25}
                  />
                  Local Mean Time (LMT) To Standard Time (STD)
                </button>
              </h2>
              <div
                id="collapse1"
                className="accordion-collapse collapse"
                aria-labelledby="heading1"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="card-body">
                    <p className="card-text">
                      LMT is the real time at a place based on it's longitude,
                      this is converted to UTC or standard time of the inputed
                      offset.
                    </p>
                    <form>
                      <div className="input-group mb-3">
                        <span className="input-group-text">LMT</span>
                        <input
                          id="localMeanTimeString"
                          type="text"
                          placeholder="19:23 08/08/1912"
                          className="form-control"
                        />
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-text">Longitude</span>
                        <input
                          id="lmtLongitude"
                          type="number"
                          placeholder="75.5"
                          className="form-control"
                        />
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-text">STD Offset</span>
                        <input
                          id="outputStdOffset"
                          type="text"
                          placeholder="+05:30"
                          className="form-control"
                        />
                      </div>
                      {/* Note: In React we usually handle onClick in component, but to reuse legacy JS we leave logic to global scope or we must port logic. 
                                                Legacy logic: onclick="calculateLmtToStd()"
                                                We need to expose this function or clicking will fail if not on window.
                                                Better to let legacy script attach? No wait, inline 'onclick' expects global function.
                                                We will use a button that tries to call window.calculateLmtToStd
                                            */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          (window as any).calculateLmtToStd &&
                          (window as any).calculateLmtToStd()
                        }
                      >
                        Calculate
                      </button>

                      <div className="mt-3" style={{ display: "none" }}>
                        <h4>Result:</h4>
                        <div className="card border-success">
                          <div className="card-body pb-0 pt-1 text-success">
                            <h5
                              className="card-title"
                              id="lmtToStdTimeOutput"
                            ></h5>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator 2: Longitude To LMT Offset */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="heading2">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse2"
                  aria-expanded="false"
                  aria-controls="collapse2"
                >
                  <Iconify
                    className="me-2"
                    icon="tabler:world-longitude"
                    width={25}
                    height={25}
                  />
                  Longitude To LMT Offset
                </button>
              </h2>
              <div
                id="collapse2"
                className="accordion-collapse collapse"
                aria-labelledby="heading2"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="card-body">
                    <p className="card-text">
                      Input a longitude to see the LMT offset used for that
                      location
                    </p>
                    <form>
                      <div className="input-group mb-3">
                        <span className="input-group-text">Longitude</span>
                        <input
                          id="longToLmtOffsetLongitude"
                          type="number"
                          placeholder="75.5"
                          className="form-control"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          (window as any).calculatelongToLmtOffset &&
                          (window as any).calculatelongToLmtOffset()
                        }
                      >
                        Calculate
                      </button>
                      <div className="mt-3" style={{ display: "none" }}>
                        <h4>Result:</h4>
                        <div className="card border-success">
                          <div className="card-body pb-0 pt-1 text-success">
                            <h5
                              className="card-title"
                              id="longToLmtOffsetOutput"
                            ></h5>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator 3: Coordinates to Geo Location */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="heading3">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse3"
                  aria-expanded="false"
                  aria-controls="collapse3"
                >
                  <Iconify
                    className="me-2"
                    icon="wpf:worldwide-location"
                    width={25}
                    height={25}
                  />
                  Coordinates to Geo Location
                </button>
              </h2>
              <div
                id="collapse3"
                className="accordion-collapse collapse"
                aria-labelledby="heading3"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="card-body">
                    <p className="card-text">
                      Convert coordinates to its geo location equivalent.
                    </p>
                    <form>
                      <div className="input-group mb-3">
                        <span className="input-group-text">Latitude</span>
                        <input
                          id="coordinatesLatitude"
                          type="number"
                          placeholder="35.6764"
                          className="form-control"
                        />
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-text">Longitude</span>
                        <input
                          id="coordinatesLongitude"
                          type="number"
                          placeholder="139.6500"
                          className="form-control"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          (window as any).calculateCoordinatesToGeoLocation &&
                          (window as any).calculateCoordinatesToGeoLocation()
                        }
                      >
                        Calculate
                      </button>
                      <div className="mt-3" style={{ display: "none" }}>
                        <h4>Result:</h4>
                        <div className="card border-success">
                          <div className="card-body pb-0 pt-1 text-success">
                            <h5
                              className="card-title"
                              id="coordinatesToGeoLocationOutput"
                            ></h5>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator 4: Geo Location To Timezone */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="heading4">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse4"
                  aria-expanded="false"
                  aria-controls="collapse4"
                >
                  <Iconify
                    className="me-2"
                    icon="fluent-mdl2:world-clock"
                    width={25}
                    height={25}
                  />
                  Geo Location To Timezone
                </button>
              </h2>
              <div
                id="collapse4"
                className="accordion-collapse collapse"
                aria-labelledby="heading4"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="card-body">
                    <p className="card-text">
                      Gets all timezones given a location, accounts for Daylight
                      savings & historical changes.
                    </p>
                    <form>
                      <div className="input-group mb-3">
                        <span className="input-group-text">Location</span>
                        <input
                          id="geoLocationToTimezoneLocation"
                          type="text"
                          placeholder="Tokyo, Japan"
                          className="form-control"
                        />
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-text">Latitude</span>
                        <input
                          id="geoLocationToTimezoneLatitude"
                          type="number"
                          placeholder="35.65"
                          className="form-control"
                        />
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-text">Longitude</span>
                        <input
                          id="geoLocationToTimezoneLongitude"
                          type="number"
                          placeholder="139.83"
                          className="form-control"
                        />
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-text">Time</span>
                        <input
                          id="geoLocationToTimezoneTime"
                          type="text"
                          placeholder="14:02"
                          className="form-control"
                        />
                      </div>
                      <div className="input-group mb-3">
                        <span className="input-group-text">Date</span>
                        <input
                          id="geoLocationToTimezoneDate"
                          type="text"
                          placeholder="09/11/1977"
                          className="form-control"
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          (window as any).calculateGeoLocationToTimezone &&
                          (window as any).calculateGeoLocationToTimezone()
                        }
                      >
                        Calculate
                      </button>
                      <div className="mt-3" style={{ display: "none" }}>
                        <h4>Result:</h4>
                        <div className="card border-success">
                          <div className="card-body pb-0 pt-1 text-success">
                            <h5
                              className="card-title"
                              id="geoLocationToTimezoneOutput"
                            ></h5>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator 5: Location Search */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="heading5">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapse5"
                  aria-expanded="false"
                  aria-controls="collapse5"
                >
                  <Iconify
                    className="me-2"
                    icon="material-symbols:map-search-outline-sharp"
                    width={25}
                    height={25}
                  />
                  Location Search
                </button>
              </h2>
              <div
                id="collapse5"
                className="accordion-collapse collapse"
                aria-labelledby="heading5"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="card-body">
                    <p className="card-text">
                      Search for a location and get its coordinates.
                    </p>
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div className="input-group mb-3">
                        <span className="input-group-text">Location</span>
                        <input
                          id="locationSearchInput"
                          type="text"
                          placeholder="London"
                          className="form-control"
                          onInput={(e) =>
                            (window as any).searchLocation &&
                            (window as any).searchLocation()
                          }
                        />
                      </div>
                      <div
                        id="locationSearchResults"
                        style={{ display: "none" }}
                      >
                        <h4>Results:</h4>
                        <ul id="locationSearchList"></ul>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
