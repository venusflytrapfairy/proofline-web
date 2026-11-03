# Proofline

**Gather proof of AI abuse. Get it taken down.** In English and Arabic.

Proofline helps women and girls in the Middle East and North Africa who face **AI-facilitated, technology-facilitated violence** to document what happened and get it removed. It was developed by **Anusha Asim and Fatima Yousaf, Girl Up Emirates leaders**.

It is built around the four common forms described by UN Women in *How AI is exacerbating technology-facilitated violence against women and girls* (December 2025):

1. Deepfakes and image-based abuse
2. Impersonation, scams and sextortion
3. Lies, harassment and hate
4. Doxing and threats

The user picks what's happening to her, and Proofline tailors the takedown guides, report types and safety advice to match.

## What it does

The menu bar gives direct access to every section, so the user can follow them in order or jump straight to one.

- **Evidence:**
  - Seals every file with a SHA-256 fingerprint.
  - Reads camera metadata.
  - Warns when a file contains GPS location.
  - Reads the text in screenshots, in English and Arabic.
  - Records links, usernames and numbers.
- **Your account:** a first account written the way investigators recommend: ground rules, an open question first, and "I don't know" always allowed. Corrections are logged with a timestamp and never overwrite the original.
- **Evidence pack:** a ZIP containing a PDF report (in **English or Arabic**), the original files, a manifest and the account.
- **Get it removed:**
  - Step-by-step guides for Google, YouTube, Facebook, Instagram, TikTok, X, Snapchat, Telegram and WhatsApp.
  - StopNCII, with its partner platforms listed.
  - Sextortion advice and account-security steps.
  - A report builder: a guided template or optional AI refinement, with reports in English or Arabic. "Fill in from my evidence and account" copies links, answers and corrections into the report boxes.
- **Get help:** sourced police, support and online contacts for the UAE, Saudi Arabia, Egypt, Jordan and Lebanon, organised in tabs. Online services list StopNCII, Take It Down, SMEX and Access Now first, then **DeepShield AI** for checking a suspected deepfake.
- **AI and abuse:** the four UN Women forms in more depth: what each can look like, how AI makes it worse, and a key figure from the research.
- **About:** who built Proofline, the partner resource, and the research it's built on.
- **العربية:** the button in the header switches the whole site to Arabic, with right-to-left layout. A link with `?lang=ar` opens the site in Arabic.

## How it works, and why it's private

```
public/                 the website: plain HTML, CSS and JavaScript, no build step
  index.html
  css/app.css           pink theme, right-to-left support
  js/app.js             pages, menu, navigation
  js/i18n.js            English/Arabic interface text
  js/data.js            directory, platform guides, report forms (English + Arabic)
  js/forms.js           the four UN forms of AI-facilitated abuse, account questions
  js/evidence.js        fingerprints, metadata, text reading      (runs in the browser)
  js/pack.js            PDF (incl. Arabic layout) and ZIP         (runs in the browser)
  js/redact.js          hides names/numbers/links before AI       (runs in the browser)
  js/report.js          report templates
  img/                  logo (mark, wordmark, full logo, icons)
  ocr/ vendor/ fonts/   self-hosted libraries, language data, fonts
api/refine.py           the only server code: a Python function that calls OpenRouter
dev_server.py           runs everything locally, exactly like Vercel
vercel.json             Vercel settings + strict security headers
tests/                  JavaScript and Python tests
```

- **Files never leave the device.** Fingerprinting, metadata, text reading and the PDF/ZIP all run inside the user's browser.
- **Nothing is stored.** No database, no cookies, no localStorage. Closing the tab erases everything, and *Clear everything* reloads the page to wipe memory.
- **No third-party requests.** All fonts and libraries are self-hosted, and the Content-Security-Policy only allows the site to talk to itself. External links, such as StopNCII or DeepShield, open only when the user clicks them.
- **The AI option is opt-in.** The browser hides names, emails, phone numbers (including Arabic digits), usernames and links first, and shows the exact text that will be sent. `api/refine.py` forwards it to OpenRouter and logs nothing.

---

## Test it locally (VS Code, Windows)

You only need **Python 3.10+**. There's nothing to install.

1. In VS Code, use **File → Open Folder…** and choose the `proofline-web` folder (the one containing `dev_server.py`).
2. Add your key:
   - In the Explorer, copy `.env.example` and rename the copy to exactly `.env`.
   - Edit it so the line reads `OPENROUTER_API_KEY=sk-or-v1-...`. Quotes are optional. Save.
3. Open the terminal (**Ctrl + `**) and run:
   ```powershell
   python dev_server.py
   ```
   It prints `AI option: ON` and the last 4 characters of your key. If it says OFF, it tells you why.
4. Open **http://localhost:3000**, or **http://localhost:3000/?lang=ar** for Arabic. To stop the server, press **Ctrl + C**.

Open the site through `http://localhost:3000`. Double-clicking `index.html` won't work, because browsers block the text reader and the AI function on `file://` pages.

**Run the tests (optional):**
```powershell
python -m pip install pytest
python -m pytest -q tests
node --test tests/js.test.mjs      # needs Node.js 22+
```

## Deploy on Vercel

1. **Push to GitHub** (VS Code → Source Control → Initialize Repository → Commit → Publish Branch → private repo). Check that **`.env` is not in the list of changes**.
2. Go to https://vercel.com → **Add New… → Project** → import the repo.
3. Settings on the import screen:
   - **Framework Preset:** Other
   - **Build Command:** leave empty
   - **Output Directory:** `public` (already set in `vercel.json`)
4. Under **Environment Variables**, add:
   - `OPENROUTER_API_KEY`: the key itself, with **no quotes**.
   - (optional) `PROOFLINE_MODEL`.
5. Click **Deploy**.

After you change an environment variable, go to **Deployments → ⋯ → Redeploy**. Every later `git push` redeploys automatically.

---

## To do
- [ ] Test with survivors and frontline organisations, and get legal review per country.
- [ ] Add rate limiting to `/api/refine` (for example Vercel Firewall rules).
- [ ] Add forensic social media capture features

## Contribute: bring Proofline to your region

Proofline started with five pilot countries: the UAE, Saudi Arabia, Egypt, Jordan and Lebanon. AI-facilitated abuse is everywhere, and the people best placed to make Proofline useful in a new country are the people who live and work there. We'd love pull requests from activists, frontline organisations, students and developers who know their region.

### Add your country

Everything a country needs is in `public/js/data.js`, inside `COUNTRIES`. A new country appears automatically in the country picker, the footer and **Get help**.

1. **Fork** this repo and create a branch, for example `add-morocco`.
2. In `public/js/data.js`, copy an existing country inside `COUNTRIES` (Jordan is a good, compact example) and edit it:
   - `name` and `emergency`: the country's name, and its emergency numbers.
   - `police`: official routes for reporting cybercrime, blackmail or threats.
   - `support`: hotlines, women's organisations, legal aid and mental-health support.
   - `notes`: short facts worth knowing, such as which law covers online blackmail.
3. Each contact looks like this:
   ```js
   {
     name: { en: "Name of the service", ar: "اسم الخدمة" },
     what: { en: "What it does, in one or two sentences.", ar: "ما الذي تقدّمه، في جملة أو جملتين." },
     contact: ["+212 5 00 00 00 00", "https://example.org/report", { en: "WhatsApp: …", ar: "واتساب: …" }],
     note: { en: "Optional: opening hours, limits, or anything to be careful about.", ar: "اختياري: …" },
     source: "https://the-page-where-you-verified-this",
   },
   ```
   - Every piece of text is an `{ en, ar }` pair, and phone numbers and links are plain strings.
   - If you can only write one of the two languages, fill in both as best you can and say so in your pull request. We'll arrange a review.
4. Run it locally (see [Test it locally](#test-it-locally-vs-code-windows)), choose your country and check every tab under **Get help**, in English and with `?lang=ar`.
5. Run the tests (`node --test tests/js.test.mjs`). They check that every entry has both languages.
6. Open a **pull request** that lists your sources and the date you checked them.

**What we check before merging**

- Every entry has a `source` link to an official or well-established page: a government site, the organisation's own site, or reputable news. We don't add personal numbers or unverified groups.
- You checked each contact recently (in the last month), ideally by visiting the official page or calling the number.
- The service is safe for the women and girls who will use it. Use `note` to flag anything they should know first, for example if a line may contact family or a guardian, only covers one city, or isn't confidential.
- Free and confidential services come first.

### Other ways to help

- **Fix a broken link or an out-of-date step** in the platform guides (`PLATFORM_GUIDES` in `public/js/data.js`), and update `GUIDES_LAST_CHECKED`.
- **Add a platform** that's widely used in your region.
- **Improve the Arabic** in `public/js/i18n.js`, `public/js/data.js` and `public/js/forms.js`. We use Modern Standard Arabic and address the reader in the feminine.
- **Add a language**, for example French for North Africa or Persian. This is a bigger change, because every piece of text is currently an English/Arabic pair, so please open an issue first and we'll plan it with you.
- **Report a bug** by opening an issue.

**Never include real evidence in an issue or pull request.** That means no screenshots of abuse, no one's name, number or account, and no real case details. Use made-up examples instead.

If you find a **privacy or security problem**, please don't open a public issue. Report it privately through the repo's **Security** tab instead (**Report a vulnerability**).

## Sources

- UN Women (2025), [How AI is exacerbating technology-facilitated violence against women and girls](https://www.unwomen.org/en/digital-library/publications/2025/12/how-ai-is-exacerbating-technology-facilitated-violence-against-women-and-girls)
- Stevens et al. (2024), [A critical analysis of GBV reporting and evidence building applications](https://doi.org/10.3389/fpsyg.2023.1289817), Frontiers in Psychology
- [StopNCII.org industry partners](https://stopncii.org/partners/industry-partners)
- [UAE Federal Decree-Law No. 34 of 2021 on Countering Rumours and Cybercrimes](https://u.ae/en/information-and-services/justice-safety-and-the-law/cyber-safety-and-digital-security/law-on-combatting-rumours-and-cybercrimes)
- [DeepShield AI](https://deepshield-ai-359228671407.us-central1.run.app/), developed by Aqsa Khan, Girl Up Emirates leader
- Every directory entry in the app shows its own source link.

## Licences

Bundled third-party code and fonts keep their own licences (see `public/vendor/LICENSE-*` and `public/fonts/LICENSE-*`): jsPDF, fflate, exifr, SparkMD5, Tesseract.js (Apache-2.0), Bricolage Grotesque, Readex Pro and Noto Sans Arabic (OFL), and DejaVu fonts. The Proofline logo belongs to us.
