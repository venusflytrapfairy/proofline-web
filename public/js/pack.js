// Build the evidence pack (PDF report + ZIP) inside the browser. Nothing is uploaded.
// The PDF can be in English or Arabic (right-to-left). Uses vendored globals: jspdf, fflate.

import { GROUND_RULES, questionText } from "./forms.js";
import { humanSize, sha256Hex, utcNow, DATE_KEYS } from "./evidence.js";
import { t, L } from "./i18n.js";

export const APP_VERSION = "Proofline 0.4";

const INK = [58, 20, 38];
const MUTED = [138, 90, 110];
const ROSE = [180, 54, 91];
const BLUSH = [251, 232, 238];
const LINE = [239, 195, 210];

const AR = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
const LATIN = /[A-Za-z]/;

// Direction of a string, from its first strong letter (null if it has none).
export function firstStrong(s) {
  for (const ch of String(s || "")) {
    if (AR.test(ch)) return "rtl";
    if (LATIN.test(ch)) return "ltr";
  }
  return null;
}

// Split a right-to-left line into runs of Arabic/neutral text and embedded Latin text, in reading order.
export function rtlRuns(line) {
  const toks = [];
  for (const p of String(line).split(/(\s+)/)) {
    if (!p) continue;
    if (/^\s+$/.test(p)) {
      toks.push({ t: p, c: "s" });
    } else {
      // Keep surrounding punctuation with the Arabic text; classify the word itself.
      const m = p.match(/^([«("'“]*)(.*?)([.,:;!?،؛؟)\]»"'”]*)$/);
      const core = m[2];
      const latin = LATIN.test(core) && !AR.test(core);
      if (m[1]) toks.push({ t: m[1], c: "r" });
      if (core) toks.push({ t: core, c: latin ? "l" : "r" });
      if (m[3]) toks.push({ t: m[3], c: "r" });
    }
  }
  // Numbers next to other numbers or Latin text (dates, times, phone numbers) stay together left-to-right.
  const NUM = /^[+\-]?[\d\u0660-\u0669][\d\u0660-\u0669:.\-/]*$/;
  const neighbour = (i, step) => {
    for (let j = i + step; j >= 0 && j < toks.length; j += step) if (toks[j].c !== "s") return toks[j];
    return null;
  };
  for (let pass = 0; pass < 2; pass++) {
    toks.forEach((tk, i) => {
      if (tk.c !== "r" || !NUM.test(tk.t)) return;
      const a = neighbour(i, -1), b = neighbour(i, 1);
      const joins = (n) => n && (n.c === "l" || NUM.test(n.t));
      if (joins(a) || joins(b)) tk.c = "l";
    });
  }
  const runs = [];
  for (const tk of toks) {
    const last = runs[runs.length - 1];
    if (tk.c === "s") {
      if (last) last.trail += tk.t;
      continue;
    }
    if (last && last.c === tk.c) {
      last.t += last.trail + tk.t;
      last.trail = "";
    } else runs.push({ t: tk.t, c: tk.c, trail: "" });
  }
  return runs;
}

const MIRROR = { "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{", "«": "»", "»": "«", "<": ">", ">": "<" };
const mirror = (str) => str.replace(/[()[\]{}«»<>]/g, (ch) => MIRROR[ch]);

// Turn one right-to-left run into pieces to draw from right to left. The PDF library shapes Arabic
// and orders the words inside a piece, but neither mirrors brackets nor places edge punctuation correctly.
export function visualPieces(run) {
  if (run.c === "l") return [run.t];
  const m = run.t.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/su);
  const flip = (x) => mirror([...x].reverse().join(""));
  return [flip(m[1]), mirror(m[2]), flip(m[3])].filter(Boolean);
}

// Arabic text in the PDF uses Noto Sans Arabic; Latin text, symbols and brackets use DejaVu Sans.
// Vowel marks (harakat) are dropped: the PDF library's letter joining breaks around them, and
// everyday Arabic is read without them.
const HARAKAT = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
export const stripMarks = (s) => String(s ?? "").replace(HARAKAT, "");
const NOTO_HAS = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u200C-\u200F0-9 .,:!\-«»]/;

// Split a right-to-left piece into stretches drawn with the Arabic font or the Latin font, in reading order.
export function fontSegments(piece) {
  const out = [];
  for (const ch of piece) {
    const ar = NOTO_HAS.test(ch);
    const last = out[out.length - 1];
    if (last && last.ar === ar) last.t += ch;
    else out.push({ t: ch, ar });
  }
  return out;
}

let assetCache = null;

async function fileBase64(url) {
  const buf = new Uint8Array(await (await fetch(url)).arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(bin);
}

async function loadAssets() {
  if (!assetCache) {
    assetCache = Promise.all([
      fileBase64("/fonts/DejaVuSans.ttf"),
      fileBase64("/fonts/DejaVuSans-Bold.ttf"),
      fileBase64("/fonts/DejaVuSansMono.ttf"),
      fileBase64("/img/mark-512.png").catch(() => null),
      fileBase64("/fonts/NotoSansArabic-Regular.ttf"),
      fileBase64("/fonts/NotoSansArabic-Bold.ttf"),
    ]);
  }
  return assetCache;
}

export const safeName = (name) => (name.replace(/[^\p{L}\p{N}._\- ]+/gu, "_").trim() || "file").slice(0, 80);

class Writer {
  constructor(doc, meta, lang) {
    this.doc = doc;
    this.meta = meta;
    this.lang = lang;
    this.rtl = lang === "ar";
    this.W = doc.internal.pageSize.getWidth();
    this.H = doc.internal.pageSize.getHeight();
    this.m = 18;
    this.y = this.m;
    this.cw = this.W - 2 * this.m;
  }
  font(style = "normal", size = 9.5, color = INK) {
    this.style = style;
    this.doc.setFont(style === "mono" ? "PLMono" : "PL", style === "bold" ? "bold" : "normal");
    this.doc.setFontSize(size);
    this.doc.setTextColor(...color);
  }
  // Switch between the Arabic and the Latin font, keeping weight and size.
  useArabic(on) {
    if (this.style === "mono") return;
    this.doc.setFont(on ? "PLAr" : "PL", this.style === "bold" ? "bold" : "normal");
  }
  // Width of one right-to-left piece, measured with the fonts it is drawn in.
  pieceWidth(piece) {
    if (!AR.test(piece) || !/[\p{L}\p{N}]/u.test(piece)) return this.doc.getTextWidth(piece);
    let w = 0;
    const sp = this.doc.getTextWidth(" ");
    for (const seg of fontSegments(piece)) {
      this.useArabic(seg.ar);
      const [, lead, core, tail] = seg.t.match(/^( *)(.*?)( *)$/s);
      w += this.doc.getTextWidth(core) + (lead.length + tail.length) * sp;
    }
    this.useArabic(false);
    return w;
  }
  // Width of a whole line as it will be drawn.
  measure(line, rtl = firstStrong(line) === "rtl") {
    if (!rtl) return this.doc.getTextWidth(line);
    const sp = this.doc.getTextWidth(" ");
    const runs = rtlRuns(line);
    let w = 0;
    runs.forEach((r, i) => {
      for (const piece of visualPieces(r)) w += r.c === "l" ? this.doc.getTextWidth(piece) : this.pieceWidth(piece);
      if (r.trail && i < runs.length - 1) w += sp;
    });
    return w;
  }
  // Word-wrap. The library's own wrapping measures Arabic letters unjoined (too wide), so Arabic text
  // is wrapped here using getTextWidth, which measures the joined forms that are actually drawn.
  wrap(str, width) {
    const text = stripMarks(str);
    if (!AR.test(text)) return this.doc.splitTextToSize(text, width);
    const rtl = firstStrong(text) === "rtl";
    const out = [];
    for (const para of text.split("\n")) {
      let line = "";
      for (const word of para.split(/ +/)) {
        const next = line ? `${line} ${word}` : word;
        if (!line || this.measure(next, rtl) <= width) {
          line = next;
          continue;
        }
        out.push(line);
        line = word;
      }
      // a single word wider than the line (e.g. a long link) is split by the library
      if (this.measure(line, rtl) > width) out.push(...this.doc.splitTextToSize(line, width));
      else out.push(line);
    }
    return out;
  }
  lh(size) {
    return size * 0.3528 * 1.45;
  }
  ensure(h) {
    if (this.y + h > this.H - 16) {
      this.doc.addPage();
      this.y = this.m;
    }
  }
  space(h) {
    this.y += h;
  }
  pageBreak() {
    this.doc.addPage();
    this.y = this.m;
  }
  // Draw one already-wrapped line between left and right. alignRight puts it against the right edge.
  // rtl is the direction of the whole paragraph: a wrapped line can start with a link or an English word
  // and still be part of a right-to-left paragraph.
  drawLine(line, left, right, baseline, alignRight, rtl = firstStrong(line) === "rtl") {
    const doc = this.doc;
    line = stripMarks(line);
    if (rtl) {
      const runs = rtlRuns(line);
      const sp = doc.getTextWidth(" ");
      const total = this.measure(line, true);
      let x = alignRight ? right : Math.min(right, left + total);
      for (const r of runs) {
        for (const piece of visualPieces(r)) {
          if (r.c === "l" || !AR.test(piece) || !/[\p{L}\p{N}]/u.test(piece)) {
            const w = doc.getTextWidth(piece);
            doc.text(piece, x - w, baseline);
            x -= w;
            continue;
          }
          // Arabic stretches in the Arabic font; anything else (brackets, slashes, Latin) in the Latin font.
          for (const seg of fontSegments(piece)) {
            this.useArabic(seg.ar);
            // Spaces at either end are placed here, because the library moves them when it reorders Arabic.
            const [, lead, core, tail] = seg.t.match(/^( *)(.*?)( *)$/s);
            const s = seg.ar || /[\p{L}\p{N}]/u.test(core) ? core : [...core].reverse().join("");
            x -= lead.length * sp;
            const w = doc.getTextWidth(s);
            doc.text(s, x - w, baseline);
            x -= w + tail.length * sp;
          }
          this.useArabic(false);
        }
        if (r.trail) x -= sp;
      }
    } else if (alignRight) {
      doc.text(line, right, baseline, { align: "right" });
    } else {
      doc.text(line, left, baseline);
    }
  }
  // Paragraph: wraps, follows its own direction. bg draws a shaded box behind it.
  text(str, { style = "normal", size = 9.5, color = INK, bg = null, followDoc = false } = {}) {
    this.font(style, size, color);
    const pad = bg ? 3 : 0;
    // Each paragraph keeps its own direction (an Arabic account can contain an English paragraph).
    const lines = [];
    for (const para of stripMarks(str).split("\n")) {
      const dir = firstStrong(para);
      const alignRight = followDoc ? this.rtl : dir ? dir === "rtl" : this.rtl;
      for (const l of this.wrap(para, this.cw - 2 * pad)) lines.push({ l, alignRight, rtl: dir === "rtl" });
    }
    const lh = this.lh(size);
    for (let i = 0; i < lines.length; i++) {
      this.ensure(lh + (bg ? 2 : 0));
      if (bg) {
        this.doc.setFillColor(...BLUSH);
        const top = i === 0 ? this.y - 1.5 : this.y;
        const h = lh + (i === 0 ? 1.5 : 0) + (i === lines.length - 1 ? 2 : 0);
        this.doc.rect(this.m, top, this.cw, h, "F");
        this.font(style, size, color);
      }
      this.drawLine(lines[i].l, this.m + pad, this.W - this.m - pad, this.y + lh * 0.75, lines[i].alignRight, lines[i].rtl);
      this.y += lh;
    }
    if (bg) this.y += 3;
  }
  h1(str) {
    this.ensure(14);
    this.space(4);
    this.text(str, { style: "bold", size: 14, color: ROSE, followDoc: true });
    this.space(2);
  }
  h2(str) {
    this.ensure(10);
    this.space(3);
    this.text(str, { style: "bold", size: 10.5, followDoc: true });
    this.space(1);
  }
  rule() {
    this.doc.setDrawColor(...LINE);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.m, this.y, this.W - this.m, this.y);
  }
  // Columns are given in reading order; in Arabic they run right to left.
  cols(widths) {
    let x = this.rtl ? this.W - this.m : this.m;
    return widths.map((w) => {
      const c = this.rtl ? { left: x - w, right: x } : { left: x, right: x + w };
      x += this.rtl ? -w : w;
      return c;
    });
  }
  row(cells, widths, { bold = false, fill = false, mono = [] } = {}) {
    const lh = this.lh(8);
    const cols = this.cols(widths);
    const split = cells.map((c, i) => {
      this.font(mono.includes(i) ? "mono" : bold ? "bold" : "normal", mono.includes(i) ? 7 : 8);
      return this.wrap(c, widths[i] - 3);
    });
    const h = Math.max(...split.map((s) => s.length)) * lh + 2.5;
    this.ensure(h);
    if (fill) {
      this.doc.setFillColor(...BLUSH);
      this.doc.rect(this.m, this.y, this.cw, h, "F");
    }
    split.forEach((ls, i) => {
      this.font(mono.includes(i) ? "mono" : bold ? "bold" : "normal", mono.includes(i) ? 7 : 8);
      const cellRtl = firstStrong(stripMarks(cells[i])) === "rtl";
      ls.forEach((l, j) => this.drawLine(l, cols[i].left + 1.5, cols[i].right - 1.5, this.y + lh * (j + 0.8), this.rtl, cellRtl));
    });
    this.y += h;
    this.rule();
  }
  kv(rows, keyW = 44) {
    for (const [k, v, mono] of rows) this.row([k, v], [keyW, this.cw - keyW], { mono: mono ? [1] : [] });
  }
  table(headers, widths) {
    this.row(headers, widths, { bold: true, fill: true });
    return (cells, mono = []) => this.row(cells, widths, { mono });
  }
  footers() {
    const n = this.doc.getNumberOfPages();
    for (let p = 1; p <= n; p++) {
      this.doc.setPage(p);
      this.font("normal", 7.5, MUTED);
      const a = t("pdf.footer", { time: this.meta.generatedAt }, this.lang);
      const b = t("pdf.page", { p, n }, this.lang);
      const y = this.H - 9;
      this.drawLine(this.rtl ? a : b, this.W - this.m - 60, this.W - this.m, y, true);
      this.drawLine(this.rtl ? b : a, this.m, this.m + 120, y, false);
    }
  }
}

const metaLabel = (k, lang) => t(`meta.${k}`, {}, lang);
const metaValue = (k, v, lang) =>
  k === "location" ? t("meta.gpsPresent", {}, lang) : DATE_KEYS.includes(k) ? `${v} ${t("meta.asRecorded", {}, lang)}` : String(v);
const answerText = (a, lang) => (a.dontKnow ? t("acc.dkAnswer", {}, lang) : a.answer || t("acc.notAnswered", {}, lang));
const aboutText = (k, lang) => (k === "general" ? t("acc.general", {}, lang) : questionText(k, lang));

export function buildManifest(items, links, account, meta, includeOriginals) {
  return {
    tool: APP_VERSION,
    generated_at_utc: meta.generatedAt,
    report_language: meta.lang,
    case_title: meta.title || "",
    country: meta.country || "",
    prepared_by: meta.preparedBy || "",
    forms_of_abuse_selected: meta.forms || [],
    originals_included: includeOriginals,
    files: items.map((it, i) => ({
      index: i + 1,
      filename: it.name,
      stored_as: includeOriginals ? `originals/${String(i + 1).padStart(2, "0")}_${safeName(it.name)}` : null,
      sha256: it.sha256,
      md5: it.md5,
      size_bytes: it.size,
      mime: it.type,
      processed_at_utc: it.processedAt,
      file_date_on_device_utc: it.lastModified,
      metadata: it.meta,
      gps_present: it.gps,
      ocr_status: it.ocrStatus,
      ocr_text: it.ocrText,
      user_note: it.note,
    })),
    links,
    account: account && {
      saved_at_utc: account.lockedAt,
      answers: account.answers.map((a) => ({ question: questionText(a.key, "en"), key: a.key, answer: a.answer, dont_know: a.dontKnow })),
      revisions: account.revisions,
    },
  };
}

export function accountText(account, lang) {
  if (!account) return t("pdf.noAccount", {}, lang) + "\n";
  const out = [t("pdf.first", { time: account.lockedAt }, lang), ""];
  for (const a of account.answers) out.push(`• ${questionText(a.key, lang)}`, answerText(a, lang), "");
  if (account.revisions.length) {
    out.push(t("pdf.corr", {}, lang), t("pdf.corrNote", {}, lang), "");
    account.revisions.forEach((r, i) => {
      out.push(t("pdf.corrItem", { i: i + 1, time: r.at, about: aboutText(r.about, lang) }, lang), r.text, t("pdf.reason", { r: r.reason || t("notGiven", {}, lang) }, lang), "");
    });
  }
  return out.join("\n");
}

function buildPdf(items, links, account, meta, manifestSha, assets) {
  const lang = meta.lang;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.addFileToVFS("PL.ttf", assets[0]);
  doc.addFont("PL.ttf", "PL", "normal");
  doc.addFileToVFS("PL-Bold.ttf", assets[1]);
  doc.addFont("PL-Bold.ttf", "PL", "bold");
  doc.addFileToVFS("PLMono.ttf", assets[2]);
  doc.addFont("PLMono.ttf", "PLMono", "normal");
  doc.addFileToVFS("PLAr.ttf", assets[4]);
  doc.addFont("PLAr.ttf", "PLAr", "normal");
  doc.addFileToVFS("PLAr-Bold.ttf", assets[5]);
  doc.addFont("PLAr-Bold.ttf", "PLAr", "bold");
  doc.setProperties({ title: `Proofline – ${meta.title || t("pdf.defaultTitle", {}, lang)}`, creator: APP_VERSION });

  const w = new Writer(doc, meta, lang);
  const T = (k, v) => t(k, v, lang);

  // Cover
  if (assets[3]) {
    const mw = 15, mh = 17.5;
    doc.addImage(`data:image/png;base64,${assets[3]}`, "PNG", w.rtl ? w.W - w.m - mw : w.m, w.y, mw, mh);
    w.space(mh + 5);
  }
  w.text(T("pdf.title"), { style: "bold", size: 22, followDoc: true });
  w.space(1);
  w.text(meta.title || T("pdf.defaultTitle"), { size: 11, color: MUTED, followDoc: true });
  w.space(5);
  w.kv([
    [T("pdf.generated"), meta.generatedAt],
    [T("pdf.country"), meta.country || T("pdf.notStated")],
    [T("pdf.preparedBy"), meta.preparedBy || T("pdf.notStated")],
    [T("pdf.type"), (meta.forms || []).join("; ") || T("pdf.notStated")],
    [T("pdf.files"), String(items.length)],
    [T("pdf.links"), String(links.length)],
    [T("pdf.account"), account ? T("pdf.included") : T("pdf.notIncluded")],
    [T("pdf.manifest"), manifestSha, true],
  ]);
  w.h2(T("pdf.about"));
  w.text(T("pdf.aboutText"), { followDoc: true });
  w.h2(T("pdf.check"));
  w.text(T("pdf.checkText"), { followDoc: true });
  w.space(1);
  for (const l of ["Windows: certutil -hashfile <file> SHA256", "macOS: shasum -a 256 <file>", "Linux: sha256sum <file>"]) w.text(l, { style: "mono", size: 8 });
  w.space(2);
  w.text(T("pdf.limit"), { size: 8, color: MUTED, followDoc: true });

  // 1. Files
  w.pageBreak();
  w.h1(T("pdf.sec1"));
  if (items.length) {
    const row = w.table(["#", T("pdf.colFile"), T("pdf.colType"), T("pdf.colHash")], [8, 50, 32, w.cw - 90]);
    items.forEach((it, i) => row([String(i + 1), it.name, `${it.type}\n${humanSize(it.size)}`, it.sha256], [3]));
    items.forEach((it, i) => {
      w.h2(T("pdf.fileN", { i: i + 1, name: it.name }));
      const rows = [
        [T("pdf.processed"), it.processedAt],
        ["SHA-256", it.sha256, true],
        ["MD5", it.md5, true],
      ];
      if (it.lastModified) rows.push([T("pdf.fileDate"), it.lastModified]);
      for (const [k, v] of Object.entries(it.meta)) rows.push([metaLabel(k, lang), metaValue(k, v, lang)]);
      if (it.note) rows.push([T("pdf.note"), it.note]);
      w.kv(rows);
      if (it.gps) {
        w.space(1);
        w.text(T("pdf.gps"), { style: "bold", size: 8.5, color: ROSE, followDoc: true });
      }
      if (it.ocrText) {
        w.space(2);
        w.text(`${T("pdf.ocr")}`, { size: 8, color: MUTED, followDoc: true });
        w.space(1.5);
        w.text(it.ocrText.slice(0, 6000), { bg: true });
      }
    });
  } else w.text(T("pdf.noFiles"), { followDoc: true });

  // 2. Links
  w.h1(T("pdf.sec2"));
  if (links.length) {
    const row = w.table(["#", T("pdf.colLink"), T("pdf.colWhere"), T("pdf.colNote"), T("pdf.colRec")], [8, 62, 25, w.cw - 128, 33]);
    links.forEach((l, i) => row([String(i + 1), l.value, l.platform, l.note, l.recordedAt]));
  } else w.text(T("pdf.noLinks"), { followDoc: true });

  // 3. Account
  w.pageBreak();
  w.h1(T("pdf.sec3"));
  if (account) {
    w.text(T("pdf.instr"), { size: 8, color: MUTED, followDoc: true });
    GROUND_RULES.forEach((r) => w.text(`• ${L(r, lang)}`, { size: 8, color: MUTED, followDoc: true }));
    w.h2(T("pdf.first", { time: account.lockedAt }));
    for (const a of account.answers) {
      w.space(2);
      w.text(questionText(a.key, lang), { style: "bold", size: 8.5, followDoc: true });
      w.space(1.5);
      w.text(answerText(a, lang), { bg: true });
    }
    if (account.revisions.length) {
      w.h2(T("pdf.corr"));
      w.text(T("pdf.corrNote"), { size: 8, color: MUTED, followDoc: true });
      account.revisions.forEach((r, i) => {
        w.space(2);
        w.text(T("pdf.corrItem", { i: i + 1, time: r.at, about: aboutText(r.about, lang) }), { style: "bold", size: 8.5, followDoc: true });
        w.space(1.5);
        w.text(r.text, { bg: true });
        w.text(T("pdf.reason", { r: r.reason || t("notGiven", {}, lang) }), { size: 8, color: MUTED, followDoc: true });
      });
    }
  } else w.text(T("pdf.noAccount"), { followDoc: true });

  w.footers();
  return new Uint8Array(doc.output("arraybuffer"));
}

const README = (sha, includeOriginals) =>
  [
    "PROOFLINE EVIDENCE PACK / ملف أدلة Proofline",
    "",
    "evidence_report.pdf  – readable report (files, fingerprints, metadata, links, personal account)",
    "manifest.json        – the same information in machine-readable form",
    `                       SHA-256 of manifest.json: ${sha}`,
    "account.txt          – the personal account and any corrections, as plain text",
    "links.csv            – links, usernames and numbers recorded",
    includeOriginals ? "originals/           – the original files, unchanged" : "originals/           – NOT included (fingerprints only)",
    "",
    "To check a file has not changed, recalculate its SHA-256 and compare it with manifest.json:",
    "  Windows: certutil -hashfile <file> SHA256",
    "  macOS:   shasum -a 256 <file>",
    "  Linux:   sha256sum <file>",
    "",
    "Keep this pack somewhere private. Share it only with people you trust, such as police, a lawyer or a support organisation.",
    "",
    "----",
    "evidence_report.pdf: التقرير المقروء (الملفات والبصمات والبيانات الوصفية والروابط والرواية الشخصية)",
    "manifest.json: المعلومات نفسها بصيغة يقرؤها الحاسوب",
    "account.txt: الرواية الشخصية وأي تصحيحات، كنص عادي",
    "links.csv: الروابط وأسماء المستخدمين والأرقام المسجّلة",
    includeOriginals ? "originals/: الملفات الأصلية دون أي تغيير" : "originals/: غير مُضمّنة (البصمات فقط)",
    "للتحقق من أن الملف لم يتغير، أعيدي حساب بصمة SHA-256 وقارنيها بما في manifest.json.",
    "احفظي هذا الملف في مكان خاص، ولا تشاركيه إلا مع من تثقين بهم، مثل الشرطة أو محامٍ أو جهة دعم.",
    "",
  ].join("\n");

export async function buildPack(items, links, account, meta, includeOriginals) {
  meta = { lang: "en", ...meta, generatedAt: meta.generatedAt || utcNow() };
  const enc = new TextEncoder();
  const manifest = buildManifest(items, links, account, meta, includeOriginals);
  const manifestBytes = enc.encode(JSON.stringify(manifest, null, 2));
  const manifestSha = await sha256Hex(manifestBytes);
  const assets = await loadAssets();
  const pdf = buildPdf(items, links, account, meta, manifestSha, assets);

  const csvCell = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const csv = "﻿" + ["#,value,platform,note,recorded_at_utc", ...links.map((l, i) => [i + 1, l.value, l.platform, l.note, l.recordedAt].map(csvCell).join(","))].join("\n");

  const files = {
    "README.txt": enc.encode(README(manifestSha, includeOriginals)),
    "evidence_report.pdf": [pdf, { level: 0 }],
    "manifest.json": manifestBytes,
    "account.txt": enc.encode(accountText(account, meta.lang)),
    "links.csv": enc.encode(csv),
  };
  if (includeOriginals) {
    items.forEach((it, i) => {
      files[`originals/${String(i + 1).padStart(2, "0")}_${safeName(it.name)}`] = [it.bytes, { level: 0 }];
    });
  }
  const zip = window.fflate.zipSync(files, { level: 6 });
  return { pdf, zip, manifestSha, generatedAt: meta.generatedAt };
}
