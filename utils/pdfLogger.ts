/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * pdfLogger.ts — Simple structured console + file logger for PDF APIs
 * Logs every data block BEFORE it is inserted into the PDF.
 * ALL logs are APPENDED to debug/read.txt (never cleared).
 */

import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "debug", "read.txt");

// Ensure debug directory exists
function ensureLogDir() {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Append a line to read.txt (always appends, never clears)
function appendToFile(text: string) {
  try {
    ensureLogDir();
    fs.appendFileSync(LOG_FILE, text + "\n", "utf-8");
  } catch {
    // silent — don't crash PDF generation if log file fails
  }
}

export function logPDF(
  apiName: string,
  page: number | string,
  section: string,
  data: any,
) {
  const lines = [
    "======================================",
    `Timestamp: ${new Date().toISOString()}`,
    `API: ${apiName}`,
    `Page: ${page}`,
    `Section: ${section}`,
    `Data: ${JSON.stringify(data, null, 2)}`,
    "======================================",
    "",
  ];

  const block = lines.join("\n");
  console.log(block);
  appendToFile(block);
}

/**
 * Safely get a value — returns fallback if undefined/null/empty
 */
export function safeValue(
  value: any,
  fallback: string = "Data not available",
): any {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  return value;
}

/**
 * Log an error during PDF generation
 */
export function logPDFError(apiName: string, section: string, error: any) {
  const lines = [
    "======================================",
    "❌ PDF ERROR",
    `Timestamp: ${new Date().toISOString()}`,
    `API: ${apiName}`,
    `Section: ${section}`,
    `Error: ${error?.message || String(error)}`,
    ...(error?.stack ? [`Stack: ${error.stack}`] : []),
    "======================================",
    "",
  ];

  const block = lines.join("\n");
  console.error(block);
  appendToFile(block);
}
