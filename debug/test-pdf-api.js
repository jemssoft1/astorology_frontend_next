const fs = require("fs");
const path = require("path");

const pdfData = {
  person: {
    Name: "Test User",
    BirthTime: new Date().toISOString(),
    BirthLocation: "New York, USA",
    Latitude: 40.7128,
    Longitude: -74.006,
    TimezoneOffset: "-05:00",
  },
};

const lunarData = {
  day: 1,
  month: 1,
  year: 2024,
  hour: 12,
  min: 0,
  lat: 40.7128,
  lon: -74.006,
  tzone: -5,
};

async function testPort(port) {
  console.log(`\n=== Testing Port ${port} ===`);
  try {
    // Test Lunar first
    const lunarRes = await fetch(`http://localhost:${port}/api/lunar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lunarData),
    });

    let lunarStatus = "";
    if (lunarRes.ok) {
      lunarStatus = "✅ Lunar OK";
      // If Lunar OK, try PDF
      console.log(lunarStatus);
      console.log(`--- Testing PDF on Port ${port} ---`);
      const pdfRes = await fetch(`http://localhost:${port}/api/horoscope-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pdfData),
      });

      if (pdfRes.ok) {
        const buffer = await pdfRes.arrayBuffer();
        const outputPath = path.join(__dirname, `test_report_${port}.pdf`);
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`✅ PDF Saved: ${outputPath}`);
        return true;
      } else {
        const text = await pdfRes.text();
        console.error(
          `❌ PDF Failed: ${pdfRes.status} ${text.substring(0, 100)}...`,
        );
      }
    } else {
      const text = await lunarRes.text();
      console.error(
        `❌ Lunar Failed: ${lunarRes.status} ${text.substring(0, 100)}...`,
      );
    }
  } catch (e) {
    // console.error(`Port ${port} Error:`, e.message);
    if (e.cause && e.cause.code === "ECONNREFUSED") {
      console.log(`Port ${port}: Connection Refused`);
    } else {
      console.log(`Port ${port}: ${e.message}`);
    }
  }
  return false;
}

(async () => {
  for (const port of [3000, 3001, 3002]) {
    if (await testPort(port)) break;
  }
})();
