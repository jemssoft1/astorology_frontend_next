// eslint-disable-next-line @typescript-eslint/no-require-imports
const { jsPDF } = require("jspdf");

const COLORS = {
  primary: [255, 165, 0], // Orange
  secondary: [255, 140, 0], // Dark Orange
  cream: [253, 245, 230], // Cream
  white: [255, 255, 255], // White
  text: [80, 80, 80], // Dark Gray
};

function drawNorthIndianChart(doc, x, y, size, positions, signs) {
  const half = size / 2;

  // 1. Outer Border
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.setLineWidth(0.8);
  doc.rect(x, y, size, size);

  // 2. Draw Main Diagonals (The "X" lines)
  doc.line(x, y, x + size, y + size);
  doc.line(x + size, y, x, y + size);

  // 3. Draw Inner Diamond
  doc.line(x + half, y, x, y + half);
  doc.line(x, y + half, x + half, y + size);
  doc.line(x + half, y + size, x + size, y + half);
  doc.line(x + size, y + half, x + half, y);

  // 4. Corrected Coordinates for Planets
  const housePos = {
    1: { x: x + size * 0.5, y: y + size * 0.18 },
    2: { x: x + size * 0.25, y: y + size * 0.12 },
    3: { x: x + size * 0.12, y: y + size * 0.25 },
    4: { x: x + size * 0.18, y: y + size * 0.5 },
    5: { x: x + size * 0.12, y: y + size * 0.75 },
    6: { x: x + size * 0.25, y: y + size * 0.88 },
    7: { x: x + size * 0.5, y: y + size * 0.82 },
    8: { x: x + size * 0.75, y: y + size * 0.88 },
    9: { x: x + size * 0.88, y: y + size * 0.75 },
    10: { x: x + size * 0.82, y: y + size * 0.5 },
    11: { x: x + size * 0.88, y: y + size * 0.25 },
    12: { x: x + size * 0.75, y: y + size * 0.12 },
  };

  // 5. NEW Coordinates for Sign Numbers (Orthagonal Offsets)
  const offset = 0.035; // 3.5% orthogonal offset from intersections
  const signPos = {
    1: { x: x + size * 0.5, y: y + size * (0.5 - offset) }, // Top Diamond (Above center)
    2: { x: x + size * 0.25, y: y + size * (0.25 - offset) }, // Top-Left (Above intersection)
    3: { x: x + size * (0.25 - offset), y: y + size * 0.25 }, // Top-Left (Left of intersection)
    4: { x: x + size * (0.5 - offset), y: y + size * 0.5 }, // Left Diamond (Left of center)
    5: { x: x + size * (0.25 - offset), y: y + size * 0.75 }, // Bottom-Left (Left of intersection)
    6: { x: x + size * 0.25, y: y + size * (0.75 + offset) }, // Bottom-Left (Below intersection)
    7: { x: x + size * 0.5, y: y + size * (0.5 + offset) }, // Bottom Diamond (Below center)
    8: { x: x + size * 0.75, y: y + size * (0.75 + offset) }, // Bottom-Right (Below intersection)
    9: { x: x + size * (0.75 + offset), y: y + size * 0.75 }, // Bottom-Right (Right of intersection)
    10: { x: x + size * (0.5 + offset), y: y + size * 0.5 }, // Right Diamond (Right of center)
    11: { x: x + size * (0.75 + offset), y: y + size * 0.25 }, // Top-Right (Right of intersection)
    12: { x: x + size * 0.75, y: y + size * (0.25 - offset) }, // Top-Right (Above intersection)
  };

  for (let house = 1; house <= 12; house++) {
    const signNum = signs[house];
    if (signNum) {
      doc.setFontSize(7);
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.text(String(signNum), signPos[house].x, signPos[house].y, {
        align: "center",
        baseline: "middle",
      });
    }

    const planets = positions[house] || [];
    if (planets.length > 0) {
      doc.setFontSize(7);
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      const pos = housePos[house];

      if (planets.length <= 2) {
        doc.text(planets.join(" "), pos.x, pos.y, {
          align: "center",
          baseline: "middle",
        });
      } else {
        const mid = Math.ceil(planets.length / 2);
        doc.text(planets.slice(0, mid).join(" "), pos.x, pos.y - 2, {
          align: "center",
          baseline: "middle",
        });
        doc.text(planets.slice(mid).join(" "), pos.x, pos.y + 3, {
          align: "center",
          baseline: "middle",
        });
      }
    }
  }
}

const doc = new jsPDF();
doc.addPage();
// test 1
drawNorthIndianChart(
  doc,
  10,
  10,
  100,
  {
    1: ["Ke"],
    4: ["Ve", "Su"],
    5: ["Me"],
    7: ["Sa", "Ju"],
    10: ["Mo"],
    11: ["Ra"],
  },
  {
    1: 8,
    2: 9,
    3: 10,
    4: 11,
    5: 12,
    6: 1,
    7: 2,
    8: 3,
    9: 4,
    10: 5,
    11: 6,
    12: 7,
  },
);

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("fs").writeFileSync(
  "test_chart.pdf",
  Buffer.from(doc.output("arraybuffer")),
);
console.log("PDF written to test_chart.pdf");
