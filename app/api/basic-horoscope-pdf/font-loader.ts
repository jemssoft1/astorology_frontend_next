// font-loader.ts — Devanagari font registration for jsPDF
// Loads Noto Sans Devanagari TTF and registers it with jsPDF for Hindi/Sanskrit text
import fs from "fs";
import path from "path";
import { jsPDF } from "jspdf";

const FONT_NAME = "NotoSansDevanagari";
const FONT_FILE = "NotoSansDevanagari-Regular.ttf";

// Cache the base64 font data so we only read the file once
let cachedFontBase64: string | null = null;

/**
 * Load and cache the font file as base64
 */
function getFontBase64(): string {
  if (cachedFontBase64) return cachedFontBase64;

  // Use process.cwd() because __dirname in Next.js API routes
  // resolves to .next/server/ which doesn't contain our source files
  const fontPath = path.join(
    process.cwd(),
    "app",
    "api",
    "basic-horoscope-pdf",
    "fonts",
    FONT_FILE,
  );
  const fontBuffer = fs.readFileSync(fontPath);
  cachedFontBase64 = fontBuffer.toString("base64");
  return cachedFontBase64;
}

/**
 * Register the Noto Sans Devanagari font with a jsPDF document.
 * Call this ONCE after creating the jsPDF instance.
 *
 * @param doc - The jsPDF document instance
 */
export function registerDevanagariFont(doc: jsPDF): void {
  const fontBase64 = getFontBase64();

  // Add font file to jsPDF's virtual file system
  doc.addFileToVFS(`${FONT_FILE}`, fontBase64);

  // Register the font with jsPDF
  doc.addFont(FONT_FILE, FONT_NAME, "normal");
}

/**
 * Switch to the Devanagari font for Hindi/Sanskrit text rendering.
 *
 * @param doc - The jsPDF document instance
 * @param size - Font size in points (default: 10)
 */
export function setHindiFont(doc: jsPDF, size: number = 10): void {
  doc.setFont(FONT_NAME, "normal");
  doc.setFontSize(size);
}

/**
 * Switch back to the default Helvetica font.
 *
 * @param doc - The jsPDF document instance
 * @param style - Font style: "normal" | "bold" | "italic" (default: "normal")
 * @param size - Font size in points (default: 10)
 */
export function setDefaultFont(
  doc: jsPDF,
  style: string = "normal",
  size: number = 10,
): void {
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
}

/**
 * Detect if a string contains Devanagari Unicode characters (U+0900–U+097F).
 * Used to auto-switch fonts when rendering mixed content.
 *
 * @param text - The string to check
 * @returns true if the string contains Devanagari characters
 */
export function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/**
 * Smart text renderer: auto-detects Devanagari text and switches font accordingly.
 * After rendering, switches back to the previous font.
 *
 * @param doc - The jsPDF document instance
 * @param text - Text to render
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param options - jsPDF text options (align, etc.)
 * @param fontSize - Font size (default: 10)
 * @param fontStyle - Helvetica style for non-Devanagari text (default: "normal")
 */
export function smartText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  options?: Record<string, unknown>,
  fontSize: number = 10,
  fontStyle: string = "normal",
): void {
  if (isDevanagari(text)) {
    setHindiFont(doc, fontSize);
  } else {
    setDefaultFont(doc, fontStyle, fontSize);
  }

  if (options) {
    doc.text(text, x, y, options);
  } else {
    doc.text(text, x, y);
  }

  // Restore to helvetica after rendering
  setDefaultFont(doc, fontStyle, fontSize);
}

export { FONT_NAME };
