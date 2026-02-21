import fs from "fs";
import path from "path";

// Cache for loaded images to avoid reading from disk multiple times per request
const imageCache: Record<string, string> = {};

/**
 * Loads a local image from the public/basic_pdf_images directory and returns it as a base64 Data URL.
 * Falls back to null if the image cannot be found/read.
 */
export function getLocalImageBase64(filename: string): string | null {
  if (imageCache[filename]) {
    return imageCache[filename];
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "basic_pdf_images",
      filename,
    );
    if (!fs.existsSync(filePath)) {
      console.warn(`[PDF IMAGE LOADER] Image not found: ${filePath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();

    let mimeType = "image/jpeg";
    if (ext === ".png") mimeType = "image/png";
    else if (ext === ".webp") mimeType = "image/webp";

    const base64Data = fileBuffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    imageCache[filename] = dataUrl;
    return dataUrl;
  } catch (error) {
    console.error(`[PDF IMAGE LOADER] Error loading image ${filename}:`, error);
    return null;
  }
}
