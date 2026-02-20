import { getDivisionalChartPositions } from "../app/api/basic-horoscope-pdf/pdf-pages";
import { PLANET_SYMBOLS } from "../app/api/basic-horoscope-pdf/constants";
import assert from "assert";

console.log("Testing Divisional Chart Logic...");

// Mock PLANET_SYMBOLS if needed, but we imported it.
// We assume constants are loaded correctly.

function testArrayFormat() {
  console.log("Test: Array Format");
  const input = [
    { house: 1, planet: "Sun" },
    { house: 5, planet: "Jupiter" },
    { house: 10, planet: "Mars" },
  ];

  const result = getDivisionalChartPositions(input);

  assert.strictEqual(result[1].length, 1, "House 1 should have 1 planet");
  assert.ok(result[1][0].includes("Su"), "House 1 should contain Sun symbol");

  assert.strictEqual(result[5].length, 1, "House 5 should have 1 planet");
  assert.ok(
    result[5][0].includes("Ju"),
    "House 5 should contain Jupiter symbol",
  );

  assert.strictEqual(result[10].length, 1, "House 10 should have 1 planet");
  assert.ok(
    result[10][0].includes("Ma"),
    "House 10 should contain Mars symbol",
  );

  console.log("✅ Array Format Passed");
}

function testObjectFormat() {
  console.log("Test: Object Format");
  const input = {
    "1": { planet: "Sun" },
    "2": [{ planet: "Moon" }, { planet: "Mercury" }], // Multiple planets
    status: "success", // Should be ignored
    statusCode: 200, // Should be ignored
  };

  const result = getDivisionalChartPositions(input);

  assert.strictEqual(result[1].length, 1, "House 1 should have 1 planet");
  assert.ok(result[1][0].includes("Su"), "House 1 should contain Sun");

  assert.strictEqual(result[2].length, 2, "House 2 should have 2 planets");
  const house2Strings = result[2].join(",");
  assert.ok(house2Strings.includes("Mo"), "House 2 should contain Moon");
  assert.ok(house2Strings.includes("Me"), "House 2 should contain Mercury");

  console.log("✅ Object Format Passed");
}

function testEdgeCases() {
  console.log("Test: Edge Cases");
  const input = [
    { house: 0, planet: "Sun" }, // Invalid house
    { house: 13, planet: "Moon" }, // Invalid house
    { house: "1", planet: "Mars" }, // String house
    { house: 6, planet: "UnknownPlanet" }, // Unknown planet
  ];

  const result = getDivisionalChartPositions(input);

  assert.strictEqual(
    result[1].length,
    1,
    "House '1' (string) should be parsed",
  );

  // Checking invalid houses are ignored (not thrown)
  // Our implementation initializes 1..12.
  // If house 0 is accessed, it puts it in positions[0] if exists?
  // No, the loop initializes 1..12. The usage `positions[houseNum]` might fail if key doesn't exist?
  // Wait, the logic is: `if (houseNum >= 1 && houseNum <= 12) positions[houseNum].push(...)`
  // So invalid houses are strictly ignored.

  // We can't easily check 'invalid' houses because they aren't in the returned record keys 1..12
  // But we can check they are NOT in any valid house.

  let totalPlanets = 0;
  for (let i = 1; i <= 12; i++) totalPlanets += result[i].length;

  assert.strictEqual(
    totalPlanets,
    2,
    "Only Mars and UnknownPlanet should be added",
  );
  // UnknownPlanet -> uses first 2 chars "Un" if not found in symbols.
  assert.ok(
    result[6][0].includes("Un"),
    "Unknown planet should fallback to substring",
  );

  console.log("✅ Edge Cases Passed");
}

try {
  testArrayFormat();
  testObjectFormat();
  testEdgeCases();
  console.log("\nAll tests passed!");
} catch (e: any) {
  console.error("❌ Test Failed:", e.message);
  process.exit(1);
}
