const fs = require("fs");
const path = require("path");

async function testWesternPDF() {
  const PORT = process.argv[2] || 3000;
  const API_URL = `http://localhost:${PORT}/api/western-natal-horoscope-pdf`;

  const payload = {
    name: "John Doe",
    date_of_birth: "15-06-1990",
    time_of_birth: "14:30",
    place_of_birth: "New York, USA",
    latitude: 40.7128,
    longitude: -74.006,
    timezone: -4,
    house_system: "placidus",
    zodiac_type: "tropical",
    node_type: "mean",
    language: "en",
  };

  console.log(`\n🚀 Testing Western Natal Horoscope PDF...`);
  console.log(`   URL: ${API_URL}`);
  console.log(`   Payload:`, JSON.stringify(payload, null, 2));

  try {
    const startTime = Date.now();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const duration = Date.now() - startTime;

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const filename = path.join(__dirname, "western_natal_test.pdf");
      fs.writeFileSync(filename, Buffer.from(buffer));
      console.log(`\n✅ Success! PDF generated in ${duration}ms`);
      console.log(`   Saved to: ${filename}`);
      console.log(`   Size: ${(buffer.byteLength / 1024).toFixed(2)} KB`);
    } else {
      const errorText = await response.text();
      console.error(`\n❌ Failed: ${response.status} ${response.statusText}`);
      console.error(`   Error: ${errorText}`);
    }
  } catch (error) {
    console.error(`\n❌ Network Error:`, error.message);
  }
}

testWesternPDF();
