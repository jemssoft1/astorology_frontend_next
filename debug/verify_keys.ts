import { DIVISIONAL_CHARTS } from "../app/api/basic-horoscope-pdf/constants";
import fs from "fs";
import path from "path";

async function verifyKeys() {
  console.log("Verifying Divisional Chart Keys...");

  const missingKeys: string[] = [];

  const helpersPath = path.join(
    process.cwd(),
    "app/api/basic-horoscope-pdf/helpers.ts",
  );

  console.log(`Reading helpers from: ${helpersPath}`);

  if (!fs.existsSync(helpersPath)) {
    console.error(`❌ Helper file not found at ${helpersPath}`);
    return;
  }

  const helpersContent = fs.readFileSync(helpersPath, "utf8");

  // Extract keys from endpoints object
  // Looking for: horo_chart_D1: "horo_chart/D1",
  const endpointsMatch = helpersContent.match(
    /const endpoints: Record<string, string> = {([\s\S]*?)};/,
  );

  if (!endpointsMatch) {
    console.error("❌ Could not find endpoints object in helpers.ts");
    // Print a bit of the file to debug
    console.log("File start:", helpersContent.substring(0, 200));
    return;
  }

  const endpointsBlock = endpointsMatch[1];
  const definedKeys =
    endpointsBlock.match(/(\w+):/g)?.map((k: string) => k.replace(":", "")) ||
    [];

  console.log(`Found ${definedKeys.length} defined endpoints.`);

  DIVISIONAL_CHARTS.forEach((chart) => {
    const expectedKey = `horo_chart_${chart.apiChart}`;
    if (!definedKeys.includes(expectedKey)) {
      missingKeys.push(expectedKey);
      console.error(
        `❌ Missing endpoint key for chart ${chart.id}: expected '${expectedKey}'`,
      );
    } else {
      console.log(`✅ Found key for ${chart.id}: '${expectedKey}'`);
    }
  });

  if (missingKeys.length > 0) {
    console.error(`\nFAILED: Missing ${missingKeys.length} keys.`);
    process.exit(1);
  } else {
    console.log("\nSUCCESS: All divisional chart keys are defined.");
  }
}

verifyKeys();
