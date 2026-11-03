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
- **The limits, stated honestly:**
  - Free OpenRouter models may log prompts. The app warns about this.
  - Redaction is pattern-based and can miss names the user didn't list.
  - A fingerprint proves a file hasn't changed since it was sealed, not that it was genuine when captured.
  - DeepShield is a separate site: files checked there are uploaded to its server. The app says so.

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

## Before real users rely on it

- [ ] Re-verify the directory and platform guides (`DIRECTORY_LAST_CHECKED` and `GUIDES_LAST_CHECKED` in `public/js/data.js`). Three entries are flagged in the app: Saudi Arabia's 1909, Egypt's Ministry of Health lines, and the Telegram abuse email.
- [ ] Have a native Arabic speaker, ideally from a frontline organisation, review the Arabic wording, especially in the guides and the PDF.
- [ ] Confirm the OpenRouter model is live, and check its data policy.
- [ ] Ask DeepShield to publish how it handles uploaded files, so users can decide what to check there.
- [ ] Test with survivors and frontline organisations, and get legal review per country.
- [ ] Add rate limiting to `/api/refine` (for example Vercel Firewall rules).

## Sources

- UN Women (2025), [How AI is exacerbating technology-facilitated violence against women and girls](https://www.unwomen.org/en/digital-library/publications/2025/12/how-ai-is-exacerbating-technology-facilitated-violence-against-women-and-girls)
- Stevens et al. (2024), [A critical analysis of GBV reporting and evidence building applications](https://doi.org/10.3389/fpsyg.2023.1289817), Frontiers in Psychology
- [StopNCII.org industry partners](https://stopncii.org/partners/industry-partners)
- [UAE Federal Decree-Law No. 34 of 2021 on Countering Rumours and Cybercrimes](https://u.ae/en/information-and-services/justice-safety-and-the-law/cyber-safety-and-digital-security/law-on-combatting-rumours-and-cybercrimes)
- [DeepShield AI](https://deepshield-ai-359228671407.us-central1.run.app/), developed by Aqsa Khan, Girl Up Emirates leader
- Every directory entry in the app shows its own source link.

## Licences

Bundled third-party code and fonts keep their own licences (see `public/vendor/LICENSE-*` and `public/fonts/LICENSE-*`): jsPDF, fflate, exifr, SparkMD5, Tesseract.js (Apache-2.0), Bricolage Grotesque, Readex Pro and Noto Sans Arabic (OFL), and DejaVu fonts. The Proofline logo belongs to its creators.
