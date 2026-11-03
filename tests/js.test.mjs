// Run with:  node --test tests/js.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { redact, restore } from "../public/js/redact.js";
import { assemble, factsText, fitNote } from "../public/js/report.js";
import * as D from "../public/js/data.js";
import { FORMS, ALL_QUESTIONS, SECURITY_STEPS, GROUND_RULES } from "../public/js/forms.js";
import { STR, t, L } from "../public/js/i18n.js";
import { rtlRuns, firstStrong, visualPieces, stripMarks, fontSegments } from "../public/js/pack.js";

test("redaction hides identifiers and restores them exactly", () => {
  const text =
    "Sara Ahmed got threats from @fake_acc99 at +971 50 123 4567 and fake.guy@mail.com on 2026-10-20. " +
    "Link: https://instagram.com/p/abc123 and t.me/badchannel. Sara Ahmed is scared.";
  const r = redact(text, ["Sara Ahmed"]);
  for (const s of ["Sara Ahmed", "@fake_acc99", "+971 50 123 4567", "fake.guy@mail.com", "instagram.com", "t.me/badchannel"]) {
    assert.ok(!r.text.includes(s), s);
  }
  assert.ok(r.text.includes("2026-10-20"));
  assert.equal(r.text.split("[NAME_1]").length - 1, 2);
  assert.equal(restore(r.text, r.mapping).text, text);
});

test("timestamps are kept; Arabic-Indic phone numbers are hidden", () => {
  const r = redact("أُضيف لاحقًا (2026-10-23 01:29:58 UTC). رقمه ٠٧٩٧ ٩١١ ٩١١ أو 0797 911 911. Seen 21/10/2026.");
  assert.ok(r.text.includes("(2026-10-23 01:29:58 UTC)"));
  assert.ok(r.text.includes("21/10/2026"));
  assert.ok(!r.text.includes("٠٧٩٧ ٩١١ ٩١١"));
  assert.ok(!r.text.includes("0797 911 911"));
});

test("Arabic names can be hidden, with Arabic commas between names", () => {
  const r = redact("اسمي ليلى حداد وزوجها سامي", "ليلى حداد، سامي".split(/[,،]/));
  assert.ok(!r.text.includes("ليلى حداد") && !r.text.includes("سامي"));
  assert.equal(restore(r.text, r.mapping).text, "اسمي ليلى حداد وزوجها سامي");
});

test("restore reports dropped and invented placeholders", () => {
  const r = redact("Contact a@b.com or +20 100 222 3333");
  const back = restore("Contact [EMAIL_1]. I am [NAME_9].", r.mapping);
  assert.deepEqual(back.missing, ["[PHONE_1]"]);
  assert.deepEqual(back.stray, ["[NAME_9]"]);
});

test("every report target assembles in English and Arabic", () => {
  for (const [id, tg] of Object.entries(D.REPORT_TARGETS)) {
    const vals = Object.fromEntries(tg.fields.map((f) => [f.key, f.kind === "urls" ? "https://x.com/a\nhttps://x.com/b" : "Some fact."]));
    const en = assemble(tg, vals, "Layla", true, "en");
    const ar = assemble(tg, vals, "ليلى", true, "ar");
    assert.ok(en.includes("Layla") && en.includes("https://x.com/b") && en.includes("accurate to the best"), id);
    assert.ok(ar.includes("ليلى") && ar.includes("https://x.com/b") && ar.includes("على حد علمي"), id);
    assert.ok(!/\(optional\)|\(اختياري\)/.test(en + ar), `${id}: field headings keep '(optional)'`);
    assert.ok(factsText(tg, vals, "Yes", "Layla", "en").includes("Name of the person reporting"), id);
  }
  assert.equal(fitNote("x".repeat(1001), 1000).over, true);
});

// Collect every {en, ar} pair in a structure and make sure both are filled in.
function pairs(obj, path = "", out = []) {
  if (obj && typeof obj === "object") {
    if (!Array.isArray(obj) && ("en" in obj || "ar" in obj)) out.push([path, obj]);
    else for (const [k, v] of Object.entries(obj)) pairs(v, `${path}.${k}`, out);
  }
  return out;
}

test("all content has both English and Arabic", () => {
  const all = [...pairs(D, "data"), ...pairs(FORMS, "forms"), ...pairs(ALL_QUESTIONS, "questions"), ...pairs(SECURITY_STEPS, "security"), ...pairs(GROUND_RULES, "rules")];
  assert.ok(all.length > 300, `only ${all.length} pairs found`);
  for (const [path, p] of all) {
    assert.ok(typeof p.en === "string" && p.en.trim(), `${path} missing en`);
    assert.ok(typeof p.ar === "string" && p.ar.trim(), `${path} missing ar`);
  }
  for (const [k, v] of Object.entries(STR)) {
    if (k === "rm.arLabels") continue; // Arabic-only note
    assert.ok(v[0] && v[1], `string ${k} missing a language`);
    const vars = (s) => (s.match(/\{\w+\}/g) || []).sort().join();
    assert.equal(vars(v[0]), vars(v[1]), `string ${k}: placeholders differ`);
  }
});

test("every t() key used by the app exists", () => {
  const src = ["app.js", "pack.js", "report.js"].map((f) => readFileSync(new URL(`../public/js/${f}`, import.meta.url), "utf8")).join("\n");
  const keys = new Set([...src.matchAll(/\bt\(\s*"([\w.]+)"/g)].map((m) => m[1]));
  // keys built from templates
  ["nav.evidence", "nav.account", "nav.pack", "nav.remove", "nav.help", "nav.learn", "nav.about", "ocr.done", "ocr.none", "ocr.skipped", "ocr.na", "ocr.unavailable", "ocr.unsupported", "ocr.failed", "meta.taken", "meta.make", "meta.dimensions", "meta.location", "ev.tip1", "ev.tip6"].forEach((k) => keys.add(k));
  for (const k of keys) assert.ok(STR[k], `missing string ${k}`);
});

test("forms point only at guides and targets that exist", () => {
  for (const f of FORMS) {
    f.guides.forEach((g) => assert.ok(D.PLATFORM_GUIDES[g], `${f.id}: ${g}`));
    f.targets.forEach((x) => assert.ok(D.REPORT_TARGETS[x], `${f.id}: ${x}`));
  }
  assert.deepEqual(Object.keys(D.COUNTRIES), ["United Arab Emirates", "Saudi Arabia", "Egypt", "Jordan", "Lebanon"]);
  for (const c of Object.values(D.COUNTRIES)) assert.ok(c.police.length && c.support.length);
});

test("right-to-left lines split into Arabic and Latin runs in reading order", () => {
  const runs = rtlRuns("https://instagram.com/fake_99 إلى أختي.");
  assert.deepEqual(runs.map((r) => [r.c, r.t]), [["l", "https://instagram.com/fake_99"], ["r", "إلى أختي."]]);
  const r2 = rtlRuns("على Instagram، ثم أرسل");
  assert.deepEqual(r2.map((r) => r.c), ["r", "l", "r"]);
  assert.equal(r2[2].t, "، ثم أرسل");
  // timestamps and phone numbers stay in one left-to-right run; brackets are mirrored
  const r3 = rtlRuns("حُفظت في 2026-10-29 03:18:38 UTC (لم تتغير)");
  assert.deepEqual(r3.map((r) => [r.c, r.t]), [["r", "حُفظت في"], ["l", "2026-10-29 03:18:38 UTC"], ["r", "(لم تتغير)"]]);
  // edge punctuation is reversed and mirrored; inner brackets are mirrored
  assert.deepEqual(visualPieces({ c: "r", t: "(لم تتغير)" }), [")", "لم تتغير", "("]);
  assert.deepEqual(visualPieces({ c: "r", t: "تاريخ الإنشاء (" }), ["تاريخ الإنشاء", ") "]);
  assert.deepEqual(visualPieces({ c: "r", t: "، أكتوبر" }), [" ،", "أكتوبر"]);
  assert.deepEqual(visualPieces({ c: "r", t: "دعم (مجاني) للنساء" }), ["دعم )مجاني( للنساء"]);
  const r4 = rtlRuns("الرقم +962 6 568 7037 فقط");
  assert.equal(r4[1].t, "+962 6 568 7037");
  assert.equal(rtlRuns("دفعت 300 دولار").length, 1);
  assert.equal(firstStrong("123 مرحبا"), "rtl");
  assert.equal(firstStrong("@user مرحبا"), "ltr");
});

test("UAE cybercrime law is cited correctly", () => {
  const n = D.COUNTRIES["United Arab Emirates"].notes[0];
  assert.match(n.en, /No\. 34 of 2021/);
  assert.match(n.ar, /34 لسنة 2021/);
});

test("reports speak in the first person, in English and Arabic", () => {
  const tg = D.REPORT_TARGETS.police;
  const vals = { what_happened: "x", suspect: "y", evidence: "z", wanted: "w" };
  const en = assemble(tg, vals, "", true, "en");
  const ar = assemble(tg, vals, "", true, "ar");
  assert.ok(en.includes("What I am asking for:") && en.includes("Who I believe is responsible and why:"));
  assert.ok(!/\byou\b/i.test(en), "English report still says 'you'");
  assert.ok(ar.includes("ما أطلبه:") && !ar.includes("تطلبينه") && !ar.includes("تعتقدين"));
});

test("Arabic PDF text: vowel marks dropped, brackets drawn with the Latin font", () => {
  assert.equal(stripMarks("المُبلّغ المسجّلة"), "المبلغ المسجلة");
  assert.deepEqual(fontSegments("دعم )مجاني( 2026"), [{ t: "دعم ", ar: true }, { t: ")", ar: false }, { t: "مجاني", ar: true }, { t: "(", ar: false }, { t: " 2026", ar: true }]);
  assert.deepEqual(fontSegments("وYouTube").map((x) => x.ar), [true, false]);
});

test("fixed links and wording", () => {
  const all = JSON.stringify(D);
  assert.ok(!all.includes("14094703") && !all.includes("456204807968977"));
  assert.ok(all.includes("help.instagram.com/contact/636276399721841"));
  assert.ok(!/«?القصة|أو قصة/.test(all));
  assert.ok(!/WhatsApp|Signal/.test(D.REGIONAL.map((r) => r.contact.map((c) => c.ar || "").join()).join()));
});
