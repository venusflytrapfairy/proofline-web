// Hide identifying details before text is sent to the AI service, and put them back afterwards.
// Pure functions: no DOM, so they can be tested in Node.

const PATTERNS = [
  ["EMAIL", /[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}/g],
  ["URL", /(?:https?:\/\/|www\.)[^\s<>"')\]]+|\bt\.me\/[^\s<>"')\]]+/gi],
  ["HANDLE", /(?<![\w@])@[A-Za-z0-9_.]{2,30}\b/g],
  // Phone numbers in Western (0-9), Arabic-Indic (٠-٩) or Persian (۰-۹) digits
  ["PHONE", /(?<![\w\u0660-\u0669\u06F0-\u06F9])\+?\(?[\d\u0660-\u0669\u06F0-\u06F9][\d\u0660-\u0669\u06F0-\u06F9\s\-.()]{5,}[\d\u0660-\u0669\u06F0-\u06F9](?![\w\u0660-\u0669\u06F0-\u06F9])/g],
  ["IBAN", /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/g],
];

// Dates and timestamps look like phone numbers to the pattern above; keep them.
const DATE = /\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|\d{1,2}:\d{2}/;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function redact(text, extraTerms = []) {
  const mapping = {}; // placeholder -> original
  const reverse = new Map(); // original -> placeholder
  const counters = {};

  const placeholder = (kind, value) => {
    const key = value.trim();
    if (reverse.has(key)) return reverse.get(key);
    counters[kind] = (counters[kind] || 0) + 1;
    const ph = `[${kind}_${counters[kind]}]`;
    reverse.set(key, ph);
    mapping[ph] = key;
    return ph;
  };

  let out = text;
  const terms = [...new Set(extraTerms.map((t) => (t || "").trim()).filter((t) => t.length >= 2))].sort(
    (a, b) => b.length - a.length,
  );
  for (const term of terms) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}_])${escapeRe(term)}(?![\\p{L}\\p{N}_])`, "giu");
    out = out.replace(re, (m) => placeholder("NAME", m));
  }

  for (const [kind, re] of PATTERNS) {
    out = out.replace(re, (value) => {
      if (kind === "PHONE") {
        const digits = (value.match(/[\d\u0660-\u0669\u06F0-\u06F9]/g) || []).length;
        if (digits < 7 || DATE.test(value)) return value;
      }
      return placeholder(kind, value);
    });
  }
  return { text: out, mapping, count: Object.keys(mapping).length };
}

export function restore(text, mapping) {
  let restored = text;
  const missing = [];
  for (const [ph, original] of Object.entries(mapping)) {
    if (restored.includes(ph)) restored = restored.split(ph).join(original);
    else missing.push(ph);
  }
  const stray = [...new Set(restored.match(/\[(?:NAME|EMAIL|URL|HANDLE|PHONE|IBAN)_\d+\]/g) || [])];
  return { text: restored, missing, stray };
}
