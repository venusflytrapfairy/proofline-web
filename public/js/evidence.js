// Evidence extraction, entirely inside the browser. Files are never uploaded anywhere.
// Uses vendored libraries loaded as globals: exifr, SparkMD5, Tesseract.

export const utcNow = () => new Date().toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");

export function humanSize(n) {
  const units = ["B", "KB", "MB", "GB"];
  let size = n;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i += 1;
  }
  return i === 0 ? `${size} B` : `${size.toFixed(1)} ${units[i]}`;
}

const toHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

export async function sha256Hex(bytes) {
  return toHex(await crypto.subtle.digest("SHA-256", bytes));
}

// EXIF tag -> metadata key (labels are translated in the interface and PDF)
const EXIF_FIELDS = {
  DateTimeOriginal: "taken",
  CreateDate: "created",
  ModifyDate: "modified",
  OffsetTimeOriginal: "tz",
  Make: "make",
  Model: "model",
  Software: "software",
  ImageDescription: "description",
  Artist: "artist",
};
export const DATE_KEYS = ["taken", "created", "modified"];

// Camera times have no time zone, so keep them exactly as the device recorded them.
function fmt(v) {
  const s = String(v).trim().slice(0, 200);
  return /^\d{4}:\d{2}:\d{2} \d{2}:\d{2}/.test(s) ? s.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3") : s;
}

async function readImageMeta(file) {
  const meta = {};
  let gps = false;
  try {
    const parsed = await window.exifr.parse(file, { tiff: true, exif: true, gps: true, xmp: false, icc: false, iptc: false, reviveValues: false });
    if (parsed) {
      for (const [k, label] of Object.entries(EXIF_FIELDS)) {
        if (parsed[k] !== undefined && parsed[k] !== null && parsed[k] !== "") meta[label] = fmt(parsed[k]);
      }
      gps = parsed.GPSLatitude !== undefined || parsed.latitude !== undefined;
    }
  } catch {
    /* no readable metadata */
  }
  try {
    const bmp = await createImageBitmap(file);
    meta.dimensions = `${bmp.width} × ${bmp.height} px`;
    bmp.close();
  } catch {
    /* format the browser can't decode, e.g. HEIC in most browsers */
  }
  return { meta, gps };
}

// ---- OCR (Tesseract.js, self-hosted: no requests leave this site) ----
let workerPromise = null;

export function ocrSupported() {
  return typeof window.Tesseract !== "undefined" && typeof WebAssembly !== "undefined";
}

function getWorker(onProgress) {
  if (!workerPromise) {
    workerPromise = window.Tesseract.createWorker(["eng", "ara"], 1, {
      workerPath: "/ocr/worker.min.js",
      corePath: "/ocr/",
      langPath: "/ocr/lang",
      gzip: false,
      workerBlobURL: false,
      cacheMethod: "none",
      logger: (m) => onProgress && onProgress(m),
    });
  }
  return workerPromise;
}

const OCR_TYPES = ["image/png", "image/jpeg", "image/webp", "image/bmp", "image/gif"];

export async function runOcr(file, onProgress) {
  if (!ocrSupported()) return { text: "", status: "unavailable" };
  if (!OCR_TYPES.includes(file.type)) return { text: "", status: "unsupported" };
  try {
    const worker = await getWorker(onProgress);
    const { data } = await worker.recognize(file);
    const text = (data.text || "")
      .split("\n")
      .map((l) => l.trimEnd())
      .filter((l) => l.trim())
      .join("\n");
    return { text, status: text ? "done" : "none" };
  } catch {
    return { text: "", status: "failed" };
  }
}

let nextId = 1;

export async function processFile(file, { ocr = true, onProgress } = {}) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const sha256 = await sha256Hex(bytes);
  const md5 = window.SparkMD5.ArrayBuffer.hash(bytes.buffer);
  const item = {
    id: nextId++,
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    sha256,
    md5,
    processedAt: utcNow(),
    lastModified: file.lastModified ? new Date(file.lastModified).toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC") : "",
    meta: {},
    gps: false,
    ocrText: "",
    ocrStatus: "na",
    note: "",
    bytes,
  };
  if (item.type.startsWith("image/")) {
    const { meta, gps } = await readImageMeta(file);
    item.meta = meta;
    item.gps = gps;
    if (ocr) {
      const r = await runOcr(file, onProgress);
      item.ocrText = r.text;
      item.ocrStatus = r.status;
    } else item.ocrStatus = "skipped";
    if (item.gps) item.meta.location = true;
  }
  return item;
}
