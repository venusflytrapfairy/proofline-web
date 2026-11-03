// Proofline – app shell, routing and pages. All state lives in memory in this tab only.

import * as D from "./data.js";
import { FORMS, UN_SOURCE, SECURITY_STEPS, ACCOUNT_OPEN, ACCOUNT_SPECIFIC, ALL_QUESTIONS, GROUND_RULES, questionText } from "./forms.js";
import { processFile, humanSize, utcNow, ocrSupported, DATE_KEYS } from "./evidence.js";
import { buildPack } from "./pack.js";
import { redact, restore } from "./redact.js";
import { WRITING_TIPS, assemble, factsText, fitNote } from "./report.js";
import { t, L, getLang, setLang } from "./i18n.js";

// ---------------------------------------------------------------------------
// State (memory only: no localStorage, no cookies)
// ---------------------------------------------------------------------------
const S = {
  started: false,
  forms: new Set(),
  country: "",
  items: [],
  links: [],
  draft: {},
  account: null,
  pack: null,
  packOpts: { title: "", name: "", originals: true, lang: null },
  removeTab: "guides",
  platform: null,
  target: null,
  rb: {},
  rbName: "",
  rbAi: "yes",
  rbLang: null,
  rbMode: "tpl",
  hideNames: "",
  helpTab: "police",
  ai: { checked: false, configured: false, model: "", reason: "", ack: false, busy: false, out: {} },
  newSeals: new Set(),
  processing: null,
};

const COUNTRY_KEYS = Object.keys(D.COUNTRIES);
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const nl2br = (s) => esc(s).replace(/\n/g, "<br>");
const ltr = (s) => `<bdi dir="ltr">${esc(s)}</bdi>`;
// Content text: English menu names quoted «like this» inside Arabic stay together as one left-to-right phrase.
const tx = (v) => esc(L(v)).replace(/«([^«»]*?[A-Za-z][^«»]*?)»/g, '«<bdi dir="ltr">$1</bdi>»');
const ext = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const countryName = (k) => (D.COUNTRIES[k] ? L(D.COUNTRIES[k].name) : k === "other" ? t("other") : "");
const formTitles = (lang = getLang()) => FORMS.filter((f) => S.forms.has(f.id)).map((f) => L(f.title, lang));

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 3200);
}

function ask({ title, html, ok = t("ok"), cancel = t("cancel") }) {
  const dlg = $("#dialog");
  $("#dialog-title").textContent = title;
  $("#dialog-content").innerHTML = html;
  $("#dialog-ok").textContent = ok;
  $("#dialog-cancel").textContent = cancel;
  dlg.returnValue = "";
  autoDirs(dlg);
  dlg.showModal();
  $("#dialog-title").focus(); // not the first button, so neither button looks highlighted
  return new Promise((resolve) => dlg.addEventListener("close", () => resolve(dlg.returnValue === "ok"), { once: true }));
}

function download(bytes, filename, type) {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

const hasData = () => S.items.length || S.links.length || S.account || Object.values(S.draft).some((d) => d.text || d.dk);

// ---------------------------------------------------------------------------
// Routing and rendering
// ---------------------------------------------------------------------------
const NAV = ["evidence", "account", "pack", "remove", "help", "learn", "about"];
const GATED = new Set(["evidence", "account", "pack"]);
const route = () => location.hash.replace(/^#\/?/, "").split("?")[0];

function isDone(id) {
  return (id === "evidence" && (S.items.length || S.links.length)) || (id === "account" && !!S.account) || (id === "pack" && !!S.pack);
}

function renderHeader() {
  const cur = route();
  const ar = getLang() === "ar";
  $("#top").innerHTML = `
    <div class="wrap top-row">
      <a class="brand" href="#/" aria-label="${esc(t("brand.home"))}">
        <img class="brand-mark" src="/img/mark.svg" alt="" width="34" height="40">
        <img class="brand-word" src="/img/wordmark.svg" alt="Proofline" width="94" height="23">
      </a>
      <div class="top-actions">
        <button class="hdr-btn" id="lang-toggle" type="button" lang="${ar ? "en" : "ar"}">${ar ? "English" : "العربية"}</button>
        <button class="hdr-btn hdr-btn-line" id="clear-all" type="button">${esc(t("clear"))}</button>
      </div>
    </div>
    <nav class="wrap menu" aria-label="${esc(t("nav.label"))}">
      <ul>${NAV.map((id) => `<li><a href="#/${id}"${id === cur ? ' aria-current="page"' : ""}>${esc(t(`nav.${id}`))}${isDone(id) ? `<span class="done" aria-label="${esc(t("nav.done"))}">✓</span>` : ""}</a></li>`).join("")}</ul>
    </nav>`;
  $("#lang-toggle").addEventListener("click", () => {
    setLang(ar ? "en" : "ar");
    const url = new URL(location.href);
    if (getLang() === "ar") url.searchParams.set("lang", "ar");
    else url.searchParams.delete("lang");
    history.replaceState(null, "", url);
    update();
  });
  $("#clear-all").addEventListener("click", clearAll);
}

function renderFooter() {
  const c = D.COUNTRIES[S.country];
  $("#foot").innerHTML = `
    <div class="wrap foot-in">
      <label class="foot-country"><span>${esc(t("foot.country"))}</span>
        <select id="country">${countryOptions(t("foot.choose"))}</select></label>
      ${c ? `<p class="foot-emergency">${esc(t("foot.emergency", { c: L(c.name), x: L(c.emergency) }))}</p>` : ""}
      <p>${esc(t("foot.note"))}</p>
    </div>`;
  $("#country").addEventListener("change", (e) => setCountry(e.target.value));
}

function countryOptions(placeholder) {
  return `<option value="">${esc(placeholder)}</option>${COUNTRY_KEYS.map((k) => `<option value="${esc(k)}"${k === S.country ? " selected" : ""}>${esc(L(D.COUNTRIES[k].name))}</option>`).join("")}<option value="other"${S.country === "other" ? " selected" : ""}>${esc(t("other"))}</option>`;
}

// Text boxes follow what is typed in them. When empty, they follow the page language, so
// Arabic placeholders read right to left. (dir="auto" alone makes empty boxes left to right.)
const STRONG = /[A-Za-z\u00C0-\u024F]|[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
function setDir(el) {
  const m = (el.value || "").match(STRONG);
  el.dir = m ? (/[A-Za-z\u00C0-\u024F]/.test(m[0]) ? "ltr" : "rtl") : getLang() === "ar" ? "rtl" : "ltr";
}
function autoDirs(root) {
  $$('input[dir="auto"], textarea[dir="auto"]', root).forEach((el) => {
    el.dataset.autodir = "";
    setDir(el);
  });
}
document.addEventListener("input", (e) => {
  if (e.target instanceof HTMLElement && "autodir" in e.target.dataset) setDir(e.target);
});

function renderPage() {
  const name = route();
  const PAGES = { "": home, evidence, account, pack, remove, help, learn, about }; // pages are defined further down
  const page = PAGES[name] || home;
  renderHeader();
  renderFooter();
  $("#skip").textContent = t("skip");
  const main = $("#main");
  const gated = GATED.has(name) && !S.started;
  main.innerHTML = `<div class="page">${gated ? page.intro() + consentPanel() : page.render()}</div>`;
  if (gated) bindConsent(main);
  else page.bind && page.bind(main);
  autoDirs(main);
}

// New page: start at the top and move focus to the heading.
function navigate() {
  renderPage();
  window.scrollTo(0, 0);
  $("#main h1")?.focus({ preventScroll: true });
  $(".menu [aria-current]")?.scrollIntoView({ block: "nearest", inline: "center" });
}

function selectorFor(el) {
  if (!el || el === document.body || !el.tagName) return null;
  if (el.id) return `#${CSS.escape(el.id)}`;
  for (const a of el.attributes) if (a.name.startsWith("data-")) return `${el.tagName.toLowerCase()}[${a.name}="${CSS.escape(a.value)}"]`;
  return null;
}

// Same page, new content: keep the scroll position, open sections and focus where they were.
function update() {
  const y = window.scrollY;
  const sel = selectorFor(document.activeElement);
  const open = $$("details[open][data-key]").map((d) => d.dataset.key);
  renderPage();
  open.forEach((k) => {
    const d = $(`details[data-key="${CSS.escape(k)}"]`);
    if (d) d.open = true;
  });
  window.scrollTo(0, y);
  if (sel) $(sel)?.focus({ preventScroll: true });
}

window.addEventListener("hashchange", navigate);

// ---------------------------------------------------------------------------
// Consent (shown on whichever evidence section is opened first)
// ---------------------------------------------------------------------------
function consentPanel() {
  return `
    <div class="panel consent">
      <h2 class="h-sm">${esc(t("consent.title"))}</h2>
      <label class="check"><input type="checkbox" id="c1"> <span>${esc(t("consent.c1"))}</span></label>
      <label class="check"><input type="checkbox" id="c2"> <span>${esc(t("consent.c2"))}</span></label>
      <div class="btn-row"><button class="btn btn-primary" id="consent-go" disabled>${esc(t("consent.go"))}</button></div>
    </div>`;
}

function bindConsent(root) {
  const c1 = $("#c1", root), c2 = $("#c2", root), go = $("#consent-go", root);
  const upd = () => (go.disabled = !(c1.checked && c2.checked));
  c1.addEventListener("change", upd);
  c2.addEventListener("change", upd);
  go.addEventListener("click", () => {
    S.started = true;
    update();
    $("#main h1")?.focus({ preventScroll: true });
  });
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
const home = {
  render() {
    const urgent = S.forms.has("doxing");
    const em = D.COUNTRIES[S.country] ? L(D.COUNTRIES[S.country].emergency) : null;
    return `
      <h1 tabindex="-1">${esc(t("home.title"))}</h1>
      <p class="lead">${esc(t("home.lead"))}</p>

      <h2>${esc(t("home.q"))}</h2>
      <p class="muted">${esc(t("home.pick"))}</p>
      <div class="tiles" role="group" aria-label="${esc(t("home.formsLabel"))}">
        ${FORMS.map((f) => `<button type="button" class="tile" data-form="${f.id}" aria-pressed="${S.forms.has(f.id)}"><strong>${esc(L(f.title))}</strong><span>${esc(L(f.short))}</span></button>`).join("")}
      </div>
      ${urgent ? `<div class="alert"><strong>${esc(em ? t("home.dangerNum", { num: em }) : t("home.danger"))}</strong></div>` : ""}
      <div class="btn-row home-cta"><a class="btn btn-primary" href="#/evidence">${esc(t("home.start"))}</a><a class="btn btn-secondary" href="#/remove">${esc(t("home.skip"))}</a></div>
      <p class="small muted">${esc(t("home.basedOn"))} ${ext(UN_SOURCE.url, esc(L(UN_SOURCE.title)))} (${esc(L(UN_SOURCE.date))}). <a href="#/learn">${esc(t("home.learnLink"))}</a></p>

      <h2>${esc(t("home.privacy"))}</h2>
      <ul class="plain">
        <li><strong>${esc(t("priv.1a"))}</strong> ${esc(t("priv.1b"))}</li>
        <li><strong>${esc(t("priv.2a"))}</strong> ${esc(t("priv.2b"))}</li>
        <li><strong>${esc(t("priv.3a"))}</strong> ${esc(t("priv.3b"))}</li>
        <li><strong>${esc(t("priv.4a"))}</strong> ${esc(t("priv.4b"))}</li>
      </ul>
      <p class="small muted">${esc(t("home.tool"))}</p>`;
  },
  bind(root) {
    $$(".tile", root).forEach((b) =>
      b.addEventListener("click", () => {
        const id = b.dataset.form;
        if (S.forms.has(id)) S.forms.delete(id);
        else S.forms.add(id);
        S.target = null;
        S.platform = null;
        update();
      }),
    );
  },
};

// ---------------------------------------------------------------------------
// Evidence
// ---------------------------------------------------------------------------
const metaRow = (k, v) =>
  `<tr><th>${esc(t(`meta.${k}`))}</th><td>${k === "location" ? esc(t("meta.gpsPresent")) : DATE_KEYS.includes(k) ? `${ltr(v)} ${esc(t("meta.asRecorded"))}` : ltr(v)}</td></tr>`;

function itemHtml(it, i) {
  return `
    <li class="item">
      <div class="seal${S.newSeals.has(it.id) ? " new" : ""}" aria-hidden="true"><img src="/img/mark.svg" alt=""></div>
      <div class="item-body">
        <div class="item-name">${i + 1}. ${ltr(it.name)}</div>
        <div class="item-sub">${t("ev.itemSub", { type: ltr(it.type), size: ltr(humanSize(it.size)), time: ltr(it.processedAt) })}</div>
        ${it.gps ? `<p class="gps">${esc(t("ev.gps"))}</p>` : ""}
        <details data-key="item-${it.id}">
          <summary>${esc(t("ev.details"))}</summary>
          <div class="item-details">
            <div class="hash" dir="ltr">SHA-256 ${esc(it.sha256)}<br>MD5&nbsp;&nbsp;&nbsp; ${esc(it.md5)}</div>
            <table class="kv">${it.lastModified ? `<tr><th>${esc(t("ev.fileDate"))}</th><td>${ltr(it.lastModified)}</td></tr>` : ""}${Object.entries(it.meta).map(([k, v]) => metaRow(k, v)).join("")}</table>
            ${it.ocrText ? `<div><p class="small muted">${esc(t("ev.ocrFound"))}</p><div class="ocr" dir="auto">${esc(it.ocrText)}</div></div>` : it.type.startsWith("image/") ? `<p class="small muted">${esc(t("ev.ocrStatus", { s: t(`ocr.${it.ocrStatus}`) }))}</p>` : ""}
          </div>
        </details>
        <label class="field note-field"><span class="small">${esc(t("ev.note"))}</span>
          <input type="text" dir="auto" data-note="${it.id}" value="${esc(it.note)}" placeholder="${esc(t("ev.notePh"))}"></label>
        <div class="btn-row"><button class="btn btn-ghost btn-small" data-remove="${it.id}">${esc(t("remove"))}</button></div>
      </div>
    </li>`;
}

const evidence = {
  intro() {
    return `<h1 tabindex="-1">${esc(t("ev.title"))}</h1><p class="lead">${esc(t("ev.lead"))}</p>`;
  },
  render() {
    const p = S.processing;
    return `
      ${this.intro()}
      <div class="alert"><strong>${esc(t("ev.minorA"))}</strong> ${esc(t("ev.minorB"))} ${ext("https://takeitdown.ncmec.org", "Take It Down")}.</div>

      <label class="drop" id="drop">
        <input type="file" id="files" multiple>
        <strong>${esc(t("ev.drop"))}</strong>
        <span class="muted small">${esc(t("ev.dropSub"))}</span>
      </label>
      <label class="check"><input type="checkbox" id="ocr" ${ocrSupported() ? "checked" : "disabled"}> <span>${esc(t("ev.ocr"))} ${esc(ocrSupported() ? t("ev.ocrFirst") : t("ev.ocrNo"))}</span></label>
      <div class="progress" aria-live="polite"${p ? "" : " hidden"}><span>${esc(p ? p.label : "")}</span><div class="bar"><i style="width:${p ? Math.round(p.pct * 100) : 0}%"></i></div></div>

      <details class="outline" data-key="tips"><summary><strong>${esc(t("ev.tipsTitle"))}</strong></summary>
        <ul class="plain">${[1, 2, 3, 4, 5, 6].map((n) => `<li>${esc(t(`ev.tip${n}`))}</li>`).join("")}</ul>
      </details>

      ${S.items.length ? `<h2>${esc(t("ev.sealed"))}</h2><ul class="items">${S.items.map(itemHtml).join("")}</ul>` : ""}

      <h2>${esc(t("ev.linksTitle"))}</h2>
      <p class="muted">${esc(t("ev.linksLead"))}</p>
      <form id="link-form" class="panel">
        <label class="field"><span>${esc(t("ev.lVal"))}</span><input type="text" dir="auto" id="l-val" placeholder="${esc(t("ev.lValPh"))}" required></label>
        <div class="grid-2">
          <label class="field"><span>${esc(t("ev.lPlat"))}</span><input type="text" dir="auto" id="l-plat" placeholder="${esc(t("ev.lPlatPh"))}"></label>
          <label class="field"><span>${esc(t("ev.lNote"))}</span><input type="text" dir="auto" id="l-note" placeholder="${esc(t("ev.lNotePh"))}"></label>
        </div>
        <div class="btn-row"><button class="btn btn-secondary" type="submit" id="l-add">${esc(t("add"))}</button></div>
      </form>
      ${S.links.length ? `<ul class="links">${S.links.map((l, i) => `<li><div><div class="val">${ltr(l.value)}</div><div class="small muted">${esc([l.platform, l.note].filter(Boolean).join(" · ") || t("ev.noDetails"))}. ${t("ev.recorded", { time: ltr(l.recordedAt) })}</div></div><button class="btn btn-ghost btn-small" data-rmlink="${i}">${esc(t("remove"))}</button></li>`).join("")}</ul>` : ""}

      <div class="btn-row next"><a class="btn btn-primary" href="#/account">${esc(t("ev.next"))}</a></div>`;
  },
  bind(root) {
    const input = $("#files", root);
    const drop = $("#drop", root);
    input.addEventListener("change", () => handleFiles([...input.files]));
    ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
    drop.addEventListener("drop", (e) => handleFiles([...e.dataTransfer.files]));
    $$("[data-note]", root).forEach((el) =>
      el.addEventListener("input", () => {
        const it = S.items.find((x) => x.id === Number(el.dataset.note));
        if (it) { it.note = el.value; S.pack = null; }
      }),
    );
    $$("[data-remove]", root).forEach((b) =>
      b.addEventListener("click", () => {
        S.items = S.items.filter((x) => x.id !== Number(b.dataset.remove));
        S.pack = null;
        update();
      }),
    );
    $("#link-form", root).addEventListener("submit", (e) => {
      e.preventDefault();
      const value = $("#l-val", root).value.trim();
      if (!value) return;
      S.links.push({ value, platform: $("#l-plat", root).value.trim(), note: $("#l-note", root).value.trim(), recordedAt: utcNow() });
      S.pack = null;
      update();
      $("#l-val")?.focus({ preventScroll: true });
      toast(t("ev.linkAdded"));
    });
    $$("[data-rmlink]", root).forEach((b) =>
      b.addEventListener("click", () => {
        S.links.splice(Number(b.dataset.rmlink), 1);
        S.pack = null;
        update();
      }),
    );
  },
};

async function handleFiles(files) {
  if (!files.length || S.processing) return;
  const ocr = $("#ocr")?.checked ?? false;
  const known = new Set(S.items.map((x) => x.sha256));
  let added = 0, dupes = 0;
  S.newSeals.clear();
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    S.processing = { label: t("ev.sealing", { i: i + 1, n: files.length, name: f.name }), pct: i / files.length };
    refreshProgress();
    const item = await processFile(f, {
      ocr,
      onProgress: (m) => {
        if (m.status === "recognizing text") S.processing.label = t("ev.reading", { name: f.name, pct: Math.round(m.progress * 100) });
        else if (m.status && m.status.includes("load")) S.processing.label = t("ev.preparing");
        S.processing.pct = (i + (m.progress || 0)) / files.length;
        refreshProgress();
      },
    });
    if (known.has(item.sha256)) { dupes++; continue; }
    known.add(item.sha256);
    S.items.push(item);
    S.newSeals.add(item.id);
    added++;
  }
  S.processing = null;
  S.pack = null;
  if (route() === "evidence") update();
  toast(`${t("ev.done", { n: added })}${dupes ? ` ${t("ev.dupes", { n: dupes })}` : ""}`);
}

function refreshProgress() {
  const el = $(".progress");
  if (!el || !S.processing) return;
  el.hidden = false;
  el.querySelector("span").textContent = S.processing.label;
  el.querySelector(".bar > i").style.width = `${Math.round(S.processing.pct * 100)}%`;
}

// ---------------------------------------------------------------------------
// Account
// ---------------------------------------------------------------------------
function qField(q, big) {
  const d = S.draft[q.key] || { text: "", dk: false };
  return `
    <div class="q">
      <label class="field"><span>${esc(L(q.q))}</span>${q.hint ? `<span class="hint">${esc(L(q.hint))}</span>` : ""}
        <textarea dir="auto" data-q="${q.key}" class="${big ? "tall" : ""}">${esc(d.text)}</textarea></label>
      <label class="check dk"><input type="checkbox" data-dk="${q.key}"${d.dk ? " checked" : ""}> <span>${esc(t("dk"))}</span></label>
    </div>`;
}

const answerShown = (a) => (a.dontKnow ? t("acc.dkAnswer") : a.answer || t("acc.notAnswered"));
const aboutShown = (k) => (k === "general" ? t("acc.general") : questionText(k, getLang()));

const account = {
  intro() {
    return `<h1 tabindex="-1">${esc(t("acc.title"))}</h1><p class="lead">${esc(t("acc.lead"))}</p>`;
  },
  render() {
    const rules = `<div class="panel"><h2 class="h-sm">${esc(t("acc.before"))}</h2><ul class="plain">${GROUND_RULES.map((r) => `<li>${esc(L(r))}</li>`).join("")}</ul></div>`;
    if (!S.account) {
      return `
        ${this.intro()}
        ${rules}
        <details class="outline" data-key="warmup"><summary><strong>${esc(t("acc.warm"))}</strong> <span class="muted small">${esc(t("acc.notSaved"))}</span></summary>
          <p class="small">${esc(t("acc.warmText"))}</p>
          <textarea dir="auto" aria-label="${esc(t("acc.warmLabel"))}"></textarea>
        </details>
        ${qField(ACCOUNT_OPEN, true)}
        <h2>${esc(t("acc.more"))}</h2>
        <p class="muted">${esc(t("acc.moreLead"))}</p>
        ${ACCOUNT_SPECIFIC.map((q) => qField(q, false)).join("")}
        <div class="btn-row next"><button class="btn btn-primary" id="save-acc">${esc(t("acc.save"))}</button></div>
        <p class="small muted">${esc(t("acc.saveNote"))}</p>`;
    }
    const a = S.account;
    return `
      <h1 tabindex="-1">${esc(t("acc.title"))}</h1>
      <p class="note">${t("acc.savedNote", { time: ltr(a.lockedAt) })}</p>
      ${a.answers.map((x) => `<p class="saved-q">${esc(questionText(x.key, getLang()))}</p><p class="saved-a" dir="auto">${esc(answerShown(x))}</p>`).join("")}
      <h2>${esc(t("acc.addTitle"))}</h2>
      <form id="rev-form" class="panel">
        <label class="field"><span>${esc(t("acc.about"))}</span>
          <select id="rev-about"><option value="general">${esc(t("acc.general"))}</option>${ALL_QUESTIONS.map((q) => `<option value="${q.key}">${esc(L(q.q))}</option>`).join("")}</select></label>
        <label class="field"><span>${esc(t("acc.text"))}</span><textarea dir="auto" id="rev-text" required></textarea></label>
        <label class="field"><span>${esc(t("acc.reason"))}</span><input type="text" dir="auto" id="rev-reason" placeholder="${esc(t("acc.reasonPh"))}"></label>
        <div class="btn-row"><button class="btn btn-secondary" type="submit" id="rev-add">${esc(t("acc.addBtn"))}</button></div>
      </form>
      ${a.revisions.map((r, i) => `<div class="rev"><p class="small muted">${t("acc.corr", { i: i + 1, time: ltr(r.at), about: esc(aboutShown(r.about)) })}</p><p dir="auto">${nl2br(r.text)}</p><p class="small muted">${esc(t("acc.reasonShown", { r: r.reason || t("notGiven") }))}</p></div>`).join("")}
      <div class="btn-row next"><a class="btn btn-primary" href="#/pack">${esc(t("acc.next"))}</a><button class="btn btn-ghost" id="restart-acc">${esc(t("acc.restart"))}</button></div>`;
  },
  bind(root) {
    $$("[data-q]", root).forEach((el) =>
      el.addEventListener("input", () => {
        S.draft[el.dataset.q] = { ...(S.draft[el.dataset.q] || { dk: false }), text: el.value };
      }),
    );
    $$("[data-dk]", root).forEach((c) =>
      c.addEventListener("change", () => {
        S.draft[c.dataset.dk] = { ...(S.draft[c.dataset.dk] || { text: "" }), dk: c.checked };
      }),
    );
    $("#save-acc", root)?.addEventListener("click", () => {
      const answers = ALL_QUESTIONS.map((q) => {
        const d = S.draft[q.key] || { text: "", dk: false };
        return { key: q.key, answer: (d.text || "").trim(), dontKnow: !!d.dk };
      });
      if (!answers.some((a) => a.answer || a.dontKnow)) {
        toast(t("acc.empty"));
        return;
      }
      S.account = { lockedAt: utcNow(), answers, revisions: [] };
      S.pack = null;
      navigate();
      toast(t("acc.saved"));
    });
    $("#rev-form", root)?.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = $("#rev-text", root).value.trim();
      if (!text) return;
      S.account.revisions.push({ at: utcNow(), about: $("#rev-about", root).value, text, reason: $("#rev-reason", root).value.trim() });
      S.pack = null;
      update();
      toast(t("acc.corrAdded"));
    });
    $("#restart-acc", root)?.addEventListener("click", async () => {
      if (await ask({ title: t("acc.delTitle"), html: `<p>${esc(t("acc.delText"))}</p>`, ok: t("delete") })) {
        S.account = null;
        S.draft = {};
        S.pack = null;
        navigate();
      }
    });
  },
};

// ---------------------------------------------------------------------------
// Evidence pack
// ---------------------------------------------------------------------------
const pack = {
  intro() {
    return `<h1 tabindex="-1">${esc(t("pk.title"))}</h1><p class="lead">${esc(t("pk.lead"))}</p>`;
  },
  render() {
    const empty = !(S.items.length || S.links.length || S.account);
    const o = S.packOpts;
    const plang = o.lang || getLang();
    return `
      ${this.intro()}
      <div class="panel">
        <p>${esc(t("pk.summary", { n: S.items.length, l: S.links.length, a: S.account ? t("pk.saved") : t("pk.notWritten") }))}</p>
        ${formTitles().length ? `<p class="small muted">${esc(t("pk.type", { x: formTitles().join(getLang() === "ar" ? "؛ " : "; ") }))}</p>` : ""}
      </div>
      ${
        empty
          ? `<p>${esc(t("pk.empty"))}</p><div class="btn-row"><a class="btn btn-secondary" href="#/evidence">${esc(t("pk.goEvidence"))}</a><a class="btn btn-secondary" href="#/account">${esc(t("pk.goAccount"))}</a></div>`
          : `
      <div class="grid-2 align-end">
        <label class="field"><span>${esc(t("pk.titleField"))}</span><input type="text" dir="auto" id="p-title" value="${esc(o.title)}" placeholder="${esc(t("pk.titlePh"))}"></label>
        <label class="field"><span>${esc(t("pk.name"))}</span><input type="text" dir="auto" id="p-name" value="${esc(o.name)}"></label>
      </div>
      <label class="field narrow"><span>${esc(t("pk.lang"))}</span>
        <select id="p-lang"><option value="en"${plang === "en" ? " selected" : ""}>English</option><option value="ar"${plang === "ar" ? " selected" : ""}>العربية</option></select></label>
      <label class="check"><input type="checkbox" id="p-orig"${o.originals ? " checked" : ""}> <span>${esc(t("pk.orig"))}</span></label>
      <div class="btn-row"><button class="btn btn-primary" id="build">${esc(S.pack ? t("pk.rebuild") : t("pk.build"))}</button></div>
      ${
        S.pack
          ? `<div class="outline ready">
              <p><strong>${esc(t("pk.ready"))}</strong> ${t("pk.built", { time: ltr(S.pack.generatedAt) })}</p>
              <div class="btn-row"><button class="btn btn-primary" id="dl-zip">${esc(t("pk.dlZip"))}</button><button class="btn btn-secondary" id="dl-pdf">${esc(t("pk.dlPdf"))}</button></div>
              <p class="small muted">${esc(t("pk.manifest"))} <span class="hash inline" dir="ltr">${esc(S.pack.manifestSha)}</span></p>
              <p class="small">${esc(t("pk.keep"))}</p>
            </div>
            ${debrief()}`
          : ""
      }`
      }`;
  },
  bind(root) {
    const o = S.packOpts;
    $("#p-title", root)?.addEventListener("input", (e) => (o.title = e.target.value));
    $("#p-name", root)?.addEventListener("input", (e) => (o.name = e.target.value));
    $("#p-lang", root)?.addEventListener("change", (e) => (o.lang = e.target.value));
    $("#p-orig", root)?.addEventListener("change", (e) => (o.originals = e.target.checked));
    $("#build", root)?.addEventListener("click", async (e) => {
      e.target.disabled = true;
      e.target.textContent = t("pk.building");
      const plang = o.lang || getLang();
      try {
        S.pack = await buildPack(
          S.items,
          S.links,
          S.account,
          { title: o.title.trim(), preparedBy: o.name.trim(), country: D.COUNTRIES[S.country] ? L(D.COUNTRIES[S.country].name, plang) : "", forms: formTitles(plang), lang: plang },
          o.originals,
        );
      } catch (err) {
        console.error(err);
        toast(t("pk.fail"));
      }
      update();
      $(".ready")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    const stamp = () => new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
    $("#dl-zip", root)?.addEventListener("click", () => download(S.pack.zip, `proofline-pack-${stamp()}.zip`, "application/zip"));
    $("#dl-pdf", root)?.addEventListener("click", () => download(S.pack.pdf, `proofline-report-${stamp()}.pdf`, "application/pdf"));
  },
};

function debrief() {
  return `
    <div class="panel">
      <h2 class="h-sm">${esc(t("db.title"))}</h2>
      <p>${esc(t("db.text"))}</p>
      <div class="btn-row"><a class="btn btn-secondary btn-small" href="#/remove">${esc(t("db.remove"))}</a><a class="btn btn-secondary btn-small" href="#/help">${esc(t("db.talk"))}</a></div>
    </div>`;
}

// ---------------------------------------------------------------------------
// Get it removed: guides + report builder
// ---------------------------------------------------------------------------
const selectedForms = () => FORMS.filter((f) => S.forms.has(f.id));
const uniq = (arr) => [...new Set(arr)];
const suggestedPlatforms = () => uniq(selectedForms().flatMap((f) => f.guides));
const suggestedTargets = () => uniq(selectedForms().flatMap((f) => f.targets));

function stopNciiPanel() {
  const s = D.STOPNCII;
  return `
    <h2>${esc(t("stop.title"))}</h2>
    <div class="panel">
      <p>${tx(s.what)}</p>
      <p><strong>${esc(L(s.partners))}</strong></p>
      <p class="small">${esc(L(s.not_partners))} ${ext(s.partners_source, esc(t("stop.seeList")))}.</p>
      <p class="small"><strong>${esc(t("stop.can"))}</strong></p>
      <ul class="plain small">${s.criteria.map((c) => `<li>${esc(L(c))}</li>`).join("")}</ul>
      <p class="small muted">${esc(L(s.deepfake_note))}</p>
      <div class="btn-row"><a class="btn btn-primary" href="${s.link}" target="_blank" rel="noopener noreferrer">${esc(t("stop.open"))}</a></div>
    </div>`;
}

function guidesHtml() {
  const sugg = suggestedPlatforms();
  const all = [...sugg, ...Object.keys(D.PLATFORM_GUIDES).filter((p) => !sugg.includes(p))];
  const current = S.platform && all.includes(S.platform) ? S.platform : all[0];
  const g = D.PLATFORM_GUIDES[current];
  const sel = selectedForms();
  const none = !sel.length;
  const showNcii = none || sel.some((f) => f.showStopNCII);
  const showSex = sel.some((f) => f.showSextortion);
  const showSec = sel.some((f) => f.showSecurity);
  const arNote = getLang() === "ar" ? `<p class="small muted">${esc(t("rm.arLabels"))}</p>` : "";

  return `
    <p class="note">${tx(D.GENERAL_DEEPFAKE_NOTE)}</p>
    <p class="small muted">${esc(t("rm.capture"))}</p>
    ${showNcii && S.forms.has("image") ? stopNciiPanel() : ""}

    <h2 id="platforms">${esc(t("pg.title"))}</h2>
    ${sugg.length ? `<p class="small muted">${esc(t("pg.suggested"))}</p>` : ""}
    ${arNote}
    <div class="chips" role="group" aria-label="${esc(t("pg.label"))}">
      ${all.map((p) => `<button type="button" class="chip" data-plat="${esc(p)}" aria-pressed="${p === current}">${esc(L(D.PLATFORM_GUIDES[p].label))}</button>`).join("")}
    </div>
    <div class="stack">
      <p class="muted">${tx(g.summary)}</p>
      ${g.routes
        .map(
          (r) => `
        <div class="outline">
          <h3>${tx(r.title)}</h3>
          <ol class="steps-list">${r.steps.map((s) => `<li>${tx(s)}</li>`).join("")}</ol>
          ${r.requirements ? `<p class="small"><strong>${esc(t("pg.checks"))}</strong></p><ul class="plain small">${r.requirements.map((x) => `<li>${tx(x)}</li>`).join("")}</ul>` : ""}
          ${r.links ? `<p class="small links-inline">${r.links.map(([l, u]) => ext(u, esc(L(l)))).join("<br>")}</p>` : ""}
          ${r.note ? `<p class="small muted">${tx(r.note)}</p>` : ""}
        </div>`,
        )
        .join("")}
    </div>
    <div class="btn-row"><button class="btn btn-secondary" data-tab="report" id="to-report">${esc(t("pg.write"))}</button></div>
    ${showNcii && !S.forms.has("image") ? stopNciiPanel() : ""}
    ${showSex ? `<h2>${esc(t("sx.title"))}</h2><div class="cards">${D.SEXTORTION_CARDS.map(([a, b]) => `<div class="card-tip"><strong>${esc(L(a))}</strong><span>${esc(L(b))}</span></div>`).join("")}</div>` : ""}
    ${showSec ? `<h2>${esc(t("sec.title"))}</h2><ol class="steps-list">${SECURITY_STEPS.map(([a, b]) => `<li><strong>${esc(L(a))}.</strong> ${esc(L(b))}</li>`).join("")}</ol>` : ""}
    <p class="small muted end-note">${esc(t("pg.checked", { date: D.GUIDES_LAST_CHECKED }))}</p>`;
}

const AI_ANSWERS = { yes: "rb.yes", unsure: "rb.unsure", no: "rb.no" };

function reportHtml() {
  const sugg = suggestedTargets();
  const ids = [...sugg, ...Object.keys(D.REPORT_TARGETS).filter((x) => !sugg.includes(x))];
  const tid = S.target && ids.includes(S.target) ? S.target : ids[0];
  S.target = tid;
  const tg = D.REPORT_TARGETS[tid];
  const vals = (S.rb[tid] ||= {});
  const rlang = S.rbLang || getLang();
  const draft = assemble(tg, vals, S.rbName, S.rbAi === "yes", rlang);
  const fit = fitNote(draft, tg.limit);
  return `
    <label class="field"><span>${esc(t("rb.for"))}</span>
      <select id="rb-target">${ids.map((id) => `<option value="${id}"${id === tid ? " selected" : ""}>${esc(L(D.REPORT_TARGETS[id].name))}${sugg.includes(id) ? ` ${esc(t("rb.suggested"))}` : ""}</option>`).join("")}</select></label>
    <div class="panel small">
      <p><strong>${esc(t("rb.category"))}</strong> ${tx(tg.category)}</p>
      <p><strong>${esc(t("rb.rule"))}</strong> ${esc(L(tg.policy))}</p>
      ${tg.url ? `<p><strong>${esc(t("rb.where"))}</strong> ${ext(tg.url, ltr(tg.url.replace("mailto:", "")))}</p>` : ""}
      ${tg.limit ? `<p><strong>${esc(t("rb.limit", { n: tg.limit }))}</strong></p>` : ""}
    </div>
    <div class="btn-row"><button class="btn btn-secondary btn-small" id="rb-fill">${esc(t("rb.fill"))}</button></div>
    <div class="grid-3">
      <label class="field"><span>${esc(t("rb.name"))}</span><input type="text" dir="auto" id="rb-name" value="${esc(S.rbName)}"></label>
      <label class="field"><span>${esc(t("rb.ai"))}</span>
        <select id="rb-ai">${Object.entries(AI_ANSWERS).map(([v, k]) => `<option value="${v}"${v === S.rbAi ? " selected" : ""}>${esc(t(k))}</option>`).join("")}</select></label>
      <label class="field"><span>${esc(t("rb.lang"))}</span>
        <select id="rb-lang"><option value="en"${rlang === "en" ? " selected" : ""}>English</option><option value="ar"${rlang === "ar" ? " selected" : ""}>العربية</option></select></label>
    </div>
    ${tg.fields
      .map(
        (f) => `
      <label class="field"><span>${esc(L(f.label))}</span>${f.help ? `<span class="hint">${esc(L(f.help))}</span>` : ""}
        ${f.kind === "text" ? `<input type="text" dir="auto" data-rb="${f.key}" value="${esc(vals[f.key] || "")}">` : `<textarea dir="auto" data-rb="${f.key}" placeholder="${f.kind === "urls" ? esc(t("rb.urlPh")) : ""}">${esc(vals[f.key] || "")}</textarea>`}
      </label>`,
      )
      .join("")}
    <details class="outline" data-key="tips-report"><summary><strong>${esc(t("rb.tips"))}</strong></summary><ul class="plain small">${WRITING_TIPS.map((x) => `<li>${esc(L(x))}</li>`).join("")}</ul></details>

    <h2>${esc(t("rb.your"))}</h2>
    <div class="tabs" role="tablist">
      <button role="tab" id="tab-tpl" aria-selected="${S.rbMode !== "ai"}">${esc(t("rb.tabTpl"))}</button>
      <button role="tab" id="tab-ai" aria-selected="${S.rbMode === "ai"}">${esc(t("rb.tabAi"))}</button>
    </div>
    <div class="stack">${
      S.rbMode === "ai"
        ? aiPanel(tg, tid, vals, rlang)
        : `
      <textarea id="tpl-out" class="out" dir="${rlang === "ar" ? "rtl" : "ltr"}" aria-label="${esc(t("rb.text"))}">${esc(draft)}</textarea>
      <p class="count${fit && fit.over ? " over" : ""}" id="tpl-count">${fit ? esc(`${t("rb.count", { n: fit.n, limit: fit.limit })}${fit.over ? ` ${t("rb.over")}` : ""}`) : ""}</p>
      <div class="btn-row"><button class="btn btn-primary" data-copy="tpl-out">${esc(t("rb.copy"))}</button><button class="btn btn-secondary" data-dltxt="tpl-out">${esc(t("rb.dl"))}</button></div>`
    }</div>`;
}

function aiPanel(tg, tid, vals, rlang) {
  const ai = S.ai;
  if (!ai.checked) return `<p class="muted">${esc(t("ai.checking"))}</p>`;
  if (!ai.configured)
    return `<p>${esc(t("ai.off"))}</p>
      <details class="outline small" data-key="ai-owner"><summary>${esc(t("ai.owner"))}</summary><p dir="ltr">${esc(ai.reason)}</p></details>`;
  if (!ai.ack) return `<p>${esc(t("ai.intro"))}</p><div class="btn-row"><button class="btn btn-secondary" id="ai-start">${esc(t("ai.start"))}</button></div>`;
  if (!S.hideNames && S.rbName.trim()) S.hideNames = S.rbName.trim();
  const red = redact(factsText(tg, vals, t(AI_ANSWERS[S.rbAi], {}, rlang), S.rbName, rlang), S.hideNames.split(/[,،]/));
  const out = ai.out[tid];
  const fit = out ? fitNote(out.text, tg.limit) : null;
  return `
    <label class="field"><span>${esc(t("ai.names"))}</span><span class="hint">${esc(t("ai.namesHint"))}</span>
      <input type="text" dir="auto" id="ai-names" value="${esc(S.hideNames)}"></label>
    <details class="outline" data-key="ai-preview"><summary><strong>${esc(t("ai.exact"))}</strong> <span class="small muted" id="ai-count">${esc(t("ai.hidden", { n: red.count }))}</span></summary>
      <div class="ocr" dir="auto" id="ai-preview">${esc(red.text)}</div></details>
    <div class="btn-row"><button class="btn btn-primary" id="ai-go"${ai.busy ? " disabled" : ""}>${esc(ai.busy ? t("ai.busy") : t("ai.go"))}</button></div>
    ${
      out
        ? `
      ${out.missing.length ? `<div class="alert small">${esc(t("ai.missing", { x: out.missing.map((m) => out.mapping[m] || m).join(", ") }))}</div>` : ""}
      ${out.stray.length ? `<div class="alert small">${esc(t("ai.stray", { x: out.stray.join(", ") }))}</div>` : ""}
      <p class="small"><strong>${esc(t("ai.check"))}</strong></p>
      <textarea id="ai-out" class="out" dir="${out.lang === "ar" ? "rtl" : "ltr"}" aria-label="${esc(t("ai.out"))}">${esc(out.text)}</textarea>
      ${fit ? `<p class="count${fit.over ? " over" : ""}">${esc(t("rb.count", { n: fit.n, limit: fit.limit }))}</p>` : ""}
      <div class="btn-row"><button class="btn btn-primary" data-copy="ai-out">${esc(t("rb.copy"))}</button><button class="btn btn-secondary" data-dltxt="ai-out">${esc(t("rb.dl"))}</button></div>
      <p class="small muted">${esc(t("ai.model", { m: ai.model }))}</p>`
        : ""
    }`;
}

async function checkAi() {
  if (S.ai.checked) return;
  try {
    const r = await fetch("/api/refine", { method: "GET" });
    const j = await r.json();
    Object.assign(S.ai, { configured: !!j.configured, model: j.model || "", reason: j.reason || "" });
  } catch {
    S.ai.reason = t("ai.unreachable", {}, "en");
  }
  S.ai.checked = true;
}

// Copy what Proofline already knows into the report boxes (only into empty boxes).
function prefill(tg, vals) {
  const lang = S.rbLang || getLang();
  const isUrl = (v) => /^(https?:\/\/|www\.|t\.me\/)/i.test(v) || /^[\w-]+(\.[\w-]+)+\/\S*/.test(v);
  const urls = S.links.map((l) => l.value).filter(isUrl);
  const handles = S.links.filter((l) => !isUrl(l.value)).map((l) => (l.platform ? `${l.value} (${l.platform})` : l.value));
  const answers = {};
  if (S.account) S.account.answers.forEach((a) => (answers[a.key] = a.dontKnow ? "" : a.answer));
  else Object.entries(S.draft).forEach(([k, d]) => (answers[k] = d.dk ? "" : (d.text || "").trim()));
  let happened = answers.what_happened || "";
  (S.account?.revisions || []).forEach((r) => (happened += `\n\n${t("tpl.addedLater", { time: r.at, text: r.text }, lang)}`));
  const suspect = [answers.who, handles.length ? t("tpl.accounts", { x: handles.join(", ") }, lang) : ""].filter(Boolean).join("\n");
  const harm = [answers.demands ? t("tpl.demands", { x: answers.demands }, lang) : "", answers.witnesses ? t("tpl.witnesses", { x: answers.witnesses }, lang) : ""].filter(Boolean).join("\n");
  const map = {
    content_urls: urls.join("\n"),
    what_happened: happened.trim(),
    explanation: happened.trim(),
    suspect,
    demands: answers.demands || "",
    what_it_shows: answers.what_content || answers.what_happened || "",
    why_fake: answers.ai_signs || "",
    how_altered: answers.ai_signs || answers.what_content || "",
    harm,
    evidence: S.items.length || S.links.length ? t("tpl.evidence", { n: S.items.length, l: S.links.length }, lang) : "",
  };
  let filled = 0, available = 0, firstKey = null;
  for (const f of tg.fields) {
    const v = (map[f.key] || "").trim();
    if (!v) continue;
    available++;
    if ((vals[f.key] || "").trim()) continue;
    vals[f.key] = v;
    filled++;
    firstKey ||= f.key;
  }
  return { filled, available, firstKey };
}

const remove = {
  render() {
    return `
      <h1 tabindex="-1">${esc(t("rm.title"))}</h1>
      <p class="lead">${esc(t("rm.lead"))}</p>
      <div class="tabs" role="tablist">
        <button role="tab" data-tab="guides" aria-selected="${S.removeTab === "guides"}">${esc(t("rm.tabGuides"))}</button>
        <button role="tab" data-tab="report" aria-selected="${S.removeTab === "report"}">${esc(t("rm.tabReport"))}</button>
      </div>
      <div class="stack" id="remove-body">${S.removeTab === "guides" ? guidesHtml() : reportHtml()}</div>`;
  },
  bind(root) {
    $$("[data-tab]", root).forEach((b) =>
      b.addEventListener("click", () => {
        const goingDown = b.id === "to-report";
        S.removeTab = b.dataset.tab;
        update();
        if (goingDown) $(".tabs", root.ownerDocument)?.scrollIntoView({ block: "start", behavior: "smooth" });
      }),
    );
    $$("[data-plat]", root).forEach((b) => b.addEventListener("click", () => { S.platform = b.dataset.plat; update(); }));
    if (S.removeTab !== "report") return;

    const tid = S.target;
    const tg = D.REPORT_TARGETS[tid];
    const vals = S.rb[tid];
    const rlang = () => S.rbLang || getLang();
    const refreshTpl = () => {
      const el = $("#tpl-out");
      if (!el) return;
      const txt = assemble(tg, vals, S.rbName, S.rbAi === "yes", rlang());
      el.value = txt;
      const fit = fitNote(txt, tg.limit);
      const c = $("#tpl-count");
      c.textContent = fit ? `${t("rb.count", { n: fit.n, limit: fit.limit })}${fit.over ? ` ${t("rb.over")}` : ""}` : "";
      c.classList.toggle("over", !!(fit && fit.over));
    };
    const refreshPreview = () => {
      const pv = $("#ai-preview");
      if (!pv) return;
      const red = redact(factsText(tg, vals, t(AI_ANSWERS[S.rbAi], {}, rlang()), S.rbName, rlang()), S.hideNames.split(/[,،]/));
      pv.textContent = red.text;
      $("#ai-count").textContent = t("ai.hidden", { n: red.count });
    };
    $("#rb-target").addEventListener("change", (e) => { S.target = e.target.value; update(); });
    $("#rb-name").addEventListener("input", (e) => { S.rbName = e.target.value; refreshTpl(); refreshPreview(); });
    $("#rb-ai").addEventListener("change", (e) => { S.rbAi = e.target.value; refreshTpl(); refreshPreview(); });
    $("#rb-lang").addEventListener("change", (e) => { S.rbLang = e.target.value; update(); });
    $$("[data-rb]").forEach((el) => el.addEventListener("input", () => { vals[el.dataset.rb] = el.value; refreshTpl(); refreshPreview(); }));
    $("#rb-fill").addEventListener("click", () => {
      const r = prefill(tg, vals);
      if (!r.available) return toast(t("rb.fillNone"));
      if (!r.filled) return toast(t("rb.fillFull"));
      update();
      const first = $(`[data-rb="${r.firstKey}"]`);
      first?.scrollIntoView({ block: "center", behavior: "smooth" });
      first?.focus({ preventScroll: true });
      $$("[data-rb]").forEach((el) => {
        if (el.value.trim()) el.classList.add("flash");
      });
      toast(t("rb.filled", { n: r.filled }));
    });
    $("#tab-tpl").addEventListener("click", () => { S.rbMode = "tpl"; update(); });
    $("#tab-ai").addEventListener("click", async () => {
      S.rbMode = "ai";
      update();
      await checkAi();
      update();
    });
    $$("[data-copy]").forEach((b) =>
      b.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText($(`#${b.dataset.copy}`).value);
          toast(t("copied"));
        } catch {
          $(`#${b.dataset.copy}`).select();
          toast(t("copyManual"));
        }
      }),
    );
    $$("[data-dltxt]").forEach((b) =>
      b.addEventListener("click", () => download(new TextEncoder().encode($(`#${b.dataset.dltxt}`).value), `report-${tid}.txt`, "text/plain;charset=utf-8")),
    );
    $("#ai-names")?.addEventListener("input", (e) => { S.hideNames = e.target.value; refreshPreview(); });
    $("#ai-start")?.addEventListener("click", async () => {
      const ok = await ask({
        title: t("dlg.aiTitle"),
        html: `<p>${esc(t("dlg.ai1"))}</p>
          <ul class="plain small">
            <li><strong>${esc(t("dlg.ai2a"))}</strong> ${esc(t("dlg.ai2b"))}</li>
            <li>${esc(t("dlg.ai3"))}</li>
            <li>${esc(t("dlg.ai4"))}</li>
            <li>${esc(t("dlg.ai5"))}</li>
          </ul>`,
        ok: t("dlg.aiOk"),
        cancel: t("dlg.aiCancel"),
      });
      if (ok) S.ai.ack = true;
      else S.rbMode = "tpl";
      update();
    });
    $("#ai-out")?.addEventListener("input", (e) => { S.ai.out[tid].text = e.target.value; });
    $("#ai-go")?.addEventListener("click", async () => {
      if (!tg.fields.some((f) => (vals[f.key] || "").trim())) return toast(t("ai.fillFirst"));
      const lang = rlang();
      const red = redact(factsText(tg, vals, t(AI_ANSWERS[S.rbAi], {}, lang), S.rbName, lang), S.hideNames.split(/[,،]/));
      S.ai.busy = true;
      update();
      try {
        const r = await fetch("/api/refine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: { name: L(tg.name, "en"), category: L(tg.category, "en"), policy: L(tg.policy, "en"), limit: tg.limit }, facts: red.text, lang }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || t("ai.failed"));
        S.ai.out[tid] = { ...restore(j.text, red.mapping), mapping: red.mapping, lang };
      } catch (err) {
        toast(err.message || t("ai.failed"));
      }
      S.ai.busy = false;
      update();
      $("#ai-out")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  },
};

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------
const PHONE = /(\+?\d[\d ]{2,}\d)/g;
function contactLine(raw) {
  const c = L(raw);
  if (/^https?:\/\//.test(c)) {
    const [u, ...rest] = c.split(" ");
    return `${ext(u, ltr(u))} ${esc(rest.join(" "))}`;
  }
  return esc(c).replace(PHONE, (m) => `<a href="tel:${m.replace(/\s/g, "")}" dir="ltr">${m}</a>`);
}

function entry(e) {
  return `
    <div class="entry">
      <h3>${esc(L(e.name))}</h3>
      <p>${esc(L(e.what))}</p>
      ${e.contact.map((c) => `<p class="contact">${contactLine(c)}</p>`).join("")}
      ${e.note ? `<p class="small muted">${esc(L(e.note))}</p>` : ""}
      <p class="src">${esc(t("hp.source"))} ${ext(e.source, ltr(e.source))}</p>
    </div>`;
}

const HELP_TABS = [["police", "hp.tabPolice"], ["support", "hp.tabSupport"], ["online", "hp.tabOnline"]];

const help = {
  render() {
    const c = D.COUNTRIES[S.country];
    const tab = S.helpTab;
    let body;
    if (tab === "online") body = D.REGIONAL.map(entry).join("");
    else if (c) body = c[tab].map(entry).join("") + (tab === "police" && c.notes.length ? `<div class="panel notes"><h2 class="h-sm">${esc(t("hp.notes"))}</h2>${c.notes.map((n) => `<p>${esc(L(n))}</p>`).join("")}</div>` : "");
    else body = `<p class="muted">${esc(S.country === "other" ? t("hp.otherCountry") : t("hp.pickCountry"))}</p>`;
    return `
      <h1 tabindex="-1">${esc(t("hp.title"))}</h1>
      <label class="field narrow"><span>${esc(t("hp.country"))}</span><select id="help-country">${countryOptions(t("hp.choose"))}</select></label>
      ${c ? `<div class="alert"><p class="emergency-big"><strong>${esc(t("hp.emergency", { x: L(c.emergency) }))}</strong></p></div>` : ""}
      <div class="tabs" role="tablist" aria-label="${esc(t("hp.sections"))}">
        ${HELP_TABS.map(([id, k]) => `<button role="tab" data-help="${id}" aria-selected="${tab === id}">${esc(t(k))}</button>`).join("")}
      </div>
      <div class="entries">${body}</div>
      <p class="small muted">${esc(t("hp.checked", { date: D.DIRECTORY_LAST_CHECKED }))}</p>
      <div class="panel">
        <h2 class="h-sm">${esc(t("hp.selfTitle"))}</h2>
        <p>${esc(t("hp.self"))}</p>
      </div>`;
  },
  bind(root) {
    $("#help-country", root).addEventListener("change", (e) => setCountry(e.target.value));
    $$("[data-help]", root).forEach((b) => b.addEventListener("click", () => { S.helpTab = b.dataset.help; update(); }));
  },
};

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// AI and abuse: the four UN Women forms in more depth
// ---------------------------------------------------------------------------
const learn = {
  render() {
    return `
      <h1 tabindex="-1">${esc(t("ln.title"))}</h1>
      <p class="lead">${esc(t("ln.lead"))}</p>
      ${FORMS.map((f) => `
        <section class="form-learn">
          <h2>${esc(L(f.title))}</h2>
          <p class="muted">${esc(L(f.short))}</p>
          <div class="mini-grid">
            <div class="mini"><h3>${esc(t("ln.looks"))}</h3><ul class="plain">${f.looks.map((l) => `<li>${esc(L(l))}</li>`).join("")}</ul></div>
            <div class="mini"><h3>${esc(t("ln.aiWorse"))}</h3><ul class="plain">${f.ai.map((l) => `<li>${esc(L(l))}</li>`).join("")}</ul></div>
          </div>
          <p class="stat">${esc(L(f.stat))}</p>
        </section>`).join("")}
      <p class="small muted">${esc(t("ln.source"))} ${ext(UN_SOURCE.url, esc(L(UN_SOURCE.title)))} (${esc(L(UN_SOURCE.date))}).</p>
      <h2>${esc(t("ln.next"))}</h2>
      <div class="btn-row"><a class="btn btn-primary" href="#/evidence">${esc(t("home.start"))}</a><a class="btn btn-secondary" href="#/remove">${esc(t("home.skip"))}</a></div>`;
  },
};

const about = {
  render() {
    const ds = D.DEEPSHIELD;
    return `
      <div class="about-hero"><img src="/img/logo-full.svg" alt="Proofline" width="140" height="208"></div>
      <h1 tabindex="-1">${esc(t("ab.title"))}</h1>
      <p class="lead">${esc(t("ab.lead"))}</p>
      <h2>${esc(t("ab.what"))}</h2>
      <p>${esc(t("ab.whatText"))}</p>
      <h2>${esc(t("ab.partner"))}</h2>
      <div class="panel">
        <p><strong>${esc(ds.name)}</strong>: ${esc(L(ds.tagline))} ${esc(L(ds.what))}</p>
        <p class="small muted">${esc(L(ds.by))}</p>
        <div class="btn-row"><a class="btn btn-secondary" href="${esc(ds.url)}" target="_blank" rel="noopener noreferrer">${esc(t("ds.open"))}</a></div>
      </div>
      <h2>${esc(t("ab.built"))}</h2>
      <ul class="plain">
        <li>${ext(UN_SOURCE.url, getLang() === "ar" ? "هيئة الأمم المتحدة للمرأة (2025)" : "UN Women (2025)")}: ${esc(t("ab.b1"))}</li>
        <li>${ext("https://doi.org/10.3389/fpsyg.2023.1289817", "Stevens et al. (2024), Frontiers in Psychology")}: ${esc(t("ab.b2"))}</li>
      </ul>
      <p class="small muted">${esc(t("ab.proto"))}</p>`;
  },
};

// ---------------------------------------------------------------------------
// Shell actions
// ---------------------------------------------------------------------------
function setCountry(v) {
  S.country = v;
  update();
}

async function clearAll() {
  const ok = !hasData() || (await ask({ title: t("clear.title"), html: `<p>${esc(t("clear.text"))}</p>`, ok: t("clear") }));
  if (!ok) return;
  window.removeEventListener("beforeunload", warnLeave);
  location.replace(location.pathname + (getLang() === "ar" ? "?lang=ar" : "")); // full reload wipes all memory
}

function warnLeave(e) {
  if (hasData() && !S.pack) {
    e.preventDefault();
    e.returnValue = "";
  }
}

window.addEventListener("beforeunload", warnLeave);
setLang(new URLSearchParams(location.search).get("lang") === "ar" ? "ar" : "en");
navigate();
