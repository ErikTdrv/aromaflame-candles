const MAX_SIDE = 1600; // px, plenty for a full-screen product photo
const QUALITY = 0.82;

function toBlob(
  canvas: HTMLCanvasElement,
  type: string
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY));
}

/**
 * Shrinks a photo in the browser before it is uploaded: at most 1600 px on
 * the long side, saved as WebP (or JPEG where WebP is not supported).
 * A phone photo of several MB typically ends up around 150–400 KB.
 * If anything goes wrong the original file is returned unchanged.
 */
export async function compressImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    let blob = await toBlob(canvas, "image/webp");
    // Browsers without WebP encoding silently fall back to PNG.
    if (!blob || blob.type !== "image/webp") {
      blob = await toBlob(canvas, "image/jpeg");
    }
    if (!blob || blob.size >= file.size) return file;

    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.${ext}`, { type: blob.type });
  } catch {
    return file;
  }
}
