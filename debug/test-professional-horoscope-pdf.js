// test-professional-horoscope-pdf.js
// Test script for the Professional Horoscope PDF API
// Usage: node test-professional-horoscope-pdf.js [port]

const fs = require("fs");
const path = require("path");

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

const testData = {
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
};

async function testPDF(lang) {
  const payload = { ...testData, lang };
  const label = lang === "hi" ? "Hindi" : "English";
  console.log(`\n📄 Testing Professional Horoscope PDF (${label})...`);
  console.log(`   URL: ${BASE_URL}/api/professional-horoscope-pdf`);

  try {
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}/api/professional-horoscope-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const elapsed = Date.now() - startTime;
    console.log(`   Status: ${response.status} (${elapsed}ms)`);
    console.log(`   Content-Type: ${response.headers.get("content-type")}`);

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const filename = `professional_horoscope_test_${lang}.pdf`;
      const filepath = path.join(__dirname, filename);
      fs.writeFileSync(filepath, Buffer.from(buffer));
      const sizeKB = (buffer.byteLength / 1024).toFixed(1);
      console.log(`   ✅ Saved: ${filepath} (${sizeKB} KB)`);
      return true;
    } else {
      const errorBody = await response.text();
      console.log(`   ❌ Error: ${errorBody.substring(0, 200)}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Request failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════");
  console.log(" Professional Horoscope PDF API — Test Suite");
  console.log("═══════════════════════════════════════════════");
  console.log(`Server: ${BASE_URL}`);
  console.log(
    `Test data: ${testData.name}, DOB: ${testData.day}/${testData.month}/${testData.year}`,
  );

  const enResult = await testPDF("en");
  const hiResult = await testPDF("hi");

  console.log("\n═══════════════════════════════════════════════");
  console.log(" Results:");
  console.log(`   English: ${enResult ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`   Hindi:   ${hiResult ? "✅ PASS" : "❌ FAIL"}`);
  console.log("═══════════════════════════════════════════════");

  process.exit(enResult && hiResult ? 0 : 1);
}

main();
