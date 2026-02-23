export const tableStyles = {
  theme: "plain" as const,
  styles: { cellPadding: 2.5, fontSize: 8, font: "helvetica" },
  bodyStyles: { textColor: [80, 80, 80] as Color3 },
  columnStyles: {
    0: {
      fontStyle: "bold" as const,
      cellWidth: 35,
      textColor: [50, 50, 50] as Color3,
    },
  },
  alternateRowStyles: { fillColor: [253, 238, 242] as Color3 },
  margin: { top: 0, bottom: 0 },
};
