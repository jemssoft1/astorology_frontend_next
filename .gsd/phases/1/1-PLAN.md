---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Verify Data Flow & Rendering

## Objective

Verify that `renderDivisionalChartsPage` correctly receives and processes data from `route.ts` and `helpers.ts`, ensuring all 9 charts are rendered correctly.

## Context

- .gsd/SPEC.md
- app/api/basic-horoscope-pdf/route.ts
- app/api/basic-horoscope-pdf/helpers.ts
- app/api/basic-horoscope-pdf/pdf-pages.ts
- app/api/basic-horoscope-pdf/constants.ts

## Tasks

<task type="auto">
  <name>Verify Data Fetching Mapping</name>
  <files>
    app/api/basic-horoscope-pdf/helpers.ts
    app/api/basic-horoscope-pdf/constants.ts
  </files>
  <action>
    Review `fetchAllBasicHoroscopeData` in `helpers.ts` to ensure it fetches all charts defined in `DIVISIONAL_CHARTS` (constants.ts).
    - Ensure keys in `endpoints` match what `renderDivisionalChartsPage` expects (e.g., `horo_chart_SUN` vs `apiChart: "SUN"`).
    - Fix any mismatches.
  </action>
  <verify>
    Create a test script `debug/verify_keys.ts` that imports constants and helpers, and asserts that every `DIVISIONAL_CHART` `apiChart` has a corresponding key in the `endpoints` object.
  </verify>
  <done>
    All chart keys are consistent between config and fetcher.
  </done>
</task>

<task type="auto">
  <name>Verify Data Processing Logic</name>
  <files>app/api/basic-horoscope-pdf/pdf-pages.ts</files>
  <action>
    Review the data processing loop in `renderDivisionalChartsPage`.
    - Ensure it handles both Array and Object formats for `chartData`.
    - Verify `houseNum` parsing handles string/number variants.
    - Verify `planet` name extraction handles various backend formats (`p.name`, `p.planet`, etc.).
  </action>
  <verify>
    Create a unit test `tests/divisional_chart_logic.test.ts` (using Jest or similar, or a standalone script) that mocks `apiData` with different structures (Array vs Object) and calls the parsing logic to ensure `positions` are built correctly.
  </verify>
  <done>
    Logic is robust against different API response formats.
  </done>
</task>

## Success Criteria

- [ ] Data fetching keys match rendering config perfectly.
- [ ] Rendering logic handles both array and object data formats without crashing.
