// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");

async function testSynastry() {
  const url = "http://localhost:3001/api/synastry-english-pdf"; // Port 3002

  const payload = {
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
      const fileName = "debug/test_synastry.pdf";
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

testSynastry();
