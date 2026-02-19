const fs = require("fs");

async function testLifeForecast() {
  const url = "http://localhost:3001/api/western-life-forecast-pdf";

  const payload = {
    name: "John Martin",
    date_of_birth: "19-02-1971",
    time_of_birth: "01:00 PM",
    place_of_birth: "Hrodna Region, Belarus",
    latitude: "53.50",
    longitude: "22.27",
    timezone: "+3:00",
    forecast_start: "02-07-2024",
    forecast_end: "28-12-2024",
    house_system: "placidus",
    zodiac_type: "tropical",
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
      const fileName = "test_life_forecast.pdf";
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

testLifeForecast();
