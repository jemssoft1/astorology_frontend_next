const yoginiData = {
  major_yogini_dasha: [
    {
      dasha_id: 1,
      dasha_name: "Pingla",
      start_date: "7-4-2000 5:28",
      end_date: "7-4-2002 5:28",
      start_ms: 955085280000,
      end_ms: 1018157280000,
      duration: 2,
    },
    {
      dasha_id: 2,
      dasha_name: "Dhanya",
      start_date: "7-4-2002 5:28",
      end_date: "7-4-2005 5:28",
      start_ms: 1018157280000,
      end_ms: 1112851680000,
      duration: 3,
    },
  ],
  sub_yogini_dasha: [
    {
      major_dasha: { dasha_name: "Pingla" },
      sub_dasha: [
        { dasha_name: "Pingla", end_date: "1-1-2001" },
        { dasha_name: "Dhanya", end_date: "1-1-2002" },
      ],
    },
    {
      major_dasha: { dasha_name: "Dhanya" },
      sub_dasha: [
        { dasha_name: "Dhanya", end_date: "1-1-2003" },
        { dasha_name: "Bhramari", end_date: "1-1-2004" },
      ],
    },
  ],
};

const startIndex = 0;
const endIndex = 2;

const majorList = Array.isArray(yoginiData.major_yogini_dasha)
  ? yoginiData.major_yogini_dasha
  : [];
const subDashaData = Array.isArray(yoginiData.sub_yogini_dasha)
  ? yoginiData.sub_yogini_dasha
  : [];

const dashesToRender = majorList.slice(startIndex, endIndex);

dashesToRender.forEach((planetObj, idx) => {
  const planetName =
    typeof planetObj === "string"
      ? planetObj
      : planetObj?.planet ||
        planetObj?.Planet ||
        planetObj?.name ||
        planetObj?.dasha_name ||
        "—";

  const dasha = Array.isArray(subDashaData)
    ? subDashaData.find((d) => {
        const dName =
          d?.major_dasha?.dasha_name ||
          d?.planet ||
          d?.Planet ||
          d?.name ||
          d?.dasha_name ||
          "";
        return String(dName).toLowerCase() === String(planetName).toLowerCase();
      })
    : null;

  let subData = null;
  if (dasha && Array.isArray(dasha.sub_dasha)) {
    subData = dasha.sub_dasha;
  } else if (
    typeof planetObj === "object" &&
    Array.isArray(planetObj?.sub_dasha)
  ) {
    subData = planetObj.sub_dasha;
  } else if (
    !Array.isArray(subDashaData) &&
    typeof subDashaData === "object" &&
    subDashaData !== null
  ) {
    subData = subDashaData[planetName];
  }

  const subList = Array.isArray(subData) ? subData : [];
  console.log(
    "Checking planetName:",
    planetName,
    "Found dasha:",
    !!dasha,
    "subList length:",
    subList.length,
  );

  if (subList.length > 0) {
    const tableBody = subList.map((s) => [
      s.planet || s.Planet || s.name || s.dasha_name || "—",
      (s.end || s.endDate || s.end_date || "—").replace("  ", " "),
    ]);
    console.log("Table Body:", tableBody);
  }
});
