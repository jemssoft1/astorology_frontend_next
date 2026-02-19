const fs = require("fs");

async function testSolarReturn() {
  const url = "http://localhost:3001/api/solar-return-english-pdf"; // Port 3002 based on user info

  const payload = {
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

  console.log(`Sending POST request to ${url}...`);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log("Response OK");
      const buffer = await response.arrayBuffer();
      const fileName = "test_solar_return_2025.pdf";
      fs.writeFileSync(fileName, Buffer.from(buffer));
      console.log(`PDF saved to ${fileName}`);
    } else {
      console.error("Error:", response.status, response.statusText);
      const text = await response.text();
      console.error("Response body:", text);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

testSolarReturn();
