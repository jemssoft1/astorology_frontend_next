// debug-api-responses.js — Check actual API responses for problematic endpoints
// Usage: node debug/debug-api-responses.js
const BASE_URL = "http://localhost:3000";

const params = {
  day: 24,
  month: 3,
  year: 2002,
  hour: 5,
  min: 30,
  lat: 21.1702,
  lon: 72.8311,
  tzone: 5.5,
};

const KalsarpaBody = {
  ...params,
  location: {
    latitude: 21.1702,
    longitude: 72.8311,
    timezone: 5.5,
  },
};

async function fetchEndpoint(endpoint, body) {
  try {
    const res = await fetch(`${BASE_URL}/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || params),
    });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}

async function main() {
  console.log("=== current_vdasha ===");
  const cv = await fetchEndpoint("current_vdasha", params);
  console.log(JSON.stringify(cv, null, 2));

  console.log("\n=== current_vdasha_all ===");
  const cva = await fetchEndpoint("current_vdasha_all", params);
  console.log(JSON.stringify(cva, null, 2));

  console.log("\n=== kalsarpa_details ===");
  const kd = await fetchEndpoint("kalsarpa_details", KalsarpaBody);
  console.log(JSON.stringify(kd, null, 2));

  console.log("\n=== sadhesati_current_status ===");
  const ss = await fetchEndpoint("sadhesati_current_status", params);
  console.log(JSON.stringify(ss, null, 2));

  console.log("\n=== basic_gem_suggestion ===");
  const gs = await fetchEndpoint("basic_gem_suggestion", params);
  console.log(JSON.stringify(gs, null, 2));
}

main();
