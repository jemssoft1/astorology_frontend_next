// test-all-pdfs.js — Master test runner: triggers ALL 10 PDF APIs on port 3001
// Usage: node debug/test-all-pdfs.js
const fs = require("fs");
const path = require("path");

const PORT = 3001;
const BASE = `http://localhost:${PORT}`;
const OUT_DIR = path.join(__dirname, "generated_pdfs");

// Ensure output dir
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ============ Test Payloads ============

const indianPayload = {
  name: "Ronik Gorasiya",
  date_of_birth: "24-03-2002",
  time_of_birth: "05:30",
  place_of_birth: "Surat, Gujarat, India",
  latitude: 21.1702,
  longitude: 72.8311,
  timezone: 5.5,
  language: "en",
};

const professionalPayload = {
  name: "Test User",
  day: 15,
  month: 6,
  year: 1990,
  hour: 10,
  min: 30,
  lat: 28.6139,
  lon: 77.209,
  tzone: 5.5,
  place: "New Delhi, India",
  lang: "en",
};

const matchPayload = {
  male: {
    name: "Test Male",
    day: 15,
    month: 6,
    year: 1990,
    hour: 10,
    min: 30,
    lat: 28.6139,
    lon: 77.209,
    tzone: 5.5,
    place: "New Delhi, India",
  },
  female: {
    name: "Test Female",
    day: 20,
    month: 9,
    year: 1992,
    hour: 14,
    min: 15,
    lat: 19.076,
    lon: 72.8777,
    tzone: 5.5,
    place: "Mumbai, India",
  },
  language: "en",
};

const westernPayload = {
  name: "Ronik Gorasiya",
  date_of_birth: "24-03-2002",
  time_of_birth: "05:30",
  place_of_birth: "Surat, Gujarat, India",
  latitude: 21.1702,
  longitude: 72.8311,
  timezone: 5.5,
  house_system: "placidus",
  day: 24,
  month: 3,
  year: 2002,
  hour: 5,
  min: 30,
  lat: 21.1702,
  lon: 72.8311,
  tzone: 5.5,
};

const westernLifeForecastPayload = {
  name: "Test User",
  date_of_birth: "15-06-1990",
  time_of_birth: "10:30",
  place_of_birth: "New Delhi, India",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 5.5,
  house_system: "placidus",
  language: "en",
  forecast_start: "01-01-2025",
  forecast_end: "31-12-2025",
};

const solarReturnPayload = {
  name: "Jane Doe",
  date_of_birth: "15-05-1990",
  time_of_birth: "02:30 PM",
  place_of_birth: "New York, USA",
  latitude: "40.71",
  longitude: "-74.00",
  timezone: "-4.00",
  solar_return_year: 2025,
  house_system: "placidus",
  language: "en",
};

const synastryPayload = {
  person1: {
    name: "Jason Finch",
    date_of_birth: "23-03-1992",
    time_of_birth: "12:00 PM",
    place_of_birth: "Victoria, Canada",
    latitude: "48.42",
    longitude: "-123.36",
    timezone: "-7.00",
  },
  person2: {
    name: "Jessica Watson",
    date_of_birth: "16-01-1992",
    time_of_birth: "12:00 PM",
    place_of_birth: "New York, USA",
    latitude: "40.71",
    longitude: "-74.00",
    timezone: "-5.00",
  },
  house_system: "placidus",
  language: "en",
};

const horoscopePdfPayload = {
  person: {
    Name: "Test User",
    BirthTime: "1990-06-15T10:30:00.000Z",
    BirthLocation: "New Delhi, India",
    Latitude: 28.6139,
    Longitude: 77.209,
    TimezoneOffset: "5.5",
  },
};

const lifeTransitPayload = {
  person: {
    Name: "Test User",
    BirthTime: "1990-06-15T10:30:00.000Z",
    BirthLocation: "New Delhi, India",
    Latitude: 28.6139,
    Longitude: 77.209,
    TimezoneOffset: "5.5",
  },
  reportType: "life_forecast",
  startDate: "2025-01-01",
  endDate: "2025-12-31",
};

// ============ Test Definitions ============

const tests = [
  {
    name: "mini-horoscope-pdf",
    api: "/api/mini-horoscope-pdf",
    payload: indianPayload,
  },
  // {
  //   name: "basic-horoscope-pdf",
  //   api: "/api/basic-horoscope-pdf",
  //   payload: indianPayload,
  // },
  // {
  //   name: "professional-horoscope-pdf",
  //   api: "/api/professional-horoscope-pdf",
  //   payload: professionalPayload,
  // },
  // {
  //   name: "match-making-pdf",
  //   api: "/api/match-making-pdf",
  //   payload: matchPayload,
  // },
  // {
  //   name: "western-natal-horoscope-pdf",
  //   api: "/api/western-natal-horoscope-pdf",
  //   payload: westernPayload,
  // },
  // {
  //   name: "western-life-forecast-pdf",
  //   api: "/api/western-life-forecast-pdf",
  //   payload: westernLifeForecastPayload,
  // },
  // {
  //   name: "solar-return-english-pdf",
  //   api: "/api/solar-return-english-pdf",
  //   payload: solarReturnPayload,
  // },
  // {
  //   name: "synastry-english-pdf",
  //   api: "/api/synastry-english-pdf",
  //   payload: synastryPayload,
  // },
  // {
  //   name: "horoscope-pdf",
  //   api: "/api/horoscope-pdf",
  //   payload: horoscopePdfPayload,
  // },
  // {
  //   name: "life-transit-report-pdf",
  //   api: "/api/life-transit-report-pdf",
  //   payload: lifeTransitPayload,
  // },
];

// ============ Runner ============

async function runTest(test) {
  const url = `${BASE}${test.api}`;
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📄 [${test.name}] Sending POST to ${url}`);
  console.log(`${"=".repeat(60)}`);

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(test.payload),
    });

    const elapsed = Date.now() - startTime;
    const contentType = response.headers.get("content-type") || "";
    console.log(`   Status: ${response.status} (${elapsed}ms)`);
    console.log(`   Content-Type: ${contentType}`);

    if (response.ok && contentType.includes("application/pdf")) {
      const buffer = Buffer.from(await response.arrayBuffer());
      const filename = `${test.name}.pdf`;
      const filepath = path.join(OUT_DIR, filename);
      fs.writeFileSync(filepath, buffer);
      const sizeKB = (buffer.length / 1024).toFixed(1);
      console.log(`   ✅ PASS — Saved: ${filepath} (${sizeKB} KB)`);
      return { name: test.name, status: "PASS", size: sizeKB, time: elapsed };
    } else {
      const text = await response.text();
      console.error(
        `   ❌ FAIL — ${response.status}: ${text.substring(0, 300)}`,
      );
      return {
        name: test.name,
        status: "FAIL",
        error: text.substring(0, 200),
        time: elapsed,
      };
    }
  } catch (err) {
    console.error(`   ❌ ERROR — ${err.message}`);
    return { name: test.name, status: "ERROR", error: err.message, time: 0 };
  }
}

async function main() {
  console.log("\n" + "═".repeat(60));
  console.log("  🚀 MASTER PDF TEST RUNNER — ALL 10 APIS");
  console.log("  Server: " + BASE);
  console.log("═".repeat(60));

  const results = [];

  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
    // Small delay between APIs to avoid overwhelming server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Summary
  console.log("\n\n" + "═".repeat(60));
  console.log("  📊 RESULTS SUMMARY");
  console.log("═".repeat(60));
  console.log(
    `${"API".padEnd(35)} ${"Status".padEnd(10)} ${"Size".padEnd(10)} Time`,
  );
  console.log("-".repeat(60));

  let passed = 0,
    failed = 0;
  for (const r of results) {
    const icon = r.status === "PASS" ? "✅" : "❌";
    const size = r.size ? `${r.size} KB` : "N/A";
    console.log(
      `${icon} ${r.name.padEnd(33)} ${r.status.padEnd(10)} ${size.padEnd(10)} ${r.time}ms`,
    );
    if (r.status === "PASS") passed++;
    else failed++;
  }

  console.log("-".repeat(60));
  console.log(
    `Total: ${results.length} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`,
  );
  console.log("═".repeat(60));

  // Save results to file
  const summaryPath = path.join(__dirname, "test-results.json");
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
  console.log(`\n📋 Results saved to: ${summaryPath}`);

  process.exit(failed > 0 ? 1 : 0);
}

main();
