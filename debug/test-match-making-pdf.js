// test-match-making-pdf.js — Test script for Match Making PDF API
const fs = require("fs");
const path = require("path");

const PORT = process.argv[2] || 3001;
const BASE = `http://localhost:${PORT}`;

const testData = {
  male: {
    name: "Test male",
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
    name: "Test female",
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
};

async function testMatchMakingPdf(lang) {
  const label = lang === "hi" ? "Hindi" : "English";
  const url = `${BASE}/api/match-making-pdf`;

  console.log(`\n🔄 Testing Match Making PDF (${label})...`);
  console.log(`   URL: ${url}`);

  try {
    const body = { ...testData, language: lang };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "";
    console.log(`   Status: ${res.status} (${Date.now()}ms)`);
    console.log(`   Content-Type: ${contentType}`);

    if (res.ok && contentType.includes("application/pdf")) {
      const buffer = Buffer.from(await res.arrayBuffer());
      const filename = `match_making_test_${lang}.pdf`;
      const filepath = path.join(__dirname, filename);
      fs.writeFileSync(filepath, buffer);
      const sizeKB = (buffer.length / 1024).toFixed(1);
      console.log(`   ✅ Saved: ${filepath} (${sizeKB} KB)`);
      return true;
    } else {
      const text = await res.text();
      console.log(`   ❌ Error: ${text.substring(0, 200)}`);
      return false;
    }
  } catch (err) {
    console.log(`   ❌ Request failed: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log(" Match Making PDF API — Test Suite");
  console.log("═══════════════════════════════════════════════");
  console.log(`Server: ${BASE}`);
  console.log(`Test data: ${testData.male.name} + ${testData.female.name}`);

  const enPass = await testMatchMakingPdf("en");
  const hiPass = await testMatchMakingPdf("hi");

  console.log("\n═══════════════════════════════════════════════");
  console.log(` Results:`);
  console.log(`   English: ${enPass ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`   Hindi:   ${hiPass ? "✅ PASS" : "❌ FAIL"}`);
  console.log("═══════════════════════════════════════════════");

  process.exit(enPass && hiPass ? 0 : 1);
}

main();
