/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * pdf-debug-logger.ts — Centralized structured debug logger for all PDF APIs
 *
 * Usage:
 *   const logger = new PdfDebugLogger("mini-horoscope-pdf");
 *   logger.logInput({ name: "John", ... });
 *   logger.logPageStart(1, "Cover Page");
 *   logger.logSection("Birth Details", { name, dob, tob });
 *   logger.logComplete(pdfBuffer.byteLength);
 *   logger.flush();
 */

import * as fs from "fs";
import * as path from "path";

// ═══════════════════════════════════════════════
//  LOG ENTRY INTERFACE
// ═══════════════════════════════════════════════
interface LogEntry {
  timestamp: string;
  api: string;
  page?: number;
  section?: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG" | "DATA";
  message: string;
  data?: any;
}

// ═══════════════════════════════════════════════
//  PDF DEBUG LOGGER CLASS
// ═══════════════════════════════════════════════
export class PdfDebugLogger {
  private apiName: string;
  private entries: LogEntry[] = [];
  private currentPage = 0;
  private startTime: number;
  private errorCount = 0;
  private warningCount = 0;
  private nullCount = 0;
  private sectionCount = 0;

  constructor(apiName: string) {
    this.apiName = apiName;
    this.startTime = Date.now();
    this.log("INFO", "INIT", `PDF generation started for API: ${apiName}`);
  }

  // ─────────────────────────────────────────────
  //  CORE LOGGING
  // ─────────────────────────────────────────────
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private log(
    level: LogEntry["level"],
    section: string,
    message: string,
    data?: any,
  ): void {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      api: this.apiName,
      page: this.currentPage || undefined,
      section,
      level,
      message,
      data,
    };
    this.entries.push(entry);

    // Also output to console for real-time monitoring
    const pageStr = this.currentPage ? ` [Page ${this.currentPage}]` : "";
    const dataStr =
      data !== undefined ? ` | Data: ${this.summarizeData(data)}` : "";
    const prefix =
      level === "ERROR"
        ? "❌"
        : level === "WARN"
          ? "⚠️"
          : level === "DATA"
            ? "📊"
            : "✅";
    console.log(
      `${prefix} [${entry.timestamp}] [API: ${this.apiName}]${pageStr} [${section}] ${message}${dataStr}`,
    );
  }

  // ─────────────────────────────────────────────
  //  DATA SUMMARIZATION
  // ─────────────────────────────────────────────
  private summarizeData(data: any): string {
    if (data === null) return "NULL";
    if (data === undefined) return "UNDEFINED";
    if (typeof data === "string")
      return data.length > 100 ? `${data.substring(0, 100)}...` : data;
    if (typeof data === "number" || typeof data === "boolean")
      return String(data);
    if (Array.isArray(data)) return `Array[${data.length}]`;
    if (typeof data === "object") {
      const keys = Object.keys(data);
      return `Object{${keys.slice(0, 5).join(", ")}${keys.length > 5 ? `, +${keys.length - 5} more` : ""}}`;
    }
    return String(data);
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: INPUT LOGGING
  // ─────────────────────────────────────────────
  logInput(params: Record<string, any>): void {
    this.log("INFO", "INPUT", "Request parameters received", params);
    // Validate each input parameter
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined || value === "") {
        this.nullCount++;
        this.log(
          "WARN",
          "INPUT_VALIDATION",
          `Parameter "${key}" is ${value === null ? "NULL" : value === undefined ? "UNDEFINED" : "EMPTY"}`,
        );
      }
    }
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: API CALL LOGGING
  // ─────────────────────────────────────────────
  logApiCall(endpoint: string, payload?: any): void {
    this.log(
      "INFO",
      "API_CALL",
      `Calling external API: ${endpoint}`,
      payload ? { payloadKeys: Object.keys(payload) } : undefined,
    );
  }

  logApiResponse(
    endpoint: string,
    status: "success" | "error",
    data?: any,
    error?: any,
  ): void {
    if (status === "error") {
      this.errorCount++;
      this.log("ERROR", "API_RESPONSE", `API ${endpoint} FAILED`, {
        error: String(error),
      });
    } else {
      const shape = data ? this.describeShape(data) : "no data";
      this.log("INFO", "API_RESPONSE", `API ${endpoint} SUCCESS`, { shape });
    }
  }

  private describeShape(data: any): string {
    if (data === null || data === undefined) return "null";
    if (Array.isArray(data)) return `Array[${data.length}]`;
    if (typeof data === "object") {
      const keys = Object.keys(data);
      const desc: Record<string, string> = {};
      for (const key of keys.slice(0, 10)) {
        const val = data[key];
        if (Array.isArray(val)) desc[key] = `Array[${val.length}]`;
        else if (val && typeof val === "object")
          desc[key] = `Object{${Object.keys(val).length} keys}`;
        else desc[key] = typeof val;
      }
      return JSON.stringify(desc);
    }
    return typeof data;
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: PAGE LOGGING
  // ─────────────────────────────────────────────
  logPageStart(pageNum: number, pageName: string): void {
    this.currentPage = pageNum;
    this.log("INFO", "PAGE_START", `Rendering Page ${pageNum}: ${pageName}`);
  }

  logPageEnd(pageNum: number, pageName: string): void {
    this.log(
      "INFO",
      "PAGE_END",
      `Page ${pageNum} (${pageName}) rendered successfully`,
    );
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: SECTION LOGGING
  // ─────────────────────────────────────────────
  logSection(sectionName: string, data?: any): void {
    this.sectionCount++;
    if (data === null || data === undefined) {
      this.nullCount++;
      this.log(
        "WARN",
        sectionName,
        `Section data is ${data === null ? "NULL" : "UNDEFINED"} — possible empty section in PDF`,
      );
    } else if (Array.isArray(data) && data.length === 0) {
      this.nullCount++;
      this.log(
        "WARN",
        sectionName,
        "Section data is EMPTY ARRAY — possible empty section in PDF",
      );
    } else if (typeof data === "object" && Object.keys(data).length === 0) {
      this.nullCount++;
      this.log(
        "WARN",
        sectionName,
        "Section data is EMPTY OBJECT — possible empty section in PDF",
      );
    } else {
      this.log("INFO", sectionName, "Data loaded successfully", data);
    }
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: TABLE DATA LOGGING
  // ─────────────────────────────────────────────
  logTable(tableName: string, headers: string[], rows: any[][]): void {
    this.log(
      "DATA",
      tableName,
      `Table: ${headers.length} columns, ${rows.length} rows`,
      {
        headers,
        sampleRow: rows[0] || "NO ROWS",
        totalRows: rows.length,
      },
    );

    // Check for empty cells
    let emptyCells = 0;
    for (const row of rows) {
      for (const cell of row) {
        if (
          cell === null ||
          cell === undefined ||
          cell === "" ||
          cell === "N/A"
        ) {
          emptyCells++;
        }
      }
    }
    if (emptyCells > 0) {
      this.warningCount++;
      this.log(
        "WARN",
        tableName,
        `Table has ${emptyCells} empty/null cells out of ${rows.length * headers.length} total`,
      );
    }
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: DATA VALIDATION
  // ─────────────────────────────────────────────
  logData(label: string, value: any, expectedType?: string): void {
    if (value === null || value === undefined) {
      this.nullCount++;
      this.log(
        "WARN",
        "DATA_CHECK",
        `${label} is ${value === null ? "NULL" : "UNDEFINED"}`,
      );
    } else if (expectedType && typeof value !== expectedType) {
      this.warningCount++;
      this.log(
        "WARN",
        "DATA_CHECK",
        `${label}: expected ${expectedType}, got ${typeof value}`,
        value,
      );
    } else {
      this.log("DEBUG", "DATA_CHECK", `${label}: ${this.summarizeData(value)}`);
    }
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: INTERPRETATION TEXT
  // ─────────────────────────────────────────────
  logInterpretation(
    sectionName: string,
    text: string | null | undefined,
  ): void {
    if (!text || text.trim().length === 0) {
      this.nullCount++;
      this.log(
        "WARN",
        "INTERPRETATION",
        `${sectionName}: Interpretation text is EMPTY or NULL — will show blank in PDF`,
      );
    } else {
      this.log(
        "DEBUG",
        "INTERPRETATION",
        `${sectionName}: ${text.length} chars`,
        { preview: text.substring(0, 80) },
      );
    }
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: CHART DATA
  // ─────────────────────────────────────────────
  logChartData(chartName: string, planetPositions: any): void {
    if (
      !planetPositions ||
      (typeof planetPositions === "object" &&
        Object.keys(planetPositions).length === 0)
    ) {
      this.nullCount++;
      this.log("WARN", "CHART", `${chartName}: Planet positions data is EMPTY`);
    } else {
      const houseCount =
        typeof planetPositions === "object"
          ? Object.keys(planetPositions).length
          : 0;
      this.log(
        "INFO",
        "CHART",
        `${chartName}: ${houseCount} houses populated`,
        planetPositions,
      );
    }
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: CALCULATION LOGGING
  // ─────────────────────────────────────────────
  logCalculation(calcName: string, input: any, result: any): void {
    this.log("DATA", "CALCULATION", `${calcName}`, {
      input: this.summarizeData(input),
      result: this.summarizeData(result),
    });
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: FALLBACK LOGGING
  // ─────────────────────────────────────────────
  logFallback(section: string, missingField: string, fallbackValue: any): void {
    this.warningCount++;
    this.log(
      "WARN",
      "FALLBACK",
      `${section}: "${missingField}" missing, using fallback: ${this.summarizeData(fallbackValue)}`,
    );
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: ERROR LOGGING
  // ─────────────────────────────────────────────
  logError(section: string, error: any): void {
    this.errorCount++;
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    this.log("ERROR", section, message, { stack });
  }

  logWarning(section: string, message: string, data?: any): void {
    this.warningCount++;
    this.log("WARN", section, message, data);
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API: COMPLETION
  // ─────────────────────────────────────────────
  logComplete(pdfSizeBytes: number): void {
    const duration = Date.now() - this.startTime;
    this.log("INFO", "COMPLETE", `PDF generated successfully`, {
      sizeKB: (pdfSizeBytes / 1024).toFixed(1),
      durationMs: duration,
      totalPages: this.currentPage,
      sections: this.sectionCount,
      errors: this.errorCount,
      warnings: this.warningCount,
      nullValues: this.nullCount,
    });
  }

  // ─────────────────────────────────────────────
  //  FLUSH: WRITE LOG FILE
  // ─────────────────────────────────────────────
  flush(): void {
    try {
      // Ensure directory exists
      const logDir = path.join(process.cwd(), "debug", "logs");
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const logFileName = `${this.apiName}_${timestamp}.log`;
      const logFilePath = path.join(logDir, logFileName);

      // Format entries
      const lines: string[] = [];
      lines.push(`${"=".repeat(80)}`);
      lines.push(`PDF DEBUG LOG: ${this.apiName}`);
      lines.push(`Generated: ${new Date().toISOString()}`);
      lines.push(`${"=".repeat(80)}\n`);

      for (const entry of this.entries) {
        const pageStr = entry.page ? ` [Page ${entry.page}]` : "";
        const levelIcon =
          entry.level === "ERROR"
            ? "❌"
            : entry.level === "WARN"
              ? "⚠️"
              : entry.level === "DATA"
                ? "📊"
                : "✅";
        let line = `${levelIcon} [${entry.timestamp}] [API: ${entry.api}]${pageStr} [${entry.section}] ${entry.message}`;

        if (entry.data !== undefined) {
          try {
            const dataStr = JSON.stringify(entry.data, null, 2);
            if (dataStr.length > 500) {
              line += `\n   DATA: ${dataStr.substring(0, 500)}...(truncated)`;
            } else {
              line += `\n   DATA: ${dataStr}`;
            }
          } catch {
            line += `\n   DATA: [Could not serialize]`;
          }
        }
        lines.push(line);
      }

      // Summary
      const duration = Date.now() - this.startTime;
      lines.push(`\n${"=".repeat(80)}`);
      lines.push("SUMMARY");
      lines.push(`${"=".repeat(80)}`);
      lines.push(`API: ${this.apiName}`);
      lines.push(`Duration: ${duration}ms`);
      lines.push(`Total Pages: ${this.currentPage}`);
      lines.push(`Total Sections: ${this.sectionCount}`);
      lines.push(`Errors: ${this.errorCount}`);
      lines.push(`Warnings: ${this.warningCount}`);
      lines.push(`Null/Empty Values: ${this.nullCount}`);
      lines.push(
        `Status: ${this.errorCount === 0 ? "✅ PASS" : "❌ FAIL — Check errors above"}`,
      );
      lines.push(`${"=".repeat(80)}`);

      fs.writeFileSync(logFilePath, lines.join("\n"), "utf-8");
      console.log(`\n📋 Debug log written to: ${logFilePath}`);

      // Also write a latest symlink-style log
      const latestPath = path.join(logDir, `${this.apiName}_latest.log`);
      fs.writeFileSync(latestPath, lines.join("\n"), "utf-8");
    } catch (err) {
      console.error("Failed to write debug log file:", err);
    }
  }

  // ─────────────────────────────────────────────
  //  GETTERS
  // ─────────────────────────────────────────────
  getErrorCount(): number {
    return this.errorCount;
  }
  getWarningCount(): number {
    return this.warningCount;
  }
  getNullCount(): number {
    return this.nullCount;
  }
}
