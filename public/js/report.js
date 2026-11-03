// Turn report-builder answers into a ready-to-paste report, with no AI. Pure functions.
// The report language can differ from the interface language.

import { L, t } from "./i18n.js";

export const WRITING_TIPS = [
  { en: "Say plainly that you are the person shown, and that you did not consent.", ar: "اذكري بوضوح أنكِ الشخص الظاهر في المحتوى، وأنكِ لم توافقي." },
  { en: "If the content is AI-generated or manipulated, say so in the first lines.", ar: "إن كان المحتوى مُنشأ أو معدّلًا بالذكاء الاصطناعي، فاذكري ذلك في السطور الأولى." },
  { en: "Give exact links, one per line. Reviewers act on links, not descriptions.", ar: "ضعي الروابط الدقيقة، رابطًا في كل سطر. يتعامل المراجعون مع الروابط لا مع الأوصاف." },
  { en: "Name the platform rule it breaks. The category to choose is shown above the form.", ar: "اذكري قاعدة المنصة التي يخالفها المحتوى. الفئة المطلوب اختيارها مذكورة أعلى النموذج." },
  { en: "Describe the harm concretely: threats received, people who saw it, risk to your safety.", ar: "صِفي الضرر بشكل ملموس: التهديدات التي وصلتك، ومن شاهد المحتوى، والخطر على سلامتك." },
  { en: "Stay factual and calm. If you don't know something, leave it out.", ar: "التزمي بالحقائق والهدوء. إن لم تكوني متأكدة من شيء فلا تذكريه." },
  { en: "Don't attach intimate images unless the form asks for screenshots.", ar: "لا ترفقي صورًا حميمة إلا إذا طلب النموذج لقطات شاشة." },
  { en: "Keep a copy of what you send and the date you sent it.", ar: "احتفظي بنسخة مما ترسلينه وتاريخ إرساله." },
];

export const splitUrls = (raw) => (raw || "").split("\n").map((l) => l.trim()).filter(Boolean);

// "Label (optional)" -> "Label" (works for Arabic parentheses too)
export const heading = (label) => label.replace(/\s*\([^)]*\)\s*$/, "");

// Headings in the finished report are in the first person ("What I am asking for"),
// even though the form labels speak to the user ("What you are asking for").
export const fieldHeading = (f, lang) => heading(L(f.head || f.label, lang));

export function assemble(target, values, reporterName = "", isAi = true, lang = "en") {
  const isPolice = !target.url;
  const name = reporterName.trim() ? t("tpl.name", { name: reporterName.trim() }, lang) : "";
  const lines = [];

  if (isPolice) {
    lines.push(t("tpl.policeSubject", {}, lang), "");
    lines.push(name + t("tpl.policeIntro", {}, lang) + (isAi ? t("tpl.policeAi", {}, lang) : t("tpl.dot", {}, lang)));
  } else {
    lines.push(t(isAi ? "tpl.subjectAi" : "tpl.subject", {}, lang), "");
    lines.push(name + t("tpl.intro1", {}, lang) + (isAi ? t("tpl.introAi", {}, lang) : "") + t("tpl.intro2", {}, lang));
  }
  lines.push("");

  for (const f of target.fields) {
    const v = (values[f.key] || "").trim();
    if (!v) continue;
    lines.push(`${fieldHeading(f, lang)}:`);
    if (f.kind === "urls") splitUrls(v).forEach((u) => lines.push(`- ${u}`));
    else lines.push(v);
    lines.push("");
  }

  if (target.policy && !isPolice) lines.push(t("tpl.policy", { p: L(target.policy, lang) }, lang), "");
  lines.push(t(isPolice ? "tpl.policeClose" : "tpl.platformClose", {}, lang));
  lines.push("", t("tpl.confirm", {}, lang));
  return lines.join("\n").trim();
}

export function factsText(target, values, aiAnswer, reporter = "", lang = "en") {
  const lines = [];
  if (reporter.trim()) lines.push(`${t("tpl.reporter", {}, lang)}: ${reporter.trim()}`);
  lines.push(`${t("tpl.isAi", {}, lang)} ${aiAnswer}`);
  for (const f of target.fields) {
    const v = (values[f.key] || "").trim();
    if (!v) continue;
    const label = fieldHeading(f, lang);
    if (f.kind === "urls") {
      lines.push(`${label}:`);
      splitUrls(v).forEach((u) => lines.push(`- ${u}`));
    } else lines.push(`${label}: ${v}`);
  }
  return lines.join("\n");
}

export function fitNote(text, limit) {
  if (!limit) return null;
  const n = [...text].length;
  return { n, limit, over: n > limit };
}
