// test-basic-horoscope-pdf.js
// Test script for the Basic Horoscope PDF API endpoint
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const testData = {
  name: "ronik gorasiya",
  date_of_birth: "24-03-2002",
  time_of_birth: "05:30",
  place_of_birth: "surat,gujarat,india",
  latitude: 21.1702,
  longitude: 72.8311,
  timezone: 5.5,
  language: "en",
  day: 24,
  month: 3,
  year: 1990,
  hour: 19,
  min: 55,
  lat: 19.2,
  lon: 25.2,
  tzone: 5.5,
  location: {
    latitude: 19.2,
    longitude: 25.2,
    timezone: 5.5,
  },
};

async function testBasicHoroscope(port = 3001) {
  console.log(`\n=== Testing Basic Horoscope PDF on port ${port} ===\n`);
  console.log("Request:", JSON.stringify(testData, null, 2));

  try {
    // Test English version
    console.log("\n--- Testing English version ---");
    const response = await fetch(
      `http://localhost:${port}/api/basic-horoscope-pdf`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      },
    );

    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get("content-type")}`);

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const outputPath = path.join(
        __dirname,
        `basic_horoscope_test_${testData.language}.pdf`,
      );
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      console.log(`\n✅ PDF saved: ${outputPath}`);
      console.log(`   File size: ${(buffer.byteLength / 1024).toFixed(1)} KB`);

      // Test Hindi version
      console.log("\n--- Testing Hindi version ---");
      const hiResponse = await fetch(
        `http://localhost:${port}/api/basic-horoscope-pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...testData, language: "hi" }),
        },
      );

      if (hiResponse.ok) {
        const hiBuffer = await hiResponse.arrayBuffer();
        const hiPath = path.join(__dirname, `basic_horoscope_test_hi.pdf`);
        fs.writeFileSync(hiPath, Buffer.from(hiBuffer));
        console.log(`✅ Hindi PDF saved: ${hiPath}`);
        console.log(
          `   File size: ${(hiBuffer.byteLength / 1024).toFixed(1)} KB`,
        );
      } else {
        const errText = await hiResponse.text();
        console.error(`❌ Hindi PDF failed: ${hiResponse.status}`);
        console.error(errText.substring(0, 200));
      }
    } else {
      const errText = await response.text();
      console.error(`\n❌ Failed: ${response.status}`);
      console.error(errText.substring(0, 500));
    }
  } catch (error) {
    if (error.cause && error.cause.code === "ECONNREFUSED") {
      console.log(`Port ${port}: Connection refused`);
    } else {
      console.error(`Error: ${error.message}`);
    }
  }
}

(async () => {
  const port = process.argv[2] || 3001;
  await testBasicHoroscope(Number(port));
})();
