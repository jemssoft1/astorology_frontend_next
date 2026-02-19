// test-western-horoscope-pdf.js
// Test script for the Western Natal Horoscope PDF API endpoint
const fs = require("fs");
const path = require("path");

const testData = {
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

async function testWesternHoroscope(port = 3001) {
  console.log(
    `\n=== Testing Western Natal Horoscope PDF on port ${port} ===\n`,
  );
  console.log("Request:", JSON.stringify(testData, null, 2));

  try {
    console.log("\n--- Sending Request ---");
    const response = await fetch(
      `http://localhost:${port}/api/western-natal-horoscope-pdf`,
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
      const outputPath = path.join(__dirname, `western_horoscope_test.pdf`);
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      console.log(`\n✅ PDF saved: ${outputPath}`);
      console.log(`   File size: ${(buffer.byteLength / 1024).toFixed(1)} KB`);
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
  const port = process.argv[2] || 3000; // Next.js often runs on 3000
  await testWesternHoroscope(Number(port));
})();
